"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { ScrollArea } from "@/components/ui/scroll-area"
import User from "lucide-react/dist/esm/icons/user"
import Mail from "lucide-react/dist/esm/icons/mail"
import Phone from "lucide-react/dist/esm/icons/phone"
import MapPin from "lucide-react/dist/esm/icons/map-pin"
import Globe from "lucide-react/dist/esm/icons/globe"
import Github from "lucide-react/dist/esm/icons/github"
import Linkedin from "lucide-react/dist/esm/icons/linkedin"
import Calendar from "lucide-react/dist/esm/icons/calendar"
import Building2 from "lucide-react/dist/esm/icons/building-2"
import Star from "lucide-react/dist/esm/icons/star"
import ExternalLink from "lucide-react/dist/esm/icons/external-link"
import FileText from "lucide-react/dist/esm/icons/file-text"
import Award from "lucide-react/dist/esm/icons/award"
import Briefcase from "lucide-react/dist/esm/icons/briefcase"
import Paperclip from "lucide-react/dist/esm/icons/paperclip"
import type { Database } from "@/lib/database.types"
import { useState } from "react"
import { Switch } from "@/components/ui/switch"

type Application = Database["public"]["Tables"]["applications"]["Row"]

interface ApplicationPreviewProps {
  application: Application
}

