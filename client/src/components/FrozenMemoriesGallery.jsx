import React, { useState, useEffect } from 'react';
import { Sparkles, Heart, Eye, X, ChevronLeft, ChevronRight, Calendar, Tag, Camera } from 'lucide-react';
import { soundEngine } from '../utils/soundEngine';

export default function FrozenMemoriesGallery() {
  const [photos, setPhotos] = useState([]);
  const [selectedPhoto, setSelectedPhoto] = useState(null);
  const [likes, setLikes] = useState({});
  const [filter, setFilter] = useState('all');

  // Initial fallback list if backend is compiling or restarting
  const defaultPhotos = [
    {
      id: 'photo-1',
      fileName: 'minni-1.jpg',
      url: '/photos/minni-1.jpg',
      title: 'The Lavender Grace',
      quote: 'A gentle posture, eyes filled with dreams, radiating quiet warmth even in a chill winter breeze.',
      tags: ['Grace', 'Lavender', 'Serene'],
      date: 'Timeless Moment'
    },
    {
      id: 'photo-2',
      fileName: 'minni-2.jpg',
      url: '/photos/minni-2.jpg',
      title: 'Pure Radiance',
      quote: 'A gaze that holds kindness, honesty, and an undeniable sparkle like freshly fallen winter snow.',
      tags: ['Sparkle', 'Kindness', 'Smile'],
      date: 'Golden Glow'
    },
    {
      id: 'photo-3',
      fileName: 'minni-3.jpg',
      url: '/photos/minni-3.jpg',
      title: 'Enchanted Beauty',
      quote: 'Every inch of her personality reflects charm, warmth, and unshakeable inner grace.',
      tags: ['Queen', 'Charm', 'Precious'],
      date: 'Cherished Day'
    },
    {
      id: 'photo-4',
      fileName: 'minni-4.jpg',
      url: '/photos/minni-4.jpg',
      title: 'Traditional Elegance',
      quote: 'Draped in vibrant hues of celebration, her smile outshines the brightest northern aurora.',
      tags: ['Royalty', 'Tradition', 'Joy'],
      date: 'Festive Bliss'
    },
    {
      id: 'photo-5',
      fileName: 'minni-5.jpg',
      url: '/photos/minni-5.jpg',
      title: 'Golden Sunlight',
      quote: 'Yellow like the golden winter sun peaking through frozen crystalline branches.',
      tags: ['Sunshine', 'Warmth', 'Beauty'],
      date: 'Sunny Delight'
    },
    {
      id: 'photo-6',
      fileName: 'minni-6.jpg',
      url: '/photos/minni-6.jpg',
      title: 'Sweet Simplicity',
      quote: 'Simplicity is the highest form of beauty, and Minni embodies it effortlessly.',
      tags: ['Gentle', 'Adorable', 'Minni'],
      date: 'Sweet Moments'
    },
    {
      id: 'photo-7',
      fileName: 'minni-7.jpg',
      url: '/photos/minni-7.jpg',
      title: 'Playful Spirit',
      quote: 'Her spontaneous joy brings laughter that melts the deepest frost.',
      tags: ['Happiness', 'Laughter', 'Magic'],
      date: 'Unfiltered Smile'
    },
    {
      id: 'photo-8',
      fileName: 'minni-8.jpg',
      url: '/photos/minni-8.jpg',
      title: 'The Winter Queen',
      quote: 'Poised, confident, and crowned with unmatched kindness in every step.',
      tags: ['Confidence', 'Elegance', 'Perfection'],
      date: 'Royal Moment'
    }
  ];

  useEffect(() => {
    fetch('/api/photos')
      .then((res) => res.json())
      .then((data) => {
        if (data && data.photos && data.photos.length > 0) {
          setPhotos(data.photos);
        } else {
          setPhotos(defaultPhotos);
        }
      })
      .catch(() => {
        setPhotos(defaultPhotos);
      });
  }, []);

  const openLightbox = (photo) => {
    soundEngine.init();
    soundEngine.playCrystalChime();
    setSelectedPhoto(photo);
  };

  const closeLightbox = () => {
    setSelectedPhoto(null);
  };

  const handleHeartClick = (e, id) => {
    e.stopPropagation();
    soundEngine.init();
    soundEngine.playSparkle();
    setLikes((prev) => ({
      ...prev,
      [id]: (prev[id] || 0) + 1
    }));
  };

  const navigateLightbox = (direction) => {
    if (!selectedPhoto) return;
    soundEngine.playSparkle();
    const currentIndex = photos.findIndex((p) => p.id === selectedPhoto.id);
    let nextIndex = currentIndex + direction;
    if (nextIndex < 0) nextIndex = photos.length - 1;
    if (nextIndex >= photos.length) nextIndex = 0;
    setSelectedPhoto(photos[nextIndex]);
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!selectedPhoto) return;
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowLeft') navigateLightbox(-1);
      if (e.key === 'ArrowRight') navigateLightbox(1);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedPhoto, photos]);

  return (
    <section id="gallery" className="relative py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Section Header */}
      <div className="text-center mb-14 space-y-3">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-cyan-950/70 border border-cyan-400/40 text-cyan-300 text-xs sm:text-sm font-medium uppercase tracking-widest backdrop-blur-md">
          <Camera className="w-3.5 h-3.5 text-cyan-300" />
          The Frozen Gallery
          <Sparkles className="w-3.5 h-3.5 text-cyan-300" />
        </div>

        <h2 className="font-['Cinzel_Decorative'] text-3xl sm:text-4xl lg:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-100 via-white to-sky-200 drop-shadow-[0_4px_16px_rgba(56,189,248,0.7)]">
          Crystals of Memory
        </h2>

        <p className="font-['Outfit'] text-slate-300 max-w-2xl mx-auto text-sm sm:text-base leading-relaxed">
          Eight enchanted moments of Minni frozen in crystalline perfection. Each photograph holds a story of joy, elegance, and pure grace.
        </p>
      </div>

      {/* 3D Ice Crystal Polaroid Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 sm:gap-10">
        {photos.map((photo, index) => {
          const currentLikes = (likes[photo.id] || 0) + (index * 3 + 5);
          return (
            <div
              key={photo.id || index}
              onClick={() => openLightbox(photo)}
              className="group relative cursor-pointer rounded-3xl p-3.5 bg-gradient-to-b from-slate-900/80 via-slate-950/90 to-cyan-950/80 backdrop-blur-xl border border-cyan-300/30 shadow-[0_10px_30px_rgba(0,0,0,0.5),0_0_20px_rgba(56,189,248,0.15)] hover:shadow-[0_15px_40px_rgba(56,189,248,0.45)] hover:border-cyan-300/80 transition-all duration-500 hover:-translate-y-2"
              onMouseEnter={() => soundEngine.playSparkle()}
            >
              {/* Ice Corner Accents */}
              <div className="absolute -top-1.5 -left-1.5 w-6 h-6 border-t-2 border-l-2 border-cyan-300 rounded-tl-xl pointer-events-none group-hover:scale-125 transition-transform" />
              <div className="absolute -top-1.5 -right-1.5 w-6 h-6 border-t-2 border-r-2 border-cyan-300 rounded-tr-xl pointer-events-none group-hover:scale-125 transition-transform" />
              <div className="absolute -bottom-1.5 -left-1.5 w-6 h-6 border-b-2 border-l-2 border-cyan-300 rounded-bl-xl pointer-events-none group-hover:scale-125 transition-transform" />
              <div className="absolute -bottom-1.5 -right-1.5 w-6 h-6 border-b-2 border-r-2 border-cyan-300 rounded-br-xl pointer-events-none group-hover:scale-125 transition-transform" />

              {/* Shimmer overlay animation */}
              <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 pointer-events-none" />

              {/* Image Frame with Pristine Crystal Clarity */}
              <div className="relative h-[340px] sm:h-[420px] md:h-[440px] w-full rounded-2xl overflow-hidden bg-slate-950 border-2 border-cyan-400/40 shadow-[0_0_25px_rgba(56,189,248,0.3)]">
                <img
                  src={photo.url || `/photos/minni-${index + 1}.jpg`}
                  alt={photo.title}
                  loading="lazy"
                  className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
                  onError={(e) => {
                    e.currentTarget.src = `/photos/minni-${index + 1}.jpg`;
                  }}
                />

                {/* Top Badge: Memory Index */}
                <div className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-slate-950/85 backdrop-blur-md border border-cyan-400/50 text-[11px] font-semibold text-cyan-200 flex items-center gap-1.5 shadow-md">
                  <Sparkles className="w-3 h-3 text-cyan-300" />
                  <span>Crystal #{index + 1}</span>
                </div>

                {/* Top Right: Heart Reaction */}
                <button
                  onClick={(e) => handleHeartClick(e, photo.id)}
                  className="absolute top-3 right-3 p-2 rounded-full bg-slate-950/85 backdrop-blur-md border border-rose-400/40 text-rose-300 hover:text-white hover:bg-rose-900/80 hover:scale-110 active:scale-95 transition-all flex items-center gap-1.5 shadow-md"
                  title="Warm this memory"
                >
                  <Heart className={`w-3.5 h-3.5 ${likes[photo.id] ? 'fill-rose-400 text-rose-400' : ''}`} />
                  <span className="text-[10px] font-bold text-white">{currentLikes}</span>
                </button>

                {/* Bottom Right: Clean HD View Pill (Does not block face) */}
                <div className="absolute bottom-3 right-3 px-3 py-1 rounded-xl bg-slate-950/90 backdrop-blur-md border border-cyan-400/60 text-cyan-200 text-xs font-semibold flex items-center gap-1.5 shadow-lg group-hover:bg-cyan-300 group-hover:text-slate-950 transition-all">
                  <Eye className="w-3.5 h-3.5" />
                  <span>HD View</span>
                </div>
              </div>

              {/* Photo Caption & Sentiment */}
              <div className="p-3.5 space-y-2 bg-slate-950/80 rounded-2xl mt-2 border border-cyan-400/30">
                <div className="flex items-center justify-between gap-2">
                  <h3
                    className="font-['Cinzel_Decorative'] font-bold text-base sm:text-lg truncate"
                    style={{ color: '#ffffff', textShadow: '0 0 12px rgba(56, 189, 248, 0.8)' }}
                  >
                    {photo.title}
                  </h3>
                  <span
                    className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-cyan-950/90 border border-cyan-400/50"
                    style={{ color: '#67e8f9' }}
                  >
                    {photo.date}
                  </span>
                </div>

                <p
                  className="font-['Cormorant_Garamond'] text-sm sm:text-base font-medium italic line-clamp-2 leading-relaxed"
                  style={{ color: '#e0f2fe' }}
                >
                  "{photo.quote}"
                </p>

                {/* Tags */}
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {photo.tags?.map((t, i) => (
                    <span
                      key={i}
                      className="text-[10px] px-2 py-0.5 rounded-full bg-cyan-900/40 border border-cyan-500/30 font-['Outfit']"
                      style={{ color: '#a5f3fc' }}
                    >
                      #{t}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Lightbox Modal */}
      {selectedPhoto && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-950/85 backdrop-blur-2xl animate-fade-in"
          onClick={closeLightbox}
        >
          {/* Lightbox Content Container */}
          <div
            className="relative max-w-4xl w-full rounded-3xl bg-slate-900/90 border border-cyan-300/50 shadow-[0_0_80px_rgba(56,189,248,0.4)] overflow-hidden flex flex-col md:flex-row max-h-[90vh]"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={closeLightbox}
              className="absolute top-4 right-4 z-20 p-2.5 rounded-full bg-slate-950/80 border border-cyan-400/40 text-cyan-200 hover:text-white hover:bg-cyan-900 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Left/Right Navigation */}
            <button
              onClick={() => navigateLightbox(-1)}
              className="absolute left-3 top-1/2 -translate-y-1/2 z-20 p-2.5 rounded-full bg-slate-950/80 border border-cyan-400/40 text-cyan-200 hover:text-white hover:bg-cyan-900 transition-colors hidden sm:flex"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            <button
              onClick={() => navigateLightbox(1)}
              className="absolute right-3 top-1/2 -translate-y-1/2 z-20 p-2.5 rounded-full bg-slate-950/80 border border-cyan-400/40 text-cyan-200 hover:text-white hover:bg-cyan-900 transition-colors hidden sm:flex"
            >
              <ChevronRight className="w-6 h-6" />
            </button>

            {/* Photo View */}
            <div className="md:w-3/5 bg-black/60 flex items-center justify-center p-4 relative overflow-hidden">
              <img
                src={selectedPhoto.url}
                alt={selectedPhoto.title}
                className="max-h-[75vh] w-auto max-w-full object-contain rounded-xl shadow-2xl"
                onError={(e) => {
                  const idx = photos.findIndex((p) => p.id === selectedPhoto.id);
                  e.currentTarget.src = `/photos/minni-${(idx >= 0 ? idx : 0) + 1}.jpg`;
                }}
              />
            </div>

            {/* Details & Romantic Memory Diary */}
            <div className="md:w-2/5 p-6 sm:p-8 flex flex-col justify-between overflow-y-auto space-y-6 bg-slate-950/95 border-t md:border-t-0 md:border-l border-cyan-400/30">
              <div className="space-y-4">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-950 border border-cyan-400/40 text-cyan-300 text-xs font-semibold">
                  <Sparkles className="w-3 h-3" />
                  <span>Enchanted Portrait</span>
                </div>

                <h3 className="font-['Cinzel_Decorative'] text-2xl font-bold text-white">
                  {selectedPhoto.title}
                </h3>

                <p className="font-['Cormorant_Garamond'] text-lg text-cyan-100 italic leading-relaxed border-l-2 border-cyan-400 pl-4 py-1">
                  "{selectedPhoto.quote}"
                </p>

                <div className="space-y-2 text-xs text-slate-300 font-['Outfit']">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-cyan-400" />
                    <span>Captured in our hearts forever</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Tag className="w-4 h-4 text-cyan-400" />
                    <span>{selectedPhoto.tags?.join(' • ')}</span>
                  </div>
                </div>
              </div>

              {/* Warm Button & Song Tribute */}
              <div className="space-y-3 pt-4 border-t border-cyan-900/40">
                <button
                  onClick={(e) => handleHeartClick(e, selectedPhoto.id)}
                  className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-rose-500/20 to-cyan-500/20 hover:from-rose-500/40 hover:to-cyan-500/40 border border-rose-400/40 text-rose-200 font-semibold text-sm flex items-center justify-center gap-2 transition-all cursor-pointer"
                >
                  <Heart className="w-4 h-4 fill-rose-400 text-rose-400 animate-pulse" />
                  <span>Warm Minni's Memory ({likes[selectedPhoto.id] || 8} Warm Hugs)</span>
                </button>
                <p className="text-[11px] text-center text-cyan-300/70 font-mono">
                  “Anuvanuvuu... every memory is a treasure”
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
