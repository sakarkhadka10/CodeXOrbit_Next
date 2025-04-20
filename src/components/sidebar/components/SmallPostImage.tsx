'use client'

import { useState } from 'react'
import Image from 'next/image'

interface SmallPostImageProps {
  coverImage: string
  title: string
}

export default function SmallPostImage({ coverImage, title }: SmallPostImageProps) {
  const [imageSrc, setImageSrc] = useState(coverImage || '/img/frontendbg.png')
  
  return (
    <div className="w-20 h-16 rounded-md overflow-hidden relative flex-shrink-0 shadow-sm group-hover:shadow-md transition-shadow">
      <Image
        src={imageSrc}
        alt={title}
        fill
        sizes="80px"
        className="object-cover w-full h-full"
        unoptimized={imageSrc.startsWith('http')}
        onError={() => {
          console.log('Image failed to load, using default image')
          setImageSrc('/img/frontendbg.png')
        }}
      />
    </div>
  )
}
