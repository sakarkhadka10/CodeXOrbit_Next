'use client'

import { useState } from 'react'
import Image from 'next/image'

interface PopularPostImageProps {
  coverImage: string
  title: string
  category: string
}

export default function PopularPostImage({ coverImage, title, category }: PopularPostImageProps) {
  const [imageSrc, setImageSrc] = useState(coverImage || '/img/frontendbg.png')
  
  return (
    <div className="relative h-40 rounded-xl overflow-hidden bg-gray-900 shadow-md hover:shadow-lg transition-shadow">
      <Image
        src={imageSrc}
        alt={title}
        fill
        sizes="(max-width: 768px) 100vw, 300px"
        className="object-cover w-full h-full"
        unoptimized={imageSrc.startsWith('http')}
        onError={() => {
          console.log('Image failed to load, using default image')
          setImageSrc('/img/frontendbg.png')
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
      <span className="absolute top-3 left-3 px-3 py-1 text-xs font-medium text-white bg-indigo-600 rounded-full z-10">
        {category}
      </span>
    </div>
  )
}
