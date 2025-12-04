# 📝 Tiptap & ProseMirror: The Foundation

## 1. What is Tiptap?

**Tiptap** is a **headless** rich-text editor built on top of **ProseMirror**. It provides ready-made extensions and a friendly API so you don’t have to fight low-level ProseMirror complexities directly.

- **Headless:** It manages logic & state, but **you** design the UI (buttons, toolbar, styling).
- **Engine:** It uses ProseMirror internally as its core engine.

---

## 2. What is ProseMirror?

**ProseMirror** is a low-level JavaScript toolkit for building rich-text editors.

- It provides a powerful **document model** and **plugin system**.
- **The Catch:** It has **no UI** and is very complex to set up from scratch.

### 💡 Why do we need Tiptap?

ProseMirror alone is too low-level for most application developers. Tiptap acts as a wrapper that creates a better developer experience.

**Tiptap provides:**

- **Extensions:** Ready-to-use blocks for bold, italic, lists, code blocks, links, etc.
- **Framework Bindings:** specific packages like `@tiptap/react`.
- **Clean API:**
  - _Instead of:_ Manual ProseMirror transactions.
  - _You write:_ `editor.chain().focus().toggleBold().run()`

> **Summary:** “Tiptap = ProseMirror made friendly for real-world projects.”

---

# ⚛️ Tiptap React Hooks## 1. useEditor Hook

`useEditor` is a React hook that creates and manages a Tiptap editor instance for your component.

### How it works:

Think of it as: `useEditor = new Editor(...)`, but optimized for the React lifecycle.

### Why do we need it?

We need the editor to handle the component lifecycle automatically:

1.  **Mounting:** It creates the editor instance once when the component loads.
2.  **Configuration:** It allows you to set up:
    - `extensions` (functionality)
    - `content` (initial text)
    - `onUpdate` (event handlers)
3.  **Unmounting:** It properly **destroys** the editor instance to prevent memory leaks when the user leaves the page.

---

## 2. useEditorState Hook

`useEditorState` is a React hook that listens to **specific parts** of the editor state (like ‘is bold active?’) and re-renders your UI **only** when those parts change.

### How it works:

- It subscribes to Tiptap’s internal updates.
- It runs a **selector** (a check you define).
- If the result changes → it calls `setState` → The Toolbar re-renders with the new state.

### Why is this important?

Performance! It ensures your entire app doesn't re-render on every single keystroke, only the parts of the UI (like a bold button highlighting) that need to update.
