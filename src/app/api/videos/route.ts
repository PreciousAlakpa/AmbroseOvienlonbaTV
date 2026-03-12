import { NextRequest, NextResponse } from 'next/server'
import { supabase, isSupabaseConfigured } from '@/lib/supabase'

// In-memory store for when Supabase is unavailable
let videosStore: Array<{
  id: string;
  title: string;
  description?: string;
  video_url?: string;
  youtube_url?: string;
  thumbnail_url?: string;
  category: string;
  featured: boolean;
  duration?: string;
}> = []

// GET - Fetch all videos
export async function GET() {
  if (!isSupabaseConfigured() || !supabase) {
    return NextResponse.json({ videos: videosStore, message: 'Using local storage' })
  }

  try {
    const { data, error } = await supabase
      .from('videos')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      console.error('GET videos error:', error)
      return NextResponse.json({ videos: videosStore })
    }

    // Map to frontend format
    const videos = (data || []).map((v: Record<string, unknown>) => ({
      id: v.id as string,
      title: v.title as string,
      description: v.description as string,
      video_url: v.video_url as string,
      youtube_url: v.youtube_url || v.youtube_id ? `https://youtube.com/watch?v=${v.youtube_id}` : null,
      thumbnail_url: v.thumbnail_url || v.thumbnail as string,
      category: v.category as string || 'General',
      featured: v.featured || v.is_live as boolean || false,
      duration: v.duration as string
    }))

    videosStore = videos
    
    return NextResponse.json({ videos })
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    console.error('Error fetching videos:', error)
    return NextResponse.json({ videos: videosStore, error: errorMessage }, { status: 500 })
  }
}

// POST - Add new video
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Generate ID if not provided
    const id = body.id || crypto.randomUUID()
    const video = {
      id,
      title: body.title || 'Untitled',
      description: body.description || null,
      video_url: body.video_url || null,
      youtube_url: body.youtube_url || null,
      thumbnail_url: body.thumbnail_url || body.thumbnail || null,
      category: body.category || 'General',
      featured: body.featured || body.is_live || false,
      duration: body.duration || null
    }

    // Add to local store
    videosStore = [video, ...videosStore]

    // Try to save to Supabase
    if (isSupabaseConfigured() && supabase) {
      try {
        const { error } = await supabase
          .from('videos')
          .insert([{
            id: video.id,
            title: video.title,
            description: video.description,
            video_url: video.video_url,
            youtube_id: video.youtube_url ? extractYouTubeId(video.youtube_url) : null,
            thumbnail: video.thumbnail_url,
            thumbnail_url: video.thumbnail_url,
            category: video.category,
            is_live: video.featured,
            featured: video.featured,
            duration: video.duration,
            created_at: new Date().toISOString()
          }])

        if (error) console.error('Supabase insert error:', error)
      } catch (e) {
        console.error('Supabase save error:', e)
      }
    }

    return NextResponse.json({ video, success: true })
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    console.error('Error adding video:', error)
    return NextResponse.json({ error: errorMessage }, { status: 500 })
  }
}

// PUT - Update video
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const video = body

    if (!video || !video.id) {
      return NextResponse.json({ error: 'Video ID required' }, { status: 400 })
    }

    // Update local store
    videosStore = videosStore.map(v => v.id === video.id ? { ...v, ...video } : v)

    // Try to update in Supabase
    if (isSupabaseConfigured() && supabase) {
      try {
        const { error } = await supabase
          .from('videos')
          .update({
            title: video.title,
            description: video.description,
            video_url: video.video_url,
            youtube_id: video.youtube_url ? extractYouTubeId(video.youtube_url) : null,
            thumbnail: video.thumbnail_url,
            thumbnail_url: video.thumbnail_url,
            category: video.category,
            is_live: video.featured,
            featured: video.featured,
            duration: video.duration,
            updated_at: new Date().toISOString()
          })
          .eq('id', video.id)

        if (error) console.error('Supabase update error:', error)
      } catch (e) {
        console.error('Supabase update error:', e)
      }
    }

    return NextResponse.json({ video, success: true })
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    console.error('Error updating video:', error)
    return NextResponse.json({ error: errorMessage }, { status: 500 })
  }
}

// DELETE - Remove video
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json({ error: 'Video ID required' }, { status: 400 })
    }

    // Remove from local store
    videosStore = videosStore.filter(v => v.id !== id)

    // Try to delete from Supabase
    if (isSupabaseConfigured() && supabase) {
      try {
        const { error } = await supabase
          .from('videos')
          .delete()
          .eq('id', id)

        if (error) console.error('Supabase delete error:', error)
      } catch (e) {
        console.error('Supabase delete error:', e)
      }
    }

    return NextResponse.json({ success: true })
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    console.error('Error deleting video:', error)
    return NextResponse.json({ error: errorMessage }, { status: 500 })
  }
}

// Helper to extract YouTube ID from URL
function extractYouTubeId(url: string): string | null {
  if (!url) return null
  const match = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\s?]+)/)
  return match ? match[1] : null
}
