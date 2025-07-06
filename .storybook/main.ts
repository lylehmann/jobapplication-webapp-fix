import type { StorybookConfig } from "@storybook/nextjs"

const config: StorybookConfig = {
  stories: ["../stories/**/*.stories.@(js|jsx|mjs|ts|tsx)", "../components/**/*.stories.@(js|jsx|mjs|ts|tsx)"],
  addons: [
    "@storybook/addon-onboarding",
    "@storybook/addon-links",
    "@storybook/addon-essentials",
    "@storybook/addon-interactions",
    "@storybook/addon-docs",
    "@storybook/addon-controls",
    "@storybook/addon-viewport",
    "@storybook/addon-a11y",
    "@storybook/addon-themes",
  ],
  framework: {
    name: "@storybook/nextjs",
    options: {},
  },
  staticDirs: ["../public"],
  typescript: {
    check: false,
    reactDocgen: "react-docgen-typescript",
    reactDocgenTypescriptOptions: {
      shouldExtractLiteralValuesFromEnum: true,
      propFilter: (prop) => (prop.parent ? !/node_modules/.test(prop.parent.fileName) : true),
    },
  },
}

export default config
