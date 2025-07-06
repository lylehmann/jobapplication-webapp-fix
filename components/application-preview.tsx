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
                {/* Modern Resume Header - Similar to Cover Letter */}
                <div className="bg-gradient-to-r from-slate-50 to-gray-100 p-8 border-b">
                  <div className="flex items-start gap-8">
                    {/* Profile Picture */}
                    <div className="flex-shrink-0">
                      <div className="w-32 h-32 rounded-full border-4 border-gray-300 shadow-lg overflow-hidden bg-white">
                        <img
                          src="/placeholder.svg?height=128&width=128&text=Profile"
                          alt="John Doe"
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </div>

                    {/* Personal Information */}
                    <div className="flex-1">
                      <div className="flex justify-between items-start">
                        <div className="space-y-1">
                          <h2 className="text-3xl font-bold text-gray-900">John Doe</h2>
                          <p className="text-xl text-gray-600">Senior Frontend Developer</p>
                        </div>

                        {/* Contact Details - Right aligned like cover letter */}
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
                            <span className="text-gray-700">San Francisco, CA</span>
                          </div>
                          <div className="flex items-center justify-end gap-2">
                            <div className="w-4 h-4 bg-blue-100 rounded flex items-center justify-center">
                              <Linkedin className="w-3 h-3 text-blue-600" />
                            </div>
                            <span className="text-gray-700">linkedin.com/in/johndoe</span>
                          </div>
                          <div className="flex items-center justify-end gap-2">
                            <div className="w-4 h-4 bg-blue-100 rounded flex items-center justify-center">
                              <Globe className="w-3 h-3 text-blue-600" />
                            </div>
                            <span className="text-gray-700">johndoe.dev</span>
                          </div>
                          <div className="flex items-center justify-end gap-2">
                            <div className="w-4 h-4 bg-blue-100 rounded flex items-center justify-center">
                              <Github className="w-3 h-3 text-blue-600" />
                            </div>
                            <span className="text-gray-700">github.com/johndoe</span>
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
                    <h4 className="text-lg font-semibold mb-4 text-gray-900 border-b border-gray-200 pb-2">
                      Work Experience
                    </h4>
                    <div className="space-y-8">
                      {/* TechCorp Inc. - Multiple Positions */}
                      <div className="space-y-4">
                        {/* Company Header */}
                        <div className="bg-gray-50 p-4 rounded-lg">
                          <div className="flex justify-between items-start mb-2">
                            <div>
                              <h5 className="font-semibold text-gray-900 text-lg">TechCorp Inc.</h5>
                              <p className="text-gray-600">San Francisco, CA</p>
                            </div>
                            <div className="text-right">
                              <p className="text-sm text-gray-600 font-medium">2020 - Present</p>
                              <p className="text-xs text-gray-500">3+ years</p>
                            </div>
                          </div>

                          {/* Multiple Positions within Company */}
                          <div className="space-y-4 mt-4">
                            {/* Senior Position */}
                            <div className="ml-4 border-l-2 border-blue-200 pl-4">
                              <div className="flex justify-between items-start mb-2">
                                <div>
                                  <h6 className="font-medium text-gray-900">Senior Frontend Developer</h6>
                                  <div className="flex gap-1 mt-1">
                                    <Badge variant="outline" className="text-xs">
                                      Full-time
                                    </Badge>
                                    <Badge variant="outline" className="text-xs">
                                      Remote
                                    </Badge>
                                  </div>
                                </div>
                                <p className="text-sm text-gray-600 font-medium">2022 - Present</p>
                              </div>
                              <ul className="text-gray-700 text-sm space-y-1">
                                <li>• Led development of customer-facing web applications serving 100K+ users</li>
                                <li>• Improved application performance by 40% through code optimization</li>
                                <li>• Mentored junior developers and established coding standards</li>
                              </ul>
                            </div>

                            {/* Junior Position */}
                            <div className="ml-4 border-l-2 border-gray-200 pl-4">
                              <div className="flex justify-between items-start mb-2">
                                <div>
                                  <h6 className="font-medium text-gray-900">Frontend Developer</h6>
                                  <div className="flex gap-1 mt-1">
                                    <Badge variant="outline" className="text-xs">
                                      Full-time
                                    </Badge>
                                    <Badge variant="outline" className="text-xs">
                                      Hybrid
                                    </Badge>
                                  </div>
                                </div>
                                <p className="text-sm text-gray-600 font-medium">2020 - 2022</p>
                              </div>
                              <ul className="text-gray-700 text-sm space-y-1">
                                <li>• Developed responsive web applications using React and TypeScript</li>
                                <li>• Collaborated with UX designers to implement pixel-perfect designs</li>
                                <li>• Reduced page load times by 60% through performance optimization</li>
                              </ul>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Career Break / Gap Year */}
                      <div className="space-y-4">
                        <div className="bg-amber-50 p-4 rounded-lg border border-amber-200">
                          <div className="flex justify-between items-start mb-2">
                            <div>
                              <h5 className="font-semibold text-gray-900 text-lg">
                                Professional Development & Education
                              </h5>
                              <p className="text-gray-600">Career Break</p>
                            </div>
                            <div className="text-right">
                              <p className="text-sm text-gray-600 font-medium">2019 - 2020</p>
                              <p className="text-xs text-gray-500">1 year</p>
                            </div>
                          </div>

                          {/* Gap Year Activities */}
                          <div className="space-y-4 mt-4">
                            {/* Freelance Coaching */}
                            <div className="ml-4 border-l-2 border-amber-300 pl-4">
                              <div className="flex justify-between items-start mb-2">
                                <div>
                                  <h6 className="font-medium text-gray-900">Freelance Web Development Coach</h6>
                                  <div className="flex gap-1 mt-1">
                                    <Badge variant="outline" className="text-xs">
                                      Part-time
                                    </Badge>
                                    <Badge variant="outline" className="text-xs">
                                      Remote
                                    </Badge>
                                  </div>
                                </div>
                                <p className="text-sm text-gray-600 font-medium">2019 - 2020</p>
                              </div>
                              <ul className="text-gray-700 text-sm space-y-1">
                                <li>• Mentored 15+ junior developers in React and JavaScript fundamentals</li>
                                <li>• Created curriculum for bootcamp-style web development courses</li>
                                <li>• Maintained 95% student satisfaction rate across all programs</li>
                              </ul>
                            </div>

                            {/* Advanced Courses */}
                            <div className="ml-4 border-l-2 border-amber-300 pl-4">
                              <div className="flex justify-between items-start mb-2">
                                <div>
                                  <h6 className="font-medium text-gray-900">Advanced Certification Programs</h6>
                                  <div className="flex gap-1 mt-1">
                                    <Badge variant="outline" className="text-xs">
                                      Self-paced
                                    </Badge>
                                    <Badge variant="outline" className="text-xs">
                                      Online
                                    </Badge>
                                  </div>
                                </div>
                                <p className="text-sm text-gray-600 font-medium">2019 - 2020</p>
                              </div>
                              <ul className="text-gray-700 text-sm space-y-1">
                                <li>• AWS Solutions Architect Professional Certification</li>
                                <li>• Google UX Design Professional Certificate</li>
                                <li>• Advanced React Patterns and Performance Optimization</li>
                              </ul>
                            </div>

                            {/* Personal Projects */}
                            <div className="ml-4 border-l-2 border-amber-300 pl-4">
                              <div className="flex justify-between items-start mb-2">
                                <div>
                                  <h6 className="font-medium text-gray-900">Open Source Contributions</h6>
                                  <div className="flex gap-1 mt-1">
                                    <Badge variant="outline" className="text-xs">
                                      Volunteer
                                    </Badge>
                                    <Badge variant="outline" className="text-xs">
                                      Remote
                                    </Badge>
                                  </div>
                                </div>
                                <p className="text-sm text-gray-600 font-medium">2019 - 2020</p>
                              </div>
                              <ul className="text-gray-700 text-sm space-y-1">
                                <li>• Contributed to 5+ major open source React libraries</li>
                                <li>• Built and maintained personal portfolio showcasing 10+ projects</li>
                                <li>• Participated in hackathons and developer community events</li>
                              </ul>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Previous Company */}
                      <div className="space-y-4">
                        <div className="bg-gray-50 p-4 rounded-lg">
                          <div className="flex justify-between items-start mb-2">
                            <div>
                              <h5 className="font-semibold text-gray-900 text-lg">DesignStudio Pro</h5>
                              <p className="text-gray-600">New York, NY</p>
                            </div>
                            <div className="text-right">
                              <p className="text-sm text-gray-600 font-medium">2017 - 2019</p>
                              <p className="text-xs text-gray-500">2 years</p>
                            </div>
                          </div>

                          {/* Single Position */}
                          <div className="ml-4 border-l-2 border-gray-200 pl-4">
                            <div className="flex justify-between items-start mb-2">
                              <div>
                                <h6 className="font-medium text-gray-900">Junior Frontend Developer</h6>
                                <div className="flex gap-1 mt-1">
                                  <Badge variant="outline" className="text-xs">
                                    Full-time
                                  </Badge>
                                  <Badge variant="outline" className="text-xs">
                                    On-site
                                  </Badge>
                                </div>
                              </div>
                              <p className="text-sm text-gray-600 font-medium">2017 - 2019</p>
                            </div>
                            <ul className="text-gray-700 text-sm space-y-1">
                              <li>• Built responsive websites for 20+ clients using HTML, CSS, and JavaScript</li>
                              <li>• Collaborated with design team to implement pixel-perfect mockups</li>
                              <li>• Learned React and modern development practices</li>
                            </ul>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Education */}
                  <div>
                    <h4 className="text-lg font-semibold mb-4 text-gray-900 border-b border-gray-200 pb-2">
                      Education
                    </h4>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <div className="flex justify-between items-start">
                        <div>
                          <h5 className="font-semibold text-gray-900">Bachelor of Science in Computer Science</h5>
                          <p className="text-gray-600">University of California, Berkeley</p>
                        </div>
                        <p className="text-sm text-gray-600 font-medium">2018</p>
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
                        <div className="flex flex-wrap gap-2">
                          <Badge className="flex items-center gap-1">
                            <Code2 className="w-3 h-3" />
                            JavaScript
                          </Badge>
                          <Badge className="flex items-center gap-1">
                            <Code2 className="w-3 h-3" />
                            TypeScript
                          </Badge>
                          <Badge className="flex items-center gap-1">
                            <Code2 className="w-3 h-3" />
                            React
                          </Badge>
                          <Badge className="flex items-center gap-1">
                            <Code2 className="w-3 h-3" />
                            Vue.js
                          </Badge>
                          <Badge className="flex items-center gap-1">
                            <Palette className="w-3 h-3" />
                            Tailwind CSS
                          </Badge>
                        </div>
                      </div>

                      {/* Backend Development */}
                      <div>
                        <h5 className="font-medium text-gray-800 mb-3">Backend Development</h5>
                        <div className="flex flex-wrap gap-2">
                          <Badge className="flex items-center gap-1">
                            <Terminal className="w-3 h-3" />
                            Node.js
                          </Badge>
                          <Badge className="flex items-center gap-1">
                            <Code2 className="w-3 h-3" />
                            Python
                          </Badge>
                          <Badge className="flex items-center gap-1">
                            <Database className="w-3 h-3" />
                            PostgreSQL
                          </Badge>
                          <Badge className="flex items-center gap-1">
                            <Database className="w-3 h-3" />
                            MongoDB
                          </Badge>
                        </div>
                      </div>

                      {/* Cloud & DevOps */}
                      <div>
                        <h5 className="font-medium text-gray-800 mb-3">Cloud & DevOps</h5>
                        <div className="flex flex-wrap gap-2">
                          <Badge className="flex items-center gap-1">
                            <Database className="w-3 h-3" />
                            AWS
                          </Badge>
                          <Badge className="flex items-center gap-1">
                            <Terminal className="w-3 h-3" />
                            Docker
                          </Badge>
                          <Badge className="flex items-center gap-1">
                            <GitBranch className="w-3 h-3" />
                            Git
                          </Badge>
                          <Badge className="flex items-center gap-1">
                            <Terminal className="w-3 h-3" />
                            CI/CD
                          </Badge>
                        </div>
                      </div>

                      {/* Design & Tools */}
                      <div>
                        <h5 className="font-medium text-gray-800 mb-3">Design & Tools</h5>
                        <div className="flex flex-wrap gap-2">
                          <Badge className="flex items-center gap-1">
                            <Figma className="w-3 h-3" />
                            Figma
                          </Badge>
                          <Badge className="flex items-center gap-1">
                            <Palette className="w-3 h-3" />
                            Adobe Creative Suite
                          </Badge>
                          <Badge className="flex items-center gap-1">
                            <Layers3 className="w-3 h-3" />
                            Storybook
                          </Badge>
                        </div>
                      </div>
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
