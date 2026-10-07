import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';
import { execSync } from 'child_process';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Audio file resolution - prioritizing user-provided original vocal Anuvanuvuu track
const originalMp3Name = "ytmp3free.cc_anuvanuvuu-video-lyrics-om-bheem-bush-sree-vishnu-arijit-singh-harsha-konuganti-sunny-mr-youtubemp3free.org.mp3";
const candidateAudioPaths = [
  path.join(rootDir, originalMp3Name),
  path.join(rootDir, 'audio.mp3'),
  path.join(rootDir, 'client', 'public', 'audio.mp3')
];
const audioFilePath = candidateAudioPaths.find((p) => fs.existsSync(p)) || candidateAudioPaths[0];
const audioFileName = path.basename(audioFilePath);

// Photos directory
const photosDir = path.join(rootDir, 'minni pics');

// Data directory for persistent wishes and stats
const dataDir = path.join(__dirname, 'data');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

const wishesFilePath = path.join(dataDir, 'wishes.json');
const statsFilePath = path.join(dataDir, 'stats.json');

// Initialize default wishes if not exists
const initialWishes = [
  {
    id: 'wish-1',
    author: 'Special Heart ❤️',
    relation: 'Forever Admirer',
    message: "Happy Birthday Minni! In this grand frozen universe, your warm smile is the brightest northern light that never fades. Anuvanuvuu prema tho... May every snowflake bring endless joy into your life!",
    icon: '❄️',
    likes: 12,
    createdAt: new Date().toISOString()
  },
  {
    id: 'wish-2',
    author: 'Olaf’s Warm Hugs ⛄',
    relation: 'Friend',
    message: "Some people are worth melting for! Wishing the dearest Minni an enchanting birthday filled with laughter, magic, and boundless love!",
    icon: '⛄',
    likes: 8,
    createdAt: new Date().toISOString()
  },
  {
    id: 'wish-3',
    author: 'The Royal Court 👑',
    relation: 'Well-Wisher',
    message: "Hail to Queen Minni on her special day! May your year ahead be as majestic and sparkling as an ice palace under the northern lights!",
    icon: '👑',
    likes: 15,
    createdAt: new Date().toISOString()
  }
];

if (!fs.existsSync(wishesFilePath)) {
  fs.writeFileSync(wishesFilePath, JSON.stringify(initialWishes, null, 2));
}

if (!fs.existsSync(statsFilePath)) {
  fs.writeFileSync(statsFilePath, JSON.stringify({
    frostMeltedCount: 42,
    candlesBlownCount: 7,
    spellsCastCount: 88,
    wishesCount: initialWishes.length
  }, null, 2));
}

// Memory descriptions & captions for Minni's 9 photos
const photoCaptions = {
  "WhatsApp Image 2026-08-08 at 19.11.57.jpeg": {
    title: "The Lavender Glow",
    quote: "A gentle posture, eyes filled with dreams, radiating quiet warmth even in a chill winter breeze.",
    tags: ["Grace", "Lavender Dream", "Serene"],
    date: "A Timeless Moment"
  },
  "WhatsApp Image 2026-08-08 at 19.11.58.jpeg": {
    title: "Traditional Elegance",
    quote: "Draped in vibrant hues of celebration, her smile outshines the brightest northern aurora.",
    tags: ["Royalty", "Tradition", "Joy"],
    date: "Festive Vibes"
  },
  "WhatsApp Image 2026-08-08 at 19.11.58 (1).jpeg": {
    title: "Pure Radiance",
    quote: "A gaze that holds kindness, honesty, and an undeniable sparkle like freshly fallen winter snow.",
    tags: ["Sparkle", "Pure Heart", "Smile"],
    date: "Golden Hour"
  },
  "WhatsApp Image 2026-08-08 at 19.11.58 (2).jpeg": {
    title: "Enchanted Beauty",
    quote: "Every inch of her personality reflects charm and unshakeable inner grace.",
    tags: ["Queen", "Charm", "Precious"],
    date: "Cherished Day"
  },
  "WhatsApp Image 2026-08-08 at 19.11.59.jpeg": {
    title: "Golden Aura",
    quote: "Yellow like the golden winter sun peaking through frozen crystalline branches.",
    tags: ["Sunshine", "Warmth", "Beauty"],
    date: "Sunny Day"
  },
  "WhatsApp Image 2026-08-08 at 19.12.00.jpeg": {
    title: "Playful Spirit",
    quote: "Her spontaneous joy brings laughter that melts the deepest frost.",
    tags: ["Happiness", "Laughter", "Magic"],
    date: "Unfiltered Smile"
  },
  "WhatsApp Image 2026-08-08 at 19.12.00 (1).jpeg": {
    title: "Sweet Simplicity",
    quote: "Simplicity is the highest form of beauty, and Minni embodies it effortlessly.",
    tags: ["Gentle", "Adorable", "Minni"],
    date: "Memories"
  },
  "WhatsApp Image 2026-08-08 at 19.12.01.jpeg": {
    title: "The Winter Queen",
    quote: "Poised, confident, and crowned with unmatched kindness in every step.",
    tags: ["Confidence", "Elegance", "Perfection"],
    date: "Royal Moment"
  }
};

