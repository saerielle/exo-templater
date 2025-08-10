'use client'

import { useEffect } from 'react'

import dynamic from 'next/dynamic'
import { useRouter, useSearchParams } from 'next/navigation'

import LoadingSpinner from '../components/ui/LoadingSpinner'

const HomePageContent = () => {
  const router = useRouter()
  const searchParams = useSearchParams()

  useEffect(() => {
    const projectId = searchParams.get('projectId')
    const content = searchParams.get('content') || 'dashboard'

    if (projectId) {
      router.replace(`/mod?projectId=${projectId}&content=${content}`)
    } else {
      router.replace('/mod')
    }
  }, [router, searchParams])

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">ExoLoader Mod Templater</h1>
        <p className="text-gray-600">Loading...</p>
      </div>
    </div>
  )
}

const HomePage = dynamic(() => Promise.resolve(HomePageContent), {
  ssr: false,
  loading: () => <LoadingSpinner />
})

export default HomePage
