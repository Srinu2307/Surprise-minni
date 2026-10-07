# ❄️ Princess Minni's Enchanted Frozen Birthday Surprise ❄️

An ultra-realistic, photorealistic Frozen-themed birthday web application created for **Minni**, featuring interactive ice physics, Northern Lights (Aurora Borealis), 3D snowfall, floating crystal photo memories, interactive 3D birthday cake with blowable candles, Elsa's winter magic wand, a royal sealed letter, a guestbook wishes wall, and the heartfelt melody **“Anuvanuvuu”** (Karaoke by Arijit Singh & Sunny M.R.).

---

## 🏰 Tech Stack

- **Backend**: **Node.js** + **Express.js** (Latest Express 4.x / Node v24)
- **Frontend**: **React** (Latest React 19, JavaScript / JSX — **No TypeScript**)
- **Bundler & Dev Server**: **Vite**
- **Styling**: **Vanilla CSS Design System** (Glassmorphism, Ice refractions, Crystalline typography, Responsive layouts)
- **Audio & Sound**: **Web Audio API Sound Engine** (Synthesized ice cracking, crystal chimes, winter gusts, celebration fanfare) + HTML5 Audio Streaming with HTTP Range headers for *“Anuvanuvuu”*.
- **Celebration Effects**: **Canvas Confetti** + 3D Multi-Layered Particle Physics.

---

## ✨ Features & Experiences

1. **❄️ Interactive Frost Gateway (The Surprise Reveal)**
   - Screen starts covered in an authentic frozen window with ice dendrites and condensation.
   - Visitors can **rub or drag** to melt frost in real-time, or click **“Shatter The Frost & Enter”** to trigger a dramatic Elsa-style crystal fracture explosion that unlocks the kingdom and starts the music.

2. **🌌 Realistic Aurora Borealis & 3D Snowfall**
   - Live canvas simulation of the Northern Lights with flowing emerald, cyan, and violet light curtains across a twinkling starry sky.
   - 3-tier depth snow simulation (bokeh foreground, crystalline hexagons, twinkling diamond dust) reacting realistically to wind and mouse movement.

3. **📸 Crystals of Memory (Minni's 8 Curated Photos)**
   - 8 authentic photos of Minni displayed as floating 3D crystalline ice polaroids with 3D hover tilt, refractive shimmers, and customized poetic titles.
   - Lightbox modal with high-definition inspection, romantic story excerpts, and “Warm this memory” heart counters.

4. **🎂 The Crystal Birthday Cake Ritual**
   - Hyperrealistic 3D glacier ice cake with shimmering frost candles.
   - **Interactive Candle Extinguishing**:
     - Click or hold **“Press & Hold to Blow Candles”** (with rising wind and candle flicker).
     - Or enable **Microphone Breath Detection** to literally blow into your device mic!
   - Extinguishing triggers an explosion of icy cyan, silver, and gold confetti, celebration bells, and a royal wish banner.

5. **🪄 Elsa’s Winter Wand (Ice Sorcery Playground)**
   - Cast 4 interactive winter spells: *Frost Bloom*, *Blizzard Whirlwind*, *Aurora Surge*, and *Diamond Rain*.
   - Live kingdom statistics tracked and persisted by the Express backend.

6. **💌 The Royal Proclamation (Heartfelt Letter)**
   - Ancient frozen parchment sealed with an ice wax crest.
   - Breaking the seal unrolls a touching birthday message celebrating Minni’s warmth, smile, and presence.

7. **🎵 Floating Audio Player**
   - Plays the original vocal track of **“Anuvanuvuu”** (*Om Bheem Bush* by Arijit Singh & Sunny M.R.).
   - Features dynamic frequency equalizer visualizer bars, lyrical whisper carousel, volume controls, and seek bar.

---

## 🐳 Docker & Container Deployment

### 1. One-Command Deployment with Docker Compose
```bash
docker compose up -d --build
```
The application will build both frontend and backend into an optimized Alpine container and be live at `http://localhost:5000`.

To stop the container:
```bash
docker compose down
```

### 2. Standalone Docker Image
```bash
# Build the container image
docker build -t minni-frozen-surprise .

# Run the container in production mode
docker run -d -p 5000:5000 --name minni-frozen-surprise minni-frozen-surprise
```

---

## ☁️ Cloud Deployment Options

### Option 1: Render.com (Recommended Free Hosting)
1. Push this project to GitHub.
2. In Render, select **New + → Web Service** and link your repository.
3. Render will auto-detect `render.yaml` or use:
   - **Environment**: Docker (or Node)
   - **Build Command**: `npm run build`
   - **Start Command**: `npm start`
4. The site will be live with free automatic SSL/HTTPS!

### Option 2: Railway.app
1. Click **New Project → Deploy from GitHub Repo**.
2. Railway detects Dockerfile or Node.js automatically and deploys in under 2 minutes.

---

## 🚀 How to Run Locally

### Option 1: Unified Dev Mode (Hot-Reloading)
```bash
npm run dev
```
- Express backend starts on `http://localhost:5000`
- Vite frontend runs on `http://localhost:3000` (proxying `/api` and `/media` to port 5000)

### Option 2: Production Server Mode
```bash
npm run build
npm start
```
- Builds the optimized React bundle and serves the fullstack application directly at `http://localhost:5000`.

---

## 📁 Project Architecture

```
Minni_Surprise/
├── Anuvanuvuu Full Karaoke...m4a  # Original song file
├── minni pics/                    # Original photos of Minni
├── server/
│   ├── index.js                   # Express server (APIs for audio, photos, wishes, stats)
│   └── data/
│       ├── wishes.json            # Persistent guestbook storage
│       └── stats.json             # Kingdom interaction stats
├── client/
│   ├── public/
│   │   ├── audio.m4a              # High-fidelity audio track
│   │   ├── frozen_palace.jpg      # Photorealistic ice palace backdrop
│   │   ├── frozen_cake.jpg        # Photorealistic 3D crystal cake asset
│   │   └── photos/                # Minni's photo collection
│   ├── src/
│   │   ├── components/
│   │   │   ├── FrostScreenGateway.jsx       # Frost melt & shatter gate
│   │   │   ├── AuroraBorealisCanvas.jsx     # Northern Lights simulation
│   │   │   ├── RealisticSnowCanvas.jsx      # 3D snowfall physics
│   │   │   ├── RoyalNavbar.jsx              # Navigation dock
│   │   │   ├── HeroSection.jsx              # Palace entrance & countdown
│   │   │   ├── FrozenMemoriesGallery.jsx    # 3D crystal polaroid gallery
│   │   │   ├── InteractiveIceCake.jsx       # 3D cake & candle blow ritual
│   │   │   ├── ElsaMagicPlayground.jsx      # Winter spells & stats
│   │   │   ├── RoyalLetter.jsx              # Sealed unrollable letter
│   │   │   ├── WishesWall.jsx               # Express REST guestbook
│   │   │   ├── FloatingMusicPlayer.jsx      # Audio player with visualizer
│   │   │   └── RoyalFooter.jsx              # Closing kingdom blessing
│   │   ├── utils/
│   │   │   └── soundEngine.js               # Web Audio API sound synthesizer
│   │   ├── App.jsx
│   │   ├── index.css                        # Vanilla CSS Frozen design system
│   │   └── main.jsx
│   └── package.json
└── package.json
```

---

*“Anuvanuvuu Nuvve... Even the coldest glaciers melt in the radiance of your smile, Minni.”* 💖❄️
"# Surprise-minni" 
