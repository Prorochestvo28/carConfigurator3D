import { useMemo } from 'react'
import { useConfig } from '@/context/ConfigContext'

/** Fallback geometry when the GLB model fails to load */
export function PlaceholderCar() {
  const { bodyColor, wheel, interiorColor } = useConfig()

  const paint = useMemo(
    () => ({
      color: bodyColor.hex,
      metalness: bodyColor.metalness ?? 0.6,
      roughness: bodyColor.roughness ?? 0.3,
    }),
    [bodyColor],
  )

  const rimScale = wheel.id === 'chrome' ? 1.06 : wheel.id === 'graphite' ? 1.03 : 1

  return (
    <group position={[0, 0, 0]} rotation={[0, Math.PI * 0.15, 0]}>
      {/* Body */}
      <mesh castShadow receiveShadow position={[0, 0.55, 0]}>
        <boxGeometry args={[2.2, 0.45, 4.4]} />
        <meshStandardMaterial {...paint} />
      </mesh>

      {/* Cabin */}
      <mesh castShadow position={[0, 0.95, -0.15]}>
        <boxGeometry args={[1.9, 0.55, 2.2]} />
        <meshStandardMaterial color={interiorColor.primary} roughness={0.75} metalness={0.05} />
      </mesh>
      <mesh castShadow position={[0, 0.88, 0.15]}>
        <boxGeometry args={[1.7, 0.22, 0.55]} />
        <meshStandardMaterial color={interiorColor.contrast} roughness={0.7} metalness={0.05} />
      </mesh>

      {/* Roof / glass */}
      <mesh castShadow position={[0, 1.15, -0.1]}>
        <boxGeometry args={[1.85, 0.08, 2.0]} />
        <meshStandardMaterial color="#0a1520" metalness={0.9} roughness={0.1} transparent opacity={0.55} />
      </mesh>

      {/* Hood */}
      <mesh castShadow position={[0, 0.72, 1.35]}>
        <boxGeometry args={[2.05, 0.12, 1.1]} />
        <meshStandardMaterial {...paint} />
      </mesh>

      {/* Trunk */}
      <mesh castShadow position={[0, 0.72, -1.55]}>
        <boxGeometry args={[2.05, 0.12, 0.9]} />
        <meshStandardMaterial {...paint} />
      </mesh>

      <Wheel position={[-0.95, 0.35, 1.35]} rimColor={wheel.rimColor} scale={rimScale} style={wheel.id} />
      <Wheel position={[0.95, 0.35, 1.35]} rimColor={wheel.rimColor} scale={rimScale} style={wheel.id} />
      <Wheel position={[-0.95, 0.35, -1.45]} rimColor={wheel.rimColor} scale={rimScale} style={wheel.id} />
      <Wheel position={[0.95, 0.35, -1.45]} rimColor={wheel.rimColor} scale={rimScale} style={wheel.id} />
    </group>
  )
}

function Wheel({
  position,
  rimColor,
  scale,
  style,
}: {
  position: [number, number, number]
  rimColor: string
  scale: number
  style: string
}) {
  const spokeCount = style === 'graphite' ? 7 : style === 'chrome' ? 10 : 5

  return (
    <group position={position} scale={scale}>
      <mesh rotation={[0, 0, Math.PI / 2]} castShadow>
        <cylinderGeometry args={[0.35, 0.35, 0.28, 32]} />
        <meshStandardMaterial color="#111" roughness={0.9} />
      </mesh>
      <mesh rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.18, 0.18, 0.3, 24]} />
        <meshStandardMaterial
          color={rimColor}
          metalness={style === 'chrome' ? 0.95 : 0.7}
          roughness={style === 'chrome' ? 0.15 : 0.35}
        />
      </mesh>
      {Array.from({ length: spokeCount }).map((_, i) => {
        const angle = (i / spokeCount) * Math.PI * 2
        return (
          <mesh
            key={i}
            position={[Math.sin(angle) * 0.12, Math.cos(angle) * 0.12, 0]}
            rotation={[0, 0, -angle]}
          >
            <boxGeometry args={[0.04, 0.22, 0.06]} />
            <meshStandardMaterial color={rimColor} metalness={0.8} roughness={0.25} />
          </mesh>
        )
      })}
    </group>
  )
}
