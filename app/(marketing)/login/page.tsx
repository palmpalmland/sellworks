'use client'

import AuthForm from '@/components/AuthForm'

export default function LoginPage() {
  return (
    <div className="section-space">
      <div className="page-shell grid gap-8 lg:grid-cols-[0.92fr_1.08fr]">
        <section className="panel-strong rounded-[2.2rem] p-8 md:p-10">
          <div className="eyebrow">Access Sellworks</div>
          <h1 className="headline mt-6 text-4xl font-black text-white md:text-6xl">
            Sign in to your Sellworks workspace
          </h1>
          <p className="mt-6 max-w-xl text-lg leading-8 text-white/62">
            Public pages explain the product. Your private Sellworks workspace is where
            you generate product listing copy, Amazon-ready images, and TikTok ad creatives.
          </p>
        </section>

        <AuthForm />
      </div>
    </div>
  )
}
