"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  User,
  Mail,
  Phone,
  MapPin,
  Globe,
  Github,
  Linkedin,
  Calendar,
  Building2,
  Star,
  ExternalLink,
  FileText,
  Award,
} from "lucide-react"
import type { Database } from "@/lib/database.types"

type Application = Database["public"]["Tables"]["applications"]["Row"]

interface ApplicationPreviewProps {
  application: Application
}

export function ApplicationPreview({ application }: ApplicationPreviewProps) {
  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star key={i} className={`w-4 h-4 ${i < rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`} />
    ))
  }

  const formatDate = (dateString: string) => {
    if (!dateString) return ""
    const date = new Date(dateString + "-01")
    return date.toLocaleDateString("de-DE", { month: "2-digit", year: "numeric" })
  }

  const renderPersonalInfo = () => (
    <Card className="print:shadow-none print:border-0">
      <CardHeader className="print:pb-4">
        <CardTitle className="flex items-center gap-2 text-center print:text-2xl">
          <User className="w-5 h-5 print:hidden" />
          {application.personal_info?.fullName || "Name nicht angegeben"}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 print:grid-cols-2 print:gap-2">
          {application.personal_info?.email && (
            <div className="flex items-center gap-2">
              <Mail className="w-4 h-4 text-muted-foreground print:hidden" />
              <span className="text-sm">{application.personal_info.email}</span>
            </div>
          )}
          {application.personal_info?.phone && (
            <div className="flex items-center gap-2">
              <Phone className="w-4 h-4 text-muted-foreground print:hidden" />
              <span className="text-sm">{application.personal_info.phone}</span>
            </div>
          )}
          {application.personal_info?.location && (
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-muted-foreground print:hidden" />
              <span className="text-sm">{application.personal_info.location}</span>
            </div>
          )}
          {application.personal_info?.portfolio && (
            <div className="flex items-center gap-2">
              <Globe className="w-4 h-4 text-muted-foreground print:hidden" />
              <span className="text-sm">{application.personal_info.portfolio}</span>
            </div>
          )}
          {application.personal_info?.github && (
            <div className="flex items-center gap-2">
              <Github className="w-4 h-4 text-muted-foreground print:hidden" />
              <span className="text-sm">{application.personal_info.github}</span>
            </div>
          )}
          {application.personal_info?.linkedin && (
            <div className="flex items-center gap-2">
              <Linkedin className="w-4 h-4 text-muted-foreground print:hidden" />
              <span className="text-sm">{application.personal_info.linkedin}</span>
            </div>
          )}
        </div>

        <Separator className="print:border-gray-400" />

        <div className="flex items-center justify-between print:justify-center print:text-center">
          <div>
            <div className="font-medium text-lg print:text-xl">{application.job_title}</div>
            <div className="text-sm text-muted-foreground flex items-center gap-1 print:justify-center">
              <Building2 className="w-4 h-4 print:hidden" />
              {application.company}
            </div>
          </div>
          <Badge variant="outline" className="print:hidden">
            {application.status.charAt(0).toUpperCase() + application.status.slice(1)}
          </Badge>
        </div>
      </CardContent>
    </Card>
  )

  const renderCoverLetter = () => (
    <Card className="print:shadow-none print:border-0 print:break-before-page">
      <CardHeader className="print:pb-4">
        <CardTitle className="print:text-xl">Anschreiben</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 print:space-y-6">
        <div className="text-right text-sm text-muted-foreground print:text-black">
          {application.cover_letter_data?.date &&
            new Date(application.cover_letter_data.date).toLocaleDateString("de-DE")}
        </div>

        {application.cover_letter_data?.address && (
          <div className="text-sm print:text-base">
            <div className="font-medium">{application.cover_letter_data.company || application.company}</div>
            <div className="whitespace-pre-line">{application.cover_letter_data.address}</div>
          </div>
        )}

        {application.cover_letter_data?.subject && (
          <div className="font-medium print:text-base print:font-bold">
            Betreff: {application.cover_letter_data.subject}
          </div>
        )}

        {application.cover_letter_data?.salutation && (
          <div className="print:text-base">{application.cover_letter_data.salutation}</div>
        )}

        {application.cover_letter_data?.openingParagraph && (
          <p className="text-sm leading-relaxed print:text-base print:leading-relaxed">
            {application.cover_letter_data.openingParagraph}
          </p>
        )}

        {application.cover_letter_data?.bodyParagraphs && (
          <div className="text-sm leading-relaxed whitespace-pre-line print:text-base print:leading-relaxed">
            {application.cover_letter_data.bodyParagraphs}
          </div>
        )}

        {application.cover_letter_data?.closingParagraph && (
          <p className="text-sm leading-relaxed print:text-base print:leading-relaxed">
            {application.cover_letter_data.closingParagraph}
          </p>
        )}

        {application.cover_letter_data?.signOff && (
          <div className="text-sm print:text-base print:mt-8">
            {application.cover_letter_data.signOff}
            <br />
            {application.personal_info?.fullName}
          </div>
        )}
      </CardContent>
    </Card>
  )

  const renderSummary = () =>
    application.resume_data?.summary && (
      <Card className="print:shadow-none print:border-0 print:break-before-page">
        <CardHeader className="print:pb-4">
          <CardTitle className="print:text-xl">Berufliches Profil</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm leading-relaxed print:text-base print:leading-relaxed">
            {application.resume_data.summary}
          </p>
        </CardContent>
      </Card>
    )

  const renderExperience = () =>
    application.resume_data?.experience &&
    application.resume_data.experience.length > 0 && (
      <Card className="print:shadow-none print:border-0">
        <CardHeader className="print:pb-4">
          <CardTitle className="print:text-xl">Berufserfahrung</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6 print:space-y-4">
          {application.resume_data.experience.map((exp: any) => (
            <div key={exp.id} className="border-l-2 border-blue-200 pl-4 print:border-l-4 print:border-gray-400">
              <div className="flex items-start justify-between mb-2 print:block">
                <div>
                  <h4 className="font-medium print:text-base print:font-bold">{exp.title}</h4>
                  <div className="text-sm text-muted-foreground flex items-center gap-1 print:text-black print:text-base">
                    <Building2 className="w-4 h-4 print:hidden" />
                    {exp.company}
                    {exp.location && ` • ${exp.location}`}
                  </div>
                </div>
                <div className="text-sm text-muted-foreground flex items-center gap-1 print:text-black print:text-base print:mt-1">
                  <Calendar className="w-4 h-4 print:hidden" />
                  {formatDate(exp.startDate)} - {exp.current ? "heute" : formatDate(exp.endDate)}
                </div>
              </div>

              {exp.description && (
                <p className="text-sm leading-relaxed mb-3 print:text-base print:leading-relaxed">{exp.description}</p>
              )}

              {exp.achievements && exp.achievements.length > 0 && (
                <div className="mb-3">
                  <div className="text-sm font-medium mb-1 print:text-base print:font-bold">Erfolge:</div>
                  <ul className="text-sm space-y-1 print:text-base print:space-y-1">
                    {exp.achievements.map((achievement: string, index: number) => (
                      <li key={index} className="flex items-start gap-2">
                        <span className="text-blue-500 mt-1 print:text-black">•</span>
                        <span>{achievement}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {exp.technologies && exp.technologies.length > 0 && (
                <div className="flex flex-wrap gap-1 print:gap-2">
                  {exp.technologies.map((tech: string, index: number) => (
                    <Badge
                      key={index}
                      variant="secondary"
                      className="text-xs print:bg-gray-100 print:text-black print:text-sm print:px-2 print:py-1"
                    >
                      {tech}
                    </Badge>
                  ))}
                </div>
              )}
            </div>
          ))}
        </CardContent>
      </Card>
    )

  const renderEducation = () =>
    application.resume_data?.education?.degree && (
      <Card className="print:shadow-none print:border-0">
        <CardHeader className="print:pb-4">
          <CardTitle className="print:text-xl">Bildung</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div>
              <h4 className="font-medium print:text-base print:font-bold">
                {application.resume_data.education.degree.title}
              </h4>
              <div className="text-sm text-muted-foreground print:text-black print:text-base">
                {application.resume_data.education.degree.institution}
                {application.resume_data.education.degree.location &&
                  ` • ${application.resume_data.education.degree.location}`}
                {application.resume_data.education.degree.graduationYear &&
                  ` • ${application.resume_data.education.degree.graduationYear}`}
              </div>
              {application.resume_data.education.degree.gpa && (
                <div className="text-sm text-muted-foreground print:text-black print:text-base">
                  Note: {application.resume_data.education.degree.gpa}
                </div>
              )}
              {application.resume_data.education.degree.thesis && (
                <div className="text-sm mt-2 print:text-base">
                  <span className="font-medium print:font-bold">Abschlussarbeit:</span>{" "}
                  {application.resume_data.education.degree.thesis}
                </div>
              )}
            </div>

            {application.resume_data.education.certifications &&
              application.resume_data.education.certifications.length > 0 && (
                <div>
                  <Separator className="my-3 print:border-gray-400" />
                  <h5 className="font-medium mb-2 flex items-center gap-2 print:text-base print:font-bold">
                    <Award className="w-4 h-4 print:hidden" />
                    Zertifikate
                  </h5>
                  <div className="space-y-2">
                    {application.resume_data.education.certifications.map((cert: any) => (
                      <div key={cert.id} className="text-sm print:text-base">
                        <div className="font-medium print:font-bold">{cert.name}</div>
                        <div className="text-muted-foreground print:text-black">
                          {cert.issuer} • {new Date(cert.date).toLocaleDateString("de-DE")}
                          {cert.expirationDate &&
                            ` • Gültig bis ${new Date(cert.expirationDate).toLocaleDateString("de-DE")}`}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
          </div>
        </CardContent>
      </Card>
    )

  const renderSkills = () =>
    application.resume_data?.skills &&
    Object.keys(application.resume_data.skills).length > 0 && (
      <Card className="print:shadow-none print:border-0">
        <CardHeader className="print:pb-4">
          <CardTitle className="print:text-xl">Fähigkeiten</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {Object.entries(application.resume_data.skills).map(([categoryName, skills]: [string, any]) => (
            <div key={categoryName}>
              <h5 className="font-medium mb-2 capitalize print:text-base print:font-bold">{categoryName}</h5>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 print:grid-cols-2 print:gap-2">
                {skills.map((skill: any) => (
                  <div key={skill.id} className="flex items-center justify-between print:justify-start print:gap-4">
                    <div className="flex-1">
                      <div className="text-sm font-medium print:text-base print:font-bold">{skill.name}</div>
                      <div className="text-xs text-muted-foreground print:text-sm print:text-black">
                        {skill.yearsOfExperience} Jahre Erfahrung
                      </div>
                    </div>
                    <div className="flex items-center gap-1 print:hidden">{renderStars(skill.rating)}</div>
                    <div className="hidden print:block text-sm">
                      {Array.from({ length: skill.rating }, () => "★").join("")}
                      {Array.from({ length: 5 - skill.rating }, () => "☆").join("")}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    )

  const renderLanguages = () =>
    application.resume_data?.languages &&
    application.resume_data.languages.length > 0 && (
      <Card className="print:shadow-none print:border-0">
        <CardHeader className="print:pb-4">
          <CardTitle className="print:text-xl">Sprachen</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 print:grid-cols-2 print:gap-2">
            {application.resume_data.languages.map((language: any) => (
              <div key={language.id} className="flex items-center justify-between print:justify-start print:gap-4">
                <div>
                  <div className="font-medium flex items-center gap-2 print:text-base print:font-bold">
                    {language.flag && <span>{language.flag}</span>}
                    {language.name}
                  </div>
                  <div className="text-sm text-muted-foreground print:text-base print:text-black">
                    {language.description}
                  </div>
                </div>
                <Badge variant="outline" className="print:bg-gray-100 print:text-black print:text-sm">
                  {language.level}
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    )

  const renderProjects = () =>
    application.projects_data &&
    application.projects_data.length > 0 && (
      <Card className="print:shadow-none print:border-0">
        <CardHeader className="print:pb-4">
          <CardTitle className="print:text-xl">Projekte</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6 print:space-y-4">
          {application.projects_data.map((project: any) => (
            <div key={project.id} className="border-l-2 border-green-200 pl-4 print:border-l-4 print:border-gray-400">
              <div className="flex items-start justify-between mb-2 print:block">
                <div>
                  <h4 className="font-medium flex items-center gap-2 print:text-base print:font-bold">
                    {project.name}
                    {project.url && (
                      <a href={project.url} target="_blank" rel="noopener noreferrer" className="print:hidden">
                        <ExternalLink className="w-4 h-4 text-blue-500" />
                      </a>
                    )}
                  </h4>
                  <div className="text-sm text-muted-foreground print:text-base print:text-black">
                    {project.role && `${project.role} • `}
                    {project.teamSize && `${project.teamSize} • `}
                    <Badge
                      variant="outline"
                      className="text-xs print:bg-gray-100 print:text-black print:text-sm print:px-2 print:py-1"
                    >
                      {project.status === "completed"
                        ? "Abgeschlossen"
                        : project.status === "in-progress"
                          ? "In Bearbeitung"
                          : "Geplant"}
                    </Badge>
                  </div>
                </div>
                <div className="text-sm text-muted-foreground flex items-center gap-1 print:text-black print:text-base print:mt-1">
                  <Calendar className="w-4 h-4 print:hidden" />
                  {formatDate(project.startDate)} - {formatDate(project.endDate)}
                </div>
              </div>

              {project.description && (
                <p className="text-sm leading-relaxed mb-3 print:text-base print:leading-relaxed">
                  {project.description}
                </p>
              )}

              {project.achievements && project.achievements.length > 0 && (
                <div className="mb-3">
                  <div className="text-sm font-medium mb-1 print:text-base print:font-bold">Erfolge:</div>
                  <ul className="text-sm space-y-1 print:text-base print:space-y-1">
                    {project.achievements.map((achievement: string, index: number) => (
                      <li key={index} className="flex items-start gap-2">
                        <span className="text-green-500 mt-1 print:text-black">•</span>
                        <span>{achievement}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {project.technologies && project.technologies.length > 0 && (
                <div className="flex flex-wrap gap-1 mb-3 print:gap-2">
                  {project.technologies.map((tech: string, index: number) => (
                    <Badge
                      key={index}
                      variant="secondary"
                      className="text-xs print:bg-gray-100 print:text-black print:text-sm print:px-2 print:py-1"
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
                <div className="text-sm mt-2 print:text-base">
                  <a
                    href={project.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-500 hover:underline flex items-center gap-1 print:text-black print:no-underline"
                  >
                    <Github className="w-4 h-4 print:hidden" />
                    GitHub Repository: {project.github}
                  </a>
                </div>
              )}

              {project.url && (
                <div className="text-sm mt-1 print:text-base hidden print:block">
                  <span className="font-medium">Live Demo:</span> {project.url}
                </div>
              )}
            </div>
          ))}
        </CardContent>
      </Card>
    )

  return (
    <div className="max-w-4xl mx-auto print:max-w-none">
      <style jsx global>{`
        @media print {
          @page {
            size: A4;
            margin: 2.5cm 2cm 2.5cm 2cm;
          }
          
          body {
            font-family: 'Times New Roman', serif;
            font-size: 12pt;
            line-height: 1.4;
            color: black;
            background: white;
          }
          
          .print\\:break-before-page {
            break-before: page;
          }
          
          .print\\:hidden {
            display: none !important;
          }
          
          .print\\:block {
            display: block !important;
          }
          
          .print\\:text-base {
            font-size: 12pt !important;
          }
          
          .print\\:text-xl {
            font-size: 14pt !important;
          }
          
          .print\\:text-2xl {
            font-size: 16pt !important;
          }
          
          .print\\:font-bold {
            font-weight: bold !important;
          }
          
          .print\\:text-black {
            color: black !important;
          }
          
          .print\\:border-gray-400 {
            border-color: #9ca3af !important;
          }
          
          .print\\:bg-gray-100 {
            background-color: #f3f4f6 !important;
          }
          
          .print\\:shadow-none {
            box-shadow: none !important;
          }
          
          .print\\:border-0 {
            border: none !important;
          }
          
          .print\\:no-underline {
            text-decoration: none !important;
          }
        }
      `}</style>

      <ScrollArea className="h-[calc(100vh-200px)] print:h-auto">
        <div className="space-y-6 p-6 print:p-0 print:space-y-8">
          <div className="text-center mb-8 print:hidden">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Bewerbungsvorschau</h1>
            <p className="text-muted-foreground">
              Vorschau Ihrer Bewerbungsunterlagen für {application.job_title} bei {application.company}
            </p>
          </div>

          {renderPersonalInfo()}
          {renderCoverLetter()}
          {renderSummary()}
          {renderExperience()}
          {renderEducation()}
          {renderSkills()}
          {renderLanguages()}
          {renderProjects()}

          {/* Attached Documents */}
          {application.selected_documents && application.selected_documents.length > 0 && (
            <Card className="print:shadow-none print:border-0">
              <CardHeader className="print:pb-4">
                <CardTitle className="flex items-center gap-2 print:text-xl">
                  <FileText className="w-5 h-5 print:hidden" />
                  Angehängte Dokumente
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 print:grid-cols-1 print:gap-2">
                  {application.selected_documents.map((doc: any) => (
                    <div
                      key={doc.id}
                      className="flex items-center gap-3 p-3 border rounded-lg print:border-0 print:p-1"
                    >
                      <FileText className="w-8 h-8 text-blue-500 print:hidden" />
                      <div className="flex-1">
                        <div className="font-medium text-sm print:text-base print:font-bold">{doc.name}</div>
                        <div className="text-xs text-muted-foreground print:text-sm print:text-black">
                          {(doc.size / 1024).toFixed(1)} KB • {doc.section}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </ScrollArea>
    </div>
  )
}
