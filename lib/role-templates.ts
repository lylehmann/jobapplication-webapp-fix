export interface RoleDefinition {
  title: string
  description: string
  skills: string[]
  responsibilities: string[]
  careerSummary: string
  coverLetterTemplate: {
    openingParagraph: string
    bodyParagraphs: string
    closingParagraph: string
  }
  resumeData: {
    summary: string
    companies: Array<{
      id: string
      name: string
      location: string
      website?: string
      logo?: string
      roles: Array<{
        id: string
        title: string
        startDate: string
        endDate: string
        current: boolean
        description: string
        achievements: string[]
        technologies: string[]
      }>
    }>
    gapYearActivities?: Array<{
      id: string
      type: "travel" | "education" | "volunteer" | "personal" | "freelance"
      title: string
      description: string
      startDate: string
      endDate: string
      location?: string
      achievements?: string[]
    }>
    education: {
      degree: {
        id: string
        title: string
        institution: string
        location: string
        graduationYear: string
        gpa?: string
        coursework: string[]
      }
      certifications: Array<{
        id: string
        name: string
        issuer: string
        date: string
        expirationDate?: string
        credentialId: string
      }>
    }
    skills: {
      frontend: Array<{ name: string; rating: number }>
      backend: Array<{ name: string; rating: number }>
      cloud: Array<{ name: string; rating: number }>
      design: Array<{ name: string; rating: number }>
      database: Array<{ name: string; rating: number }>
    }
    languages: Array<{
      id: string
      name: string
      code: string
      level: string
      rating: number
      flag: string
    }>
  }
  projectsData: Array<{
    id: string
    name: string
    description: string
    technologies: string[]
    startDate: string
    endDate: string
    status: string
    url?: string
    github?: string
    images: string[]
    achievements: string[]
  }>
  selectedDocuments: Array<{
    id: string
    name: string
    type: string
    category: string
    size: string
    url: string
    description: string
    tags: string[]
  }>
}

