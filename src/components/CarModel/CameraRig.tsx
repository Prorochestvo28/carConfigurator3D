import { useLayoutEffect, type RefObject } from 'react'
import { useThree } from '@react-three/fiber'
import * as THREE from 'three'
import type { OrbitControls as OrbitControlsImpl } from 'three-stdlib'
import { ORBIT_HOME, type CameraView } from './cameraViews'

type CameraRigProps = {
  view: CameraView
  freeLook: boolean
  controlsRef: RefObject<OrbitControlsImpl | null>
}

function applyPose(
  camera: THREE.Camera,
  pose: CameraView,
  controls: OrbitControlsImpl | null,
) {
  camera.position.set(...pose.position)
  const target = new THREE.Vector3(...pose.target)
  camera.lookAt(target)
  if (camera instanceof THREE.PerspectiveCamera) {
    camera.fov = pose.fov ?? 32
    camera.updateProjectionMatrix()
  }
  if (controls) {
    controls.target.copy(target)
    controls.update()
  }
}

export function CameraRig({ view, freeLook, controlsRef }: CameraRigProps) {
  const { camera } = useThree()

  useLayoutEffect(() => {
    applyPose(camera, freeLook ? ORBIT_HOME : view, controlsRef.current)
  }, [camera, view, freeLook, controlsRef])

  return null
}
