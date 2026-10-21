export type Priced = {
  price?: number
}

export type BodyColor = Priced & {
  id: string
  name: string
  hex: string
  metalness?: number
  roughness?: number
}

export type WheelOption = Priced & {
  id: string
  name: string
  subtitle?: string
  rimColor: string
  metalness?: number
  roughness?: number
}

export type InteriorColor = Priced & {
  id: string
  name: string
  subtitle?: string
  primary: string
  contrast: string
}

export type ExtraOption = {
  id: string
  name: string
  subtitle?: string
  price: number
}

export type CarConfiguration = {
  bodyColorId: string
  wheelId: string
  interiorColorId: string
  extraIds: string[]
}

export const VEHICLE = {
  name: 'X90',
  trim: 'Premium',
  tagline: 'A family SUV built for long trips, city traffic and weekend cargo — without the EV charging wait.',
  engine: '2.0L Turbo · 8-speed automatic',
  power: '245 hp · 350 Nm',
  accel: '0–100 km/h in 8.6 s',
  drivetrain: 'Front-wheel drive',
  fuel: 'Gasoline · 8.4 L/100 km combined',
  tank: '70 L fuel tank · ~830 km highway range',
  seats: '7-seat layout · 60/40 split third row',
  cargo: '235 L behind the third row · 1,870 L with seats folded',
  warranty: '5-year / 150,000 km limited warranty',
  service: 'First 2 scheduled services included',
}

export const BASE_PRICE = 31190
export const DESTINATION_FEE = 1030
export const ORDER_DEPOSIT = 200

export const BODY_COLORS: BodyColor[] = [
  { id: 'pearl-white', name: 'Pearl White', hex: '#F2F0EB', metalness: 0.35, roughness: 0.22, price: 0 },
  { id: 'graphite', name: 'Graphite', hex: '#3A3D42', metalness: 0.55, roughness: 0.32, price: 0 },
  { id: 'burgundy', name: 'Burgundy', hex: '#6B1D2A', metalness: 0.5, roughness: 0.28, price: 640 },
  { id: 'black', name: 'Solid Black', hex: '#2A2A2A', metalness: 0.6, roughness: 0.28, price: 0 },
]

export const WHEEL_OPTIONS: WheelOption[] = [
  {
    id: 'black',
    name: '18" Sport Black',
    subtitle: 'All-season tires',
    rimColor: '#3A3A3A',
    metalness: 0.5,
    roughness: 0.36,
    price: 0,
  },
  {
    id: 'graphite',
    name: '19" Graphite Alloy',
    subtitle: 'All-season tires',
    rimColor: '#5A5A5A',
    metalness: 0.65,
    roughness: 0.3,
    price: 520,
  },
  {
    id: 'chrome',
    name: '20" Chrome',
    subtitle: 'Performance tires',
    rimColor: '#D0D0D0',
    metalness: 0.95,
    roughness: 0.12,
    price: 960,
  },
]

export const INTERIOR_COLORS: InteriorColor[] = [
  { id: 'black', name: 'Black / Ivory', subtitle: 'Leatherette', primary: '#1C1C1C', contrast: '#E4DCD0', price: 0 },
  { id: 'ivory', name: 'Ivory / Black', subtitle: 'Leatherette', primary: '#E8E0D4', contrast: '#1C1C1C', price: 360 },
  { id: 'burgundy', name: 'Burgundy / Black', subtitle: 'Nappa leather', primary: '#5C1A24', contrast: '#1C1C1C', price: 760 },
  { id: 'ivory-burgundy', name: 'Ivory / Burgundy', subtitle: 'Nappa leather', primary: '#EDE6DC', contrast: '#5C1A24', price: 760 },
]

export const EXTRA_OPTIONS: ExtraOption[] = [
  { id: 'awd', name: 'All-Wheel Drive', subtitle: 'On-demand AWD with terrain modes', price: 1920 },
  { id: 'sunroof', name: 'Panoramic Sunroof', subtitle: 'Power sunshade included', price: 880 },
  { id: 'tow', name: 'Tow Hitch', subtitle: 'Tow up to 1,500 kg with class II bar', price: 600 },
  { id: 'audio', name: 'Premium Audio', subtitle: '12-speaker system', price: 440 },
  { id: 'adas', name: 'Driver Assistance', subtitle: 'Adaptive cruise, lane keep, 360° camera', price: 960 },
]

export const ACCESSORIES: ExtraOption[] = [
  { id: 'mats', name: 'All-Weather Interior Liners', price: 190 },
  { id: 'trunk', name: 'Cargo Liner', price: 70 },
  { id: 'rails', name: 'Roof Rails', price: 300 },
  { id: 'rack', name: 'Roof Rack', price: 400 },
  { id: 'kit', name: 'Roadside Kit', price: 70 },
]

export const DEFAULT_CONFIG: CarConfiguration = {
  bodyColorId: BODY_COLORS[0].id,
  wheelId: WHEEL_OPTIONS[0].id,
  interiorColorId: INTERIOR_COLORS[0].id,
  extraIds: [],
}

export const MODEL_PARTS = {
  body: ['CarPaint'],
  interiorPrimary: ['Int_Leather'],
  interiorSeatAccent: ['Int_Leather_2'],
  interiorContrast: ['Int_cloth', 'Int_Roof', 'Int_Plastic_Col'],
  rims: ['rim_Black', 'rim_Metal', 'rim_Chrome'],
  brakes: ['breaaks', 'break', 'brake'],
} as const

export const BRAKE_FINISH = {
  hex: '#2F3134',
  metalness: 0.72,
  roughness: 0.38,
} as const

export function formatMoney(value: number) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(value)
}

export function priceLabel(price = 0) {
  return price > 0 ? formatMoney(price) : 'Included'
}
