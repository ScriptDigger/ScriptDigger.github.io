const tabsElement = document.getElementById("tabs");
const sectionLogo = document.getElementById("section-logo");
const sectionTitle = document.getElementById("section-title");
const sectionSubtitle = document.getElementById("section-subtitle");
const cardsElement = document.getElementById("cards");
const searchInput = document.getElementById("search");
const resultCount = document.getElementById("result-count");
const tutorialsElement = document.getElementById("tutorials");
const helpIntro = document.getElementById("help-intro");

let activeSectionIndex = 0;
let searchTerm = "";

/* ------------------------------------------------------------------ */
/* Constants                                                           */
/* ------------------------------------------------------------------ */

const CARD_STYLES = ["wide_image_card", "downloadable", "embedded-player-modal"];

const CARD_DEFAULTS = {
  style: "wide_image_card",
  name: "",
  description: "",
  media_type: "auto",
  media_url: "",
  poster_url: "",
  badge_text: "",
  badge_color: "red",
  button_text: "",
  button_color: "",
  url: "",
  modal_title: "",
  modal_description: "",
  modal_media_url: ""
};

const DEFAULT_BUTTON_TEXT = {
  "wide_image_card": "Open resource",
  "downloadable": "Download",
  "embedded-player-modal": "Watch now"
};

const icons = {
  play: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m9 6 10 6-10 6z"></path></svg>',
  image: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="3" y="3" width="18" height="18" rx="3"></rect><circle cx="8.5" cy="8.5" r="1.5"></circle><path d="m21 15-5-5L5 21"></path></svg>',
  external: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M14 4h6v6"></path><path d="m20 4-9 9"></path><path d="M18 13v5a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h5"></path></svg>',
  download: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><path d="m7 10 5 5 5-5"></path><path d="M12 15V3"></path></svg>',
  close: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="M6 6l12 12M18 6 6 18"></path></svg>'
};

/* ------------------------------------------------------------------ */
/* Helpers                                                             */
/* ------------------------------------------------------------------ */

function makeElement(tag, className, text) {
  const element = document.createElement(tag);
  if (className) element.className = className;
  if (text !== undefined && text !== null) element.textContent = String(text);
  return element;
}

function safeUrl(value) {
  if (typeof value !== "string" || !value.trim()) return "";
  const trimmed = value.trim();
  if (/^(https?:\/\/|\/|\.{1,2}\/|assets\/)/i.test(trimmed)) return trimmed;
  return "";
}

