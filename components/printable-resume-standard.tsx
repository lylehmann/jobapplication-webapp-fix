"use client"
import MapPin from "lucide-react/dist/esm/icons/map-pin"
import Phone from "lucide-react/dist/esm/icons/phone"
import Mail from "lucide-react/dist/esm/icons/mail"
import Globe from "lucide-react/dist/esm/icons/globe"
import Github from "lucide-react/dist/esm/icons/github"
import Linkedin from "lucide-react/dist/esm/icons/linkedin"
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
      className="bg-white mx-auto max-w-none text-black"
      style={{ fontFamily: "Times New Roman, serif", fontSize: "11pt", lineHeight: "1.4" }}
    >
      {/* Clean Header */}
      <div className="mb-8 pb-6 border-gray-400 border-b-2 text-center">
        <h1 className="mb-3 font-bold text-gray-900 text-3xl">{personalInfo.fullName || "Ihr Name"}</h1>
        <div className="mb-4 text-gray-700 text-lg">{application.job_title || "Gewünschte Position"}</div>

        <div className="flex flex-wrap justify-center gap-6 text-gray-600 text-sm">
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

        <div className="flex flex-wrap justify-center gap-6 mt-2 text-gray-600 text-sm">
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
          <h2 className="mb-4 pb-2 border-gray-300 border-b font-bold text-gray-900 text-lg">BERUFLICHES PROFIL</h2>
          <p className="text-gray-700 text-sm text-justify leading-relaxed">{resume.summary}</p>
        </div>
      )}

      {/* Experience - German Format with Dates on Left */}
      {resume.experience && resume.experience.length > 0 && (
        <div className="mb-8">
          <h2 className="mb-6 pb-2 border-gray-300 border-b font-bold text-gray-900 text-lg">BERUFSERFAHRUNG</h2>
          <div className="space-y-6">
            {resume.experience.map((exp: any, index: number) => (
              <div key={exp.id || index} className="flex gap-8">
                {/* Date Column - Left Side - Fixed Width */}
                <div className="flex-shrink-0 pr-4 border-gray-200 border-r w-32 text-right">
                  <div className="font-medium text-gray-900 text-sm">{formatDate(exp.startDate)}</div>
                  <div className="my-1 text-gray-500 text-center">bis</div>
                  <div className="font-medium text-gray-900 text-sm">
                    {exp.current ? "heute" : formatDate(exp.endDate)}
                  </div>
                </div>

                {/* Content Column - Right Side - Flexible Width */}
                <div className="flex-1">
                  <h3 className="font-bold text-gray-900 text-base">{exp.title}</h3>
                  <div className="mb-1 font-medium text-gray-700 text-sm">{exp.company}</div>
                  {exp.location && (
                    <div className="flex items-center gap-1 mb-3 text-gray-600 text-sm">
                      <MapPin className="w-3 h-3" />
                      {exp.location}
                    </div>
                  )}

                  <p className="mb-4 text-gray-700 text-sm text-justify leading-relaxed">{exp.description}</p>

                  {exp.achievements && exp.achievements.length > 0 && (
                    <div className="mb-4">
                      <h4 className="mb-2 font-medium text-gray-800 text-sm">Erfolge und Leistungen:</h4>
                      <ul className="space-y-1">
                        {exp.achievements.map((achievement: string, achIndex: number) => (
                          <li key={achIndex} className="flex items-start text-gray-700 text-sm">
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
          <h2 className="mb-6 pb-2 border-gray-300 border-b font-bold text-gray-900 text-lg">BILDUNG</h2>

          {resume.education.degree && (
            <div className="flex gap-8 mb-6">
              <div className="flex-shrink-0 pr-4 border-gray-200 border-r w-32 text-right">
                <div className="font-medium text-gray-900 text-sm">{resume.education.degree.graduationYear}</div>
              </div>
              <div className="flex-1">
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
                    Abschlussarbeit: {resume.education.degree.thesis}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Certifications */}
          {resume.education.certifications && resume.education.certifications.length > 0 && (
            <div>
              <h3 className="mb-4 font-medium text-gray-800 text-sm">Zertifikate</h3>
              {resume.education.certifications.map((cert: any) => (
                <div key={cert.id} className="flex gap-8 mb-3">
                  <div className="flex-shrink-0 pr-4 border-gray-200 border-r w-32 text-right">
                    <div className="text-gray-900 text-sm">{cert.date && formatDate(cert.date)}</div>
                  </div>
                  <div className="flex-1">
                    <div className="font-medium text-gray-900 text-sm">{cert.name}</div>
                    <div className="text-gray-700 text-sm">{cert.issuer}</div>
                    {cert.credentialId && <div className="text-gray-500 text-xs">ID: {cert.credentialId}</div>}
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
            <h2 className="mb-6 pb-2 border-gray-300 border-b font-bold text-gray-900 text-lg">
              TECHNISCHE FÄHIGKEITEN
            </h2>
            <div className="gap-8 grid grid-cols-2">
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
                    <div className="space-y-2">
                      {skills.map((skill: any, index: number) => (
                        <div key={index} className="flex justify-between items-center text-sm">
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
          <h2 className="mb-6 pb-2 border-gray-300 border-b font-bold text-gray-900 text-lg">SPRACHKENNTNISSE</h2>
          <div className="gap-6 grid grid-cols-3">
            {resume.languages.map((language: any) => (
              <div key={language.id} className="text-sm text-center">
                <div className="flex justify-center items-center gap-2 mb-1">
                  {language.flag && <span>{language.flag}</span>}
                  <span className="font-medium text-gray-900">{language.name}</span>
                </div>
                <div className="bg-gray-100 px-2 py-1 rounded text-gray-600 text-xs">{language.level}</div>
                {language.description && <div className="mt-1 text-gray-500 text-xs">{language.description}</div>}
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