export const ROLE_DEFINITIONS: Record<string, RoleDefinition> = {
  "frontend-engineer": {
    title: "Frontend Engineer",
    description: "Specializes in user interface development using modern JavaScript frameworks",
    skills: ["React", "TypeScript", "CSS", "JavaScript", "HTML", "Vue.js", "Angular"],
    responsibilities: [
      "Develop responsive user interfaces",
      "Implement design systems",
      "Optimize application performance",
      "Collaborate with designers and backend engineers",
    ],
    careerSummary:
      "Frontend Engineer with expertise in React, TypeScript, and modern web technologies. Passionate about creating exceptional user experiences and building scalable, maintainable applications.",
    coverLetterTemplate: {
      openingParagraph:
        "I am writing to express my strong interest in the Frontend Engineer position at [Company]. With [X] years of experience building scalable web applications using React, TypeScript, and modern frontend technologies, I am excited about the opportunity to contribute to your innovative team.",
      bodyParagraphs:
        "In my current role as [Current Title] at [Current Company], I have successfully [specific achievement]. My expertise spans the entire frontend ecosystem, from component architecture and state management to performance optimization and accessibility compliance.\n\nWhat particularly excites me about [Company] is [specific company interest]. I am eager to bring my experience in [relevant skills] to help [Company] continue delivering exceptional products.",
      closingParagraph:
        "I would welcome the opportunity to discuss how my technical skills and passion for frontend development can contribute to [Company]'s continued success. Thank you for considering my application.",
    },
    resumeData: {
      summary:
        "Frontend Engineer with 5+ years of experience building scalable web applications using React, TypeScript, and modern JavaScript frameworks. Proven track record of delivering high-performance user interfaces and collaborating with cross-functional teams to create exceptional user experiences.",
      companies: [
        {
          id: "company-1",
          name: "TechCorp Solutions",
          location: "San Francisco, CA",
          website: "https://techcorp.com",
          logo: "/placeholder.svg?height=48&width=48&text=TC",
          roles: [
            {
              id: "role-1",
              title: "Senior Frontend Engineer",
              startDate: "2022-01",
              endDate: "",
              current: true,
              description:
                "Lead frontend development for customer-facing applications serving 100,000+ users. Architect scalable React applications and mentor junior developers.",
              achievements: [
                "Improved application performance by 45% through code optimization",
                "Led migration from JavaScript to TypeScript across 15 components",
                "Implemented design system adopted by 5 product teams",
                "Reduced bundle size by 30% through webpack optimization",
                "Mentored 3 junior developers with 100% retention rate",
              ],
              technologies: ["React", "TypeScript", "Next.js", "Tailwind CSS", "Jest", "Cypress", "Webpack"],
            },
            {
              id: "role-2",
              title: "Frontend Engineer",
              startDate: "2020-06",
              endDate: "2021-12",
              current: false,
              description:
                "Developed responsive web applications and collaborated with design team to implement pixel-perfect UI components.",
              achievements: [
                "Built reusable component library with 95% test coverage",
                "Implemented responsive design supporting mobile and desktop",
                "Achieved WCAG 2.1 AA accessibility compliance",
                "Reduced development time by 25% through component reusability",
              ],
              technologies: ["React", "JavaScript", "SCSS", "Redux", "Jest", "Storybook"],
            },
          ],
        },
      ],
      gapYearActivities: [
        {
          id: "gap-1",
          type: "education",
          title: "Full-Stack Web Development Bootcamp",
          description:
            "Intensive 6-month program covering modern web development technologies including React, Node.js, and database design.",
          startDate: "2020-01",
          endDate: "2020-05",
          location: "San Francisco, CA",
          achievements: [
            "Graduated top 10% of cohort with 96% average",
            "Built 5 full-stack applications using React and Node.js",
            "Completed 200+ coding challenges and algorithms",
            "Received certification in Modern JavaScript and React",
          ],
        },
      ],
      education: {
        degree: {
          id: "degree-1",
          title: "Bachelor of Science in Computer Science",
          institution: "Stanford University",
          location: "Stanford, CA",
          graduationYear: "2019",
          gpa: "3.7",
          coursework: [
            "Data Structures & Algorithms",
            "Software Engineering",
            "Human-Computer Interaction",
            "Web Development",
            "Database Systems",
            "Computer Graphics",
          ],
        },
        certifications: [
          {
            id: "cert-1",
            name: "React Developer Certification",
            issuer: "Meta",
            date: "2023-06",
            expirationDate: "",
            credentialId: "META-REACT-12345",
          },
          {
            id: "cert-2",
            name: "AWS Certified Developer Associate",
            issuer: "Amazon Web Services",
            date: "2023-03",
            expirationDate: "2026-03",
            credentialId: "AWS-DA-67890",
          },
        ],
      },
      skills: {
        frontend: [
          { name: "React", rating: 9 },
          { name: "TypeScript", rating: 8 },
          { name: "JavaScript", rating: 9 },
          { name: "HTML5", rating: 10 },
          { name: "CSS3", rating: 9 },
          { name: "Tailwind CSS", rating: 8 },
          { name: "Next.js", rating: 7 },
          { name: "Vue.js", rating: 6 },
        ],
        backend: [
          { name: "Node.js", rating: 6 },
          { name: "Express", rating: 6 },
          { name: "REST APIs", rating: 7 },
        ],
        cloud: [
          { name: "AWS", rating: 6 },
          { name: "Vercel", rating: 8 },
          { name: "Netlify", rating: 7 },
          { name: "Git", rating: 9 },
          { name: "GitHub Actions", rating: 6 },
        ],
        design: [
          { name: "Figma", rating: 7 },
          { name: "Responsive Design", rating: 9 },
          { name: "Accessibility", rating: 8 },
        ],
        database: [
          { name: "PostgreSQL", rating: 5 },
          { name: "MongoDB", rating: 6 },
        ],
      },
      languages: [
        { id: "lang-1", name: "English", code: "EN", level: "Native", rating: 10, flag: "🇺🇸" },
        { id: "lang-2", name: "Spanish", code: "ES", level: "Conversational", rating: 6, flag: "🇪🇸" },
      ],
    },
    projectsData: [
      {
        id: "project-1",
        name: "E-commerce Platform",
        description:
          "Modern e-commerce platform built with React and TypeScript, featuring real-time inventory management and payment processing.",
        technologies: ["React", "TypeScript", "Next.js", "Stripe", "Tailwind CSS"],
        startDate: "2023-03",
        endDate: "2023-08",
        status: "completed",
        url: "https://ecommerce-demo.example.com",
        github: "https://github.com/username/ecommerce-platform",
        images: [
          "/placeholder.svg?height=300&width=500&text=Homepage",
          "/placeholder.svg?height=300&width=500&text=Product+Page",
          "/placeholder.svg?height=300&width=500&text=Checkout",
          "/placeholder.svg?height=300&width=500&text=Dashboard",
        ],
        achievements: [
          "Achieved 98/100 Google Lighthouse performance score",
          "Implemented responsive design supporting all device sizes",
          "Integrated secure payment processing with Stripe",
          "Built admin dashboard with real-time analytics",
        ],
      },
    ],
    selectedDocuments: [
      {
        id: "doc-1",
        name: "Frontend Engineer Resume.pdf",
        type: "document",
        category: "resume",
        size: "234 KB",
        url: "/placeholder.svg?height=800&width=600&text=Resume",
        description: "Professional resume highlighting frontend development experience",
        tags: ["resume", "frontend", "react", "typescript"],
      },
      {
        id: "doc-2",
        name: "Portfolio Screenshots.zip",
        type: "image",
        category: "portfolio",
        size: "2.1 MB",
        url: "/placeholder.svg?height=600&width=800&text=Portfolio",
        description: "Screenshots of key projects and portfolio website",
        tags: ["portfolio", "projects", "screenshots"],
      },
    ],
  },

  "backend-engineer": {
    title: "Backend Engineer",
    description: "Focuses on server-side development, APIs, and system architecture",
    skills: ["Node.js", "Python", "Java", "PostgreSQL", "MongoDB", "AWS", "Docker"],
    responsibilities: [
      "Design and implement APIs",
      "Manage database architecture",
      "Ensure system scalability and performance",
      "Implement security best practices",
    ],
    careerSummary:
      "Backend Engineer with expertise in building scalable server-side applications and APIs. Experienced in cloud infrastructure, database design, and microservices architecture.",
    coverLetterTemplate: {
      openingParagraph:
        "I am excited to apply for the Backend Engineer position at [Company]. With [X] years of experience designing and implementing scalable server-side applications and APIs, I am confident in my ability to contribute to your engineering team.",
      bodyParagraphs:
        "In my current role, I have successfully [specific backend achievement]. My expertise includes [relevant technologies] and I have experience with [specific systems/architectures].\n\nI am particularly drawn to [Company] because of [specific interest]. I believe my experience in [relevant area] would be valuable for [specific company goal].",
      closingParagraph:
        "I look forward to discussing how my backend development skills and system design experience can help [Company] build robust and scalable solutions.",
    },
    resumeData: {
      summary:
        "Backend Engineer with 6+ years of experience designing and implementing scalable server-side applications, APIs, and microservices. Expertise in cloud infrastructure, database optimization, and system architecture with a focus on performance and reliability.",
      companies: [
        {
          id: "company-1",
          name: "CloudTech Systems",
          location: "Seattle, WA",
          website: "https://cloudtech.com",
          logo: "/placeholder.svg?height=48&width=48&text=CT",
          roles: [
            {
              id: "role-1",
              title: "Senior Backend Engineer",
              startDate: "2021-08",
              endDate: "",
              current: true,
              description:
                "Lead backend development for microservices architecture serving 1M+ requests per day. Design and implement scalable APIs and manage cloud infrastructure.",
              achievements: [
                "Reduced API response time by 60% through optimization",
                "Designed microservices architecture supporting 10x traffic growth",
                "Implemented caching strategy reducing database load by 40%",
                "Led migration to Kubernetes improving deployment efficiency by 50%",
                "Mentored 4 junior engineers on best practices and architecture",
              ],
              technologies: ["Node.js", "Python", "PostgreSQL", "Redis", "AWS", "Docker", "Kubernetes"],
            },
          ],
        },
      ],
      education: {
        degree: {
          id: "degree-1",
          title: "Bachelor of Science in Software Engineering",
          institution: "University of Washington",
          location: "Seattle, WA",
          graduationYear: "2018",
          gpa: "3.8",
          coursework: [
            "Software Architecture",
            "Database Systems",
            "Distributed Systems",
            "Computer Networks",
            "Operating Systems",
            "Algorithms & Data Structures",
          ],
        },
        certifications: [
          {
            id: "cert-1",
            name: "AWS Certified Solutions Architect",
            issuer: "Amazon Web Services",
            date: "2023-04",
            expirationDate: "2026-04",
            credentialId: "AWS-SA-54321",
          },
        ],
      },
      skills: {
        frontend: [
          { name: "JavaScript", rating: 7 },
          { name: "HTML5", rating: 6 },
          { name: "CSS3", rating: 5 },
        ],
        backend: [
          { name: "Node.js", rating: 9 },
          { name: "Python", rating: 8 },
          { name: "Java", rating: 7 },
          { name: "Express", rating: 9 },
          { name: "FastAPI", rating: 8 },
          { name: "REST APIs", rating: 10 },
          { name: "GraphQL", rating: 7 },
        ],
        cloud: [
          { name: "AWS", rating: 9 },
          { name: "Docker", rating: 8 },
          { name: "Kubernetes", rating: 7 },
          { name: "Terraform", rating: 6 },
          { name: "Git", rating: 9 },
        ],
        design: [
          { name: "System Design", rating: 8 },
          { name: "API Design", rating: 9 },
          { name: "Microservices", rating: 8 },
        ],
        database: [
          { name: "PostgreSQL", rating: 9 },
          { name: "MongoDB", rating: 8 },
          { name: "Redis", rating: 8 },
          { name: "Elasticsearch", rating: 6 },
        ],
      },
      languages: [
        { id: "lang-1", name: "English", code: "EN", level: "Native", rating: 10, flag: "🇺🇸" },
        { id: "lang-2", name: "German", code: "DE", level: "Intermediate", rating: 5, flag: "🇩🇪" },
      ],
    },
    projectsData: [
      {
        id: "project-1",
        name: "Microservices API Platform",
        description:
          "Scalable microservices platform handling 1M+ daily requests with real-time data processing and analytics.",
        technologies: ["Node.js", "PostgreSQL", "Redis", "Docker", "Kubernetes", "AWS"],
        startDate: "2022-06",
        endDate: "2023-01",
        status: "completed",
        url: "https://api.example.com",
        github: "https://github.com/username/microservices-platform",
        images: [
          "/placeholder.svg?height=300&width=500&text=API+Architecture",
          "/placeholder.svg?height=300&width=500&text=Monitoring+Dashboard",
          "/placeholder.svg?height=300&width=500&text=Performance+Metrics",
          "/placeholder.svg?height=300&width=500&text=System+Diagram",
        ],
        achievements: [
          "Handles 1M+ requests per day with 99.9% uptime",
          "Reduced response time by 60% through optimization",
          "Implemented auto-scaling supporting 10x traffic spikes",
          "Built comprehensive monitoring and alerting system",
        ],
      },
    ],
    selectedDocuments: [
      {
        id: "doc-1",
        name: "Backend Engineer Resume.pdf",
        type: "document",
        category: "resume",
        size: "245 KB",
        url: "/placeholder.svg?height=800&width=600&text=Backend+Resume",
        description: "Professional resume highlighting backend development experience",
        tags: ["resume", "backend", "apis", "microservices"],
      },
    ],
  },

  "product-manager": {
    title: "Product Manager",
    description: "Drives product strategy, roadmap planning, and cross-functional collaboration",
    skills: ["Product Strategy", "User Research", "Data Analysis", "Agile", "Roadmapping"],
    responsibilities: [
      "Define product vision and strategy",
      "Manage product roadmap and priorities",
      "Collaborate with engineering and design teams",
      "Analyze user feedback and market trends",
    ],
    careerSummary:
      "Product Manager with proven track record of launching successful products and driving user engagement. Experienced in data-driven decision making, user research, and cross-functional team leadership.",
    coverLetterTemplate: {
      openingParagraph:
        "I am excited to apply for the Product Manager position at [Company]. With [X] years of experience driving product strategy and execution, I have consistently delivered products that drive user engagement and business growth.",
      bodyParagraphs:
        "In my current role, I have successfully [specific product achievement]. My approach combines data-driven insights with user-centric design to deliver products that exceed both user expectations and business objectives.\n\nWhat excites me about [Company] is [specific company interest]. I believe my experience in [relevant area] would be valuable for [specific product goal].",
      closingParagraph:
        "I would love to discuss how my product management expertise can help [Company] achieve its ambitious product goals and deliver exceptional user experiences.",
    },
    resumeData: {
      summary:
        "Product Manager with 5+ years of experience leading cross-functional teams to deliver innovative products that drive user engagement and business growth. Expertise in product strategy, user research, and data-driven decision making with a track record of successful product launches.",
      companies: [
        {
          id: "company-1",
          name: "InnovatePM Corp",
          location: "Austin, TX",
          website: "https://innovatepm.com",
          logo: "/placeholder.svg?height=48&width=48&text=IP",
          roles: [
            {
              id: "role-1",
              title: "Senior Product Manager",
              startDate: "2022-03",
              endDate: "",
              current: true,
              description:
                "Lead product strategy for B2B SaaS platform serving 100,000+ users. Manage cross-functional team of 15 engineers, designers, and analysts.",
              achievements: [
                "Launched 3 major features increasing user engagement by 45%",
                "Grew monthly active users by 60% through product optimization",
                "Reduced customer churn by 25% via improved onboarding",
                "Led product discovery resulting in $2M new revenue stream",
                "Implemented OKR framework improving team alignment by 40%",
              ],
              technologies: ["Mixpanel", "Figma", "Jira", "Confluence", "SQL", "A/B Testing"],
            },
          ],
        },
      ],
      education: {
        degree: {
          id: "degree-1",
          title: "Master of Business Administration (MBA)",
          institution: "UT Austin McCombs",
          location: "Austin, TX",
          graduationYear: "2019",
          gpa: "3.9",
          coursework: [
            "Product Strategy",
            "Digital Marketing",
            "Data Analytics",
            "Operations Management",
            "Technology Management",
            "Consumer Behavior",
          ],
        },
        certifications: [
          {
            id: "cert-1",
            name: "Certified Scrum Product Owner",
            issuer: "Scrum Alliance",
            date: "2023-02",
            expirationDate: "2025-02",
            credentialId: "CSPO-98765",
          },
        ],
      },
      skills: {
        frontend: [
          { name: "Product Strategy", rating: 9 },
          { name: "User Research", rating: 8 },
          { name: "Market Analysis", rating: 8 },
          { name: "Roadmapping", rating: 9 },
        ],
        backend: [
          { name: "SQL", rating: 7 },
          { name: "Python", rating: 5 },
          { name: "API Understanding", rating: 6 },
        ],
        cloud: [
          { name: "Google Analytics", rating: 8 },
          { name: "Mixpanel", rating: 9 },
          { name: "Amplitude", rating: 7 },
          { name: "Tableau", rating: 6 },
        ],
        design: [
          { name: "Figma", rating: 7 },
          { name: "User Experience", rating: 8 },
          { name: "Wireframing", rating: 7 },
          { name: "Prototyping", rating: 6 },
        ],
        database: [
          { name: "Product Analytics", rating: 9 },
          { name: "A/B Testing", rating: 8 },
          { name: "User Feedback Analysis", rating: 8 },
        ],
      },
      languages: [
        { id: "lang-1", name: "English", code: "EN", level: "Native", rating: 10, flag: "🇺🇸" },
        { id: "lang-2", name: "French", code: "FR", level: "Intermediate", rating: 6, flag: "🇫🇷" },
      ],
    },
    projectsData: [
      {
        id: "project-1",
        name: "Mobile App Product Launch",
        description:
          "Led end-to-end product development and launch of mobile application, achieving 50,000 downloads in first month.",
        technologies: ["Product Strategy", "User Research", "A/B Testing", "Analytics"],
        startDate: "2023-01",
        endDate: "2023-06",
        status: "completed",
        url: "https://app.example.com",
        github: "",
        images: [
          "/placeholder.svg?height=300&width=500&text=App+Store+Page",
          "/placeholder.svg?height=300&width=500&text=User+Journey",
          "/placeholder.svg?height=300&width=500&text=Analytics+Dashboard",
          "/placeholder.svg?height=300&width=500&text=Feature+Roadmap",
        ],
        achievements: [
          "Achieved 50,000 downloads in first month",
          "Maintained 4.7-star app store rating",
          "Increased user engagement by 35%",
          "Generated $300K additional monthly revenue",
        ],
      },
    ],
    selectedDocuments: [
      {
        id: "doc-1",
        name: "Product Manager Resume.pdf",
        type: "document",
        category: "resume",
        size: "198 KB",
        url: "/placeholder.svg?height=800&width=600&text=PM+Resume",
        description: "Professional resume highlighting product management experience",
        tags: ["resume", "product", "strategy", "analytics"],
      },
    ],
  },

  "data-scientist": {
    title: "Data Scientist",
    description: "Applies statistical analysis and machine learning to extract insights from data",
    skills: ["Python", "R", "Machine Learning", "Statistics", "SQL", "TensorFlow", "PyTorch"],
    responsibilities: [
      "Develop predictive models and algorithms",
      "Analyze large datasets for business insights",
      "Create data visualizations and reports",
      "Collaborate with stakeholders on data strategy",
    ],
    careerSummary:
      "Data Scientist with expertise in machine learning, statistical analysis, and predictive modeling. Experienced in transforming complex data into actionable business insights and building scalable ML solutions.",
    coverLetterTemplate: {
      openingParagraph:
        "I am writing to express my interest in the Data Scientist position at [Company]. With [X] years of experience in machine learning and statistical analysis, I have consistently delivered data-driven solutions that drive business value.",
      bodyParagraphs:
        "In my current role, I have successfully [specific data science achievement]. My expertise includes [relevant technologies/methods] and I have experience applying these to [specific domain/industry].\n\nI am particularly excited about [Company]'s approach to [specific data initiative]. My background in [relevant area] would enable me to contribute immediately to [specific project/goal].",
      closingParagraph:
        "I would welcome the opportunity to discuss how my data science expertise can help [Company] unlock the full potential of its data assets and drive informed decision-making.",
    },
    resumeData: {
      summary:
        "Data Scientist with Ph.D. in Statistics and 4+ years of experience developing machine learning models and statistical analyses that drive business decisions. Expertise in Python, R, and deep learning with proven track record of delivering actionable insights from complex datasets.",
      companies: [
        {
          id: "company-1",
          name: "DataTech Analytics",
          location: "Boston, MA",
          website: "https://datatech.com",
          logo: "/placeholder.svg?height=48&width=48&text=DT",
          roles: [
            {
              id: "role-1",
              title: "Senior Data Scientist",
              startDate: "2022-01",
              endDate: "",
              current: true,
              description:
                "Lead data science initiatives for predictive analytics and machine learning solutions. Develop models that serve millions of users and drive key business metrics.",
              achievements: [
                "Built recommendation system increasing revenue by $2M annually",
                "Developed fraud detection model reducing losses by 40%",
                "Led team of 3 data scientists on customer segmentation project",
                "Published 2 papers in top-tier ML conferences",
                "Implemented MLOps pipeline reducing deployment time by 60%",
              ],
              technologies: ["Python", "TensorFlow", "PyTorch", "SQL", "AWS", "Docker", "Kubernetes"],
            },
          ],
        },
      ],
      education: {
        degree: {
          id: "degree-1",
          title: "Ph.D. in Statistics",
          institution: "MIT",
          location: "Cambridge, MA",
          graduationYear: "2020",
          gpa: "3.95",
          coursework: [
            "Statistical Machine Learning",
            "Bayesian Statistics",
            "Time Series Analysis",
            "Computational Statistics",
            "Deep Learning",
            "Mathematical Statistics",
          ],
        },
        certifications: [
          {
            id: "cert-1",
            name: "AWS Certified Machine Learning",
            issuer: "Amazon Web Services",
            date: "2023-03",
            expirationDate: "2026-03",
            credentialId: "AWS-ML-11111",
          },
        ],
      },
      skills: {
        frontend: [
          { name: "Python", rating: 10 },
          { name: "R", rating: 9 },
          { name: "SQL", rating: 9 },
          { name: "MATLAB", rating: 6 },
        ],
        backend: [
          { name: "TensorFlow", rating: 9 },
          { name: "PyTorch", rating: 8 },
          { name: "Scikit-learn", rating: 10 },
          { name: "Pandas", rating: 10 },
          { name: "NumPy", rating: 10 },
        ],
        cloud: [
          { name: "AWS", rating: 8 },
          { name: "Google Cloud", rating: 6 },
          { name: "Docker", rating: 7 },
          { name: "MLflow", rating: 8 },
        ],
        design: [
          { name: "Matplotlib", rating: 9 },
          { name: "Seaborn", rating: 8 },
          { name: "Plotly", rating: 7 },
          { name: "Tableau", rating: 6 },
        ],
        database: [
          { name: "PostgreSQL", rating: 8 },
          { name: "MongoDB", rating: 6 },
          { name: "Redis", rating: 5 },
        ],
      },
      languages: [
        { id: "lang-1", name: "English", code: "EN", level: "Native", rating: 10, flag: "🇺🇸" },
        { id: "lang-2", name: "Python", code: "PY", level: "Expert", rating: 10, flag: "🐍" },
      ],
    },
    projectsData: [
      {
        id: "project-1",
        name: "Predictive Analytics Platform",
        description:
          "Machine learning platform for predicting customer behavior and optimizing business operations, serving 100+ enterprise clients.",
        technologies: ["Python", "TensorFlow", "AWS", "PostgreSQL", "Docker"],
        startDate: "2022-08",
        endDate: "2023-03",
        status: "completed",
        url: "https://analytics.example.com",
        github: "https://github.com/username/ml-platform",
        images: [
          "/placeholder.svg?height=300&width=500&text=ML+Dashboard",
          "/placeholder.svg?height=300&width=500&text=Model+Performance",
          "/placeholder.svg?height=300&width=500&text=Predictions+View",
          "/placeholder.svg?height=300&width=500&text=Analytics+Reports",
        ],
        achievements: [
          "Achieved 92% prediction accuracy across all models",
          "Reduced client churn by 35% through early warning system",
          "Generated $1.5M additional revenue for clients",
          "Deployed to 100+ enterprise customers",
        ],
      },
    ],
    selectedDocuments: [
      {
        id: "doc-1",
        name: "Data Scientist Resume.pdf",
        type: "document",
        category: "resume",
        size: "267 KB",
        url: "/placeholder.svg?height=800&width=600&text=DS+Resume",
        description: "Professional resume highlighting data science experience and research",
        tags: ["resume", "data-science", "machine-learning", "phd"],
      },
    ],
  },

  "ux-designer": {
    title: "UX Designer",
    description: "Creates user-centered designs and improves user experience across digital products",
    skills: ["Figma", "Sketch", "User Research", "Prototyping", "Wireframing", "Design Systems"],
    responsibilities: [
      "Conduct user research and usability testing",
      "Create wireframes, prototypes, and design systems",
      "Collaborate with product and engineering teams",
      "Analyze user behavior and feedback",
    ],
    careerSummary:
      "UX Designer with passion for creating intuitive and accessible user experiences. Experienced in user research, design systems, and collaborative design processes that put users at the center of product development.",
    coverLetterTemplate: {
      openingParagraph:
        "I am excited to apply for the UX Designer position at [Company]. With [X] years of experience creating user-centered designs and conducting user research, I am passionate about crafting experiences that delight users and drive business success.",
      bodyParagraphs:
        "In my current role, I have successfully [specific design achievement]. My design process is rooted in user research and data-driven insights, ensuring that every design decision serves both user needs and business objectives.\n\nI am particularly drawn to [Company] because of [specific design interest]. My experience in [relevant area] would enable me to contribute to [specific design goal].",
      closingParagraph:
        "I would love to discuss how my UX design expertise and user-centered approach can help [Company] create exceptional experiences that users love.",
    },
    resumeData: {
      summary:
        "UX Designer with 4+ years of experience creating user-centered designs for web and mobile applications. Expertise in user research, design systems, and collaborative design processes with a proven track record of improving user satisfaction and engagement metrics.",
      companies: [
        {
          id: "company-1",
          name: "DesignTech Studio",
          location: "Portland, OR",
          website: "https://designtech.com",
          logo: "/placeholder.svg?height=48&width=48&text=DS",
          roles: [
            {
              id: "role-1",
              title: "Senior UX Designer",
              startDate: "2021-06",
              endDate: "",
              current: true,
              description:
                "Lead UX design for B2B SaaS platform serving 50,000+ users. Conduct user research, create design systems, and collaborate with cross-functional teams.",
              achievements: [
                "Improved user satisfaction score by 40% through redesign",
                "Reduced user onboarding time by 50% via UX optimization",
                "Created design system adopted across 6 product teams",
                "Led usability testing with 200+ participants",
                "Increased feature adoption by 35% through improved UX",
              ],
              technologies: ["Figma", "Sketch", "Principle", "InVision", "Miro", "Hotjar"],
            },
          ],
        },
      ],
      education: {
        degree: {
          id: "degree-1",
          title: "Bachelor of Fine Arts in Graphic Design",
          institution: "Art Institute of Portland",
          location: "Portland, OR",
          graduationYear: "2019",
          gpa: "3.8",
          coursework: [
            "User Experience Design",
            "Human-Computer Interaction",
            "Visual Design Principles",
            "Typography",
            "Color Theory",
            "Design Research Methods",
          ],
        },
        certifications: [
          {
            id: "cert-1",
            name: "Google UX Design Certificate",
            issuer: "Google",
            date: "2023-01",
            expirationDate: "",
            credentialId: "GOOGLE-UX-22222",
          },
        ],
      },
      skills: {
        frontend: [
          { name: "HTML5", rating: 6 },
          { name: "CSS3", rating: 7 },
          { name: "JavaScript", rating: 4 },
        ],
        backend: [],
        cloud: [
          { name: "Figma", rating: 10 },
          { name: "Sketch", rating: 9 },
          { name: "Adobe Creative Suite", rating: 8 },
          { name: "InVision", rating: 7 },
        ],
        design: [
          { name: "User Research", rating: 9 },
          { name: "Wireframing", rating: 10 },
          { name: "Prototyping", rating: 9 },
          { name: "Design Systems", rating: 8 },
          { name: "Usability Testing", rating: 9 },
          { name: "Information Architecture", rating: 8 },
        ],
        database: [],
      },
      languages: [
        { id: "lang-1", name: "English", code: "EN", level: "Native", rating: 10, flag: "🇺🇸" },
        { id: "lang-2", name: "Japanese", code: "JA", level: "Basic", rating: 3, flag: "🇯🇵" },
      ],
    },
    projectsData: [
      {
        id: "project-1",
        name: "SaaS Platform Redesign",
        description:
          "Complete UX redesign of B2B SaaS platform, improving user satisfaction by 40% and reducing support tickets by 30%.",
        technologies: ["Figma", "User Research", "Prototyping", "Usability Testing"],
        startDate: "2022-09",
        endDate: "2023-02",
        status: "completed",
        url: "https://platform.example.com",
        github: "",
        images: [
          "/placeholder.svg?height=300&width=500&text=Before+After",
          "/placeholder.svg?height=300&width=500&text=User+Journey",
          "/placeholder.svg?height=300&width=500&text=Wireframes",
          "/placeholder.svg?height=300&width=500&text=Final+Design",
        ],
        achievements: [
          "Improved user satisfaction by 40%",
          "Reduced support tickets by 30%",
          "Increased task completion rate by 25%",
          "Decreased user onboarding time by 50%",
        ],
      },
    ],
    selectedDocuments: [
      {
        id: "doc-1",
        name: "UX Designer Portfolio.pdf",
        type: "document",
        category: "portfolio",
        size: "3.2 MB",
        url: "/placeholder.svg?height=800&width=600&text=UX+Portfolio",
        description: "Comprehensive portfolio showcasing UX design projects and case studies",
        tags: ["portfolio", "ux", "design", "case-studies"],
      },
    ],
  },

  "devops-engineer": {
    title: "DevOps Engineer",
    description: "Manages infrastructure, deployment pipelines, and system reliability",
    skills: ["AWS", "Docker", "Kubernetes", "Terraform", "Jenkins", "Monitoring", "Linux"],
    responsibilities: [
      "Manage cloud infrastructure and deployments",
      "Implement CI/CD pipelines",
      "Monitor system performance and reliability",
      "Automate operational processes",
    ],
    careerSummary:
      "DevOps Engineer with expertise in cloud infrastructure, automation, and system reliability. Experienced in building scalable deployment pipelines and maintaining high-availability systems.",
    coverLetterTemplate: {
      openingParagraph:
        "I am writing to express my interest in the DevOps Engineer position at [Company]. With [X] years of experience in cloud infrastructure and automation, I have consistently improved deployment efficiency and system reliability.",
      bodyParagraphs:
        "In my current role, I have successfully [specific DevOps achievement]. My expertise includes [relevant technologies] and I have experience with [specific systems/processes].\n\nI am excited about [Company]'s commitment to [specific infrastructure goal]. My background in [relevant area] would enable me to contribute to [specific objective].",
      closingParagraph:
        "I look forward to discussing how my DevOps expertise can help [Company] build robust, scalable infrastructure that supports rapid growth and innovation.",
    },
    resumeData: {
      summary:
        "DevOps Engineer with 5+ years of experience building and managing cloud infrastructure, CI/CD pipelines, and monitoring systems. Expertise in AWS, Kubernetes, and infrastructure automation with a focus on reliability, scalability, and security.",
      companies: [
        {
          id: "company-1",
          name: "CloudOps Solutions",
          location: "Denver, CO",
          website: "https://cloudops.com",
          logo: "/placeholder.svg?height=48&width=48&text=CO",
          roles: [
            {
              id: "role-1",
              title: "Senior DevOps Engineer",
              startDate: "2021-03",
              endDate: "",
              current: true,
              description:
                "Lead infrastructure automation and deployment pipeline development for microservices architecture serving millions of users.",
              achievements: [
                "Reduced deployment time by 80% through CI/CD automation",
                "Achieved 99.9% uptime across all production systems",
                "Implemented infrastructure as code reducing provisioning time by 70%",
                "Led migration to Kubernetes improving resource utilization by 40%",
                "Built comprehensive monitoring reducing MTTR by 60%",
              ],
              technologies: ["AWS", "Kubernetes", "Terraform", "Docker", "Jenkins", "Prometheus", "Grafana"],
            },
          ],
        },
      ],
      education: {
        degree: {
          id: "degree-1",
          title: "Bachelor of Science in Computer Engineering",
          institution: "Colorado State University",
          location: "Fort Collins, CO",
          graduationYear: "2018",
          gpa: "3.6",
          coursework: [
            "Computer Networks",
            "Operating Systems",
            "Distributed Systems",
            "System Administration",
            "Computer Security",
            "Software Engineering",
          ],
        },
        certifications: [
          {
            id: "cert-1",
            name: "AWS Certified DevOps Engineer",
            issuer: "Amazon Web Services",
            date: "2023-02",
            expirationDate: "2026-02",
            credentialId: "AWS-DEVOPS-33333",
          },
          {
            id: "cert-2",
            name: "Certified Kubernetes Administrator",
            issuer: "Cloud Native Computing Foundation",
            date: "2022-11",
            expirationDate: "2025-11",
            credentialId: "CKA-44444",
          },
        ],
      },
      skills: {
        frontend: [],
        backend: [
          { name: "Python", rating: 7 },
          { name: "Bash", rating: 9 },
          { name: "Go", rating: 6 },
        ],
        cloud: [
          { name: "AWS", rating: 9 },
          { name: "Docker", rating: 9 },
          { name: "Kubernetes", rating: 8 },
          { name: "Terraform", rating: 8 },
          { name: "Jenkins", rating: 8 },
          { name: "GitLab CI", rating: 7 },
        ],
        design: [
          { name: "System Architecture", rating: 8 },
          { name: "Infrastructure Design", rating: 9 },
          { name: "Monitoring", rating: 8 },
        ],
        database: [
          { name: "PostgreSQL", rating: 6 },
          { name: "Redis", rating: 7 },
          { name: "MongoDB", rating: 5 },
        ],
      },
      languages: [{ id: "lang-1", name: "English", code: "EN", level: "Native", rating: 10, flag: "🇺🇸" }],
    },
    projectsData: [
      {
        id: "project-1",
        name: "Kubernetes Migration Platform",
        description:
          "Led migration of legacy infrastructure to Kubernetes, improving scalability and reducing operational costs by 35%.",
        technologies: ["Kubernetes", "Docker", "Terraform", "AWS", "Prometheus"],
        startDate: "2022-04",
        endDate: "2022-11",
        status: "completed",
        url: "https://k8s.example.com",
        github: "https://github.com/username/k8s-migration",
        images: [
          "/placeholder.svg?height=300&width=500&text=Architecture+Diagram",
          "/placeholder.svg?height=300&width=500&text=Monitoring+Dashboard",
          "/placeholder.svg?height=300&width=500&text=Deployment+Pipeline",
          "/placeholder.svg?height=300&width=500&text=Cost+Analysis",
        ],
        achievements: [
          "Reduced infrastructure costs by 35%",
          "Improved deployment frequency by 10x",
          "Achieved 99.9% uptime during migration",
          "Reduced resource provisioning time by 70%",
        ],
      },
    ],
    selectedDocuments: [
      {
        id: "doc-1",
        name: "DevOps Engineer Resume.pdf",
        type: "document",
        category: "resume",
        size: "223 KB",
        url: "/placeholder.svg?height=800&width=600&text=DevOps+Resume",
        description: "Professional resume highlighting DevOps and infrastructure experience",
        tags: ["resume", "devops", "kubernetes", "aws"],
      },
    ],
  },
}

