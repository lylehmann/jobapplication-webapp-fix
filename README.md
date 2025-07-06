# Job Application Manager

A comprehensive web application for managing job applications, resumes, and cover letters with an integrated design system and component library.

## Features

- **Application Management**: Track job applications with status updates
- **Resume Builder**: Professional resume templates with real-time preview
- **Cover Letter Generator**: Business letter formatting with templates
- **Design System**: Comprehensive UI component library with Storybook
- **Responsive Design**: Mobile-first approach with accessibility compliance

## Tech Stack

- **Framework**: Next.js 15 with App Router
- **Styling**: Tailwind CSS with custom design tokens
- **Components**: Radix UI primitives with shadcn/ui
- **Documentation**: Storybook with interactive component explorer
- **TypeScript**: Full type safety throughout the application

## Getting Started

### Prerequisites

- Node.js 18 or higher
- npm or yarn package manager

### Installation

1. **Clone the repository**
   \`\`\`bash
   git clone <repository-url>
   cd job-application-manager
   \`\`\`

2. **Install dependencies**
   \`\`\`bash
   npm install
   \`\`\`

3. **Start the development server**
   \`\`\`bash
   npm run dev
   \`\`\`

4. **Start Storybook (optional)**
   \`\`\`bash
   npm run storybook
   \`\`\`

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run storybook` - Start Storybook development server
- `npm run build-storybook` - Build Storybook for production

## Design System

The application includes a comprehensive design system with:

### Color System
- **Semantic Colors**: Brand, success, warning, error, info
- **Employment Types**: Job category specific colors
- **Skill Levels**: Progressive skill indication
- **Status Colors**: Application status visualization

### Typography
- **Hierarchy**: Consistent heading and body text scales
- **Weights**: Light to bold font weight variations
- **Colors**: Primary, secondary, and muted text colors

### Components
- **Interactive**: Buttons, inputs, forms, and navigation
- **Layout**: Cards, grids, and responsive containers
- **Feedback**: Alerts, toasts, and loading states
- **Data Display**: Tables, lists, and badges

## Storybook Integration

Access the interactive component library at `http://localhost:6006` when running Storybook.

### Features
- **Live Component Explorer**: Interactive examples with controls
- **Design Token Documentation**: Complete color and typography reference
- **Accessibility Testing**: Built-in a11y validation
- **Responsive Testing**: Multi-device viewport simulation
- **Theme Switching**: Light and dark mode support

### Adding New Components

1. Create component in `components/ui/`
2. Add story file in `stories/components/`
3. Document variants and use cases
4. Test accessibility compliance

## Project Structure

\`\`\`
├── .storybook/              # Storybook configuration
├── app/                     # Next.js app directory
├── components/              # React components
│   ├── ui/                 # UI component library
│   ├── application-editor.tsx
│   ├── application-preview.tsx
│   └── ...
├── stories/                 # Storybook stories
│   ├── design-system/      # Design system documentation
│   ├── components/         # Component stories
│   └── setup/             # Setup documentation
├── public/                  # Static assets
├── tailwind.config.ts      # Tailwind with design tokens
└── package.json
\`\`\`

## Design System Maintenance

### Color Updates
1. Modify `tailwind.config.ts`
2. Update color stories in `stories/design-system/`
3. Test component integration
4. Update documentation

### Component Updates
1. Modify component in `components/ui/`
2. Update corresponding story
3. Test all variants and states
4. Verify accessibility compliance

### Real-time Updates
Both the main application and Storybook support hot reloading for immediate feedback during development.

## Deployment

### Application
\`\`\`bash
npm run build
npm run start
\`\`\`

### Storybook
\`\`\`bash
npm run build-storybook
# Deploy contents of storybook-static/
\`\`\`

## Contributing

1. Follow the established component patterns
2. Maintain design system consistency
3. Document all new components in Storybook
4. Ensure accessibility compliance
5. Test responsive behavior

## License

This project is licensed under the MIT License.
