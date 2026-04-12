'use client'

import Link from 'next/link'
import { useEffect, useMemo, useState } from 'react'
import { useParams } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import type {
  ProjectAssetRecord,
  ProjectOutputRecord,
  ProjectRecord,
} from '@/lib/project-types'

type ProjectResponse = {
  project: ProjectRecord
  outputs: ProjectOutputRecord[]
  assets: ProjectAssetRecord[]
}

const platformSections = ['Amazon', 'Shopify', 'Etsy', 'TikTok']

export default function ProjectDetailPage() {
  const params = useParams<{ id: string }>()
  const [projectData, setProjectData] = useState<ProjectResponse | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [openPlatform, setOpenPlatform] = useState('Amazon')

  useEffect(() => {
    let cancelled = false

    const loadProject = async () => {
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession()

        const accessToken = session?.access_token

        if (!accessToken) {
          setError('Please log in first')
          return
        }

        const res = await fetch(`/api/projects/${params.id}`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        })

        const json = await res.json()

        if (!res.ok) {
          if (!cancelled) {
            setError(json.error || 'Failed to load project')
          }
          return
        }

        if (!cancelled) {
          const data = json.data as ProjectResponse
          setProjectData(data)
          if (data.project.platform) {
            setOpenPlatform(data.project.platform)
          }
        }
      } catch (err: unknown) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : 'Failed to load project')
        }
      } finally {
        if (!cancelled) {
          setLoading(false)
        }
      }
    }

    if (params.id) {
      loadProject()
    }

    return () => {
      cancelled = true
    }
  }, [params.id])

  const derived = useMemo(() => {
    if (!projectData) return null

    const copyOutput = projectData.outputs.find((item) => item.output_type === 'copy')
    const imagePromptOutput = projectData.outputs.find((item) => item.output_type === 'image_prompt')
    const imageOutput = projectData.outputs.find((item) => item.output_type === 'image')
    const videoOutput = projectData.outputs.find((item) => item.output_type === 'video')

    return {
      copyOutput,
      imagePromptList: Array.isArray(imagePromptOutput?.meta?.prompts)
        ? (imagePromptOutput?.meta?.prompts as Array<{ title?: string; prompt?: string }>)
        : [],
      generatedImages: Array.isArray(imageOutput?.meta?.images)
        ? (imageOutput?.meta?.images as Array<{
            title?: string
            prompt?: string
            url?: string | null
            error?: string
          }>)
        : [],
      videoTasks: Array.isArray(videoOutput?.meta?.tasks)
        ? (videoOutput?.meta?.tasks as Array<{
            id?: string
            title?: string
            prompt?: string
            status?: string
            resultUrl?: string | null
            note?: string
          }>)
        : [],
      productImageAssets: projectData.assets.filter((item) => item.asset_type === 'product_image'),
      referenceVideoAssets: projectData.assets.filter((item) => item.asset_type === 'reference_video'),
    }
  }, [projectData])

  if (loading) {
    return <main className="py-10 text-white/60">Loading project...</main>
  }

  if (!projectData || !derived) {
    return (
      <main className="py-10">
        <div className="rounded-[1.5rem] border border-red-400/20 bg-red-400/10 px-5 py-4 text-sm text-red-100">
          {error || 'Project not found'}
        </div>
      </main>
    )
  }

  return (
    <main className="space-y-5 py-1">
      <section className="panel-strong rounded-[1.8rem] p-6 md:p-8">
        <div className="flex flex-col gap-5 xl:flex-row xl:items-start xl:justify-between">
          <div>
            <div className="text-xs font-bold uppercase tracking-[0.2em] text-white/40">Project workspace</div>
            <h1 className="mt-4 text-4xl font-bold tracking-tight text-white md:text-5xl">
              {projectData.project.product_name}
            </h1>
            <div className="mt-4 flex flex-wrap items-center gap-2">
              <div className="rounded-full border border-cyan-300/18 bg-cyan-300/10 px-3 py-1 text-xs font-bold uppercase tracking-[0.16em] text-cyan-100">
                {projectData.project.platform}
              </div>
              <div className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-xs font-bold uppercase tracking-[0.16em] text-white/60">
                {projectData.project.status}
              </div>
              <div className="text-xs uppercase tracking-[0.16em] text-white/35">
                {new Date(projectData.project.created_at).toLocaleString()}
              </div>
            </div>
          </div>

          <div className="flex flex-wrap gap-3">
            <Link href="/generate" className="cta-primary text-sm">
              New Project
            </Link>
            <Link href="/projects" className="cta-secondary text-sm">
              Back to Projects
            </Link>
          </div>
        </div>
      </section>

      <section className="grid gap-5 xl:grid-cols-[0.95fr_1.05fr]">
        <div className="panel rounded-[1.8rem] p-6 md:p-7">
          <div className="text-2xl font-bold text-white">Product brief</div>
          <div className="mt-6 space-y-5">
            <div>
              <div className="text-xs uppercase tracking-[0.18em] text-white/36">Product name</div>
              <div className="mt-2 text-lg font-semibold text-white">{projectData.project.product_name}</div>
            </div>
            <div>
              <div className="text-xs uppercase tracking-[0.18em] text-white/36">Product URL</div>
              <div className="mt-2 break-all text-sm leading-7 text-white/62">
                {projectData.project.product_url || 'No source URL saved for this project.'}
              </div>
            </div>
            <div>
              <div className="text-xs uppercase tracking-[0.18em] text-white/36">Selling points</div>
              <div className="mt-2 whitespace-pre-wrap text-sm leading-7 text-white/66">
                {projectData.project.selling_points}
              </div>
            </div>
          </div>
        </div>

        <div className="panel rounded-[1.8rem] p-6 md:p-7">
          <div className="text-2xl font-bold text-white">Source assets</div>
          <div className="mt-6 grid gap-5 md:grid-cols-2">
            <div className="rounded-[1.4rem] border border-white/8 bg-white/[0.02] p-4">
              <div className="text-xs uppercase tracking-[0.18em] text-white/36">Product images</div>
              <div className="mt-4 grid gap-3">
                {derived.productImageAssets.length > 0 ? (
                  derived.productImageAssets.map((item) => (
                    <div key={item.id} className="overflow-hidden rounded-[1rem] border border-white/8 bg-black/20">
                      {item.signed_url ? (
                        <img src={item.signed_url} alt={item.file_name || 'Product image'} className="aspect-square w-full object-cover" />
                      ) : (
                        <div className="px-4 py-10 text-center text-sm text-white/45">Preview unavailable</div>
                      )}
                    </div>
                  ))
                ) : (
                  <div className="text-sm text-white/50">No product images uploaded yet.</div>
                )}
              </div>
            </div>

            <div className="rounded-[1.4rem] border border-white/8 bg-white/[0.02] p-4">
              <div className="text-xs uppercase tracking-[0.18em] text-white/36">Reference videos</div>
              <div className="mt-4 grid gap-3">
                {derived.referenceVideoAssets.length > 0 ? (
                  derived.referenceVideoAssets.map((item) => (
                    <a
                      key={item.id}
                      href={item.signed_url || '#'}
                      target="_blank"
                      rel="noreferrer"
                      className="rounded-[1rem] border border-white/8 bg-black/20 px-4 py-4 text-sm text-white/72 transition hover:bg-white/[0.04]"
                    >
                      {item.file_name || 'Reference video'}
                    </a>
                  ))
                ) : (
                  <div className="text-sm text-white/50">No reference videos uploaded yet.</div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="space-y-4">
        {platformSections.map((platformName) => {
          const isPrimary = platformName.toLowerCase() === projectData.project.platform.toLowerCase()
          const isOpen = openPlatform === platformName

          return (
            <article key={platformName} className="panel overflow-hidden rounded-[1.8rem]">
              <button
                type="button"
                onClick={() => setOpenPlatform((current) => (current === platformName ? '' : platformName))}
                className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left"
              >
                <div>
                  <div className="text-lg font-semibold text-white">{platformName}</div>
                  <div className="mt-1 text-sm text-white/48">
                    {isPrimary
                      ? 'Primary project channel with generated copy, images, and video.'
                      : 'Reuse this project to adapt outputs for another ecommerce channel.'}
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  {isPrimary ? (
                    <div className="rounded-full border border-cyan-300/18 bg-cyan-300/10 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.16em] text-cyan-100">
                      Current
                    </div>
                  ) : null}
                  <div className="text-white/50">{isOpen ? '−' : '+'}</div>
                </div>
              </button>

              {isOpen && (
                <div className="border-t border-white/6 px-6 py-6">
                  {isPrimary ? (
                    <div className="grid gap-5">
                      <div className="rounded-[1.4rem] border border-white/8 bg-white/[0.02] p-5">
                        <div className="text-xs uppercase tracking-[0.18em] text-white/36">Copy</div>
                        <div className="mt-4 whitespace-pre-wrap text-sm leading-7 text-white/72">
                          {derived.copyOutput?.content || 'No copy was generated for this project yet.'}
                        </div>
                      </div>

                      <div className="rounded-[1.4rem] border border-white/8 bg-white/[0.02] p-5">
                        <div className="text-xs uppercase tracking-[0.18em] text-white/36">Images</div>
                        <div className="mt-4 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                          {derived.generatedImages.length > 0 ? (
                            derived.generatedImages.map((image, index) => (
                              <div key={`${image.title}-${index}`} className="rounded-[1.2rem] border border-white/8 bg-black/20 p-4">
                                <div className="text-sm font-semibold text-white">{image.title || `Image ${index + 1}`}</div>
                                {image.url ? (
                                  <img src={image.url} alt={image.title || `Image ${index + 1}`} className="mt-4 aspect-square w-full rounded-[1rem] object-cover" />
                                ) : (
                                  <div className="mt-4 rounded-[1rem] border border-dashed border-white/10 px-4 py-10 text-center text-sm text-white/45">
                                    {image.error || 'No image preview available yet.'}
                                  </div>
                                )}
                                <div className="mt-3 text-xs leading-6 text-white/45">{image.prompt}</div>
                              </div>
                            ))
                          ) : (
                            <div className="text-sm text-white/50">No images were generated for this project yet.</div>
                          )}
                        </div>
                      </div>

                      <div className="rounded-[1.4rem] border border-white/8 bg-white/[0.02] p-5">
                        <div className="text-xs uppercase tracking-[0.18em] text-white/36">Video</div>
                        <div className="mt-4 grid gap-4">
                          {derived.videoTasks.length > 0 ? (
                            derived.videoTasks.map((task, index) => (
                              <div key={task.id || `${task.title}-${index}`} className="rounded-[1.2rem] border border-white/8 bg-black/20 p-4">
                                <div className="flex items-center justify-between gap-3">
                                  <div className="text-sm font-semibold text-white">{task.title || `Video ${index + 1}`}</div>
                                  <div className="text-xs uppercase tracking-[0.16em] text-white/45">{task.status || 'pending'}</div>
                                </div>
                                <div className="mt-3 text-sm leading-7 text-white/66">{task.prompt}</div>
                                {task.resultUrl ? (
                                  <video src={task.resultUrl} controls className="mt-4 w-full rounded-[1rem] border border-white/8 bg-black/30" />
                                ) : null}
                                <div className="mt-3 text-xs text-white/40">{task.note || 'No execution note yet.'}</div>
                              </div>
                            ))
                          ) : (
                            <div className="text-sm text-white/50">No video was generated for this project yet.</div>
                          )}
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="rounded-[1.4rem] border border-dashed border-white/10 bg-white/[0.02] p-5">
                      <div className="text-lg font-semibold text-white">Adapt for {platformName}</div>
                      <p className="mt-3 max-w-2xl text-sm leading-7 text-white/58">
                        This project was originally built for {projectData.project.platform}. You can use the product brief above as the source and create a platform-specific version for {platformName} next.
                      </p>
                      <Link href="/generate" className="cta-secondary mt-5 text-sm">
                        Create {platformName} Version
                      </Link>
                    </div>
                  )}
                </div>
              )}
            </article>
          )
        })}
      </section>
    </main>
  )
}