function isVideoFile(url) {
  return /\.(mp4|webm|ogv)(?:[?#].*)?$/i.test(url);
}

function getYouTubeId(url) {
  const match = String(url).match(
    /(?:youtube(?:-nocookie)?\.com\/(?:watch\?(?:.*&)?v=|embed\/|shorts\/|live\/)|youtu\.be\/)([\w-]{11})/i
  );
  return match ? match[1] : "";
}

/* Resolve a media field into { kind: "image" | "video" | "youtube", src } */
function resolveMedia(url, type) {
  const src = safeUrl(url);
  if (!src) return { kind: "none", src: "" };
  const yt = getYouTubeId(src);
  if (yt) return { kind: "youtube", src, id: yt };
  if (type === "video") return { kind: "video", src };
  if (type === "image") return { kind: "image", src };
  return { kind: isVideoFile(src) ? "video" : "image", src };
}

/* One normalisation point: every card leaves here with the same shape */
function normalizeCard(raw) {
  const card = Object.assign({}, CARD_DEFAULTS);
  Object.keys(CARD_DEFAULTS).forEach(key => {
    if (raw && raw[key] !== undefined && raw[key] !== null) card[key] = String(raw[key]).trim();
  });
  if (!CARD_STYLES.includes(card.style)) card.style = CARD_DEFAULTS.style;
  if (!["image", "video", "auto"].includes(card.media_type)) card.media_type = "auto";
  if (/^free$/i.test(card.badge_text) && !raw.badge_color) card.badge_color = "green";
  return card;
}

/* ------------------------------------------------------------------ */
/* Media                                                               */
/* ------------------------------------------------------------------ */

function createPlaceholder(message, kind) {
  const placeholder = makeElement("div", "media-placeholder");
  placeholder.innerHTML = kind === "image" ? icons.image : icons.play;
  placeholder.appendChild(makeElement("span", "", message));
  return placeholder;
}

function createPreviewVideo(src, poster, label) {
  const video = document.createElement("video");
  video.muted = true;
  video.loop = true;
  video.controls = false;
  video.playsInline = true;
  video.preload = "metadata";
  video.tabIndex = 0;
  video.setAttribute("aria-label", label);
  if (poster) video.poster = poster;
  video.src = src;

  const play = () => {
    const p = video.play();
    if (p && typeof p.catch === "function") p.catch(() => {});
  };
  // Play only while visible (saves CPU with many cards)
  if ("IntersectionObserver" in window) {
    new IntersectionObserver(entries => {
      entries.forEach(entry => (entry.isIntersecting ? play() : video.pause()));
    }, { threshold: 0.4 }).observe(video);
  } else {
    video.autoplay = true;
  }
  video.addEventListener("mouseenter", play);
  video.addEventListener("error", () => {
    if (video.isConnected) video.replaceWith(createPlaceholder("Video preview unavailable", "video"));
  }, { once: true });
  return video;
}

function createPreviewImage(src, alt) {
  const image = document.createElement("img");
  image.src = src;
  image.alt = alt;
  image.loading = "lazy";
  image.addEventListener("error", () => {
    if (image.isConnected) image.replaceWith(createPlaceholder("Image preview unavailable", "image"));
  }, { once: true });
  return image;
}

function buildMediaFrame(card) {
  const frame = makeElement("div", "media-frame wide-image");
  const label = card.name || "Resource";
  const media = resolveMedia(card.media_url, card.media_type);
  const poster = safeUrl(card.poster_url);

  if (media.kind === "video") {
    frame.appendChild(createPreviewVideo(media.src, poster, `${label} video preview`));
  } else if (media.kind === "image") {
    frame.appendChild(createPreviewImage(media.src, `${label} preview`));
  } else if (media.kind === "youtube") {
    // A YouTube link used as the card preview -> use its thumbnail
    frame.appendChild(createPreviewImage(`https://i.ytimg.com/vi/${media.id}/hqdefault.jpg`, `${label} preview`));
  } else {
    frame.appendChild(createPlaceholder("Preview not available", "image"));
  }

  if (card.style === "embedded-player-modal") {
    const overlay = makeElement("span", "media-play-overlay");
    overlay.innerHTML = icons.play;
    overlay.setAttribute("aria-hidden", "true");
    frame.appendChild(overlay);
  }

  if (card.badge_text) {
    const color = card.badge_color ? ` badge-${card.badge_color}` : "";
    const free = /^free$/i.test(card.badge_text) ? " free" : "";
    frame.appendChild(makeElement("span", `media-price-badge${free}${color}`, card.badge_text));
  }
  return frame;
}

/* ------------------------------------------------------------------ */
/* Modal player                                                        */
/* ------------------------------------------------------------------ */

let modalEl = null;
let lastFocused = null;

function ensureModal() {
  if (modalEl) return modalEl;

  modalEl = makeElement("div", "player-modal");
  modalEl.hidden = true;
  modalEl.setAttribute("role", "dialog");
  modalEl.setAttribute("aria-modal", "true");
  modalEl.setAttribute("aria-labelledby", "player-modal-title");

  const backdrop = makeElement("div", "player-modal-backdrop");
  const dialog = makeElement("div", "player-modal-dialog");

  const closeBtn = makeElement("button", "player-modal-close");
  closeBtn.type = "button";
  closeBtn.setAttribute("aria-label", "Close");
  closeBtn.innerHTML = icons.close;

  const stage = makeElement("div", "player-modal-stage");
  const info = makeElement("div", "player-modal-info");
  const title = makeElement("h3", "player-modal-title");
  title.id = "player-modal-title";
  const desc = makeElement("p", "player-modal-description");
  info.append(title, desc);

  dialog.append(closeBtn, stage, info);
  modalEl.append(backdrop, dialog);
  document.body.appendChild(modalEl);

  backdrop.addEventListener("click", closeModal);
  closeBtn.addEventListener("click", closeModal);
  document.addEventListener("keydown", event => {
    if (!modalEl.hidden && event.key === "Escape") closeModal();
  });
  return modalEl;
}

function openModal(card) {
  const modal = ensureModal();
  const stage = modal.querySelector(".player-modal-stage");
  stage.replaceChildren();

  modal.querySelector(".player-modal-title").textContent = card.modal_title || card.name;
  const descText = card.modal_description || card.description;
  const descEl = modal.querySelector(".player-modal-description");
  descEl.textContent = descText;
  descEl.hidden = !descText;

  // Fallback chain: modal media -> card preview media
  const media = resolveMedia(card.modal_media_url || card.media_url, "auto");

  if (media.kind === "youtube") {
    const iframe = document.createElement("iframe");
    iframe.src = `https://www.youtube-nocookie.com/embed/${media.id}?autoplay=1&rel=0`;
    iframe.title = card.modal_title || card.name || "Video player";
    iframe.allow = "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen";
    iframe.allowFullscreen = true;
    iframe.referrerPolicy = "strict-origin-when-cross-origin";
    stage.appendChild(iframe);
  } else if (media.kind === "video") {
    const video = document.createElement("video");
    video.src = media.src;
    video.controls = true;
    video.autoplay = true;
    video.playsInline = true;
    stage.appendChild(video);
  } else if (media.kind === "image") {
    stage.appendChild(createPreviewImage(media.src, card.name || "Preview"));
  } else {
    stage.appendChild(createPlaceholder("Nothing to play yet", "video"));
  }

  lastFocused = document.activeElement;
  modal.hidden = false;
  document.body.classList.add("modal-open");
  modal.querySelector(".player-modal-close").focus();
}

function closeModal() {
  if (!modalEl || modalEl.hidden) return;
  modalEl.hidden = true;
  modalEl.querySelector(".player-modal-stage").replaceChildren(); // stops playback
  document.body.classList.remove("modal-open");
  if (lastFocused && typeof lastFocused.focus === "function") lastFocused.focus();
}

/* ------------------------------------------------------------------ */
/* Cards                                                               */
/* ------------------------------------------------------------------ */

function createEmptyState(title, message) {
  const state = makeElement("div", "empty-state");
  state.appendChild(makeElement("strong", "", title));
  state.appendChild(makeElement("span", "", message));
  return state;
}

function buildActionButton(card) {
  const label = card.button_text || DEFAULT_BUTTON_TEXT[card.style];
  const resourceUrl = safeUrl(card.url);
  const colorClass = card.button_color ? ` ${card.button_color}` : "";
  let action;

  if (card.style === "embedded-player-modal") {
    action = makeElement("button", `resource-link${colorClass}`);
    action.type = "button";
    action.appendChild(document.createTextNode(label));
    const holder = makeElement("span");
    holder.innerHTML = icons.play;
    action.appendChild(holder);
    action.addEventListener("click", () => openModal(card));
    return action;
  }

  if (!resourceUrl) {
    action = makeElement(
      "span",
      `resource-link${colorClass}`,
      card.style === "downloadable" ? "Coming Soon" : "Resource link unavailable"
    );
    action.setAttribute("aria-disabled", "true");
    action.style.opacity = ".55";
    return action;
  }

  if (card.style === "downloadable") {
    action = makeElement("a", `download-link${colorClass}`);
    action.href = resourceUrl;
    action.download = "";
    action.appendChild(document.createTextNode(label));
    const holder = makeElement("span");
    holder.innerHTML = icons.download;
    action.appendChild(holder);
  } else {
    action = makeElement("a", `resource-link${colorClass}`);
    action.href = resourceUrl;
    action.appendChild(document.createTextNode(label));
    const holder = makeElement("span");
    holder.innerHTML = icons.external;
    action.appendChild(holder);
  }
  action.target = "_blank";
  action.rel = "noopener noreferrer";
  return action;
}

function createCard(rawCard) {
  const card = normalizeCard(rawCard);
  const article = makeElement("article", `resource-card card-${card.style}`);
  article.dataset.style = card.style;

  const mediaFrame = buildMediaFrame(card);
  const body = makeElement("div", "card-body");
  body.appendChild(makeElement("h3", "card-title", card.name || "Untitled resource"));
  body.appendChild(makeElement("p", "card-description", card.description || "No description available."));
  body.appendChild(buildActionButton(card));

  // Modal cards: the whole media area is clickable too
  if (card.style === "embedded-player-modal") {
    mediaFrame.classList.add("is-clickable");
    mediaFrame.tabIndex = 0;
    mediaFrame.setAttribute("role", "button");
    mediaFrame.setAttribute("aria-label", `Play ${card.name}`);
    mediaFrame.addEventListener("click", () => openModal(card));
    mediaFrame.addEventListener("keydown", event => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        openModal(card);
      }
    });
  }

  article.append(mediaFrame, body);
  return article;
}

