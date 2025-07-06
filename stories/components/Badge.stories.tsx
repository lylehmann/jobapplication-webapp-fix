import type { Meta, StoryObj } from "@storybook/react"
import { Badge } from "@/components/ui/badge"

const meta: Meta<typeof Badge> = {
  title: "Components/Badge",
  component: Badge,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component: "A small status indicator or label component.",
      },
    },
  },
  argTypes: {
    variant: {
      control: "select",
      options: ["default", "secondary", "destructive", "outline"],
    },
  },
}

export default meta
type Story = StoryObj<typeof Badge>

export const Default: Story = {
  args: {
    children: "Badge",
  },
}

export const Variants: Story = {
  render: () => (
    <div className="flex gap-2">
      <Badge variant="default">Default</Badge>
      <Badge variant="secondary">Secondary</Badge>
      <Badge variant="destructive">Destructive</Badge>
      <Badge variant="outline">Outline</Badge>
    </div>
  ),
}

export const EmploymentTypes: Story = {
  render: () => (
    <div className="flex flex-wrap gap-2">
      <Badge className="bg-employment-full-time-bg text-employment-full-time-text border-employment-full-time-border">
        Full-time
      </Badge>
      <Badge className="bg-employment-part-time-bg text-employment-part-time-text border-employment-part-time-border">
        Part-time
      </Badge>
      <Badge className="bg-employment-contract-bg text-employment-contract-text border-employment-contract-border">
        Contract
      </Badge>
      <Badge className="bg-employment-freelance-bg text-employment-freelance-text border-employment-freelance-border">
        Freelance
      </Badge>
      <Badge className="bg-employment-internship-bg text-employment-internship-text border-employment-internship-border">
        Internship
      </Badge>
      <Badge className="bg-employment-student-job-bg text-employment-student-job-text border-employment-student-job-border">
        Student Job
      </Badge>
    </div>
  ),
}

export const SkillLevels: Story = {
  render: () => (
    <div className="flex gap-2">
      <Badge style={{ backgroundColor: "#ef4444", color: "white" }}>Beginner</Badge>
      <Badge style={{ backgroundColor: "#f97316", color: "white" }}>Novice</Badge>
      <Badge style={{ backgroundColor: "#eab308", color: "white" }}>Intermediate</Badge>
      <Badge style={{ backgroundColor: "#22c55e", color: "white" }}>Advanced</Badge>
      <Badge style={{ backgroundColor: "#3b82f6", color: "white" }}>Expert</Badge>
    </div>
  ),
}

export const StatusBadges: Story = {
  render: () => (
    <div className="flex gap-2">
      <Badge className="bg-status-draft-bg text-status-draft-text border-status-draft-border">Draft</Badge>
      <Badge className="bg-status-in-progress-bg text-status-in-progress-text border-status-in-progress-border">
        In Progress
      </Badge>
      <Badge className="bg-status-submitted-bg text-status-submitted-text border-status-submitted-border">
        Submitted
      </Badge>
      <Badge className="bg-status-archived-bg text-status-archived-text border-status-archived-border">Archived</Badge>
    </div>
  ),
}
