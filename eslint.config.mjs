// Import necessary modules for path and ESLint configuration
import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

// Get the current file name and directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Initialize FlatCompat for compatibility with ESLint configurations
const compat = new FlatCompat({
  baseDirectory: __dirname, // Set the base directory for ESLint
});

// Define the ESLint configuration by extending Next.js and TypeScript rules
const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript"),
];

// Export the ESLint configuration
export default eslintConfig;