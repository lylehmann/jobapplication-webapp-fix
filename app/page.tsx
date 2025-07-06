"use client"

import { useState } from "react"
import { ApplicationManager } from "@/components/application-manager"
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/toaster"

// Sample application data with German/EU standards
const sampleApplication = {
  id: "sample-app-1",
  user_id: "demo-user",
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
  status: "draft",
  job_title: "Senior Frontend Developer",
  company: "TechCorp GmbH",
  personal_info: {
    fullName: "Max Mustermann",
    email: "max.mustermann@email.de",
    phone: "+49 30 12345678",
    location: "Berlin, Deutschland",
    linkedin: "linkedin.com/in/maxmustermann",
    github: "github.com/maxmustermann",
    portfolio: "maxmustermann.dev",
    profileImage: "/placeholder.svg?height=200&width=200&text=MM",
  },
  cover_letter_data: {
    date: new Date().toISOString().split("T")[0],
    recipientName: "Frau Schmidt",
    recipientTitle: "Personalmanagerin",
    company: "TechCorp GmbH",
    address: "Unter den Linden 1\n10117 Berlin",
    subject: "Bewerbung als Senior Frontend Developer",
    salutation: "Sehr geehrte Frau Schmidt,",
    openingParagraph:
      "mit großem Interesse habe ich Ihre Stellenausschreibung für die Position als Senior Frontend Developer gelesen. Als erfahrener Entwickler mit über 5 Jahren Expertise in modernen Web-Technologien möchte ich mich hiermit bei Ihnen bewerben.",
    bodyParagraphs:
      "In meiner aktuellen Position bei Digital Solutions AG entwickle ich komplexe React-Anwendungen und leite ein Team von 4 Entwicklern. Dabei konnte ich die Performance unserer Hauptanwendung um 40% verbessern und die Entwicklungszeit neuer Features um 30% reduzieren.\n\nMeine Expertise umfasst moderne Frontend-Technologien wie React, TypeScript, Next.js sowie Backend-Integration mit Node.js und GraphQL. Besonders stolz bin ich auf die Entwicklung einer innovativen E-Commerce-Plattform, die heute von über 100.000 Nutzern täglich verwendet wird.\n\nIhre Stellenausschreibung hat mich besonders angesprochen, da Sie Wert auf moderne Entwicklungspraktiken und kontinuierliche Weiterbildung legen. Genau diese Philosophie teile ich und würde gerne meine Erfahrungen in Ihr Team einbringen.",
    closingParagraph:
      "Über eine Einladung zu einem persönlichen Gespräch würde ich mich sehr freuen. Gerne stelle ich Ihnen meine Projekte und Erfahrungen ausführlicher vor.",
    signOff: "Mit freundlichen Grüßen",
  },
  resume_data: {
    summary:
      "Erfahrener Senior Frontend Developer mit 5+ Jahren Expertise in der Entwicklung skalierbarer Web-Anwendungen. Spezialisiert auf React, TypeScript und moderne JavaScript-Frameworks. Bewährte Führungserfahrung in agilen Teams und Leidenschaft für Performance-Optimierung und User Experience.",
    experience: [
      {
        id: "exp-1",
        title: "Senior Frontend Developer",
        company: "Digital Solutions AG",
        location: "Berlin, Deutschland",
        startDate: "2021-03",
        endDate: "",
        current: true,
        description:
          "Leitung der Frontend-Entwicklung für E-Commerce-Plattformen mit React und TypeScript. Verantwortlich für Architekturentscheidungen und Mentoring von Junior-Entwicklern.",
        achievements: [
          "Performance-Verbesserung der Hauptanwendung um 40% durch Code-Splitting und Lazy Loading",
          "Implementierung eines Design Systems, das die Entwicklungszeit um 30% reduzierte",
          "Erfolgreiche Migration von Legacy-Code zu modernen React Hooks und Context API",
          "Aufbau und Leitung eines 4-köpfigen Frontend-Teams",
        ],
        technologies: ["React", "TypeScript", "Next.js", "GraphQL", "Styled Components", "Jest", "Cypress"],
      },
      {
        id: "exp-2",
        title: "Frontend Developer",
        company: "StartupTech Berlin",
        location: "Berlin, Deutschland",
        startDate: "2019-06",
        endDate: "2021-02",
        current: false,
        description:
          "Entwicklung von responsiven Web-Anwendungen für FinTech-Startup. Enge Zusammenarbeit mit UX/UI-Designern und Backend-Entwicklern.",
        achievements: [
          "Entwicklung einer mobilen Trading-App mit React Native",
          "Implementierung von Real-time Data Visualization mit D3.js",
          "Aufbau einer CI/CD-Pipeline für automatisierte Tests und Deployments",
        ],
        technologies: ["React", "JavaScript", "Redux", "D3.js", "React Native", "Node.js"],
      },
      {
        id: "exp-3",
        title: "Junior Frontend Developer",
        company: "WebAgentur München",
        location: "München, Deutschland",
        startDate: "2018-09",
        endDate: "2019-05",
        current: false,
        description:
          "Entwicklung von Corporate Websites und E-Commerce-Lösungen. Erste Erfahrungen mit modernen JavaScript-Frameworks und agiler Entwicklung.",
        achievements: [
          "Erfolgreiche Umsetzung von 15+ Kundenprojekten",
          "Einführung von Sass und Build-Tools in den Entwicklungsprozess",
          "Verbesserung der Website-Performance um durchschnittlich 25%",
        ],
        technologies: ["HTML5", "CSS3", "JavaScript", "jQuery", "Sass", "Webpack", "PHP"],
      },
    ],
    education: {
      degree: {
        title: "Bachelor of Science Informatik",
        institution: "Technische Universität Berlin",
        location: "Berlin, Deutschland",
        graduationYear: "2018",
        gpa: "1,8",
        thesis: "Entwicklung einer Progressive Web App für Smart City Services",
      },
      certifications: [
        {
          id: "cert-1",
          name: "AWS Certified Solutions Architect",
          issuer: "Amazon Web Services",
          date: "2023-06",
          expirationDate: "2026-06",
          credentialId: "AWS-CSA-2023-MM",
        },
        {
          id: "cert-2",
          name: "Google Analytics Certified",
          issuer: "Google",
          date: "2022-11",
          expirationDate: "2024-11",
          credentialId: "GA-CERT-2022-MM",
        },
        {
          id: "cert-3",
          name: "Scrum Master Certified",
          issuer: "Scrum Alliance",
          date: "2021-08",
          expirationDate: "",
          credentialId: "CSM-2021-MM",
        },
      ],
    },
    skills: {
      frontend: [
        { name: "React", rating: 5, yearsOfExperience: 4 },
        { name: "TypeScript", rating: 5, yearsOfExperience: 3 },
        { name: "JavaScript (ES6+)", rating: 5, yearsOfExperience: 5 },
        { name: "Next.js", rating: 4, yearsOfExperience: 2 },
        { name: "Vue.js", rating: 3, yearsOfExperience: 1 },
        { name: "HTML5", rating: 5, yearsOfExperience: 5 },
        { name: "CSS3/Sass", rating: 5, yearsOfExperience: 5 },
      ],
      backend: [
        { name: "Node.js", rating: 4, yearsOfExperience: 3 },
        { name: "GraphQL", rating: 4, yearsOfExperience: 2 },
        { name: "REST APIs", rating: 4, yearsOfExperience: 4 },
        { name: "Express.js", rating: 3, yearsOfExperience: 2 },
      ],
      tools: [
        { name: "Git", rating: 5, yearsOfExperience: 5 },
        { name: "Docker", rating: 3, yearsOfExperience: 2 },
        { name: "Webpack", rating: 4, yearsOfExperience: 3 },
        { name: "Jest", rating: 4, yearsOfExperience: 3 },
        { name: "Cypress", rating: 3, yearsOfExperience: 2 },
      ],
      cloud: [
        { name: "AWS", rating: 3, yearsOfExperience: 2 },
        { name: "Vercel", rating: 4, yearsOfExperience: 2 },
        { name: "Netlify", rating: 3, yearsOfExperience: 2 },
      ],
    },
    languages: [
      {
        id: "lang-1",
        name: "Deutsch",
        level: "C2",
        flag: "🇩🇪",
        description: "Muttersprache",
      },
      {
        id: "lang-2",
        name: "English",
        level: "C1",
        flag: "🇬🇧",
        description: "Verhandlungssicher",
      },
      {
        id: "lang-3",
        name: "Español",
        level: "B1",
        flag: "🇪🇸",
        description: "Grundkenntnisse",
      },
    ],
  },
  projects_data: [
    {
      id: "project-1",
      name: "E-Commerce Dashboard",
      description:
        "Entwicklung eines umfassenden Admin-Dashboards für eine E-Commerce-Plattform mit Real-time Analytics, Inventory Management und Customer Support Tools.",
      technologies: ["React", "TypeScript", "Next.js", "GraphQL", "PostgreSQL", "Redis", "Docker"],
      startDate: "2023-01",
      endDate: "2023-08",
      status: "completed",
      url: "https://dashboard.example.com",
      github: "https://github.com/maxmustermann/ecommerce-dashboard",
      achievements: [
        "Reduzierung der Ladezeiten um 60% durch optimierte Datenabfragen",
        "Implementierung von Real-time Updates mit WebSockets",
        "Aufbau einer modularen Komponenten-Bibliothek",
        "Integration von 15+ Third-party APIs",
      ],
      images: [
        "/placeholder.svg?height=300&width=500&text=Dashboard+Overview",
        "/placeholder.svg?height=300&width=500&text=Analytics+View",
        "/placeholder.svg?height=300&width=500&text=Inventory+Management",
      ],
      role: "Lead Frontend Developer",
      teamSize: "4 Entwickler",
      impact: "Steigerung der Admin-Effizienz um 40%",
    },
    {
      id: "project-2",
      name: "Progressive Web App für Smart City",
      description:
        "Entwicklung einer PWA für Bürgerdienste einer deutschen Großstadt. Die App ermöglicht Online-Terminbuchungen, Antragsstellung und Echtzeit-Informationen zu städtischen Services.",
      technologies: ["React", "PWA", "Service Workers", "IndexedDB", "Google Maps API", "Node.js"],
      startDate: "2022-03",
      endDate: "2022-12",
      status: "completed",
      url: "https://smartcity.example.de",
      github: "",
      achievements: [
        "Offline-Funktionalität für kritische Features",
        "Barrierefreie Umsetzung nach WCAG 2.1 AA",
        "Integration mit 8 verschiedenen Behörden-APIs",
        "95% Lighthouse Score für Performance und Accessibility",
      ],
      images: [
        "/placeholder.svg?height=300&width=500&text=PWA+Home",
        "/placeholder.svg?height=300&width=500&text=Service+Booking",
        "/placeholder.svg?height=300&width=500&text=Offline+Mode",
      ],
      role: "Frontend Architect",
      teamSize: "6 Entwickler",
      impact: "30.000+ aktive Nutzer im ersten Jahr",
    },
    {
      id: "project-3",
      name: "React Component Library",
      description:
        "Aufbau einer unternehmensweiten Design System und Component Library für konsistente UI/UX across multiple Produkte.",
      technologies: ["React", "TypeScript", "Storybook", "Styled Components", "Rollup", "npm"],
      startDate: "2021-09",
      endDate: "2022-02",
      status: "completed",
      url: "https://storybook.example.com",
      github: "https://github.com/company/design-system",
      achievements: [
        "50+ wiederverwendbare Komponenten",
        "Automatisierte Visual Regression Tests",
        "Comprehensive Documentation mit Storybook",
        "Adoption in 12+ Produkten",
      ],
      images: [
        "/placeholder.svg?height=300&width=500&text=Component+Library",
        "/placeholder.svg?height=300&width=500&text=Storybook+Docs",
        "/placeholder.svg?height=300&width=500&text=Design+Tokens",
      ],
      role: "Design System Lead",
      teamSize: "3 Entwickler + 2 Designer",
      impact: "50% Reduktion der Entwicklungszeit für neue Features",
    },
  ],
  selected_documents: [],
}

export default function HomePage() {
  const [application, setApplication] = useState(sampleApplication)

  const handleUpdate = async (updates: Partial<typeof application>) => {
    setApplication((prev) => ({
      ...prev,
      ...updates,
      updated_at: new Date().toISOString(),
    }))
  }

  return (
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
      <div className="min-h-screen bg-gray-50">
        <ApplicationManager application={application} onUpdate={handleUpdate} />
        <Toaster />
      </div>
    </ThemeProvider>
  )
}
