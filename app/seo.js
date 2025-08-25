// SEO Configuration for MotiveMentor
export const siteConfig = {
  name: "MotiveMentor",
  title: "MotiveMentor - Daily Motivation Quotes, Goal Tracking & Personal Growth Platform",
  description: "Transform your life with MotiveMentor - Get daily inspirational quotes, track goals, play motivational word games, discover self-help books, and join a supportive community for personal development and success.",
  url: "https://motivementor.vercel.app",
  ogImage: "/og-image.jpg",
  keywords: [
    // Core motivation keywords
    "daily motivation quotes",
    "inspirational quotes",
    "motivational quotes",
    "personal development",
    "self improvement",
    "life motivation",
    "success quotes",
    "positive thinking",
    
    // Goal tracking keywords
    "goal tracking app",
    "goal setting",
    "habit tracker",
    "productivity tools",
    "achievement tracking",
    "personal goals",
    "success planning",
    
    // Wellness & Mental Health
    "mental health support",
    "mindfulness quotes",
    "stress relief",
    "anxiety help",
    "depression motivation",
    "self care",
    "emotional wellness",
    "positive psychology",
    
    // Self-help & Books
    "self help books",
    "personal growth books",
    "motivational books",
    "success books",
    "life changing books",
    "book recommendations",
    
    // Community & Social
    "motivation community",
    "support group",
    "personal development forum",
    "motivational community",
    "success stories",
    
    // Tools & Features
    "quote generator",
    "daily affirmations",
    "motivational word games",
    "inspiration app",
    "motivation tracker",
    "life coach tools",
    
    // Target audience keywords
    "student motivation",
    "entrepreneur motivation",
    "career success",
    "life transformation",
    "overcome obstacles",
    "achieve dreams",
    "build confidence",
    "leadership quotes"
  ],
  authors: [
    {
      name: "MotiveMentor Team",
      url: "https://motivementor.vercel.app/about",
    },
  ],
  creator: "MotiveMentor",
  publisher: "MotiveMentor",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
};