/* ----------------------------------------------------------------
  Helper utilities (restored)
-----------------------------------------------------------------*/

/**
 * Returns a bundle of role-specific starter data used when seeding
 * a brand-new application from a template or the “New Application” flow.
 */
export function generateRoleSpecificContent(role: RoleType) {
  const data = ROLE_DEFINITIONS[role]

  return {
    careerSummary: data.resumeData.summary,
    coverLetterTemplate: data.coverLetterTemplate,
    companiesTemplate: data.resumeData.companies,
    gapYearActivitiesTemplate: data.resumeData.gapYearActivities ?? [],
    educationTemplate: data.resumeData.education,
    skillsTemplate: data.resumeData.skills,
    projectsTemplate: data.projectsData,
    supportingDocsTemplate: data.selectedDocuments,
  }
}

/**
 * Buckets a flat list of skills (strings OR { name, rating }) into
 * high-level categories so the UI can show a tidy skill matrix.
 */
export function getSkillsByCategory(role: RoleType) {
  const { skills } = ROLE_DEFINITIONS[role].resumeData

  const categories = {
    frontend: [] as typeof skills.frontend,
    backend: [] as typeof skills.backend,
    cloud: [] as typeof skills.cloud,
    design: [] as typeof skills.design,
    database: [] as typeof skills.database,
  }

  Object.entries(skills).forEach(([categoryKey, skillArr]) => {
    // @ts-expect-error – Type narrowing handled by runtime map
    categories[categoryKey] = skillArr
  })

  return categories
}

export type RoleType = keyof typeof ROLE_DEFINITIONS

export function getRoleDefinition(roleType: RoleType): RoleDefinition {
  return ROLE_DEFINITIONS[roleType]
}

export function getAllRoles(): Array<{ key: RoleType; definition: RoleDefinition }> {
  return Object.entries(ROLE_DEFINITIONS).map(([key, definition]) => ({
    key: key as RoleType,
    definition,
  }))
}