/* ------------------------------------------------------------------ */
/* Sections / tabs                                                     */
/* ------------------------------------------------------------------ */

function renderTabs() {
  tabsElement.replaceChildren();
  data.forEach((section, index) => {
    const tab = makeElement("button", "tab", section.button_name || section.title || `Section ${index + 1}`);
    tab.type = "button";
    tab.id = `catalog-tab-${index}`;
    tab.setAttribute("role", "tab");
    tab.setAttribute("aria-controls", "section-content");
    tab.setAttribute("aria-selected", String(index === activeSectionIndex));
    tab.tabIndex = index === activeSectionIndex ? 0 : -1;
    tab.addEventListener("click", () => selectSection(index));
    tab.addEventListener("keydown", event => {
      if (event.key !== "ArrowRight" && event.key !== "ArrowLeft") return;
      event.preventDefault();
      const direction = event.key === "ArrowRight" ? 1 : -1;
      const nextIndex = (index + direction + data.length) % data.length;
      selectSection(nextIndex);
      const nextTab = tabsElement.querySelector(`#catalog-tab-${nextIndex}`);
      if (nextTab) nextTab.focus();
    });
    tabsElement.appendChild(tab);
  });
}

function selectSection(index) {
  if (!data.length) return;
  activeSectionIndex = index;
  searchTerm = "";
  searchInput.value = "";
  renderTabs();
  renderSection();
}

