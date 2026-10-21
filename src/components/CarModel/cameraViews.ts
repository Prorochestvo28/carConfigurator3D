/**
 * Preset cameras.
 *
 * Axes (car sits at origin, nose toward +Z):
 *   x — left / right
 *   y — height
 *   z — back / front (+Z is the front of the car)
 *
 * position — where the camera stands
 * target   — the point it looks at
 * fov      — zoom (smaller = tighter)
 *
 * Orbit mode always starts from ORBIT_HOME.
 */
export type CameraView = {
  id: string
  label: string
  position: [number, number, number]
  target: [number, number, number]
  fov?: number
}

export const CAMERA_VIEWS: CameraView[] = [
  {
    id: 'front-quarter',
    label: 'Front three-quarter',
    position: [4.4, 1.65, 5.4],
    target: [0, 0.62, 0],
    fov: 32,
  },
  {
    id: 'side',
    label: 'Side',
    position: [6.8, 1.35, 0.15],
    target: [0, 0.62, 0],
    fov: 32,
  },
  {
    id: 'rear-quarter',
    label: 'Rear three-quarter',
    position: [4.0, 1.6, -5.2],
    target: [0, 0.62, 0],
    fov: 32,
  },
  {
    id: 'front',
    label: 'Front',
    position: [0, 1.45, 7.2],
    target: [0, 0.7, 0],
    fov: 34,
  },
  {
    id: 'dashboard',
    label: 'Dashboard',
    position: [0.56, 1.45, 0.18],
    target: [-0.48, 0.94, 1.25],
    fov: 82,
  },
  {
    id: 'rear-seats',
    label: 'Rear seats',
    position: [0.4, 1.2, -0.4],
    target: [-0.5, 1, -1.7],
    fov: 84,
  },
]

export const ORBIT_HOME: CameraView = CAMERA_VIEWS[0]
