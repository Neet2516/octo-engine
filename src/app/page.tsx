'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import HeroSection from '@/components/landing/HeroSection'
import HowItWorks from '@/components/landing/HowItWorks'
import FeatureGrid from '@/components/landing/FeatureGrid'
import CtaBanner from '@/components/landing/CtaBanner'

export default function HomePage() {
  return (
    <main className="min-h-screen bg-[#0f0f13] text-white font-sans">
      <HeroSection />
      <HowItWorks />
      <FeatureGrid />
      <CtaBanner />
    </main>
  )
}
