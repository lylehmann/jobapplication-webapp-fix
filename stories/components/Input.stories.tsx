import type { Meta, StoryObj } from "@storybook/react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Search, Mail, Lock } from "lucide-react"

const meta: Meta<typeof Input> = {
  title: "Components/Input",
  component: Input,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component: "A flexible input component for forms and user input.",
      },
    },
  },
  argTypes: {
    type: {
      control: "select",
      options: ["text", "email", "password", "number", "search", "tel", "url"],
    },
    disabled: {
      control: "boolean",
    },
  },
}

export default meta
type Story = StoryObj<typeof Input>

export const Default: Story = {
  args: {
    placeholder: "Enter text...",
  },
}

export const WithLabel: Story = {
  render: () => (
    <div className="grid w-full max-w-sm items-center gap-1.5">
      <Label htmlFor="email">Email</Label>
      <Input type="email" id="email" placeholder="Email" />
    </div>
  ),
}

export const Types: Story = {
  render: () => (
    <div className="space-y-4 w-80">
      <div>
        <Label htmlFor="text">Text Input</Label>
        <Input id="text" type="text" placeholder="Enter text..." />
      </div>
      <div>
        <Label htmlFor="email">Email Input</Label>
        <Input id="email" type="email" placeholder="Enter email..." />
      </div>
      <div>
        <Label htmlFor="password">Password Input</Label>
        <Input id="password" type="password" placeholder="Enter password..." />
      </div>
      <div>
        <Label htmlFor="search">Search Input</Label>
        <Input id="search" type="search" placeholder="Search..." />
      </div>
      <div>
        <Label htmlFor="number">Number Input</Label>
        <Input id="number" type="number" placeholder="Enter number..." />
      </div>
    </div>
  ),
}

export const WithIcons: Story = {
  render: () => (
    <div className="space-y-4 w-80">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400 h-4 w-4" />
        <Input className="pl-10" placeholder="Search applications..." />
      </div>
      <div className="relative">
        <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400 h-4 w-4" />
        <Input className="pl-10" type="email" placeholder="your@email.com" />
      </div>
      <div className="relative">
        <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400 h-4 w-4" />
        <Input className="pl-10" type="password" placeholder="Password" />
      </div>
    </div>
  ),
}

export const States: Story = {
  render: () => (
    <div className="space-y-4 w-80">
      <div>
        <Label>Normal State</Label>
        <Input placeholder="Normal input" />
      </div>
      <div>
        <Label>Disabled State</Label>
        <Input placeholder="Disabled input" disabled />
      </div>
      <div>
        <Label>Error State</Label>
        <Input placeholder="Error input" className="border-error-500 focus:ring-error-500" />
      </div>
      <div>
        <Label>Success State</Label>
        <Input placeholder="Success input" className="border-success-500 focus:ring-success-500" />
      </div>
    </div>
  ),
}
