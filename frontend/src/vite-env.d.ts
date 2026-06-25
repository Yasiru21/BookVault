/// <reference types="vite/client" />

// ─────────────────────────────────────────────────────────────────────────────
// CSS Module type declarations
// Tells TypeScript that *.module.css imports return an object of string keys.
// Without this, TypeScript can't resolve the imported class name strings.
// ─────────────────────────────────────────────────────────────────────────────
declare module '*.module.css' {
  const classes: Record<string, string>;
  export default classes;
}
