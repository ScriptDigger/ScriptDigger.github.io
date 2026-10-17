

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

    const icons = {
      play: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m9 6 10 6-10 6z"></path></svg>',
      image: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="3" y="3" width="18" height="18" rx="3"></rect><circle cx="8.5" cy="8.5" r="1.5"></circle><path d="m21 15-5-5L5 21"></path></svg>',
      external: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M14 4h6v6"></path><path d="m20 4-9 9"></path><path d="M18 13v5a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h5"></path></svg>'
    };

    function makeElement(tag, className, text) {
      const element = document.createElement(tag);
      if (className) element.className = className;
      if (text !== undefined && text !== null) element.textContent = String(text);
      return element;
    }

    function safeUrl(value) {
      if (typeof value !== "string" || !value.trim()) return "";
      const trimmed = value.trim();
      // Permit HTTP(S) resources and relative local asset paths; reject script/data URLs.
      if (/^(https?:\/\/|\/|\.{1,2}\/|assets\/)/i.test(trimmed)) return trimmed;
      return "";
    }

    function createPlaceholder(message, kind) {
      const placeholder = makeElement("div", "media-placeholder");
      placeholder.innerHTML = kind === "image" ? icons.image : icons.play;
      placeholder.appendChild(makeElement("span", "", message));
      return placeholder;
    }

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

      const allCards = Array.isArray(section.cards) ? section.cards : [];
      const filteredCards = allCards.filter(card => {
        const haystack = `${card.name || ""} ${card.description || ""}`.toLocaleLowerCase();
        return haystack.includes(searchTerm);
      });

      resultCount.textContent = `${filteredCards.length} ${filteredCards.length === 1 ? "resource" : "resources"}`;
      if (!filteredCards.length) {
        const title = allCards.length ? "No matching resources" : "No resources yet";
        const message = allCards.length ? "Try another search term." : "Add cards to this section in the data array.";
        cardsElement.appendChild(createEmptyState(title, message));
        return;
      }

      filteredCards.forEach(card => cardsElement.appendChild(createCard(card, section.card_style)));
    }

    function createEmptyState(title, message) {
      const state = makeElement("div", "empty-state");
      state.appendChild(makeElement("strong", "", title));
      state.appendChild(makeElement("span", "", message));
      return state;
    }

    function createCard(card, style) {
      const article = makeElement("article", "resource-card");

      const isDownloadable = style === "downloadable";
      const previewUrl = safeUrl(card.preview_url || card.url);

      // Detect video previews by their file extension or explicit setting.
      const previewIsVideo = card.preview_type === "video" ||
        (!card.preview_type &&
          /\.(mp4|webm|ogv)(?:[?#].*)?$/i.test(previewUrl));

      const isVideo = style === "video_card" ||
        (isDownloadable && previewIsVideo);

      const isImage = style === "wide_image_card" ||
        (isDownloadable && !previewIsVideo);

      const mediaFrame = makeElement(
        "div",
        `media-frame${isImage ? " wide-image" : ""}`
      );


      if (isDownloadable) {
        const rawPrice = String(card.price ?? "free").trim();
        const isFree = rawPrice.toLowerCase() === "free";
        const commingsoon = rawPrice.toLowerCase() === "Comming Soon";

        const badge = makeElement(
          "span",
          `media-price-badge${isFree ? " free" : ""}`,
          isFree ? "FREE" : rawPrice
        );

        mediaFrame.appendChild(badge);
      }


      if (previewUrl && isVideo) {
        const video = document.createElement("video");
        video.muted = true;
        video.loop = true;
        video.controls = false;

        video.autoplay = true;
        video.playsInline = true;
        video.preload = "metadata";
        video.setAttribute("aria-label", `${card.name || "Resource"} video preview`);
        video.src = previewUrl;
        video.addEventListener("mouseenter", () => {
          const playPromise = video.play();
          if (playPromise && typeof playPromise.catch === "function") playPromise.catch(() => { });
        });
        // video.addEventListener("mouseleave", () => {
        //   video.pause();
        //   try { video.currentTime = 0; } catch (_) {}
        // });
        // video.addEventListener("focus", () => {
        //   const playPromise = video.play();
        //   if (playPromise && typeof playPromise.catch === "function") playPromise.catch(() => {});
        // });
        // video.addEventListener("blur", () => {
        //   video.pause();
        //   try { video.currentTime = 0; } catch (_) {}
        // });
        video.addEventListener("error", () => {
          if (video.isConnected) {
            const placeholder = createPlaceholder("Video preview unavailable", "video");
            video.replaceWith(placeholder);
          }
        }, { once: true });
        video.tabIndex = 0;
        mediaFrame.appendChild(video);
      } else if (previewUrl && isImage) {
        const image = document.createElement("img");
        image.src = previewUrl;
        image.alt = card.name ? `${card.name} preview` : "Resource preview";
        image.loading = "lazy";
        image.addEventListener("error", () => {
          if (image.isConnected) image.replaceWith(createPlaceholder("Image preview unavailable", "image"));
        }, { once: true });
        mediaFrame.appendChild(image);
      } else {
        mediaFrame.appendChild(createPlaceholder("Preview not available", isImage ? "image" : "video"));
      }

      const body = makeElement("div", "card-body");
      body.appendChild(makeElement("h3", "card-title", card.name || "Untitled resource"));
      body.appendChild(makeElement("p", "card-description", card.description || "No description available."));

      const resourceUrl = safeUrl(card.url);



      // Show price only for downloadable cards.
      if (isDownloadable) {
        const meta = makeElement("div", "download-card-meta");
        const rawPrice = String(card.price ?? "free").trim();
        const isFree = rawPrice.toLowerCase() === "free";

        const priceBadge = makeElement(
          "span",
          `price-badge${isFree ? " free" : ""}`,
          isFree ? "FREE" : rawPrice
        );


        body.appendChild(meta);
      }

      if (resourceUrl) {
        const link = makeElement(
          "a",
          isDownloadable ? "download-link" : "resource-link"
        );

        link.href = resourceUrl;
        link.target = "_blank";
        link.rel = "noopener noreferrer";

        if (isDownloadable) {
          link.download = "";
          link.appendChild(document.createTextNode("Download"));
          const iconHolder = makeElement("span");
          iconHolder.innerHTML =
            '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><path d="m7 10 5 5 5-5"></path><path d="M12 15V3"></path></svg>';
          link.appendChild(iconHolder);
        } else {
          link.appendChild(document.createTextNode("Open resource"));
          const iconHolder = makeElement("span");
          iconHolder.innerHTML = icons.external;
          link.appendChild(iconHolder);
        }

        body.appendChild(link);
      } else {
        const unavailable = makeElement(
          "span",
          "resource-link",
          isDownloadable ? "Coming Soon" : "Resource link unavailable"
        );
        unavailable.setAttribute("aria-disabled", "true");
        unavailable.style.opacity = ".55";
        body.appendChild(unavailable);
      }


      article.append(mediaFrame, body);
      return article;
    }

    function renderTutorials() {
      const tutorials = Array.isArray(helpGuide.tutorials) ? helpGuide.tutorials : [];
      helpIntro.textContent = helpGuide.introduction || "";
      tutorialsElement.replaceChildren();

      if (!tutorials.length) {
        tutorialsElement.appendChild(createEmptyState("No tutorials available", "Add tutorial entries to the helpGuide.tutorials array."));
        return;
      }

    

tutorials.forEach(function(tutorial) {
  var item = makeElement("article", "tutorial");

  var icon = makeElement("div", "tutorial-icon");
  icon.innerHTML = icons.play;

  var content = makeElement("div", "tutorial-content");

  content.appendChild(
    makeElement("h3", "tutorial-title", tutorial.title || "Tutorial")
  );

  content.appendChild(
    makeElement("p", "tutorial-description", tutorial.description || "")
  );

  var url = safeUrl(tutorial.url);

  if (url) {
    var link = makeElement("a", "tutorial-link");

    link.href = url;
    link.target = "_blank";
    link.rel = "noopener noreferrer";

    link.appendChild(
      document.createTextNode(
        tutorial.button_text || "Learn More"
      )
    );

    var externalIcon = makeElement("span");
    externalIcon.innerHTML = icons.external;

    link.appendChild(externalIcon);
    content.appendChild(link);

  } else {
    var unavailable = makeElement(
      "span",
      "tutorial-link",
      tutorial.button_text || "Link unavailable"
    );

    unavailable.setAttribute("aria-disabled", "true");
    unavailable.style.opacity = ".55";

    content.appendChild(unavailable);
  }

  item.appendChild(icon);
  item.appendChild(content);

  tutorialsElement.appendChild(item);
});








    }

    searchInput.addEventListener("input", event => {
      searchTerm = event.target.value.trim().toLocaleLowerCase();
      renderSection();
    });

    renderTabs();
    renderSection();
    renderTutorials();
