/*
  ============================================================
  CARD SCHEMA  (every card uses exactly these keys)
  ============================================================
  style              "wide_image_card" | "downloadable" | "embedded-player-modal"

  name               Card title
  description        Card text

  media_type         "image" | "video" | "auto"   (auto = detect from file extension)
  media_url          Preview shown on the card (image or mp4/webm)
  poster_url         Optional poster for video previews

  badge_text         Badge on the media ("25$", "FREE", "Coming Soon"...). "" = no badge
  badge_color        "red" | "green" | "blue" | "dark"

  button_text        Button label ("" = default for the style)
  button_color       CSS class added to the button (e.g. "download")
  url                wide_image_card        -> page that opens in a new tab
                     downloadable           -> file that gets downloaded ("" = Coming Soon)
                     embedded-player-modal  -> (not used, leave "")

  modal_title        embedded-player-modal only ("" = use name)
  modal_description  embedded-player-modal only ("" = use description)
  modal_media_url    embedded-player-modal only: YouTube link OR mp4/webm OR image

  Unused keys can stay as "" — the script fills defaults.
  ============================================================
*/



const data = [
  {
    button_name: "Products",
    header_logo: "assets/images/ae.png",
    title: "Tools & Products for After Effects",
    subtitle: "Explore creative tools and resources designed to improve your workflow.",
    cards: [
      {
        style: "wide_image_card",
        name: "DJ Subtitle",
        description: "For testing the script and using it with standard subtitles, you can use this template.",
        media_type: "image",
        media_url: "assets/images/dj-subtitle.jpg",
        poster_url: "",
        badge_text: "15$",
        badge_color: "red",
        button_text: "Read More",
        button_color: "download",
        url: "https://scriptdigger.github.io/DJ-Subtitle/",
        modal_title: "",
        modal_description: "",
        modal_media_url: ""
      }
    ]
  },
  {
    button_name: "Free Tools",
    header_logo: "assets/images/box.png",
    title: "Free Tools for After Effects",
    subtitle: "Discover useful free scripts and tools to make your workflow easier.",
    cards: [
      {
        style: "downloadable",
        name: "Property Randomizer",
        description: "Advanced Property Randomizer is an After Effects script that randomizes selected property values using Relative or Absolute modes, with axis controls for precise customization.",
        media_type: "image",
        media_url: "assets/products/Property-Randomizer/property-randomizer.jpg",
        poster_url: "",
        badge_text: "FREE",
        badge_color: "green",
        button_text: "Download",
        button_color: "green",
        url: "assets/products/Property-Randomizer/Property-Randomizer.jsx",            // empty => "Coming Soon"
        modal_title: "",
        modal_description: "",
        modal_media_url: ""
      },  {
        style: "downloadable",
        name: "Add Bulk Marker",
        description: "Add multiple After Effects markers at once by entering one comment per line, then apply them to the selected layers or directly to the composition.",
        media_type: "image",
        media_url: "assets/products/Add-Bulk-Marker/Add-Bulk-Marker.jpg",
        poster_url: "",
        badge_text: "FREE",
        badge_color: "green",
        button_text: "Download",
        button_color: "green",
        url: "assets/products/Add-Bulk-Marker/Add-Bulk-Marker.jsx",            // empty => "Coming Soon"
        modal_title: "",
        modal_description: "",
        modal_media_url: ""
      }

    ]
  },
  {
    button_name: "Tutorials",
    header_logo: "assets/images/video.webp",
    title: "Learn with Tutorials",
    subtitle: "Follow step-by-step guides, learn new techniques, and get more out of your tools.",
    cards: [
      {
        style: "embedded-player-modal",
        name: "Getting Started with DJ Subtitle",
        description: "A quick walkthrough of installing and using the script.",
        media_type: "image",
        media_url: "assets/images/dj-subtitle.jpg",
        poster_url: "",
        badge_text: "",
        badge_color: "",
        button_text: "Watch Tutorial",
        button_color: "",
        url: "",
        modal_title: "Getting Started with DJ Subtitle",
        modal_description: "Learn how to install the script and style your first subtitles.",
        modal_media_url: "https://youtu.be/7c7NmvvK9KM"
      }
    ]
  }
];




const helpGuide = {
  introduction: "New to the workflow? Start with a tutorial below for practical guidance, tips, and step-by-step walkthroughs.",
  tutorials: [
    {
      title: "Blue Pixel Box on YouTube",
      button_text: "Visit Our YouTube Channel",
      description: "Explore tutorials, creative workflows, and useful tips for Adobe After Effects and motion graphics.",
      url: "https://www.youtube.com/@bluepixelbox"
    },
    {
      title: "Have an account On Envato Elements?",
      button_text: "Start Download",
      description: "Download all our projects and build your next project with BluePixelBox.",
      url: "https://elements.envato.com/user/BluePixelBox/video-templates"
    }
  ]
};