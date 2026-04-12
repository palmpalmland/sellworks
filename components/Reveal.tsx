'use client'

import { useEffect, useRef, useState } from 'react'

type RevealVariant = 'fade-up' | 'pop-in' | 'slide-left' | 'slide-right'

type RevealProps = {
  children: React.ReactNode
  className?: string
  delayMs?: number
  variant?: RevealVariant
}

const variantClassMap: Record<RevealVariant, string> = {
  'fade-up': 'reveal-fade-up',
  'pop-in': 'reveal-pop-in',
  'slide-left': 'reveal-slide-left',
  'slide-right': 'reveal-slide-right',
}

export default function Reveal({
  children,
  className = '',
  delayMs = 0,
  variant = 'fade-up',
}: RevealProps) {
  const ref = useRef<HTMLDivElement | null>(null)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const node = ref.current
    if (!node) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
          observer.disconnect()
        }
      },
      {
        threshold: 0.18,
        rootMargin: '0px 0px -8% 0px',
      }
    )

    observer.observe(node)
    return () => observer.disconnect()
  }, [])

  return (
    <div
      ref={ref}
      className={`${className} ${isVisible ? variantClassMap[variant] : 'opacity-0'}`.trim()}
      style={{ animationDelay: `${delayMs}ms` }}
    >
      {children}
    </div>
  )
}
