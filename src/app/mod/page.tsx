'use client'

import dynamic from 'next/dynamic'

import LoadingSpinner from '../../components/ui/LoadingSpinner'

const ModCreatorRouter = dynamic(() => import('../../components/ModCreatorRouter'), {
  ssr: false,
  loading: () => <LoadingSpinner />
})

export default function ModPage() {
  return <ModCreatorRouter />
}
