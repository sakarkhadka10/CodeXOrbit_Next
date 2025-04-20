'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'

interface ImagePreviewProps {
  src: string
  alt: string
  onImageError?: (defaultImage: string) => void
}

export default function ImagePreview({ src, alt, onImageError }: ImagePreviewProps) {
  const [imageSrc, setImageSrc] = useState(src)
  const defaultImage = '/img/frontendbg.png'

  // Update imageSrc when src prop changes
  useEffect(() => {
    setImageSrc(src)
  }, [src])

  return (
    <div className="relative h-60 w-full overflow-hidden rounded border border-gray-200">
      <Image
        src={imageSrc}
        alt={alt}
        fill
        className="object-cover w-full h-full"
        unoptimized={imageSrc.startsWith('http')}
        onError={() => {
          console.log('Image failed to load, using default image')
          setImageSrc(defaultImage)
          if (onImageError) {
            onImageError(defaultImage)
          }
        }}
      />
    </div>
  )
}
