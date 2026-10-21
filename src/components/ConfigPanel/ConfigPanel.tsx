import {
  ACCESSORIES,
  BASE_PRICE,
  BODY_COLORS,
  EXTRA_OPTIONS,
  INTERIOR_COLORS,
  ORDER_DEPOSIT,
  VEHICLE,
  WHEEL_OPTIONS,
  formatMoney,
  priceLabel,
} from '@/types/config'
import { useConfig } from '@/context/ConfigContext'

export function ConfigPanel() {
  const {
    bodyColor,
    wheel,
    interiorColor,
    pricing,
    setBodyColor,
    setWheel,
    setInteriorColor,
    toggleExtra,
    hasExtra,
  } = useConfig()

  return (
    <aside className="config-panel">
      <div className="config-scroll">
        <header className="vehicle-intro">
          <p className="vehicle-kicker">{VEHICLE.trim}</p>
          <h1 className="vehicle-name">{VEHICLE.name}</h1>
          <p className="vehicle-lead">{VEHICLE.tagline}</p>
          <p className="vehicle-spec">{VEHICLE.engine}</p>
          <p className="vehicle-spec">{VEHICLE.power} · {VEHICLE.accel}</p>
          <p className="vehicle-spec">{VEHICLE.drivetrain} · {VEHICLE.fuel}</p>
          <p className="vehicle-spec">{VEHICLE.tank}</p>
        </header>

        <section className="config-block">
          <h2 className="block-title">Exterior</h2>

          <div className="choice">
            <div className="choice-head">
              <div>
                <p className="choice-name">{bodyColor.name}</p>
                <p className="choice-sub">Paint</p>
              </div>
              <span className="choice-price">{priceLabel(bodyColor.price)}</span>
            </div>
            <div className="swatch-row" role="listbox" aria-label="Body color">
              {BODY_COLORS.map((c) => (
                <button
                  key={c.id}
                  type="button"
                  role="option"
                  aria-selected={bodyColor.id === c.id}
                  className={`swatch ${bodyColor.id === c.id ? 'is-active' : ''}`}
                  style={{ background: c.hex }}
                  title={c.name}
                  onClick={() => setBodyColor(c.id)}
                />
              ))}
            </div>
          </div>

          <div className="choice">
            <div className="choice-head">
              <div>
                <p className="choice-name">{wheel.name}</p>
                <p className="choice-sub">{wheel.subtitle}</p>
              </div>
              <span className="choice-price">{priceLabel(wheel.price)}</span>
            </div>
            <div className="swatch-row" role="listbox" aria-label="Wheels">
              {WHEEL_OPTIONS.map((w) => (
                <button
                  key={w.id}
                  type="button"
                  role="option"
                  aria-selected={wheel.id === w.id}
                  className={`swatch ${wheel.id === w.id ? 'is-active' : ''}`}
                  style={{
                    background: `radial-gradient(circle at 40% 35%, ${w.rimColor} 0%, #111 70%)`,
                  }}
                  title={w.name}
                  onClick={() => setWheel(w.id)}
                />
              ))}
            </div>
          </div>
        </section>

        <section className="config-block">
          <h2 className="block-title">Interior</h2>
          <div className="choice">
            <div className="choice-head">
              <div>
                <p className="choice-name">{interiorColor.name}</p>
                <p className="choice-sub">{interiorColor.subtitle}</p>
              </div>
              <span className="choice-price">{priceLabel(interiorColor.price)}</span>
            </div>
            <div className="swatch-row" role="listbox" aria-label="Interior">
              {INTERIOR_COLORS.map((c) => (
                <button
                  key={c.id}
                  type="button"
                  role="option"
                  aria-selected={interiorColor.id === c.id}
                  className={`swatch swatch-lg ${interiorColor.id === c.id ? 'is-active' : ''}`}
                  style={{
                    background: `linear-gradient(135deg, ${c.primary} 50%, ${c.contrast} 50%)`,
                  }}
                  title={c.name}
                  onClick={() => setInteriorColor(c.id)}
                />
              ))}
            </div>
          </div>
          <p className="choice-note">{VEHICLE.seats}</p>
          <p className="choice-note">{VEHICLE.cargo}</p>
        </section>

        <section className="config-block">
          <h2 className="block-title">Ownership</h2>
          <p className="choice-note">{VEHICLE.warranty}</p>
          <p className="choice-note">{VEHICLE.service}</p>
          <p className="choice-note">
            Factory gasoline powertrain. Estimated figures may vary with driving style, load and climate.
          </p>
        </section>

        <section className="config-block">
          <h2 className="block-title">Packages</h2>
          <div className="check-list">
            {EXTRA_OPTIONS.map((item) => (
              <button
                key={item.id}
                type="button"
                className={`check-row ${hasExtra(item.id) ? 'is-on' : ''}`}
                onClick={() => toggleExtra(item.id)}
              >
                <span className="check-box" aria-hidden />
                <span className="check-copy">
                  <span className="check-name">{item.name}</span>
                  {item.subtitle && <span className="check-sub">{item.subtitle}</span>}
                </span>
                <span className="check-price">{formatMoney(item.price)}</span>
              </button>
            ))}
          </div>
        </section>

        <section className="config-block">
          <h2 className="block-title">Accessories</h2>
          <div className="check-list">
            {ACCESSORIES.map((item) => (
              <button
                key={item.id}
                type="button"
                className={`check-row ${hasExtra(item.id) ? 'is-on' : ''}`}
                onClick={() => toggleExtra(item.id)}
              >
                <span className="check-box" aria-hidden />
                <span className="check-copy">
                  <span className="check-name">{item.name}</span>
                </span>
                <span className="check-price">{formatMoney(item.price)}</span>
              </button>
            ))}
          </div>
        </section>
      </div>

      <footer className="price-dock">
        <div className="price-row">
          <div>
            <p className="price-label">Est. Purchase Price</p>
            <p className="price-hint">Includes destination fee · from {formatMoney(BASE_PRICE)}</p>
          </div>
          <p className="price-value">{formatMoney(pricing.subtotal)}</p>
        </div>
        <div className="price-breakdown">
          {pricing.paint > 0 && (
            <p>
              <span>Paint</span>
              <span>{formatMoney(pricing.paint)}</span>
            </p>
          )}
          {pricing.wheels > 0 && (
            <p>
              <span>Wheels</span>
              <span>{formatMoney(pricing.wheels)}</span>
            </p>
          )}
          {pricing.interior > 0 && (
            <p>
              <span>Interior</span>
              <span>{formatMoney(pricing.interior)}</span>
            </p>
          )}
          {pricing.extras > 0 && (
            <p>
              <span>Packages</span>
              <span>{formatMoney(pricing.extras)}</span>
            </p>
          )}
          {pricing.accessories > 0 && (
            <p>
              <span>Accessories</span>
              <span>{formatMoney(pricing.accessories)}</span>
            </p>
          )}
          <p>
            <span>Destination</span>
            <span>{formatMoney(pricing.destination)}</span>
          </p>
          <p>
            <span>Sales tax</span>
            <span>Pending</span>
          </p>
        </div>
        <div className="price-row price-due">
          <div>
            <p className="price-label">Due Today</p>
            <p className="price-hint">Order deposit · {formatMoney(ORDER_DEPOSIT)}</p>
          </div>
          <p className="price-value">{formatMoney(pricing.dueToday)}</p>
        </div>
        <button type="button" className="btn-primary">
          Order
        </button>
      </footer>
    </aside>
  )
}
