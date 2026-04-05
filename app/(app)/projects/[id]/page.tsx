'use client'

import { useEffect, useState } from 'react'
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

export default function ProjectDetailPage() {
  const params = useParams<{ id: string }>()
  const [projectData, setProjectData] = useState<ProjectResponse | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

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
          setProjectData(json.data)
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

  if (loading) {
    return <main className="py-10 text-white/60">Loading project...</main>
  }

  if (!projectData) {
    return (
      <main className="py-10">
        <div className="rounded-[1.5rem] border border-red-400/20 bg-red-400/10 px-5 py-4 text-sm text-red-100">
          {error || 'Project not found'}
        </div>
      </main>
    )
  }

  const copyOutput = projectData.outputs.find((item) => item.output_type === 'copy')
  const imagePromptOutput = projectData.outputs.find((item) => item.output_type === 'image_prompt')
  const imageOutput = projectData.outputs.find((item) => item.output_type === 'image')
  const videoOutput = projectData.outputs.find((item) => item.output_type === 'video')
  const imagePromptList = Array.isArray(imagePromptOutput?.meta?.prompts)
    ? (imagePromptOutput?.meta?.prompts as Array<{ title?: string; prompt?: string }>)
    : []
  const generatedImages = Array.isArray(imageOutput?.meta?.images)
    ? (imageOutput?.meta?.images as Array<{
        title?: string
        prompt?: string
        url?: string | null
        revisedPrompt?: string
        error?: string
      }>)
    : []
  const videoPromptList = Array.isArray(videoOutput?.meta?.prompts)
    ? (videoOutput?.meta?.prompts as Array<{
        title?: string
        prompt?: string
        shotPlan?: string
      }>)
    : []
  const videoTasks = Array.isArray(videoOutput?.meta?.tasks)
    ? (videoOutput?.meta?.tasks as Array<{
        id?: string
        title?: string
        prompt?: string
        shotPlan?: string
        status?: string
        provider?: string | null
        model?: string | null
        resultUrl?: string | null
        note?: string
      }>)
    : []
  const productImageAssets = projectData.assets.filter((item) => item.asset_type === 'product_image')
  const referenceVideoAssets = projectData.assets.filter((item) => item.asset_type === 'reference_video')

  return (
    <main className="space-y-6 py-2">
      <section className="panel-strong rounded-[2.2rem] p-8 md:p-10">
        <div className="eyebrow">Project Result</div>
        <h1 className="headline mt-6 text-4xl font-black text-white md:text-6xl">
          {projectData.project.product_name}
        </h1>
        <p className="mt-5 max-w-3xl text-lg leading-8 text-white/62">
          Platform: {projectData.project.platform} | Style: {projectData.project.style || 'default'} | Status: {projectData.project.status}
        </p>
      </section>

      <section className="panel rounded-[2rem] p-6 md:p-8">
        <div className="text-xs uppercase tracking-[0.2em] text-white/36">Copy</div>
        <div className="mt-5 whitespace-pre-wrap rounded-[1.5rem] border border-white/8 bg-white/4 p-5 text-sm leading-7 text-white/74">
          {copyOutput?.content || 'Copy was not requested for this project.'}
        </div>
      </section>

      <section className="panel rounded-[2rem] p-6 md:p-8">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div className="text-xs uppercase tracking-[0.2em] text-white/36">Images</div>
          <div className="text-xs uppercase tracking-[0.18em] text-white/35">
            Mode: {typeof imageOutput?.meta?.generationMode === 'string' ? imageOutput.meta.generationMode : 'pending'}
          </div>
        </div>
        <div className="mt-5 space-y-5">
          <div className="rounded-[1.5rem] border border-white/8 bg-white/4 p-5 text-sm leading-7 text-white/60">
            {typeof imageOutput?.meta?.note === 'string'
              ? imageOutput.meta.note
              : imageOutput
                ? 'Image generation placeholder created.'
                : 'Images were not requested for this project.'}
          </div>

          <div className="rounded-[1.5rem] border border-white/8 bg-white/4 p-5">
            <div className="text-xs uppercase tracking-[0.2em] text-white/36">Uploaded Product Images</div>
            <div className="mt-4 grid gap-4 md:grid-cols-3">
              {productImageAssets.length > 0 ? (
                productImageAssets.map((item) => (
                  <div key={item.id} className="rounded-[1.2rem] border border-white/8 bg-black/18 p-4">
                    {item.signed_url ? (
                      <img
                        src={item.signed_url}
                        alt={item.file_name || 'Product reference image'}
                        className="aspect-square w-full rounded-[1rem] object-cover"
                      />
                    ) : (
                      <div className="rounded-[1rem] border border-dashed border-white/10 px-4 py-10 text-center text-sm text-white/45">
                        Preview unavailable
                      </div>
                    )}
                    <div className="mt-3 text-xs text-white/45">{item.file_name || 'Unnamed asset'}</div>
                  </div>
                ))
              ) : (
                <div className="text-sm text-white/50">No product images uploaded for this project.</div>
              )}
            </div>
          </div>

          <div className="rounded-[1.5rem] border border-white/8 bg-white/4 p-5">
            <div className="text-xs uppercase tracking-[0.2em] text-white/36">Image Prompts</div>
            <div className="mt-4 space-y-4">
              {imagePromptList.length > 0 ? (
                imagePromptList.map((item, index) => (
                  <div key={`${item.title}-${index}`} className="rounded-[1.2rem] border border-white/8 bg-black/18 p-4">
                    <div className="text-sm font-semibold text-white">
                      {item.title || `Prompt ${index + 1}`}
                    </div>
                    <div className="mt-3 whitespace-pre-wrap text-sm leading-7 text-white/62">
                      {item.prompt}
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-sm text-white/50">
                  {imageOutput ? 'No image prompts generated yet.' : 'No image prompts because images were not requested.'}
                </div>
              )}
            </div>
          </div>

          <div className="rounded-[1.5rem] border border-white/8 bg-white/4 p-5">
            <div className="text-xs uppercase tracking-[0.2em] text-white/36">Generated Images</div>
            <div className="mt-4 grid gap-4 md:grid-cols-2">
              {generatedImages.length > 0 ? (
                generatedImages.map((item, index) => (
                  <div key={`${item.title}-${index}`} className="rounded-[1.2rem] border border-white/8 bg-black/18 p-4">
                    <div className="text-sm font-semibold text-white">
                      {item.title || `Image ${index + 1}`}
                    </div>
                    {item.url ? (
                      <img
                        src={item.url}
                        alt={item.title || `Generated image ${index + 1}`}
                        className="mt-4 aspect-square w-full rounded-[1rem] object-cover"
                      />
                    ) : (
                      <div className="mt-4 rounded-[1rem] border border-dashed border-white/10 px-4 py-10 text-center text-sm text-white/45">
                        {item.error || 'No image preview available yet.'}
                      </div>
                    )}
                    <div className="mt-3 whitespace-pre-wrap text-xs leading-6 text-white/45">
                      {item.prompt}
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-sm text-white/50">
                  {imageOutput ? 'No generated images yet.' : 'No generated images because images were not requested.'}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      <section className="panel rounded-[2rem] p-6 md:p-8">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div className="text-xs uppercase tracking-[0.2em] text-white/36">Video</div>
          <div className="text-xs uppercase tracking-[0.18em] text-white/35">
            Uploaded references: {referenceVideoAssets.length} | Tasks: {videoTasks.length} | Duration: {typeof videoOutput?.meta?.duration === 'number' ? `${videoOutput.meta.duration}s` : 'default'}
          </div>
        </div>
        {typeof videoOutput?.meta?.description === 'string' && videoOutput.meta.description.trim() && (
          <div className="mt-5 rounded-[1.5rem] border border-white/8 bg-white/4 p-5 text-sm leading-7 text-white/60">
            Video description: {videoOutput.meta.description}
          </div>
        )}
        <div className="mt-5 rounded-[1.5rem] border border-white/8 bg-white/4 p-5 text-sm leading-7 text-white/60">
          {typeof videoOutput?.meta?.note === 'string'
            ? videoOutput.meta.note
            : videoOutput
              ? 'Video generation placeholder created.'
              : 'Video was not requested for this project.'}
        </div>
        <div className="mt-5 rounded-[1.5rem] border border-white/8 bg-white/4 p-5">
          <div className="text-xs uppercase tracking-[0.2em] text-white/36">Video Prompts</div>
          <div className="mt-4 space-y-4">
            {videoPromptList.length > 0 ? (
              videoPromptList.map((item, index) => (
                <div key={`${item.title}-${index}`} className="rounded-[1.2rem] border border-white/8 bg-black/18 p-4">
                  <div className="text-sm font-semibold text-white">
                    {item.title || `Video Prompt ${index + 1}`}
                  </div>
                  <div className="mt-3 whitespace-pre-wrap text-sm leading-7 text-white/62">
                    {item.prompt}
                  </div>
                  {item.shotPlan && (
                    <div className="mt-3 whitespace-pre-wrap rounded-[1rem] border border-white/8 bg-white/4 px-4 py-3 text-xs leading-6 text-white/50">
                      Shot plan: {item.shotPlan}
                    </div>
                  )}
                </div>
              ))
            ) : (
              <div className="text-sm text-white/50">
                {videoOutput ? 'No video prompts generated yet.' : 'No video prompts because video was not requested.'}
              </div>
            )}
          </div>
        </div>
        <div className="mt-5 rounded-[1.5rem] border border-white/8 bg-white/4 p-5">
          <div className="text-xs uppercase tracking-[0.2em] text-white/36">Video Tasks</div>
          <div className="mt-4 space-y-4">
            {videoTasks.length > 0 ? (
              videoTasks.map((item, index) => (
                <div key={item.id || `${item.title}-${index}`} className="rounded-[1.2rem] border border-white/8 bg-black/18 p-4">
                  <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                    <div className="text-sm font-semibold text-white">
                      {item.title || `Video Task ${index + 1}`}
                    </div>
                    <div className="text-xs uppercase tracking-[0.18em] text-white/45">
                      {item.status || 'pending'}
                    </div>
                  </div>
                  <div className="mt-3 whitespace-pre-wrap text-sm leading-7 text-white/62">
                    {item.prompt}
                  </div>
                  {item.shotPlan && (
                    <div className="mt-3 whitespace-pre-wrap text-xs leading-6 text-white/50">
                      Shot plan: {item.shotPlan}
                    </div>
                  )}
                  <div className="mt-3 text-xs text-white/40">
                    {item.note || 'No execution note yet.'}
                  </div>
                  {item.resultUrl && (
                    <video
                      src={item.resultUrl}
                      controls
                      className="mt-4 w-full rounded-[1rem] border border-white/8 bg-black/30"
                    />
                  )}
                </div>
              ))
            ) : (
              <div className="text-sm text-white/50">
                {videoOutput ? 'No video tasks yet.' : 'No video tasks because video was not requested.'}
              </div>
            )}
          </div>
        </div>
        {referenceVideoAssets.length > 0 && (
          <div className="mt-5 space-y-3">
            {referenceVideoAssets.map((item) => (
              <a
                key={item.id}
                href={item.signed_url || '#'}
                target="_blank"
                rel="noreferrer"
                className="block rounded-[1.2rem] border border-white/8 bg-black/18 px-4 py-4 text-sm text-white/70"
              >
                {item.file_name || 'Reference video'}
              </a>
            ))}
          </div>
        )}
      </section>

      <section className="panel rounded-[2rem] p-6 md:p-8">
        <div className="text-xs uppercase tracking-[0.2em] text-white/36">Input Summary</div>
        <div className="mt-5 whitespace-pre-wrap rounded-[1.5rem] border border-white/8 bg-white/4 p-5 text-sm leading-7 text-white/64">
          {projectData.project.selling_points}
        </div>
      </section>
    </main>
  )
}
