export interface DurationPackage {
  id: string;
  duration: string;
  price: string;
  features: string[];
}

export interface ServiceCard {
  id: string;
  title: string;
  features: string[];
  packages: DurationPackage[];
}

export interface CategoryData {
  id: string;
  name: string;
  cards: ServiceCard[];
}

export const servicesData: CategoryData[] = [
  {
    id: "personal",
    name: "Personal",
    cards: [
      {
        id: "residential-studio",
        title: "Residential Studio",
        features: [
          "10 hours studio access",
          "Professional lighting setup",
          "Multiple backdrop options",
          "Equipment usage(tripod, reflectors)",
          "Changing room & makeup area",
          "Free parking"
        ],
        packages: [
          { id: "p1", duration: "Full Day", price: "৳15,000", features: ["10 hours studio access", "Professional lighting setup", "Multiple backdrop options", "Equipment usage", "Changing room & makeup area", "Free parking"] },
          { id: "p2", duration: "Half Day", price: "৳8,000", features: ["6 hours studio access", "Basic lighting setup", "3 backdrop options", "Tripod & reflectors", "WiFi & electricity"] },
          { id: "p3", duration: "Per Hour", price: "৳1,500", features: ["Flexible hourly booking", "Minimum 2 hours required", "Basic lighting setup", "2 backdrop options", "Essential equipment"] }
        ]
      },
      {
        id: "roam-studio",
        title: "Roam Studio",
        features: [
          "Destination shooting",
          "Travel friendly setup",
          "Natural light production",
          "On - the go styling",
          "Skilled caravan team",
          "Special drone shoot"
        ],
        packages: [
          { id: "p4", duration: "Full Day", price: "৳20,000", features: ["Destination shooting", "Travel friendly setup", "Skilled caravan team", "Special drone shoot"] },
          { id: "p5", duration: "Half Day", price: "৳12,000", features: ["Natural light production", "On - the go styling", "Travel friendly setup"] }
        ]
      }
    ]
  },
  {
    id: "business",
    name: "Business",
    cards: [
      {
        id: "local-priority",
        title: "Local Priority Studio",
        features: [
          "Commercial lighting setup",
          "360-degre view shoot",
          "Bulk retouching and editing",
          "Custom props and backdrop",
          "Fast delivery timeline",
          "Bulk product photography"
        ],
        packages: [
          { id: "p6", duration: "Full Day", price: "৳25,000", features: ["Commercial lighting setup", "360-degre view shoot", "Bulk retouching and editing", "Custom props and backdrop"] },
          { id: "p7", duration: "Half Day", price: "৳15,000", features: ["Fast delivery timeline", "Bulk product photography", "Commercial lighting setup"] }
        ]
      },
      {
        id: "global-priority",
        title: "Global Priority Studio",
        features: [
          "Full day studio access",
          "Senior creative team",
          "4k commercial video shoot",
          "Makeup and VIP Green Room",
          "Complete post production",
          "Sound-proof set"
        ],
        packages: [
          { id: "p8", duration: "Full Day", price: "৳45,000", features: ["Full day studio access", "Senior creative team", "4k commercial video shoot", "Makeup and VIP Green Room", "Complete post production"] }
        ]
      },
      {
        id: "enterprise-studio",
        title: "Enterprise Studio",
        features: [
          "Multi camera podcast setup",
          "Sound-proof audio studio",
          "Audio gear (4-people)",
          "Live stream and broadcasting",
          "Video editing & shorts clips",
          "Refreshment & Parking facilities"
        ],
        packages: [
          { id: "p9", duration: "Full Day", price: "৳60,000", features: ["Multi camera podcast setup", "Sound-proof audio studio", "Live stream & broadcasting", "Full editing & shorts clips"] }
        ]
      }
    ]
  },
  {
    id: "animation",
    name: "Animation",
    cards: [
      {
        id: "2d-animation",
        title: "2D Animation Studio",
        features: [
          "Explainer video creation",
          "Custom 2D character design",
          "Storyboard & script layout",
          "Professional voice-over sync",
          "Monitor graphics & text ui",
          "Full HD 1080p video render"
        ],
        packages: [
          { id: "p10", duration: "Full Day", price: "৳18,000", features: ["Explainer video creation", "Custom 2D character design", "Storyboard & script layout", "Full HD 1080p video render"] },
          { id: "p11", duration: "Half Day", price: "৳10,000", features: ["Storyboard & script layout", "Professional voice-over sync", "Monitor graphics & text ui"] }
        ]
      },
      {
        id: "3d-product",
        title: "3D Product Studio",
        features: [
          "3D product modelling & render",
          "Realistic material & texturing",
          "360-degre rotation animation",
          "Studio lighting environment",
          "High-resolution 4k output",
          "Commercial usage rights"
        ],
        packages: [
          { id: "p12", duration: "Full Day", price: "৳30,000", features: ["3D product modelling & render", "Realistic material & texturing", "Studio lighting environment", "High-resolution 4k output"] },
          { id: "p13", duration: "Half Day", price: "৳18,000", features: ["3D product modelling & render", "360-degre rotation animation", "Commercial usage rights"] }
        ]
      },
      {
        id: "vfx-composition",
        title: "VFX & Composition",
        features: [
          "Green screen & bg removal",
          "CGI integration & FX layering",
          "Advanced colour grading UI",
          "Visual effects & explosions",
          "Dedicated VFX supervisor",
          "Multi format master export"
        ],
        packages: [
          { id: "p14", duration: "Full Day", price: "৳35,000", features: ["Green screen & bg removal", "CGI integration & FX layering", "Visual effects & explosions", "Dedicated VFX supervisor"] },
          { id: "p15", duration: "Per Project", price: "Custom Quote", features: ["Advanced colour grading UI", "Multi format master export", "Dedicated VFX supervisor"] }
        ]
      }
    ]
  }
];