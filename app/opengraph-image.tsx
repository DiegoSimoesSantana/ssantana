import { ImageResponse } from 'next/og'

export const runtime = 'edge'

export const alt = 'Studio Santana - Engenharia de Software com AI'
export const size = {
  width: 1200,
  height: 630,
}

export const contentType = 'image/png'

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          fontSize: 60,
          background: 'linear-gradient(to bottom right, #1e40af, #7c3aed)',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white',
          fontFamily: 'sans-serif',
        }}
      >
        <div style={{ display: 'flex', marginBottom: 40 }}>
          🚀
        </div>
        <div style={{ fontWeight: 'bold', marginBottom: 20 }}>
          Studio Santana
        </div>
        <div style={{ fontSize: 30, opacity: 0.9 }}>
          Engenharia de Software com IA
        </div>
        <div style={{ fontSize: 24, marginTop: 20, opacity: 0.8 }}>
          Entrega em 5 dias úteis
        </div>
      </div>
    ),
    {
      ...size,
    }
  )
}
