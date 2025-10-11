"use client"

import { useEffect, useRef, useMemo, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

interface TravelData {
  ZCTA5CE20: string
  Latitude: number
  Longitude: number
  Crow_Flies_Distance_km: number
  Car_Distance_km: number
  Car_Duration_min: number
  Car_Error: string | null
  Transit_Distance_km: number
  Transit_Duration_min: number
  Transit_Error: string | null
  Number_People_in_Zip: number
}

interface EmployeeMapProps {
  data: TravelData[]
  filteredData: TravelData[]
  activeTab: string
  timeThreshold: number
  distanceThreshold: number
}

export default function EmployeeMap({
  data,
  filteredData,
  activeTab,
  timeThreshold,
  distanceThreshold,
}: EmployeeMapProps) {
  const mapContainer = useRef<HTMLDivElement>(null)
  const map = useRef<any>(null)
  const [isFullscreen, setIsFullscreen] = useState(false)

  const mapStats = useMemo(() => {
    const validData = data.filter((item) => item.Latitude && item.Longitude)
    const withinThreshold = validData.filter((item) =>
      filteredData.some((filtered) => filtered.ZCTA5CE20 === item.ZCTA5CE20),
    )

    return {
      totalLocations: validData.length,
      withinThreshold: withinThreshold.length,
      totalPeople: validData.reduce((sum, item) => sum + item.Number_People_in_Zip, 0),
      peopleInThreshold: withinThreshold.reduce((sum, item) => sum + item.Number_People_in_Zip, 0),
    }
  }, [data, filteredData])

  useEffect(() => {
    if (!mapContainer.current || data.length === 0) return

    const initializeMap = async () => {
      try {
        const mapboxgl = await import("mapbox-gl")

        mapboxgl.default.accessToken =
          "pk.eyJ1IjoicGF0d2QwNSIsImEiOiJjbTZ2bGVhajIwMTlvMnFwc2owa3BxZHRoIn0.moDNfqMUolnHphdwsIF87w"

        if (map.current) return

        const validData = data.filter(
          (item) => item.Latitude && item.Longitude && item.Car_Duration_min > 0 && item.Car_Duration_min <= 90,
        )

        if (validData.length === 0) return

        const bounds = new mapboxgl.default.LngLatBounds()

        validData.forEach((item) => {
          bounds.extend([item.Longitude, item.Latitude])
        })

        map.current = new mapboxgl.default.Map({
          container: mapContainer.current,
          style: "mapbox://styles/mapbox/light-v11",
          bounds: bounds,
          fitBoundsOptions: { padding: 50 },
        })

        map.current.on("load", () => {
          const allValidData = data.filter((item) => item.Latitude && item.Longitude)

          allValidData.forEach((item) => {
            const isWithinThreshold = filteredData.some((filtered) => filtered.ZCTA5CE20 === item.ZCTA5CE20)
            const isWithin90Min = item.Car_Duration_min > 0 && item.Car_Duration_min <= 90

            const markerElement = document.createElement("div")
            markerElement.className = "custom-marker"
            markerElement.style.width = `${Math.max(12, Math.min(24, 12 + item.Number_People_in_Zip * 2))}px`
            markerElement.style.height = `${Math.max(12, Math.min(24, 12 + item.Number_People_in_Zip * 2))}px`
            markerElement.style.backgroundColor = isWithinThreshold ? "#22c55e" : "#94a3b8"
            markerElement.style.borderRadius = "50%"
            markerElement.style.border = "2px solid white"
            markerElement.style.cursor = "pointer"
            markerElement.style.boxShadow = "0 2px 4px rgba(0,0,0,0.2)"
            markerElement.style.opacity = isWithin90Min ? "1" : "0.3"

            const popup = new mapboxgl.default.Popup({ offset: 25 }).setHTML(`
              <div class="p-2">
                <h3 class="font-semibold">Zipcode: ${item.ZCTA5CE20}</h3>
                <p><strong>People:</strong> ${item.Number_People_in_Zip}</p>
                <p><strong>Car Time:</strong> ${item.Car_Duration_min > 0 ? Math.round(item.Car_Duration_min) + " min" : "N/A"}</p>
                <p><strong>Car Distance:</strong> ${item.Car_Distance_km > 0 ? Math.round(item.Car_Distance_km * 0.621371) + " miles" : "N/A"}</p>
                <p><strong>Transit Time:</strong> ${item.Transit_Duration_min > 0 ? Math.round(item.Transit_Duration_min) + " min" : "N/A"}</p>
                <p><strong>Direct Distance:</strong> ${Math.round(item.Crow_Flies_Distance_km * 0.621371)} miles</p>
                <p><strong>Status:</strong> ${isWithinThreshold ? "Within threshold" : "Outside threshold"}</p>
              </div>
            `)

            new mapboxgl.default.Marker(markerElement)
              .setLngLat([item.Longitude, item.Latitude])
              .setPopup(popup)
              .addTo(map.current)
          })
        })
      } catch (error) {
        console.error("Error initializing map:", error)
      }
    }

    initializeMap()

    return () => {
      if (map.current) {
        map.current.remove()
        map.current = null
      }
    }
  }, [data])

  useEffect(() => {
    if (!map.current) return

    const markers = document.querySelectorAll(".custom-marker")
    const validData = data.filter((item) => item.Latitude && item.Longitude)

    markers.forEach((marker, index) => {
      if (validData[index]) {
        const item = validData[index]
        const isWithinThreshold = filteredData.some((filtered) => filtered.ZCTA5CE20 === item.ZCTA5CE20)
        ;(marker as HTMLElement).style.backgroundColor = isWithinThreshold ? "#22c55e" : "#94a3b8"
      }
    })
  }, [filteredData, data])

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen)
    setTimeout(() => {
      if (map.current) {
        map.current.resize()
        setTimeout(() => {
          if (map.current) {
            map.current.resize()
          }
        }, 50)
      }
    }, 200)
  }

  return (
    <Card className={isFullscreen ? "fixed inset-0 z-50 bg-background" : ""}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <span>🗺️</span>
              Employee Locations
            </CardTitle>
            <div className="text-sm text-muted-foreground space-y-1">
              <p>Geographic distribution of employees based on their zipcode locations</p>
              <div className="flex items-center gap-4 text-xs">
                <div className="flex items-center gap-1">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span>Within threshold</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-3 h-3 bg-gray-400 rounded-full"></div>
                  <span>Outside threshold</span>
                </div>
                <span>• Marker size = number of people</span>
              </div>
            </div>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={toggleFullscreen}
            className="flex items-center gap-2 bg-transparent"
          >
            {isFullscreen ? "⤓ Exit Fullscreen" : "⤢ Fullscreen"}
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div
          ref={mapContainer}
          className={`w-full rounded-lg border overflow-hidden ${isFullscreen ? "h-[calc(100vh-160px)]" : "h-96"}`}
          style={{
            minHeight: isFullscreen ? "calc(100vh - 160px)" : "400px",
            position: "relative",
          }}
        />

        {!isFullscreen && (
          <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div className="text-center">
              <div className="font-semibold text-lg">{mapStats.totalLocations}</div>
              <div className="text-muted-foreground">Total Zipcodes</div>
            </div>
            <div className="text-center">
              <div className="font-semibold text-lg text-green-600">{mapStats.withinThreshold}</div>
              <div className="text-muted-foreground">Within Threshold</div>
            </div>
            <div className="text-center">
              <div className="font-semibold text-lg">{mapStats.totalPeople}</div>
              <div className="text-muted-foreground">Total People</div>
            </div>
            <div className="text-center">
              <div className="font-semibold text-lg text-green-600">{mapStats.peopleInThreshold}</div>
              <div className="text-muted-foreground">People in Threshold</div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
