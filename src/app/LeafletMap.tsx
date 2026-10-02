'use client'

import { useEffect, useRef } from 'react'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

interface JourneyStop {
  id: number
  name: string
  lat: number
  lng: number
  altitude: string
  date: string
  description: string
  icon: string
  phase: 'ida' | 'descubrimiento' | 'regreso' | 'retorno'
  distanceFromPrev?: string
}

const phaseColors: Record<string, string> = {
  ida: '#b48a50',
  descubrimiento: '#a84232',
  regreso: '#71618a',
  retorno: '#294b3f',
}

const phaseLabels: Record<string, string> = {
  ida: 'La subida',
  descubrimiento: 'Descubrimiento',
  regreso: 'Viaje al exterior',
  retorno: 'El retorno',
}

function escapeHtml(value: string) {
  const entities: Record<string, string> = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;',
  }
  return value.replace(/[&<>"']/g, (character) => entities[character])
}

function stopIcon(stop: JourneyStop, selected: boolean, offset: number) {
  return L.divIcon({
    className: `journey-map-marker${selected ? ' is-selected' : ''}`,
    html: `<span class="journey-map-marker-pin" style="--stop-color:${phaseColors[stop.phase]};--stop-ink:${stop.phase === 'ida' ? '#202a27' : '#fffdf7'}">
      <span class="journey-map-marker-number">${stop.id.toString().padStart(2, '0')}</span>
      <span class="journey-map-marker-symbol" aria-hidden="true">${escapeHtml(stop.icon)}</span>
    </span>`,
    iconSize: [42, 42],
    iconAnchor: [21 - offset, 21],
    popupAnchor: [offset, -22],
  })
}

export default function LeafletMap({
  stops,
  selectedStop,
  onSelectStop,
  activePhase,
}: {
  stops: JourneyStop[]
  selectedStop: JourneyStop | null
  onSelectStop: (stop: JourneyStop) => void
  activePhase: string
}) {
  const mapRef = useRef<HTMLDivElement>(null)
  const mapInstanceRef = useRef<L.Map | null>(null)
  const markersRef = useRef<L.LayerGroup | null>(null)
  const polylinesRef = useRef<L.LayerGroup | null>(null)
  const stopMarkersRef = useRef(new Map<number, { marker: L.Marker; offset: number }>())
  const renderedStopsRef = useRef('')
  const focusedStopRef = useRef('')
  const onSelectStopRef = useRef(onSelectStop)

  useEffect(() => {
    onSelectStopRef.current = onSelectStop
  }, [onSelectStop])

  useEffect(() => {
    if (!mapRef.current || mapInstanceRef.current) return

    const map = L.map(mapRef.current, {
      center: [-30, -65],
      zoom: 5,
      zoomControl: false,
      scrollWheelZoom: false,
    })

    L.control.zoom({ position: 'bottomright', zoomInTitle: 'Acercar', zoomOutTitle: 'Alejar' }).addTo(map)

    const standard = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors',
      maxZoom: 18,
    }).addTo(map)

    const terrain = L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenTopoMap contributors',
      maxZoom: 17,
    })

    L.control.layers({ 'Mapa estándar': standard, 'Terreno': terrain }, {}).addTo(map)

    polylinesRef.current = L.layerGroup().addTo(map)
    markersRef.current = L.layerGroup().addTo(map)
    mapInstanceRef.current = map

    const resizeObserver = new ResizeObserver(() => map.invalidateSize({ pan: false }))
    resizeObserver.observe(mapRef.current)

    return () => {
      resizeObserver.disconnect()
      map.remove()
      mapInstanceRef.current = null
      markersRef.current = null
      polylinesRef.current = null
      stopMarkersRef.current.clear()
      renderedStopsRef.current = ''
      focusedStopRef.current = ''
    }
  }, [])

  useEffect(() => {
    const map = mapInstanceRef.current
    const markers = markersRef.current
    const polylines = polylinesRef.current
    if (!map || !markers || !polylines) return

    // Parent renders can create an equivalent array. Keep the user's map position.
    const stopsKey = JSON.stringify(stops)
    if (renderedStopsRef.current === stopsKey) return
    renderedStopsRef.current = stopsKey
    markers.clearLayers()
    polylines.clearLayers()
    stopMarkersRef.current.clear()

    for (let index = 0; index < stops.length - 1; index++) {
      const current = stops[index]
      const next = stops[index + 1]
      const points: L.LatLngExpression[] = [[current.lat, current.lng], [next.lat, next.lng]]

      L.polyline(points, {
        color: '#fffdf7',
        weight: 7,
        opacity: 0.85,
        interactive: false,
      }).addTo(polylines)

      L.polyline(points, {
        color: phaseColors[current.phase],
        weight: 3,
        opacity: 0.88,
        dashArray: '7, 8',
        lineCap: 'round',
        interactive: false,
      }).addTo(polylines)
    }

    stops.forEach((stop) => {
      // Some moments share a location. Separate their pins without moving the data.
      const sharedLocation = stops.filter((candidate) => candidate.lat === stop.lat && candidate.lng === stop.lng)
      const offset = (sharedLocation.findIndex((candidate) => candidate.id === stop.id) - (sharedLocation.length - 1) / 2) * 34
      const color = phaseColors[stop.phase]
      const marker = L.marker([stop.lat, stop.lng], {
        icon: stopIcon(stop, false, offset),
        title: `${stop.id}. ${stop.name}`,
        alt: stop.name,
        keyboard: true,
        riseOnHover: true,
      }).addTo(markers)

      marker.bindPopup(`
        <article class="journey-map-popup-content" style="--stop-color:${color}">
          <div class="journey-map-popup-heading">
            <span class="journey-map-popup-icon" aria-hidden="true">${escapeHtml(stop.icon)}</span>
            <div>
              <strong class="journey-map-popup-title">${escapeHtml(stop.name)}</strong>
              <span class="journey-map-popup-meta">${escapeHtml(stop.altitude)} · ${escapeHtml(stop.date)}</span>
            </div>
          </div>
          <p class="journey-map-popup-description">${escapeHtml(stop.description)}</p>
          ${stop.distanceFromPrev ? `<p class="journey-map-popup-distance">📏 ${escapeHtml(stop.distanceFromPrev)}</p>` : ''}
          <span class="journey-map-popup-phase">${phaseLabels[stop.phase]}</span>
        </article>
      `, {
        className: 'journey-map-popup',
        minWidth: 210,
        maxWidth: 290,
        maxHeight: 260,
        autoPan: true,
        autoPanPadding: [20, 20],
      })

      marker.on('click', () => onSelectStopRef.current(stop))
      stopMarkersRef.current.set(stop.id, { marker, offset })
    })

    if (stops.length > 0) {
      const bounds = L.latLngBounds(stops.map((stop) => [stop.lat, stop.lng] as L.LatLngExpression))
      map.fitBounds(bounds, { padding: [52, 52], maxZoom: 13, animate: false })
    }
  }, [stops])

  useEffect(() => {
    const map = mapInstanceRef.current
    if (!map) return

    stops.forEach((stop) => {
      const entry = stopMarkersRef.current.get(stop.id)
      if (!entry) return
      const isSelected = selectedStop?.id === stop.id
      if (entry.marker.getElement()?.getAttribute('aria-pressed') !== String(isSelected)) {
        entry.marker.setIcon(stopIcon(stop, isSelected, entry.offset))
        entry.marker.setZIndexOffset(isSelected ? 1000 : 0)
      }

      const element = entry.marker.getElement()
      if (element) {
        element.setAttribute('role', 'button')
        element.setAttribute('aria-label', `${stop.id}. ${stop.name}`)
        element.setAttribute('aria-pressed', String(isSelected))
        element.onkeydown = (event) => {
          if (event.key === ' ') {
            event.preventDefault()
            onSelectStopRef.current(stop)
            entry.marker.openPopup()
          }
        }
      }
    })

    const selectedMarker = selectedStop && stopMarkersRef.current.get(selectedStop.id)?.marker
    if (!selectedStop || !selectedMarker) {
      focusedStopRef.current = ''
      map.closePopup()
      return
    }

    const focusKey = `${selectedStop.id}:${renderedStopsRef.current}`
    if (focusedStopRef.current === focusKey) return
    focusedStopRef.current = focusKey

    const position = L.latLng(selectedStop.lat, selectedStop.lng)
    const nearbyDistances = stops
      .filter((stop) => stop.id !== selectedStop.id)
      .map((stop) => position.distanceTo(L.latLng(stop.lat, stop.lng)))
      .filter((distance) => distance > 0)
    const nearestDistance = Math.min(...nearbyDistances)
    const focusZoom = nearestDistance < 2000 ? 14 : nearestDistance < 15000 ? 12 : 8
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    const zoom = focusZoom
    map.stop()
    if (position.equals(map.getCenter()) && zoom === map.getZoom()) {
      selectedMarker.openPopup()
    } else {
      map.once('moveend', () => {
        if (focusedStopRef.current === focusKey) selectedMarker.openPopup()
      })
      map.flyTo(position, zoom, { duration: reduceMotion ? 0 : 0.8, animate: !reduceMotion })
    }
  }, [selectedStop, stops])

  return (
    <>
      <div
        ref={mapRef}
        className="journey-leaflet"
        role="region"
        aria-label={activePhase === 'all' ? 'Mapa del recorrido' : `Mapa del recorrido: ${phaseLabels[activePhase] || activePhase}`}
        style={{ width: '100%', height: '100%' }}
      />
      <style jsx global>{`
        .journey-leaflet {
          background: #e5e8df;
          color: #202a27;
          font-family: inherit;
          isolation: isolate;
        }
        .journey-leaflet .leaflet-tile-pane {
          filter: saturate(0.35) sepia(0.12) contrast(0.93);
        }
        .journey-leaflet .leaflet-control-zoom,
        .journey-leaflet .leaflet-control-layers {
          overflow: hidden;
          border: 1px solid #202a271f;
          border-radius: 12px;
          box-shadow: 0 4px 18px #202a2714;
          background: #fffdf7;
        }
        .journey-leaflet .leaflet-control-zoom a {
          width: 38px;
          height: 38px;
          line-height: 38px;
          background: #fffdf7;
          color: #294b3f;
          border-color: #202a2714;
          font-weight: 400;
        }
        .journey-leaflet .leaflet-control-zoom a:hover,
        .journey-leaflet .leaflet-control-zoom a:focus-visible {
          background: #edece2;
        }
        .journey-leaflet .leaflet-control-layers-toggle {
          width: 42px;
          height: 42px;
        }
        .journey-leaflet .leaflet-control-layers-expanded {
          padding: 12px 16px;
          color: #294b3f;
          font-size: 13px;
        }
        .journey-leaflet .leaflet-control-layers-selector {
          accent-color: #294b3f;
        }
        .journey-leaflet .leaflet-control-attribution {
          padding: 3px 8px;
          background: #fffdf7e6;
          color: #5d6b62;
          font-size: 10px;
        }
        .journey-leaflet .leaflet-control-attribution a {
          color: #294b3f;
        }
        .journey-map-marker {
          background: transparent;
          border: 0;
        }
        .journey-map-marker-pin {
          position: relative;
          display: flex;
          width: 42px;
          height: 42px;
          align-items: center;
          justify-content: center;
          border: 3px solid #fffdf7;
          border-radius: 50%;
          background: var(--stop-color);
          color: var(--stop-ink);
          box-shadow: 0 3px 10px #202a2733;
          transition: transform 180ms ease, box-shadow 180ms ease;
        }
        .journey-map-marker-number {
          font-size: 12px;
          font-weight: 800;
          letter-spacing: -0.03em;
          font-variant-numeric: tabular-nums;
        }
        .journey-map-marker-symbol {
          position: absolute;
          right: -6px;
          top: -7px;
          display: flex;
          width: 22px;
          height: 22px;
          align-items: center;
          justify-content: center;
          border: 1px solid #202a271f;
          border-radius: 50%;
          background: #fffdf7;
          font-size: 12px;
          line-height: 1;
        }
        .journey-map-marker:hover .journey-map-marker-pin {
          transform: translateY(-3px);
          box-shadow: 0 7px 14px #202a2733;
        }
        .journey-map-marker.is-selected .journey-map-marker-pin {
          transform: scale(1.15);
          box-shadow: 0 0 0 5px #fffdf7b3, 0 0 0 7px var(--stop-color), 0 7px 20px #202a2740;
        }
        .journey-map-marker:focus-visible {
          outline: 3px solid #202a27;
          outline-offset: 8px;
          border-radius: 50%;
        }
        .journey-map-popup .leaflet-popup-content-wrapper {
          overflow: hidden;
          border: 1px solid #202a271a;
          border-radius: 18px;
          background: #fffdf7;
          color: #202a27;
          box-shadow: 0 12px 34px #202a272e;
        }
        .journey-map-popup .leaflet-popup-content {
          margin: 20px;
          font-family: inherit;
        }
        .journey-map-popup .leaflet-popup-tip {
          background: #fffdf7;
        }
        .journey-map-popup .leaflet-popup-close-button {
          width: 30px;
          height: 30px;
          padding-top: 3px;
          color: #65756b;
          font-size: 22px;
        }
        .journey-map-popup-heading {
          display: flex;
          gap: 12px;
          align-items: center;
          margin-bottom: 14px;
          padding-right: 4px;
        }
        .journey-map-popup-icon {
          display: grid;
          width: 44px;
          height: 44px;
          flex-shrink: 0;
          place-items: center;
          border: 1px solid #b48a5033;
          border-radius: 13px;
          background: #f5f2eb;
          font-size: 24px;
        }
        .journey-map-popup-title {
          display: block;
          font-size: 15px;
          line-height: 1.4;
          font-weight: 750;
        }
        .journey-map-popup-meta {
          display: block;
          margin-top: 5px;
          color: #65756b;
          font-size: 11px;
          line-height: 1.5;
        }
        .journey-map-popup .journey-map-popup-description {
          margin: 0;
          color: #45554c;
          font-size: 13px;
          line-height: 1.7;
        }
        .journey-map-popup .journey-map-popup-distance {
          margin: 12px 0;
          color: #765932;
          font-size: 12px;
          font-weight: 600;
        }
        .journey-map-popup-phase {
          display: inline-flex;
          margin-top: 14px;
          padding: 6px 10px;
          border: 1px solid #202a271a;
          border-left: 3px solid var(--stop-color);
          border-radius: 6px;
          background: #f5f2eb;
          color: #294b3f;
          font-size: 11px;
          font-weight: 700;
        }
        .journey-map-popup .leaflet-popup-scrolled {
          border: 0;
          scrollbar-color: #b48a5080 #f5f2eb;
          scrollbar-width: thin;
        }
        @media (prefers-reduced-motion: reduce) {
          .journey-map-marker-pin {
            transition: none;
          }
        }
      `}</style>
    </>
  )
}