// Serve static photos from both locations with caching
app.use('/media/photos', express.static(photosDir));
app.use('/photos', express.static(path.join(rootDir, 'client', 'public', 'photos')));

// Stream Audio Endpoint with HTTP Range support for seamless seeking
app.get('/api/audio', (req, res) => {
  if (!fs.existsSync(audioFilePath)) {
    return res.status(404).json({ error: 'Audio file not found' });
  }

  const isMp3 = audioFilePath.toLowerCase().endsWith('.mp3');
  const contentType = isMp3 ? 'audio/mpeg' : 'audio/mp4';

  const stat = fs.statSync(audioFilePath);
  const fileSize = stat.size;
  const range = req.headers.range;

  if (range) {
    const parts = range.replace(/bytes=/, "").split("-");
    const start = parseInt(parts[0], 10);
    const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;
    const chunksize = (end - start) + 1;
    const file = fs.createReadStream(audioFilePath, { start, end });
    const head = {
      'Content-Range': `bytes ${start}-${end}/${fileSize}`,
      'Accept-Ranges': 'bytes',
      'Content-Length': chunksize,
      'Content-Type': contentType,
    };
    res.writeHead(206, head);
    file.pipe(res);
  } else {
    const head = {
      'Content-Length': fileSize,
      'Content-Type': contentType,
      'Accept-Ranges': 'bytes'
    };
    res.writeHead(200, head);
    fs.createReadStream(audioFilePath).pipe(res);
  }
});

// API: List Photos with metadata
const photoDetails = [
  {
    num: 1,
    title: "The Lavender Glow",
    quote: "A gentle posture, eyes filled with dreams, radiating quiet warmth even in a chill winter breeze.",
    tags: ["Grace", "Lavender Dream", "Serene"],
    date: "A Timeless Moment"
  },
  {
    num: 2,
    title: "Pure Radiance",
    quote: "A gaze that holds kindness, honesty, and an undeniable sparkle like freshly fallen winter snow.",
    tags: ["Sparkle", "Pure Heart", "Smile"],
    date: "Golden Hour"
  },
  {
    num: 3,
    title: "Enchanted Beauty",
    quote: "Every inch of her personality reflects charm and unshakeable inner grace.",
    tags: ["Queen", "Charm", "Precious"],
    date: "Cherished Day"
  },
  {
    num: 4,
    title: "Traditional Elegance",
    quote: "Draped in vibrant hues of celebration, her smile outshines the brightest northern aurora.",
    tags: ["Royalty", "Tradition", "Joy"],
    date: "Festive Vibes"
  },
  {
    num: 5,
    title: "Golden Aura",
    quote: "Yellow like the golden winter sun peaking through frozen crystalline branches.",
    tags: ["Sunshine", "Warmth", "Beauty"],
    date: "Sunny Day"
  },
  {
    num: 6,
    title: "Sweet Simplicity",
    quote: "Simplicity is the highest form of beauty, and Minni embodies it effortlessly.",
    tags: ["Gentle", "Adorable", "Minni"],
    date: "Memories"
  },
  {
    num: 7,
    title: "Playful Spirit",
    quote: "Her spontaneous joy brings laughter that melts the deepest frost.",
    tags: ["Happiness", "Laughter", "Magic"],
    date: "Unfiltered Smile"
  },
  {
    num: 8,
    title: "The Winter Queen",
    quote: "Poised, confident, and crowned with unmatched kindness in every step.",
    tags: ["Confidence", "Elegance", "Perfection"],
    date: "Royal Moment"
  }
];

app.get('/api/photos', (req, res) => {
  try {
    const photos = photoDetails.map((item) => ({
      id: `photo-${item.num}`,
      fileName: `minni-${item.num}.jpg`,
      url: `/photos/minni-${item.num}.jpg`,
      title: item.title,
      quote: item.quote,
      tags: item.tags,
      date: item.date
    }));
    res.json({ photos, total: photos.length });
  } catch (err) {
    console.error('Error reading photos:', err);
    res.status(500).json({ error: 'Failed to read photos' });
  }
});

// API: Get Wishes
app.get('/api/wishes', (req, res) => {
  try {
    const data = fs.readFileSync(wishesFilePath, 'utf8');
    res.json(JSON.parse(data));
  } catch (err) {
    res.status(500).json({ error: 'Failed to read wishes' });
  }
});

