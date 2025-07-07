"use client"
import Calendar from "lucide-react/dist/esm/icons/calendar"
import MapPin from "lucide-react/dist/esm/icons/map-pin"
import Phone from "lucide-react/dist/esm/icons/phone"
import Mail from "lucide-react/dist/esm/icons/mail"
import Globe from "lucide-react/dist/esm/icons/globe"
import Github from "lucide-react/dist/esm/icons/github"
import Linkedin from "lucide-react/dist/esm/icons/linkedin"
import Building from "lucide-react/dist/esm/icons/building"
import GraduationCap from "lucide-react/dist/esm/icons/graduation-cap"
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
      className="bg-white mx-auto max-w-none text-black"
      style={{ fontFamily: "Times New Roman, serif", fontSize: "11pt", lineHeight: "1.3" }}
    >
      {/* Header */}
      <div className="mb-8 pb-4 border-gray-400 border-b text-center">
        <h1 className="mb-3 font-bold text-2xl">{personalInfo.fullName || "Ihr Name"}</h1>
        <div className="space-y-1 text-sm">
          <div className="flex flex-wrap justify-center items-center gap-4">
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
          <div className="flex flex-wrap justify-center items-center gap-4 mt-2">
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
          <h2 className="mb-3 pb-1 border-gray-300 border-b font-bold text-base">BERUFLICHES PROFIL</h2>
          <p className="text-sm text-justify leading-relaxed">{resume.summary}</p>
        </div>
      )}

      {/* Complex Experience - Grouped by Company */}
      {Object.keys(groupedExperiences).length > 0 && (
        <div className="mb-6">
          <h2 className="mb-4 pb-1 border-gray-300 border-b font-bold text-base">BERUFSERFAHRUNG</h2>
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
                <div key={company} className="pl-4 border-blue-200 border-l-2">
                  {/* Company Header with Total Duration */}
                  <div className="bg-blue-50 mb-3 p-3 border-blue-400 border-l-4 rounded-r">
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <Building className="w-4 h-4 text-blue-600" />
                          <h3 className="font-bold text-blue-800 text-base">{company}</h3>
                        </div>
                        <div className="text-gray-600 text-sm">
                          {experiences.length > 1 ? `${experiences.length} Positionen` : "1 Position"}
                        </div>
                      </div>
                      <div className="font-medium text-blue-700 text-sm text-right">
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
                        <div className="flex-shrink-0 pr-4 border-gray-200 border-r w-32 text-right">
                          <div className="font-medium text-sm">
                            {exp.startDate && (
                              <div className="flex justify-end items-center gap-1">
                                <Calendar className="w-3 h-3" />
                                {new Date(exp.startDate + "-01").toLocaleDateString("de-DE", {
                                  month: "2-digit",
                                  year: "numeric",
                                })}
                              </div>
                            )}
                            <div className="my-1 text-center">bis</div>
                            {exp.current ? (
                              <div className="font-medium text-blue-600">heute</div>
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
                            <h4 className="font-bold text-gray-900 text-sm">{exp.title}</h4>
                            {exp.location && (
                              <div className="flex items-center gap-1 text-gray-600 text-sm">
                                <MapPin className="w-3 h-3" />
                                {exp.location}
                              </div>
                            )}
                            {index > 0 && (
                              <div className="inline-block bg-blue-100 mt-1 px-2 py-1 rounded text-blue-600 text-xs">
                                Beförderung/Positionswechsel
                              </div>
                            )}
                          </div>

                          <p className="mb-3 text-sm text-justify leading-relaxed">{exp.description}</p>

                          {exp.achievements && exp.achievements.length > 0 && (
                            <div className="mb-3">
                              <h5 className="mb-1 font-medium text-sm">Erfolge und Leistungen:</h5>
                              <ul className="space-y-1 text-sm">
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
          <h2 className="mb-4 pb-1 border-gray-300 border-b font-bold text-base">
            ZUSÄTZLICHE ERFAHRUNGEN & AKTIVITÄTEN
          </h2>
          <div className="bg-yellow-50 p-4 border-yellow-400 border-l-4 rounded">
            <div className="space-y-4">
              {resume.gapYearActivities.map((activity: any, index: number) => (
                <div key={index} className="flex gap-6">
                  <div className="flex-shrink-0 pr-4 border-yellow-200 border-r w-32 text-right">
                    <div className="font-medium text-sm">
                      {activity.startDate && (
                        <div>
                          {new Date(activity.startDate + "-01").toLocaleDateString("de-DE", {
                            month: "2-digit",
                            year: "numeric",
                          })}
                        </div>
                      )}
                      <div className="my-1 text-center">bis</div>
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
                    <div className="mb-2 text-gray-700 text-sm">{activity.type}</div>
                    <p className="text-sm text-justify">{activity.description}</p>
                    {activity.skills && (
                      <div className="mt-2 text-sm">
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
          <h2 className="mb-4 pb-1 border-gray-300 border-b font-bold text-base">BILDUNG & WEITERBILDUNG</h2>

          {resume.education.degree && (
            <div className="gap-4 grid grid-cols-12 mb-4">
              <div className="col-span-3 pr-4 border-gray-200 border-r text-right">
                <div className="font-medium text-sm">{resume.education.degree.graduationYear}</div>
              </div>
              <div className="col-span-9">
                <div className="flex items-center gap-2 mb-1">
                  <GraduationCap className="w-4 h-4 text-green-600" />
                  <h3 className="font-bold text-sm">{resume.education.degree.title}</h3>
                </div>
                <div className="text-gray-700 text-sm">
                  <strong>{resume.education.degree.institution}</strong>
                  {resume.education.degree.location && <span>, {resume.education.degree.location}</span>}
                </div>
                {resume.education.degree.gpa && (
                  <div className="mt-1 text-sm">Abschlussnote: {resume.education.degree.gpa}</div>
                )}
                {resume.education.degree.thesis && (
                  <div className="mt-1 text-sm italic">Abschlussarbeit: {resume.education.degree.thesis}</div>
                )}
              </div>
            </div>
          )}

          {/* Certifications with Timeline */}
          {resume.education.certifications && resume.education.certifications.length > 0 && (
            <div>
              <h3 className="mb-3 font-medium text-green-700 text-sm">Zertifikate & Weiterbildungen</h3>
              {resume.education.certifications.map((cert: any) => (
                <div key={cert.id} className="gap-4 grid grid-cols-12 bg-green-50 mb-3 p-2 rounded">
                  <div className="col-span-3 pr-4 border-green-200 border-r text-right">
                    <div className="text-sm">
                      {cert.date &&
                        new Date(cert.date).toLocaleDateString("de-DE", {
                          month: "2-digit",
                          year: "numeric",
                        })}
                      {cert.expirationDate && (
                        <div className="text-gray-500 text-xs">
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
                    <div className="text-gray-700 text-sm">{cert.issuer}</div>
                    {cert.credentialId && (
                      <div className="text-gray-500 text-xs">Zertifikats-ID: {cert.credentialId}</div>
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
            <h2 className="mb-3 pb-1 border-gray-300 border-b font-bold text-base">TECHNISCHE FÄHIGKEITEN</h2>
            <div className="gap-6 grid grid-cols-2">
              {Object.entries(resume.skills).map(([category, skills]) => {
                if (!Array.isArray(skills) || skills.length === 0) return null

                const categoryTitles: { [key: string]: string } = {
                  frontend: "Frontend-Entwicklung",
                  backend: "Backend-Entwicklung",
                  tools: "Tools & Frameworks",
                  cloud: "Cloud & DevOps",
                }

                return (
                  <div key={category} className="bg-gray-50 p-3 border-gray-400 border-l-4 rounded">
                    <h3 className="mb-2 font-medium text-gray-800 text-sm">{categoryTitles[category] || category}</h3>
                    <div className="space-y-2">
                      {skills.map((skill: any, index: number) => (
                        <div key={index} className="bg-white p-2 border rounded text-sm">
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
                              <span className="text-gray-500 text-xs">{skill.yearsOfExperience}J</span>
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
          <h2 className="mb-3 pb-1 border-gray-300 border-b font-bold text-base">SPRACHKENNTNISSE</h2>
          <div className="bg-yellow-50 p-3 border-yellow-400 border-l-4 rounded">
            <div className="gap-4 grid grid-cols-2">
              {resume.languages.map((language: any) => (
                <div key={language.id} className="bg-white p-2 border rounded text-sm">
                  <div className="flex items-center gap-2 mb-1">
                    {language.flag && <span className="text-base">{language.flag}</span>}
                    <span className="font-medium">{language.name}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="bg-yellow-100 px-2 py-1 rounded text-yellow-800 text-xs">{language.level}</span>
                    <span className="text-gray-600 text-xs">{language.description}</span>
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
          <h2 className="mb-3 pb-1 border-gray-300 border-b font-bold text-base">PROJEKTÜBERSICHT</h2>
          <div className="bg-purple-50 p-3 border-purple-400 border-l-4 rounded">
            <div className="mb-3 text-sm text-center">
              <strong>{application.projects_data.length} Frontend-Projekte</strong> - Detaillierte Projektdokumentation
              als separate Anlage verfügbar
            </div>
            <div className="gap-2 grid grid-cols-1">
              {application.projects_data.slice(0, 3).map((project: any) => (
                <div key={project.id} className="bg-white p-2 border rounded">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-medium text-sm">{project.name}</h4>
                      <div className="text-gray-600 text-xs">
                        {project.role} • {project.startDate} - {project.endDate || "heute"}
                      </div>
                    </div>
                    <div className="text-right">
                      {project.technologies && (
                        <div className="text-gray-500 text-xs">
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
      <div className="mt-8 pt-4 border-gray-300 border-t text-gray-500 text-xs text-center">
        Lebenslauf - {personalInfo.fullName} - {new Date().toLocaleDateString("de-DE")}
      </div>
    </div>
  )
}
