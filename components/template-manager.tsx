"use client"

import { useState } from "react"
import { ArrowLeft, Plus, Copy, Edit, Trash2, Star } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

interface Template {
  id: string
  name: string
  description: string
  category: "frontend" | "backend" | "fullstack" | "design" | "management" | "general"
  isDefault: boolean
  usageCount: number
  lastUsed: string
}

interface TemplateManagerProps {
  onBack: () => void
  onSelectTemplate: (template: Template) => void
}

export function TemplateManager({ onBack, onSelectTemplate }: TemplateManagerProps) {
  const [templates, setTemplates] = useState<Template[]>([
    {
      id: "1",
      name: "Frontend Developer",
      description: "Template optimized for frontend development positions with React, JavaScript, and UI/UX focus",
      category: "frontend",
      isDefault: true,
      usageCount: 12,
      lastUsed: "2024-01-15",
    },
    {
      id: "2",
      name: "Full Stack Engineer",
      description: "Comprehensive template for full-stack positions covering both frontend and backend technologies",
      category: "fullstack",
      isDefault: false,
      usageCount: 8,
      lastUsed: "2024-01-10",
    },
    {
      id: "3",
      name: "Senior Backend Developer",
      description: "Template focused on backend development, APIs, databases, and system architecture",
      category: "backend",
      isDefault: false,
      usageCount: 5,
      lastUsed: "2024-01-08",
    },
  ])

  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<string>("all")
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)

  const categories = [
    { value: "all", label: "All Templates" },
    { value: "frontend", label: "Frontend" },
    { value: "backend", label: "Backend" },
    { value: "fullstack", label: "Full Stack" },
    { value: "design", label: "Design" },
    { value: "management", label: "Management" },
    { value: "general", label: "General" },
  ]

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "frontend":
        return "bg-blue-100 text-blue-800"
      case "backend":
        return "bg-green-100 text-green-800"
      case "fullstack":
        return "bg-purple-100 text-purple-800"
      case "design":
        return "bg-pink-100 text-pink-800"
      case "management":
        return "bg-orange-100 text-orange-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const filteredTemplates = templates.filter((template) => {
    const matchesSearch =
      template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      template.description.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = selectedCategory === "all" || template.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Button variant="ghost" onClick={onBack}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Dashboard
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Template Manager</h1>
              <p className="text-gray-600 mt-1">Create and manage reusable application templates</p>
            </div>
          </div>
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Create Template
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>Create New Template</DialogTitle>
                <DialogDescription>Create a reusable template for similar job applications</DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="template-name">Template Name</Label>
                  <Input id="template-name" placeholder="e.g., Senior React Developer" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="template-description">Description</Label>
                  <Textarea
                    id="template-description"
                    placeholder="Brief description of this template..."
                    className="min-h-[80px]"
                  />
                </div>
                <div className="flex justify-end gap-2">
                  <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={() => setIsCreateDialogOpen(false)}>Create Template</Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Search and Filters */}
        <div className="flex items-center gap-4 mb-6">
          <Input
            placeholder="Search templates..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="max-w-md"
          />
          <div className="flex items-center gap-2">
            {categories.map((category) => (
              <Button
                key={category.value}
                variant={selectedCategory === category.value ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory(category.value)}
              >
                {category.label}
              </Button>
            ))}
          </div>
        </div>

        {/* Templates Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTemplates.map((template) => (
            <Card key={template.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <CardTitle className="text-lg">{template.name}</CardTitle>
                      {template.isDefault && <Star className="w-4 h-4 text-yellow-500 fill-current" />}
                    </div>
                    <CardDescription className="text-sm">{template.description}</CardDescription>
                  </div>
                </div>
                <div className="flex items-center gap-2 mt-3">
                  <Badge className={getCategoryColor(template.category)}>{template.category}</Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                  <span>Used {template.usageCount} times</span>
                  <span>Last used: {template.lastUsed}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Button size="sm" onClick={() => onSelectTemplate(template)}>
                    Use Template
                  </Button>
                  <Button size="sm" variant="outline">
                    <Copy className="w-4 h-4 mr-2" />
                    Duplicate
                  </Button>
                  <Button size="sm" variant="outline">
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button size="sm" variant="outline">
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredTemplates.length === 0 && (
          <div className="text-center py-12">
            <div className="w-12 h-12 bg-gray-200 rounded-lg flex items-center justify-center mx-auto mb-4">📄</div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No templates found</h3>
            <p className="text-gray-600 mb-4">
              {searchQuery || selectedCategory !== "all"
                ? "Try adjusting your search or filters"
                : "Create your first template to get started"}
            </p>
            <Button onClick={() => setIsCreateDialogOpen(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Create Template
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
