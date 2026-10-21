import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import {
  ACCESSORIES,
  BASE_PRICE,
  BODY_COLORS,
  DEFAULT_CONFIG,
  DESTINATION_FEE,
  EXTRA_OPTIONS,
  INTERIOR_COLORS,
  ORDER_DEPOSIT,
  WHEEL_OPTIONS,
  type BodyColor,
  type CarConfiguration,
  type InteriorColor,
  type WheelOption,
} from '@/types/config'

type Pricing = {
  paint: number
  wheels: number
  interior: number
  extras: number
  accessories: number
  destination: number
  subtotal: number
  dueToday: number
}

type ConfigContextValue = {
  config: CarConfiguration
  bodyColor: BodyColor
  wheel: WheelOption
  interiorColor: InteriorColor
  extraIds: string[]
  pricing: Pricing
  setBodyColor: (id: string) => void
  setWheel: (id: string) => void
  setInteriorColor: (id: string) => void
  toggleExtra: (id: string) => void
  hasExtra: (id: string) => boolean
  reset: () => void
}

const ConfigContext = createContext<ConfigContextValue | null>(null)

export function ConfigProvider({ children }: { children: ReactNode }) {
  const [config, setConfig] = useState<CarConfiguration>(DEFAULT_CONFIG)

  const bodyColor = useMemo(
    () => BODY_COLORS.find((c) => c.id === config.bodyColorId) ?? BODY_COLORS[0],
    [config.bodyColorId],
  )

  const wheel = useMemo(
    () => WHEEL_OPTIONS.find((w) => w.id === config.wheelId) ?? WHEEL_OPTIONS[0],
    [config.wheelId],
  )

  const interiorColor = useMemo(
    () => INTERIOR_COLORS.find((c) => c.id === config.interiorColorId) ?? INTERIOR_COLORS[0],
    [config.interiorColorId],
  )

  const extraIds = config.extraIds

  const pricing = useMemo(() => {
    const extraSet = new Set(extraIds)
    const extras = EXTRA_OPTIONS.filter((e) => extraSet.has(e.id)).reduce((s, e) => s + e.price, 0)
    const accessories = ACCESSORIES.filter((e) => extraSet.has(e.id)).reduce((s, e) => s + e.price, 0)
    const paint = bodyColor.price ?? 0
    const wheels = wheel.price ?? 0
    const interior = interiorColor.price ?? 0
    const subtotal = BASE_PRICE + paint + wheels + interior + extras + accessories + DESTINATION_FEE
    return {
      paint,
      wheels,
      interior,
      extras,
      accessories,
      destination: DESTINATION_FEE,
      subtotal,
      dueToday: ORDER_DEPOSIT,
    }
  }, [bodyColor, wheel, interiorColor, extraIds])

  const setBodyColor = useCallback((id: string) => {
    setConfig((prev) => ({ ...prev, bodyColorId: id }))
  }, [])

  const setWheel = useCallback((id: string) => {
    setConfig((prev) => ({ ...prev, wheelId: id }))
  }, [])

  const setInteriorColor = useCallback((id: string) => {
    setConfig((prev) => ({ ...prev, interiorColorId: id }))
  }, [])

  const toggleExtra = useCallback((id: string) => {
    setConfig((prev) => {
      const on = prev.extraIds.includes(id)
      return {
        ...prev,
        extraIds: on ? prev.extraIds.filter((x) => x !== id) : [...prev.extraIds, id],
      }
    })
  }, [])

  const hasExtra = useCallback((id: string) => extraIds.includes(id), [extraIds])

  const reset = useCallback(() => setConfig(DEFAULT_CONFIG), [])

  const value = useMemo(
    () => ({
      config,
      bodyColor,
      wheel,
      interiorColor,
      extraIds,
      pricing,
      setBodyColor,
      setWheel,
      setInteriorColor,
      toggleExtra,
      hasExtra,
      reset,
    }),
    [
      config,
      bodyColor,
      wheel,
      interiorColor,
      extraIds,
      pricing,
      setBodyColor,
      setWheel,
      setInteriorColor,
      toggleExtra,
      hasExtra,
      reset,
    ],
  )

  return <ConfigContext.Provider value={value}>{children}</ConfigContext.Provider>
}

export function useConfig() {
  const ctx = useContext(ConfigContext)
  if (!ctx) throw new Error('useConfig must be used within ConfigProvider')
  return ctx
}
