"use client"
import {
  Calendar,
  Phone,
  Mail,
  Globe,
  Github,
  ExternalLink,
  Users,
  Target,
  TrendingUp,
  Code2,
  Star,
} from "lucide-react"
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
      className="max-w-none mx-auto bg-white text-black"
      style={{ fontFamily: "Times New Roman, serif", fontSize: "11pt", lineHeight: "1.3" }}
    >
      {/* Header */}
      <div className="text-center mb-8 pb-4 border-b border-gray-400">
        <h1 className="text-2xl font-bold mb-2">PROJEKTPORTFOLIO</h1>
        <h2 className="text-lg font-medium mb-3">{personalInfo.fullName || "Ihr Name"}</h2>
        <div className="text-sm space-y-1">
          <div className="flex justify-center items-center gap-4 flex-wrap">
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
      <div className="mb-8 bg-blue-50 p-4 rounded border-l-4 border-blue-500">
        <h2 className="text-base font-bold mb-3 flex items-center gap-2">
          <Target className="w-4 h-4" />
          PORTFOLIO-ÜBERSICHT
        </h2>
        <div className="grid grid-cols-4 gap-4 text-center">
          <div className="bg-white p-3 rounded border">
            <div className="text-2xl font-bold text-blue-600">{totalProjects}</div>
            <div className="text-xs text-gray-600">Projekte gesamt</div>
          </div>
          <div className="bg-white p-3 rounded border">
            <div className="text-2xl font-bold text-green-600">{completedProjects}</div>
            <div className="text-xs text-gray-600">Abgeschlossen</div>
          </div>
          <div className="bg-white p-3 rounded border">
            <div className="text-2xl font-bold text-purple-600">{allTechnologies.length}</div>
            <div className="text-xs text-gray-600">Technologien</div>
          </div>
          <div className="bg-white p-3 rounded border">
            <div className="text-2xl font-bold text-orange-600">{Math.round(avgProjectDuration || 0)}</div>
            <div className="text-xs text-gray-600">Ø Monate/Projekt</div>
          </div>
        </div>
      </div>

      {/* Technology Stack Overview */}
      <div className="mb-8">
        <h2 className="text-base font-bold mb-3 pb-1 border-b border-gray-300 flex items-center gap-2">
          <Code2 className="w-4 h-4" />
          TECHNOLOGIE-STACK
        </h2>
        <div className="bg-gray-50 p-4 rounded border">
          <div className="flex flex-wrap gap-2">
            {allTechnologies.map((tech: string) => (
              <span key={tech} className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded border">
                {tech}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Detailed Projects */}
      <div className="space-y-8">
        <h2 className="text-base font-bold mb-4 pb-1 border-b border-gray-300">DETAILLIERTE PROJEKTBESCHREIBUNGEN</h2>

        {projects.map((project: any, index: number) => (
          <div key={project.id} className="border-l-4 border-purple-400 pl-4 bg-purple-50 p-4 rounded-r">
            {/* Project Header */}
            <div className="mb-4">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h3 className="text-lg font-bold text-purple-800">{project.name}</h3>
                  <div className="flex items-center gap-4 text-sm text-gray-600 mt-1">
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
            <div className="mb-4 bg-white p-3 rounded border">
              <h4 className="font-medium text-sm mb-2">Projektbeschreibung</h4>
              <p className="text-sm text-justify leading-relaxed">{project.description}</p>
            </div>

            {/* Technologies Used */}
            {project.technologies && project.technologies.length > 0 && (
              <div className="mb-4 bg-white p-3 rounded border">
                <h4 className="font-medium text-sm mb-2 flex items-center gap-1">
                  <Code2 className="w-3 h-3" />
                  Verwendete Technologien
                </h4>
                <div className="flex flex-wrap gap-1">
                  {project.technologies.map((tech: string, techIndex: number) => (
                    <span key={techIndex} className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded border">
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Project Achievements */}
            {project.achievements && project.achievements.length > 0 && (
              <div className="mb-4 bg-white p-3 rounded border">
                <h4 className="font-medium text-sm mb-2 flex items-center gap-1">
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
              <div className="bg-white p-3 rounded border">
                <h4 className="font-medium text-sm mb-2 flex items-center gap-1">
                  <Star className="w-3 h-3" />
                  Projektwirkung
                </h4>
                <p className="text-sm text-gray-700">{project.impact}</p>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className="text-center text-xs text-gray-500 mt-8 pt-4 border-t border-gray-300">
        Projektportfolio - {personalInfo.fullName} - {new Date().toLocaleDateString("de-DE")} - Seite 1
      </div>
    </div>
  )
}
