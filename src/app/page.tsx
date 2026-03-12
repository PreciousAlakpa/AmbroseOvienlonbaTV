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

interface Settings {
  autoplay: boolean;
  darkMode: boolean;
}

const sampleVideos: Video[] = [
  { id: '1', title: 'Sunday Morning Worship Service', category: 'Live', featured: true, thumbnail_url: 'https://images.unsplash.com/photo-1438232992991-995b7058bbb3?w=800', duration: '2:45:00', description: 'Join us for our Sunday morning worship service' } as Video,
  { id: '2', title: 'Evening Prayer Session', category: 'Sermons', featured: false, thumbnail_url: 'https://images.unsplash.com/photo-1507692049790-de58290a4334?w=800', duration: '1:30:00', description: 'A powerful evening prayer session' } as Video,
  { id: '3', title: 'Gospel Music Special', category: 'Music', featured: false, thumbnail_url: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=800', duration: '45:00', description: 'Beautiful gospel music collection' } as Video,
  { id: '4', title: 'Faith Documentary: Journey of Belief', category: 'Movies', featured: false, thumbnail_url: 'https://images.unsplash.com/photo-1485846234645-a62644f84728?w=800', duration: '1:52:00', description: 'A compelling documentary about faith' } as Video,
  { id: '5', title: 'Bible Study: The Gospel of John', category: 'Sermons', featured: false, thumbnail_url: 'https://images.unsplash.com/photo-1504052434569-70ad5836ab65?w=800', duration: '1:15:00', description: 'Deep dive into the Gospel of John' } as Video,
  { id: '6', title: 'Youth Conference 2024', category: 'Sermons', featured: false, thumbnail_url: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800', duration: '3:00:00', description: 'Annual youth conference highlights' } as Video,
  { id: '7', title: 'Praise & Worship Medley', category: 'Music', featured: true, thumbnail_url: 'https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?w=800', duration: '32:00', description: 'Uplifting praise and worship songs' } as Video,
  { id: '8', title: 'Miracles of Jesus', category: 'Movies', featured: false, thumbnail_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800', duration: '2:10:00', description: 'A cinematic portrayal of miracles' } as Video,
];

const sampleSlides: Slide[] = [
  { id: '1', title: 'Welcome to AmbroseOvienlonbaTV', image_url: 'https://images.unsplash.com/photo-1507692049790-de58290a4334?w=1920' } as Slide,
  { id: '2', title: 'Live Sunday Service', image_url: 'https://images.unsplash.com/photo-1438232992991-995b7058bbb3?w=1920' } as Slide,
  { id: '3', title: 'Gospel Music Night', image_url: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=1920' } as Slide,
];

const sampleSchedule: Schedule[] = [
  { id: '1', title: 'Morning Devotion', day: 'Monday', time: '06:00', description: 'Start your day with prayer' },
  { id: '2', title: 'Bible Study', day: 'Tuesday', time: '19:00', description: 'Weekly bible study session' },
  { id: '3', title: 'Midweek Service', day: 'Wednesday', time: '18:00', description: 'Midweek praise and worship' },
  { id: '4', title: 'Youth Fellowship', day: 'Friday', time: '17:00', description: 'Youth gathering and worship' },
  { id: '5', title: 'Sunday Service', day: 'Sunday', time: '09:00', description: 'Main Sunday worship service' },
];

const categories = ['All', 'Live', 'Sermons', 'Music', 'Movies', 'Shows', 'Kids'];

export default function HomePage() {
  const [videos, setVideos] = useState<Video[]>(sampleVideos);
  const [slides, setSlides] = useState<Slide[]>(sampleSlides);
  const [schedule, setSchedule] = useState<Schedule[]>(sampleSchedule);
  const [settings, setSettings] = useState<Settings>({ autoplay: true, darkMode: true });
  const [currentSlide, setCurrentSlide] = useState(0);
  const [showSplash, setShowSplash] = useState(true);
  const [showAdmin, setShowAdmin] = useState(false);
  const [showSideMenu, setShowSideMenu] = useState(false);
  const [showLiveScreen, setShowLiveScreen] = useState(false);
  const [activeNav, setActiveNav] = useState('home');
  const [activeCategory, setActiveCategory] = useState('All');
  const [showSearch, setShowSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedVideo, setSelectedVideo] = useState<Video | null>(null);
  const [historyStack, setHistoryStack] = useState<string[]>(['splash']);

  useEffect(() => {
    fetch('/api/videos').then(r => r.json()).then(d => d.videos?.length && setVideos(d.videos));
    fetch('/api/slides').then(r => r.json()).then(d => d.slides?.length && setSlides(d.slides));
  }, []);

  useEffect(() => {
    if (slides.length <= 1 || !showSplash) return;
    const i = setInterval(() => setCurrentSlide(p => (p + 1) % slides.length), 5000);
    return () => clearInterval(i);
  }, [slides.length, showSplash]);

  const navigateTo = (screen: string) => {
    setHistoryStack(prev => [...prev, screen]);
    if (screen === 'splash') setShowSplash(true);
    else if (screen === 'live') setShowLiveScreen(true);
    else if (screen === 'admin') setShowAdmin(true);
    else setShowSplash(false);
  };

  const goBack = () => {
    if (historyStack.length > 1) {
      const newHistory = [...historyStack.slice(0, -1)];
      setHistoryStack(newHistory);
      const prevScreen = newHistory[newHistory.length - 1];
      if (prevScreen === 'splash') {
        setShowSplash(true);
        setShowLiveScreen(false);
        setShowAdmin(false);
        setSelectedVideo(null);
      } else if (prevScreen === 'home') {
        setShowSplash(false);
        setShowLiveScreen(false);
        setShowAdmin(false);
        setSelectedVideo(null);
      }
    }
  };

  const liveVideos = videos.filter(v => v.featured || v.category === 'Live');
  const sermonsVideos = videos.filter(v => v.category === 'Sermons');
  const musicVideos = videos.filter(v => v.category === 'Music');
  const moviesVideos = videos.filter(v => v.category === 'Movies');
  const filteredVideos = activeCategory === 'All' ? videos : videos.filter(v => v.category === activeCategory);
  const searchResults = searchQuery ? videos.filter(v => v.title.toLowerCase().includes(searchQuery.toLowerCase())) : null;

  const playVideo = (v: Video) => {
    if (v.youtube_url) {
      window.open(v.youtube_url, '_blank');
    } else {
      setSelectedVideo(v);
      navigateTo('video');
    }
  };

  // LIVE VIDEO SCREEN
  if (showLiveScreen) {
    return <LiveScreen onBack={goBack} videos={liveVideos} />;
  }

  // VIDEO PLAYER SCREEN
  if (selectedVideo) {
    return <VideoPlayerScreen video={selectedVideo} onBack={() => { setSelectedVideo(null); goBack(); }} autoplay={settings.autoplay} />;
  }

  // SPLASH SCREEN
  if (showSplash) {
    return (
      <div className="fixed inset-0 bg-black">
        {slides.map((s, i) => (
          <div key={s.id} className={`absolute inset-0 transition-opacity duration-1000 ${i === currentSlide ? 'opacity-100' : 'opacity-0'}`}>
            <img src={s.image_url} alt={s.title} className="w-full h-full object-cover" />
          </div>
        ))}
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/60" />
        
        <nav className="absolute top-0 left-0 right-0 z-20 px-6 md:px-12 py-6 flex justify-between items-center">
          <h1 className="text-xl md:text-2xl font-black text-white">AmbroseOvienlonba<span className="text-blue-400">TV</span></h1>
          <button onClick={() => navigateTo('admin')} className="text-white/80 hover:text-white text-sm px-4 py-2 rounded-full bg-white/10">Admin</button>
        </nav>

        <div className="absolute inset-0 flex flex-col items-center justify-center z-10">
          <h1 className="text-4xl md:text-6xl font-black text-white mb-3 text-center italic">AmbroseOvienlonba<span className="text-blue-400">TV</span></h1>
          <p className="text-white/80 text-base md:text-lg mb-10">24/7 Christian Broadcasting Network</p>
          
          {/* Small Red Rectangle LIVE Button */}
          <button 
            onClick={() => { setShowSplash(false); navigateTo('home'); }} 
            className="flex items-center gap-2 bg-red-600 hover:bg-red-700 px-4 py-2 rounded text-sm font-bold transition-all"
          >
            <span className="w-2 h-2 bg-white rounded-full animate-pulse"></span>
            LIVE
          </button>

          <p className="text-white/60 text-xs mt-4">Click to start streaming</p>

          <div className="absolute bottom-16 flex gap-3">
            {slides.map((_, i) => (
              <button key={i} onClick={() => setCurrentSlide(i)} className={`h-2 rounded-full transition-all ${i === currentSlide ? 'w-10 bg-blue-500' : 'w-2 bg-white/40'}`} />
            ))}
          </div>
        </div>

        {showAdmin && (
          <AdminPanel 
            onClose={() => setShowAdmin(false)} 
            videos={videos} 
            setVideos={setVideos} 
            slides={slides} 
            setSlides={setSlides}
            schedule={schedule}
            setSchedule={setSchedule}
            settings={settings}
            setSettings={setSettings}
          />
        )}
      </div>
    );
  }

  // MAIN APP - TBN/Netflix Style with Side Menu
  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      {/* Side Menu Overlay */}
      {showSideMenu && (
        <div className="fixed inset-0 z-[60] bg-black/50" onClick={() => setShowSideMenu(false)} />
      )}
      
      {/* Side Menu */}
      <aside className={`fixed top-0 left-0 h-full w-72 bg-[#141414] z-[70] transform transition-transform duration-300 ${showSideMenu ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="p-6">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-xl font-black"><span className="text-white">A</span><span className="text-blue-500">O</span><span className="text-white">TV</span></h2>
            <button onClick={() => setShowSideMenu(false)} className="p-2 hover:bg-white/10 rounded-full">
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
              { id: 'schedule', icon: 'M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z', label: 'Schedule' },
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
                className={`w-full flex items-center gap-4 px-4 py-3 rounded-lg transition-colors ${activeNav === item.id ? 'bg-blue-600 text-white' : 'hover:bg-white/10 text-white/70'}`}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={item.icon} /></svg>
                <span className="font-medium">{item.label}</span>
              </button>
            ))}
          </nav>
        </div>
      </aside>

      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-b from-black/90 to-transparent">
        <div className="flex items-center justify-between px-4 md:px-12 py-4">
          <div className="flex items-center gap-4 md:gap-6">
            {/* Menu Button */}
            <button onClick={() => setShowSideMenu(true)} className="p-2 hover:bg-white/10 rounded-full">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>
            </button>
            {/* Back Button */}
            <button onClick={goBack} className="p-2 hover:bg-white/10 rounded-full" title="Go Back">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
            </button>
            <button onClick={() => navigateTo('splash')} className="text-lg md:text-xl font-black hover:opacity-80">
              <span className="text-white">A</span><span className="text-blue-500">O</span><span className="text-white">TV</span>
            </button>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={() => setShowSearch(!showSearch)} className="p-2 hover:bg-white/10 rounded-full">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
            </button>
            <button onClick={() => navigateTo('admin')} className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded text-sm font-semibold">Admin</button>
          </div>
        </div>
        {showSearch && (
          <div className="px-4 md:px-12 pb-4">
            <input 
              type="text" 
              placeholder="Search videos..." 
              value={searchQuery} 
              onChange={e => setSearchQuery(e.target.value)} 
              className="w-full md:w-96 px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-blue-500" 
              autoFocus 
            />
          </div>
        )}
      </header>

      {/* Category Tabs */}
      <div className="fixed top-16 left-0 right-0 z-40 bg-[#0a0a0a]/80 backdrop-blur-sm border-b border-white/10">
        <div className="flex gap-2 px-4 md:px-12 py-3 overflow-x-auto scrollbar-hide">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-all ${activeCategory === cat ? 'bg-blue-600 text-white' : 'bg-white/10 text-white/70 hover:bg-white/20'}`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Hero Section */}
      <section className="relative h-[70vh] md:h-[85vh]">
        {slides[0] && (
          <>
            <img src={slides[0].image_url} alt={slides[0].title} className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-[#0a0a0a]/40 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-r from-[#0a0a0a] via-transparent to-transparent" />
            <div className="absolute bottom-32 md:bottom-40 left-4 md:left-12 max-w-xl">
              <div className="flex items-center gap-2 mb-3">
                <span className="flex items-center gap-1.5 bg-red-600 px-2 py-0.5 rounded text-xs font-bold">
                  <span className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" />LIVE
                </span>
                <span className="text-white/60 text-xs">Featured</span>
              </div>
              <h2 className="text-3xl md:text-5xl font-black mb-3">{slides[0].title}</h2>
              <p className="text-white/70 text-sm md:text-base mb-6">Experience powerful teachings and worship from AmbroseOvienlonbaTV.</p>
              <div className="flex gap-3">
                <button onClick={() => setShowLiveScreen(true)} className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-lg font-bold text-sm">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>Watch Live
                </button>
                <button className="flex items-center gap-2 bg-white/20 hover:bg-white/30 px-6 py-3 rounded-lg font-bold text-sm">More Info</button>
              </div>
            </div>
          </>
        )}
      </section>

      {/* Second Homepage Section - Featured Today */}
      <section className="relative -mt-10 z-10 px-4 md:px-12 mb-8">
        <div className="bg-gradient-to-r from-blue-900/50 to-purple-900/50 rounded-2xl p-6 md:p-8 backdrop-blur-sm border border-white/10">
          <h3 className="text-xl md:text-2xl font-bold mb-4">✨ Featured Today</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {videos.slice(0, 3).map((v, i) => (
              <div 
                key={v.id} 
                onClick={() => playVideo(v)}
                className="relative rounded-xl overflow-hidden cursor-pointer group aspect-video"
              >
                <img src={v.thumbnail_url} alt={v.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                <div className="absolute bottom-3 left-3 right-3">
                  <p className="font-bold text-sm line-clamp-1">{v.title}</p>
                  <p className="text-white/60 text-xs">{v.category} • {v.duration || '1:00:00'}</p>
                </div>
                {i === 0 && (
                  <div className="absolute top-2 left-2 bg-red-600 px-2 py-0.5 rounded text-[10px] font-bold">LIVE</div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Content Rows */}
      <main className="relative pb-24 z-10">
        {searchResults ? (
          <div className="px-4 md:px-12">
            <h3 className="text-lg md:text-xl font-bold mb-4">Search Results ({searchResults.length})</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
              {searchResults.map(v => (
                <VideoCard key={v.id} video={v} onClick={() => playVideo(v)} />
              ))}
            </div>
          </div>
        ) : (
          <>
            {/* Category Filter */}
            {activeCategory !== 'All' && (
              <section className="px-4 md:px-12 mb-6">
                <h3 className="text-lg md:text-xl font-bold mb-4">{activeCategory} Videos</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
                  {filteredVideos.map(v => (
                    <VideoCard key={v.id} video={v} onClick={() => playVideo(v)} />
                  ))}
                </div>
              </section>
            )}
            
            {activeCategory === 'All' && (
              <>
                {liveVideos.length > 0 && <ContentRow title="🔴 Live Now" videos={liveVideos} onClick={playVideo} />}
                <ContentRow title="Recently Added" videos={videos.slice(0, 6)} onClick={playVideo} />
                {sermonsVideos.length > 0 && <ContentRow title="Sermons & Teachings" videos={sermonsVideos} onClick={playVideo} />}
                {musicVideos.length > 0 && <ContentRow title="Gospel Music" videos={musicVideos} onClick={playVideo} />}
                {moviesVideos.length > 0 && <ContentRow title="Faith Movies" videos={moviesVideos} onClick={playVideo} />}
                <ContentRow title="All Content" videos={videos} onClick={playVideo} />
              </>
            )}
          </>
        )}
      </main>

      {/* Mobile Bottom Nav */}
      <nav className="fixed bottom-0 left-0 right-0 bg-[#141414] border-t border-white/10 px-4 py-3 z-50 md:hidden">
        <div className="flex items-center justify-around">
          <button onClick={() => { setActiveNav('home'); setActiveCategory('All'); setShowSearch(false); }} className={`flex flex-col items-center gap-1 ${activeNav === 'home' ? 'text-white' : 'text-white/50'}`}>
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/></svg>
            <span className="text-xs">Home</span>
          </button>
          <button onClick={() => setShowSearch(!showSearch)} className={`flex flex-col items-center gap-1 ${showSearch ? 'text-white' : 'text-white/50'}`}>
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
            <span className="text-xs">Search</span>
          </button>
          <button onClick={() => setShowLiveScreen(true)} className={`flex flex-col items-center gap-1 ${activeNav === 'live' ? 'text-white' : 'text-white/50'}`}>
            <div className="w-6 h-6 flex items-center justify-center">
              <span className="text-xs bg-red-600 px-1.5 py-0.5 rounded font-bold">LIVE</span>
            </div>
            <span className="text-xs">Live</span>
          </button>
          <button onClick={() => setShowAdmin(true)} className="flex flex-col items-center gap-1 text-white/50">
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
          settings={settings}
          setSettings={setSettings}
        />
      )}
    </div>
  );
}

// Live Screen Component
function LiveScreen({ onBack, videos }: { onBack: () => void; videos: Video[] }) {
  const [isPlaying, setIsPlaying] = useState(true);
  const liveVideo = videos[0];

  return (
    <div className="fixed inset-0 bg-black z-[100]">
      {/* Back Button */}
      <button onClick={onBack} className="absolute top-4 left-4 z-20 flex items-center gap-2 bg-black/50 px-4 py-2 rounded-full backdrop-blur-sm hover:bg-black/70 transition-colors">
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
        <span className="text-sm">Back</span>
      </button>

      {/* Live Badge */}
      <div className="absolute top-4 right-4 z-20 flex items-center gap-2">
        <span className="flex items-center gap-1.5 bg-red-600 px-3 py-1.5 rounded text-sm font-bold">
          <span className="w-2 h-2 bg-white rounded-full animate-pulse" />LIVE NOW
        </span>
      </div>

      {/* Video Player */}
      <div className="w-full h-full flex items-center justify-center">
        {liveVideo?.thumbnail_url ? (
          <div className="relative w-full h-full">
            <img src={liveVideo.thumbnail_url} alt={liveVideo.title} className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-black/30" />
            
            {/* Play Overlay */}
            <button 
              onClick={() => setIsPlaying(!isPlaying)} 
              className="absolute inset-0 flex items-center justify-center"
            >
              {!isPlaying && (
                <div className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
                  <svg className="w-10 h-10 text-white ml-1" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
                </div>
              )}
            </button>

            {/* Video Info */}
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6">
              <h2 className="text-2xl font-bold mb-2">{liveVideo.title}</h2>
              <p className="text-white/70">{liveVideo.description || 'Live broadcast from AmbroseOvienlonbaTV'}</p>
              <div className="flex gap-3 mt-4">
                <button className="flex items-center gap-2 bg-white/20 px-4 py-2 rounded-lg text-sm hover:bg-white/30">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" /></svg>
                  Share
                </button>
                <button className="flex items-center gap-2 bg-white/20 px-4 py-2 rounded-lg text-sm hover:bg-white/30">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>
                  Like
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center">
            <div className="w-20 h-20 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-10 h-10 text-white/50" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>
            </div>
            <h2 className="text-xl font-bold mb-2">No Live Stream Available</h2>
            <p className="text-white/60">Check back later for our next live broadcast</p>
          </div>
        )}
      </div>
    </div>
  );
}

// Video Player Screen Component
function VideoPlayerScreen({ video, onBack, autoplay }: { video: Video; onBack: () => void; autoplay: boolean }) {
  const [playing, setPlaying] = useState(autoplay);

  return (
    <div className="fixed inset-0 bg-black z-[100]">
      {/* Back Button */}
      <button onClick={onBack} className="absolute top-4 left-4 z-20 flex items-center gap-2 bg-black/50 px-4 py-2 rounded-full backdrop-blur-sm hover:bg-black/70">
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
        <span className="text-sm">Back</span>
      </button>

      {/* Video */}
      <div className="w-full h-full flex items-center justify-center">
        <div className="relative w-full h-full max-w-5xl mx-auto">
          {video.youtube_url ? (
            <iframe
              src={`${video.youtube_url.replace('watch?v=', 'embed/')}?autoplay=${autoplay ? 1 : 0}`}
              className="w-full h-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          ) : (
            <div className="relative w-full h-full">
              <img src={video.thumbnail_url} alt={video.title} className="w-full h-full object-contain" />
              <button 
                onClick={() => setPlaying(!playing)}
                className="absolute inset-0 flex items-center justify-center"
              >
                {!playing && (
                  <div className="w-24 h-24 bg-blue-600/80 backdrop-blur-sm rounded-full flex items-center justify-center">
                    <svg className="w-12 h-12 text-white ml-1" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
                  </div>
                )}
              </button>
            </div>
          )}

          {/* Video Info */}
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6">
            <h2 className="text-xl md:text-2xl font-bold mb-2">{video.title}</h2>
            <p className="text-white/70 text-sm mb-2">{video.description}</p>
            <div className="flex items-center gap-4 text-white/60 text-sm">
              <span>{video.category}</span>
              <span>•</span>
              <span>{video.duration || '1:00:00'}</span>
            </div>
          </div>
        </div>
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
    <section className="relative mb-6 md:mb-8">
      <h3 className="text-lg md:text-xl font-bold mb-2 md:mb-3 px-4 md:px-12">{title}</h3>
      {left && (
        <button onClick={() => scroll('left')} className="absolute left-0 top-12 z-10 w-10 h-32 bg-gradient-to-r from-[#0a0a0a] to-transparent flex items-center pl-2">
          <div className="w-8 h-8 rounded-full bg-black/50 flex items-center justify-center hover:bg-black/70">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
          </div>
        </button>
      )}
      <div ref={ref} onScroll={check} className="flex gap-2 md:gap-3 overflow-x-auto scrollbar-hide px-4 md:px-12 pb-2">
        {videos.map(v => <VideoCard key={v.id} video={v} onClick={() => onClick(v)} />)}
      </div>
      {right && (
        <button onClick={() => scroll('right')} className="absolute right-0 top-12 z-10 w-10 h-32 bg-gradient-to-l from-[#0a0a0a] to-transparent flex items-center justify-end pr-2">
          <div className="w-8 h-8 rounded-full bg-black/50 flex items-center justify-center hover:bg-black/70">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
          </div>
        </button>
      )}
    </section>
  );
}

// Video Card Component
function VideoCard({ video, onClick }: { video: Video; onClick: () => void }) {
  const [hover, setHover] = useState(false);
  return (
    <div 
      className="flex-shrink-0 w-32 md:w-44 cursor-pointer group relative" 
      onMouseEnter={() => setHover(true)} 
      onMouseLeave={() => setHover(false)} 
      onClick={onClick}
    >
      <div className="relative rounded-md overflow-hidden aspect-video bg-gray-800">
        <img src={video.thumbnail_url || 'https://via.placeholder.com/320x180'} alt={video.title} className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110" />
        <div className={`absolute inset-0 bg-black/60 flex items-center justify-center transition-opacity ${hover ? 'opacity-100' : 'opacity-0'}`}>
          <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
            <svg className="w-5 h-5 text-white ml-0.5" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
          </div>
        </div>
        {video.featured && (
          <div className="absolute top-1.5 left-1.5 flex items-center gap-1 bg-red-600 px-1.5 py-0.5 rounded text-[10px] font-bold">
            <span className="w-1 h-1 bg-white rounded-full animate-pulse" />LIVE
          </div>
        )}
        {video.duration && (
          <div className="absolute bottom-1.5 right-1.5 bg-black/70 px-1.5 py-0.5 rounded text-[10px]">
            {video.duration}
          </div>
        )}
      </div>
      <p className="text-xs text-white/70 mt-1.5 line-clamp-1">{video.title}</p>
    </div>
  );
}

// Admin Panel Component with all features
function AdminPanel({ 
  onClose, 
  videos, 
  setVideos, 
  slides, 
  setSlides,
  schedule,
  setSchedule,
  settings,
  setSettings
}: { 
  onClose: () => void; 
  videos: Video[]; 
  setVideos: (v: Video[]) => void; 
  slides: Slide[]; 
  setSlides: (s: Slide[]) => void;
  schedule: Schedule[];
  setSchedule: (s: Schedule[]) => void;
  settings: Settings;
  setSettings: (s: Settings) => void;
}) {
  const [tab, setTab] = useState('videos');
  const [form, setForm] = useState({ title: '', category: 'Sermons', youtube_url: '', thumbnail_url: '', description: '', duration: '' });
  const [slideForm, setSlideForm] = useState({ title: '', image_url: '' });
  const [scheduleForm, setScheduleForm] = useState({ title: '', day: 'Monday', time: '09:00', description: '' });
  const [editingVideo, setEditingVideo] = useState<Video | null>(null);

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
      setForm({ title: '', category: 'Sermons', youtube_url: '', thumbnail_url: '', description: '', duration: '' }); 
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

  const addSchedule = () => {
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
    <div className="fixed inset-0 z-[100] bg-[#0a0a0a] overflow-y-auto">
      <div className="max-w-4xl mx-auto p-6 md:p-10">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center gap-4">
            <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
            </button>
            <h2 className="text-2xl font-black"><span className="text-blue-500">AOTV</span> Creator Studio</h2>
          </div>
          <button onClick={onClose} className="bg-white/10 px-4 py-2 rounded-full text-sm hover:bg-white/20">Close</button>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6 overflow-x-auto pb-2 scrollbar-hide">
          {[
            { id: 'videos', label: 'Videos' },
            { id: 'add', label: 'Add Video' },
            { id: 'slides', label: 'Image Slider' },
            { id: 'schedule', label: 'Schedule' },
            { id: 'settings', label: 'Settings' },
          ].map(t => (
            <button 
              key={t.id} 
              onClick={() => setTab(t.id)} 
              className={`px-4 py-2 rounded-lg text-sm whitespace-nowrap ${tab === t.id ? 'bg-blue-600' : 'bg-white/10 hover:bg-white/20'}`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* Videos Tab */}
        {tab === 'videos' && (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {videos.map(v => (
              <div key={v.id} className="bg-white/5 rounded-lg overflow-hidden border border-white/10">
                <div className="aspect-video bg-gray-800 relative">
                  {v.thumbnail_url && <img src={v.thumbnail_url} alt={v.title} className="w-full h-full object-cover" />}
                  {v.featured && <div className="absolute top-2 left-2 bg-red-600 px-2 py-0.5 rounded text-[10px] font-bold">LIVE</div>}
                </div>
                <div className="p-3">
                  <p className="text-sm font-medium line-clamp-1 mb-1">{v.title}</p>
                  <p className="text-xs text-white/50 mb-2">{v.category}</p>
                  <div className="flex gap-2">
                    <button onClick={() => setEditingVideo(v)} className="flex-1 text-xs bg-blue-600/20 text-blue-400 py-1.5 rounded hover:bg-blue-600/30">Edit</button>
                    <button onClick={() => delVideo(v.id)} className="flex-1 text-xs bg-red-600/20 text-red-400 py-1.5 rounded hover:bg-red-600/30">Delete</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Add Video Tab */}
        {tab === 'add' && (
          <div className="bg-white/5 rounded-xl p-6 border border-white/10 max-w-md">
            <h3 className="text-lg font-bold mb-4">Add New Video</h3>
            <div className="space-y-4">
              <input placeholder="Video Title *" value={form.title} onChange={e => setForm({...form, title: e.target.value})} className="w-full p-3 rounded-lg bg-white/10 border border-white/10 text-white placeholder-white/50" />
              <select value={form.category} onChange={e => setForm({...form, category: e.target.value})} className="w-full p-3 rounded-lg bg-white/10 border border-white/10 text-white">
                <option value="Sermons">Sermons</option>
                <option value="Music">Music</option>
                <option value="Movies">Movies</option>
                <option value="Live">Live</option>
                <option value="Shows">Shows</option>
                <option value="Kids">Kids</option>
              </select>
              <input placeholder="YouTube URL" value={form.youtube_url} onChange={e => setForm({...form, youtube_url: e.target.value})} className="w-full p-3 rounded-lg bg-white/10 border border-white/10 text-white placeholder-white/50" />
              <input placeholder="Thumbnail URL" value={form.thumbnail_url} onChange={e => setForm({...form, thumbnail_url: e.target.value})} className="w-full p-3 rounded-lg bg-white/10 border border-white/10 text-white placeholder-white/50" />
              <input placeholder="Duration (e.g., 1:30:00)" value={form.duration} onChange={e => setForm({...form, duration: e.target.value})} className="w-full p-3 rounded-lg bg-white/10 border border-white/10 text-white placeholder-white/50" />
              <textarea placeholder="Description" value={form.description} onChange={e => setForm({...form, description: e.target.value})} className="w-full p-3 rounded-lg bg-white/10 border border-white/10 text-white placeholder-white/50 h-24 resize-none" />
              <button onClick={addVideo} className="w-full py-3 bg-blue-600 hover:bg-blue-700 rounded-lg font-bold">Add Video</button>
            </div>
          </div>
        )}

        {/* Image Slider Tab */}
        {tab === 'slides' && (
          <div className="space-y-6">
            {/* Add Slide Form */}
            <div className="bg-white/5 rounded-xl p-6 border border-white/10 max-w-md">
              <h3 className="text-lg font-bold mb-4">Add Slider Image</h3>
              <div className="space-y-4">
                <input placeholder="Slide Title *" value={slideForm.title} onChange={e => setSlideForm({...slideForm, title: e.target.value})} className="w-full p-3 rounded-lg bg-white/10 border border-white/10 text-white placeholder-white/50" />
                <input placeholder="Image URL *" value={slideForm.image_url} onChange={e => setSlideForm({...slideForm, image_url: e.target.value})} className="w-full p-3 rounded-lg bg-white/10 border border-white/10 text-white placeholder-white/50" />
                <button onClick={addSlide} className="w-full py-3 bg-blue-600 hover:bg-blue-700 rounded-lg font-bold">Add Slide</button>
              </div>
            </div>

            {/* Slides Grid */}
            <div>
              <h3 className="text-lg font-bold mb-4">Current Slides ({slides.length})</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {slides.map((s, i) => (
                  <div key={s.id} className="bg-white/5 rounded-lg overflow-hidden border border-white/10">
                    <div className="aspect-video bg-gray-800 relative">
                      <img src={s.image_url} alt={s.title} className="w-full h-full object-cover" />
                      <div className="absolute top-2 left-2 bg-black/50 px-2 py-0.5 rounded text-xs">{i + 1}</div>
                    </div>
                    <div className="p-3 flex justify-between items-center">
                      <span className="text-sm line-clamp-1">{s.title}</span>
                      <button onClick={() => delSlide(s.id)} className="text-red-400 text-xs hover:text-red-300">Delete</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Schedule Tab */}
        {tab === 'schedule' && (
          <div className="space-y-6">
            {/* Add Schedule Form */}
            <div className="bg-white/5 rounded-xl p-6 border border-white/10 max-w-md">
              <h3 className="text-lg font-bold mb-4">Add Programme Schedule</h3>
              <div className="space-y-4">
                <input placeholder="Programme Title *" value={scheduleForm.title} onChange={e => setScheduleForm({...scheduleForm, title: e.target.value})} className="w-full p-3 rounded-lg bg-white/10 border border-white/10 text-white placeholder-white/50" />
                <select value={scheduleForm.day} onChange={e => setScheduleForm({...scheduleForm, day: e.target.value})} className="w-full p-3 rounded-lg bg-white/10 border border-white/10 text-white">
                  {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map(d => (
                    <option key={d} value={d}>{d}</option>
                  ))}
                </select>
                <input type="time" value={scheduleForm.time} onChange={e => setScheduleForm({...scheduleForm, time: e.target.value})} className="w-full p-3 rounded-lg bg-white/10 border border-white/10 text-white" />
                <input placeholder="Description" value={scheduleForm.description} onChange={e => setScheduleForm({...scheduleForm, description: e.target.value})} className="w-full p-3 rounded-lg bg-white/10 border border-white/10 text-white placeholder-white/50" />
                <button onClick={addSchedule} className="w-full py-3 bg-blue-600 hover:bg-blue-700 rounded-lg font-bold">Add Schedule</button>
              </div>
            </div>

            {/* Schedule List */}
            <div>
              <h3 className="text-lg font-bold mb-4">Weekly Schedule</h3>
              <div className="space-y-3">
                {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map(day => {
                  const daySchedule = schedule.filter(s => s.day === day);
                  if (daySchedule.length === 0) return null;
                  return (
                    <div key={day} className="bg-white/5 rounded-lg p-4 border border-white/10">
                      <h4 className="font-bold text-blue-400 mb-2">{day}</h4>
                      {daySchedule.map(s => (
                        <div key={s.id} className="flex items-center justify-between py-2 border-t border-white/5">
                          <div>
                            <span className="text-sm font-medium">{s.title}</span>
                            <span className="text-white/50 text-sm ml-2">{s.time}</span>
                          </div>
                          <button onClick={() => delSchedule(s.id)} className="text-red-400 text-xs hover:text-red-300">Delete</button>
                        </div>
                      ))}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* Settings Tab */}
        {tab === 'settings' && (
          <div className="space-y-6">
            <div className="bg-white/5 rounded-xl p-6 border border-white/10 max-w-md">
              <h3 className="text-lg font-bold mb-4">Playback Settings</h3>
              
              {/* Autoplay Toggle */}
              <div className="flex items-center justify-between py-4 border-b border-white/10">
                <div>
                  <p className="font-medium">Autoplay Videos</p>
                  <p className="text-sm text-white/50">Automatically play videos when selected</p>
                </div>
                <button 
                  onClick={() => setSettings({ ...settings, autoplay: !settings.autoplay })}
                  className={`w-14 h-8 rounded-full transition-colors ${settings.autoplay ? 'bg-blue-600' : 'bg-white/20'}`}
                >
                  <div className={`w-6 h-6 bg-white rounded-full transition-transform ${settings.autoplay ? 'translate-x-7' : 'translate-x-1'}`} />
                </button>
              </div>

              {/* Dark Mode Toggle */}
              <div className="flex items-center justify-between py-4">
                <div>
                  <p className="font-medium">Dark Mode</p>
                  <p className="text-sm text-white/50">Use dark theme throughout the app</p>
                </div>
                <button 
                  onClick={() => setSettings({ ...settings, darkMode: !settings.darkMode })}
                  className={`w-14 h-8 rounded-full transition-colors ${settings.darkMode ? 'bg-blue-600' : 'bg-white/20'}`}
                >
                  <div className={`w-6 h-6 bg-white rounded-full transition-transform ${settings.darkMode ? 'translate-x-7' : 'translate-x-1'}`} />
                </button>
              </div>
            </div>

            <div className="bg-white/5 rounded-xl p-6 border border-white/10 max-w-md">
              <h3 className="text-lg font-bold mb-4">App Information</h3>
              <div className="space-y-3 text-sm">
                <p><span className="text-white/50">Version:</span> 2.0.0</p>
                <p><span className="text-white/50">Platform:</span> Web & Mobile</p>
                <p><span className="text-white/50">Network:</span> AmbroseOvienlonbaTV</p>
              </div>
            </div>
          </div>
        )}

        {/* Edit Video Modal */}
        {editingVideo && (
          <div className="fixed inset-0 z-[110] bg-black/80 flex items-center justify-center p-4">
            <div className="bg-[#1a1a1a] rounded-xl p-6 w-full max-w-md border border-white/10">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-bold">Edit Video</h3>
                <button onClick={() => setEditingVideo(null)} className="p-2 hover:bg-white/10 rounded-full">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                </button>
              </div>
              <div className="space-y-4">
                <input placeholder="Title" value={editingVideo.title} onChange={e => setEditingVideo({...editingVideo, title: e.target.value})} className="w-full p-3 rounded-lg bg-white/10 border border-white/10 text-white" />
                <select value={editingVideo.category} onChange={e => setEditingVideo({...editingVideo, category: e.target.value})} className="w-full p-3 rounded-lg bg-white/10 border border-white/10 text-white">
                  <option value="Sermons">Sermons</option>
                  <option value="Music">Music</option>
                  <option value="Movies">Movies</option>
                  <option value="Live">Live</option>
                </select>
                <input placeholder="YouTube URL" value={editingVideo.youtube_url || ''} onChange={e => setEditingVideo({...editingVideo, youtube_url: e.target.value})} className="w-full p-3 rounded-lg bg-white/10 border border-white/10 text-white" />
                <input placeholder="Thumbnail URL" value={editingVideo.thumbnail_url || ''} onChange={e => setEditingVideo({...editingVideo, thumbnail_url: e.target.value})} className="w-full p-3 rounded-lg bg-white/10 border border-white/10 text-white" />
                <input placeholder="Duration" value={editingVideo.duration || ''} onChange={e => setEditingVideo({...editingVideo, duration: e.target.value})} className="w-full p-3 rounded-lg bg-white/10 border border-white/10 text-white" />
                <textarea placeholder="Description" value={editingVideo.description || ''} onChange={e => setEditingVideo({...editingVideo, description: e.target.value})} className="w-full p-3 rounded-lg bg-white/10 border border-white/10 text-white h-20 resize-none" />
                <div className="flex items-center gap-2">
                  <input type="checkbox" checked={editingVideo.featured} onChange={e => setEditingVideo({...editingVideo, featured: e.target.checked})} className="w-4 h-4" />
                  <span className="text-sm">Featured / Live Video</span>
                </div>
                <div className="flex gap-3">
                  <button onClick={() => setEditingVideo(null)} className="flex-1 py-2 bg-white/10 rounded-lg">Cancel</button>
                  <button onClick={updateVideo} className="flex-1 py-2 bg-blue-600 rounded-lg">Save Changes</button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
