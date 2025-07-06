"use client"
import { Calendar, MapPin, Phone, Mail, Globe, Github, Linkedin, Building, GraduationCap } from "lucide-react"
import type { Database } from "@/lib/database.types"

type Application = Database["public"]["Tables"]["applications"]["Row"]

interface PrintableResumeComplexProps {
  application: Application
}

export function PrintableResumeComplex({ application }: PrintableResumeComplexProps) {
  const personalInfo = application.personal_info || {}
  const resume = application.resume_data || {}

  // Group experiences by company to show multiple positions
  const groupedExperiences =
    resume.experience?.reduce((acc: any, exp: any) => {
      const company = exp.company
      if (!acc[company]) {
        acc[company] = []
      }
      acc[company].push(exp)
      return acc
    }, {}) || {}

  // Sort experiences within each company by start date (newest first)
  Object.keys(groupedExperiences).forEach((company) => {
    groupedExperiences[company].sort((a: any, b: any) => {
      const dateA = new Date(a.startDate + "-01")
      const dateB = new Date(b.startDate + "-01")
      return dateB.getTime() - dateA.getTime()
    })
  })

  return (
    <div
      id="printable-resume-complex"
      className="max-w-none mx-auto bg-white text-black"
      style={{ fontFamily: "Times New Roman, serif", fontSize: "11pt", lineHeight: "1.3" }}
    >
      {/* Header */}
      <div className="text-center mb-8 pb-4 border-b border-gray-400">
        <h1 className="text-2xl font-bold mb-3">{personalInfo.fullName || "Ihr Name"}</h1>
        <div className="text-sm space-y-1">
          <div className="flex justify-center items-center gap-4 flex-wrap">
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
          <div className="flex justify-center items-center gap-4 flex-wrap mt-2">
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
      </div>

      {/* Professional Summary */}
      {resume.summary && (
        <div className="mb-6">
          <h2 className="text-base font-bold mb-3 pb-1 border-b border-gray-300">BERUFLICHES PROFIL</h2>
          <p className="text-sm text-justify leading-relaxed">{resume.summary}</p>
        </div>
      )}

      {/* Complex Experience - Grouped by Company */}
      {Object.keys(groupedExperiences).length > 0 && (
        <div className="mb-6">
          <h2 className="text-base font-bold mb-4 pb-1 border-b border-gray-300">BERUFSERFAHRUNG</h2>
          <div className="space-y-6">
            {Object.entries(groupedExperiences).map(([company, experiences]: [string, any]) => {
              // Calculate total time at company
              const sortedExps = experiences.sort(
                (a: any, b: any) => new Date(a.startDate + "-01").getTime() - new Date(b.startDate + "-01").getTime(),
              )
              const firstStart = sortedExps[0].startDate
              const lastEnd = sortedExps[sortedExps.length - 1].current
                ? "heute"
                : sortedExps[sortedExps.length - 1].endDate

              return (
                <div key={company} className="border-l-2 border-blue-200 pl-4">
                  {/* Company Header with Total Duration */}
                  <div className="mb-3 bg-blue-50 p-3 rounded-r border-l-4 border-blue-400">
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <Building className="w-4 h-4 text-blue-600" />
                          <h3 className="font-bold text-base text-blue-800">{company}</h3>
                        </div>
                        <div className="text-sm text-gray-600">
                          {experiences.length > 1 ? `${experiences.length} Positionen` : "1 Position"}
                        </div>
                      </div>
                      <div className="text-right text-sm font-medium text-blue-700">
                        <div className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {firstStart} - {lastEnd}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Multiple Positions within Company */}
                  <div className="space-y-4 ml-4">
                    {experiences.map((exp: any, index: number) => (
                      <div key={exp.id || index} className="flex gap-6">
                        {/* Date Column - Fixed Width */}
                        <div className="w-32 flex-shrink-0 text-right pr-4 border-r border-gray-200">
                          <div className="text-sm font-medium">
                            {exp.startDate && (
                              <div className="flex items-center justify-end gap-1">
                                <Calendar className="w-3 h-3" />
                                {new Date(exp.startDate + "-01").toLocaleDateString("de-DE", {
                                  month: "2-digit",
                                  year: "numeric",
                                })}
                              </div>
                            )}
                            <div className="text-center my-1">bis</div>
                            {exp.current ? (
                              <div className="text-blue-600 font-medium">heute</div>
                            ) : exp.endDate ? (
                              <div>
                                {new Date(exp.endDate + "-01").toLocaleDateString("de-DE", {
                                  month: "2-digit",
                                  year: "numeric",
                                })}
                              </div>
                            ) : (
                              <div>-</div>
                            )}
                          </div>
                        </div>

                        {/* Position Content - Flexible Width */}
                        <div className="flex-1">
                          <div className="mb-2">
                            <h4 className="font-bold text-sm text-gray-900">{exp.title}</h4>
                            {exp.location && (
                              <div className="text-sm text-gray-600 flex items-center gap-1">
                                <MapPin className="w-3 h-3" />
                                {exp.location}
                              </div>
                            )}
                            {index > 0 && (
                              <div className="text-xs text-blue-600 bg-blue-100 px-2 py-1 rounded mt-1 inline-block">
                                Beförderung/Positionswechsel
                              </div>
                            )}
                          </div>

                          <p className="text-sm mb-3 text-justify leading-relaxed">{exp.description}</p>

                          {exp.achievements && exp.achievements.length > 0 && (
                            <div className="mb-3">
                              <h5 className="font-medium text-sm mb-1">Erfolge und Leistungen:</h5>
                              <ul className="text-sm space-y-1">
                                {exp.achievements.map((achievement: string, achIndex: number) => (
                                  <li key={achIndex} className="flex items-start">
                                    <span className="mr-2 text-blue-500">•</span>
                                    <span>{achievement}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}

                          {exp.technologies && exp.technologies.length > 0 && (
                            <div className="text-sm">
                              <strong>Technologien:</strong> {exp.technologies.join(", ")}
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* Gap Year / Additional Activities Section */}
      {resume.gapYearActivities && resume.gapYearActivities.length > 0 && (
        <div className="mb-6">
          <h2 className="text-base font-bold mb-4 pb-1 border-b border-gray-300">
            ZUSÄTZLICHE ERFAHRUNGEN & AKTIVITÄTEN
          </h2>
          <div className="bg-yellow-50 p-4 rounded border-l-4 border-yellow-400">
            <div className="space-y-4">
              {resume.gapYearActivities.map((activity: any, index: number) => (
                <div key={index} className="flex gap-6">
                  <div className="w-32 flex-shrink-0 text-right pr-4 border-r border-yellow-200">
                    <div className="text-sm font-medium">
                      {activity.startDate && (
                        <div>
                          {new Date(activity.startDate + "-01").toLocaleDateString("de-DE", {
                            month: "2-digit",
                            year: "numeric",
                          })}
                        </div>
                      )}
                      <div className="text-center my-1">bis</div>
                      {activity.endDate ? (
                        <div>
                          {new Date(activity.endDate + "-01").toLocaleDateString("de-DE", {
                            month: "2-digit",
                            year: "numeric",
                          })}
                        </div>
                      ) : (
                        <div>heute</div>
                      )}
                    </div>
                  </div>
                  <div className="flex-1">
                    <h4 className="font-bold text-sm">{activity.title}</h4>
                    <div className="text-sm text-gray-700 mb-2">{activity.type}</div>
                    <p className="text-sm text-justify">{activity.description}</p>
                    {activity.skills && (
                      <div className="text-sm mt-2">
                        <strong>Erworbene Fähigkeiten:</strong> {activity.skills.join(", ")}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Education with Extended Activities */}
      {resume.education && (
        <div className="mb-6">
          <h2 className="text-base font-bold mb-4 pb-1 border-b border-gray-300">BILDUNG & WEITERBILDUNG</h2>

          {resume.education.degree && (
            <div className="grid grid-cols-12 gap-4 mb-4">
              <div className="col-span-3 text-right pr-4 border-r border-gray-200">
                <div className="text-sm font-medium">{resume.education.degree.graduationYear}</div>
              </div>
              <div className="col-span-9">
                <div className="flex items-center gap-2 mb-1">
                  <GraduationCap className="w-4 h-4 text-green-600" />
                  <h3 className="font-bold text-sm">{resume.education.degree.title}</h3>
                </div>
                <div className="text-sm text-gray-700">
                  <strong>{resume.education.degree.institution}</strong>
                  {resume.education.degree.location && <span>, {resume.education.degree.location}</span>}
                </div>
                {resume.education.degree.gpa && (
                  <div className="text-sm mt-1">Abschlussnote: {resume.education.degree.gpa}</div>
                )}
                {resume.education.degree.thesis && (
                  <div className="text-sm mt-1 italic">Abschlussarbeit: {resume.education.degree.thesis}</div>
                )}
              </div>
            </div>
          )}

          {/* Certifications with Timeline */}
          {resume.education.certifications && resume.education.certifications.length > 0 && (
            <div>
              <h3 className="font-medium text-sm mb-3 text-green-700">Zertifikate & Weiterbildungen</h3>
              {resume.education.certifications.map((cert: any) => (
                <div key={cert.id} className="grid grid-cols-12 gap-4 mb-3 bg-green-50 p-2 rounded">
                  <div className="col-span-3 text-right pr-4 border-r border-green-200">
                    <div className="text-sm">
                      {cert.date &&
                        new Date(cert.date).toLocaleDateString("de-DE", {
                          month: "2-digit",
                          year: "numeric",
                        })}
                      {cert.expirationDate && (
                        <div className="text-xs text-gray-500">
                          bis{" "}
                          {new Date(cert.expirationDate).toLocaleDateString("de-DE", {
                            month: "2-digit",
                            year: "numeric",
                          })}
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="col-span-9">
                    <div className="font-medium text-sm">{cert.name}</div>
                    <div className="text-sm text-gray-700">{cert.issuer}</div>
                    {cert.credentialId && (
                      <div className="text-xs text-gray-500">Zertifikats-ID: {cert.credentialId}</div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Skills with Proficiency Levels */}
      {resume.skills &&
        Object.values(resume.skills).some((skills: any) => Array.isArray(skills) && skills.length > 0) && (
          <div className="mb-6">
            <h2 className="text-base font-bold mb-3 pb-1 border-b border-gray-300">TECHNISCHE FÄHIGKEITEN</h2>
            <div className="grid grid-cols-2 gap-6">
              {Object.entries(resume.skills).map(([category, skills]) => {
                if (!Array.isArray(skills) || skills.length === 0) return null

                const categoryTitles: { [key: string]: string } = {
                  frontend: "Frontend-Entwicklung",
                  backend: "Backend-Entwicklung",
                  tools: "Tools & Frameworks",
                  cloud: "Cloud & DevOps",
                }

                return (
                  <div key={category} className="bg-gray-50 p-3 rounded border-l-4 border-gray-400">
                    <h3 className="font-medium text-sm mb-2 text-gray-800">{categoryTitles[category] || category}</h3>
                    <div className="space-y-2">
                      {skills.map((skill: any, index: number) => (
                        <div key={index} className="bg-white p-2 rounded border text-sm">
                          <div className="flex justify-between items-center">
                            <span className="font-medium">{skill.name}</span>
                            <div className="flex items-center gap-2">
                              <div className="flex">
                                {Array.from({ length: 5 }, (_, i) => (
                                  <div
                                    key={i}
                                    className={`w-2 h-2 rounded-full mr-1 ${
                                      i < skill.rating ? "bg-blue-500" : "bg-gray-300"
                                    }`}
                                  />
                                ))}
                              </div>
                              <span className="text-xs text-gray-500">{skill.yearsOfExperience}J</span>
                            </div>
                          </div>
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
        <div className="mb-6">
          <h2 className="text-base font-bold mb-3 pb-1 border-b border-gray-300">SPRACHKENNTNISSE</h2>
          <div className="bg-yellow-50 p-3 rounded border-l-4 border-yellow-400">
            <div className="grid grid-cols-2 gap-4">
              {resume.languages.map((language: any) => (
                <div key={language.id} className="bg-white p-2 rounded border text-sm">
                  <div className="flex items-center gap-2 mb-1">
                    {language.flag && <span className="text-base">{language.flag}</span>}
                    <span className="font-medium">{language.name}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded">{language.level}</span>
                    <span className="text-xs text-gray-600">{language.description}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Projects Summary */}
      {application.projects_data && application.projects_data.length > 0 && (
        <div className="mb-6">
          <h2 className="text-base font-bold mb-3 pb-1 border-b border-gray-300">PROJEKTÜBERSICHT</h2>
          <div className="bg-purple-50 p-3 rounded border-l-4 border-purple-400">
            <div className="text-sm text-center mb-3">
              <strong>{application.projects_data.length} Frontend-Projekte</strong> - Detaillierte Projektdokumentation
              als separate Anlage verfügbar
            </div>
            <div className="grid grid-cols-1 gap-2">
              {application.projects_data.slice(0, 3).map((project: any) => (
                <div key={project.id} className="bg-white p-2 rounded border">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-medium text-sm">{project.name}</h4>
                      <div className="text-xs text-gray-600">
                        {project.role} • {project.startDate} - {project.endDate || "heute"}
                      </div>
                    </div>
                    <div className="text-right">
                      {project.technologies && (
                        <div className="text-xs text-gray-500">
                          {project.technologies.slice(0, 2).join(", ")}
                          {project.technologies.length > 2 && ` +${project.technologies.length - 2}`}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
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