export function ApplicationPreview({ application }: ApplicationPreviewProps) {
  const [selectedDoc, setSelectedDoc] = useState<'cover-letter' | 'resume' | 'projects'>('cover-letter')
  const [atsMode, setAtsMode] = useState(false)
  const docTypes = [
    { id: 'cover-letter', label: 'Anschreiben' },
    { id: 'resume', label: 'Lebenslauf' },
    { id: 'projects', label: 'Projektübersicht' },
  ]
  const docIndex = docTypes.findIndex(d => d.id === selectedDoc)
  const goToPrevious = () => setSelectedDoc(docTypes[(docIndex + docTypes.length - 1) % docTypes.length].id as any)
  const goToNext = () => setSelectedDoc(docTypes[(docIndex + 1) % docTypes.length].id as any)

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star key={`star-${i}`} className={`w-4 h-4 ${i < rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`} />
    ))
  }

  const formatDate = (dateString: string) => {
    if (!dateString) return ""
    const date = new Date(dateString + "-01")
    return date.toLocaleDateString("de-DE", { month: "2-digit", year: "numeric" })
  }

  const getEmploymentTypeBadge = (type: string) => {
    const types = {
      "full-time": { label: "Vollzeit", color: "bg-green-100 text-green-800 print:bg-gray-100 print:text-black" },
      "part-time": { label: "Teilzeit", color: "bg-blue-100 text-blue-800 print:bg-gray-100 print:text-black" },
      "student-job": {
        label: "Studentenjob",
        color: "bg-purple-100 text-purple-800 print:bg-gray-100 print:text-black",
      },
      internship: { label: "Praktikum", color: "bg-indigo-100 text-indigo-800 print:bg-gray-100 print:text-black" },
      freelance: { label: "Freiberuflich", color: "bg-teal-100 text-teal-800 print:bg-gray-100 print:text-black" },
      volunteer: {
        label: "Freiwilligenarbeit",
        color: "bg-pink-100 text-pink-800 print:bg-gray-100 print:text-black",
      },
      travel: { label: "Reisen", color: "bg-orange-100 text-orange-800 print:bg-gray-100 print:text-black" },
      course: { label: "Weiterbildung", color: "bg-yellow-100 text-yellow-800 print:bg-gray-100 print:text-black" },
      project: {
        label: "Persönliches Projekt",
        color: "bg-cyan-100 text-cyan-800 print:bg-gray-100 print:text-black",
      },
      other: { label: "Sonstiges", color: "bg-gray-100 text-gray-800 print:bg-gray-100 print:text-black" },
    }
    return types[type as keyof typeof types] || { label: type, color: "bg-gray-100 text-gray-800" }
  }

  const renderPersonalInfo = () => {
    const statusLabel =
      application.status && typeof application.status === "string"
        ? application.status.charAt(0).toUpperCase() + application.status.slice(1)
        : null

    return (
      <Card className="print:shadow-none print:border-0">
        <CardHeader className="print:pb-4">
          <CardTitle className="flex items-center gap-2 print:text-2xl text-center">
            <User className="print:hidden w-5 h-5" />
            {application.personal_info?.fullName || "Name nicht angegeben"}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="gap-4 print:gap-2 grid grid-cols-1 md:grid-cols-2 print:grid-cols-2">
            {application.personal_info?.email && (
              <div className="flex items-center gap-2">
                <Mail className="print:hidden w-4 h-4 text-muted-foreground" />
                <span className="text-sm">{application.personal_info.email}</span>
              </div>
            )}
            {application.personal_info?.phone && (
              <div className="flex items-center gap-2">
                <Phone className="print:hidden w-4 h-4 text-muted-foreground" />
                <span className="text-sm">{application.personal_info.phone}</span>
              </div>
            )}
            {application.personal_info?.location && (
              <div className="flex items-center gap-2">
                <MapPin className="print:hidden w-4 h-4 text-muted-foreground" />
                <span className="text-sm">{application.personal_info.location}</span>
              </div>
            )}
            {application.personal_info?.portfolio && (
              <div className="flex items-center gap-2">
                <Globe className="print:hidden w-4 h-4 text-muted-foreground" />
                <span className="text-sm">{application.personal_info.portfolio}</span>
              </div>
            )}
            {application.personal_info?.github && (
              <div className="flex items-center gap-2">
                <Github className="print:hidden w-4 h-4 text-muted-foreground" />
                <span className="text-sm">{application.personal_info.github}</span>
              </div>
            )}
            {application.personal_info?.linkedin && (
              <div className="flex items-center gap-2">
                <Linkedin className="print:hidden w-4 h-4 text-muted-foreground" />
                <span className="text-sm">{application.personal_info.linkedin}</span>
              </div>
            )}
          </div>

          <Separator className="print:border-gray-400" />

          <div className="flex justify-between print:justify-center items-center print:text-center">
            <div>
              <div className="font-medium text-lg print:text-xl">{application.job_title}</div>
              <div className="flex print:justify-center items-center gap-1 text-muted-foreground text-sm">
                <Building2 className="print:hidden w-4 h-4" />
                {application.company}
              </div>
            </div>
            {statusLabel && (
              <Badge variant="outline" className="print:hidden">
                {statusLabel}
              </Badge>
            )}
          </div>
        </CardContent>
      </Card>
    )
  }

  // Modern, compact contact header
  const renderContactHeader = () => {
    let address = "";
    const info = application.personal_info;
    if (info?.address && typeof info.address === 'object') {
      // If address is an object: { street, postalCode, city }
      const parts = [];
      if (info.address.street) parts.push(info.address.street);
      if (info.address.postalCode && info.address.city) {
        parts.push(`${info.address.postalCode} ${info.address.city}`);
      } else if (info.address.city) {
        parts.push(info.address.city);
      } else if (info.address.postalCode) {
        parts.push(info.address.postalCode);
      }
      address = parts.join(', ');
    } else if (typeof info?.address === 'string') {
      address = info.address;
    } else if (info?.location) {
      address = info.location;
    }
    return (
      <div className="flex print:flex-row flex-col print:justify-between gap-1 print:gap-0 mb-4 print:mb-6 text-sm print:text-base">
        <div className="flex flex-1 items-center gap-4">
          {/* Avatar falls vorhanden */}
          {selectedDoc === 'resume' && info?.profilePicture && (
            <img
              src={info.profilePicture}
              alt="Profilbild"
              className="border border-gray-300 print:border-none rounded-full w-16 h-16 object-cover"
              style={{ minWidth: 64, minHeight: 64 }}
            />
          )}
          <div>
            <div className="font-bold print:text-base text-lg">{info?.fullName}</div>
            <div className="text-gray-700 print:text-black">{address}</div>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-2 print:mt-0 text-gray-500 print:text-black text-xs print:text-base">
          {info?.phone && (
            <span className="flex items-center gap-1">
              <Phone className="print:hidden w-4 h-4" />{info.phone}
            </span>
          )}
          {info?.email && (
            <span className="flex items-center gap-1">
              <Mail className="print:hidden w-4 h-4" />{info.email}
            </span>
          )}
          {info?.portfolio && (
            <span className="flex items-center gap-1">
              <Globe className="print:hidden w-4 h-4" />{info.portfolio}
            </span>
          )}
          {info?.github && (
            <span className="flex items-center gap-1">
              <Github className="print:hidden w-4 h-4" />{info.github}
            </span>
          )}
          {info?.linkedin && (
            <span className="flex items-center gap-1">
              <Linkedin className="print:hidden w-4 h-4" />{info.linkedin}
            </span>
          )}
        </div>
      </div>
    )
  }

  const renderCoverLetter = () => (
    <div className="print:shadow-none print:border-0 print:break-before-page print:break-inside-avoid">
      <div className="print:pb-4" />
      <div className="space-y-4 print:space-y-6">
        {renderContactHeader()}
        <Separator className="my-2 print:my-2" />
        {application.cover_letter_data?.address && (
          <div className="text-sm print:text-base">
            <div className="font-medium">{application.cover_letter_data.company || application.company}</div>
            <div className="whitespace-pre-line">{application.cover_letter_data.address}</div>
          </div>
        )}
        {application.cover_letter_data?.date && (
          <div className="text-muted-foreground print:text-black text-sm text-right">
            {(() => {
              let ort = '';
              const info = application.personal_info;
              if (info?.address && typeof info.address === 'object' && info.address.city) {
                ort = info.address.city;
              } else if (typeof info?.address === 'string') {
                // Try to extract city from string (last word)
                const parts = info.address.split(',');
                ort = parts[parts.length - 1].trim();
              } else if (info?.location) {
                ort = info.location;
              }
              const date = new Date(application.cover_letter_data.date);
              const dateStr = `${date.getDate()}.${date.getMonth() + 1}.${date.getFullYear()}`;
              return ort ? `${ort}, den ${dateStr}` : `den ${dateStr}`;
            })()}
          </div>
        )}
        {application.cover_letter_data?.subject && (
          <div className="font-medium print:font-bold print:text-base">
            {application.cover_letter_data.subject}
          </div>
        )}
        {application.cover_letter_data?.salutation && (
          <div className="print:text-base">{application.cover_letter_data.salutation}</div>
        )}
        {application.cover_letter_data?.openingParagraph && (
          <p className="text-sm print:text-base leading-relaxed print:leading-relaxed">
            {application.cover_letter_data.openingParagraph}
          </p>
        )}
        {application.cover_letter_data?.bodyParagraphs && (
          <div className="text-sm print:text-base leading-relaxed print:leading-relaxed whitespace-pre-line">
            {application.cover_letter_data.bodyParagraphs}
          </div>
        )}
        {application.cover_letter_data?.closingParagraph && (
          <p className="text-sm print:text-base leading-relaxed print:leading-relaxed">
            {application.cover_letter_data.closingParagraph}
          </p>
        )}
        {application.cover_letter_data?.signOff && (
          <div className="print:mt-8 text-sm print:text-base">
            {application.cover_letter_data.signOff}
            <br />
            {application.personal_info?.fullName}
          </div>
        )}
        {(() => {
          // Check which documents are present
          const hasResume = (application.resume_data?.experience && application.resume_data.experience.length > 0) ||
            (application.resume_data?.education && application.resume_data.education.length > 0);
          const hasProjects = application.projects_data && application.projects_data.length > 0;
          const attachments = (application.selected_documents || []).filter(doc =>
            doc.section === 'experience' || doc.section === 'education' || doc.section === 'other' || doc.section === 'certificate'
          );
          if (!hasResume && !hasProjects && attachments.length === 0) return null;
          return (
            <div className="mt-8 text-sm print:text-base">
              <div className="mb-1 font-medium">Anlagen:</div>
              <ul className="ml-6 list-disc">
                {hasResume && <li>Lebenslauf</li>}
                {hasProjects && <li>Projektübersicht</li>}
                {attachments.map((doc: any) => (
                  <li key={doc.id}>{doc.name || 'Anlage'}</li>
                ))}
              </ul>
            </div>
          );
        })()}
      </div>
    </div>
  )

  const renderExperience = (atsMode: boolean) => {
    const experiences = application.resume_data?.experience || []
    if (experiences.length === 0) return null

    // Group experiences by company
    const groupedExperiences = experiences.reduce((acc: any, exp: any) => {
      const company = exp.company || "Unbekanntes Unternehmen"
      if (!acc[company]) {
        acc[company] = []
      }
      acc[company].push(exp)
      return acc
    }, {})

    // Sort experiences within each company by start date (newest first)
    Object.keys(groupedExperiences).forEach((company) => {
      groupedExperiences[company].sort((a: any, b: any) => {
        const dateA = new Date(a.startDate || "1900-01")
        const dateB = new Date(b.startDate || "1900-01")
        return dateB.getTime() - dateA.getTime()
      })
    })

    if (atsMode) {
      // ATS-optimiertes Layout: linear, keine Icons, keine Badges
      return (
        <div className="print:shadow-none print:border-0 print:break-before-page print:break-inside-avoid">
          <div className="print:pb-4">
            <div className="print:text-xl">Berufserfahrung</div>
          </div>
          <div className="space-y-6 print:space-y-4">
            {Object.entries(groupedExperiences).map(([company, companyExperiences]: [string, any]) => (
              <div key={company} className="space-y-4">
                {companyExperiences.map((exp: any) => (
                  <div key={exp.id} className="mb-4">
                    <div className="font-semibold print:font-bold print:text-base">
                      {formatDate(exp.startDate)} - {exp.current ? "heute" : formatDate(exp.endDate)}
                    </div>
                    <div className="font-medium print:font-bold print:text-base">{exp.title}</div>
                    <div className="text-sm print:text-base">{company}{exp.location ? `, ${exp.location}` : ""}</div>
                    {exp.description && (
                      <p className="mb-2 text-sm print:text-base leading-relaxed print:leading-relaxed">
                        {exp.description}
                      </p>
                    )}
                    {exp.achievements && exp.achievements.length > 0 && (
                      <ul className="space-y-1 print:space-y-1 ml-5 text-sm print:text-base list-disc">
                        {exp.achievements.map((achievement: string) => (
                          <li key={achievement}>{achievement}</li>
                        ))}
                      </ul>
                    )}
                    {exp.technologies && exp.technologies.length > 0 && (
                      <div className="mt-1 text-sm print:text-base">
                        <span className="font-medium">Technologien:</span> {exp.technologies.join(", ")}
                      </div>
                    )}
                    {exp.skills && exp.skills.length > 0 && (
                      <div className="mt-1 text-sm print:text-base">
                        <span className="font-medium">Erworbene Fähigkeiten:</span> {exp.skills.join(", ")}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      )
    }
    // Standard-Layout: Zeitraum links, Inhalte rechts
    return (
      <div className="print:shadow-none print:border-0 print:break-before-page print:break-inside-avoid">
        <div className="print:pb-4">
          <div className="print:text-xl">Berufserfahrung</div>
        </div>
        <div className="space-y-8 print:space-y-6">
          {Object.entries(groupedExperiences).map(([company, companyExperiences]: [string, any]) => (
            <div key={company} className="space-y-4">
              {/* Company Header */}
              <div className="flex items-center gap-3 pb-2 border-gray-200 print:border-gray-400 border-b">
                <Building2 className="print:hidden w-5 h-5 text-gray-600" />
                <div className="flex-1">
                  <h4 className="font-semibold print:font-bold print:text-base text-lg">{company}</h4>
                </div>
              </div>
              {/* Company Positions */}
              <div className="space-y-6 print:space-y-4">
                {companyExperiences.map((exp: any) => {
                  const employmentType = getEmploymentTypeBadge(exp.employmentType)
                  const positionFiles = (application.selected_documents || []).filter(
                    (doc: any) => doc.section === "experience" && doc.itemId === exp.id,
                  )
                  return (
                    <div key={exp.id} className="gap-4 grid grid-cols-6 pl-4 print:border-gray-400 border-blue-200 border-l-2 print:border-l-4">
                      {/* Zeitraum links */}
                      <div className="flex flex-col items-start col-span-2">
                        <Calendar className="print:hidden inline-block mr-1 w-4 h-4" />
                        {formatDate(exp.startDate)} - {exp.current ? "heute" : formatDate(exp.endDate)}
                        <div className="flex flex-wrap gap-1 mt-1">
                          <Badge className={employmentType.color}>{employmentType.label}</Badge>
                          {exp.technologies?.map((tech: string) => (
                            <Badge
                              key={tech}
                              variant="secondary"
                              className="print:bg-gray-100 print:px-2 print:py-1 print:text-black text-xs print:text-sm"
                            >
                              {tech}
                            </Badge>
                          ))}
                          {exp.skills?.map((skill: string) => (
                            <Badge
                              key={skill}
                              variant="outline"
                              className="print:bg-gray-100 print:px-2 print:py-1 print:text-black text-xs print:text-sm"
                            >
                              {skill}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      {/* Inhalte rechts */}
                      <div className="col-span-4">
                        <div className="print:block flex justify-between items-start mb-2">
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <h5 className="font-medium print:font-bold print:text-base">{exp.title}</h5>
                            </div>
                            {exp.location && (
                              <div className="text-muted-foreground print:text-black text-sm print:text-base">
                                {exp.location}
                              </div>
                            )}
                          </div>
                        </div>
                        {exp.description && (
                          <p className="mb-3 text-sm print:text-base leading-relaxed print:leading-relaxed">
                            {exp.description}
                          </p>
                        )}
                        {exp.achievements && exp.achievements.length > 0 && (
                          <div className="mb-3">
                            <div className="mb-1 font-medium print:font-bold text-sm print:text-base">Erfolge:</div>
                            <ul className="space-y-1 print:space-y-1 text-sm print:text-base">
                              {exp.achievements.map((achievement: string) => (
                                <li key={achievement} className="flex items-start gap-2">
                                  <span className="mt-1 text-blue-500 print:text-black">•</span>
                                  <span>{achievement}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                        {exp.technologies && exp.technologies.length > 0 && (
                          <div className="mb-3">
                            <div className="mb-1 font-medium print:font-bold text-sm print:text-base">Technologien:</div>
                            <div className="flex flex-wrap gap-1 print:gap-2">
                              {exp.technologies.map((tech: string) => (
                                <Badge
                                  key={tech}
                                  variant="secondary"
                                  className="print:bg-gray-100 print:px-2 print:py-1 print:text-black text-xs print:text-sm"
                                >
                                  {tech}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        )}
                        {exp.skills && exp.skills.length > 0 && (
                          <div className="mb-3">
                            <div className="mb-1 font-medium print:font-bold text-sm print:text-base">
                              Erworbene Fähigkeiten:
                            </div>
                            <div className="flex flex-wrap gap-1 print:gap-2">
                              {exp.skills.map((skill: string) => (
                                <Badge
                                  key={skill}
                                  variant="outline"
                                  className="print:bg-gray-100 print:px-2 print:py-1 print:text-black text-xs print:text-sm"
                                >
                                  {skill}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        )}
                        {/* Position-specific attachments */}
                        {positionFiles.length > 0 && (
                          <div className="mb-3">
                            <div className="flex items-center gap-1 mb-2 font-medium print:font-bold text-sm print:text-base">
                              <Paperclip className="print:hidden w-4 h-4" />
                              Angehängte Dokumente ({positionFiles.length}):
                            </div>
                            <div className="gap-2 print:gap-1 grid grid-cols-1 md:grid-cols-2 print:grid-cols-1">
                              {positionFiles.map((file: any) => (
                                <div
                                  key={file.id}
                                  className="flex items-center gap-2 bg-gray-50 print:bg-transparent p-2 print:border print:border-gray-300 rounded text-xs"
                                >
                                  <FileText className="print:hidden w-3 h-3 text-gray-500" />
                                  <div className="flex-1 min-w-0">
                                    <div className="font-medium print:text-sm truncate">{file.name}</div>
                                    {file.description && (
                                      <div className="text-gray-600 print:text-black print:text-xs truncate">
                                        {file.description}
                                      </div>
                                    )}
                                  </div>
                                  <Badge variant="outline" className="print:hidden text-xs">
                                    {(file.size / 1024).toFixed(1)} KB
                                  </Badge>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  const renderEducation = (atsMode: boolean) =>
    application.resume_data?.education?.degree && (
      <div className="print:shadow-none print:border-0 print:break-before-page print:break-inside-avoid">
        <div className="print:pb-4">
          <div className="print:text-xl">Bildung</div>
        </div>
        <div className="space-y-3">
          <div className="gap-4 grid grid-cols-6">
            {/* Zeitraum links */}
            <div className="flex flex-col items-start col-span-2">
              <Calendar className="print:hidden inline-block mr-1 w-4 h-4" />
              {formatDate(application.resume_data.education.degree.startDate)} - {formatDate(application.resume_data.education.degree.graduationYear)}
            </div>
            {/* Inhalte rechts */}
            <div className="col-span-4">
              <h4 className="font-medium print:font-bold print:text-base">
                {application.resume_data.education.degree.title}
              </h4>
              <div className="text-muted-foreground print:text-black text-sm print:text-base">
                {application.resume_data.education.degree.institution}
                {application.resume_data.education.degree.location && ` • ${application.resume_data.education.degree.location}`}
                {application.resume_data.education.degree.graduationYear && ` • ${application.resume_data.education.degree.graduationYear}`}
              </div>
              {application.resume_data.education.degree.gpa && (
                <div className="text-muted-foreground print:text-black text-sm print:text-base">
                  Note: {application.resume_data.education.degree.gpa}
                </div>
              )}
              {application.resume_data.education.degree.thesis && (
                <div className="mt-2 text-sm print:text-base">
                  <span className="font-medium print:font-bold">Abschlussarbeit:</span>{" "}
                  {application.resume_data.education.degree.thesis}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    )

  const renderSkills = () =>
    application.resume_data?.skills &&
    Object.keys(application.resume_data.skills).length > 0 && (
      <div className="print:shadow-none print:border-0 print:break-before-page print:break-inside-avoid">
        <div className="print:pb-4">
          <div className="print:text-xl">Fähigkeiten</div>
        </div>
        <div className="space-y-4">
          {Object.entries(application.resume_data.skills).map(([categoryName, skills]: [string, any]) => (
            <div key={categoryName}>
              <h5 className="mb-2 font-medium print:font-bold print:text-base capitalize">{categoryName}</h5>
              <div className="gap-3 print:gap-2 grid grid-cols-1 md:grid-cols-2 print:grid-cols-2">
                {skills.map((skill: any) => (
                  <div key={skill.id} className="flex justify-between print:justify-start items-center print:gap-4">
                    <div className="flex-1">
                      <div className="font-medium print:font-bold text-sm print:text-base">{skill.name}</div>
                      <div className="text-muted-foreground print:text-black text-xs print:text-sm">
                        {skill.yearsOfExperience} Jahre Erfahrung
                      </div>
                    </div>
                    <div className="print:hidden flex items-center gap-1">{renderStars(skill.rating)}</div>
                    <div className="hidden print:block text-sm">
                      {Array.from({ length: skill.rating }, () => "★").join("")}
                      {Array.from({ length: 5 - skill.rating }, () => "☆").join("")}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    )

  const renderLanguages = () =>
    application.resume_data?.languages &&
    application.resume_data.languages.length > 0 && (
      <div className="print:shadow-none print:border-0 print:break-before-page print:break-inside-avoid">
        <div className="print:pb-4">
          <div className="print:text-xl">Sprachen</div>
        </div>
        <div className="space-y-4">
          {application.resume_data.languages.map((language: any) => (
            <div key={language.id} className="flex justify-between print:justify-start items-center print:gap-4">
              <div>
                <div className="flex items-center gap-2 font-medium print:font-bold print:text-base">
                  {language.flag && <span>{language.flag}</span>}
                  {language.name}
                </div>
                <div className="text-muted-foreground print:text-black text-sm print:text-base">
                  {language.description}
                </div>
              </div>
              <Badge variant="outline" className="print:bg-gray-100 print:text-black print:text-sm">
                {language.level}
              </Badge>
            </div>
          ))}
        </div>
      </div>
    )

  const renderProjects = () =>
    application.projects_data &&
    application.projects_data.length > 0 && (
      <div className="print:shadow-none print:border-0 print:break-before-page print:break-inside-avoid">
        <div className="print:pb-4">
          <div className="print:text-xl">Projekte</div>
        </div>
        <div className="space-y-6 print:space-y-4">
          {application.projects_data.map((project: any) => (
            <div key={project.id} className="pl-4 border-green-200 print:border-gray-400 border-l-2 print:border-l-4">
              <div className="print:block flex justify-between items-start mb-2">
                <div>
                  <h4 className="flex items-center gap-2 font-medium print:font-bold print:text-base">
                    {project.name}
                    {project.url && (
                      <a href={project.url} target="_blank" rel="noopener noreferrer" className="print:hidden">
                        <ExternalLink className="w-4 h-4 text-blue-500" />
                      </a>
                    )}
                  </h4>
                  <div className="text-muted-foreground print:text-black text-sm print:text-base">
                    {project.role && `${project.role} • `}
                    {project.teamSize && `${project.teamSize} • `}
                    <Badge
                      variant="outline"
                      className="print:bg-gray-100 print:px-2 print:py-1 print:text-black text-xs print:text-sm"
                    >
                      {project.status === "completed"
                        ? "Abgeschlossen"
                        : project.status === "in-progress"
                          ? "In Bearbeitung"
                          : "Geplant"}
                    </Badge>
                  </div>
                </div>
                <div className="flex items-center gap-1 print:mt-1 text-muted-foreground print:text-black text-sm print:text-base">
                  <Calendar className="print:hidden w-4 h-4" />
                  {formatDate(project.startDate)} - {formatDate(project.endDate)}
                </div>
              </div>

              {project.description && (
                <p className="mb-3 text-sm print:text-base leading-relaxed print:leading-relaxed">
                  {project.description}
                </p>
              )}

              {project.achievements && project.achievements.length > 0 && (
                <div className="mb-3">
                  <div className="mb-1 font-medium print:font-bold text-sm print:text-base">Erfolge:</div>
                  <ul className="space-y-1 print:space-y-1 text-sm print:text-base">
                    {project.achievements.map((achievement: string) => (
                      <li key={achievement} className="flex items-start gap-2">
                        <span className="mt-1 text-green-500 print:text-black">•</span>
                        <span>{achievement}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {project.technologies && project.technologies.length > 0 && (
                <div className="flex flex-wrap gap-1 print:gap-2 mb-3">
                  {project.technologies.map((tech: string) => (
                    <Badge
                      key={tech}
                      variant="secondary"
                      className="print:bg-gray-100 print:px-2 print:py-1 print:text-black text-xs print:text-sm"
                    >
                      {tech}
                    </Badge>
                  ))}
                </div>
              )}

              {project.impact && (
                <div className="text-sm print:text-base">
                  <span className="font-medium print:font-bold">Impact:</span> {project.impact}
                </div>
              )}

              {project.github && (
                <div className="mt-2 text-sm print:text-base">
                  <a
                    href={project.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 text-blue-500 print:text-black hover:underline print:no-underline"
                  >
                    <Github className="print:hidden w-4 h-4" />
                    GitHub Repository: {project.github}
                  </a>
                </div>
              )}

              {project.url && (
                <div className="hidden print:block mt-1 text-sm print:text-base">
                  <span className="font-medium">Live Demo:</span> {project.url}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    )

  return (
    <div className="flex mx-auto max-w-5xl min-h-[80vh]">
      {/* Sidebar */}
      <nav className="flex flex-col gap-2 bg-white py-8 border-r w-48">
        {docTypes.map(doc => (
          <button
            key={doc.id}
            className={`text-left px-4 py-2 rounded font-medium transition-colors ${selectedDoc === doc.id ? 'bg-blue-100 text-blue-800' : 'hover:bg-gray-100 text-gray-700'}`}
            onClick={() => setSelectedDoc(doc.id as any)}
            type="button"
          >
            {doc.label}
          </button>
        ))}
      </nav>
      {/* Document Preview */}
      <div className="flex flex-col flex-1 p-6">
        <div className="flex-1">
          {selectedDoc === 'cover-letter' && (
            <div className="bg-gray-50 shadow-md mb-8 p-6 border rounded-lg">{renderCoverLetter()}</div>
          )}
          {selectedDoc === 'resume' && (
            <>
              <div className="flex items-center gap-2 mb-4">
                <Switch checked={atsMode} onCheckedChange={setAtsMode} id="ats-toggle" />
                <label htmlFor="ats-toggle" className="font-medium text-sm">ATS-optimiertes Layout</label>
              </div>
              <div className="bg-gray-50 shadow-md mb-8 p-6 border rounded-lg">
                {renderContactHeader()}
                <Separator className="my-2 print:my-2" />
                {renderExperience(atsMode)}
                {renderEducation(atsMode)}
                {renderSkills()}
                {renderLanguages()}
              </div>
            </>
          )}
          {selectedDoc === 'projects' && (
            <div className="bg-gray-50 shadow-md mb-8 p-6 border rounded-lg">{renderProjects()}</div>
          )}
        </div>
        {/* Blätterfunktion */}
        <div className="flex justify-between mt-8">
          <button
            onClick={goToPrevious}
            className="bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded font-medium text-gray-700"
            type="button"
          >
            ← Vorheriges
          </button>
          <button
            onClick={goToNext}
            className="bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded font-medium text-gray-700"
            type="button"
          >
            Nächstes →
          </button>
        </div>
      </div>
    </div>
  )
}
