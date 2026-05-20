# 🌌 DSA Learn — Interactive Data Structures & Algorithms Visualizer

DSA Learn is a high-fidelity, interactive, and educational single-page web application designed to visually illustrate complex Data Structures and Algorithms (DSA) concepts. 

Built with **React**, **TypeScript**, and **Vite**, the platform provides a premium "Deep Space" dark-themed pedagogical environment with step-by-step visualizations synced with real-time code executions.

<img width="1917" height="934" alt="{94A4CF81-2B55-429E-BD74-B0F71F20AAF2}" src="https://github.com/user-attachments/assets/e27d5bb6-6324-4622-bd60-dfa73b1288ab" />

---

## 🛠️ Modules Included

### 1. ▤ Queue Visualizer (FIFO)
* **First-In, First-Out (FIFO) Simulation:** Custom animations displaying queue actions step-by-step.
* **Dynamic Pointer Tracking:** Front and Rear pointers update and point dynamically.
* **Canvas Control Bar:** Clickable timeline, speed controls ($0.5\times$ to $2\times$), auto-play, and pause functionality.
* **Code Integration:** Implementation panel in JavaScript highlights active lines matching current steps.
* **Status Metrics:** Live indicators for front/rear index, queue size, isEmpty, and the current operation.

  <img width="1917" height="934" alt="{94A4CF81-2B55-429E-BD74-B0F71F20AAF2}" src="https://github.com/user-attachments/assets/0a447fce-a2c7-4567-8759-019c0dabe281" />


### 2. ⬡ Singly Linked List Visualizer
* **Dynamic Node Pointer Cells:** Unique 2-cell node visual splitting Node value and `next` pointer value.
* **SVG Vector Connections:** Custom curved SVG connectors with arrow heads pointing from source pointer to destination node.
* **Head & Tail Tracking:** Visual representations of `HEAD`, `TAIL`, and `null` terminal references.
* **Interactive Operations:** Step-through guides for `insertHead`, `insertTail`, `insertAt`, `deleteHead`, `deleteTail`, and a sequential `search` scanning animation.
* **Complexity Metrics:** Quick reference tables detailing time and space complexity for all primary operations.
<img width="1920" height="1080" alt="image" src="https://github.com/user-attachments/assets/4757bfc8-7610-4b2d-8aad-5e1a770ecad0" />

---

## 🎨 Theme & Styling System
* **Premium Design:** Glassmorphic layout card styling with sleek neon glowing borders.
* **Aesthetic Palette:** Deep space black/dark slate background combined with custom neon cyan, purple, and yellow accents.
* **Keyframe Animations:** Custom CSS transitions for spring node entrances, pop-out node exits, and pulsing scan indicators.
* **Modern Typography:** Optimized system font pairings (Space Grotesk + JetBrains Mono) for readability.

---

## 💻 Tech Stack
* **Core:** React 18, TypeScript, Vite, HTML5, Vanilla CSS3 (custom CSS Variables)
* **Routing:** React Router DOM (v7) for seamless single-page-app deep link navigations
* **Build tool:** Vite + SWC

---

## 🚀 Quickstart

### 1. Installation
Clone the repository and install dependencies:
```bash
git clone https://github.com/ankit18193/Queue.git
cd Queue
npm install
```

### 2. Running Dev Server
Start the local development server (with Hot Module Replacement):
```bash
npm run dev
```
Open `http://localhost:5173` in your browser.

### 3. Build & Preview Production
Compile code and preview the production build locally:
```bash
npm run build
npm run preview
```
This runs the optimized build on `http://localhost:4173/`.

---

## 🌐 Deploy to Vercel or Netlify

The project includes pre-configured routing rules for Single Page Application (SPA) fallbacks so that direct routes (e.g. `/linked-list` or `/queue`) load correctly:
* **Vercel:** Configuration included in `vercel.json`
* **Netlify:** Configuration included in `public/_redirects`

### Easy Vercel Deployment
1. Connect your GitHub repository to [Vercel](https://vercel.com).
2. Click **Deploy**. Vercel will automatically detect Vite build configurations and build it instantly.
