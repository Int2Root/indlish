import { ImageResponse } from 'next/og';
import { NextRequest } from 'next/server';

export const runtime = 'edge';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const title = searchParams.get('title') ?? 'Write. Organize. Curate.';
  const subtitle = searchParams.get('subtitle') ?? 'India ka apna creator platform';

  return new ImageResponse(
    (
      <div
        style={{
          background: '#0a0a0f',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
          justifyContent: 'center',
          padding: '80px',
          fontFamily: 'sans-serif',
          position: 'relative',
        }}
      >
        {/* Radial glow decoration */}
        <div
          style={{
            position: 'absolute',
            top: '-80px',
            right: '-80px',
            width: '500px',
            height: '500px',
            background: 'radial-gradient(circle, rgba(249,115,22,0.18) 0%, transparent 65%)',
            display: 'flex',
          }}
        />
        {/* Brand wordmark */}
        <div
          style={{
            color: '#f97316',
            fontSize: 64,
            fontWeight: 800,
            marginBottom: 36,
            letterSpacing: '-2px',
            display: 'flex',
          }}
        >
          indlish
        </div>
        {/* Title */}
        <div
          style={{
            color: '#ffffff',
            fontSize: title.length > 55 ? 40 : 52,
            fontWeight: 700,
            lineHeight: 1.2,
            marginBottom: 28,
            maxWidth: '960px',
            display: 'flex',
          }}
        >
          {title}
        </div>
        {/* Subtitle */}
        <div
          style={{
            color: '#9ca3af',
            fontSize: 26,
            fontWeight: 400,
            display: 'flex',
          }}
        >
          {subtitle}
        </div>
        {/* Domain stamp */}
        <div
          style={{
            position: 'absolute',
            bottom: 60,
            right: 80,
            color: '#374151',
            fontSize: 22,
            display: 'flex',
          }}
        >
          indlish.com
        </div>
      </div>
    ),
    { width: 1200, height: 630 }
  );
}
