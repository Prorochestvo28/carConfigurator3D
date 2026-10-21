import { Suspense, useCallback, useEffect, useState } from 'react'
import { useGLTF } from '@react-three/drei'
import { ConfigProvider } from '@/context/ConfigContext'
import { CarScene } from '@/components/CarModel/CarScene'
import { ConfigPanel } from '@/components/ConfigPanel/ConfigPanel'
import { Splash } from '@/components/Splash'

const MODEL_URL = `${import.meta.env.BASE_URL}models/car.glb`
const SHEEN_DURATION_MS = 2100
const SHEEN_CYCLES = 2

export default function App() {
  const [mountApp, setMountApp] = useState(false)
  const [splash, setSplash] = useState(true)
  const [fading, setFading] = useState(false)

  useEffect(() => {
    void fetch(MODEL_URL, { cache: 'force-cache' })
  }, [])

  useEffect(() => {
    const timer = window.setTimeout(() => setMountApp(true), SHEEN_DURATION_MS * SHEEN_CYCLES)
    return () => window.clearTimeout(timer)
  }, [])

  const handleReady = useCallback(() => {
    setFading(true)
    window.setTimeout(() => setSplash(false), 560)
  }, [])

  return (
    <ConfigProvider>
      {mountApp && (
        <Suspense fallback={null}>
          <BootedApp onReady={handleReady} />
        </Suspense>
      )}
      {splash && <Splash fading={fading} />}
    </ConfigProvider>
  )
}

function BootedApp({ onReady }: { onReady: () => void }) {
  useGLTF(MODEL_URL)

  useEffect(() => {
    let frame = 0
    const id = requestAnimationFrame(() => {
      frame = requestAnimationFrame(onReady)
    })
    return () => {
      cancelAnimationFrame(id)
      cancelAnimationFrame(frame)
    }
  }, [onReady])

  return (
    <div className="app-shell">
      <main className="preview-pane">
        <CarScene />
      </main>
      <ConfigPanel />
    </div>
  )
}
