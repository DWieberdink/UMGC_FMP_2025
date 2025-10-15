"use client"

import type React from "react"

import { useState, useEffect, useMemo, useRef } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Slider } from "@/components/ui/slider"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import EmployeeMap from "@/components/employee-map"

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

export default function TravelDashboard() {
  const [data, setData] = useState<TravelData[]>([])
  const [loading, setLoading] = useState(true)
  const [timeThreshold, setTimeThreshold] = useState([60]) // 60 minutes default
  const [distanceThreshold, setDistanceThreshold] = useState([25]) // 25 miles default
  const [activeTab, setActiveTab] = useState("time")
  const [uploadedFileName, setUploadedFileName] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const parseCSVData = (csvText: string): TravelData[] => {
    const lines = csvText.split("\n")
    const headers = lines[0].split(",")

    return lines
      .slice(1)
      .filter((line) => line.trim())
      .map((line) => {
        const values = line.split(",")
        return {
          ZCTA5CE20: values[0] || "",
          Latitude: Number.parseFloat(values[1]) || 0,
          Longitude: Number.parseFloat(values[2]) || 0,
          Crow_Flies_Distance_km: Number.parseFloat(values[3]) || 0,
          Car_Distance_km: Number.parseFloat(values[4]) || 0,
          Car_Duration_min: Number.parseFloat(values[5]) || 0,
          Car_Error: values[6] === "null" || !values[6] ? null : values[6],
          Transit_Distance_km: Number.parseFloat(values[7]) || 0,
          Transit_Duration_min: Number.parseFloat(values[8]) || 0,
          Transit_Error: values[9] === "null" || !values[9] ? null : values[9],
          Number_People_in_Zip: Number.parseInt(values[10]) || 0,
        }
      })
  }

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    if (!file.name.toLowerCase().endsWith(".csv")) {
      alert("Please upload a CSV file")
      return
    }

    setLoading(true)
    const reader = new FileReader()

    reader.onload = (e) => {
      try {
        const csvText = e.target?.result as string
        const parsedData = parseCSVData(csvText)
        setData(parsedData)
        setUploadedFileName(file.name)
        console.log("[v0] Successfully loaded", parsedData.length, "records from uploaded file")
      } catch (error) {
        console.error("Error parsing uploaded CSV:", error)
        alert("Error parsing CSV file. Please check the format.")
      } finally {
        setLoading(false)
      }
    }

    reader.readAsText(file)
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Travel%20Times_Employees_Complete_Analysis_Results-1EbbTKE16GkNZBduF6fz5dH70uwWOM.csv",
        )
        const csvText = await response.text()
        const parsedData = parseCSVData(csvText)
        setData(parsedData)
      } catch (error) {
        console.error("Error fetching data:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  const currentThresholdStats = useMemo(() => {
    const kmToMiles = (km: number) => km * 0.621371

    if (activeTab === "time") {
      const carWithinThreshold = data
        .filter((item) => item.Car_Duration_min <= timeThreshold[0] && item.Car_Duration_min > 0)
        .reduce((sum, item) => sum + item.Number_People_in_Zip, 0)

      const transitWithinThreshold = data
        .filter((item) => item.Transit_Duration_min <= timeThreshold[0] && item.Transit_Duration_min > 0)
        .reduce((sum, item) => sum + item.Number_People_in_Zip, 0)

      const noTransitAccess = data
        .filter((item) => item.Transit_Error === "No route found" || item.Transit_Duration_min === 0)
        .reduce((sum, item) => sum + item.Number_People_in_Zip, 0)

      return { car: carWithinThreshold, transit: transitWithinThreshold, noTransitAccess }
    } else {
      const carWithinDistance = data
        .filter((item) => kmToMiles(item.Car_Distance_km) <= distanceThreshold[0] && item.Car_Distance_km > 0)
        .reduce((sum, item) => sum + item.Number_People_in_Zip, 0)

      const crowFliesWithinDistance = data
        .filter((item) => kmToMiles(item.Crow_Flies_Distance_km) <= distanceThreshold[0])
        .reduce((sum, item) => sum + item.Number_People_in_Zip, 0)

      return { car: carWithinDistance, crowFlies: crowFliesWithinDistance }
    }
  }, [data, timeThreshold, distanceThreshold, activeTab])

  const dynamicSummaryStats = useMemo(() => {
    const kmToMiles = (km: number) => km * 0.621371

    let filteredData: TravelData[] = []

    if (activeTab === "time") {
      // Filter by time threshold
      filteredData = data.filter((item) => item.Car_Duration_min <= timeThreshold[0] && item.Car_Duration_min > 0)
    } else {
      // Filter by distance threshold (crow flies)
      filteredData = data.filter((item) => kmToMiles(item.Crow_Flies_Distance_km) <= distanceThreshold[0])
    }

    const totalZipcodes = filteredData.length
    const totalPeople = filteredData.reduce((sum, item) => sum + item.Number_People_in_Zip, 0)

    // Car stats for filtered data
    const carData = filteredData.filter((item) => item.Car_Duration_min > 0)
    const avgCarTime =
      carData.length > 0
        ? Math.round(carData.reduce((sum, item) => sum + item.Car_Duration_min, 0) / carData.length)
        : 0
    const avgCarDistance =
      carData.length > 0 ? kmToMiles(carData.reduce((sum, item) => sum + item.Car_Distance_km, 0) / carData.length) : 0

    // Transit stats for filtered data
    const transitData = filteredData.filter((item) => item.Transit_Duration_min > 0)
    const avgTransitTime =
      transitData.length > 0
        ? Math.round(transitData.reduce((sum, item) => sum + item.Transit_Duration_min, 0) / transitData.length)
        : 0
    const noTransitAccess = filteredData
      .filter((item) => item.Transit_Error === "No route found" || item.Transit_Duration_min === 0)
      .reduce((sum, item) => sum + item.Number_People_in_Zip, 0)

    // Direct distance for filtered data
    const avgDirectDistance =
      filteredData.length > 0
        ? kmToMiles(filteredData.reduce((sum, item) => sum + item.Crow_Flies_Distance_km, 0) / filteredData.length)
        : 0

    return {
      totalZipcodes,
      totalPeople,
      avgCarTime,
      avgCarDistance,
      avgTransitTime,
      noTransitAccess,
      avgDirectDistance,
    }
  }, [data, timeThreshold, distanceThreshold, activeTab])

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading travel data...</p>
        </div>
      </div>
    )
  }

  const kmToMiles = (km: number) => Math.round(km * 0.621371 * 10) / 10

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto p-4 space-y-4">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold text-foreground">Employee Commute Analysis</h1>
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-2">
            <p className="text-base font-semibold text-blue-800">Analyzing 749 people assigned to the Adelphi Campus</p>
          </div>
          <p className="text-base text-muted-foreground">
            Insights on Travel Times by Car, Public Transport, and Direct Distance
          </p>
          {uploadedFileName && (
            <Badge variant="secondary" className="text-sm">
              Using: {uploadedFileName}
            </Badge>
          )}
        </div>

        {/* Interactive Filters */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="time">Filter by Time</TabsTrigger>
            <TabsTrigger value="distance">Filter by Distance</TabsTrigger>
          </TabsList>

          <TabsContent value="time" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <span>⏰</span>
                  Travel Time Analysis
                </CardTitle>
                <CardDescription>
                  Adjust the slider to see how many people are within different travel time thresholds
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-medium">Maximum Travel Time</label>
                    <Badge variant="secondary">{timeThreshold[0]} minutes</Badge>
                  </div>
                  <Slider
                    value={timeThreshold}
                    onValueChange={setTimeThreshold}
                    max={120}
                    min={0}
                    step={5}
                    className="w-full"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <Card className="bg-card">
                    <CardHeader className="pb-1">
                      <CardTitle className="text-base flex items-center gap-2">
                        <span>🚗</span>
                        By Car
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold text-blue-600">{currentThresholdStats.car}</div>
                      <p className="text-sm text-muted-foreground">people within {timeThreshold[0]} minutes</p>
                    </CardContent>
                  </Card>

                  <Card className="bg-card">
                    <CardHeader className="pb-1">
                      <CardTitle className="text-base flex items-center gap-2">
                        <span>🚊</span>
                        By Public Transport
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold text-green-600">{currentThresholdStats.transit}</div>
                      <p className="text-sm text-muted-foreground">people within {timeThreshold[0]} minutes</p>
                      {currentThresholdStats.noTransitAccess && (
                        <p className="text-xs text-orange-600 mt-1">
                          {currentThresholdStats.noTransitAccess} people have no transit access
                        </p>
                      )}
                    </CardContent>
                  </Card>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="distance" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <span>📍</span>
                  Distance Analysis
                </CardTitle>
                <CardDescription>
                  Adjust the slider to see how many people are within different distance thresholds
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-medium">Maximum Distance</label>
                    <Badge variant="secondary">{distanceThreshold[0]} miles</Badge>
                  </div>
                  <Slider
                    value={distanceThreshold}
                    onValueChange={setDistanceThreshold}
                    max={100}
                    min={5}
                    step={5}
                    className="w-full"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <Card className="bg-card">
                    <CardHeader className="pb-1">
                      <CardTitle className="text-base flex items-center gap-2">
                        <span>🚗</span>
                        By Car Route
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold text-blue-600">{currentThresholdStats.car}</div>
                      <p className="text-sm text-muted-foreground">people within {distanceThreshold[0]} miles</p>
                    </CardContent>
                  </Card>

                  <Card className="bg-card">
                    <CardHeader className="pb-1">
                      <CardTitle className="text-base flex items-center gap-2">
                        <span>🧭</span>
                        As Crow Flies
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold text-purple-600">{currentThresholdStats.crowFlies || 0}</div>
                      <p className="text-sm text-muted-foreground">people within {distanceThreshold[0]} miles</p>
                    </CardContent>
                  </Card>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Employee Map */}
        <EmployeeMap
          data={data}
          filteredData={data.filter((item) => {
            if (activeTab === "time") {
              return (
                item.Car_Duration_min <= timeThreshold[0] ||
                (item.Transit_Duration_min > 0 && item.Transit_Duration_min <= timeThreshold[0])
              )
            } else {
              const kmToMiles = (km: number) => km * 0.621371
              return (
                kmToMiles(item.Car_Distance_km) <= distanceThreshold[0] ||
                kmToMiles(item.Crow_Flies_Distance_km) <= distanceThreshold[0]
              )
            }
          })}
          activeTab={activeTab}
          timeThreshold={timeThreshold[0]}
          distanceThreshold={distanceThreshold[0]}
        />

        {/* Time Breakdown Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Travel Time Distribution</CardTitle>
            <CardDescription>Number of people within different time thresholds</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart
                data={[
                  {
                    time: "5 min",
                    car: data
                      .filter((item) => item.Car_Duration_min <= 5 && item.Car_Duration_min > 0)
                      .reduce((sum, item) => sum + item.Number_People_in_Zip, 0),
                    transit: data
                      .filter((item) => item.Transit_Duration_min <= 5 && item.Transit_Duration_min > 0)
                      .reduce((sum, item) => sum + item.Number_People_in_Zip, 0),
                  },
                  {
                    time: "10 min",
                    car: data
                      .filter((item) => item.Car_Duration_min <= 10 && item.Car_Duration_min > 0)
                      .reduce((sum, item) => sum + item.Number_People_in_Zip, 0),
                    transit: data
                      .filter((item) => item.Transit_Duration_min <= 10 && item.Transit_Duration_min > 0)
                      .reduce((sum, item) => sum + item.Number_People_in_Zip, 0),
                  },
                  {
                    time: "15 min",
                    car: data
                      .filter((item) => item.Car_Duration_min <= 15 && item.Car_Duration_min > 0)
                      .reduce((sum, item) => sum + item.Number_People_in_Zip, 0),
                    transit: data
                      .filter((item) => item.Transit_Duration_min <= 15 && item.Transit_Duration_min > 0)
                      .reduce((sum, item) => sum + item.Number_People_in_Zip, 0),
                  },
                  {
                    time: "30 min",
                    car: data
                      .filter((item) => item.Car_Duration_min <= 30 && item.Car_Duration_min > 0)
                      .reduce((sum, item) => sum + item.Number_People_in_Zip, 0),
                    transit: data
                      .filter((item) => item.Transit_Duration_min <= 30 && item.Transit_Duration_min > 0)
                      .reduce((sum, item) => sum + item.Number_People_in_Zip, 0),
                  },
                  {
                    time: "45 min",
                    car: data
                      .filter((item) => item.Car_Duration_min <= 45 && item.Car_Duration_min > 0)
                      .reduce((sum, item) => sum + item.Number_People_in_Zip, 0),
                    transit: data
                      .filter((item) => item.Transit_Duration_min <= 45 && item.Transit_Duration_min > 0)
                      .reduce((sum, item) => sum + item.Number_People_in_Zip, 0),
                  },
                  {
                    time: "60 min",
                    car: data
                      .filter((item) => item.Car_Duration_min <= 60 && item.Car_Duration_min > 0)
                      .reduce((sum, item) => sum + item.Number_People_in_Zip, 0),
                    transit: data
                      .filter((item) => item.Transit_Duration_min <= 60 && item.Transit_Duration_min > 0)
                      .reduce((sum, item) => sum + item.Number_People_in_Zip, 0),
                  },
                ]}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="time" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="car" fill="#3b82f6" name="By Car" />
                <Bar dataKey="transit" fill="#10b981" name="By Transit" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Number of Zipcodes</CardTitle>
              <span className="text-2xl">📍</span>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{dynamicSummaryStats.totalZipcodes}</div>
              <p className="text-xs text-muted-foreground">Representing {dynamicSummaryStats.totalPeople} people</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Avg Car Time</CardTitle>
              <span className="text-2xl">🚗</span>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{dynamicSummaryStats.avgCarTime} min</div>
              <p className="text-xs text-muted-foreground">
                {Math.round(dynamicSummaryStats.avgCarDistance * 10) / 10} miles average distance
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Avg Transit Time</CardTitle>
              <span className="text-2xl">🚊</span>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {dynamicSummaryStats.avgTransitTime > 0 ? `${dynamicSummaryStats.avgTransitTime} min` : "N/A"}
              </div>
              <p className="text-xs text-muted-foreground">
                {dynamicSummaryStats.noTransitAccess} people have no access
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Avg Direct Distance</CardTitle>
              <span className="text-2xl">📍</span>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {Math.round(dynamicSummaryStats.avgDirectDistance * 10) / 10} miles
              </div>
              <p className="text-xs text-muted-foreground">As the crow flies</p>
            </CardContent>
          </Card>
        </div>

        {/* Upload Button */}
        <div className="flex justify-end">
          <Button onClick={() => fileInputRef.current?.click()} variant="outline" className="flex items-center gap-2">
            📁 Upload New CSV Data
          </Button>
          <input ref={fileInputRef} type="file" accept=".csv" onChange={handleFileUpload} className="hidden" />
        </div>

        {/* Alert */}
        <Alert>
          <AlertDescription>
            Note: 2025-08-06 | For 30 employees, zipcode data was not available and they are not included in this analysis.
          </AlertDescription>
        </Alert>
      </div>
    </div>
  )
}
