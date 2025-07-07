"use client"

import { useState, useRef } from "react"
import { RotateCw, Crop } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Slider } from "@/components/ui/slider"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import Cropper from 'react-easy-crop'
import { getCroppedImg } from '@/lib/crop-utils'

interface ImageEditorProps {
  isOpen: boolean
  onClose: () => void
  onSave: (editedImage: string) => void
  initialImage?: string
}

export function ImageEditor({ isOpen, onClose, onSave, initialImage }: ImageEditorProps) {
  const [zoom, setZoom] = useState(1)
  const [rotation, setRotation] = useState(0)
  const [crop, setCrop] = useState({ x: 0, y: 0 })
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null)
  const [brightness, setBrightness] = useState([100])
  const [contrast, setContrast] = useState([100])
  const [saturation, setSaturation] = useState([100])
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const handleCropComplete = (_croppedArea, croppedAreaPixels) => {
    setCroppedAreaPixels(croppedAreaPixels)
  }

  const handleSave = async () => {
    if (!initialImage || !croppedAreaPixels) return onClose()
    const croppedImg = await getCroppedImg(
      initialImage,
      croppedAreaPixels,
      rotation,
      brightness[0],
      contrast[0],
      saturation[0]
    )
    onSave(croppedImg)
    onClose()
  }

  const handleReset = () => {
    setZoom(1)
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
          {/* Image Preview mit Cropper */}
          <div className="flex flex-1 justify-center items-center bg-gray-100 rounded-lg overflow-hidden">
            <div className="relative w-full min-w-[400px] h-full min-h-[400px]">
              <Cropper
                image={initialImage}
                crop={crop}
                zoom={zoom}
                rotation={rotation}
                aspect={1}
                onCropChange={setCrop}
                onZoomChange={setZoom}
                onRotationChange={setRotation}
                onCropComplete={handleCropComplete}
                cropShape="round"
                showGrid={false}
                style={{
                  containerStyle: { width: '100%', height: '100%' },
                  mediaStyle: {
                    filter: `brightness(${brightness[0]}%) contrast(${contrast[0]}%) saturate(${saturation[0]}%)`,
                  },
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
                  <Button size="sm" variant="outline" onClick={() => setRotation((prev) => (prev + 90) % 360)}>
                    <RotateCw className="mr-2 w-4 h-4" />
                    Rotate
                  </Button>
                </div>
                <div className="space-y-2">
                  <Label>Zoom: {Math.round(zoom * 100)}%</Label>
                  <Slider value={[zoom * 100]} onValueChange={v => setZoom(v[0] / 100)} min={50} max={200} step={1} className="w-full" />
                </div>
              </div>

              {/* Color Adjustments */}
              <div className="space-y-4">
                <h4 className="font-medium">Color & Light</h4>

                <div className="space-y-2">
                  <Label>Brightness: {brightness[0]}%</Label>
                  <Slider value={brightness} onValueChange={setBrightness} min={50} max={150} step={5} className="w-full" />
                </div>

                <div className="space-y-2">
                  <Label>Contrast: {contrast[0]}%</Label>
                  <Slider value={contrast} onValueChange={setContrast} min={50} max={150} step={5} className="w-full" />
                </div>

                <div className="space-y-2">
                  <Label>Saturation: {saturation[0]}%</Label>
                  <Slider value={saturation} onValueChange={setSaturation} min={0} max={200} step={10} className="w-full" />
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-2 pt-4 border-t">
                <Button onClick={handleSave} className="w-full">
                  Save Changes
                </Button>
                <Button onClick={handleReset} variant="outline" className="bg-transparent w-full">
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
