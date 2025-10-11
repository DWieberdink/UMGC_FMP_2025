"use client"

import { useState, useMemo } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Slider } from "@/components/ui/slider"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Bar, BarChart, Cell, Pie, PieChart, ResponsiveContainer, XAxis, YAxis, Tooltip } from "recharts"
import { ChartContainer } from "@/components/ui/chart"
import { AlertTriangle, Plus, X } from "lucide-react"

// Space type definitions with categories
const SPACE_TYPES = [
  { id: "workstation", name: "Workstation", defaultSf: 50, category: "workstations", color: "hsl(217, 91%, 60%)" },
  { id: "smallOffice", name: "Small Office", defaultSf: 100, category: "offices", color: "hsl(142, 76%, 36%)" },
  { id: "medOffice", name: "Medium Office", defaultSf: 120, category: "offices", color: "hsl(142, 76%, 46%)" },
  { id: "largeOffice", name: "Large Office", defaultSf: 150, category: "offices", color: "hsl(142, 76%, 56%)" },
  { id: "phoneRoom", name: "Phone Room", defaultSf: 75, category: "support", color: "hsl(280, 65%, 60%)" },
  {
    id: "huddleRoom",
    name: "Huddle/Interview Room (2p)",
    defaultSf: 150,
    category: "meeting",
    color: "hsl(47, 96%, 53%)",
  },
  {
    id: "smallMeeting",
    name: "Small Meeting Room (6p)",
    defaultSf: 250,
    category: "meeting",
    color: "hsl(47, 96%, 63%)",
  },
  {
    id: "mediumMeeting",
    name: "Medium Meeting Room (12p)",
    defaultSf: 400,
    category: "meeting",
    color: "hsl(47, 96%, 73%)",
  },
  {
    id: "largeMeeting",
    name: "Large Meeting Room (16p)",
    defaultSf: 500,
    category: "meeting",
    color: "hsl(47, 96%, 83%)",
  },
  {
    id: "collaboration",
    name: "Informal Collaboration (6p)",
    defaultSf: 300,
    category: "support",
    color: "hsl(280, 65%, 70%)",
  },
]

const CATEGORY_NAMES = {
  workstations: "Workstations",
  offices: "Offices",
  meeting: "Meeting Rooms",
  support: "Support Spaces",
}

const CATEGORY_COLORS = {
  workstations: "hsl(217, 91%, 60%)",
  offices: "hsl(142, 76%, 36%)",
  meeting: "hsl(47, 96%, 53%)",
  support: "hsl(280, 65%, 60%)",
}

interface CustomSpace {
  id: string
  name: string
  sf: number
  quantity: number
}

