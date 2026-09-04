---
name: "Note Markdown Apps"
slug: "note-markdown-apps"
url: "https://github.com/jefvanzanten/note-markdown.git"
languages: ["TypeScript", "HTML", "CSS"]
libraries: ["React", "Electron", "Nextjs", "CodeMirror"]
images: [""]
coverUrl: "/covers/note_markdown_apps.png"
thumbUrl: "/thumbs/note_markdown_apps_thumb.png"
category: "Desktop"
lastUpdated: "2026-06-06"
highlighted: true
---

Een `pnpm`-monorepo met drie apps: `desktop-app`, `web-tray-app` en `demo`. In plaats van een Tauri/Rust-core gebruikt deze versie Electron en gedeelde TypeScript-packages voor onder meer de editor, bestandsbrowser en serverlogica.

De UI is React-gebaseerd en de editorcode zit centraal in `@note/editor`, zodat de apps dezelfde markdown- en note-ervaring kunnen hergebruiken.
