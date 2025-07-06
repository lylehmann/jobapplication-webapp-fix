"use client"

import { useState, useRef } from "react"
import { RotateCw, Crop } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Slider } from "@/components/ui/slider"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"

interface ImageEditorProps {
  isOpen: boolean
  onClose: () => void
  onSave: (editedImage: string) => void
  initialImage?: string
}

export function ImageEditor({ isOpen, onClose, onSave, initialImage }: ImageEditorProps) {
  const [zoom, setZoom] = useState([100])
  const [rotation, setRotation] = useState(0)
  const [brightness, setBrightness] = useState([100])
  const [contrast, setContrast] = useState([100])
  const [saturation, setSaturation] = useState([100])
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const handleRotate = () => {
    setRotation((prev) => (prev + 90) % 360)
  }

  const handleSave = () => {
    // In a real implementation, you would apply all the transformations
    // to the canvas and export the result
    const canvas = canvasRef.current
    if (canvas) {
      const dataUrl = canvas.toDataURL("image/jpeg", 0.9)
      onSave(dataUrl)
    }
    onClose()
  }

  const handleReset = () => {
    setZoom([100])
    setRotation(0)
    setBrightness([100])
    setContrast([100])
    setSaturation([100])
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle>Edit Profile Picture</DialogTitle>
          <DialogDescription>Adjust your profile picture with cropping, filters, and transformations</DialogDescription>
        </DialogHeader>

        <div className="flex gap-6 h-[600px]">
          {/* Image Preview */}
          <div className="flex-1 bg-gray-100 rounded-lg flex items-center justify-center overflow-hidden">
            <div className="relative">
              <canvas
                ref={canvasRef}
                className="max-w-full max-h-full border rounded"
                style={{
                  transform: `rotate(${rotation}deg) scale(${zoom[0] / 100})`,
                  filter: `brightness(${brightness[0]}%) contrast(${contrast[0]}%) saturate(${saturation[0]}%)`,
                  transition: "all 0.2s ease",
                }}
              />
              <img
                src={initialImage || "/placeholder.svg?height=400&width=400"}
                alt="Profile preview"
                className="max-w-full max-h-full rounded"
                style={{
                  transform: `rotate(${rotation}deg) scale(${zoom[0] / 100})`,
                  filter: `brightness(${brightness[0]}%) contrast(${contrast[0]}%) saturate(${saturation[0]}%)`,
                  transition: "all 0.2s ease",
                }}
              />
            </div>
          </div>

          {/* Controls Panel */}
          <Card className="w-80">
            <CardHeader>
              <CardTitle className="text-lg">Adjustments</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Transform Controls */}
              <div className="space-y-4">
                <h4 className="font-medium">Transform</h4>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline" onClick={handleRotate}>
                    <RotateCw className="w-4 h-4 mr-2" />
                    Rotate
                  </Button>
                  <Button size="sm" variant="outline">
                    <Crop className="w-4 h-4 mr-2" />
                    Crop
                  </Button>
                </div>

                <div className="space-y-2">
                  <Label>Zoom: {zoom[0]}%</Label>
                  <Slider value={zoom} onValueChange={setZoom} min={50} max={200} step={10} className="w-full" />
                </div>
              </div>

              {/* Color Adjustments */}
              <div className="space-y-4">
                <h4 className="font-medium">Color & Light</h4>

                <div className="space-y-2">
                  <Label>Brightness: {brightness[0]}%</Label>
                  <Slider
                    value={brightness}
                    onValueChange={setBrightness}
                    min={50}
                    max={150}
                    step={5}
                    className="w-full"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Contrast: {contrast[0]}%</Label>
                  <Slider value={contrast} onValueChange={setContrast} min={50} max={150} step={5} className="w-full" />
                </div>

                <div className="space-y-2">
                  <Label>Saturation: {saturation[0]}%</Label>
                  <Slider
                    value={saturation}
                    onValueChange={setSaturation}
                    min={0}
                    max={200}
                    step={10}
                    className="w-full"
                  />
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-2 pt-4 border-t">
                <Button onClick={handleSave} className="w-full">
                  Save Changes
                </Button>
                <Button onClick={handleReset} variant="outline" className="w-full bg-transparent">
                  Reset All
                </Button>
                <Button onClick={onClose} variant="ghost" className="w-full">
                  Cancel
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  )
}