export default function SpacePlanningDashboard() {
  // Building parameters - Admin Building has 4 floors
  const [floorSpaces, setFloorSpaces] = useState([20000, 20000, 20000, 20000])
  const [efficiency, setEfficiency] = useState(85)

  const [spaceSF, setSpaceSF] = useState<Record<string, number>>(
    SPACE_TYPES.reduce((acc, type) => ({ ...acc, [type.id]: type.defaultSf }), {}),
  )

  // Space quantities
  const [quantities, setQuantities] = useState<Record<string, number>>({
    workstation: 50,
    smallOffice: 10,
    medOffice: 8,
    largeOffice: 5,
    phoneRoom: 3,
    huddleRoom: 4,
    smallMeeting: 3,
    mediumMeeting: 2,
    largeMeeting: 1,
    collaboration: 2,
  })

  // Custom spaces
  const [customSpaces, setCustomSpaces] = useState<CustomSpace[]>([])
  const [newSpaceName, setNewSpaceName] = useState("")
  const [newSpaceSf, setNewSpaceSf] = useState("")
  const [newSpaceQty, setNewSpaceQty] = useState("")

  // Alert dialog
  const [showAlert, setShowAlert] = useState(false)

  // Calculations
  const totalGSF = floorSpaces.reduce((sum, floor) => sum + floor, 0)
  const assignableSF = Math.round(totalGSF * (efficiency / 100))

  const usedSF = useMemo(() => {
    let total = 0
    SPACE_TYPES.forEach((type) => {
      total += (spaceSF[type.id] || type.defaultSf) * (quantities[type.id] || 0)
    })
    customSpaces.forEach((space) => {
      total += space.sf * space.quantity
    })
    return total
  }, [quantities, customSpaces, spaceSF])

  const remainingSF = assignableSF - usedSF
  const utilizationPercent = (usedSF / assignableSF) * 100

  // Check if over capacity
  useMemo(() => {
    if (usedSF > assignableSF && !showAlert) {
      setShowAlert(true)
    }
  }, [usedSF, assignableSF, showAlert])

  const categorySummary = useMemo(() => {
    const summary: Record<string, { count: number; sf: number }> = {
      workstations: { count: 0, sf: 0 },
      offices: { count: 0, sf: 0 },
      meeting: { count: 0, sf: 0 },
      support: { count: 0, sf: 0 },
    }

    SPACE_TYPES.forEach((type) => {
      const qty = quantities[type.id] || 0
      const sf = spaceSF[type.id] || type.defaultSf
      summary[type.category].count += qty
      summary[type.category].sf += sf * qty
    })

    return summary
  }, [quantities, spaceSF])

  // Chart data
  const categoryChartData = Object.entries(categorySummary).map(([key, value]) => ({
    category: CATEGORY_NAMES[key as keyof typeof CATEGORY_NAMES],
    sf: value.sf,
    fill: CATEGORY_COLORS[key as keyof typeof CATEGORY_COLORS],
  }))

  const spaceTypeChartData = SPACE_TYPES.map((type) => ({
    name: type.name,
    sf: (spaceSF[type.id] || type.defaultSf) * (quantities[type.id] || 0),
    fill: type.color,
  })).filter((item) => item.sf > 0)

  const addCustomSpace = () => {
    if (newSpaceName && newSpaceSf && newSpaceQty) {
      setCustomSpaces([
        ...customSpaces,
        {
          id: `custom-${Date.now()}`,
          name: newSpaceName,
          sf: Number.parseInt(newSpaceSf),
          quantity: Number.parseInt(newSpaceQty),
        },
      ])
      setNewSpaceName("")
      setNewSpaceSf("")
      setNewSpaceQty("")
    }
  }

  const removeCustomSpace = (id: string) => {
    setCustomSpaces(customSpaces.filter((space) => space.id !== id))
  }

  const handleSFChange = (id: string, value: string) => {
    const numValue = Number.parseInt(value)
    if (!isNaN(numValue) && numValue > 0) {
      setSpaceSF({ ...spaceSF, [id]: numValue })
    }
  }

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="mx-auto max-w-7xl space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-balance">Space Planning Dashboard</h1>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Total GSF</CardDescription>
              <CardTitle className="text-2xl">{totalGSF.toLocaleString()}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-xs text-muted-foreground">
                4 floors (Admin Building)
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Assignable SF</CardDescription>
              <CardTitle className="text-2xl">{assignableSF.toLocaleString()}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-xs text-muted-foreground">{efficiency}% efficiency</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Used SF</CardDescription>
              <CardTitle className="text-2xl">{usedSF.toLocaleString()}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-xs text-muted-foreground">{utilizationPercent.toFixed(1)}% utilization</p>
            </CardContent>
          </Card>

          <Card className={remainingSF < 0 ? "border-destructive" : ""}>
            <CardHeader className="pb-2">
              <CardDescription>Remaining SF</CardDescription>
              <CardTitle className={`text-2xl ${remainingSF < 0 ? "text-destructive" : ""}`}>
                {remainingSF.toLocaleString()}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {remainingSF < 0 && (
                <Badge variant="destructive" className="text-xs">
                  <AlertTriangle className="mr-1 h-3 w-3" />
                  Over Capacity
                </Badge>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Building Parameters */}
        <Card>
          <CardHeader>
            <CardTitle>Building Parameters - Admin Building</CardTitle>
            <CardDescription>Adjust the space allocation for each floor</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {floorSpaces.map((space, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label>Floor {index + 1} GSF</Label>
                    <span className="text-sm font-medium">{space.toLocaleString()}</span>
                  </div>
                  <Slider
                    value={[space]}
                    onValueChange={(value) => {
                      const newFloorSpaces = [...floorSpaces]
                      newFloorSpaces[index] = value[0]
                      setFloorSpaces(newFloorSpaces)
                    }}
                    min={5000}
                    max={50000}
                    step={1000}
                    className="w-full"
                  />
                </div>
              ))}

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label>Efficiency (%)</Label>
                  <span className="text-sm font-medium">{efficiency}%</span>
                </div>
                <Slider
                  value={[efficiency]}
                  onValueChange={(value) => setEfficiency(value[0])}
                  min={60}
                  max={95}
                  step={1}
                  className="w-full"
                />
              </div>

              <div className="space-y-2 flex items-center">
                <div className="rounded-lg border border-primary/20 bg-primary/5 p-4 w-full">
                  <Label className="text-sm text-muted-foreground">Total Building GSF</Label>
                  <p className="text-2xl font-bold text-primary mt-1">{totalGSF.toLocaleString()}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Space Allocation Controls */}
        <Card>
          <CardHeader>
            <CardTitle>Space Allocation</CardTitle>
            <CardDescription>Adjust quantities and square footage for each space type</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {SPACE_TYPES.map((type) => {
                const currentSF = spaceSF[type.id] || type.defaultSf
                const currentQty = quantities[type.id] || 0
                return (
                  <div key={type.id} className="space-y-3 rounded-lg border border-border p-4">
                    <div className="flex items-center justify-between">
                      <Label className="text-base font-semibold">{type.name}</Label>
                      <div className="h-3 w-3 rounded-full" style={{ backgroundColor: type.color }} />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <Label className="text-xs text-muted-foreground">SF per Unit</Label>
                        <Input
                          type="number"
                          value={currentSF}
                          onChange={(e) => handleSFChange(type.id, e.target.value)}
                          className="h-9"
                          min={1}
                        />
                      </div>
                      <div className="space-y-1">
                        <Label className="text-xs text-muted-foreground">Quantity</Label>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium">{currentQty}</span>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Slider
                        value={[currentQty]}
                        onValueChange={(value) => setQuantities({ ...quantities, [type.id]: value[0] })}
                        min={0}
                        max={100}
                        step={1}
                        className="w-full"
                      />
                    </div>

                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Total SF:</span>
                      <span className="font-semibold">{(currentQty * currentSF).toLocaleString()} SF</span>
                    </div>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>

        {/* Custom Spaces */}
        <Card>
          <CardHeader>
            <CardTitle>Additional Custom Spaces</CardTitle>
            <CardDescription>Add any additional space types not listed above</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-4">
              <div className="space-y-2">
                <Label htmlFor="spaceName">Space Name</Label>
                <Input
                  id="spaceName"
                  placeholder="e.g., Storage Room"
                  value={newSpaceName}
                  onChange={(e) => setNewSpaceName(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="spaceSf">Square Feet</Label>
                <Input
                  id="spaceSf"
                  type="number"
                  placeholder="e.g., 200"
                  value={newSpaceSf}
                  onChange={(e) => setNewSpaceSf(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="spaceQty">Quantity</Label>
                <Input
                  id="spaceQty"
                  type="number"
                  placeholder="e.g., 2"
                  value={newSpaceQty}
                  onChange={(e) => setNewSpaceQty(e.target.value)}
                />
              </div>
              <div className="flex items-end">
                <Button onClick={addCustomSpace} className="w-full">
                  <Plus className="mr-2 h-4 w-4" />
                  Add Space
                </Button>
              </div>
            </div>

            {customSpaces.length > 0 && (
              <div className="space-y-2">
                <Label>Custom Spaces</Label>
                <div className="space-y-2">
                  {customSpaces.map((space) => (
                    <div
                      key={space.id}
                      className="flex items-center justify-between rounded-lg border border-border bg-secondary p-3"
                    >
                      <div className="flex-1">
                        <p className="font-medium">{space.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {space.quantity} × {space.sf} SF = {(space.quantity * space.sf).toLocaleString()} SF
                        </p>
                      </div>
                      <Button variant="ghost" size="sm" onClick={() => removeCustomSpace(space.id)}>
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Charts */}
        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Space Allocation by Category</CardTitle>
              <CardDescription>Distribution of square footage across categories</CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer
                config={{
                  sf: {
                    label: "Square Feet",
                  },
                }}
                className="h-[300px]"
              >
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={categoryChartData}
                      dataKey="sf"
                      nameKey="category"
                      cx="50%"
                      cy="50%"
                      outerRadius={100}
                      label={(entry) => `${entry.category}: ${entry.sf.toLocaleString()} SF`}
                    >
                      {categoryChartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.fill} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </ChartContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Space Allocation by Type</CardTitle>
              <CardDescription>Square footage for each space type</CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer
                config={{
                  sf: {
                    label: "Square Feet",
                  },
                }}
                className="h-[300px]"
              >
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={spaceTypeChartData}>
                    <XAxis dataKey="name" angle={-45} textAnchor="end" height={100} />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="sf" radius={[4, 4, 0, 0]}>
                      {spaceTypeChartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.fill} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </ChartContainer>
            </CardContent>
          </Card>
        </div>

        {/* Category Matrix */}
        <Card>
          <CardHeader>
            <CardTitle>Category Summary Matrix</CardTitle>
            <CardDescription>Overview of space allocation by category</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Category</TableHead>
                  <TableHead className="text-right">Total Spaces</TableHead>
                  <TableHead className="text-right">Total SF</TableHead>
                  <TableHead className="text-right">% of Total</TableHead>
                  <TableHead>Color</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {Object.entries(categorySummary).map(([key, value]) => (
                  <TableRow key={key}>
                    <TableCell className="font-medium">{CATEGORY_NAMES[key as keyof typeof CATEGORY_NAMES]}</TableCell>
                    <TableCell className="text-right">{value.count}</TableCell>
                    <TableCell className="text-right">{value.sf.toLocaleString()}</TableCell>
                    <TableCell className="text-right">{((value.sf / usedSF) * 100).toFixed(1)}%</TableCell>
                    <TableCell>
                      <div
                        className="h-4 w-16 rounded"
                        style={{ backgroundColor: CATEGORY_COLORS[key as keyof typeof CATEGORY_COLORS] }}
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Detailed Space Type Table */}
        <Card>
          <CardHeader>
            <CardTitle>Detailed Space Breakdown</CardTitle>
            <CardDescription>Complete listing of all space types and allocations</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Space Type</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead className="text-right">SF per Unit</TableHead>
                  <TableHead className="text-right">Quantity</TableHead>
                  <TableHead className="text-right">Total SF</TableHead>
                  <TableHead>Color</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {SPACE_TYPES.map((type) => {
                  const qty = quantities[type.id] || 0
                  const sf = spaceSF[type.id] || type.defaultSf
                  const total = qty * sf
                  return (
                    <TableRow key={type.id}>
                      <TableCell className="font-medium">{type.name}</TableCell>
                      <TableCell>{CATEGORY_NAMES[type.category as keyof typeof CATEGORY_NAMES]}</TableCell>
                      <TableCell className="text-right">{sf}</TableCell>
                      <TableCell className="text-right">{qty}</TableCell>
                      <TableCell className="text-right">{total.toLocaleString()}</TableCell>
                      <TableCell>
                        <div className="h-4 w-16 rounded" style={{ backgroundColor: type.color }} />
                      </TableCell>
                    </TableRow>
                  )
                })}
                {customSpaces.map((space) => (
                  <TableRow key={space.id}>
                    <TableCell className="font-medium">{space.name}</TableCell>
                    <TableCell>Custom</TableCell>
                    <TableCell className="text-right">{space.sf}</TableCell>
                    <TableCell className="text-right">{space.quantity}</TableCell>
                    <TableCell className="text-right">{(space.sf * space.quantity).toLocaleString()}</TableCell>
                    <TableCell>
                      <div className="h-4 w-16 rounded bg-muted" />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>

      {/* Over Capacity Alert Dialog */}
      <Dialog open={showAlert} onOpenChange={setShowAlert}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-destructive">
              <AlertTriangle className="h-5 w-5" />
              Over Assignable Square Footage Limit
            </DialogTitle>
            <DialogDescription className="space-y-2">
              <p>You have exceeded the total assignable square footage allowed for this building configuration.</p>
              <div className="rounded-lg bg-destructive/10 p-4 space-y-1">
                <p className="font-medium">Assignable SF: {assignableSF.toLocaleString()} SF</p>
                <p className="font-medium">Used SF: {usedSF.toLocaleString()} SF</p>
                <p className="font-bold text-destructive">Over by: {Math.abs(remainingSF).toLocaleString()} SF</p>
              </div>
              <p className="text-sm">
                Please adjust your space allocations, increase the number of floors, increase the GSF per floor, or
                improve the efficiency percentage.
              </p>
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end">
            <Button onClick={() => setShowAlert(false)}>Understood</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
