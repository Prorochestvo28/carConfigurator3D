import { useEffect, useMemo } from 'react'
import { useGLTF } from '@react-three/drei'
import * as THREE from 'three'
import { mergeVertices } from 'three/examples/jsm/utils/BufferGeometryUtils.js'
import { useConfig } from '@/context/ConfigContext'
import { BRAKE_FINISH, MODEL_PARTS } from '@/types/config'

const MODEL_URL = '/models/car.glb'
const TARGET_LENGTH = 4.8

type LoadedCarProps = {
  url?: string
}

function nameMatches(name: string, patterns: readonly string[]) {
  const lower = name.toLowerCase()
  return patterns.some((p) => lower.includes(p.toLowerCase()))
}

function paintStandard(
  mat: THREE.Material,
  hex: string,
  extras?: { metalness?: number; roughness?: number; dropMap?: boolean },
) {
  if (!(mat instanceof THREE.MeshStandardMaterial || mat instanceof THREE.MeshPhysicalMaterial)) {
    return
  }
  mat.color.set(hex)
  if (extras?.metalness != null) mat.metalness = extras.metalness
  if (extras?.roughness != null) mat.roughness = extras.roughness
  if (extras?.dropMap) {
    mat.map = null
    mat.emissive?.set('#000000')
    mat.emissiveIntensity = 0
  }
  mat.needsUpdate = true
}

const SKIP_SMOOTH = /glass|window|mirror|light|emiss/i

function toPaintMaterial(mat: THREE.MeshStandardMaterial) {
  if (mat instanceof THREE.MeshPhysicalMaterial) {
    mat.clearcoat = 0.85
    mat.clearcoatRoughness = 0.16
    return mat
  }
  const phys = new THREE.MeshPhysicalMaterial()
  phys.copy(mat)
  phys.clearcoat = 0.85
  phys.clearcoatRoughness = 0.16
  phys.flatShading = false
  return phys
}

function polishMesh(mesh: THREE.Mesh) {
  const label = `${mesh.name} ${
    Array.isArray(mesh.material)
      ? mesh.material.map((m) => m.name).join(' ')
      : mesh.material?.name ?? ''
  }`

  if (mesh.geometry instanceof THREE.BufferGeometry && !SKIP_SMOOTH.test(label)) {
    const smoothed = mergeVertices(mesh.geometry, 1e-4)
    smoothed.computeVertexNormals()
    mesh.geometry = smoothed
  }

  const upgrade = (mat: THREE.Material) => {
    if (!(mat instanceof THREE.MeshStandardMaterial || mat instanceof THREE.MeshPhysicalMaterial)) {
      return mat
    }
    mat.flatShading = false
    for (const tex of [mat.map, mat.normalMap, mat.roughnessMap, mat.metalnessMap, mat.aoMap]) {
      if (!tex) continue
      tex.anisotropy = 8
      tex.generateMipmaps = true
      tex.minFilter = THREE.LinearMipmapLinearFilter
      tex.magFilter = THREE.LinearFilter
      tex.needsUpdate = true
    }
    if (nameMatches(label, MODEL_PARTS.body)) {
      return toPaintMaterial(mat)
    }
    mat.needsUpdate = true
    return mat
  }

  if (Array.isArray(mesh.material)) {
    mesh.material = mesh.material.map(upgrade)
  } else if (mesh.material) {
    mesh.material = upgrade(mesh.material)
  }
}

function fitToGround(root: THREE.Object3D) {
  root.updateMatrixWorld(true)
  const box = new THREE.Box3().setFromObject(root)
  const size = box.getSize(new THREE.Vector3())
  const maxDim = Math.max(size.x, size.y, size.z) || 1
  root.scale.multiplyScalar(TARGET_LENGTH / maxDim)
  root.updateMatrixWorld(true)

  const fitted = new THREE.Box3().setFromObject(root)
  const center = fitted.getCenter(new THREE.Vector3())
  root.position.x -= center.x
  root.position.z -= center.z
  root.position.y -= fitted.min.y
}

export function LoadedCar({ url = MODEL_URL }: LoadedCarProps) {
  const { scene } = useGLTF(url)
  const { bodyColor, wheel, interiorColor } = useConfig()

  const cloned = useMemo(() => {
    const root = scene.clone(true)
    root.traverse((obj) => {
      if (!(obj instanceof THREE.Mesh)) return
      obj.castShadow = true
      obj.receiveShadow = true
      if (Array.isArray(obj.material)) {
        obj.material = obj.material.map((m) => m.clone())
      } else if (obj.material) {
        obj.material = obj.material.clone()
      }
      polishMesh(obj)
    })
    fitToGround(root)
    return root
  }, [scene])

  useEffect(() => {
    const paintMats = new Set<THREE.Material>()
    const interiorPrimaryMats = new Set<THREE.Material>()
    const interiorContrastMats = new Set<THREE.Material>()
    const rimMats = new Set<THREE.Material>()
    const brakeMats = new Set<THREE.Material>()

    cloned.traverse((obj) => {
      if (!(obj instanceof THREE.Mesh)) return

      const materials = Array.isArray(obj.material) ? obj.material : [obj.material]
      for (const mat of materials) {
        if (!mat) continue
        const label = `${obj.name} ${mat.name}`
        if (nameMatches(label, MODEL_PARTS.body)) paintMats.add(mat)
        if (nameMatches(label, MODEL_PARTS.interiorSeatAccent)) {
          interiorContrastMats.add(mat)
        } else if (nameMatches(label, MODEL_PARTS.interiorPrimary)) {
          interiorPrimaryMats.add(mat)
        }
        if (nameMatches(label, MODEL_PARTS.interiorContrast)) interiorContrastMats.add(mat)
        if (nameMatches(label, MODEL_PARTS.rims)) rimMats.add(mat)
        if (nameMatches(label, MODEL_PARTS.brakes)) brakeMats.add(mat)
      }
    })

    for (const mat of paintMats) {
      paintStandard(mat, bodyColor.hex, {
        metalness: bodyColor.metalness,
        roughness: bodyColor.roughness,
      })
    }

    for (const mat of interiorPrimaryMats) {
      paintStandard(mat, interiorColor.primary)
    }

    for (const mat of interiorContrastMats) {
      paintStandard(mat, interiorColor.contrast)
    }

    for (const mat of rimMats) {
      paintStandard(mat, wheel.rimColor, {
        metalness: wheel.metalness,
        roughness: wheel.roughness,
      })
    }

    for (const mat of brakeMats) {
      paintStandard(mat, BRAKE_FINISH.hex, {
        metalness: BRAKE_FINISH.metalness,
        roughness: BRAKE_FINISH.roughness,
        dropMap: true,
      })
    }
  }, [cloned, bodyColor, wheel, interiorColor])

  return <primitive object={cloned} />
}
