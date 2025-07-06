"use client"

import { useState } from "react"
import { ArrowLeft, Plus, Copy, Trash2, Star, Briefcase, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/components/ui/use-toast"
import { TemplateApplicationDialog } from "./template-application-dialog"
import { ROLE_DEFINITIONS, type RoleType } from "@/lib/role-templates"
import type { Database } from "@/lib/database.types"

type Template = Database["public"]["Tables"]["templates"]["Row"]

interface TemplateManagerProps {
  onBack: () => void
  onApplicationCreate?: (applicationData: any) => Promise<void>
}

export function TemplateManager({ onBack, onApplicationCreate = async () => {} }: TemplateManagerProps) {
  const { toast } = useToast()
  const [templates, setTemplates] = useState<Template[]>([
    {
      id: "1",
      name: "Senior Frontend Engineer Template",
      type: "complete_application",
      target_role: "frontend-engineer",
      data: {
        layout: "modern",
        colors: { primary: "#2563eb", secondary: "#64748b" },
        sections: ["summary", "experience", "education", "skills", "projects"],
        personalInfo: {
          fullName: "Alexandra Chen",
          email: "alexandra.chen@email.com",
          phone: "(555) 123-4567",
          location: "San Francisco, CA",
          linkedin: "linkedin.com/in/alexandrachen",
          github: "github.com/alexandrachen",
          portfolio: "alexandrachen.dev",
          profileImage: "/placeholder.svg?height=200&width=200&text=AC",
        },
        coverLetterData: {
          recipientName: "Sarah Johnson",
          recipientTitle: "Senior Engineering Manager",
          companyAddress: "TechCorp Inc.\n123 Innovation Drive\nSan Francisco, CA 94105",
          date: "2024-01-15",
          subject: "Application for Senior Frontend Engineer Position",
          salutation: "Dear Ms. Johnson,",
          openingParagraph:
            "I am writing to express my strong interest in the Senior Frontend Engineer position at TechCorp. With over 6 years of experience building scalable web applications using React, TypeScript, and modern frontend technologies, I am excited about the opportunity to contribute to your innovative team and help drive the next phase of product development.",
          bodyParagraphs:
            "In my current role as Lead Frontend Engineer at InnovateTech, I have successfully architected and delivered multiple high-impact projects that serve over 100,000 daily active users. I led the complete redesign of our customer dashboard, resulting in a 45% improvement in user engagement and a 30% reduction in support tickets. My expertise spans the entire frontend ecosystem, from component architecture and state management to performance optimization and accessibility compliance.\n\nWhat particularly excites me about TechCorp is your commitment to pushing the boundaries of user experience through cutting-edge technology. I am eager to bring my experience in building design systems, mentoring junior developers, and collaborating with cross-functional teams to help TechCorp continue delivering exceptional products that make a meaningful impact on users' lives.\n\nI have consistently demonstrated my ability to balance technical excellence with business objectives, having increased our team's delivery velocity by 40% through the implementation of automated testing and CI/CD pipelines. My passion for clean, maintainable code and user-centric design aligns perfectly with TechCorp's engineering values.",
          closingParagraph:
            "I would welcome the opportunity to discuss how my technical leadership and passion for frontend innovation can contribute to TechCorp's continued success. Thank you for considering my application, and I look forward to hearing from you soon.",
          signOff: "Best regards,",
        },
        resumeData: {
          summary:
            "Senior Frontend Engineer with 6+ years of experience architecting and building scalable web applications using React, TypeScript, and modern JavaScript frameworks. Proven track record of leading technical initiatives, mentoring development teams, and delivering high-performance user interfaces that serve hundreds of thousands of users. Passionate about creating accessible, maintainable code and fostering collaborative engineering cultures.",
          companies: [
            {
              id: "company-1",
              name: "InnovateTech Solutions",
              location: "San Francisco, CA",
              website: "https://innovatetech.com",
              logo: "/placeholder.svg?height=48&width=48&text=IT",
              roles: [
                {
                  id: "role-1",
                  title: "Lead Frontend Engineer",
                  startDate: "2022-03",
                  endDate: "",
                  current: true,
                  description:
                    "Lead a team of 5 frontend engineers in developing and maintaining customer-facing applications serving 100,000+ daily active users. Architect scalable React applications with TypeScript and implement comprehensive testing strategies.",
                  achievements: [
                    "Led complete redesign of customer dashboard, improving user engagement by 45%",
                    "Reduced support tickets by 30% through improved UX and error handling",
                    "Implemented design system adopted across 8 product teams",
                    "Increased team delivery velocity by 40% through process improvements",
                    "Mentored 3 junior developers, with 2 receiving promotions",
                  ],
                  technologies: ["React", "TypeScript", "Next.js", "GraphQL", "Jest", "Cypress", "Storybook", "Figma"],
                },
                {
                  id: "role-2",
                  title: "Senior Frontend Engineer",
                  startDate: "2020-08",
                  endDate: "2022-02",
                  current: false,
                  description:
                    "Developed and maintained multiple React applications, focusing on performance optimization and user experience improvements. Collaborated closely with design and backend teams to deliver pixel-perfect implementations.",
                  achievements: [
                    "Improved application performance by 60% through code splitting and lazy loading",
                    "Built reusable component library with 95% test coverage",
                    "Implemented accessibility standards achieving WCAG 2.1 AA compliance",
                    "Reduced bundle size by 40% through webpack optimization",
                  ],
                  technologies: ["React", "JavaScript", "Redux", "Webpack", "SASS", "Jest", "React Testing Library"],
                },
              ],
            },
            {
              id: "company-2",
              name: "StartupXYZ",
              location: "Palo Alto, CA",
              website: "https://startupxyz.com",
              logo: "/placeholder.svg?height=48&width=48&text=SX",
              roles: [
                {
                  id: "role-3",
                  title: "Frontend Engineer",
                  startDate: "2018-06",
                  endDate: "2020-07",
                  current: false,
                  description:
                    "Full-stack development with focus on frontend technologies. Built responsive web applications from scratch and integrated with RESTful APIs. Worked in an agile environment with rapid iteration cycles.",
                  achievements: [
                    "Developed MVP that secured $2M Series A funding",
                    "Built responsive design system used across all products",
                    "Implemented real-time features using WebSocket connections",
                    "Achieved 98% uptime through robust error handling and monitoring",
                  ],
                  technologies: ["React", "Node.js", "Express", "MongoDB", "Socket.io", "Bootstrap"],
                },
              ],
            },
          ],
          gapYearActivities: [
            {
              id: "gap-1",
              type: "education",
              title: "Advanced React & TypeScript Bootcamp",
              description:
                "Intensive 6-month program focusing on advanced React patterns, TypeScript, and modern frontend architecture. Completed capstone project building a full-stack e-commerce platform.",
              startDate: "2018-01",
              endDate: "2018-05",
              location: "San Francisco, CA",
              achievements: [
                "Graduated top 5% of cohort with 98% average",
                "Built full-stack e-commerce platform with React and Node.js",
                "Completed 40+ coding challenges and 5 major projects",
                "Received certification in Advanced JavaScript and React",
              ],
            },
          ],
          education: {
            degree: {
              id: "degree-1",
              title: "Bachelor of Science in Computer Science",
              institution: "UC Berkeley",
              location: "Berkeley, CA",
              graduationYear: "2017",
              gpa: "3.8",
              coursework: [
                "Data Structures & Algorithms",
                "Software Engineering",
                "Human-Computer Interaction",
                "Database Systems",
                "Web Development",
                "Computer Graphics",
                "Machine Learning",
              ],
            },
            certifications: [
              {
                id: "cert-1",
                name: "AWS Certified Developer Associate",
                issuer: "Amazon Web Services",
                date: "2023-08",
                expirationDate: "2026-08",
                credentialId: "AWS-DA-12345",
              },
              {
                id: "cert-2",
                name: "React Developer Certification",
                issuer: "Meta",
                date: "2022-11",
                expirationDate: "",
                credentialId: "META-REACT-67890",
              },
              {
                id: "cert-3",
                name: "Google Analytics Individual Qualification",
                issuer: "Google",
                date: "2023-03",
                expirationDate: "2024-03",
                credentialId: "GAIQ-54321",
              },
            ],
            continuingEducation: [
              {
                id: "edu-1",
                title: "Advanced React Patterns",
                provider: "Frontend Masters",
                completionDate: "2023-09",
                hours: 40,
              },
              {
                id: "edu-2",
                title: "TypeScript Deep Dive",
                provider: "Udemy",
                completionDate: "2023-05",
                hours: 32,
              },
              {
                id: "edu-3",
                title: "GraphQL with React",
                provider: "Pluralsight",
                completionDate: "2023-01",
                hours: 28,
              },
            ],
          },
          skills: {
            frontend: [
              { name: "React", rating: 9 },
              { name: "TypeScript", rating: 9 },
              { name: "JavaScript", rating: 10 },
              { name: "HTML5", rating: 10 },
              { name: "CSS3", rating: 9 },
              { name: "Tailwind CSS", rating: 8 },
              { name: "Next.js", rating: 8 },
              { name: "Vue.js", rating: 6 },
            ],
            backend: [
              { name: "Node.js", rating: 7 },
              { name: "Express", rating: 7 },
              { name: "GraphQL", rating: 8 },
              { name: "REST APIs", rating: 9 },
            ],
            cloud: [
              { name: "AWS", rating: 7 },
              { name: "Vercel", rating: 9 },
              { name: "Netlify", rating: 8 },
              { name: "Docker", rating: 6 },
              { name: "Git", rating: 9 },
              { name: "GitHub Actions", rating: 7 },
            ],
            design: [
              { name: "Figma", rating: 8 },
              { name: "Adobe XD", rating: 6 },
              { name: "Responsive Design", rating: 9 },
              { name: "Accessibility (WCAG)", rating: 8 },
            ],
            database: [
              { name: "PostgreSQL", rating: 6 },
              { name: "MongoDB", rating: 7 },
              { name: "Redis", rating: 5 },
            ],
          },
          languages: [
            { id: "lang-1", name: "English", code: "EN", level: "Native", rating: 10, flag: "🇺🇸" },
            { id: "lang-2", name: "Mandarin", code: "ZH", level: "Conversational", rating: 6, flag: "🇨🇳" },
            { id: "lang-3", name: "Spanish", code: "ES", level: "Basic", rating: 4, flag: "🇪🇸" },
          ],
        },
        projectsData: [
          {
            id: "project-1",
            name: "E-commerce Platform Redesign",
            description:
              "Complete redesign and rebuild of a legacy e-commerce platform serving 50,000+ monthly users. Implemented modern React architecture with TypeScript, resulting in 60% performance improvement and 40% increase in conversion rates.",
            technologies: ["React", "TypeScript", "Next.js", "Tailwind CSS", "Stripe API", "PostgreSQL", "Vercel"],
            startDate: "2023-06",
            endDate: "2023-12",
            status: "completed",
            url: "https://ecommerce-demo.alexandrachen.dev",
            github: "https://github.com/alexandrachen/ecommerce-platform",
            images: [
              "/placeholder.svg?height=300&width=500&text=Homepage+Redesign",
              "/placeholder.svg?height=300&width=500&text=Product+Catalog",
              "/placeholder.svg?height=300&width=500&text=Checkout+Flow",
              "/placeholder.svg?height=300&width=500&text=Admin+Dashboard",
            ],
            achievements: [
              "Improved page load speed by 60% (2.8s to 1.1s)",
              "Increased conversion rate by 40%",
              "Reduced cart abandonment by 25%",
              "Achieved 100/100 Google Lighthouse performance score",
              "Implemented comprehensive A/B testing framework",
              "Built responsive design supporting all device sizes",
            ],
          },
          {
            id: "project-2",
            name: "Design System & Component Library",
            description:
              "Comprehensive design system and React component library used across 8 product teams. Features 80+ components with full TypeScript support, automated testing, and comprehensive documentation.",
            technologies: ["React", "TypeScript", "Storybook", "Styled Components", "Jest", "Chromatic", "Figma"],
            startDate: "2022-09",
            endDate: "2023-03",
            status: "completed",
            url: "https://design-system.alexandrachen.dev",
            github: "https://github.com/alexandrachen/design-system",
            images: [
              "/placeholder.svg?height=300&width=500&text=Component+Gallery",
              "/placeholder.svg?height=300&width=500&text=Design+Tokens",
              "/placeholder.svg?height=300&width=500&text=Documentation+Site",
              "/placeholder.svg?height=300&width=500&text=Storybook+Interface",
            ],
            achievements: [
              "Adopted by 8 product teams, reducing development time by 35%",
              "Maintained 98% test coverage with automated visual regression testing",
              "Documented 80+ components with interactive examples",
              "Established design token system for consistent theming",
              "Reduced design-to-development handoff time by 50%",
              "Implemented automated accessibility testing",
            ],
          },
          {
            id: "project-3",
            name: "Real-time Analytics Dashboard",
            description:
              "Interactive analytics dashboard with real-time data visualization for business intelligence. Features customizable widgets, advanced filtering, and export capabilities.",
            technologies: ["React", "D3.js", "WebSocket", "Node.js", "PostgreSQL", "Redis", "Chart.js"],
            startDate: "2022-01",
            endDate: "2022-08",
            status: "completed",
            url: "https://analytics.alexandrachen.dev",
            github: "https://github.com/alexandrachen/analytics-dashboard",
            images: [
              "/placeholder.svg?height=300&width=500&text=Dashboard+Overview",
              "/placeholder.svg?height=300&width=500&text=Custom+Charts",
              "/placeholder.svg?height=300&width=500&text=Real-time+Data",
              "/placeholder.svg?height=300&width=500&text=Export+Features",
            ],
            achievements: [
              "Processes 10,000+ data points per second in real-time",
              "Reduced report generation time from hours to minutes",
              "Implemented custom charting library with 15+ visualization types",
              "Built drag-and-drop dashboard customization",
              "Achieved sub-100ms data update latency",
              "Supported concurrent usage by 500+ users",
            ],
          },
        ],
        selectedDocuments: [
          {
            id: "doc-1",
            name: "Frontend Engineer Resume.pdf",
            type: "document",
            category: "resume",
            size: "245 KB",
            url: "/placeholder.svg?height=800&width=600&text=Resume+PDF",
            description: "Professional resume highlighting frontend engineering experience",
            tags: ["resume", "frontend", "react", "typescript"],
          },
          {
            id: "doc-2",
            name: "Portfolio Screenshots",
            type: "image",
            category: "portfolio",
            size: "1.2 MB",
            url: "/placeholder.svg?height=600&width=800&text=Portfolio+Screenshot",
            description: "Screenshots of key projects and portfolio website",
            tags: ["portfolio", "projects", "screenshots"],
          },
          {
            id: "doc-3",
            name: "AWS Developer Certificate.pdf",
            type: "document",
            category: "certification",
            size: "180 KB",
            url: "/placeholder.svg?height=800&width=600&text=AWS+Certificate",
            description: "AWS Certified Developer Associate certification",
            tags: ["certification", "aws", "cloud"],
          },
          {
            id: "doc-4",
            name: "Code Samples.zip",
            type: "document",
            category: "code",
            size: "3.4 MB",
            url: "/placeholder.svg?height=400&width=600&text=Code+Archive",
            description: "Collection of code samples demonstrating technical skills",
            tags: ["code", "samples", "react", "typescript"],
          },
          {
            id: "doc-5",
            name: "Recommendation Letter - Tech Lead.pdf",
            type: "document",
            category: "reference",
            size: "156 KB",
            url: "/placeholder.svg?height=800&width=600&text=Recommendation+Letter",
            description: "Letter of recommendation from previous tech lead",
            tags: ["reference", "recommendation", "leadership"],
          },
        ],
      },
      description:
        "Complete application template for senior frontend engineering roles with comprehensive experience data",
      tags: ["frontend", "react", "typescript", "senior"],
      usage_count: 15,
      created_at: "2024-01-01T00:00:00Z",
      updated_at: "2024-01-01T00:00:00Z",
      user_id: "user-1",
    },
    {
      id: "2",
      name: "Product Manager Template",
      type: "complete_application",
      target_role: "product-manager",
      data: {
        layout: "professional",
        colors: { primary: "#059669", secondary: "#6b7280" },
        sections: ["summary", "experience", "education", "skills", "projects"],
        personalInfo: {
          fullName: "Marcus Rodriguez",
          email: "marcus.rodriguez@email.com",
          phone: "(555) 987-6543",
          location: "New York, NY",
          linkedin: "linkedin.com/in/marcusrodriguez",
          github: "",
          portfolio: "marcusrodriguez.pm",
          profileImage: "/placeholder.svg?height=200&width=200&text=MR",
        },
        coverLetterData: {
          recipientName: "Jennifer Kim",
          recipientTitle: "VP of Product",
          companyAddress: "ProductCorp\n456 Innovation Ave\nNew York, NY 10001",
          date: "2024-01-15",
          subject: "Application for Senior Product Manager Position",
          salutation: "Dear Ms. Kim,",
          openingParagraph:
            "I am excited to apply for the Senior Product Manager position at ProductCorp. With over 5 years of experience driving product strategy and execution at high-growth startups, I have consistently delivered products that drive user engagement and business growth. My track record includes launching 3 successful products that generated over $10M in combined revenue.",
          bodyParagraphs:
            "In my current role as Product Manager at GrowthTech, I lead a cross-functional team of 12 engineers, designers, and data analysts to deliver features that serve 500,000+ monthly active users. I successfully launched our mobile app, which achieved 100,000 downloads in the first month and maintains a 4.8-star rating. My data-driven approach to product development has resulted in a 35% increase in user retention and 50% growth in revenue per user.\n\nWhat excites me most about ProductCorp is your commitment to solving complex problems through innovative technology. I am particularly drawn to your recent expansion into AI-powered features, as I have experience leading product initiatives that leverage machine learning to enhance user experience. My background in both B2B and B2C products, combined with my technical understanding and business acumen, positions me well to contribute to ProductCorp's continued growth.\n\nI excel at translating complex technical concepts into clear product requirements and building consensus among diverse stakeholders. My collaborative leadership style and focus on user-centric design have consistently resulted in products that exceed both user expectations and business objectives.",
          closingParagraph:
            "I would love the opportunity to discuss how my product management expertise and passion for innovation can help ProductCorp achieve its ambitious goals. Thank you for your consideration, and I look forward to hearing from you.",
          signOff: "Sincerely,",
        },
        resumeData: {
          summary:
            "Results-driven Product Manager with 5+ years of experience leading cross-functional teams to deliver innovative products that drive user engagement and business growth. Proven track record of launching successful products from concept to market, with expertise in data-driven decision making, user research, and agile development methodologies. Passionate about creating products that solve real user problems and deliver measurable business value.",
          companies: [
            {
              id: "company-1",
              name: "GrowthTech Solutions",
              location: "New York, NY",
              website: "https://growthtech.com",
              logo: "/placeholder.svg?height=48&width=48&text=GT",
              roles: [
                {
                  id: "role-1",
                  title: "Senior Product Manager",
                  startDate: "2022-01",
                  endDate: "",
                  current: true,
                  description:
                    "Lead product strategy and execution for B2B SaaS platform serving 500,000+ monthly active users. Manage cross-functional team of 12 engineers, designers, and analysts to deliver high-impact features and drive business growth.",
                  achievements: [
                    "Launched mobile app achieving 100,000 downloads in first month",
                    "Increased user retention by 35% through data-driven feature optimization",
                    "Grew revenue per user by 50% via premium feature development",
                    "Led product discovery resulting in 3 new revenue streams worth $2M ARR",
                    "Implemented OKR framework improving team alignment and delivery speed",
                  ],
                  technologies: ["Mixpanel", "Figma", "Jira", "Confluence", "SQL", "Python", "A/B Testing"],
                },
                {
                  id: "role-2",
                  title: "Product Manager",
                  startDate: "2020-06",
                  endDate: "2021-12",
                  current: false,
                  description:
                    "Managed product roadmap for core platform features, working closely with engineering and design teams to deliver user-centric solutions. Conducted user research and competitive analysis to inform product decisions.",
                  achievements: [
                    "Delivered 15+ major features with 98% on-time delivery rate",
                    "Reduced customer churn by 25% through improved onboarding experience",
                    "Increased feature adoption by 40% via user research and iterative design",
                    "Established product analytics framework tracking 50+ key metrics",
                  ],
                  technologies: ["Google Analytics", "Hotjar", "UserVoice", "Sketch", "Slack", "Asana"],
                },
              ],
            },
            {
              id: "company-2",
              name: "StartupABC",
              location: "San Francisco, CA",
              website: "https://startupabc.com",
              logo: "/placeholder.svg?height=48&width=48&text=SA",
              roles: [
                {
                  id: "role-3",
                  title: "Associate Product Manager",
                  startDate: "2019-03",
                  endDate: "2020-05",
                  current: false,
                  description:
                    "Supported product development for early-stage fintech startup. Collaborated with founders to define product vision and execute go-to-market strategy for MVP launch.",
                  achievements: [
                    "Contributed to MVP that secured $5M Series A funding",
                    "Conducted 100+ user interviews to validate product-market fit",
                    "Designed and launched beta program with 500 early adopters",
                    "Achieved 85% user satisfaction score in post-launch surveys",
                  ],
                  technologies: ["Amplitude", "Intercom", "Notion", "Miro", "Zoom", "Typeform"],
                },
              ],
            },
          ],
          gapYearActivities: [
            {
              id: "gap-1",
              type: "education",
              title: "Product Management Certification Program",
              description:
                "Intensive 4-month certification program covering product strategy, user research, data analysis, and agile methodologies. Completed capstone project developing go-to-market strategy for a new SaaS product.",
              startDate: "2018-11",
              endDate: "2019-02",
              location: "Online",
              achievements: [
                "Graduated with distinction (top 10% of cohort)",
                "Completed 8 real-world product case studies",
                "Built comprehensive product roadmap for capstone project",
                "Received mentorship from senior PMs at Google and Facebook",
              ],
            },
          ],
          education: {
            degree: {
              id: "degree-1",
              title: "Master of Business Administration (MBA)",
              institution: "NYU Stern School of Business",
              location: "New York, NY",
              graduationYear: "2018",
              gpa: "3.9",
              coursework: [
                "Product Strategy",
                "Digital Marketing",
                "Data Analytics",
                "Operations Management",
                "Entrepreneurship",
                "Technology Management",
                "Consumer Behavior",
              ],
            },
            certifications: [
              {
                id: "cert-1",
                name: "Certified Scrum Product Owner (CSPO)",
                issuer: "Scrum Alliance",
                date: "2023-06",
                expirationDate: "2025-06",
                credentialId: "CSPO-789123",
              },
              {
                id: "cert-2",
                name: "Google Analytics Individual Qualification",
                issuer: "Google",
                date: "2023-01",
                expirationDate: "2024-01",
                credentialId: "GAIQ-456789",
              },
              {
                id: "cert-3",
                name: "Product Management Certificate",
                issuer: "Product School",
                date: "2022-08",
                expirationDate: "",
                credentialId: "PS-PM-321654",
              },
            ],
          },
          skills: {
            frontend: [
              { name: "Product Strategy", rating: 9 },
              { name: "User Research", rating: 8 },
              { name: "Data Analysis", rating: 8 },
              { name: "A/B Testing", rating: 7 },
            ],
            backend: [
              { name: "SQL", rating: 7 },
              { name: "Python", rating: 6 },
              { name: "API Design", rating: 6 },
            ],
            cloud: [
              { name: "Google Analytics", rating: 9 },
              { name: "Mixpanel", rating: 8 },
              { name: "Amplitude", rating: 7 },
              { name: "Tableau", rating: 6 },
            ],
            design: [
              { name: "Figma", rating: 7 },
              { name: "User Experience Design", rating: 8 },
              { name: "Wireframing", rating: 8 },
              { name: "Prototyping", rating: 7 },
            ],
            database: [
              { name: "Product Analytics", rating: 9 },
              { name: "Market Research", rating: 8 },
              { name: "Competitive Analysis", rating: 8 },
            ],
          },
          languages: [
            { id: "lang-1", name: "English", code: "EN", level: "Native", rating: 10, flag: "🇺🇸" },
            { id: "lang-2", name: "Spanish", code: "ES", level: "Fluent", rating: 9, flag: "🇪🇸" },
            { id: "lang-3", name: "Portuguese", code: "PT", level: "Conversational", rating: 6, flag: "🇧🇷" },
          ],
        },
        projectsData: [
          {
            id: "project-1",
            name: "Mobile App Launch Strategy",
            description:
              "Led end-to-end product development and launch of mobile application for existing web platform. Coordinated cross-functional team of 8 members and achieved 100,000 downloads in first month.",
            technologies: ["Product Strategy", "User Research", "A/B Testing", "Analytics", "Agile", "Scrum"],
            startDate: "2023-03",
            endDate: "2023-09",
            status: "completed",
            url: "https://apps.apple.com/app/growthtech-mobile",
            github: "",
            images: [
              "/placeholder.svg?height=300&width=500&text=App+Store+Listing",
              "/placeholder.svg?height=300&width=500&text=User+Journey+Map",
              "/placeholder.svg?height=300&width=500&text=Feature+Roadmap",
              "/placeholder.svg?height=300&width=500&text=Launch+Metrics",
            ],
            achievements: [
              "Achieved 100,000 downloads in first month",
              "Maintained 4.8-star App Store rating",
              "Increased overall platform engagement by 25%",
              "Generated $500K additional monthly revenue",
              "Reduced customer acquisition cost by 30%",
              "Won 'Best Mobile Product' at TechCrunch Awards",
            ],
          },
          {
            id: "project-2",
            name: "AI-Powered Recommendation Engine",
            description:
              "Product strategy and implementation of machine learning-powered recommendation system that increased user engagement by 40% and revenue per user by 35%.",
            technologies: ["Machine Learning", "Product Analytics", "User Testing", "Data Science", "Python"],
            startDate: "2022-08",
            endDate: "2023-02",
            status: "completed",
            url: "https://growthtech.com/features/recommendations",
            github: "",
            images: [
              "/placeholder.svg?height=300&width=500&text=Recommendation+Interface",
              "/placeholder.svg?height=300&width=500&text=ML+Model+Performance",
              "/placeholder.svg?height=300&width=500&text=User+Engagement+Metrics",
              "/placeholder.svg?height=300&width=500&text=A/B+Test+Results",
            ],
            achievements: [
              "Increased user engagement by 40%",
              "Improved revenue per user by 35%",
              "Achieved 92% recommendation accuracy",
              "Reduced content discovery time by 60%",
              "Implemented real-time personalization for 500K+ users",
              "Generated $2M additional annual revenue",
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
            tags: ["resume", "product", "management", "strategy"],
          },
          {
            id: "doc-2",
            name: "Product Portfolio.pdf",
            type: "document",
            category: "portfolio",
            size: "2.1 MB",
            url: "/placeholder.svg?height=800&width=600&text=Product+Portfolio",
            description: "Comprehensive portfolio showcasing product launches and metrics",
            tags: ["portfolio", "products", "metrics", "case-studies"],
          },
          {
            id: "doc-3",
            name: "CSPO Certification.pdf",
            type: "document",
            category: "certification",
            size: "145 KB",
            url: "/placeholder.svg?height=800&width=600&text=CSPO+Certificate",
            description: "Certified Scrum Product Owner certification",
            tags: ["certification", "scrum", "agile"],
          },
        ],
      },
      description: "Comprehensive template for product management roles with proven track record",
      tags: ["product", "management", "strategy", "analytics"],
      usage_count: 8,
      created_at: "2024-01-01T00:00:00Z",
      updated_at: "2024-01-01T00:00:00Z",
      user_id: "user-1",
    },
    {
      id: "3",
      name: "Data Scientist Template",
      type: "complete_application",
      target_role: "data-scientist",
      data: {
        layout: "technical",
        colors: { primary: "#7c3aed", secondary: "#64748b" },
        sections: ["summary", "experience", "education", "skills", "projects"],
        personalInfo: {
          fullName: "Dr. Sarah Kim",
          email: "sarah.kim@email.com",
          phone: "(555) 456-7890",
          location: "Seattle, WA",
          linkedin: "linkedin.com/in/sarahkimdata",
          github: "github.com/sarahkimdata",
          portfolio: "sarahkim.data",
          profileImage: "/placeholder.svg?height=200&width=200&text=SK",
        },
        coverLetterData: {
          recipientName: "Dr. Michael Chen",
          recipientTitle: "Head of Data Science",
          companyAddress: "DataCorp Analytics\n789 Data Drive\nSeattle, WA 98101",
          date: "2024-01-15",
          subject: "Application for Senior Data Scientist Position",
          salutation: "Dear Dr. Chen,",
          openingParagraph:
            "I am writing to express my strong interest in the Senior Data Scientist position at DataCorp Analytics. With a Ph.D. in Statistics and over 4 years of experience applying machine learning and statistical modeling to solve complex business problems, I am excited about the opportunity to contribute to your team's innovative data science initiatives.",
          bodyParagraphs:
            "In my current role as Data Scientist at TechAnalytics, I have successfully developed and deployed machine learning models that have generated over $5M in cost savings and revenue optimization. My expertise spans the entire data science pipeline, from data collection and preprocessing to model development, validation, and production deployment. I have particular strength in deep learning, natural language processing, and time series forecasting.\n\nWhat draws me to DataCorp is your commitment to using data science to drive meaningful business impact across diverse industries. I am particularly excited about your recent work in healthcare analytics, as I have experience developing predictive models for patient outcomes and have published research on medical data analysis. My combination of strong theoretical foundation and practical implementation experience positions me well to contribute to DataCorp's mission of transforming data into actionable insights.\n\nI excel at communicating complex technical concepts to non-technical stakeholders and have a proven track record of collaborating with cross-functional teams to translate business requirements into data science solutions. My research background has also given me strong skills in experimental design and statistical rigor, which I apply to ensure the reliability and validity of all my analyses.",
          closingParagraph:
            "I would welcome the opportunity to discuss how my data science expertise and passion for solving complex problems can contribute to DataCorp's continued success. Thank you for considering my application, and I look forward to hearing from you.",
          signOff: "Best regards,",
        },
        resumeData: {
          summary:
            "Data Scientist with Ph.D. in Statistics and 4+ years of experience developing and deploying machine learning models that drive business value. Expertise in deep learning, natural language processing, and statistical modeling with proven track record of generating $5M+ in cost savings and revenue optimization. Strong background in research and publication with ability to translate complex technical concepts into actionable business insights.",
          companies: [
            {
              id: "company-1",
              name: "TechAnalytics Corp",
              location: "Seattle, WA",
              website: "https://techanalytics.com",
              logo: "/placeholder.svg?height=48&width=48&text=TA",
              roles: [
                {
                  id: "role-1",
                  title: "Senior Data Scientist",
                  startDate: "2022-08",
                  endDate: "",
                  current: true,
                  description:
                    "Lead data science initiatives for predictive analytics and machine learning solutions. Develop and deploy models that serve millions of users and drive key business metrics across multiple product lines.",
                  achievements: [
                    "Developed recommendation system increasing revenue by $3M annually",
                    "Built fraud detection model reducing losses by 45%",
                    "Led team of 4 data scientists on customer churn prediction project",
                    "Published 3 papers in top-tier machine learning conferences",
                    "Implemented MLOps pipeline reducing model deployment time by 70%",
                  ],
                  technologies: [
                    "Python",
                    "TensorFlow",
                    "PyTorch",
                    "Scikit-learn",
                    "SQL",
                    "AWS",
                    "Docker",
                    "Kubernetes",
                  ],
                },
                {
                  id: "role-2",
                  title: "Data Scientist",
                  startDate: "2020-09",
                  endDate: "2022-07",
                  current: false,
                  description:
                    "Developed machine learning models for various business applications including customer segmentation, demand forecasting, and pricing optimization. Collaborated with product and engineering teams to integrate models into production systems.",
                  achievements: [
                    "Built demand forecasting model improving inventory efficiency by 30%",
                    "Developed customer segmentation algorithm used by marketing team",
                    "Created A/B testing framework for model evaluation",
                    "Reduced model training time by 50% through optimization techniques",
                  ],
                  technologies: ["Python", "R", "Pandas", "NumPy", "Matplotlib", "Jupyter", "Git", "PostgreSQL"],
                },
              ],
            },
            {
              id: "company-2",
              name: "University of Washington",
              location: "Seattle, WA",
              website: "https://uw.edu",
              logo: "/placeholder.svg?height=48&width=48&text=UW",
              roles: [
                {
                  id: "role-3",
                  title: "Research Assistant",
                  startDate: "2018-09",
                  endDate: "2020-08",
                  current: false,
                  description:
                    "Conducted research in statistical machine learning and Bayesian methods. Collaborated with interdisciplinary teams on projects involving healthcare data analysis and environmental modeling.",
                  achievements: [
                    "Published 5 peer-reviewed papers in top statistics journals",
                    "Developed novel Bayesian method for missing data imputation",
                    "Received Best Paper Award at International Conference on Machine Learning",
                    "Mentored 6 undergraduate research students",
                  ],
                  technologies: ["R", "Python", "MATLAB", "Stan", "BUGS", "LaTeX", "Git"],
                },
              ],
            },
          ],
          gapYearActivities: [
            {
              id: "gap-1",
              type: "education",
              title: "Deep Learning Specialization",
              description:
                "Completed comprehensive deep learning specialization covering neural networks, CNNs, RNNs, and advanced architectures. Applied knowledge to computer vision and natural language processing projects.",
              startDate: "2020-06",
              endDate: "2020-08",
              location: "Online (Coursera)",
              achievements: [
                "Completed 5-course specialization with 98% average score",
                "Built image classification model achieving 95% accuracy",
                "Developed sentiment analysis system for social media data",
                "Implemented transformer architecture from scratch",
              ],
            },
          ],
          education: {
            degree: {
              id: "degree-1",
              title: "Ph.D. in Statistics",
              institution: "University of Washington",
              location: "Seattle, WA",
              graduationYear: "2020",
              gpa: "3.95",
              coursework: [
                "Statistical Machine Learning",
                "Bayesian Statistics",
                "Time Series Analysis",
                "Multivariate Statistics",
                "Computational Statistics",
                "Experimental Design",
                "Mathematical Statistics",
              ],
            },
            certifications: [
              {
                id: "cert-1",
                name: "AWS Certified Machine Learning - Specialty",
                issuer: "Amazon Web Services",
                date: "2023-05",
                expirationDate: "2026-05",
                credentialId: "AWS-MLS-98765",
              },
              {
                id: "cert-2",
                name: "TensorFlow Developer Certificate",
                issuer: "Google",
                date: "2022-11",
                expirationDate: "",
                credentialId: "TF-DEV-54321",
              },
              {
                id: "cert-3",
                name: "Deep Learning Specialization",
                issuer: "DeepLearning.AI",
                date: "2020-08",
                expirationDate: "",
                credentialId: "DL-SPEC-12345",
              },
            ],
          },
          skills: {
            frontend: [
              { name: "Python", rating: 10 },
              { name: "R", rating: 9 },
              { name: "SQL", rating: 9 },
              { name: "MATLAB", rating: 7 },
            ],
            backend: [
              { name: "TensorFlow", rating: 9 },
              { name: "PyTorch", rating: 9 },
              { name: "Scikit-learn", rating: 10 },
              { name: "Keras", rating: 8 },
              { name: "XGBoost", rating: 8 },
            ],
            cloud: [
              { name: "AWS", rating: 8 },
              { name: "Google Cloud", rating: 7 },
              { name: "Docker", rating: 7 },
              { name: "Kubernetes", rating: 6 },
              { name: "MLflow", rating: 8 },
            ],
            design: [
              { name: "Matplotlib", rating: 9 },
              { name: "Seaborn", rating: 9 },
              { name: "Plotly", rating: 8 },
              { name: "Tableau", rating: 7 },
            ],
            database: [
              { name: "PostgreSQL", rating: 8 },
              { name: "MongoDB", rating: 6 },
              { name: "Redis", rating: 5 },
              { name: "Elasticsearch", rating: 6 },
            ],
          },
          languages: [
            { id: "lang-1", name: "English", code: "EN", level: "Native", rating: 10, flag: "🇺🇸" },
            { id: "lang-2", name: "Korean", code: "KO", level: "Native", rating: 10, flag: "🇰🇷" },
            { id: "lang-3", name: "Python", code: "PY", level: "Expert", rating: 10, flag: "🐍" },
          ],
        },
        projectsData: [
          {
            id: "project-1",
            name: "Healthcare Predictive Analytics Platform",
            description:
              "Developed machine learning platform for predicting patient readmission risk and optimizing treatment protocols. Deployed models serve 50+ hospitals and have improved patient outcomes while reducing costs by $2M annually.",
            technologies: ["Python", "TensorFlow", "AWS", "PostgreSQL", "Docker", "Kubernetes", "MLflow"],
            startDate: "2023-01",
            endDate: "2023-11",
            status: "completed",
            url: "https://healthcare-analytics.sarahkim.data",
            github: "https://github.com/sarahkimdata/healthcare-ml",
            images: [
              "/placeholder.svg?height=300&width=500&text=Patient+Dashboard",
              "/placeholder.svg?height=300&width=500&text=Risk+Prediction+Model",
              "/placeholder.svg?height=300&width=500&text=Treatment+Optimization",
              "/placeholder.svg?height=300&width=500&text=Outcome+Analytics",
            ],
            achievements: [
              "Achieved 87% accuracy in readmission prediction",
              "Reduced average hospital stay by 1.2 days",
              "Generated $2M annual cost savings across partner hospitals",
              "Improved patient satisfaction scores by 15%",
              "Deployed to 50+ healthcare facilities",
              "Published findings in Journal of Medical Informatics",
            ],
          },
          {
            id: "project-2",
            name: "Real-time Fraud Detection System",
            description:
              "Built deep learning system for real-time fraud detection processing 100,000+ transactions per minute. Reduced false positives by 60% while maintaining 99.5% fraud detection accuracy.",
            technologies: ["Python", "PyTorch", "Apache Kafka", "Redis", "PostgreSQL", "Docker", "Grafana"],
            startDate: "2022-03",
            endDate: "2022-10",
            status: "completed",
            url: "https://fraud-detection.sarahkim.data",
            github: "https://github.com/sarahkimdata/fraud-detection",
            images: [
              "/placeholder.svg?height=300&width=500&text=Real-time+Dashboard",
              "/placeholder.svg?height=300&width=500&text=Model+Performance",
              "/placeholder.svg?height=300&width=500&text=Alert+System",
              "/placeholder.svg?height=300&width=500&text=Analytics+Reports",
            ],
            achievements: [
              "Processes 100,000+ transactions per minute",
              "Achieved 99.5% fraud detection accuracy",
              "Reduced false positives by 60%",
              "Prevented $5M in fraudulent transactions",
              "Decreased investigation time by 75%",
              "Implemented real-time alerting system",
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
          {
            id: "doc-2",
            name: "Research Publications.pdf",
            type: "document",
            category: "research",
            size: "1.8 MB",
            url: "/placeholder.svg?height=800&width=600&text=Research+Papers",
            description: "Collection of published research papers and conference presentations",
            tags: ["research", "publications", "machine-learning", "statistics"],
          },
          {
            id: "doc-3",
            name: "AWS ML Certification.pdf",
            type: "document",
            category: "certification",
            size: "201 KB",
            url: "/placeholder.svg?height=800&width=600&text=AWS+ML+Certificate",
            description: "AWS Certified Machine Learning - Specialty certification",
            tags: ["certification", "aws", "machine-learning"],
          },
        ],
      },
      description: "Advanced template for data science roles with research background and technical expertise",
      tags: ["data-science", "machine-learning", "python", "research"],
      usage_count: 12,
      created_at: "2024-01-01T00:00:00Z",
      updated_at: "2024-01-01T00:00:00Z",
      user_id: "user-1",
    },
  ])

  const [searchTerm, setSearchTerm] = useState("")
  const [selectedRole, setSelectedRole] = useState<string>("all")
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null)
  const [isApplicationDialogOpen, setIsApplicationDialogOpen] = useState(false)

  const filteredTemplates = templates.filter((template) => {
    const matchesSearch =
      template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      template.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      template.tags.some((tag) => tag.toLowerCase().includes(searchTerm.toLowerCase()))

    const matchesRole = selectedRole === "all" || template.target_role === selectedRole

    return matchesSearch && matchesRole
  })

  const handleUseTemplate = (template: Template) => {
    setSelectedTemplate(template)
    setIsApplicationDialogOpen(true)
  }

  const handleApplicationCreated = async (applicationData: any) => {
    try {
      await onApplicationCreate(applicationData)

      // Update usage count
      setTemplates((prev) =>
        prev.map((t) => (t.id === selectedTemplate?.id ? { ...t, usage_count: t.usage_count + 1 } : t)),
      )

      setIsApplicationDialogOpen(false)
      setSelectedTemplate(null)

      toast({
        title: "Application Created",
        description: "Your new application has been created from the template.",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create application from template.",
        variant: "destructive",
      })
    }
  }

  const handleDeleteTemplate = (templateId: string) => {
    setTemplates((prev) => prev.filter((t) => t.id !== templateId))
    toast({
      title: "Template Deleted",
      description: "The template has been removed from your library.",
    })
  }

  const handleDuplicateTemplate = (template: Template) => {
    const newTemplate: Template = {
      ...template,
      id: `${template.id}-copy-${Date.now()}`,
      name: `${template.name} (Copy)`,
      usage_count: 0,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }

    setTemplates((prev) => [newTemplate, ...prev])
    toast({
      title: "Template Duplicated",
      description: "A copy of the template has been created.",
    })
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" onClick={onBack} className="flex items-center gap-2">
            <ArrowLeft className="w-4 h-4" />
            Back to Dashboard
          </Button>
          <div>
            <h1 className="text-2xl font-bold">Template Manager</h1>
            <p className="text-gray-600">Manage and apply job application templates</p>
          </div>
        </div>
        <Button onClick={() => setIsCreateDialogOpen(true)} className="flex items-center gap-2">
          <Plus className="w-4 h-4" />
          Create Template
        </Button>
      </div>

      {/* Filters */}
      <div className="flex gap-4">
        <div className="flex-1">
          <Input placeholder="Search templates..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
        </div>
        <Select value={selectedRole} onValueChange={setSelectedRole}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Filter by role" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Roles</SelectItem>
            {Object.entries(ROLE_DEFINITIONS).map(([key, role]) => (
              <SelectItem key={key} value={key}>
                {role.title}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Templates Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTemplates.map((template) => (
          <Card key={template.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="text-lg">{template.name}</CardTitle>
                  <CardDescription className="mt-2">{template.description}</CardDescription>
                </div>
                <div className="flex items-center gap-1 ml-2">
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => handleDuplicateTemplate(template)}
                    title="Duplicate template"
                  >
                    <Copy className="w-4 h-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => handleDeleteTemplate(template.id)}
                    title="Delete template"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Role Badge */}
              {template.target_role && ROLE_DEFINITIONS[template.target_role as RoleType] && (
                <div className="flex items-center gap-2">
                  <Briefcase className="w-4 h-4 text-gray-500" />
                  <Badge variant="secondary">{ROLE_DEFINITIONS[template.target_role as RoleType].title}</Badge>
                </div>
              )}

              {/* Tags */}
              <div className="flex flex-wrap gap-2">
                {template.tags.map((tag, index) => (
                  <Badge key={index} variant="outline" className="text-xs">
                    {tag}
                  </Badge>
                ))}
              </div>

              {/* Usage Stats */}
              <div className="flex items-center justify-between text-sm text-gray-600">
                <div className="flex items-center gap-1">
                  <Star className="w-4 h-4" />
                  <span>Used {template.usage_count} times</span>
                </div>
                <span>{new Date(template.updated_at).toLocaleDateString()}</span>
              </div>

              {/* Actions */}
              <div className="flex gap-2 pt-2">
                <Button onClick={() => handleUseTemplate(template)} className="flex-1 flex items-center gap-2">
                  <Sparkles className="w-4 h-4" />
                  Use Template
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Empty State */}
      {filteredTemplates.length === 0 && (
        <div className="text-center py-12">
          <Briefcase className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No templates found</h3>
          <p className="text-gray-600 mb-4">
            {searchTerm || selectedRole !== "all"
              ? "Try adjusting your search or filter criteria."
              : "Create your first template to get started."}
          </p>
          <Button onClick={() => setIsCreateDialogOpen(true)} className="flex items-center gap-2">
            <Plus className="w-4 h-4" />
            Create Template
          </Button>
        </div>
      )}

      {/* Create Template Dialog */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Create New Template</DialogTitle>
            <DialogDescription>
              Create a new job application template from scratch or based on an existing application.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="template-name">Template Name</Label>
              <Input id="template-name" placeholder="e.g., Senior Developer Template" />
            </div>
            <div>
              <Label htmlFor="template-description">Description</Label>
              <Textarea id="template-description" placeholder="Describe what this template is for..." rows={3} />
            </div>
            <div>
              <Label htmlFor="target-role">Target Role</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select target role" />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(ROLE_DEFINITIONS).map(([key, role]) => (
                    <SelectItem key={key} value={key}>
                      {role.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex gap-2 pt-4">
              <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)} className="flex-1">
                Cancel
              </Button>
              <Button onClick={() => setIsCreateDialogOpen(false)} className="flex-1">
                Create Template
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Template Application Dialog */}
      {selectedTemplate && (
        <TemplateApplicationDialog
          isOpen={isApplicationDialogOpen}
          onClose={() => {
            setIsApplicationDialogOpen(false)
            setSelectedTemplate(null)
          }}
          template={selectedTemplate}
          onApplicationCreate={handleApplicationCreated}
        />
      )}
    </div>
  )
}
