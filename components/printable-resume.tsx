"use client"
import { Star, MapPin, Phone, Mail, Globe, Github, Linkedin } from "lucide-react"
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
      className="max-w-none mx-auto bg-white text-black"
      style={{ fontFamily: "Times New Roman, serif", fontSize: "11pt", lineHeight: "1.4" }}
    >
      {/* Clean Header */}
      <div className="text-center border-b-2 border-gray-300 pb-6 mb-8">
        <h1 className="text-3xl font-bold mb-3 text-gray-900">{personalInfo.fullName || "Ihr Name"}</h1>
        <div className="text-lg text-gray-700 mb-4 font-medium">{application.job_title || "Gewünschte Position"}</div>

        {/* Contact Info - Clean Layout */}
        <div className="flex flex-wrap justify-center gap-6 text-sm text-gray-600">
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

        <div className="flex flex-wrap justify-center gap-6 text-sm text-gray-600 mt-2">
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
          <h2 className="text-lg font-bold text-gray-900 mb-4 pb-2 border-b border-gray-300">BERUFLICHES PROFIL</h2>
          <p className="text-sm leading-relaxed text-justify text-gray-700">{resume.summary}</p>
        </div>
      )}

      {/* Experience - German Format */}
      {resume.experience && resume.experience.length > 0 && (
        <div className="mb-8">
          <h2 className="text-lg font-bold text-gray-900 mb-6 pb-2 border-b border-gray-300">BERUFSERFAHRUNG</h2>
          <div className="space-y-6">
            {resume.experience.map((exp: any, index: number) => (
              <div key={exp.id || index} className="flex gap-8">
                {/* Date Column - Left Side - Fixed Width */}
                <div className="w-32 flex-shrink-0 text-right pr-4">
                  <div className="text-sm font-medium text-gray-900">
                    {formatDate(exp.startDate)} - {exp.current ? "heute" : formatDate(exp.endDate)}
                  </div>
                  {exp.location && (
                    <div className="text-xs text-gray-500 mt-1 flex items-center justify-end gap-1">
                      <MapPin className="w-3 h-3" />
                      {exp.location}
                    </div>
                  )}
                </div>

                {/* Content Column - Right Side */}
                <div className="flex-1 border-l border-gray-200 pl-4">
                  <h3 className="font-bold text-base text-gray-900">{exp.title}</h3>
                  <div className="text-sm text-gray-700 font-medium mb-3">{exp.company}</div>

                  <p className="text-sm mb-4 text-justify leading-relaxed text-gray-700">{exp.description}</p>

                  {exp.achievements && exp.achievements.length > 0 && (
                    <div className="mb-4">
                      <h4 className="font-medium text-sm mb-2 text-gray-800">Erfolge und Leistungen:</h4>
                      <ul className="space-y-1">
                        {exp.achievements.map((achievement: string, achIndex: number) => (
                          <li key={achIndex} className="flex items-start gap-2 text-sm text-gray-700">
                            <span className="text-blue-600 mt-1">•</span>
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
          <h2 className="text-lg font-bold text-gray-900 mb-6 pb-2 border-b border-gray-300">BILDUNG</h2>

          {/* Degree */}
          {resume.education.degree && (
            <div className="flex gap-8 mb-6">
              <div className="w-32 flex-shrink-0 text-right pr-4">
                <div className="text-sm font-medium text-gray-900">{resume.education.degree.graduationYear}</div>
              </div>
              <div className="flex-1 border-l border-gray-200 pl-4">
                <h3 className="font-bold text-base text-gray-900">{resume.education.degree.title}</h3>
                <div className="text-sm text-gray-700 font-medium">{resume.education.degree.institution}</div>
                {resume.education.degree.location && (
                  <div className="text-sm text-gray-600">{resume.education.degree.location}</div>
                )}
                {resume.education.degree.gpa && (
                  <div className="text-sm text-gray-700 mt-1">Abschlussnote: {resume.education.degree.gpa}</div>
                )}
                {resume.education.degree.thesis && (
                  <div className="text-sm text-gray-700 mt-2 italic">
                    <strong>Abschlussarbeit:</strong> {resume.education.degree.thesis}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Certifications */}
          {resume.education.certifications && resume.education.certifications.length > 0 && (
            <div>
              <h3 className="font-medium text-sm mb-4 text-gray-800">Zertifikate</h3>
              <div className="space-y-3">
                {resume.education.certifications.map((cert: any) => (
                  <div key={cert.id} className="flex gap-8">
                    <div className="w-32 flex-shrink-0 text-right pr-4">
                      <div className="text-sm text-gray-900">{cert.date && formatDate(cert.date)}</div>
                    </div>
                    <div className="flex-1 border-l border-gray-200 pl-4">
                      <div className="font-medium text-sm text-gray-900">{cert.name}</div>
                      <div className="text-sm text-gray-700">{cert.issuer}</div>
                      {cert.credentialId && <div className="text-xs text-gray-500">ID: {cert.credentialId}</div>}
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
            <h2 className="text-lg font-bold text-gray-900 mb-6 pb-2 border-b border-gray-300">
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
                    <h3 className="font-bold text-sm mb-3 text-gray-900">{categoryTitles[category] || category}</h3>
                    <div className="grid grid-cols-2 gap-4">
                      {skills.map((skill: any, index: number) => (
                        <div
                          key={index}
                          className="flex items-center justify-between p-2 border border-gray-200 rounded"
                        >
                          <div>
                            <span className="font-medium text-sm">{skill.name}</span>
                            <span className="text-xs text-gray-500 ml-2">({skill.yearsOfExperience} Jahre)</span>
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
          <h2 className="text-lg font-bold text-gray-900 mb-6 pb-2 border-b border-gray-300">SPRACHKENNTNISSE</h2>
          <div className="grid grid-cols-3 gap-4">
            {resume.languages.map((language: any) => (
              <div key={language.id} className="text-center p-3 border border-gray-200 rounded">
                <div className="flex items-center justify-center gap-2 mb-2">
                  {language.flag && <span className="text-lg">{language.flag}</span>}
                  <span className="font-medium text-sm">{language.name}</span>
                </div>
                <div className="text-xs text-gray-600 px-2 py-1 bg-gray-100 rounded">{language.level}</div>
                {language.description && <div className="text-xs text-gray-600 mt-1">{language.description}</div>}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Projects Summary */}
      {application.projects_data && application.projects_data.length > 0 && (
        <div className="mb-8">
          <h2 className="text-lg font-bold text-gray-900 mb-6 pb-2 border-b border-gray-300">PROJEKTÜBERSICHT</h2>
          <div className="text-sm text-center mb-4 p-3 bg-gray-50 rounded border">
            <strong>{application.projects_data.length} Frontend-Projekte</strong> - Detaillierte Projektübersicht als
            separate Anlage
          </div>
          <div className="grid grid-cols-2 gap-4">
            {application.projects_data.slice(0, 4).map((project: any) => (
              <div key={project.id} className="p-3 border border-gray-200 rounded">
                <h4 className="font-medium text-sm text-gray-900">{project.name}</h4>
                <div className="text-xs text-gray-600 mt-1">
                  {formatDate(project.startDate)} - {formatDate(project.endDate) || "heute"}
                </div>
                {project.technologies && project.technologies.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-2">
                    {project.technologies.slice(0, 3).map((tech: string, index: number) => (
                      <span key={index} className="px-1 py-0.5 bg-gray-100 text-gray-700 text-xs rounded">
                        {tech}
                      </span>
                    ))}
                    {project.technologies.length > 3 && (
                      <span className="text-xs text-gray-500">+{project.technologies.length - 3}</span>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Footer */}
      <div className="text-center text-xs text-gray-500 mt-8 pt-4 border-t border-gray-300">
        Lebenslauf - {personalInfo.fullName} - {new Date().toLocaleDateString("de-DE")}
      </div>
    </div>
  )
}
