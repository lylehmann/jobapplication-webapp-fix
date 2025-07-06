"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Upload, Edit, X, Camera, ImageIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { ImageEditor } from "./image-editor"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

interface ProfilePictureManagerProps {
  currentImage?: string
  onImageChange: (image: string) => void
  size?: "sm" | "md" | "lg"
}

export function ProfilePictureManager({ currentImage, onImageChange, size = "md" }: ProfilePictureManagerProps) {
  const [isEditorOpen, setIsEditorOpen] = useState(false)
  const [tempImage, setTempImage] = useState<string>("")
  const fileInputRef = useRef<HTMLInputElement>(null)

  const sizeClasses = {
    sm: "w-20 h-20",
    md: "w-32 h-32",
    lg: "w-40 h-40",
  }

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        const result = e.target?.result as string
        setTempImage(result)
        setIsEditorOpen(true)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleImageSave = (editedImage: string) => {
    onImageChange(editedImage)
    setIsEditorOpen(false)
    setTempImage("")
  }

  const handleRemoveImage = () => {
    onImageChange("")
  }

  const triggerFileInput = () => {
    fileInputRef.current?.click()
  }

  return (
    <div className="space-y-4">
      <Label>Profile Picture</Label>

      <div className="flex flex-col items-center space-y-4">
        {/* Profile Picture Display */}
        <div className="relative group">
          <div
            className={`${sizeClasses[size]} rounded-full bg-gray-200 border-2 border-dashed border-gray-300 flex items-center justify-center overflow-hidden`}
          >
            {currentImage ? (
              <img
                src={currentImage || "/placeholder.svg"}
                alt="Profile"
                className="w-full h-full object-cover rounded-full"
              />
            ) : (
              <div className="text-gray-400 text-center">
                <Camera className="w-8 h-8 mx-auto mb-2" />
                <span className="text-xs">No Image</span>
              </div>
            )}
          </div>

          {/* Quick Edit Button */}
          {currentImage && (
            <Button
              size="sm"
              className="absolute -bottom-2 -right-2 rounded-full w-8 h-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
              onClick={() => {
                setTempImage(currentImage)
                setIsEditorOpen(true)
              }}
            >
              <Edit className="w-4 h-4" />
            </Button>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button size="sm" variant="outline">
                <Upload className="w-4 h-4 mr-2" />
                Upload
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={triggerFileInput}>
                <ImageIcon className="w-4 h-4 mr-2" />
                From Computer
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => {
                  /* Handle camera */
                }}
              >
                <Camera className="w-4 h-4 mr-2" />
                Take Photo
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {currentImage && (
            <>
              <Button
                size="sm"
                variant="outline"
                onClick={() => {
                  setTempImage(currentImage)
                  setIsEditorOpen(true)
                }}
              >
                <Edit className="w-4 h-4 mr-2" />
                Edit
              </Button>
              <Button size="sm" variant="outline" onClick={handleRemoveImage}>
                <X className="w-4 h-4" />
              </Button>
            </>
          )}
        </div>
      </div>

      {/* Hidden File Input */}
      <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />

      {/* Image Editor Modal */}
      <ImageEditor
        isOpen={isEditorOpen}
        onClose={() => {
          setIsEditorOpen(false)
          setTempImage("")
        }}
        onSave={handleImageSave}
        initialImage={tempImage}
      />
    </div>
  )
}
