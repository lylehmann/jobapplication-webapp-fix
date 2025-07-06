"use client"
import { MapPin, Phone, Mail, Globe, Github, Linkedin } from "lucide-react"
import type { Database } from "@/lib/database.types"

type Application = Database["public"]["Tables"]["applications"]["Row"]

interface PrintableResumeStandardProps {
  application: Application
}

export function PrintableResumeStandard({ application }: PrintableResumeStandardProps) {
  const personalInfo = application.personal_info || {}
  const resume = application.resume_data || {}

  const formatDate = (dateString: string) => {
    if (!dateString) return ""
    const date = new Date(dateString + "-01")
    return date.toLocaleDateString("de-DE", { month: "2-digit", year: "numeric" })
  }

  return (
    <div
      id="printable-resume-standard"
      className="max-w-none mx-auto bg-white text-black"
      style={{ fontFamily: "Times New Roman, serif", fontSize: "11pt", lineHeight: "1.4" }}
    >
      {/* Clean Header */}
      <div className="text-center border-b-2 border-gray-400 pb-6 mb-8">
        <h1 className="text-3xl font-bold mb-3 text-gray-900">{personalInfo.fullName || "Ihr Name"}</h1>
        <div className="text-lg text-gray-700 mb-4">{application.job_title || "Gewünschte Position"}</div>

        <div className="flex flex-wrap justify-center gap-6 text-sm text-gray-600">
          {personalInfo.location && (
            <span className="flex items-center gap-1">
              <MapPin className="w-3 h-3" />
              {personalInfo.location}
            </span>
          )}
          {personalInfo.phone && (
            <span className="flex items-center gap-1">
              <Phone className="w-3 h-3" />
              {personalInfo.phone}
            </span>
          )}
          {personalInfo.email && (
            <span className="flex items-center gap-1">
              <Mail className="w-3 h-3" />
              {personalInfo.email}
            </span>
          )}
        </div>

        <div className="flex flex-wrap justify-center gap-6 text-sm text-gray-600 mt-2">
          {personalInfo.portfolio && (
            <span className="flex items-center gap-1">
              <Globe className="w-3 h-3" />
              {personalInfo.portfolio}
            </span>
          )}
          {personalInfo.linkedin && (
            <span className="flex items-center gap-1">
              <Linkedin className="w-3 h-3" />
              {personalInfo.linkedin}
            </span>
          )}
          {personalInfo.github && (
            <span className="flex items-center gap-1">
              <Github className="w-3 h-3" />
              {personalInfo.github}
            </span>
          )}
        </div>
      </div>

      {/* Professional Summary */}
      {resume.summary && (
        <div className="mb-8">
          <h2 className="text-lg font-bold mb-4 pb-2 border-b border-gray-300 text-gray-900">BERUFLICHES PROFIL</h2>
          <p className="text-sm text-justify leading-relaxed text-gray-700">{resume.summary}</p>
        </div>
      )}

      {/* Experience - German Format with Dates on Left */}
      {resume.experience && resume.experience.length > 0 && (
        <div className="mb-8">
          <h2 className="text-lg font-bold mb-6 pb-2 border-b border-gray-300 text-gray-900">BERUFSERFAHRUNG</h2>
          <div className="space-y-6">
            {resume.experience.map((exp: any, index: number) => (
              <div key={exp.id || index} className="flex gap-8">
                {/* Date Column - Left Side - Fixed Width */}
                <div className="w-32 flex-shrink-0 text-right pr-4 border-r border-gray-200">
                  <div className="text-sm font-medium text-gray-900">{formatDate(exp.startDate)}</div>
                  <div className="text-center my-1 text-gray-500">bis</div>
                  <div className="text-sm font-medium text-gray-900">
                    {exp.current ? "heute" : formatDate(exp.endDate)}
                  </div>
                </div>

                {/* Content Column - Right Side - Flexible Width */}
                <div className="flex-1">
                  <h3 className="font-bold text-base text-gray-900">{exp.title}</h3>
                  <div className="text-sm text-gray-700 font-medium mb-1">{exp.company}</div>
                  {exp.location && (
                    <div className="text-sm text-gray-600 mb-3 flex items-center gap-1">
                      <MapPin className="w-3 h-3" />
                      {exp.location}
                    </div>
                  )}

                  <p className="text-sm mb-4 text-justify leading-relaxed text-gray-700">{exp.description}</p>

                  {exp.achievements && exp.achievements.length > 0 && (
                    <div className="mb-4">
                      <h4 className="font-medium text-sm mb-2 text-gray-800">Erfolge und Leistungen:</h4>
                      <ul className="space-y-1">
                        {exp.achievements.map((achievement: string, achIndex: number) => (
                          <li key={achIndex} className="flex items-start text-sm text-gray-700">
                            <span className="mr-2">•</span>
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

      {/* Education - German Format */}
      {resume.education && (
        <div className="mb-8">
          <h2 className="text-lg font-bold mb-6 pb-2 border-b border-gray-300 text-gray-900">BILDUNG</h2>

          {resume.education.degree && (
            <div className="flex gap-8 mb-6">
              <div className="w-32 flex-shrink-0 text-right pr-4 border-r border-gray-200">
                <div className="text-sm font-medium text-gray-900">{resume.education.degree.graduationYear}</div>
              </div>
              <div className="flex-1">
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
                    Abschlussarbeit: {resume.education.degree.thesis}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Certifications */}
          {resume.education.certifications && resume.education.certifications.length > 0 && (
            <div>
              <h3 className="font-medium text-sm mb-4 text-gray-800">Zertifikate</h3>
              {resume.education.certifications.map((cert: any) => (
                <div key={cert.id} className="flex gap-8 mb-3">
                  <div className="w-32 flex-shrink-0 text-right pr-4 border-r border-gray-200">
                    <div className="text-sm text-gray-900">{cert.date && formatDate(cert.date)}</div>
                  </div>
                  <div className="flex-1">
                    <div className="font-medium text-sm text-gray-900">{cert.name}</div>
                    <div className="text-sm text-gray-700">{cert.issuer}</div>
                    {cert.credentialId && <div className="text-xs text-gray-500">ID: {cert.credentialId}</div>}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Skills */}
      {resume.skills &&
        Object.values(resume.skills).some((skills: any) => Array.isArray(skills) && skills.length > 0) && (
          <div className="mb-8">
            <h2 className="text-lg font-bold mb-6 pb-2 border-b border-gray-300 text-gray-900">
              TECHNISCHE FÄHIGKEITEN
            </h2>
            <div className="grid grid-cols-2 gap-8">
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
                    <div className="space-y-2">
                      {skills.map((skill: any, index: number) => (
                        <div key={index} className="text-sm flex justify-between items-center">
                          <span className="text-gray-700">{skill.name}</span>
                          <span className="text-gray-600 text-xs">
                            {skill.yearsOfExperience}J • {skill.rating}/5
                          </span>
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
          <h2 className="text-lg font-bold mb-6 pb-2 border-b border-gray-300 text-gray-900">SPRACHKENNTNISSE</h2>
          <div className="grid grid-cols-3 gap-6">
            {resume.languages.map((language: any) => (
              <div key={language.id} className="text-sm text-center">
                <div className="flex items-center justify-center gap-2 mb-1">
                  {language.flag && <span>{language.flag}</span>}
                  <span className="font-medium text-gray-900">{language.name}</span>
                </div>
                <div className="text-xs text-gray-600 bg-gray-100 px-2 py-1 rounded">{language.level}</div>
                {language.description && <div className="text-xs text-gray-500 mt-1">{language.description}</div>}
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
