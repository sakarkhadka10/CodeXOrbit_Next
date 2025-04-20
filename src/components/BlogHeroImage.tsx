'use client'

import { useState } from 'react'
import Image from 'next/image'

interface BlogHeroImageProps {
  coverImage: string | null | undefined
  title: string
}

export default function BlogHeroImage({ coverImage, title }: BlogHeroImageProps) {
  const [imageSrc, setImageSrc] = useState(coverImage || '/img/frontendbg.png')

  return (
    <div className="relative h-[60vh] sm:h-[70vh] md:h-[80vh] w-full">
      <Image
        src={imageSrc}
        alt={title}
        fill
        sizes="(max-width: 1024px) 100vw, 75vw"
        className="object-cover w-full h-full"
        priority
        unoptimized={imageSrc.startsWith('http')}
        onError={() => {
          console.log('Image failed to load, using default image')
          setImageSrc('/img/frontendbg.png')
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent"></div>
    </div>
  )
}
