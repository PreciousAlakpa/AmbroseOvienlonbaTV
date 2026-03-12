import { NextRequest, NextResponse } from 'next/server'

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

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

// Helper function for direct Supabase REST API calls
async function supabaseRequest(table: string, options: {
  method?: string;
  body?: object;
  query?: string;
} = {}) {
  const { method = 'GET', body, query = '' } = options
  
  const headers: Record<string, string> = {
    'apikey': SUPABASE_ANON_KEY,
    'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
    'Content-Type': 'application/json'
  }
  
  if (method === 'POST' || method === 'PATCH') {
    headers['Prefer'] = 'return=representation'
  }
  
  const response = await fetch(`${SUPABASE_URL}/rest/v1/${table}${query}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined
  })
  
  if (!response.ok) {
    const error = await response.text()
    console.error(`Supabase ${method} error:`, error)
    return { error, data: null }
  }
  
  const data = method !== 'DELETE' ? await response.json() : null
  return { data, error: null }
}

// GET - Fetch all videos
export async function GET() {
  if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
    return NextResponse.json({ videos: videosStore, message: 'Using local storage' })
  }

  try {
    const { data, error } = await supabaseRequest('videos', {
      query: '?select=*&order=created_at.desc'
    })

    if (error || !data) {
      console.error('GET videos error:', error)
      return NextResponse.json({ videos: videosStore })
    }

    // Map to frontend format
    const videos = (data as Array<Record<string, unknown>>).map((v) => ({
      id: v.id as string,
      title: v.title as string,
      description: v.description as string,
      video_url: v.video_url as string,
      youtube_url: v.youtube_url as string,
      thumbnail_url: v.thumbnail_url as string,
      category: (v.category as string) || 'General',
      featured: (v.featured as boolean) || false,
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

    // Save to Supabase
    if (SUPABASE_URL && SUPABASE_ANON_KEY) {
      const { error } = await supabaseRequest('videos', {
        method: 'POST',
        body: {
          id: video.id,
          title: video.title,
          description: video.description,
          video_url: video.video_url,
          youtube_url: video.youtube_url,
          thumbnail_url: video.thumbnail_url,
          category: video.category,
          featured: video.featured,
          duration: video.duration
        }
      })

      if (error) console.error('Supabase insert error:', error)
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

    // Update in Supabase
    if (SUPABASE_URL && SUPABASE_ANON_KEY) {
      const { error } = await supabaseRequest('videos', {
        method: 'PATCH',
        query: `?id=eq.${video.id}`,
        body: {
          title: video.title,
          description: video.description,
          video_url: video.video_url,
          youtube_url: video.youtube_url,
          thumbnail_url: video.thumbnail_url,
          category: video.category,
          featured: video.featured,
          duration: video.duration,
          updated_at: new Date().toISOString()
        }
      })

      if (error) console.error('Supabase update error:', error)
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

    // Delete from Supabase
    if (SUPABASE_URL && SUPABASE_ANON_KEY) {
      const { error } = await supabaseRequest('videos', {
        method: 'DELETE',
        query: `?id=eq.${id}`
      })

      if (error) console.error('Supabase delete error:', error)
    }

    return NextResponse.json({ success: true })
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    console.error('Error deleting video:', error)
    return NextResponse.json({ error: errorMessage }, { status: 500 })
  }
}
