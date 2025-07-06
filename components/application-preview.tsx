"use client"

import {
  ArrowLeft,
  Edit,
  Download,
  Share,
  Smartphone,
  Palette,
  Mail,
  Phone,
  MapPin,
  Linkedin,
  Globe,
  Github,
  Code2,
  Database,
  Figma,
  GitBranch,
  Layers3,
  Terminal,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

interface Application {
  id: string
  jobTitle: string
  company: string
  status: "draft" | "in-progress" | "submitted" | "archived"
  lastModified: string
  template?: string
  coverLetter: string
  resume: any
  projectOverview: string
  documents: any[]
}

interface ApplicationPreviewProps {
  application: Application
  onBack: () => void
  onEdit: () => void
}

export function ApplicationPreview({ application, onBack, onEdit }: ApplicationPreviewProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "draft":
        return "bg-gray-100 text-gray-800"
      case "in-progress":
        return "bg-blue-100 text-blue-800"
      case "submitted":
        return "bg-green-100 text-green-800"
      case "archived":
        return "bg-yellow-100 text-yellow-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <Button variant="ghost" onClick={onBack}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Editor
            </Button>
            <div>
              <h1 className="text-2xl font-bold">{application.jobTitle}</h1>
              <p className="text-gray-600">{application.company}</p>
            </div>
            <Badge className={getStatusColor(application.status)}>{application.status}</Badge>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="outline" onClick={onEdit}>
              <Edit className="w-4 h-4 mr-2" />
              Edit
            </Button>
            <Button variant="outline">
              <Share className="w-4 h-4 mr-2" />
              Share
            </Button>
            <Button>
              <Download className="w-4 h-4 mr-2" />
              Export Bundle
            </Button>
          </div>
        </div>

        <div className="space-y-8">
          {/* Cover Letter */}
          <Card>
            <CardHeader>
              <CardTitle>Cover Letter</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="max-w-none bg-white shadow-sm border rounded-lg overflow-hidden">
                {/* Modern Header Section */}
                <div className="bg-gradient-to-r from-slate-50 to-gray-100 p-8">
                  <div className="flex justify-between items-start">
                    {/* Sender Information - Modern Layout */}
                    <div className="space-y-1">
                      <h2 className="text-2xl font-bold text-gray-900">John Doe</h2>
                      <p className="text-gray-600">Senior Frontend Developer</p>
                    </div>

                    {/* Contact Details - Modern Grid */}
                    <div className="text-right space-y-1 text-sm">
                      <div className="flex items-center justify-end gap-2">
                        <div className="w-4 h-4 bg-blue-100 rounded flex items-center justify-center">
                          <Mail className="w-3 h-3 text-blue-600" />
                        </div>
                        <span className="text-gray-700">john.doe@email.com</span>
                      </div>
                      <div className="flex items-center justify-end gap-2">
                        <div className="w-4 h-4 bg-blue-100 rounded flex items-center justify-center">
                          <Phone className="w-3 h-3 text-blue-600" />
                        </div>
                        <span className="text-gray-700">(555) 123-4567</span>
                      </div>
                      <div className="flex items-center justify-end gap-2">
                        <div className="w-4 h-4 bg-blue-100 rounded flex items-center justify-center">
                          <MapPin className="w-3 h-3 text-blue-600" />
                        </div>
                        <span className="text-gray-700">123 Main Street, San Francisco, CA 94102</span>
                      </div>
                      <div className="flex items-center justify-end gap-2">
                        <div className="w-4 h-4 bg-blue-100 rounded flex items-center justify-center">
                          <Linkedin className="w-3 h-3 text-blue-600" />
                        </div>
                        <span className="text-gray-700">linkedin.com/in/johndoe</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Letter Content */}
                <div className="p-8">
                  {/* Recipient Information - Modern Card Style */}
                  <div className="bg-gray-50 p-4 rounded-lg mb-6">
                    <div className="space-y-1">
                      <p className="font-semibold text-gray-900">Hiring Manager</p>
                      <p className="text-gray-700">Human Resources Department</p>
                      <p className="font-semibold text-gray-900">{application.company}</p>
                      <p className="text-gray-700">456 Business Ave</p>
                      <p className="text-gray-700">San Francisco, CA 94105</p>
                    </div>
                  </div>

                  {/* Date and Location - Right aligned */}
                  <div className="mb-6 text-right">
                    <p className="text-gray-700 font-medium">San Francisco, CA</p>
                    <p className="text-gray-700 font-medium">
                      {new Date().toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </p>
                  </div>

                  {/* Subject Line - Proper headline format */}
                  <div className="mb-6">
                    <p className="font-semibold text-gray-900 text-lg">
                      Subject: Application for {application.jobTitle} Position
                    </p>
                  </div>

                  {/* Letter Body */}
                  <div className="space-y-4 leading-relaxed text-gray-700">
                    <p className="font-medium text-gray-900">Dear Hiring Manager,</p>

                    <p>
                      I am writing to express my strong interest in the {application.jobTitle} position at{" "}
                      {application.company}. With my background in software development and passion for creating
                      exceptional user experiences, I am excited about the opportunity to contribute to your team's
                      success.
                    </p>

                    {application.coverLetter ? (
                      <div className="whitespace-pre-wrap">{application.coverLetter}</div>
                    ) : (
                      <div className="space-y-4">
                        <p>
                          In my previous role as Senior Frontend Developer at TechCorp Inc., I successfully led the
                          development of customer-facing web applications serving over 100,000 users. My experience with
                          React, JavaScript, and modern web technologies has enabled me to deliver high-quality
                          solutions that drive business growth and enhance user satisfaction.
                        </p>

                        <p>
                          What particularly excites me about this opportunity at {application.company} is your
                          commitment to innovation and user-centric design. I am eager to bring my technical expertise
                          and collaborative approach to help your team continue building exceptional products that make
                          a meaningful impact.
                        </p>
                      </div>
                    )}

                    <p>
                      I would welcome the opportunity to discuss how my skills and experience can contribute to{" "}
                      {application.company}'s continued success. Thank you for considering my application, and I look
                      forward to hearing from you soon.
                    </p>

                    {/* Simple Signature Section */}
                    <div className="mt-8 pt-6 border-t border-gray-200">
                      <p className="text-gray-700 mb-8">Sincerely,</p>
                      <p className="font-bold text-gray-900 text-lg">John Doe</p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Resume Preview */}
          <Card>
            <CardHeader>
              <CardTitle>Resume</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="bg-white shadow-sm border rounded-lg overflow-hidden">
                {/* Modern Professional Resume Header */}
                <div className="bg-white border-b-2 border-gray-100 p-8">
                  <div className="flex items-center gap-8">
                    {/* Profile Picture */}
                    <div className="flex-shrink-0">
                      <div className="w-28 h-28 rounded-full border-3 border-blue-200 shadow-md overflow-hidden bg-white">
                        <img
                          src="/placeholder.svg?height=112&width=112&text=Profile"
                          alt="John Doe"
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </div>

                    {/* Personal Information - Modern Layout */}
                    <div className="flex-1">
                      <div className="mb-4">
                        <h2 className="text-4xl font-bold text-gray-900 mb-1">John Doe</h2>
                        <p className="text-xl text-blue-600 font-medium">Senior Frontend Developer</p>
                        <p className="text-gray-600 mt-1">5+ years experience • San Francisco, CA</p>
                      </div>

                      {/* Contact Grid - Modern Layout */}
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-3 text-sm">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center">
                            <Mail className="w-4 h-4 text-blue-600" />
                          </div>
                          <div>
                            <p className="text-gray-500 text-xs">Email</p>
                            <p className="text-gray-900 font-medium">john.doe@email.com</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center">
                            <Phone className="w-4 h-4 text-blue-600" />
                          </div>
                          <div>
                            <p className="text-gray-500 text-xs">Phone</p>
                            <p className="text-gray-900 font-medium">(555) 123-4567</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center">
                            <Linkedin className="w-4 h-4 text-blue-600" />
                          </div>
                          <div>
                            <p className="text-gray-500 text-xs">LinkedIn</p>
                            <p className="text-gray-900 font-medium">linkedin.com/in/johndoe</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center">
                            <Globe className="w-4 h-4 text-blue-600" />
                          </div>
                          <div>
                            <p className="text-gray-500 text-xs">Portfolio</p>
                            <p className="text-gray-900 font-medium">johndoe.dev</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center">
                            <Github className="w-4 h-4 text-blue-600" />
                          </div>
                          <div>
                            <p className="text-gray-500 text-xs">GitHub</p>
                            <p className="text-gray-900 font-medium">github.com/johndoe</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center">
                            <MapPin className="w-4 h-4 text-blue-600" />
                          </div>
                          <div>
                            <p className="text-gray-500 text-xs">Location</p>
                            <p className="text-gray-900 font-medium">San Francisco, CA</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Resume Content */}
                <div className="p-8 space-y-8">
                  {/* Professional Summary */}
                  <div>
                    <h4 className="text-lg font-semibold mb-4 text-gray-900 border-b border-gray-200 pb-2">
                      Professional Summary
                    </h4>
                    <p className="text-gray-700 leading-relaxed">
                      Experienced software developer with 5+ years of expertise in full-stack development, specializing
                      in React, Node.js, and cloud technologies. Proven track record of delivering scalable applications
                      and leading cross-functional teams.
                    </p>
                  </div>

                  {/* Experience */}
                  <div>
                    <h4 className="text-xl font-bold mb-6 text-gray-900 flex items-center gap-2">
                      <div className="w-1 h-6 bg-blue-600 rounded-full"></div>
                      Work Experience
                    </h4>
                    <div className="space-y-6">
                      {/* TechCorp Inc. - Parent Company with Multiple Roles */}
                      <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
                        {/* Company Header */}
                        <div className="flex items-start justify-between mb-4 pb-4 border-b border-gray-100">
                          <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                              <Code2 className="w-6 h-6 text-blue-600" />
                            </div>
                            <div>
                              <h5 className="text-lg font-bold text-gray-900">TechCorp Inc.</h5>
                              <p className="text-gray-600">Technology Company • San Francisco, CA</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-semibold">
                              2020 - Present
                            </div>
                            <p className="text-gray-600 text-sm mt-1">3+ years total</p>
                          </div>
                        </div>

                        {/* Roles Timeline */}
                        <div className="space-y-4">
                          {/* Senior Position */}
                          <div className="relative pl-6 border-l-2 border-blue-200">
                            <div className="absolute -left-2 top-0 w-4 h-4 bg-blue-600 rounded-full"></div>
                            <div className="bg-blue-50 rounded-lg p-4">
                              <div className="flex items-start justify-between mb-3">
                                <div>
                                  <h6 className="text-lg font-semibold text-gray-900">Senior Frontend Developer</h6>
                                  <div className="flex items-center gap-3 mt-1">
                                    <Badge className="bg-blue-600 text-white">Current Role</Badge>
                                    <Badge variant="outline">Full-time</Badge>
                                    <Badge variant="outline">Remote</Badge>
                                  </div>
                                </div>
                                <div className="text-right">
                                  <p className="font-semibold text-gray-900">2022 - Present</p>
                                  <p className="text-gray-600 text-sm">2+ years</p>
                                </div>
                              </div>
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                  <h6 className="font-medium text-gray-900 mb-2 block">Key Achievements:</h6>
                                  <ul className="text-gray-700 text-sm space-y-1">
                                    <li>
                                      • Led development serving <strong>100K+ users</strong>
                                    </li>
                                    <li>
                                      • Improved performance by <strong>40%</strong>
                                    </li>
                                    <li>
                                      • Mentored <strong>5+ junior developers</strong>
                                    </li>
                                  </ul>
                                </div>
                                <div>
                                  <h6 className="font-medium text-gray-900 mb-2 block">Technologies:</h6>
                                  <div className="flex flex-wrap gap-1">
                                    <Badge variant="secondary" className="text-xs">
                                      React
                                    </Badge>
                                    <Badge variant="secondary" className="text-xs">
                                      TypeScript
                                    </Badge>
                                    <Badge variant="secondary" className="text-xs">
                                      Node.js
                                    </Badge>
                                    <Badge variant="secondary" className="text-xs">
                                      AWS
                                    </Badge>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* Junior Position */}
                          <div className="relative pl-6 border-l-2 border-gray-200">
                            <div className="absolute -left-2 top-0 w-4 h-4 bg-gray-400 rounded-full"></div>
                            <div className="bg-gray-50 rounded-lg p-4">
                              <div className="flex items-start justify-between mb-3">
                                <div>
                                  <h6 className="text-lg font-semibold text-gray-900">Frontend Developer</h6>
                                  <div className="flex items-center gap-3 mt-1">
                                    <Badge className="bg-gray-600 text-white">Previous</Badge>
                                    <Badge variant="outline">Full-time</Badge>
                                    <Badge variant="outline">Hybrid</Badge>
                                  </div>
                                </div>
                                <div className="text-right">
                                  <p className="font-semibold text-gray-900">2020 - 2022</p>
                                  <p className="text-gray-600 text-sm">2 years</p>
                                </div>
                              </div>
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                  <h6 className="font-medium text-gray-900 mb-2 block">Key Achievements:</h6>
                                  <ul className="text-gray-700 text-sm space-y-1">
                                    <li>
                                      • Reduced load times by <strong>60%</strong>
                                    </li>
                                    <li>• Built responsive applications</li>
                                    <li>• Collaborated with UX team</li>
                                  </ul>
                                </div>
                                <div>
                                  <h6 className="font-medium text-gray-900 mb-2 block">Technologies:</h6>
                                  <div className="flex flex-wrap gap-1">
                                    <Badge variant="secondary" className="text-xs">
                                      React
                                    </Badge>
                                    <Badge variant="secondary" className="text-xs">
                                      JavaScript
                                    </Badge>
                                    <Badge variant="secondary" className="text-xs">
                                      CSS
                                    </Badge>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Career Break */}
                      <div className="bg-white border border-amber-200 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
                        <div className="flex items-start justify-between mb-4 pb-4 border-b border-amber-100">
                          <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-amber-100 rounded-lg flex items-center justify-center">
                              <Terminal className="w-6 h-6 text-amber-600" />
                            </div>
                            <div>
                              <h5 className="text-lg font-bold text-gray-900">Professional Development</h5>
                              <p className="text-gray-600">Freelance & Education • Remote</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="bg-amber-100 text-amber-800 px-3 py-1 rounded-full text-sm font-semibold">
                              2019 - 2020
                            </div>
                            <p className="text-gray-600 text-sm mt-1">1 year</p>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div className="bg-amber-50 rounded-lg p-4">
                            <div className="flex items-center gap-2 mb-2">
                              <Badge className="bg-amber-600 text-white text-xs">Freelance</Badge>
                            </div>
                            <h6 className="font-semibold text-gray-900 mb-2">Web Development Coach</h6>
                            <ul className="text-gray-700 text-sm space-y-1">
                              <li>
                                • Mentored <strong>15+ developers</strong>
                              </li>
                              <li>
                                • <strong>95%</strong> satisfaction rate
                              </li>
                              <li>• Created curriculum</li>
                            </ul>
                          </div>
                          <div className="bg-amber-50 rounded-lg p-4">
                            <div className="flex items-center gap-2 mb-2">
                              <Badge className="bg-green-600 text-white text-xs">Education</Badge>
                            </div>
                            <h6 className="font-semibold text-gray-900 mb-2">Advanced Certifications</h6>
                            <ul className="text-gray-700 text-sm space-y-1">
                              <li>• AWS Solutions Architect</li>
                              <li>• Google UX Design</li>
                              <li>• React Performance</li>
                            </ul>
                          </div>
                          <div className="bg-amber-50 rounded-lg p-4">
                            <div className="flex items-center gap-2 mb-2">
                              <Badge className="bg-purple-600 text-white text-xs">Open Source</Badge>
                            </div>
                            <h6 className="font-semibold text-gray-900 mb-2">Community Contributions</h6>
                            <ul className="text-gray-700 text-sm space-y-1">
                              <li>
                                • <strong>5+</strong> major libraries
                              </li>
                              <li>
                                • <strong>10+</strong> personal projects
                              </li>
                              <li>• Hackathon participation</li>
                            </ul>
                          </div>
                        </div>
                      </div>

                      {/* Previous Company */}
                      <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                              <Palette className="w-6 h-6 text-purple-600" />
                            </div>
                            <div>
                              <h5 className="text-lg font-bold text-gray-900">DesignStudio Pro</h5>
                              <p className="text-gray-600">Design Agency • New York, NY</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-sm font-semibold">
                              2017 - 2019
                            </div>
                            <p className="text-gray-600 text-sm mt-1">2 years</p>
                          </div>
                        </div>

                        <div className="bg-gray-50 rounded-lg p-4">
                          <div className="flex items-start justify-between mb-3">
                            <div>
                              <h6 className="text-lg font-semibold text-gray-900">Junior Frontend Developer</h6>
                              <div className="flex items-center gap-3 mt-1">
                                <Badge className="bg-gray-600 text-white">Previous</Badge>
                                <Badge className="bg-orange-600 text-white">Student Job</Badge>
                                <Badge variant="outline">Full-time</Badge>
                                <Badge variant="outline">On-site</Badge>
                              </div>
                            </div>
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <h6 className="font-medium text-gray-900 mb-2 block">Key Achievements:</h6>
                              <ul className="text-gray-700 text-sm space-y-1">
                                <li>
                                  • Built websites for <strong>20+ clients</strong>
                                </li>
                                <li>
                                  • <strong>98%</strong> client satisfaction
                                </li>
                                <li>• Learned React & modern practices</li>
                              </ul>
                            </div>
                            <div>
                              <h6 className="font-medium text-gray-900 mb-2 block">Technologies:</h6>
                              <div className="flex flex-wrap gap-1">
                                <Badge variant="secondary" className="text-xs">
                                  HTML
                                </Badge>
                                <Badge variant="secondary" className="text-xs">
                                  CSS
                                </Badge>
                                <Badge variant="secondary" className="text-xs">
                                  JavaScript
                                </Badge>
                                <Badge variant="secondary" className="text-xs">
                                  jQuery
                                </Badge>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Education */}
                  <div>
                    <h4 className="text-xl font-bold mb-6 text-gray-900 flex items-center gap-2">
                      <div className="w-1 h-6 bg-blue-600 rounded-full"></div>
                      Education
                    </h4>
                    <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
                      <div className="flex items-start gap-4">
                        <div className="w-16 h-16 bg-blue-100 rounded-xl flex items-center justify-center flex-shrink-0">
                          <div className="text-blue-600 font-bold text-lg">UC</div>
                        </div>
                        <div className="flex-1">
                          <div className="flex items-start justify-between mb-3">
                            <div>
                              <h5 className="text-lg font-bold text-gray-900">
                                Bachelor of Science in Computer Science
                              </h5>
                              <p className="text-blue-600 font-semibold">University of California, Berkeley</p>
                              <p className="text-gray-600 text-sm mt-1">Berkeley, CA</p>
                            </div>
                            <div className="text-right">
                              <div className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-semibold">
                                Graduated 2018
                              </div>
                              <Badge className="bg-blue-600 text-white text-xs mt-2">Bachelor's Degree</Badge>
                            </div>
                          </div>
                          <div className="bg-blue-50 rounded-lg p-4">
                            <h6 className="font-semibold text-gray-900 mb-2">Relevant Coursework:</h6>
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                              <Badge variant="outline" className="justify-center">
                                Data Structures
                              </Badge>
                              <Badge variant="outline" className="justify-center">
                                Algorithms
                              </Badge>
                              <Badge variant="outline" className="justify-center">
                                Software Engineering
                              </Badge>
                              <Badge variant="outline" className="justify-center">
                                Database Systems
                              </Badge>
                              <Badge variant="outline" className="justify-center">
                                Web Development
                              </Badge>
                              <Badge variant="outline" className="justify-center">
                                HCI
                              </Badge>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Skills */}
                  <div>
                    <h4 className="text-lg font-semibold mb-4 text-gray-900 border-b border-gray-200 pb-2">Skills</h4>
                    <div className="space-y-6">
                      {/* Frontend Development */}
                      <div>
                        <h5 className="font-medium text-gray-800 mb-3">Frontend Development</h5>
                        <div className="space-y-2">
                          {/* Row 1 */}
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-2">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <Code2 className="w-4 h-4 text-blue-600" />
                                <span className="font-medium text-sm">JavaScript</span>
                              </div>
                              <div className="flex items-center gap-1">
                                {[...Array(5)].map((_, i) => (
                                  <div
                                    key={i}
                                    className="w-2 h-2 rounded-full"
                                    style={{ backgroundColor: i < 5 ? "rgb(37 99 235)" : "rgb(209 213 219)" }}
                                  />
                                ))}
                              </div>
                            </div>

                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <Code2 className="w-4 h-4 text-blue-600" />
                                <span className="font-medium text-sm">TypeScript</span>
                              </div>
                              <div className="flex items-center gap-1">
                                {[...Array(5)].map((_, i) => (
                                  <div
                                    key={i}
                                    className="w-2 h-2 rounded-full"
                                    style={{ backgroundColor: i < 4 ? "rgb(37 99 235)" : "rgb(209 213 219)" }}
                                  />
                                ))}
                              </div>
                            </div>
                          </div>

                          {/* Row 2 */}
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-2">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <Code2 className="w-4 h-4 text-blue-600" />
                                <span className="font-medium text-sm">React</span>
                              </div>
                              <div className="flex items-center gap-1">
                                {[...Array(5)].map((_, i) => (
                                  <div
                                    key={i}
                                    className="w-2 h-2 rounded-full"
                                    style={{ backgroundColor: "rgb(37 99 235)" }}
                                  />
                                ))}
                              </div>
                            </div>

                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <Code2 className="w-4 h-4 text-blue-600" />
                                <span className="font-medium text-sm">Vue.js</span>
                              </div>
                              <div className="flex items-center gap-1">
                                {[...Array(5)].map((_, i) => (
                                  <div
                                    key={i}
                                    className="w-2 h-2 rounded-full"
                                    style={{ backgroundColor: i < 3 ? "rgb(37 99 235)" : "rgb(209 213 219)" }}
                                  />
                                ))}
                              </div>
                            </div>
                          </div>

                          {/* Row 3 */}
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-2">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <Palette className="w-4 h-4 text-purple-600" />
                                <span className="font-medium text-sm">Tailwind CSS</span>
                              </div>
                              <div className="flex items-center gap-1">
                                {[...Array(5)].map((_, i) => (
                                  <div
                                    key={i}
                                    className="w-2 h-2 rounded-full"
                                    style={{ backgroundColor: i < 3 ? "rgb(37 99 235)" : "rgb(209 213 219)" }}
                                  />
                                ))}
                              </div>
                            </div>

                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <Code2 className="w-4 h-4 text-green-600" />
                                <span className="font-medium text-sm">Next.js</span>
                              </div>
                              <div className="flex items-center gap-1">
                                {[...Array(5)].map((_, i) => (
                                  <div
                                    key={i}
                                    className="w-2 h-2 rounded-full"
                                    style={{ backgroundColor: i < 4 ? "rgb(37 99 235)" : "rgb(209 213 219)" }}
                                  />
                                ))}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Backend Development */}
                      <div>
                        <h5 className="font-medium text-gray-800 mb-3">Backend Development</h5>
                        <div className="space-y-2">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-2">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <Terminal className="w-4 h-4 text-green-600" />
                                <span className="font-medium text-sm">Node.js</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                                <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                                <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                                <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                                <div className="w-2 h-2 bg-gray-300 rounded-full"></div>
                              </div>
                            </div>
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <Code2 className="w-4 h-4 text-yellow-600" />
                                <span className="font-medium text-sm">Python</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                                <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                                <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                                <div className="w-2 h-2 bg-gray-300 rounded-full"></div>
                                <div className="w-2 h-2 bg-gray-300 rounded-full"></div>
                              </div>
                            </div>
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-2">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <Database className="w-4 h-4 text-blue-600" />
                                <span className="font-medium text-sm">PostgreSQL</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                                <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                                <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                                <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                                <div className="w-2 h-2 bg-gray-300 rounded-full"></div>
                              </div>
                            </div>
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <Database className="w-4 h-4 text-green-600" />
                                <span className="font-medium text-sm">MongoDB</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                                <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                                <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                                <div className="w-2 h-2 bg-gray-300 rounded-full"></div>
                                <div className="w-2 h-2 bg-gray-300 rounded-full"></div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Cloud & DevOps */}
                      <div>
                        <h5 className="font-medium text-gray-800 mb-3">Cloud & DevOps</h5>
                        <div className="space-y-2">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-2">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <Database className="w-4 h-4 text-orange-600" />
                                <span className="font-medium text-sm">AWS</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                                <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                                <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                                <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                                <div className="w-2 h-2 bg-gray-300 rounded-full"></div>
                              </div>
                            </div>
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <Terminal className="w-4 h-4 text-blue-600" />
                                <span className="font-medium text-sm">Docker</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                                <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                                <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                                <div className="w-2 h-2 bg-gray-300 rounded-full"></div>
                                <div className="w-2 h-2 bg-gray-300 rounded-full"></div>
                              </div>
                            </div>
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-2">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <GitBranch className="w-4 h-4 text-orange-600" />
                                <span className="font-medium text-sm">Git</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                                <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                                <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                                <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                                <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                              </div>
                            </div>
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <Terminal className="w-4 h-4 text-gray-600" />
                                <span className="font-medium text-sm">CI/CD</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                                <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                                <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                                <div className="w-2 h-2 bg-gray-300 rounded-full"></div>
                                <div className="w-2 h-2 bg-gray-300 rounded-full"></div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Design & Tools */}
                      <div>
                        <h5 className="font-medium text-gray-800 mb-3">Design & Tools</h5>
                        <div className="space-y-2">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-2">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <Figma className="w-4 h-4 text-purple-600" />
                                <span className="font-medium text-sm">Figma</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                                <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                                <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                                <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                                <div className="w-2 h-2 bg-gray-300 rounded-full"></div>
                              </div>
                            </div>
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <Palette className="w-4 h-4 text-red-600" />
                                <span className="font-medium text-sm">Adobe Creative Suite</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                                <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                                <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                                <div className="w-2 h-2 bg-gray-300 rounded-full"></div>
                                <div className="w-2 h-2 bg-gray-300 rounded-full"></div>
                              </div>
                            </div>
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-2">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <Layers3 className="w-4 h-4 text-orange-600" />
                                <span className="font-medium text-sm">Storybook</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                                <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                                <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                                <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                                <div className="w-2 h-2 bg-gray-300 rounded-full"></div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Languages */}
                  <div>
                    <h4 className="text-lg font-semibold mb-4 text-gray-900 border-b border-gray-200 pb-2">
                      Languages
                    </h4>
                    <div className="space-y-2">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-2">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <div className="w-6 h-4 bg-blue-600 rounded-sm flex items-center justify-center">
                              <span className="text-white text-xs font-bold">EN</span>
                            </div>
                            <span className="font-medium text-sm">English</span>
                          </div>
                          <span className="text-xs text-gray-600 font-medium">C2 - Native</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <div className="w-6 h-4 bg-red-600 rounded-sm flex items-center justify-center">
                              <span className="text-white text-xs font-bold">ES</span>
                            </div>
                            <span className="font-medium text-sm">Spanish</span>
                          </div>
                          <span className="text-xs text-gray-600 font-medium">B2 - Upper Int.</span>
                        </div>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-2">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <div className="w-6 h-4 bg-black rounded-sm flex items-center justify-center">
                              <span className="text-white text-xs font-bold">DE</span>
                            </div>
                            <span className="font-medium text-sm">German</span>
                          </div>
                          <span className="text-xs text-gray-600 font-medium">A2 - Elementary</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <div className="w-6 h-4 bg-blue-500 rounded-sm flex items-center justify-center">
                              <span className="text-white text-xs font-bold">FR</span>
                            </div>
                            <span className="font-medium text-sm">French</span>
                          </div>
                          <span className="text-xs text-gray-600 font-medium">B1 - Intermediate</span>
                        </div>
                      </div>
                    </div>

                    {/* CEFR Reference */}
                    <div className="mt-3 p-2 bg-gray-50 rounded-lg">
                      <p className="text-xs text-gray-600 mb-1 font-medium">
                        CEFR: A1-A2 Basic • B1-B2 Independent • C1-C2 Proficient
                      </p>
                    </div>
                  </div>

                  {/* Location, Date, and Signature Section */}
                  <div className="mt-12 pt-6 border-t border-gray-200">
                    <div className="flex justify-between items-start">
                      <div className="text-left">
                        <p className="text-gray-700 font-medium">San Francisco, CA</p>
                        <p className="text-gray-700 font-medium">
                          {new Date().toLocaleDateString("en-US", {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          })}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-gray-700 mb-4">Sincerely,</p>
                        <div className="border-b border-gray-300 w-48 mb-2"></div>
                        <p className="text-gray-600 text-sm">Signature</p>
                        <p className="font-bold text-gray-900 mt-2">John Doe</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Project Overview */}
          <Card>
            <CardHeader>
              <CardTitle>Project Overview & Case Studies</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-8">
                {application.projectOverview ? (
                  <div className="whitespace-pre-wrap text-gray-700 leading-relaxed">{application.projectOverview}</div>
                ) : (
                  <div className="space-y-8">
                    {/* E-commerce Platform Project */}
                    <div className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm">
                      <div className="flex">
                        <div className="w-48 h-32 bg-gray-100 flex-shrink-0 overflow-hidden">
                          <img
                            src="/placeholder.svg?height=128&width=192&text=E-commerce+Platform"
                            alt="E-commerce Platform"
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="flex-1 p-6">
                          <div className="flex items-start justify-between mb-4">
                            <div>
                              <h3 className="text-xl font-bold text-gray-900">E-commerce Platform Redesign</h3>
                              <p className="text-gray-600 font-medium">TechCorp Inc. • 2023</p>
                            </div>
                            <div className="flex flex-wrap gap-2">
                              <Badge variant="outline" className="flex items-center gap-1">
                                <Code2 className="w-3 h-3" />
                                React
                              </Badge>
                              <Badge variant="outline" className="flex items-center gap-1">
                                <Terminal className="w-3 h-3" />
                                Node.js
                              </Badge>
                              <Badge variant="outline" className="flex items-center gap-1">
                                <Palette className="w-3 h-3" />
                                UX Design
                              </Badge>
                            </div>
                          </div>
                          <p className="text-gray-700 mb-4 leading-relaxed">
                            Led the complete redesign and development of a multi-vendor e-commerce platform serving
                            50,000+ daily active users. Collaborated with UX designers to create an intuitive shopping
                            experience that increased conversion rates by 35%.
                          </p>
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                            <div>
                              <p className="font-semibold text-gray-900">Challenge</p>
                              <p className="text-gray-600">Poor user experience and low conversion rates</p>
                            </div>
                            <div>
                              <p className="font-semibold text-gray-900">Solution</p>
                              <p className="text-gray-600">Modern React frontend with optimized checkout flow</p>
                            </div>
                            <div>
                              <p className="font-semibold text-gray-900">Result</p>
                              <p className="text-gray-600">35% increase in conversions, 40% faster load times</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Mobile Banking App */}
                    <div className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm">
                      <div className="flex">
                        <div className="w-48 h-32 bg-gray-100 flex-shrink-0 overflow-hidden">
                          <img
                            src="/placeholder.svg?height=128&width=192&text=Banking+App"
                            alt="Mobile Banking App"
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="flex-1 p-6">
                          <div className="flex items-start justify-between mb-4">
                            <div>
                              <h3 className="text-xl font-bold text-gray-900">Mobile Banking App UX</h3>
                              <p className="text-gray-600 font-medium">FinanceFirst Bank • 2022</p>
                            </div>
                            <div className="flex flex-wrap gap-2">
                              <Badge variant="outline" className="flex items-center gap-1">
                                <Smartphone className="w-3 h-3" />
                                React Native
                              </Badge>
                              <Badge variant="outline" className="flex items-center gap-1">
                                <Figma className="w-3 h-3" />
                                Figma
                              </Badge>
                              <Badge variant="outline" className="flex items-center gap-1">
                                <Palette className="w-3 h-3" />
                                User Research
                              </Badge>
                            </div>
                          </div>
                          <p className="text-gray-700 mb-4 leading-relaxed">
                            Designed and developed a mobile banking application focusing on accessibility and security.
                            Conducted user research with 200+ participants to understand pain points and create an
                            intuitive financial management experience.
                          </p>
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                            <div>
                              <p className="font-semibold text-gray-900">Challenge</p>
                              <p className="text-gray-600">Complex financial features in mobile interface</p>
                            </div>
                            <div>
                              <p className="font-semibold text-gray-900">Solution</p>
                              <p className="text-gray-600">User-centered design with progressive disclosure</p>
                            </div>
                            <div>
                              <p className="font-semibold text-gray-900">Result</p>
                              <p className="text-gray-600">4.8/5 app store rating, 60% increase in mobile usage</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* SaaS Dashboard */}
                    <div className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm">
                      <div className="flex">
                        <div className="w-48 h-32 bg-gray-100 flex-shrink-0 overflow-hidden">
                          <img
                            src="/placeholder.svg?height=128&width=192&text=Analytics+Dashboard"
                            alt="Analytics Dashboard"
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="flex-1 p-6">
                          <div className="flex items-start justify-between mb-4">
                            <div>
                              <h3 className="text-xl font-bold text-gray-900">Analytics Dashboard SaaS</h3>
                              <p className="text-gray-600 font-medium">DataViz Solutions • 2023</p>
                            </div>
                            <div className="flex flex-wrap gap-2">
                              <Badge variant="outline" className="flex items-center gap-1">
                                <Code2 className="w-3 h-3" />
                                Vue.js
                              </Badge>
                              <Badge variant="outline" className="flex items-center gap-1">
                                <Code2 className="w-3 h-3" />
                                D3.js
                              </Badge>
                              <Badge variant="outline" className="flex items-center gap-1">
                                <Code2 className="w-3 h-3" />
                                Python
                              </Badge>
                            </div>
                          </div>
                          <p className="text-gray-700 mb-4 leading-relaxed">
                            Built a comprehensive analytics dashboard for enterprise clients, featuring real-time data
                            visualization and customizable reporting. Implemented advanced charting capabilities and
                            interactive data exploration tools.
                          </p>
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                            <div>
                              <p className="font-semibold text-gray-900">Challenge</p>
                              <p className="text-gray-600">Complex data visualization for non-technical users</p>
                            </div>
                            <div>
                              <p className="font-semibold text-gray-900">Solution</p>
                              <p className="text-gray-600">Intuitive drag-and-drop interface with smart defaults</p>
                            </div>
                            <div>
                              <p className="font-semibold text-gray-900">Result</p>
                              <p className="text-gray-600">500+ enterprise clients, $2M ARR generated</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Design System */}
                    <div className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm">
                      <div className="flex">
                        <div className="w-48 h-32 bg-gray-100 flex-shrink-0 overflow-hidden">
                          <img
                            src="/placeholder.svg?height=128&width=192&text=Design+System"
                            alt="Design System"
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="flex-1 p-6">
                          <div className="flex items-start justify-between mb-4">
                            <div>
                              <h3 className="text-xl font-bold text-gray-900">Design System & Component Library</h3>
                              <p className="text-gray-600 font-medium">DesignStudio Pro • 2021-2022</p>
                            </div>
                            <div className="flex flex-wrap gap-2">
                              <Badge variant="outline" className="flex items-center gap-1">
                                <Layers3 className="w-3 h-3" />
                                Storybook
                              </Badge>
                              <Badge variant="outline" className="flex items-center gap-1">
                                <Code2 className="w-3 h-3" />
                                React
                              </Badge>
                              <Badge variant="outline" className="flex items-center gap-1">
                                <Palette className="w-3 h-3" />
                                Design Tokens
                              </Badge>
                            </div>
                          </div>
                          <p className="text-gray-700 mb-4 leading-relaxed">
                            Created a comprehensive design system and component library used across 15+ products.
                            Established design tokens, accessibility standards, and documentation that reduced
                            development time by 50% for new features.
                          </p>
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                            <div>
                              <p className="font-semibold text-gray-900">Challenge</p>
                              <p className="text-gray-600">Inconsistent UI across multiple products</p>
                            </div>
                            <div>
                              <p className="font-semibold text-gray-900">Solution</p>
                              <p className="text-gray-600">Unified design system with reusable components</p>
                            </div>
                            <div>
                              <p className="font-semibold text-gray-900">Result</p>
                              <p className="text-gray-600">50% faster development, 90% design consistency</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Portfolio Website */}
                    <div className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm">
                      <div className="flex">
                        <div className="w-48 h-32 bg-gray-100 flex-shrink-0 overflow-hidden">
                          <img
                            src="/placeholder.svg?height=128&width=192&text=Portfolio+Platform"
                            alt="Portfolio Platform"
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="flex-1 p-6">
                          <div className="flex items-start justify-between mb-4">
                            <div>
                              <h3 className="text-xl font-bold text-gray-900">Creative Portfolio Platform</h3>
                              <p className="text-gray-600 font-medium">Personal Project • 2023</p>
                            </div>
                            <div className="flex flex-wrap gap-2">
                              <Badge variant="outline" className="flex items-center gap-1">
                                <Code2 className="w-3 h-3" />
                                Next.js
                              </Badge>
                              <Badge variant="outline" className="flex items-center gap-1">
                                <Code2 className="w-3 h-3" />
                                Framer Motion
                              </Badge>
                              <Badge variant="outline" className="flex items-center gap-1">
                                <Palette className="w-3 h-3" />
                                Tailwind CSS
                              </Badge>
                            </div>
                          </div>
                          <p className="text-gray-700 mb-4 leading-relaxed">
                            Developed a modern portfolio platform for creative professionals with advanced animations,
                            interactive galleries, and seamless content management. Features include drag-and-drop
                            project organization and social media integration.
                          </p>
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                            <div>
                              <p className="font-semibold text-gray-900">Challenge</p>
                              <p className="text-gray-600">Showcase creative work with engaging interactions</p>
                            </div>
                            <div>
                              <p className="font-semibold text-gray-900">Solution</p>
                              <p className="text-gray-600">Animated galleries with smooth transitions</p>
                            </div>
                            <div>
                              <p className="font-semibold text-gray-900">Result</p>
                              <p className="text-gray-600">1000+ users, featured on design showcases</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Supporting Documents */}
          <Card>
            <CardHeader>
              <CardTitle>Supporting Documents</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-100 rounded flex items-center justify-center">
                      <Download className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="font-medium">AWS_Certification.pdf</p>
                      <p className="text-sm text-gray-600">Certificate • 2.3 MB</p>
                    </div>
                  </div>
                  <Button size="sm" variant="outline">
                    <Download className="w-4 h-4" />
                  </Button>
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-green-100 rounded flex items-center justify-center">
                      <Edit className="w-5 h-5 text-green-600" />
                    </div>
                    <div>
                      <p className="font-medium">Reference_Letter_Manager.pdf</p>
                      <p className="text-sm text-gray-600">Reference • 1.8 MB</p>
                    </div>
                  </div>
                  <Button size="sm" variant="outline">
                    <Download className="w-4 h-4" />
                  </Button>
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-purple-100 rounded flex items-center justify-center">
                      <Palette className="w-5 h-5 text-purple-600" />
                    </div>
                    <div>
                      <p className="font-medium">UX_Design_Portfolio.pdf</p>
                      <p className="text-sm text-gray-600">Portfolio • 5.1 MB</p>
                    </div>
                  </div>
                  <Button size="sm" variant="outline">
                    <Download className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
