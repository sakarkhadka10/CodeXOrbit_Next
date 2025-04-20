'use client'

import { useState } from 'react'
import Image from 'next/image'

interface BlogPostCardImageProps {
  coverImage: string
  title: string
}

export default function BlogPostCardImage({ coverImage, title }: BlogPostCardImageProps) {
  const [imageSrc, setImageSrc] = useState(coverImage || '/img/frontendbg.png')
  
  return (
    <div className="aspect-[16/9] w-full h-56 md:h-full relative">
      <Image
        src={imageSrc}
        alt={title}
        fill
        className="object-cover transition-transform duration-500 group-hover:scale-110"
        unoptimized={imageSrc.startsWith('http')}
        onError={() => {
          console.log('Image failed to load, using default image')
          setImageSrc('/img/frontendbg.png')
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-gray-900/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
    </div>
  )
}
