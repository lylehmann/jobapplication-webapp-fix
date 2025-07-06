import type { Meta, StoryObj } from "@storybook/react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

const meta: Meta<typeof Card> = {
  title: "Components/Card",
  component: Card,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component: "A flexible card component for displaying content in a structured format.",
      },
    },
  },
}

export default meta
type Story = StoryObj<typeof Card>

export const Default: Story = {
  render: () => (
    <Card className="w-[350px]">
      <CardHeader>
        <CardTitle>Card Title</CardTitle>
        <CardDescription>Card description goes here</CardDescription>
      </CardHeader>
      <CardContent>
        <p>This is the main content of the card.</p>
      </CardContent>
      <CardFooter>
        <Button>Action</Button>
      </CardFooter>
    </Card>
  ),
}

export const JobApplication: Story = {
  render: () => (
    <Card className="w-[400px]">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle>Senior Frontend Developer</CardTitle>
            <CardDescription>TechCorp Inc. • San Francisco, CA</CardDescription>
          </div>
          <Badge className="bg-employment-full-time-bg text-employment-full-time-text border-employment-full-time-border">
            Full-time
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <p className="text-sm text-neutral-600">
            Lead frontend development for our core product platform using React and TypeScript.
          </p>
          <div className="flex gap-2">
            <Badge variant="secondary">React</Badge>
            <Badge variant="secondary">TypeScript</Badge>
            <Badge variant="secondary">Next.js</Badge>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <span className="text-sm text-neutral-500">Applied 2 days ago</span>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            Edit
          </Button>
          <Button size="sm">View Details</Button>
        </div>
      </CardFooter>
    </Card>
  ),
}

export const Resume: Story = {
  render: () => (
    <Card className="w-[500px]">
      <CardHeader>
        <CardTitle>Professional Experience</CardTitle>
        <CardDescription>Your work history and achievements</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="border-l-2 border-brand-200 pl-4">
            <div className="flex justify-between items-start mb-1">
              <div>
                <h4 className="font-semibold">Senior Developer</h4>
                <p className="text-sm text-neutral-600">TechCorp Inc.</p>
              </div>
              <span className="text-sm text-neutral-500">2022 - Present</span>
            </div>
            <p className="text-sm text-neutral-600">
              Led development of core platform features, mentored junior developers.
            </p>
          </div>
          <div className="border-l-2 border-brand-200 pl-4">
            <div className="flex justify-between items-start mb-1">
              <div>
                <h4 className="font-semibold">Frontend Developer</h4>
                <p className="text-sm text-neutral-600">StartupXYZ</p>
              </div>
              <span className="text-sm text-neutral-500">2020 - 2022</span>
            </div>
            <p className="text-sm text-neutral-600">
              Built responsive web applications using modern JavaScript frameworks.
            </p>
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button variant="outline" className="w-full bg-transparent">
          Add Experience
        </Button>
      </CardFooter>
    </Card>
  ),
}
