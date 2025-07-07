"use client"
import Star from "lucide-react/dist/esm/icons/star"
import MapPin from "lucide-react/dist/esm/icons/map-pin"
import Phone from "lucide-react/dist/esm/icons/phone"
import Mail from "lucide-react/dist/esm/icons/mail"
import Globe from "lucide-react/dist/esm/icons/globe"
import Github from "lucide-react/dist/esm/icons/github"
import Linkedin from "lucide-react/dist/esm/icons/linkedin"
import type { Database } from "@/lib/database.types"

type Application = Database["public"]["Tables"]["applications"]["Row"]

interface PrintableResumeProps {
  application: Application
}

export function PrintableResume({ application }: PrintableResumeProps) {
  const personalInfo = application.personal_info || {}
  const resume = application.resume_data || {}

  const formatDate = (dateString: string) => {
    if (!dateString) return ""
    const date = new Date(dateString + "-01")
    return date.toLocaleDateString("de-DE", { month: "2-digit", year: "numeric" })
  }

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star key={i} className={`w-3 h-3 inline ${i < rating ? "fill-black text-black" : "text-gray-300"}`} />
    ))
  }

  return (
    <div
      id="printable-resume"
      className="bg-white mx-auto max-w-none text-black"
      style={{ fontFamily: "Times New Roman, serif", fontSize: "11pt", lineHeight: "1.4" }}
    >
      {/* Clean Header */}
      <div className="mb-8 pb-6 border-gray-300 border-b-2 text-center">
        <h1 className="mb-3 font-bold text-gray-900 text-3xl">{personalInfo.fullName || "Ihr Name"}</h1>
        <div className="mb-4 font-medium text-gray-700 text-lg">{application.job_title || "Gewünschte Position"}</div>

        {/* Contact Info - Clean Layout */}
        <div className="flex flex-wrap justify-center gap-6 text-gray-600 text-sm">
          {personalInfo.email && (
            <div className="flex items-center gap-2">
              <Mail className="w-4 h-4" />
              <span>{personalInfo.email}</span>
            </div>
          )}
          {personalInfo.phone && (
            <div className="flex items-center gap-2">
              <Phone className="w-4 h-4" />
              <span>{personalInfo.phone}</span>
            </div>
          )}
          {personalInfo.location && (
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4" />
              <span>{personalInfo.location}</span>
            </div>
          )}
        </div>

        <div className="flex flex-wrap justify-center gap-6 mt-2 text-gray-600 text-sm">
          {personalInfo.portfolio && (
            <div className="flex items-center gap-2">
              <Globe className="w-4 h-4" />
              <span>{personalInfo.portfolio}</span>
            </div>
          )}
          {personalInfo.github && (
            <div className="flex items-center gap-2">
              <Github className="w-4 h-4" />
              <span>{personalInfo.github}</span>
            </div>
          )}
          {personalInfo.linkedin && (
            <div className="flex items-center gap-2">
              <Linkedin className="w-4 h-4" />
              <span>{personalInfo.linkedin}</span>
            </div>
          )}
        </div>
      </div>

      {/* Professional Summary */}
      {resume.summary && (
        <div className="mb-8">
          <h2 className="mb-4 pb-2 border-gray-300 border-b font-bold text-gray-900 text-lg">BERUFLICHES PROFIL</h2>
          <p className="text-gray-700 text-sm text-justify leading-relaxed">{resume.summary}</p>
        </div>
      )}

      {/* Experience - German Format */}
      {resume.experience && resume.experience.length > 0 && (
        <div className="mb-8">
          <h2 className="mb-6 pb-2 border-gray-300 border-b font-bold text-gray-900 text-lg">BERUFSERFAHRUNG</h2>
          <div className="space-y-6">
            {resume.experience.map((exp: any, index: number) => (
              <div key={exp.id || index} className="flex gap-8">
                {/* Date Column - Left Side - Fixed Width */}
                <div className="flex-shrink-0 pr-4 w-32 text-right">
                  <div className="font-medium text-gray-900 text-sm">
                    {formatDate(exp.startDate)} - {exp.current ? "heute" : formatDate(exp.endDate)}
                  </div>
                  {exp.location && (
                    <div className="flex justify-end items-center gap-1 mt-1 text-gray-500 text-xs">
                      <MapPin className="w-3 h-3" />
                      {exp.location}
                    </div>
                  )}
                </div>

                {/* Content Column - Right Side */}
                <div className="flex-1 pl-4 border-gray-200 border-l">
                  <h3 className="font-bold text-gray-900 text-base">{exp.title}</h3>
                  <div className="mb-3 font-medium text-gray-700 text-sm">{exp.company}</div>

                  <p className="mb-4 text-gray-700 text-sm text-justify leading-relaxed">{exp.description}</p>

                  {exp.achievements && exp.achievements.length > 0 && (
                    <div className="mb-4">
                      <h4 className="mb-2 font-medium text-gray-800 text-sm">Erfolge und Leistungen:</h4>
                      <ul className="space-y-1">
                        {exp.achievements.map((achievement: string, achIndex: number) => (
                          <li key={achIndex} className="flex items-start gap-2 text-gray-700 text-sm">
                            <span className="mt-1 text-blue-600">•</span>
                            <span>{achievement}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {exp.technologies && exp.technologies.length > 0 && (
                    <div className="text-sm">
                      <span className="font-medium text-gray-800">Technologien: </span>
                      <span className="text-gray-700">{exp.technologies.join(", ")}</span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Education */}
      {resume.education && (
        <div className="mb-8">
          <h2 className="mb-6 pb-2 border-gray-300 border-b font-bold text-gray-900 text-lg">BILDUNG</h2>

          {/* Degree */}
          {resume.education.degree && (
            <div className="flex gap-8 mb-6">
              <div className="flex-shrink-0 pr-4 w-32 text-right">
                <div className="font-medium text-gray-900 text-sm">{resume.education.degree.graduationYear}</div>
              </div>
              <div className="flex-1 pl-4 border-gray-200 border-l">
                <h3 className="font-bold text-gray-900 text-base">{resume.education.degree.title}</h3>
                <div className="font-medium text-gray-700 text-sm">{resume.education.degree.institution}</div>
                {resume.education.degree.location && (
                  <div className="text-gray-600 text-sm">{resume.education.degree.location}</div>
                )}
                {resume.education.degree.gpa && (
                  <div className="mt-1 text-gray-700 text-sm">Abschlussnote: {resume.education.degree.gpa}</div>
                )}
                {resume.education.degree.thesis && (
                  <div className="mt-2 text-gray-700 text-sm italic">
                    <strong>Abschlussarbeit:</strong> {resume.education.degree.thesis}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Certifications */}
          {resume.education.certifications && resume.education.certifications.length > 0 && (
            <div>
              <h3 className="mb-4 font-medium text-gray-800 text-sm">Zertifikate</h3>
              <div className="space-y-3">
                {resume.education.certifications.map((cert: any) => (
                  <div key={cert.id} className="flex gap-8">
                    <div className="flex-shrink-0 pr-4 w-32 text-right">
                      <div className="text-gray-900 text-sm">{cert.date && formatDate(cert.date)}</div>
                    </div>
                    <div className="flex-1 pl-4 border-gray-200 border-l">
                      <div className="font-medium text-gray-900 text-sm">{cert.name}</div>
                      <div className="text-gray-700 text-sm">{cert.issuer}</div>
                      {cert.credentialId && <div className="text-gray-500 text-xs">ID: {cert.credentialId}</div>}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Skills */}
      {resume.skills &&
        Object.values(resume.skills).some((skills: any) => Array.isArray(skills) && skills.length > 0) && (
          <div className="mb-8">
            <h2 className="mb-6 pb-2 border-gray-300 border-b font-bold text-gray-900 text-lg">
              TECHNISCHE FÄHIGKEITEN
            </h2>
            <div className="space-y-6">
              {Object.entries(resume.skills).map(([category, skills]) => {
                if (!Array.isArray(skills) || skills.length === 0) return null

                const categoryTitles: { [key: string]: string } = {
                  frontend: "Frontend-Entwicklung",
                  backend: "Backend-Entwicklung",
                  tools: "Tools & Frameworks",
                  cloud: "Cloud & DevOps",
                }

                return (
                  <div key={category}>
                    <h3 className="mb-3 font-bold text-gray-900 text-sm">{categoryTitles[category] || category}</h3>
                    <div className="gap-4 grid grid-cols-2">
                      {skills.map((skill: any, index: number) => (
                        <div
                          key={index}
                          className="flex justify-between items-center p-2 border border-gray-200 rounded"
                        >
                          <div>
                            <span className="font-medium text-sm">{skill.name}</span>
                            <span className="ml-2 text-gray-500 text-xs">({skill.yearsOfExperience} Jahre)</span>
                          </div>
                          <div className="flex items-center gap-1">{renderStars(skill.rating)}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}

      {/* Languages */}
      {resume.languages && resume.languages.length > 0 && (
        <div className="mb-8">
          <h2 className="mb-6 pb-2 border-gray-300 border-b font-bold text-gray-900 text-lg">SPRACHKENNTNISSE</h2>
          <div className="gap-4 grid grid-cols-3">
            {resume.languages.map((language: any) => (
              <div key={language.id} className="p-3 border border-gray-200 rounded text-center">
                <div className="flex justify-center items-center gap-2 mb-2">
                  {language.flag && <span className="text-lg">{language.flag}</span>}
                  <span className="font-medium text-sm">{language.name}</span>
                </div>
                <div className="bg-gray-100 px-2 py-1 rounded text-gray-600 text-xs">{language.level}</div>
                {language.description && <div className="mt-1 text-gray-600 text-xs">{language.description}</div>}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Projects Summary */}
      {application.projects_data && application.projects_data.length > 0 && (
        <div className="mb-8">
          <h2 className="mb-6 pb-2 border-gray-300 border-b font-bold text-gray-900 text-lg">PROJEKTÜBERSICHT</h2>
          <div className="bg-gray-50 mb-4 p-3 border rounded text-sm text-center">
            <strong>{application.projects_data.length} Frontend-Projekte</strong> - Detaillierte Projektübersicht als
            separate Anlage
          </div>
          <div className="gap-4 grid grid-cols-2">
            {application.projects_data.slice(0, 4).map((project: any) => (
              <div key={project.id} className="p-3 border border-gray-200 rounded">
                <h4 className="font-medium text-gray-900 text-sm">{project.name}</h4>
                <div className="mt-1 text-gray-600 text-xs">
                  {formatDate(project.startDate)} - {formatDate(project.endDate) || "heute"}
                </div>
                {project.technologies && project.technologies.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-2">
                    {project.technologies.slice(0, 3).map((tech: string, index: number) => (
                      <span key={index} className="bg-gray-100 px-1 py-0.5 rounded text-gray-700 text-xs">
                        {tech}
                      </span>
                    ))}
                    {project.technologies.length > 3 && (
                      <span className="text-gray-500 text-xs">+{project.technologies.length - 3}</span>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Footer */}
      <div className="mt-8 pt-4 border-gray-300 border-t text-gray-500 text-xs text-center">
        Lebenslauf - {personalInfo.fullName} - {new Date().toLocaleDateString("de-DE")}
      </div>
    </div>
  )
}