// API: Post a Wish
app.post('/api/wishes', (req, res) => {
  try {
    const { author, relation, message, icon } = req.body;
    if (!message || !message.trim()) {
      return res.status(400).json({ error: 'Message cannot be empty' });
    }

    const currentWishes = JSON.parse(fs.readFileSync(wishesFilePath, 'utf8'));
    const newWish = {
      id: `wish-${Date.now()}`,
      author: (author && author.trim()) || 'Secret Admirer ❄️',
      relation: (relation && relation.trim()) || 'Warm Friend',
      message: message.trim(),
      icon: icon || '❄️',
      likes: 1,
      createdAt: new Date().toISOString()
    };

    currentWishes.unshift(newWish);
    fs.writeFileSync(wishesFilePath, JSON.stringify(currentWishes, null, 2));

    // Update stats
    try {
      const stats = JSON.parse(fs.readFileSync(statsFilePath, 'utf8'));
      stats.wishesCount = (stats.wishesCount || 0) + 1;
      fs.writeFileSync(statsFilePath, JSON.stringify(stats, null, 2));
    } catch (e) {}

    res.status(201).json(newWish);
  } catch (err) {
    res.status(500).json({ error: 'Failed to save wish' });
  }
});

// API: Like/React to a Wish
app.post('/api/wishes/:id/like', (req, res) => {
  try {
    const { id } = req.params;
    const currentWishes = JSON.parse(fs.readFileSync(wishesFilePath, 'utf8'));
    const wish = currentWishes.find(w => w.id === id);
    if (!wish) {
      return res.status(404).json({ error: 'Wish not found' });
    }
    wish.likes = (wish.likes || 0) + 1;
    fs.writeFileSync(wishesFilePath, JSON.stringify(currentWishes, null, 2));
    res.json({ id, likes: wish.likes });
  } catch (err) {
    res.status(500).json({ error: 'Failed to update wish reaction' });
  }
});

// API: Surprise Stats & Interactions
app.get('/api/stats', (req, res) => {
  try {
    const stats = JSON.parse(fs.readFileSync(statsFilePath, 'utf8'));
    res.json(stats);
  } catch (err) {
    res.status(500).json({ error: 'Failed to read stats' });
  }
});

app.post('/api/stats/increment', (req, res) => {
  try {
    const { key } = req.body;
    const validKeys = ['frostMeltedCount', 'candlesBlownCount', 'spellsCastCount'];
    if (!validKeys.includes(key)) {
      return res.status(400).json({ error: 'Invalid key' });
    }
    const stats = JSON.parse(fs.readFileSync(statsFilePath, 'utf8'));
    stats[key] = (stats[key] || 0) + 1;
    fs.writeFileSync(statsFilePath, JSON.stringify(stats, null, 2));
    res.json({ [key]: stats[key] });
  } catch (err) {
    res.status(500).json({ error: 'Failed to update stats' });
  }
});

// Serve client in production if built
const clientDist = path.join(rootDir, 'client', 'dist');
if (fs.existsSync(clientDist)) {
  app.use(express.static(clientDist));
  app.get('*', (req, res) => {
    res.sendFile(path.join(clientDist, 'index.html'));
  });
}

function startServer() {
  const server = app.listen(PORT, () => {
    console.log(`❄️ Frozen Kingdom Birthday Surprise Server running on port ${PORT}`);
    console.log(`❄️ Audio Track: ${audioFileName}`);
    console.log(`❄️ Photos Loaded from: ${photosDir}`);
  });

  server.on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
      console.log(`\n⚠️ Port ${PORT} is in use. Attempting to automatically free port ${PORT}...`);
      try {
        if (process.platform === 'win32') {
          const out = execSync(`netstat -ano`).toString();
          const lines = out.trim().split('\n');
          const pids = new Set();
          for (const line of lines) {
            const parts = line.trim().split(/\s+/);
            if (parts.length >= 5 && parts[0] === 'TCP') {
              const localAddr = parts[1];
              if (localAddr.endsWith(`:${PORT}`)) {
                const pid = parts[parts.length - 1];
                if (pid && pid !== '0' && pid !== String(process.pid)) {
                  pids.add(pid);
                }
              }
            }
          }
          for (const pid of pids) {
            try {
              execSync(`taskkill /F /PID ${pid}`);
              console.log(`Freed port ${PORT} from old PID ${pid}`);
            } catch (e) {}
          }
        }
        setTimeout(() => {
          startServer();
        }, 600);
      } catch (e) {
        console.error(`⚠️ Could not auto-free port ${PORT}. Please close the process using port ${PORT}.`);
      }
    } else {
      console.error('Server error:', err);
    }
  });
}

startServer();
