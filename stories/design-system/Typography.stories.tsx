import type { Meta, StoryObj } from "@storybook/react"

const Typography = () => {
  const headings = [
    { tag: "h1", class: "text-4xl font-bold", text: "Heading 1 - Main Page Title" },
    { tag: "h2", class: "text-3xl font-bold", text: "Heading 2 - Section Title" },
    { tag: "h3", class: "text-2xl font-semibold", text: "Heading 3 - Subsection Title" },
    { tag: "h4", class: "text-xl font-semibold", text: "Heading 4 - Component Title" },
    { tag: "h5", class: "text-lg font-medium", text: "Heading 5 - Small Title" },
    { tag: "h6", class: "text-base font-medium", text: "Heading 6 - Smallest Title" },
  ]

  const bodyText = [
    { name: "Large Body", class: "text-lg", text: "Large body text for important content and introductions." },
    { name: "Body", class: "text-base", text: "Regular body text for most content and descriptions." },
    { name: "Small Body", class: "text-sm", text: "Small body text for secondary information and captions." },
    { name: "Caption", class: "text-xs", text: "Caption text for labels, metadata, and fine print." },
  ]

  const weights = [
    { name: "Light", class: "font-light", weight: "300" },
    { name: "Regular", class: "font-normal", weight: "400" },
    { name: "Medium", class: "font-medium", weight: "500" },
    { name: "Semibold", class: "font-semibold", weight: "600" },
    { name: "Bold", class: "font-bold", weight: "700" },
  ]

  return (
    <div className="p-6 space-y-12">
      <div>
        <h2 className="text-2xl font-bold mb-4">Typography System</h2>
        <p className="text-neutral-600 mb-6">
          Our typography system ensures consistent hierarchy and readability across the application.
        </p>
      </div>

      {/* Headings */}
      <div>
        <h3 className="text-lg font-semibold mb-6">Headings</h3>
        <div className="space-y-4">
          {headings.map(({ tag, class: className, text }) => (
            <div key={tag} className="flex items-baseline gap-4">
              <div className="w-16 text-sm font-mono text-neutral-500">{tag}</div>
              <div className={className}>{text}</div>
              <div className="text-sm font-mono text-neutral-400 ml-auto">{className}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Body Text */}
      <div>
        <h3 className="text-lg font-semibold mb-6">Body Text</h3>
        <div className="space-y-4">
          {bodyText.map(({ name, class: className, text }) => (
            <div key={name} className="space-y-2">
              <div className="flex items-center gap-4">
                <div className="w-24 text-sm font-mono text-neutral-500">{name}</div>
                <div className="text-sm font-mono text-neutral-400">{className}</div>
              </div>
              <div className={className}>{text}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Font Weights */}
      <div>
        <h3 className="text-lg font-semibold mb-6">Font Weights</h3>
        <div className="space-y-4">
          {weights.map(({ name, class: className, weight }) => (
            <div key={name} className="flex items-center gap-4">
              <div className="w-24 text-sm font-mono text-neutral-500">{name}</div>
              <div className={`text-lg ${className}`}>The quick brown fox jumps over the lazy dog</div>
              <div className="text-sm font-mono text-neutral-400 ml-auto">{weight}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Text Colors */}
      <div>
        <h3 className="text-lg font-semibold mb-6">Text Colors</h3>
        <div className="space-y-4">
          <div className="flex items-center gap-4">
            <div className="w-24 text-sm font-mono text-neutral-500">Primary</div>
            <div className="text-neutral-900">Primary text color for main content</div>
            <div className="text-sm font-mono text-neutral-400 ml-auto">text-neutral-900</div>
          </div>
          <div className="flex items-center gap-4">
            <div className="w-24 text-sm font-mono text-neutral-500">Secondary</div>
            <div className="text-neutral-600">Secondary text color for supporting content</div>
            <div className="text-sm font-mono text-neutral-400 ml-auto">text-neutral-600</div>
          </div>
          <div className="flex items-center gap-4">
            <div className="w-24 text-sm font-mono text-neutral-500">Muted</div>
            <div className="text-neutral-400">Muted text color for less important content</div>
            <div className="text-sm font-mono text-neutral-400 ml-auto">text-neutral-400</div>
          </div>
        </div>
      </div>
    </div>
  )
}

const meta: Meta<typeof Typography> = {
  title: "Design System/Typography",
  component: Typography,
  parameters: {
    docs: {
      description: {
        component: "Typography system with consistent hierarchy and semantic meaning.",
      },
    },
  },
}

export default meta
type Story = StoryObj<typeof Typography>

export const Default: Story = {}
