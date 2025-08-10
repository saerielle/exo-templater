export interface ImageOptions {
  width?: number
  height?: number
  shape: 'rectangle' | 'circle'
  fillColor: string
  strokeColor?: string
  strokeWidth?: number
  text: string
  textColor?: string
  fontSize?: number
  fontFamily?: string
}

export async function generateImage(options: ImageOptions): Promise<Blob> {
  const {
    width = 200,
    height = 200,
    shape,
    fillColor,
    strokeColor,
    strokeWidth = 2,
    text,
    textColor = '#000000',
    fontSize = 16,
    fontFamily = 'Arial'
  } = options

  const canvas = document.createElement('canvas')
  canvas.width = width
  canvas.height = height
  const ctx = canvas.getContext('2d')!

  ctx.clearRect(0, 0, width, height)

  ctx.fillStyle = fillColor
  if (strokeColor) {
    ctx.strokeStyle = strokeColor
    ctx.lineWidth = strokeWidth
  }

  drawShape(ctx, shape, width, height)

  ctx.fill()

  if (strokeColor) {
    ctx.stroke()
  }

  ctx.fillStyle = textColor
  ctx.font = `${fontSize}px ${fontFamily}`
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'

  const lines = text.split('\n')
  const lineHeight = fontSize * 1.2
  const totalTextHeight = lines.length * lineHeight
  const startY = (height - totalTextHeight) / 2 + lineHeight / 2

  lines.forEach((line, index) => {
    ctx.fillText(line, width / 2, startY + index * lineHeight)
  })

  return new Promise<Blob>((resolve) => {
    canvas.toBlob((blob) => {
      if (blob) {
        resolve(blob)
      } else {
        const dataUrl = canvas.toDataURL('image/png')
        const byteString = atob(dataUrl.split(',')[1])
        const ab = new ArrayBuffer(byteString.length)
        const ia = new Uint8Array(ab)
        for (let i = 0; i < byteString.length; i++) {
          ia[i] = byteString.charCodeAt(i)
        }
        resolve(new Blob([ab], { type: 'image/png' }))
      }
    }, 'image/png')
  })
}

function drawShape(
  ctx: CanvasRenderingContext2D,
  shape: string,
  width: number,
  height: number
): void {
  const centerX = width / 2
  const centerY = height / 2
  const margin = 0

  ctx.beginPath()

  switch (shape) {
    case 'rectangle':
      ctx.rect(margin, margin, width - 2 * margin, height - 2 * margin)
      break

    case 'circle':
      const radius = Math.min(width, height) / 2 - margin
      ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI)
      break

  }
}