function renderSection() {
  const section = data[activeSectionIndex];
  cardsElement.replaceChildren();

  if (!section) {
    sectionTitle.textContent = "No sections available";
    sectionSubtitle.textContent = "Add a section to the data array to begin.";
    sectionLogo.hidden = true;
    resultCount.textContent = "0 resources";
    cardsElement.appendChild(createEmptyState("No catalog sections", "Add a section to the data array to display resources."));
    return;
  }

  sectionTitle.textContent = section.title || section.button_name || "Resources";
  sectionSubtitle.innerHTML = section.subtitle || "";
  const logoUrl = safeUrl(section.header_logo);
  if (logoUrl) {
    sectionLogo.src = logoUrl;
    sectionLogo.alt = `${section.title || section.button_name || "Section"} logo`;
    sectionLogo.hidden = false;
    sectionLogo.onerror = () => { sectionLogo.hidden = true; };
  } else {
    sectionLogo.hidden = true;
  }

  const allCards = Array.isArray(section.cards) ? section.cards.map(normalizeCard) : [];
  const filteredCards = allCards.filter(card =>
    `${card.name} ${card.description}`.toLocaleLowerCase().includes(searchTerm)
  );

  resultCount.textContent = `${filteredCards.length} ${filteredCards.length === 1 ? "resource" : "resources"}`;
  if (!filteredCards.length) {
    const title = allCards.length ? "No matching resources" : "No resources yet";
    const message = allCards.length ? "Try another search term." : "Add cards to this section in the data array.";
    cardsElement.appendChild(createEmptyState(title, message));
    return;
  }

  filteredCards.forEach(card => cardsElement.appendChild(createCard(card)));
}

/* ------------------------------------------------------------------ */
/* Tutorials (help section)                                            */
/* ------------------------------------------------------------------ */

function renderTutorials() {
  const tutorials = Array.isArray(helpGuide.tutorials) ? helpGuide.tutorials : [];
  helpIntro.textContent = helpGuide.introduction || "";
  tutorialsElement.replaceChildren();

  if (!tutorials.length) {
    tutorialsElement.appendChild(createEmptyState("No tutorials available", "Add tutorial entries to the helpGuide.tutorials array."));
    return;
  }

  tutorials.forEach(tutorial => {
    const item = makeElement("article", "tutorial");
    const icon = makeElement("div", "tutorial-icon");
    icon.innerHTML = icons.play;

    const content = makeElement("div", "tutorial-content");
    content.appendChild(makeElement("h3", "tutorial-title", tutorial.title || "Tutorial"));
    content.appendChild(makeElement("p", "tutorial-description", tutorial.description || ""));

    const url = safeUrl(tutorial.url);
    if (url) {
      const link = makeElement("a", "tutorial-link");
      link.href = url;
      link.target = "_blank";
      link.rel = "noopener noreferrer";
      link.appendChild(document.createTextNode(tutorial.button_text || "Learn More"));
      const externalIcon = makeElement("span");
      externalIcon.innerHTML = icons.external;
      link.appendChild(externalIcon);
      content.appendChild(link);
    } else {
      const unavailable = makeElement("span", "tutorial-link", tutorial.button_text || "Link unavailable");
      unavailable.setAttribute("aria-disabled", "true");
      unavailable.style.opacity = ".55";
      content.appendChild(unavailable);
    }

    item.append(icon, content);
    tutorialsElement.appendChild(item);
  });
}

/* ------------------------------------------------------------------ */
/* Init                                                                */
/* ------------------------------------------------------------------ */

searchInput.addEventListener("input", event => {
  searchTerm = event.target.value.trim().toLocaleLowerCase();
  renderSection();
});

renderTabs();
renderSection();
renderTutorials();
