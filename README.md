# TxtDrop

Convert any large text to a `.txt` file and share/save it instantly from your iPhone.

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

- Paste any text (no length limit)
- Name your file
- Tap **Share as .txt** → iOS share sheet opens with the file
  - Save to Files app
  - AirDrop it
  - Send to any AI app as attachment
- Or tap **Download .txt** as fallback

Your text never leaves your device. The app is just static files hosted on Vercel.