export const pages = {
  home: {
    title: "MotiveMentor - Daily Motivation Quotes & Goal Tracking for Personal Success",
    description: "Start your journey to success with MotiveMentor. Get daily inspirational quotes, track your goals, play motivational games, and join thousands achieving their dreams. Free motivation tools for personal growth.",
    keywords: [
      "daily motivation",
      "inspirational quotes app",
      "goal tracking",
      "personal development platform",
      "success motivation",
      "free motivation tools",
      "daily affirmations",
      "life transformation"
    ],
  },
  
  quotes: {
    title: "Daily Inspirational Quotes Generator - Free Motivational Quotes | MotiveMentor",
    description: "Generate unlimited inspirational quotes daily. Discover motivational quotes for success, happiness, love, and personal growth. Save your favorites and share motivation with friends.",
    keywords: [
      "quote generator",
      "daily quotes",
      "inspirational quotes",
      "motivational quotes generator",
      "free quotes",
      "success quotes",
      "happiness quotes",
      "wisdom quotes"
    ],
  },
  
  goals: {
    title: "Goal Tracker & Achievement Planner - Track Your Success Journey | MotiveMentor",
    description: "Set, track, and achieve your goals with our powerful goal tracking system. Monitor progress, celebrate milestones, and stay motivated on your path to success.",
    keywords: [
      "goal tracker",
      "goal setting app",
      "achievement tracking",
      "progress monitor",
      "success planner",
      "habit tracker",
      "productivity tools",
      "goal achievement"
    ],
  },
  
  books: {
    title: "Best Self-Help & Motivational Books Recommendations | MotiveMentor",
    description: "Discover life-changing self-help books, personal development guides, and motivational literature. Curated book recommendations for success, happiness, and personal growth.",
    keywords: [
      "self help books",
      "motivational books",
      "personal development books",
      "success books",
      "book recommendations",
      "life changing books",
      "best motivational books",
      "personal growth reading"
    ],
  },
  
  wordGame: {
    title: "Motivational Word Games - Fun Brain Training for Success Mindset | MotiveMentor",
    description: "Play engaging word games designed to reinforce positive thinking and success mindset. Train your brain while learning motivational vocabulary and concepts.",
    keywords: [
      "motivational word games",
      "brain training games",
      "positive thinking games",
      "success mindset games",
      "educational word games",
      "motivation games",
      "word puzzle games",
      "brain exercises"
    ],
  },
  
  chat: {
    title: "Motivation Community Forum - Connect with Success-Minded People | MotiveMentor",
    description: "Join our supportive community forum. Share your journey, get motivation from others, ask questions, and connect with like-minded people pursuing personal growth and success.",
    keywords: [
      "motivation community",
      "personal development forum",
      "support group",
      "success community",
      "motivational forum",
      "life coaching community",
      "peer support",
      "inspiration sharing"
    ],
  },
  
  dashboard: {
    title: "Personal Dashboard - Track Your Motivation & Success Journey | MotiveMentor",
    description: "Your personal motivation hub. Track goals, view progress, manage saved quotes, monitor achievements, and access all your personal development tools in one place.",
    keywords: [
      "personal dashboard",
      "motivation tracker",
      "progress tracking",
      "success dashboard",
      "personal development hub",
      "goal overview",
      "achievement monitor",
      "motivation metrics"
    ],
  },
  
  savedQuotes: {
    title: "My Saved Inspirational Quotes Collection | MotiveMentor",
    description: "Access your personal collection of saved motivational quotes. Organize, review, and find inspiration from your favorite quotes whenever you need motivation.",
    keywords: [
      "saved quotes",
      "quote collection",
      "favorite quotes",
      "personal inspiration",
      "quote library",
      "motivational collection",
      "inspirational archive",
      "quote bookmarks"
    ],
  },
};

// Schema.org structured data
export const getStructuredData = (pageType = 'home') => {
  const baseSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": siteConfig.name,
    "url": siteConfig.url,
    "description": siteConfig.description,
    "publisher": {
      "@type": "Organization",
      "name": siteConfig.publisher,
      "url": siteConfig.url,
    },
    "potentialAction": {
      "@type": "SearchAction",
      "target": {
        "@type": "EntryPoint",
        "urlTemplate": `${siteConfig.url}/search?q={search_term_string}`
      },
      "query-input": "required name=search_term_string"
    }
  };

  const schemas = {
    home: [
      baseSchema,
      {
        "@context": "https://schema.org",
        "@type": "WebApplication",
        "name": siteConfig.name,
        "description": siteConfig.description,
        "url": siteConfig.url,
        "applicationCategory": "LifestyleApplication",
        "operatingSystem": "Any",
        "offers": {
          "@type": "Offer",
          "price": "0",
          "priceCurrency": "USD"
        },
        "featureList": [
          "Daily Motivational Quotes",
          "Goal Tracking",
          "Progress Monitoring",
          "Community Forum",
          "Book Recommendations",
          "Motivational Games"
        ]
      }
    ],
    quotes: [
      {
        "@context": "https://schema.org",
        "@type": "CreativeWork",
        "name": "Daily Inspirational Quotes",
        "description": "Collection of motivational and inspirational quotes for personal development",
        "url": `${siteConfig.url}/dailyquotes`,
        "genre": "Inspirational Content",
        "publisher": {
          "@type": "Organization",
          "name": siteConfig.publisher
        }
      }
    ],
    books: [
      {
        "@context": "https://schema.org",
        "@type": "ItemList",
        "name": "Self-Help Book Recommendations",
        "description": "Curated list of the best self-help and motivational books",
        "url": `${siteConfig.url}/books`,
        "numberOfItems": "50+"
      }
    ]
  };

  return schemas[pageType] || [baseSchema];
};
