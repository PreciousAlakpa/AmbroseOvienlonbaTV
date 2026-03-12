'use client';

import { useEffect, useState, useRef } from 'react';

interface Video {
  id: string;
  title: string;
  description?: string;
  video_url?: string;
  youtube_url?: string;
  thumbnail_url?: string;
  category: string;
  featured: boolean;
  duration?: string;
}

interface Slide {
  id: string;
  title: string;
  image_url: string;
}

interface Schedule {
  id: string;
  title: string;
  day: string;
  time: string;
  description?: string;
}

interface TVSettings {
  autoplay: boolean;
  singleMode: boolean;
  loopPlayback: boolean;
  showSchedule: boolean;
}

const categories = ['All', 'Live', 'Sermons', 'Music', 'Movies', 'Shows', 'Kids'];

export default function HomePage() {
  const [videos, setVideos] = useState<Video[]>([]);
  const [slides, setSlides] = useState<Slide[]>([]);
  const [schedule, setSchedule] = useState<Schedule[]>([]);
  const [tvSettings, setTVSettings] = useState<TVSettings>({ 
    autoplay: true, 
    singleMode: false, 
    loopPlayback: true,
    showSchedule: true 
  });
  const [currentSlide, setCurrentSlide] = useState(0);
  const [showAdmin, setShowAdmin] = useState(false);
  const [showSideMenu, setShowSideMenu] = useState(false);
  const [showLiveScreen, setShowLiveScreen] = useState(false);
  const [activeNav, setActiveNav] = useState('home');
  const [activeCategory, setActiveCategory] = useState('All');
  const [showSearch, setShowSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedVideo, setSelectedVideo] = useState<Video | null>(null);

  // Fetch data from Supabase
  useEffect(() => {
    fetch('/api/videos')
      .then(r => r.json())
      .then(d => {
        if (d.videos && d.videos.length > 0) setVideos(d.videos);
      });
    fetch('/api/slides')
      .then(r => r.json())
      .then(d => {
        if (d.slides && d.slides.length > 0) setSlides(d.slides);
      });
  }, []);

  // Auto-slide for hero
  useEffect(() => {
    if (slides.length <= 1) return;
    const i = setInterval(() => setCurrentSlide(p => (p + 1) % slides.length), 5000);
    return () => clearInterval(i);
  }, [slides.length]);

  const liveVideos = videos.filter(v => v.featured || v.category === 'Live');
  const sermonsVideos = videos.filter(v => v.category === 'Sermons');
  const musicVideos = videos.filter(v => v.category === 'Music');
  const moviesVideos = videos.filter(v => v.category === 'Movies');
  const filteredVideos = activeCategory === 'All' ? videos : videos.filter(v => v.category === activeCategory);
  const searchResults = searchQuery ? videos.filter(v => v.title.toLowerCase().includes(searchQuery.toLowerCase())) : null;

  const playVideo = (v: Video) => {
    setSelectedVideo(v);
  };

  // LIVE VIDEO SCREEN
  if (showLiveScreen) {
    return <LiveScreen onBack={() => setShowLiveScreen(false)} videos={liveVideos} />;
  }

  // VIDEO PLAYER SCREEN
  if (selectedVideo) {
    return <VideoPlayerScreen video={selectedVideo} onBack={() => setSelectedVideo(null)} autoplay={tvSettings.autoplay} />;
  }

  // MAIN APP - Direct to home, no splash
  return (
    <div className="min-h-screen bg-white text-gray-900">
      {/* Side Menu Overlay */}
      {showSideMenu && (
        <div className="fixed inset-0 z-[60] bg-black/30" onClick={() => setShowSideMenu(false)} />
      )}
      
      {/* Side Menu */}
      <aside className={`fixed top-0 left-0 h-full w-72 bg-white z-[70] transform transition-transform duration-300 shadow-xl ${showSideMenu ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="p-6">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-xl font-black text-blue-600">AOTV</h2>
            <button onClick={() => setShowSideMenu(false)} className="p-2 hover:bg-gray-100 rounded-full">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
          </div>
          
          <nav className="space-y-1">
            {[
              { id: 'home', icon: 'M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z', label: 'Home' },
              { id: 'live', icon: 'M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z', label: 'Live TV' },
              { id: 'sermons', icon: 'M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253', label: 'Sermons' },
              { id: 'music', icon: 'M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3', label: 'Music' },
              { id: 'movies', icon: 'M7 4v16M17 4v16M3 8h4m10 0h4M3 12h18M3 16h4m10 0h4M4 20h16a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 00-1 1v14a1 1 0 001 1z', label: 'Movies' },
              { id: 'admin', icon: 'M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z M15 12a3 3 0 11-6 0 3 3 0 016 0z', label: 'Admin' },
            ].map(item => (
              <button
                key={item.id}
                onClick={() => {
                  setActiveNav(item.id);
                  setShowSideMenu(false);
                  if (item.id === 'live') setShowLiveScreen(true);
                  else if (item.id === 'admin') setShowAdmin(true);
                  else if (item.id === 'sermons') setActiveCategory('Sermons');
                  else if (item.id === 'music') setActiveCategory('Music');
                  else if (item.id === 'movies') setActiveCategory('Movies');
                  else setActiveCategory('All');
                }}
                className={`w-full flex items-center gap-4 px-4 py-3 rounded-lg transition-colors ${activeNav === item.id ? 'bg-blue-600 text-white' : 'hover:bg-gray-100 text-gray-700'}`}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={item.icon} /></svg>
                <span className="font-medium">{item.label}</span>
              </button>
            ))}
          </nav>
        </div>
      </aside>

      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white shadow-sm">
        <div className="flex items-center justify-between px-4 md:px-8 py-4">
          <div className="flex items-center gap-4 md:gap-6">
            {/* Menu Button */}
            <button onClick={() => setShowSideMenu(true)} className="p-2 hover:bg-gray-100 rounded-full">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>
            </button>
            {/* Logo - Clicks to Home */}
            <button onClick={() => { setActiveNav('home'); setActiveCategory('All'); setSelectedVideo(null); setShowLiveScreen(false); }} className="text-lg md:text-xl font-black text-blue-600 hover:opacity-80">
              AOTV
            </button>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={() => setShowSearch(!showSearch)} className="p-2 hover:bg-gray-100 rounded-full">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
            </button>
            <button onClick={() => setShowAdmin(true)} className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded text-sm font-semibold text-white">Admin</button>
          </div>
        </div>
        {showSearch && (
          <div className="px-4 md:px-8 pb-4">
            <input 
              type="text" 
              placeholder="Search videos..." 
              value={searchQuery} 
              onChange={e => setSearchQuery(e.target.value)} 
              className="w-full md:w-96 px-4 py-2 bg-gray-100 border border-gray-200 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:border-blue-500" 
              autoFocus 
            />
          </div>
        )}
      </header>

      {/* Category Tabs */}
      <div className="fixed top-16 left-0 right-0 z-40 bg-white border-b border-gray-200">
        <div className="flex gap-2 px-4 md:px-8 py-3 overflow-x-auto scrollbar-hide">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-all ${activeCategory === cat ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Hero Section - Only show user's uploaded images, NO demo */}
      {slides.length > 0 && (
        <section className="relative h-[60vh] md:h-[75vh] mt-28">
          {slides.map((s, i) => (
            <div key={s.id} className={`absolute inset-0 transition-opacity duration-1000 ${i === currentSlide ? 'opacity-100' : 'opacity-0'}`}>
              <img src={s.image_url} alt={s.title} className="w-full h-full object-cover" />
            </div>
          ))}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
          <div className="absolute bottom-8 md:bottom-16 left-4 md:left-8 max-w-xl">
            <div className="flex items-center gap-2 mb-3">
              <span className="flex items-center gap-1.5 bg-red-600 px-3 py-1 rounded text-xs font-bold text-white">
                <span className="w-2 h-2 bg-white rounded-full animate-pulse" />LIVE
              </span>
            </div>
            <h2 className="text-2xl md:text-4xl font-black text-white mb-2">{slides[currentSlide]?.title || ''}</h2>
            <p className="text-white/80 text-sm md:text-base mb-4">24/7 Christian Broadcasting Network</p>
            <div className="flex gap-3">
              <button onClick={() => setShowLiveScreen(true)} className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-lg font-bold text-sm text-white">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>Watch Live
              </button>
            </div>
          </div>
          {/* Slide Indicators */}
          {slides.length > 1 && (
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2">
              {slides.map((_, i) => (
                <button key={i} onClick={() => setCurrentSlide(i)} className={`h-2 rounded-full transition-all ${i === currentSlide ? 'w-8 bg-blue-600' : 'w-2 bg-white/50'}`} />
              ))}
            </div>
          )}
        </section>
      )}

      {/* Schedule Display */}
      {tvSettings.showSchedule && schedule.length > 0 && (
        <section className="px-4 md:px-8 py-6 bg-gray-50">
          <h3 className="text-lg font-bold mb-4 text-gray-900">Today&apos;s Schedule</h3>
          <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
            {schedule.slice(0, 5).map(s => (
              <div key={s.id} className="flex-shrink-0 bg-white rounded-lg p-4 shadow-sm border border-gray-100 min-w-[180px]">
                <p className="text-xs text-blue-600 font-bold mb-1">{s.time}</p>
                <p className="font-medium text-sm text-gray-900">{s.title}</p>
                <p className="text-xs text-gray-500 mt-1">{s.day}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Video Content */}
      <main className="px-4 md:px-8 py-6 pb-24">
        {searchResults ? (
          <div>
            <h3 className="text-lg font-bold mb-4 text-gray-900">Search Results ({searchResults.length})</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {searchResults.map(v => (
                <VideoCard key={v.id} video={v} onClick={() => playVideo(v)} />
              ))}
            </div>
          </div>
        ) : (
          <>
            {activeCategory !== 'All' && (
              <section className="mb-6">
                <h3 className="text-lg font-bold mb-4 text-gray-900">{activeCategory} Videos</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
                  {filteredVideos.map(v => (
                    <VideoCard key={v.id} video={v} onClick={() => playVideo(v)} />
                  ))}
                </div>
                {filteredVideos.length === 0 && (
                  <div className="text-center py-12 text-gray-500">
                    <p>No videos in this category yet.</p>
                  </div>
                )}
              </section>
            )}
            
            {activeCategory === 'All' && (
              <>
                {liveVideos.length > 0 && <ContentRow title="Live Now" videos={liveVideos} onClick={playVideo} />}
                {videos.length > 0 && <ContentRow title="Recently Added" videos={videos.slice(0, 8)} onClick={playVideo} />}
                {sermonsVideos.length > 0 && <ContentRow title="Sermons & Teachings" videos={sermonsVideos} onClick={playVideo} />}
                {musicVideos.length > 0 && <ContentRow title="Gospel Music" videos={musicVideos} onClick={playVideo} />}
                {moviesVideos.length > 0 && <ContentRow title="Faith Movies" videos={moviesVideos} onClick={playVideo} />}
                
                {videos.length === 0 && (
                  <div className="text-center py-16">
                    <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">No Videos Yet</h3>
                    <p className="text-gray-500 mb-4">Add videos from the Admin panel</p>
                    <button onClick={() => setShowAdmin(true)} className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">Go to Admin</button>
                  </div>
                )}
              </>
            )}
          </>
        )}
      </main>

      {/* Mobile Bottom Nav */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 py-3 z-50 md:hidden">
        <div className="flex items-center justify-around">
          <button onClick={() => { setActiveNav('home'); setActiveCategory('All'); }} className={`flex flex-col items-center gap-1 ${activeNav === 'home' ? 'text-blue-600' : 'text-gray-500'}`}>
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/></svg>
            <span className="text-xs">Home</span>
          </button>
          <button onClick={() => setShowSearch(!showSearch)} className={`flex flex-col items-center gap-1 ${showSearch ? 'text-blue-600' : 'text-gray-500'}`}>
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
            <span className="text-xs">Search</span>
          </button>
          <button onClick={() => setShowLiveScreen(true)} className="flex flex-col items-center gap-1 text-gray-500">
            <span className="text-xs bg-red-600 text-white px-2 py-1 rounded font-bold">LIVE</span>
          </button>
          <button onClick={() => setShowAdmin(true)} className="flex flex-col items-center gap-1 text-gray-500">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
            <span className="text-xs">Admin</span>
          </button>
        </div>
      </nav>

      {showAdmin && (
        <AdminPanel 
          onClose={() => setShowAdmin(false)} 
          videos={videos} 
          setVideos={setVideos} 
          slides={slides} 
          setSlides={setSlides}
          schedule={schedule}
          setSchedule={setSchedule}
          tvSettings={tvSettings}
          setTVSettings={setTVSettings}
        />
      )}
    </div>
  );
}

// Live Screen Component
function LiveScreen({ onBack, videos }: { onBack: () => void; videos: Video[] }) {
  const [isMuted, setIsMuted] = useState(true);
  const liveVideo = videos[0];

  return (
    <div className="fixed inset-0 bg-black z-[100]">
      {/* Back Button */}
      <button onClick={onBack} className="absolute top-4 left-4 z-20 flex items-center gap-2 bg-white/20 px-4 py-2 rounded-full backdrop-blur-sm hover:bg-white/30 text-white transition-colors">
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
        <span className="text-sm">Back</span>
      </button>

      {/* Live Badge */}
      <div className="absolute top-4 right-4 z-20 flex items-center gap-2">
        {/* Unmute Button */}
        {isMuted && (
          <button 
            onClick={() => setIsMuted(false)}
            className="flex items-center gap-2 bg-yellow-500 text-black px-4 py-2 rounded-full font-bold hover:bg-yellow-400 transition-colors animate-pulse"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z"/></svg>
            Unmute
          </button>
        )}
        <span className="flex items-center gap-1.5 bg-red-600 px-3 py-1.5 rounded text-sm font-bold text-white">
          <span className="w-2 h-2 bg-white rounded-full animate-pulse" />LIVE
        </span>
      </div>

      {/* Video Player */}
      <div className="w-full h-full flex items-center justify-center">
        {liveVideo?.youtube_url ? (
          <iframe 
            src={`${liveVideo.youtube_url.replace('watch?v=', 'embed/')}?autoplay=1&mute=${isMuted ? 1 : 0}&controls=1`}
            className="w-full h-full" 
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
            allowFullScreen 
          />
        ) : liveVideo?.thumbnail_url ? (
          <div className="relative w-full h-full">
            <img src={liveVideo.thumbnail_url} alt={liveVideo.title} className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-black/30" />
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6">
              <h2 className="text-2xl font-bold text-white mb-2">{liveVideo.title}</h2>
              <p className="text-white/70">{liveVideo.description || 'Live broadcast'}</p>
            </div>
          </div>
        ) : (
          <div className="text-center text-white">
            <div className="w-20 h-20 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-10 h-10 text-white/50" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>
            </div>
            <h2 className="text-xl font-bold mb-2">No Live Stream Available</h2>
            <p className="text-white/60">Check back later for our next live broadcast</p>
            <button onClick={onBack} className="mt-4 px-6 py-2 bg-blue-600 rounded-lg hover:bg-blue-700">Back to Home</button>
          </div>
        )}
      </div>
    </div>
  );
}

// Video Player Screen Component
function VideoPlayerScreen({ video, onBack, autoplay }: { video: Video; onBack: () => void; autoplay: boolean }) {
  return (
    <div className="fixed inset-0 bg-black z-[100]">
      {/* Back Button */}
      <button onClick={onBack} className="absolute top-4 left-4 z-20 flex items-center gap-2 bg-white/20 px-4 py-2 rounded-full backdrop-blur-sm hover:bg-white/30 text-white">
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
        <span className="text-sm">Back</span>
      </button>

      {/* Video */}
      <div className="w-full h-full flex items-center justify-center">
        {video.youtube_url ? (
          <iframe
            src={`${video.youtube_url.replace('watch?v=', 'embed/')}?autoplay=${autoplay ? 1 : 0}&mute=0`}
            className="w-full h-full"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        ) : (
          <div className="relative w-full h-full max-w-5xl mx-auto">
            <img src={video.thumbnail_url} alt={video.title} className="w-full h-full object-contain" />
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6">
              <h2 className="text-xl md:text-2xl font-bold text-white mb-2">{video.title}</h2>
              <p className="text-white/70 text-sm mb-2">{video.description}</p>
              <div className="flex items-center gap-4 text-white/60 text-sm">
                <span>{video.category}</span>
                <span>•</span>
                <span>{video.duration || '1:00:00'}</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// Content Row Component
function ContentRow({ title, videos, onClick }: { title: string; videos: Video[]; onClick: (v: Video) => void }) {
  const ref = useRef<HTMLDivElement>(null);
  const [left, setLeft] = useState(false);
  const [right, setRight] = useState(true);

  if (!videos.length) return null;

  const scroll = (d: 'left' | 'right') => ref.current?.scrollBy({ left: d === 'left' ? -ref.current.clientWidth * 0.8 : ref.current.clientWidth * 0.8, behavior: 'smooth' });
  const check = () => ref.current && (setLeft(ref.current.scrollLeft > 0), setRight(ref.current.scrollLeft < ref.current.scrollWidth - ref.current.clientWidth - 10));

  return (
    <section className="relative mb-6">
      <h3 className="text-lg font-bold mb-3 text-gray-900">{title}</h3>
      {left && (
        <button onClick={() => scroll('left')} className="absolute left-0 top-16 z-10 w-10 h-28 bg-gradient-to-r from-white to-transparent flex items-center pl-2">
          <div className="w-8 h-8 rounded-full bg-white shadow-lg flex items-center justify-center hover:bg-gray-50">
            <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
          </div>
        </button>
      )}
      <div ref={ref} onScroll={check} className="flex gap-3 overflow-x-auto scrollbar-hide pb-2">
        {videos.map(v => <VideoCard key={v.id} video={v} onClick={() => onClick(v)} />)}
      </div>
      {right && (
        <button onClick={() => scroll('right')} className="absolute right-0 top-16 z-10 w-10 h-28 bg-gradient-to-l from-white to-transparent flex items-center justify-end pr-2">
          <div className="w-8 h-8 rounded-full bg-white shadow-lg flex items-center justify-center hover:bg-gray-50">
            <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
          </div>
        </button>
      )}
    </section>
  );
}

// Video Card Component
function VideoCard({ video, onClick }: { video: Video; onClick: () => void }) {
  return (
    <div 
      className="flex-shrink-0 w-36 md:w-44 cursor-pointer group" 
      onClick={onClick}
    >
      <div className="relative rounded-lg overflow-hidden aspect-video bg-gray-200 shadow-sm">
        {video.thumbnail_url ? (
          <img src={video.thumbnail_url} alt={video.title} className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gray-300">
            <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>
          </div>
        )}
        {video.featured && (
          <div className="absolute top-2 left-2 flex items-center gap-1 bg-red-600 px-2 py-0.5 rounded text-[10px] font-bold text-white">
            <span className="w-1 h-1 bg-white rounded-full animate-pulse" />LIVE
          </div>
        )}
        {video.duration && (
          <div className="absolute bottom-2 right-2 bg-black/70 px-1.5 py-0.5 rounded text-[10px] text-white">
            {video.duration}
          </div>
        )}
      </div>
      <p className="text-xs text-gray-700 mt-2 line-clamp-2 font-medium">{video.title}</p>
      <p className="text-xs text-gray-500">{video.category}</p>
    </div>
  );
}

// Admin Panel Component
function AdminPanel({ 
  onClose, 
  videos, 
  setVideos, 
  slides, 
  setSlides,
  schedule,
  setSchedule,
  tvSettings,
  setTVSettings
}: { 
  onClose: () => void; 
  videos: Video[]; 
  setVideos: (v: Video[]) => void; 
  slides: Slide[]; 
  setSlides: (s: Slide[]) => void;
  schedule: Schedule[];
  setSchedule: (s: Schedule[]) => void;
  tvSettings: TVSettings;
  setTVSettings: (s: TVSettings) => void;
}) {
  const [tab, setTab] = useState('videos');
  const [form, setForm] = useState({ title: '', category: 'Sermons', youtube_url: '', thumbnail_url: '', description: '', duration: '', featured: false });
  const [slideForm, setSlideForm] = useState({ title: '', image_url: '' });
  const [scheduleForm, setScheduleForm] = useState({ title: '', day: 'Monday', time: '09:00', description: '' });
  const [editingVideo, setEditingVideo] = useState<Video | null>(null);

  // Extract YouTube thumbnail
  const getYouTubeThumbnail = (url: string): string | null => {
    if (!url) return null;
    const match = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]+)/);
    return match ? `https://img.youtube.com/vi/${match[1]}/maxresdefault.jpg` : null;
  };

  const handleYouTubeUrlChange = (url: string) => {
    const thumbnail = getYouTubeThumbnail(url);
    setForm(prev => ({ ...prev, youtube_url: url, thumbnail_url: thumbnail || prev.thumbnail_url }));
  };

  const addVideo = async () => {
    if (!form.title) return alert('Enter title');
    const res = await fetch('/api/videos', { 
      method: 'POST', 
      headers: { 'Content-Type': 'application/json' }, 
      body: JSON.stringify(form) 
    });
    if (res.ok) { 
      const d = await res.json(); 
      setVideos([d.video, ...videos]); 
      setForm({ title: '', category: 'Sermons', youtube_url: '', thumbnail_url: '', description: '', duration: '', featured: false }); 
      alert('Video added!'); 
    }
  };

  const updateVideo = async () => {
    if (!editingVideo) return;
    const res = await fetch('/api/videos', { 
      method: 'PUT', 
      headers: { 'Content-Type': 'application/json' }, 
      body: JSON.stringify(editingVideo) 
    });
    if (res.ok) {
      setVideos(videos.map(v => v.id === editingVideo.id ? editingVideo : v));
      setEditingVideo(null);
      alert('Video updated!');
    }
  };

  const delVideo = async (id: string) => {
    if (!confirm('Delete this video?')) return;
    await fetch(`/api/videos?id=${id}`, { method: 'DELETE' });
    setVideos(videos.filter(v => v.id !== id));
  };

  const addSlide = async () => {
    if (!slideForm.title || !slideForm.image_url) return alert('Enter title and image URL');
    const res = await fetch('/api/slides', { 
      method: 'POST', 
      headers: { 'Content-Type': 'application/json' }, 
      body: JSON.stringify(slideForm) 
    });
    if (res.ok) {
      const d = await res.json();
      setSlides([d.slide, ...slides]);
      setSlideForm({ title: '', image_url: '' });
      alert('Slide added!');
    }
  };

  const delSlide = async (id: string) => {
    if (!confirm('Delete this slide?')) return;
    await fetch(`/api/slides?id=${id}`, { method: 'DELETE' });
    setSlides(slides.filter(s => s.id !== id));
  };

  const addScheduleItem = () => {
    if (!scheduleForm.title) return alert('Enter title');
    const newSchedule = { ...scheduleForm, id: Date.now().toString() };
    setSchedule([...schedule, newSchedule]);
    setScheduleForm({ title: '', day: 'Monday', time: '09:00', description: '' });
    alert('Schedule added!');
  };

  const delSchedule = (id: string) => {
    if (!confirm('Delete this schedule?')) return;
    setSchedule(schedule.filter(s => s.id !== id));
  };

  return (
    <div className="fixed inset-0 z-[100] bg-white overflow-y-auto">
      <div className="max-w-4xl mx-auto p-6 md:p-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center gap-4">
            <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
            </button>
            <h2 className="text-2xl font-black text-blue-600">AOTV Admin</h2>
          </div>
          <button onClick={onClose} className="bg-gray-100 px-4 py-2 rounded-full text-sm hover:bg-gray-200">Close</button>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6 overflow-x-auto pb-2 scrollbar-hide">
          {[
            { id: 'videos', label: 'Videos' },
            { id: 'add', label: 'Add Video' },
            { id: 'slides', label: 'Image Slider' },
            { id: 'schedule', label: 'Schedule' },
            { id: 'tvsettings', label: 'TV Settings' },
          ].map(t => (
            <button 
              key={t.id} 
              onClick={() => setTab(t.id)} 
              className={`px-4 py-2 rounded-lg text-sm whitespace-nowrap ${tab === t.id ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* Videos Tab */}
        {tab === 'videos' && (
          <div>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold text-gray-900">All Videos ({videos.length})</h3>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {videos.map(v => (
                <div key={v.id} className="bg-gray-50 rounded-lg overflow-hidden border border-gray-200">
                  <div className="aspect-video bg-gray-200 relative">
                    {v.thumbnail_url && <img src={v.thumbnail_url} alt={v.title} className="w-full h-full object-cover" />}
                    {v.featured && <div className="absolute top-2 left-2 flex items-center gap-1 bg-red-600 px-2 py-0.5 rounded text-[10px] font-bold text-white"><span className="w-1 h-1 bg-white rounded-full animate-pulse" />LIVE</div>}
                  </div>
                  <div className="p-3">
                    <p className="text-sm font-medium text-gray-900 line-clamp-1 mb-1">{v.title}</p>
                    <p className="text-xs text-gray-500 mb-3">{v.category}</p>
                    <div className="flex gap-2">
                      <button onClick={() => setEditingVideo(v)} className="flex-1 text-xs bg-blue-100 text-blue-700 py-2 rounded hover:bg-blue-200 transition-colors">Edit</button>
                      <button onClick={() => delVideo(v.id)} className="flex-1 text-xs bg-red-100 text-red-700 py-2 rounded hover:bg-red-200 transition-colors">Delete</button>
                    </div>
                  </div>
                </div>
              ))}
              {videos.length === 0 && (
                <div className="col-span-full text-center py-12 text-gray-500">
                  <p>No videos yet. Add your first video!</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Add Video Tab */}
        {tab === 'add' && (
          <div className="max-w-lg">
            <h3 className="text-lg font-bold mb-4 text-gray-900">Add New Video</h3>
            <div className="bg-gray-50 rounded-xl p-6 border border-gray-200 space-y-4">
              <input 
                placeholder="Video Title *" 
                value={form.title} 
                onChange={e => setForm({...form, title: e.target.value})} 
                className="w-full p-3 rounded-lg bg-white border border-gray-300 text-gray-900 placeholder-gray-500 focus:border-blue-500 focus:outline-none" 
              />
              <select 
                value={form.category} 
                onChange={e => setForm({...form, category: e.target.value})} 
                className="w-full p-3 rounded-lg bg-white border border-gray-300 text-gray-900"
              >
                <option value="Sermons">Sermons</option>
                <option value="Music">Music</option>
                <option value="Movies">Movies</option>
                <option value="Live">Live</option>
                <option value="Shows">Shows</option>
                <option value="Kids">Kids</option>
              </select>
              <input 
                placeholder="YouTube URL (thumbnail auto-detected)" 
                value={form.youtube_url} 
                onChange={e => handleYouTubeUrlChange(e.target.value)} 
                className="w-full p-3 rounded-lg bg-white border border-gray-300 text-gray-900 placeholder-gray-500 focus:border-blue-500 focus:outline-none" 
              />
              {form.thumbnail_url && (
                <img src={form.thumbnail_url} alt="Thumbnail" className="w-48 h-28 object-cover rounded-lg border border-gray-200" />
              )}
              <input 
                placeholder="Or enter Thumbnail URL manually" 
                value={form.thumbnail_url} 
                onChange={e => setForm({...form, thumbnail_url: e.target.value})} 
                className="w-full p-3 rounded-lg bg-white border border-gray-300 text-gray-900 placeholder-gray-500 focus:border-blue-500 focus:outline-none" 
              />
              <input 
                placeholder="Duration (e.g., 1:30:00)" 
                value={form.duration} 
                onChange={e => setForm({...form, duration: e.target.value})} 
                className="w-full p-3 rounded-lg bg-white border border-gray-300 text-gray-900 placeholder-gray-500 focus:border-blue-500 focus:outline-none" 
              />
              <textarea 
                placeholder="Description" 
                value={form.description} 
                onChange={e => setForm({...form, description: e.target.value})} 
                className="w-full p-3 rounded-lg bg-white border border-gray-300 text-gray-900 placeholder-gray-500 h-24 resize-none focus:border-blue-500 focus:outline-none" 
              />
              <label className="flex items-center gap-3 cursor-pointer">
                <input 
                  type="checkbox" 
                  checked={form.featured} 
                  onChange={e => setForm({...form, featured: e.target.checked})} 
                  className="w-5 h-5 rounded" 
                />
                <span className="text-sm text-gray-700">Featured / Live Video</span>
              </label>
              <button onClick={addVideo} className="w-full py-3 bg-blue-600 hover:bg-blue-700 rounded-lg font-bold text-white transition-colors">
                Add Video
              </button>
            </div>
          </div>
        )}

        {/* Image Slider Tab */}
        {tab === 'slides' && (
          <div className="space-y-8">
            <div className="max-w-lg">
              <h3 className="text-lg font-bold mb-4 text-gray-900">Add Slider Image</h3>
              <div className="bg-gray-50 rounded-xl p-6 border border-gray-200 space-y-4">
                <input 
                  placeholder="Slide Title *" 
                  value={slideForm.title} 
                  onChange={e => setSlideForm({...slideForm, title: e.target.value})} 
                  className="w-full p-3 rounded-lg bg-white border border-gray-300 text-gray-900 placeholder-gray-500 focus:border-blue-500 focus:outline-none" 
                />
                <input 
                  placeholder="Image URL *" 
                  value={slideForm.image_url} 
                  onChange={e => setSlideForm({...slideForm, image_url: e.target.value})} 
                  className="w-full p-3 rounded-lg bg-white border border-gray-300 text-gray-900 placeholder-gray-500 focus:border-blue-500 focus:outline-none" 
                />
                <button onClick={addSlide} className="w-full py-3 bg-blue-600 hover:bg-blue-700 rounded-lg font-bold text-white transition-colors">
                  Add Slide
                </button>
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-bold mb-4 text-gray-900">Current Slides ({slides.length})</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {slides.map((s, i) => (
                  <div key={s.id} className="bg-gray-50 rounded-lg overflow-hidden border border-gray-200">
                    <div className="aspect-video bg-gray-200 relative">
                      <img src={s.image_url} alt={s.title} className="w-full h-full object-cover" />
                      <div className="absolute top-2 left-2 bg-blue-600 px-2 py-0.5 rounded text-xs font-bold text-white">#{i + 1}</div>
                    </div>
                    <div className="p-3 flex justify-between items-center">
                      <span className="text-sm text-gray-900 line-clamp-1">{s.title}</span>
                      <button onClick={() => delSlide(s.id)} className="text-red-600 text-xs hover:text-red-700">Delete</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Schedule Tab */}
        {tab === 'schedule' && (
          <div className="space-y-8">
            <div className="max-w-lg">
              <h3 className="text-lg font-bold mb-4 text-gray-900">Add Programme Schedule</h3>
              <div className="bg-gray-50 rounded-xl p-6 border border-gray-200 space-y-4">
                <input 
                  placeholder="Programme Title *" 
                  value={scheduleForm.title} 
                  onChange={e => setScheduleForm({...scheduleForm, title: e.target.value})} 
                  className="w-full p-3 rounded-lg bg-white border border-gray-300 text-gray-900 placeholder-gray-500 focus:border-blue-500 focus:outline-none" 
                />
                <select 
                  value={scheduleForm.day} 
                  onChange={e => setScheduleForm({...scheduleForm, day: e.target.value})} 
                  className="w-full p-3 rounded-lg bg-white border border-gray-300 text-gray-900"
                >
                  {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map(d => (
                    <option key={d} value={d}>{d}</option>
                  ))}
                </select>
                <input 
                  type="time" 
                  value={scheduleForm.time} 
                  onChange={e => setScheduleForm({...scheduleForm, time: e.target.value})} 
                  className="w-full p-3 rounded-lg bg-white border border-gray-300 text-gray-900 focus:border-blue-500 focus:outline-none" 
                />
                <input 
                  placeholder="Description" 
                  value={scheduleForm.description} 
                  onChange={e => setScheduleForm({...scheduleForm, description: e.target.value})} 
                  className="w-full p-3 rounded-lg bg-white border border-gray-300 text-gray-900 placeholder-gray-500 focus:border-blue-500 focus:outline-none" 
                />
                <button onClick={addScheduleItem} className="w-full py-3 bg-blue-600 hover:bg-blue-700 rounded-lg font-bold text-white transition-colors">
                  Add Schedule
                </button>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-bold mb-4 text-gray-900">Weekly Schedule</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map(day => {
                  const daySchedule = schedule.filter(s => s.day === day);
                  return (
                    <div key={day} className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                      <h4 className="font-bold text-blue-600 mb-3">{day}</h4>
                      {daySchedule.length === 0 ? (
                        <p className="text-gray-400 text-sm">No programmes scheduled</p>
                      ) : (
                        <div className="space-y-2">
                          {daySchedule.map(s => (
                            <div key={s.id} className="flex items-center justify-between py-2 border-t border-gray-200">
                              <div>
                                <p className="text-sm font-medium text-gray-900">{s.title}</p>
                                <p className="text-xs text-gray-500">{s.time}</p>
                              </div>
                              <button onClick={() => delSchedule(s.id)} className="text-red-600 text-xs hover:text-red-700">Delete</button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* TV Settings Tab */}
        {tab === 'tvsettings' && (
          <div className="max-w-lg space-y-6">
            <h3 className="text-lg font-bold text-gray-900">TV Mode Settings</h3>
            
            <div className="bg-gray-50 rounded-xl p-6 border border-gray-200 space-y-4">
              {/* Autoplay Toggle */}
              <div className="flex items-center justify-between py-3 border-b border-gray-200">
                <div>
                  <p className="font-medium text-gray-900">Autoplay Videos</p>
                  <p className="text-sm text-gray-500">Automatically play videos when selected</p>
                </div>
                <button 
                  onClick={() => setTVSettings({ ...tvSettings, autoplay: !tvSettings.autoplay })}
                  className={`w-14 h-8 rounded-full transition-colors ${tvSettings.autoplay ? 'bg-blue-600' : 'bg-gray-300'}`}
                >
                  <div className={`w-6 h-6 bg-white rounded-full shadow transition-transform ${tvSettings.autoplay ? 'translate-x-7' : 'translate-x-1'}`} />
                </button>
              </div>

              {/* Single Mode Toggle */}
              <div className="flex items-center justify-between py-3 border-b border-gray-200">
                <div>
                  <p className="font-medium text-gray-900">Single Mode Programme</p>
                  <p className="text-sm text-gray-500">Play one programme at a time instead of continuous playback</p>
                </div>
                <button 
                  onClick={() => setTVSettings({ ...tvSettings, singleMode: !tvSettings.singleMode })}
                  className={`w-14 h-8 rounded-full transition-colors ${tvSettings.singleMode ? 'bg-blue-600' : 'bg-gray-300'}`}
                >
                  <div className={`w-6 h-6 bg-white rounded-full shadow transition-transform ${tvSettings.singleMode ? 'translate-x-7' : 'translate-x-1'}`} />
                </button>
              </div>

              {/* Loop Playback Toggle */}
              <div className="flex items-center justify-between py-3 border-b border-gray-200">
                <div>
                  <p className="font-medium text-gray-900">Loop Playback</p>
                  <p className="text-sm text-gray-500">Restart playlist after all videos play</p>
                </div>
                <button 
                  onClick={() => setTVSettings({ ...tvSettings, loopPlayback: !tvSettings.loopPlayback })}
                  className={`w-14 h-8 rounded-full transition-colors ${tvSettings.loopPlayback ? 'bg-blue-600' : 'bg-gray-300'}`}
                >
                  <div className={`w-6 h-6 bg-white rounded-full shadow transition-transform ${tvSettings.loopPlayback ? 'translate-x-7' : 'translate-x-1'}`} />
                </button>
              </div>

              {/* Show Schedule Toggle */}
              <div className="flex items-center justify-between py-3">
                <div>
                  <p className="font-medium text-gray-900">Show Schedule on Home</p>
                  <p className="text-sm text-gray-500">Display the schedule section on homepage</p>
                </div>
                <button 
                  onClick={() => setTVSettings({ ...tvSettings, showSchedule: !tvSettings.showSchedule })}
                  className={`w-14 h-8 rounded-full transition-colors ${tvSettings.showSchedule ? 'bg-blue-600' : 'bg-gray-300'}`}
                >
                  <div className={`w-6 h-6 bg-white rounded-full shadow transition-transform ${tvSettings.showSchedule ? 'translate-x-7' : 'translate-x-1'}`} />
                </button>
              </div>
            </div>

            <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
              <h4 className="font-bold text-gray-900 mb-4">Upload Video to Device</h4>
              <p className="text-sm text-gray-500 mb-4">Upload video files directly from your device</p>
              <input 
                type="file" 
                accept="video/*"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    alert(`Video selected: ${file.name}\n\nNote: Direct video upload requires a file storage service. For now, please upload to YouTube and paste the URL in "Add Video" tab.`);
                  }
                }}
                className="w-full p-3 rounded-lg bg-white border border-gray-300 text-gray-900"
              />
              <p className="text-xs text-gray-400 mt-2">Tip: Upload your video to YouTube first, then add the URL in the &quot;Add Video&quot; tab.</p>
            </div>

            <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
              <h4 className="font-bold text-gray-900 mb-4">App Information</h4>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500">Version</span>
                  <span className="text-gray-900">3.0.0</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Platform</span>
                  <span className="text-gray-900">Web & Mobile</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Network</span>
                  <span className="text-gray-900">AmbroseOvienlonbaTV</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Edit Video Modal */}
        {editingVideo && (
          <div className="fixed inset-0 z-[110] bg-black/50 flex items-center justify-center p-4">
            <div className="bg-white rounded-xl p-6 w-full max-w-md border border-gray-200 max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-bold text-gray-900">Edit Video</h3>
                <button onClick={() => setEditingVideo(null)} className="p-2 hover:bg-gray-100 rounded-full">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                </button>
              </div>
              <div className="space-y-4">
                <input 
                  placeholder="Title" 
                  value={editingVideo.title} 
                  onChange={e => setEditingVideo({...editingVideo, title: e.target.value})} 
                  className="w-full p-3 rounded-lg bg-gray-50 border border-gray-300 text-gray-900 focus:border-blue-500 focus:outline-none" 
                />
                <select 
                  value={editingVideo.category} 
                  onChange={e => setEditingVideo({...editingVideo, category: e.target.value})} 
                  className="w-full p-3 rounded-lg bg-gray-50 border border-gray-300 text-gray-900"
                >
                  <option value="Sermons">Sermons</option>
                  <option value="Music">Music</option>
                  <option value="Movies">Movies</option>
                  <option value="Live">Live</option>
                  <option value="Shows">Shows</option>
                  <option value="Kids">Kids</option>
                </select>
                <input 
                  placeholder="YouTube URL" 
                  value={editingVideo.youtube_url || ''} 
                  onChange={e => setEditingVideo({...editingVideo, youtube_url: e.target.value})} 
                  className="w-full p-3 rounded-lg bg-gray-50 border border-gray-300 text-gray-900 focus:border-blue-500 focus:outline-none" 
                />
                <input 
                  placeholder="Thumbnail URL" 
                  value={editingVideo.thumbnail_url || ''} 
                  onChange={e => setEditingVideo({...editingVideo, thumbnail_url: e.target.value})} 
                  className="w-full p-3 rounded-lg bg-gray-50 border border-gray-300 text-gray-900 focus:border-blue-500 focus:outline-none" 
                />
                <input 
                  placeholder="Duration" 
                  value={editingVideo.duration || ''} 
                  onChange={e => setEditingVideo({...editingVideo, duration: e.target.value})} 
                  className="w-full p-3 rounded-lg bg-gray-50 border border-gray-300 text-gray-900 focus:border-blue-500 focus:outline-none" 
                />
                <textarea 
                  placeholder="Description" 
                  value={editingVideo.description || ''} 
                  onChange={e => setEditingVideo({...editingVideo, description: e.target.value})} 
                  className="w-full p-3 rounded-lg bg-gray-50 border border-gray-300 text-gray-900 h-20 resize-none focus:border-blue-500 focus:outline-none" 
                />
                <label className="flex items-center gap-3 cursor-pointer">
                  <input 
                    type="checkbox" 
                    checked={editingVideo.featured || false} 
                    onChange={e => setEditingVideo({...editingVideo, featured: e.target.checked})} 
                    className="w-5 h-5 rounded" 
                  />
                  <span className="text-sm text-gray-700">Featured / Live Video</span>
                </label>
                <div className="flex gap-3 pt-2">
                  <button onClick={() => setEditingVideo(null)} className="flex-1 py-3 bg-gray-100 rounded-lg hover:bg-gray-200 text-gray-700 transition-colors">Cancel</button>
                  <button onClick={updateVideo} className="flex-1 py-3 bg-blue-600 rounded-lg hover:bg-blue-700 text-white transition-colors font-bold">Save Changes</button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
