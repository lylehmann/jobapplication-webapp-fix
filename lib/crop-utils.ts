import { Area } from 'react-easy-crop'

export async function getCroppedImg(
  imageSrc: string,
  pixelCrop: Area,
  rotation = 0,
  brightness = 100,
  contrast = 100,
  saturation = 100
): Promise<string> {
  const image = await createImage(imageSrc)
  const canvas = document.createElement('canvas')
  const ctx = canvas.getContext('2d')!

  // Set canvas size to crop size
  canvas.width = pixelCrop.width
  canvas.height = pixelCrop.height

  ctx.save()
  ctx.filter = `brightness(${brightness}%) contrast(${contrast}%) saturate(${saturation}%)`

  // Draw the cropped area from the image
  ctx.drawImage(
    image,
    pixelCrop.x,
    pixelCrop.y,
    pixelCrop.width,
    pixelCrop.height,
    0,
    0,
    canvas.width,
    canvas.height
  )

  ctx.restore()

  // Make it round (avatar)
  ctx.globalCompositeOperation = 'destination-in'
  ctx.beginPath()
  ctx.arc(canvas.width / 2, canvas.height / 2, Math.min(canvas.width, canvas.height) / 2, 0, 2 * Math.PI)
  ctx.closePath()
  ctx.fill()

  return canvas.toDataURL('image/jpeg', 0.9)
}

function createImage(url: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const image = new window.Image()
    image.addEventListener('load', () => resolve(image))
    image.addEventListener('error', error => reject(error))
    image.setAttribute('crossOrigin', 'anonymous') // needed to avoid cross-origin issues on CodeSandbox
    image.src = url
  })
} 
