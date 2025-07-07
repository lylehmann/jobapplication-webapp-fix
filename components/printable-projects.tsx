"use client"
import Calendar from "lucide-react/dist/esm/icons/calendar"
import Phone from "lucide-react/dist/esm/icons/phone"
import Mail from "lucide-react/dist/esm/icons/mail"
import Globe from "lucide-react/dist/esm/icons/globe"
import Github from "lucide-react/dist/esm/icons/github"
import ExternalLink from "lucide-react/dist/esm/icons/external-link"
import Users from "lucide-react/dist/esm/icons/users"
import Target from "lucide-react/dist/esm/icons/target"
import TrendingUp from "lucide-react/dist/esm/icons/trending-up"
import Code2 from "lucide-react/dist/esm/icons/code-2"
import Star from "lucide-react/dist/esm/icons/star"
import type { Database } from "@/lib/database.types"

type Application = Database["public"]["Tables"]["applications"]["Row"]

interface PrintableProjectsProps {
  application: Application
}

export function PrintableProjects({ application }: PrintableProjectsProps) {
  const personalInfo = application.personal_info || {}
  const projects = application.projects_data || []

  // Get all unique technologies from projects
  const allTechnologies = Array.from(new Set(projects.flatMap((project: any) => project.technologies || []))).sort()

  // Calculate project statistics
  const completedProjects = projects.filter((p: any) => p.status === "completed").length
  const totalProjects = projects.length
  const avgProjectDuration =
    projects.reduce((acc: number, project: any) => {
      if (project.startDate && project.endDate) {
        const start = new Date(project.startDate + "-01")
        const end = new Date(project.endDate + "-01")
        const months = (end.getFullYear() - start.getFullYear()) * 12 + (end.getMonth() - start.getMonth())
        return acc + months
      }
      return acc
    }, 0) / projects.filter((p: any) => p.startDate && p.endDate).length

  return (
    <div
      id="printable-projects"
      className="bg-white mx-auto max-w-none text-black"
      style={{ fontFamily: "Times New Roman, serif", fontSize: "11pt", lineHeight: "1.3" }}
    >
      {/* Header */}
      <div className="mb-8 pb-4 border-gray-400 border-b text-center">
        <h1 className="mb-2 font-bold text-2xl">PROJEKTPORTFOLIO</h1>
        <h2 className="mb-3 font-medium text-lg">{personalInfo.fullName || "Ihr Name"}</h2>
        <div className="space-y-1 text-sm">
          <div className="flex flex-wrap justify-center items-center gap-4">
            {personalInfo.email && (
              <span className="flex items-center gap-1">
                <Mail className="w-3 h-3" />
                {personalInfo.email}
              </span>
            )}
            {personalInfo.phone && (
              <span className="flex items-center gap-1">
                <Phone className="w-3 h-3" />
                {personalInfo.phone}
              </span>
            )}
            {personalInfo.portfolio && (
              <span className="flex items-center gap-1">
                <Globe className="w-3 h-3" />
                {personalInfo.portfolio}
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

      {/* Portfolio Summary */}
      <div className="bg-blue-50 mb-8 p-4 border-blue-500 border-l-4 rounded">
        <h2 className="flex items-center gap-2 mb-3 font-bold text-base">
          <Target className="w-4 h-4" />
          PORTFOLIO-ÜBERSICHT
        </h2>
        <div className="gap-4 grid grid-cols-4 text-center">
          <div className="bg-white p-3 border rounded">
            <div className="font-bold text-blue-600 text-2xl">{totalProjects}</div>
            <div className="text-gray-600 text-xs">Projekte gesamt</div>
          </div>
          <div className="bg-white p-3 border rounded">
            <div className="font-bold text-green-600 text-2xl">{completedProjects}</div>
            <div className="text-gray-600 text-xs">Abgeschlossen</div>
          </div>
          <div className="bg-white p-3 border rounded">
            <div className="font-bold text-purple-600 text-2xl">{allTechnologies.length}</div>
            <div className="text-gray-600 text-xs">Technologien</div>
          </div>
          <div className="bg-white p-3 border rounded">
            <div className="font-bold text-orange-600 text-2xl">{Math.round(avgProjectDuration || 0)}</div>
            <div className="text-gray-600 text-xs">Ø Monate/Projekt</div>
          </div>
        </div>
      </div>

      {/* Technology Stack Overview */}
      <div className="mb-8">
        <h2 className="flex items-center gap-2 mb-3 pb-1 border-gray-300 border-b font-bold text-base">
          <Code2 className="w-4 h-4" />
          TECHNOLOGIE-STACK
        </h2>
        <div className="bg-gray-50 p-4 border rounded">
          <div className="flex flex-wrap gap-2">
            {allTechnologies.map((tech: string) => (
              <span key={tech} className="bg-blue-100 px-2 py-1 border rounded text-blue-800 text-xs">
                {tech}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Detailed Projects */}
      <div className="space-y-8">
        <h2 className="mb-4 pb-1 border-gray-300 border-b font-bold text-base">DETAILLIERTE PROJEKTBESCHREIBUNGEN</h2>

        {projects.map((project: any, index: number) => (
          <div key={project.id} className="bg-purple-50 p-4 pl-4 border-purple-400 border-l-4 rounded-r">
            {/* Project Header */}
            <div className="mb-4">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h3 className="font-bold text-purple-800 text-lg">{project.name}</h3>
                  <div className="flex items-center gap-4 mt-1 text-gray-600 text-sm">
                    {project.role && (
                      <span className="flex items-center gap-1">
                        <Users className="w-3 h-3" />
                        {project.role}
                      </span>
                    )}
                    {project.teamSize && (
                      <span className="flex items-center gap-1">
                        <Users className="w-3 h-3" />
                        Team: {project.teamSize}
                      </span>
                    )}
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {project.startDate} - {project.endDate || "heute"}
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <div
                    className={`px-3 py-1 rounded text-xs font-medium ${
                      project.status === "completed"
                        ? "bg-green-100 text-green-800"
                        : project.status === "in-progress"
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-gray-100 text-gray-800"
                    }`}
                  >
                    {project.status === "completed"
                      ? "Abgeschlossen"
                      : project.status === "in-progress"
                        ? "In Bearbeitung"
                        : "Geplant"}
                  </div>
                </div>
              </div>

              {/* Project Links */}
              <div className="flex items-center gap-4 text-sm">
                {project.url && (
                  <a href={project.url} className="flex items-center gap-1 text-blue-600">
                    <ExternalLink className="w-3 h-3" />
                    Live Demo
                  </a>
                )}
                {project.github && (
                  <a href={project.github} className="flex items-center gap-1 text-gray-600">
                    <Github className="w-3 h-3" />
                    Repository
                  </a>
                )}
              </div>
            </div>

            {/* Project Description */}
            <div className="bg-white mb-4 p-3 border rounded">
              <h4 className="mb-2 font-medium text-sm">Projektbeschreibung</h4>
              <p className="text-sm text-justify leading-relaxed">{project.description}</p>
            </div>

            {/* Technologies Used */}
            {project.technologies && project.technologies.length > 0 && (
              <div className="bg-white mb-4 p-3 border rounded">
                <h4 className="flex items-center gap-1 mb-2 font-medium text-sm">
                  <Code2 className="w-3 h-3" />
                  Verwendete Technologien
                </h4>
                <div className="flex flex-wrap gap-1">
                  {project.technologies.map((tech: string, techIndex: number) => (
                    <span key={techIndex} className="bg-blue-100 px-2 py-1 border rounded text-blue-800 text-xs">
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Project Achievements */}
            {project.achievements && project.achievements.length > 0 && (
              <div className="bg-white mb-4 p-3 border rounded">
                <h4 className="flex items-center gap-1 mb-2 font-medium text-sm">
                  <TrendingUp className="w-3 h-3" />
                  Erfolge und Ergebnisse
                </h4>
                <ul className="space-y-1">
                  {project.achievements.map((achievement: string, achIndex: number) => (
                    <li key={achIndex} className="flex items-start text-sm">
                      <span className="mr-2 text-green-500">•</span>
                      <span>{achievement}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Project Impact */}
            {project.impact && (
              <div className="bg-white p-3 border rounded">
                <h4 className="flex items-center gap-1 mb-2 font-medium text-sm">
                  <Star className="w-3 h-3" />
                  Projektwirkung
                </h4>
                <p className="text-gray-700 text-sm">{project.impact}</p>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className="mt-8 pt-4 border-gray-300 border-t text-gray-500 text-xs text-center">
        Projektportfolio - {personalInfo.fullName} - {new Date().toLocaleDateString("de-DE")} - Seite 1
      </div>
    </div>
  )
}
