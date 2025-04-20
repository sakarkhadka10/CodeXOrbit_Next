'use client'

import { useState } from 'react'
import Image from 'next/image'

interface BlogPostImageProps {
  coverImage: string
  title: string
}

export default function BlogPostImage({ coverImage, title }: BlogPostImageProps) {
  const [imageSrc, setImageSrc] = useState(coverImage || '/img/frontendbg.png')
  
  return (
    <div className="relative h-64 md:w-2/5 overflow-hidden flex-shrink-0">
      <Image
        src={imageSrc}
        alt={title}
        fill
        sizes="(max-width: 768px) 100vw, 40vw"
        className="object-cover transition-transform duration-500 group-hover:scale-105 w-full h-full"
        unoptimized={imageSrc.startsWith('http')}
        onError={() => {
          console.log('Image failed to load, using default image')
          setImageSrc('/img/frontendbg.png')
        }}
      />
    </div>
  )
}
