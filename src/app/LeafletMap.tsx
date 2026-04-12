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
  ida: '#b45309',
  descubrimiento: '#dc2626',
  regreso: '#7c3aed',
  retorno: '#059669',
}

const phaseLabels: Record<string, string> = {
  ida: 'La subida',
  descubrimiento: 'Descubrimiento',
  regreso: 'Viaje al exterior',
  retorno: 'El retorno',
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

  // Initialize map once
  useEffect(() => {
    if (!mapRef.current || mapInstanceRef.current) return

    const map = L.map(mapRef.current, {
      center: [-30, -65],
      zoom: 5,
      zoomControl: true,
      scrollWheelZoom: true,
    })

    const standard = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors',
      maxZoom: 18,
    }).addTo(map)

    const terrain = L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenTopoMap contributors',
      maxZoom: 17,
    })

    L.control.layers({ 'Mapa estándar': standard, 'Terreno': terrain }, {}).addTo(map)

    markersRef.current = L.layerGroup().addTo(map)
    polylinesRef.current = L.layerGroup().addTo(map)

    mapInstanceRef.current = map

    return () => {
      map.remove()
      mapInstanceRef.current = null
    }
  }, [])

  // Update markers and polylines when stops change
  useEffect(() => {
    const map = mapInstanceRef.current
    const markers = markersRef.current
    const polylines = polylinesRef.current
    if (!map || !markers || !polylines) return

    markers.clearLayers()
    polylines.clearLayers()

    // Draw polyline connecting stops in order
    if (stops.length > 1) {
      // Group by phase for colored segments
      let i = 0
      while (i < stops.length - 1) {
        const phase = stops[i].phase
        const segmentPoints: L.LatLngExpression[] = [[stops[i].lat, stops[i].lng]]
        while (i < stops.length - 1 && stops[i + 1].phase === phase) {
          i++
          segmentPoints.push([stops[i].lat, stops[i].lng])
        }
        if (segmentPoints.length > 1) {
          L.polyline(segmentPoints, {
            color: phaseColors[phase] || '#92400e',
            weight: 3,
            opacity: 0.7,
            dashArray: '8, 6',
          }).addTo(polylines)
        }
        i++
      }
    }

    // Add markers
    stops.forEach((stop) => {
      const color = phaseColors[stop.phase] || '#92400e'
      const isSelected = selectedStop?.id === stop.id

      const icon = L.divIcon({
        className: 'custom-marker',
        html: `<div style="
          width: ${isSelected ? '40px' : '32px'};
          height: ${isSelected ? '40px' : '32px'};
          border-radius: 50%;
          background: ${color};
          border: 3px solid white;
          box-shadow: 0 2px 8px rgba(0,0,0,0.3);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: ${isSelected ? '18px' : '14px'};
          cursor: pointer;
          transition: all 0.2s;
          ${isSelected ? 'z-index: 1000;' : ''}
        ">${stop.icon}</div>`,
        iconSize: [isSelected ? 40 : 32, isSelected ? 40 : 32],
        iconAnchor: [isSelected ? 20 : 16, isSelected ? 20 : 16],
      })

      const marker = L.marker([stop.lat, stop.lng], { icon })
        .addTo(markers)

      marker.bindPopup(`
        <div style="min-width:200px; max-width:300px; font-family: system-ui, sans-serif;">
          <div style="display:flex; align-items:center; gap:8px; margin-bottom:6px;">
            <span style="font-size:24px;">${stop.icon}</span>
            <div>
              <strong style="font-size:14px;">${stop.name}</strong><br/>
              <span style="font-size:11px; color:#78716c;">${stop.altitude} · ${stop.date}</span>
            </div>
          </div>
          <p style="font-size:12px; line-height:1.5; color:#44403c; margin:4px 0;">${stop.description.slice(0, 200)}${stop.description.length > 200 ? '...' : ''}</p>
          ${stop.distanceFromPrev ? `<p style="font-size:11px; color:#b45309; margin-top:6px;">📏 ${stop.distanceFromPrev}</p>` : ''}
          <div style="margin-top:6px;">
            <span style="display:inline-block; padding:2px 8px; border-radius:12px; font-size:10px; color:white; background:${color};">${phaseLabels[stop.phase]}</span>
          </div>
        </div>
      `)

      marker.on('click', () => {
        onSelectStop(stop)
      })
    })

    // Fit bounds to show all markers
    if (stops.length > 0) {
      const bounds = L.latLngBounds(stops.map((s) => [s.lat, s.lng] as L.LatLngExpression))
      map.fitBounds(bounds, { padding: [40, 40], maxZoom: 10 })
    }
  }, [stops, selectedStop, onSelectStop])

  // Fly to selected stop
  useEffect(() => {
    const map = mapInstanceRef.current
    if (!map || !selectedStop) return
    map.flyTo([selectedStop.lat, selectedStop.lng], 8, { duration: 1.5 })
  }, [selectedStop])

  return <div ref={mapRef} style={{ width: '100%', height: '100%' }} />
}
