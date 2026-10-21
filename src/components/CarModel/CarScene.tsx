import { Component, Suspense, useCallback, useRef, useState, type ReactNode } from 'react'
import { Canvas } from '@react-three/fiber'
import { ContactShadows, Environment, Html, OrbitControls, PerspectiveCamera } from '@react-three/drei'
import * as THREE from 'three'
import type { OrbitControls as OrbitControlsImpl } from 'three-stdlib'
import { PlaceholderCar } from './PlaceholderCar'
import { LoadedCar } from './LoadedCar'
import { CameraRig } from './CameraRig'
import { ViewSwitcher } from './ViewSwitcher'
import { CAMERA_VIEWS, ORBIT_HOME } from './cameraViews'

const USE_GLB_MODEL = true

function Loader() {
  return (
    <Html center>
      <div className="scene-loader">Loading model…</div>
    </Html>
  )
}

class ModelErrorBoundary extends Component<
  { children: ReactNode; onError: () => void },
  { hasError: boolean }
> {
  state = { hasError: false }

  static getDerivedStateFromError() {
    return { hasError: true }
  }

  componentDidCatch() {
    this.props.onError()
  }

  render() {
    if (this.state.hasError) return <PlaceholderCar />
    return this.props.children
  }
}

function SceneContent() {
  const [failed, setFailed] = useState(false)

  if (!USE_GLB_MODEL || failed) {
    return <PlaceholderCar />
  }

  return (
    <Suspense fallback={<Loader />}>
      <ModelErrorBoundary onError={() => setFailed(true)}>
        <LoadedCar />
      </ModelErrorBoundary>
    </Suspense>
  )
}

export function CarScene() {
  const [viewIndex, setViewIndex] = useState(0)
  const [freeLook, setFreeLook] = useState(false)
  const controlsRef = useRef<OrbitControlsImpl>(null)
  const view = CAMERA_VIEWS[viewIndex]

  const selectView = useCallback((index: number) => {
    setFreeLook(false)
    setViewIndex(index)
  }, [])

  return (
    <div className="scene-wrap">
      <Canvas
        shadows
        dpr={[1, 2]}
        gl={{
          antialias: true,
          toneMapping: THREE.ACESFilmicToneMapping,
          toneMappingExposure: 0.9975,
        }}
      >
        <color attach="background" args={['#f4f4f4']} />
        <fog attach="fog" args={['#f4f4f4', 12, 28]} />

        <PerspectiveCamera
          makeDefault
          position={view.position}
          fov={view.fov ?? 32}
          near={0.05}
          far={80}
        />
        <CameraRig view={view} freeLook={freeLook} controlsRef={controlsRef} />
        <OrbitControls
          ref={controlsRef}
          enabled={freeLook}
          enablePan={false}
          enableDamping
          dampingFactor={0.08}
          minPolarAngle={0.35}
          maxPolarAngle={Math.PI / 2.02}
          minDistance={0.45}
          maxDistance={12}
          target={freeLook ? ORBIT_HOME.target : view.target}
        />

        <ambientLight intensity={0.4275} />
        <directionalLight
          castShadow
          position={[5, 8, 4]}
          intensity={1.1875}
          shadow-mapSize={[2048, 2048]}
          shadow-bias={-0.0002}
        />
        <directionalLight position={[-4, 3, -2]} intensity={0.3325} color="#ffffff" />

        <Environment preset="studio" environmentIntensity={0.95} environmentRotation={[0, 0.15, 0]} />

        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
          <circleGeometry args={[8, 64]} />
          <meshStandardMaterial color="#ececec" roughness={0.95} metalness={0} />
        </mesh>

        <ContactShadows
          position={[0, 0.01, 0]}
          opacity={0.266}
          scale={12}
          blur={2.6}
          far={4}
          color="#3a1a20"
        />

        <SceneContent />
      </Canvas>

      <ViewSwitcher
        index={viewIndex}
        freeLook={freeLook}
        onChange={selectView}
        onToggleFree={() => setFreeLook((v) => !v)}
      />
    </div>
  )
}
