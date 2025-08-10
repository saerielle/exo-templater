'use client'

import { useEffect, useState } from 'react'
import ModCreatorRouter from '../components/ModCreatorRouter'

export default function Home() {
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  if (!isClient) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading ExoLoader Mod Creator...</p>
        </div>
      </div>
    )
  }

  return <ModCreatorRouter />
}
