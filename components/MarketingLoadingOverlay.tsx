'use client'

import { useEffect, useState } from 'react'

type MarketingLoadingOverlayProps = {
  isVisible: boolean
  onComplete: () => void
}

const steps = [
  'Analyzing product...',
  'Writing high-converting copy...',
  'Generating product images...',
  'Creating video...',
]

export default function MarketingLoadingOverlay({
  isVisible,
  onComplete,
}: MarketingLoadingOverlayProps) {
  const [currentStep, setCurrentStep] = useState(0)

  useEffect(() => {
    if (!isVisible) {
      setCurrentStep(0)
      return
    }

    const interval = window.setInterval(() => {
      setCurrentStep((prev) => {
        if (prev < steps.length - 1) {
          return prev + 1
        }

        window.clearInterval(interval)
        window.setTimeout(onComplete, 900)
        return prev
      })
    }, 1300)

    return () => window.clearInterval(interval)
  }, [isVisible, onComplete])

  if (!isVisible) {
    return null
  }

  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center bg-background/95 backdrop-blur-xl">
      <div className="w-full max-w-md px-6 text-center">
        <div className="mb-12 flex justify-center">
          <div className="relative h-24 w-24">
            <div className="absolute inset-0 rounded-full bg-[#6C5CE7]/20 blur-2xl" />
            <div className="absolute inset-0 rounded-full border-[3px] border-white/10" />
            <div className="absolute inset-0 rounded-full border-[3px] border-transparent border-t-[#6C5CE7] animate-spin" />
          </div>
        </div>

        <h2 className="mb-8 text-2xl font-bold tracking-tight text-white">
          Generating your content kit...
        </h2>

        <div className="space-y-4">
          {steps.map((step, index) => (
            <div
              key={step}
              className={`flex items-center gap-3 text-left font-medium transition-opacity ${
                index <= currentStep ? 'opacity-100' : 'opacity-30'
              }`}
            >
              {index < currentStep ? (
                <div className="flex h-5 w-5 items-center justify-center rounded-full border border-green-500/40 bg-green-500/10 text-green-400">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className="h-3.5 w-3.5">
                    <path d="M20 6 9 17l-5-5" />
                  </svg>
                </div>
              ) : index === currentStep ? (
                <div className="h-5 w-5 rounded-full border-2 border-transparent border-t-[#6C5CE7] animate-spin" />
              ) : (
                <div className="h-5 w-5 rounded-full border-2 border-white/10" />
              )}
              <span className={index === currentStep ? 'text-white' : 'text-[#A0A0B2]'}>
                {step}
              </span>
            </div>
          ))}
        </div>

        <div className="mt-12 grid grid-cols-2 gap-4 opacity-20 blur-[1px]">
          <div className="aspect-video rounded-xl border border-white/6 bg-white/[0.03]" />
          <div className="aspect-square rounded-xl border border-white/6 bg-white/[0.03]" />
        </div>
      </div>
    </div>
  )
}
