/*
  ============================================================
  CARD SCHEMA  (one shape for every card)
  ============================================================
  name           Card title
  description    Card text
  media_type     "image" | "video" | "auto"     (auto = detect from extension)
                 Media is always shown 16:9 landscape.
  media_url      Preview (image, mp4/webm, or a YouTube link -> thumbnail)
  poster_url     Optional poster for video previews (can be omitted)
  badge_text     "" = no badge   ("FREE", "25$", "Coming Soon" ...)
  badge_color    "red" | "green" | "blue" | "dark"
  buttons        Array of buttons (any number, each with its own color/icon)

  BUTTON SCHEMA
  ------------------------------------------------------------
  button_text         Label
  type                "link"  -> opens url (files like .jsx/.zip are downloaded)
                      "modal" -> opens url (or modal_media_url) in a popup player
  icon                Optional image path. Empty = built-in icon for the type
  button_color        "green" | "red" | "blue" | "dark" | "light" (default)
  url                 link : target.   Empty => button is disabled
                      modal: video/image to play. Empty => button is removed
  modal_title         modal only ("" = card name)
  modal_description   modal only ("" = card description)
  modal_media_url     modal only, overrides url when set (YouTube, mp4/webm, image)
  ============================================================
*/

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




const data = [
  {
    button_name: "Products",
    header_logo: "assets/images/ae.png",
    title: "Tools & Products for After Effects",
    subtitle: "Explore creative tools and resources designed to improve your workflow.",
    cards: [
      {
        name: "DJ Subtitle",
        description: "For testing the script and using it with standard subtitles, you can use this template.",
        media_type: "image",
        media_url: "assets/images/dj-subtitle.jpg",
        badge_text: "15$",
        badge_color: "dark-border",
        buttons: [
          {
            button_text: "Read More",
            type: "link",
            icon: "",
            button_color: "dark",
            url: "https://scriptdigger.github.io/DJ-Subtitle/",
            modal_title: "",
            modal_description: "",
            modal_media_url: ""
          }
          , {
            button_text: "Watch",
            type: "modal",
            icon: "",
            button_color: "purple",
            url: "https://youtu.be/7c7NmvvK9KM",
            modal_title: "",
            modal_description: "",
            modal_media_url: ""
          }
        ]
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
        name: "Property Randomizer",
        description: "Advanced Property Randomizer is an After Effects script that randomizes selected property values using Relative or Absolute modes, with axis controls for precise customization.",
        media_type: "image",
        media_url: "assets/products/Property-Randomizer/property-randomizer.jpg",
        badge_text: "FREE",
        badge_color: "green-border",
        buttons: [
          {
            button_text: "Download",
            type: "link",
            icon: "",
            button_color: "green",
            url: "assets/products/Property-Randomizer/Property-Randomizer.jsx",
            modal_title: "",
            modal_description: "",
            modal_media_url: ""
          }
        ]
      },
      {
        name: "Add Bulk Marker",
        description: "Add multiple After Effects markers at once by entering one comment per line, then apply them to the selected layers or directly to the composition.",
        media_type: "image",
        media_url: "assets/products/Add-Bulk-Marker/Add-Bulk-Marker.jpg",
        badge_text: "FREE",
        badge_color: "green-border",
        buttons: [
          {
            button_text: "Download",
            type: "link",
            icon: "",
            button_color: "green",
            url: "assets/products/Add-Bulk-Marker/Add-Bulk-Marker.jsx",
            modal_title: "",
            modal_description: "",
            modal_media_url: ""
          }
        ]
      },
      {
        name: "Project Font Changer",
        description: "Search and replace fonts across a selected composition or the entire After Effects project.",
        media_type: "image",
        media_url: "assets/products/Project-Font-Changer/Project-Font-Changer.png",
        badge_text: "FREE",
        badge_color: "green-border",
        buttons: [
          {
            button_text: "Download",
            type: "link",
            icon: "",
            button_color: "green",
            url: "assets/products/Project-Font-Changer/Project-Font-Changer.jsx",
            modal_title: "",
            modal_description: "",
            modal_media_url: ""
          }
        ]
      },
      {
        name: "Comps List Renamer",
        description: "Quickly export and edit selected After Effects project item names in a text list, then apply the new names in seconds.",
        media_type: "image",
        media_url: "assets/products/Comps-List-Renamer/Comps-List-Renamer.png",
        badge_text: "FREE",
        badge_color: "green-border",
        buttons: [
          {
            button_text: "Download",
            type: "link",
            icon: "",
            button_color: "green",
            url: "assets/products/Comps-List-Renamer/Comps-List-Renamer.jsx",
            modal_title: "",
            modal_description: "",
            modal_media_url: ""
          }
        ]
      },
      {
        name: "Fix All Expression",
        description: "Refreshes expressions across all compositions and layers in an After Effects project.",
        media_type: "image",
        media_url: "assets/products/Fix-All-Expression/Fix-All-Expression.png",
        badge_text: "FREE",
        badge_color: "green-border",
        buttons: [
          {
            button_text: "Download",
            type: "link",
            icon: "",
            button_color: "green",
            url: "assets/products/Fix-All-Expression/Fix-All-Expression.jsx",
            modal_title: "",
            modal_description: "",
            modal_media_url: ""
          }
        ]
      },
      {
        name: "Convert Orientation to Rotation",
        description: "Convert 3D Layer Orientation into X, Y, and Z Rotation values while preserving the original 3D direction as closely as possible.",
        media_type: "image",
        media_url: "assets/products/Convert-Orientation-to-Rotation/Convert-Orientation-to-Rotation.png",
        badge_text: "FREE",
        badge_color: "green-border",
        buttons: [
          {
            button_text: "Download",
            type: "link",
            icon: "",
            button_color: "green",
            url: "assets/products/Convert-Orientation-to-Rotation/Convert-Orientation-to-Rotation.jsx",
            modal_title: "",
            modal_description: "",
            modal_media_url: ""
          }
        ]
      }    ,  {
        name: "Selected Layer Names",
        description: "Quickly view, edit, and rename multiple selected layers in After Effects.",
        media_type: "image",
        media_url: "assets/products/Selected-Layer-Names/Selected-Layer-Names.png",
        badge_text: "FREE",
        badge_color: "green-border",
        buttons: [
          {
            button_text: "Download",
            type: "link",
            icon: "",
            button_color: "green",
            url: "assets/products/Selected-Layer-Names/Selected-Layer-Names.jsx",
            modal_title: "",
            modal_description: "",
            modal_media_url: ""
          }
        ]
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
        name: "Getting Started with DJ Subtitle",
        description: "A quick walkthrough of installing and using the script.",
        media_type: "image",
        media_url: "assets/images/dj-subtitle.jpg",
        badge_text: "",
        badge_color: "",
        buttons: [
          {
            button_text: "Watch Tutorial",
            type: "modal",
            icon: "",
            button_color: "purple",
            url: "",
            modal_title: "Getting Started with DJ Subtitle",
            modal_description: "Learn how to install the script and style your first subtitles.",
            modal_media_url: "https://youtu.be/7c7NmvvK9KM"
          }
        ]
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
        name: "Getting Started with DJ Subtitle",
        description: "A quick walkthrough of installing and using the script.",
        media_type: "image",
        media_url: "assets/images/dj-subtitle.jpg",
        badge_text: "",
        badge_color: "",
        buttons: [
          {
            button_text: "Watch Tutorial",
            type: "modal",
            icon: "",
            button_color: "purple",
            url: "",
            modal_title: "Getting Started with DJ Subtitle",
            modal_description: "Learn how to install the script and style your first subtitles.",
            modal_media_url: "https://youtu.be/7c7NmvvK9KM"
          }
        ]
      }
    ]
  }
];




