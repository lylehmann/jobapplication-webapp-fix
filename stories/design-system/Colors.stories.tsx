import type { Meta, StoryObj } from "@storybook/react"

const ColorPalette = () => {
  const colorGroups = {
    Brand: {
      50: "#f0f9ff",
      100: "#e0f2fe",
      200: "#bae6fd",
      300: "#7dd3fc",
      400: "#38bdf8",
      500: "#0ea5e9",
      600: "#0284c7",
      700: "#0369a1",
      800: "#075985",
      900: "#0c4a6e",
      950: "#082f49",
    },
    Success: {
      50: "#f0fdf4",
      100: "#dcfce7",
      200: "#bbf7d0",
      300: "#86efac",
      400: "#4ade80",
      500: "#22c55e",
      600: "#16a34a",
      700: "#15803d",
      800: "#166534",
      900: "#14532d",
      950: "#052e16",
    },
    Warning: {
      50: "#fffbeb",
      100: "#fef3c7",
      200: "#fde68a",
      300: "#fcd34d",
      400: "#fbbf24",
      500: "#f59e0b",
      600: "#d97706",
      700: "#b45309",
      800: "#92400e",
      900: "#78350f",
      950: "#451a03",
    },
    Error: {
      50: "#fef2f2",
      100: "#fee2e2",
      200: "#fecaca",
      300: "#fca5a5",
      400: "#f87171",
      500: "#ef4444",
      600: "#dc2626",
      700: "#b91c1c",
      800: "#991b1b",
      900: "#7f1d1d",
      950: "#450a0a",
    },
    Neutral: {
      50: "#fafafa",
      100: "#f5f5f5",
      200: "#e5e5e5",
      300: "#d4d4d4",
      400: "#a3a3a3",
      500: "#737373",
      600: "#525252",
      700: "#404040",
      800: "#262626",
      900: "#171717",
      950: "#0a0a0a",
    },
  }

  const employmentColors = {
    "Full Time": { bg: "#eff6ff", text: "#1e40af", border: "#bfdbfe" },
    "Part Time": { bg: "#f0f9ff", text: "#0369a1", border: "#bae6fd" },
    Contract: { bg: "#fdf4ff", text: "#a21caf", border: "#e9d5ff" },
    Freelance: { bg: "#fff7ed", text: "#c2410c", border: "#fed7aa" },
    Internship: { bg: "#f0fdf4", text: "#166534", border: "#bbf7d0" },
    "Student Job": { bg: "#fff7ed", text: "#ea580c", border: "#ffedd5" },
  }

  const skillColors = {
    Beginner: "#ef4444",
    Novice: "#f97316",
    Intermediate: "#eab308",
    Advanced: "#22c55e",
    Expert: "#3b82f6",
  }

  return (
    <div className="p-6 space-y-8">
      <div>
        <h2 className="text-2xl font-bold mb-4">Color System</h2>
        <p className="text-neutral-600 mb-6">
          Our comprehensive color system provides semantic meaning and ensures accessibility across all components.
        </p>
      </div>

      {/* Main Color Palettes */}
      {Object.entries(colorGroups).map(([groupName, colors]) => (
        <div key={groupName}>
          <h3 className="text-lg font-semibold mb-3">{groupName}</h3>
          <div className="grid grid-cols-11 gap-2 mb-6">
            {Object.entries(colors).map(([shade, color]) => (
              <div key={shade} className="text-center">
                <div className="w-16 h-16 rounded-lg border shadow-sm mb-2" style={{ backgroundColor: color }} />
                <div className="text-xs font-mono text-neutral-600">{shade}</div>
                <div className="text-xs font-mono text-neutral-500">{color}</div>
              </div>
            ))}
          </div>
        </div>
      ))}

      {/* Employment Type Colors */}
      <div>
        <h3 className="text-lg font-semibold mb-3">Employment Types</h3>
        <div className="grid grid-cols-3 gap-4 mb-6">
          {Object.entries(employmentColors).map(([type, colors]) => (
            <div key={type} className="text-center">
              <div
                className="w-full h-16 rounded-lg border flex items-center justify-center mb-2"
                style={{
                  backgroundColor: colors.bg,
                  color: colors.text,
                  borderColor: colors.border,
                }}
              >
                <span className="font-medium">{type}</span>
              </div>
              <div className="text-xs space-y-1">
                <div className="font-mono">bg: {colors.bg}</div>
                <div className="font-mono">text: {colors.text}</div>
                <div className="font-mono">border: {colors.border}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Skill Level Colors */}
      <div>
        <h3 className="text-lg font-semibold mb-3">Skill Levels</h3>
        <div className="grid grid-cols-5 gap-4">
          {Object.entries(skillColors).map(([level, color]) => (
            <div key={level} className="text-center">
              <div
                className="w-full h-16 rounded-lg border flex items-center justify-center mb-2 text-white font-medium"
                style={{ backgroundColor: color }}
              >
                {level}
              </div>
              <div className="text-xs font-mono text-neutral-600">{color}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

const meta: Meta<typeof ColorPalette> = {
  title: "Design System/Colors",
  component: ColorPalette,
  parameters: {
    docs: {
      description: {
        component: "Complete color system with semantic meanings and accessibility compliance.",
      },
    },
  },
}

export default meta
type Story = StoryObj<typeof ColorPalette>

export const Default: Story = {}
