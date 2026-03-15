# TxtDrop

Convert pasted text into `.txt`, `.md`, `.json`, `.csv`, `.html`, `.xml`, `.yaml`, or `.log` files and export it instantly on mobile or desktop.

## Setup (one time)

### 1. Install Node.js
Download from https://nodejs.org (LTS version)

### 2. Create the project
```bash
mkdir txtdrop
cd txtdrop
```
Copy all the project files into this folder maintaining the structure:
```
txtdrop/
├── index.html
├── package.json
├── vite.config.ts
├── tsconfig.json
└── src/
    ├── main.tsx
    ├── App.tsx
    └── index.css
```

### 3. Install dependencies
```bash
npm install
```

### 4. Run locally to test
```bash
npm run dev
```
Open http://localhost:5173 in your browser.

### 5. Deploy to Vercel

1. Push the project to a GitHub repo
2. Go to https://vercel.com and sign in with GitHub
3. Click "Add New Project" → import your repo
4. Vercel auto-detects Vite → click Deploy
5. Done. You get a URL like `https://txtdrop.vercel.app`

### 6. Add to iPhone Home Screen

1. Open your Vercel URL in **Safari** on your iPhone
2. Tap the Share button (box with arrow)
3. Scroll down → "Add to Home Screen"
4. Tap Add

It now lives on your home screen like a native app.

## How it works

- Paste any text
- Name your file and choose an export format
- Tap **Share as ...** on supported mobile browsers
- If file sharing is not supported, TxtDrop falls back to **Download ...**
- The **Download** button is always visible, so desktop browsers still have a clear file export path

TxtDrop creates exports as binary file attachments to improve file handling across iOS Safari, Android Chrome, and other browsers/devices.

Your text never leaves your device. The app is just static files hosted on Vercel.
