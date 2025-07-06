import { ROLE_DEFINITIONS, type RoleType } from "./role-templates"
import type { Database } from "./database.types"

type Template = Database["public"]["Tables"]["templates"]["Row"]
type ApplicationInsert = Database["public"]["Tables"]["applications"]["Insert"]

export interface TemplateApplicationResult {
  success: boolean
  application?: ApplicationInsert
  error?: string
}

export interface TemplatePreview {
  skillsCount: number
  sectionsCount: number
  hasExperience: boolean
  hasProjects: boolean
  hasCoverLetter: boolean
}

export interface TemplateValidation {
  valid: boolean
  errors: string[]
}

export function validateTemplateApplication(template: Template): TemplateValidation {
  const errors: string[] = []

  if (!template) {
    errors.push("Template is required")
    return { valid: false, errors }
  }

  if (!template.target_role) {
    errors.push("Template must have a target role")
  }

  if (!ROLE_DEFINITIONS[template.target_role as RoleType]) {
    errors.push("Invalid target role")
  }

  if (!template.data) {
    errors.push("Template data is missing")
  }

  return {
    valid: errors.length === 0,
    errors,
  }
}

export function getTemplatePreview(template: Template): TemplatePreview {
  const roleData = ROLE_DEFINITIONS[template.target_role as RoleType]

  return {
    skillsCount: roleData?.skills?.length || 0,
    sectionsCount: template.data?.sections?.length || 0,
    hasExperience: roleData?.experience?.length > 0,
    hasProjects: roleData?.projects?.length > 0,
    hasCoverLetter: !!roleData?.coverLetter,
  }
}

export function createApplicationFromTemplate(
  template: Template,
  applicationData: { job_title: string; company: string },
): TemplateApplicationResult {
  try {
    const validation = validateTemplateApplication(template)
    if (!validation.valid) {
      return {
        success: false,
        error: validation.errors.join(", "),
      }
    }

    const roleData = ROLE_DEFINITIONS[template.target_role as RoleType]

    // Create comprehensive application data
    const application: ApplicationInsert = {
      job_title: applicationData.job_title,
      company: applicationData.company,
      target_role: template.target_role,
      status: "draft",
      template_id: template.id,
      personal_info: {
        fullName: "Your Name",
        email: "your.email@example.com",
        phone: "(555) 123-4567",
        location: "Your City, State",
        linkedin: "linkedin.com/in/yourprofile",
        portfolio: "yourportfolio.com",
        github: "github.com/yourusername",
        profileImage: "",
      },
      cover_letter: {
        recipientName: "Hiring Manager",
        recipientTitle: "Human Resources Department",
        companyAddress: `${applicationData.company}\n123 Company Street\nCity, State 12345`,
        date: new Date().toISOString().split("T")[0],
        subject: `Application for ${applicationData.job_title} Position`,
        salutation: "Dear Hiring Manager,",
        openingParagraph: `I am writing to express my strong interest in the ${applicationData.job_title} position at ${applicationData.company}.`,
        bodyParagraphs: roleData.coverLetter,
        closingParagraph:
          "I would welcome the opportunity to discuss how my skills and experience can contribute to your team's success. Thank you for considering my application.",
        signOff: "Sincerely,",
      },
      resume_data: {
        summary: roleData.summary,
        experience: roleData.experienceTemplate.map((exp, index) => ({
          id: `exp-${index + 1}`,
          title: exp.title,
          company: exp.company,
          location: "City, State",
          startDate: "2022-01",
          endDate: exp.duration.includes("Present") ? "" : "2023-12",
          current: exp.duration.includes("Present"),
          description: exp.achievements.join(". ") + ".",
          achievements: exp.achievements,
        })),
        education: {
          degree: {
            id: "degree-1",
            title: "Bachelor of Science in Computer Science",
            institution: "University Name",
            location: "City, State",
            graduationYear: "2020",
            gpa: "3.8",
            coursework: ["Data Structures", "Algorithms", "Software Engineering", "Database Systems"],
          },
          certifications: [
            {
              id: "cert-1",
              name: "AWS Certified Developer",
              issuer: "Amazon Web Services",
              date: "2023",
              expirationDate: "2026",
              credentialId: "AWS-123456",
            },
          ],
          continuingEducation: [
            {
              id: "edu-1",
              title: "Advanced React Development",
              provider: "Online Learning Platform",
              completionDate: "2023",
              hours: 40,
            },
          ],
        },
        skills: {
          frontend: roleData.skills.filter((skill) =>
            ["React", "Vue", "Angular", "JavaScript", "TypeScript", "HTML", "CSS", "Tailwind"].some((tech) =>
              skill.toLowerCase().includes(tech.toLowerCase()),
            ),
          ),
          backend: roleData.skills.filter((skill) =>
            ["Node.js", "Python", "Java", "PHP", "API", "Database"].some((tech) =>
              skill.toLowerCase().includes(tech.toLowerCase()),
            ),
          ),
          cloud: roleData.skills.filter((skill) =>
            ["AWS", "Azure", "Docker", "Kubernetes", "Git"].some((tech) =>
              skill.toLowerCase().includes(tech.toLowerCase()),
            ),
          ),
          design: roleData.skills.filter((skill) =>
            ["Figma", "Sketch", "Adobe", "Design", "UX", "UI", "Prototyping"].some((tech) =>
              skill.toLowerCase().includes(tech.toLowerCase()),
            ),
          ),
        },
        languages: [
          { id: "lang-1", name: "English", code: "EN", level: "Native", flag: "🇺🇸" },
          { id: "lang-2", name: "Spanish", code: "ES", level: "Conversational", flag: "🇪🇸" },
        ],
      },
      projects_data: roleData.projectsTemplate.map((project, index) => ({
        id: `project-${index + 1}`,
        name: project.name,
        description: project.description,
        technologies: project.technologies,
        startDate: "2023-01",
        endDate: "2023-06",
        status: "completed",
        url: project.url || "",
        github: project.url || "",
        images: [],
        achievements: ["Successfully delivered on time", "Positive user feedback"],
      })),
      selected_documents: [],
    }

    return {
      success: true,
      application,
    }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to create application from template",
    }
  }
}
