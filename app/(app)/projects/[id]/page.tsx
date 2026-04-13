'use client'

import Link from 'next/link'
import { useEffect, useMemo, useState } from 'react'
import { useParams } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { formatLoadError } from '@/lib/ui-errors'
import type {
  ProjectAssetRecord,
  ProjectOutputRecord,
  ProjectRecord,
} from '@/lib/project-types'

type ProjectResponse = {
  project: ProjectRecord
  brand?: {
    enabled_platforms?: string[] | null
  } | null
  outputs: ProjectOutputRecord[]
  assets: ProjectAssetRecord[]
}

const platformSections = ['Amazon', 'Shopify', 'Etsy', 'TikTok'] as const
type PlatformSection = (typeof platformSections)[number]
type ProjectSidebarSection = 'inputs' | 'outputs'
type InputsTab = 'brief' | 'images' | 'videos'
type OutputTab = 'copy' | 'images' | 'video'

export default function ProjectDetailPage() {
  const params = useParams<{ id: string }>()
  const [projectData, setProjectData] = useState<ProjectResponse | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [sidebarSection, setSidebarSection] = useState<ProjectSidebarSection>('inputs')
  const [inputsTab, setInputsTab] = useState<InputsTab>('brief')
  const [openPlatform, setOpenPlatform] = useState<PlatformSection>('Amazon')
  const [activeOutputTab, setActiveOutputTab] = useState<OutputTab>('copy')
  const [briefDraft, setBriefDraft] = useState({
    product_name: '',
    product_url: '',
    selling_points: '',
  })
  const [savingField, setSavingField] = useState<
    null | 'product_name' | 'product_url' | 'selling_points'
  >(null)
  const [saveMessage, setSaveMessage] = useState('')

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
          setBriefDraft({
            product_name: data.project.product_name || '',
            product_url: data.project.product_url || '',
            selling_points: data.project.selling_points || '',
          })

          const primaryPlatform = platformSections.find(
            (item) => item.toLowerCase() === data.project.platform.toLowerCase()
          )

          if (primaryPlatform) {
            setOpenPlatform(primaryPlatform)
          }
        }
      } catch (err: unknown) {
        if (!cancelled) {
          setError(formatLoadError(err, 'Failed to load project'))
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

  const saveProjectField = async (
    field: 'product_name' | 'product_url' | 'selling_points'
  ) => {
    if (!projectData) {
      return
    }

    const nextValue = briefDraft[field]
    const currentValue =
      field === 'product_url'
        ? projectData.project.product_url || ''
        : projectData.project[field] || ''

    if (nextValue === currentValue) {
      return
    }

    try {
      setSavingField(field)
      setSaveMessage('')

      const {
        data: { session },
      } = await supabase.auth.getSession()

      const res = await fetch(`/api/projects/${params.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${session?.access_token}`,
        },
        body: JSON.stringify({
          [field]: nextValue,
        }),
      })

      const json = await res.json()

      if (!res.ok) {
        throw new Error(json.error || 'Failed to update project')
      }

      const updatedProject = json.data as ProjectRecord

      setProjectData((current) =>
        current
          ? {
              ...current,
              project: updatedProject,
            }
          : current
      )
      setBriefDraft({
        product_name: updatedProject.product_name || '',
        product_url: updatedProject.product_url || '',
        selling_points: updatedProject.selling_points || '',
      })
      setSaveMessage('Saved')
    } catch (err: unknown) {
      setSaveMessage(err instanceof Error ? err.message : 'Failed to save')
    } finally {
      setSavingField(null)
    }
  }

  const derived = useMemo(() => {
    if (!projectData) return null

    const copyOutput = projectData.outputs.find((item) => item.output_type === 'copy')
    const imagePromptOutput = projectData.outputs.find((item) => item.output_type === 'image_prompt')
    const imageOutput = projectData.outputs.find((item) => item.output_type === 'image')
    const videoOutput = projectData.outputs.find((item) => item.output_type === 'video')

    return {
      copyOutput,
      imagePromptList: Array.isArray(imagePromptOutput?.meta?.prompts)
        ? (imagePromptOutput.meta.prompts as Array<{ title?: string; prompt?: string }>)
        : [],
      generatedImages: Array.isArray(imageOutput?.meta?.images)
        ? (imageOutput.meta.images as Array<{
            title?: string
            prompt?: string
            url?: string | null
            error?: string
          }>)
        : [],
      videoTasks: Array.isArray(videoOutput?.meta?.tasks)
        ? (videoOutput.meta.tasks as Array<{
            id?: string
            title?: string
            prompt?: string
            status?: string
            resultUrl?: string | null
            note?: string
          }>)
        : [],
      productImageAssets: projectData.assets.filter((item) => item.asset_type === 'product_image'),
      referenceVideoAssets: projectData.assets.filter(
        (item) => item.asset_type === 'reference_video'
      ),
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

  const enabledPlatforms: PlatformSection[] = (() => {
    const configured = (projectData.brand?.enabled_platforms || []).filter(Boolean) as string[]
    if (configured.length > 0) {
      return platformSections.filter((platform) => configured.includes(platform))
    }

    const primary = platformSections.find(
      (platform) => platform.toLowerCase() === projectData.project.platform.toLowerCase()
    )

    return primary ? [primary] : ['Amazon']
  })()

  const currentPlatform = enabledPlatforms.includes(openPlatform)
    ? openPlatform
    : enabledPlatforms[0]
  const isPrimaryEnabledPlatform =
    currentPlatform.toLowerCase() === projectData.project.platform.toLowerCase()

  return (
    <main className="space-y-5 py-1">
      <section className="panel-strong rounded-[1.8rem] p-6 md:p-8">
        <div className="flex flex-col gap-5 xl:flex-row xl:items-start xl:justify-between">
          <div>
            <div className="text-xs font-bold uppercase tracking-[0.2em] text-white/40">
              Project workspace
            </div>
            <h1 className="mt-4 text-4xl font-bold tracking-tight text-white md:text-5xl">
              {projectData.project.product_name}
            </h1>
            <div className="mt-4 flex flex-wrap items-center gap-2">
              <div className="platform-badge rounded-full px-3 py-1 text-xs font-bold uppercase tracking-[0.16em]">
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
            <Link href="/projects" className="cta-secondary text-sm">
              Back to Projects
            </Link>
          </div>
        </div>
      </section>

      <section className="grid gap-5 xl:grid-cols-[280px_minmax(0,1fr)]">
        <aside className="panel self-start rounded-[1.8rem] p-4">
          <div className="space-y-4">
            <div>
              <button
                type="button"
                onClick={() => setSidebarSection('inputs')}
                className={
                  sidebarSection === 'inputs'
                    ? 'theme-subtle block w-full rounded-[1rem] px-3 py-2.5 text-left text-sm font-semibold theme-text'
                    : 'block w-full rounded-[1rem] px-3 py-2.5 text-left text-sm font-semibold text-white/72 transition hover:bg-white/[0.04] hover:text-white'
                }
              >
                Inputs
              </button>

              <div className="mt-1 space-y-1 pl-3">
                {[
                  { key: 'brief', label: 'Brief' },
                  { key: 'images', label: 'Images' },
                  { key: 'videos', label: 'Videos' },
                ].map((item) => (
                  <button
                    key={item.key}
                    type="button"
                    onClick={() => {
                      setSidebarSection('inputs')
                      setInputsTab(item.key as InputsTab)
                    }}
                    className={
                      sidebarSection === 'inputs' && inputsTab === item.key
                        ? 'theme-subtle block w-full rounded-[0.95rem] px-3 py-2 text-left text-sm font-medium theme-text'
                        : 'block w-full rounded-[0.95rem] px-3 py-2 text-left text-sm font-medium text-white/50 transition hover:bg-white/[0.04] hover:text-white'
                    }
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <button
                type="button"
                onClick={() => setSidebarSection('outputs')}
                className={
                  sidebarSection === 'outputs'
                    ? 'theme-subtle block w-full rounded-[1rem] px-3 py-2.5 text-left text-sm font-semibold theme-text'
                    : 'block w-full rounded-[1rem] px-3 py-2.5 text-left text-sm font-semibold text-white/72 transition hover:bg-white/[0.04] hover:text-white'
                }
              >
                Outputs
              </button>

              <div className="mt-1 space-y-1 pl-3">
                {enabledPlatforms.map((platformName) => (
                  <button
                    key={platformName}
                    type="button"
                    onClick={() => {
                      setSidebarSection('outputs')
                      setOpenPlatform(platformName)
                    }}
                    className={
                      sidebarSection === 'outputs' && currentPlatform === platformName
                        ? 'theme-subtle block w-full rounded-[0.95rem] px-3 py-2 text-left text-sm font-medium theme-text'
                        : 'block w-full rounded-[0.95rem] px-3 py-2 text-left text-sm font-medium text-white/50 transition hover:bg-white/[0.04] hover:text-white'
                    }
                  >
                    {platformName}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </aside>

        <section className="min-w-0 space-y-5">
          {sidebarSection === 'inputs' ? (
            <>
              {inputsTab === 'brief' ? (
                <div className="panel rounded-[1.8rem] p-6">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <div className="text-xs font-bold uppercase tracking-[0.18em] text-white/36">
                        Input brief
                      </div>
                      <div className="mt-2 text-xl font-bold text-white">Project inputs</div>
                    </div>
                    <div className="text-[11px] uppercase tracking-[0.16em] text-white/40">
                      {savingField ? 'Saving...' : saveMessage || 'Inline edit'}
                    </div>
                  </div>

                  <div className="mt-6 grid gap-5">
                    <div>
                      <div className="text-[11px] uppercase tracking-[0.18em] text-white/30">
                        Product name
                      </div>
                      <input
                        type="text"
                        value={briefDraft.product_name}
                        onChange={(event) =>
                          setBriefDraft((current) => ({
                            ...current,
                            product_name: event.target.value,
                          }))
                        }
                        onBlur={() => void saveProjectField('product_name')}
                        className="field mt-2 h-11 text-sm font-semibold"
                      />
                    </div>

                    <div>
                      <div className="text-[11px] uppercase tracking-[0.18em] text-white/30">
                        Product URL
                      </div>
                      <input
                        type="url"
                        value={briefDraft.product_url}
                        onChange={(event) =>
                          setBriefDraft((current) => ({
                            ...current,
                            product_url: event.target.value,
                          }))
                        }
                        onBlur={() => void saveProjectField('product_url')}
                        placeholder="Paste source product URL"
                        className="field mt-2 h-11 text-sm"
                      />
                    </div>

                    <div>
                      <div className="text-[11px] uppercase tracking-[0.18em] text-white/30">
                        Selling points
                      </div>
                      <textarea
                        value={briefDraft.selling_points}
                        onChange={(event) =>
                          setBriefDraft((current) => ({
                            ...current,
                            selling_points: event.target.value,
                          }))
                        }
                        onBlur={() => void saveProjectField('selling_points')}
                        rows={10}
                        className="field mt-2 min-h-[220px] resize-y text-sm leading-6"
                      />
                    </div>
                  </div>
                </div>
              ) : null}

              {inputsTab === 'images' ? (
                <div className="panel rounded-[1.8rem] p-6">
                  <div className="text-xs font-bold uppercase tracking-[0.18em] text-white/36">
                    Input images
                  </div>
                  <div className="mt-2 text-xl font-bold text-white">Uploaded product images</div>

                  <div className="mt-6 grid gap-4 md:grid-cols-2 2xl:grid-cols-3">
                    {derived.productImageAssets.length > 0 ? (
                      derived.productImageAssets.map((item) => (
                        <div
                          key={item.id}
                          className="overflow-hidden rounded-[1.2rem] border border-white/8 bg-black/20"
                        >
                          {item.signed_url ? (
                            <img
                              src={item.signed_url}
                              alt={item.file_name || 'Product image'}
                              className="aspect-square w-full object-cover"
                            />
                          ) : (
                            <div className="px-4 py-10 text-center text-sm text-white/45">
                              Preview unavailable
                            </div>
                          )}
                        </div>
                      ))
                    ) : (
                      <div className="text-sm text-white/50">No product images uploaded yet.</div>
                    )}
                  </div>
                </div>
              ) : null}

              {inputsTab === 'videos' ? (
                <div className="panel rounded-[1.8rem] p-6">
                  <div className="text-xs font-bold uppercase tracking-[0.18em] text-white/36">
                    Input videos
                  </div>
                  <div className="mt-2 text-xl font-bold text-white">Reference videos</div>

                  <div className="mt-6 grid gap-3">
                    {derived.referenceVideoAssets.length > 0 ? (
                      derived.referenceVideoAssets.map((item) => (
                        <a
                          key={item.id}
                          href={item.signed_url || '#'}
                          target="_blank"
                          rel="noreferrer"
                          className="rounded-[1rem] border border-white/8 bg-white/[0.02] px-4 py-4 text-sm text-white/72 transition hover:bg-white/[0.04]"
                        >
                          {item.file_name || 'Reference video'}
                        </a>
                      ))
                    ) : (
                      <div className="text-sm text-white/50">No reference videos uploaded yet.</div>
                    )}
                  </div>
                </div>
              ) : null}
            </>
          ) : (
            <>
              <div className="panel rounded-[1.8rem] p-6">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className="text-xs font-bold uppercase tracking-[0.18em] text-white/36">
                      {currentPlatform} outputs
                    </div>
                    <div className="mt-2 text-xl font-bold text-white">
                      {isPrimaryEnabledPlatform
                        ? 'Current platform output set'
                        : `No dedicated ${currentPlatform} version yet`}
                    </div>
                  </div>
                  {isPrimaryEnabledPlatform ? (
                    <div className="platform-badge rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-[0.16em]">
                      Current
                    </div>
                  ) : null}
                </div>

                <div className="mt-5 flex flex-wrap gap-2">
                  {[
                    { key: 'copy', label: 'Copy' },
                    { key: 'images', label: 'Images' },
                    { key: 'video', label: 'Video' },
                  ].map((tab) => (
                    <button
                      key={tab.key}
                      type="button"
                      onClick={() => setActiveOutputTab(tab.key as OutputTab)}
                      className={
                        activeOutputTab === tab.key
                          ? 'theme-subtle rounded-full px-4 py-2 text-sm font-semibold theme-text'
                          : 'rounded-full border border-white/10 bg-white/[0.03] px-4 py-2 text-sm font-medium text-white/55 transition hover:bg-white/[0.05] hover:text-white'
                      }
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>
              </div>

              {isPrimaryEnabledPlatform ? (
                <>
                  {activeOutputTab === 'copy' ? (
                    <div className="panel rounded-[1.8rem] p-6">
                      <div className="text-xs uppercase tracking-[0.18em] text-white/36">Copy</div>
                      <div className="mt-5 max-h-[58vh] overflow-y-auto whitespace-pre-wrap pr-2 text-sm leading-7 text-white/72">
                        {derived.copyOutput?.content || 'No copy was generated for this project yet.'}
                      </div>
                    </div>
                  ) : null}

                  {activeOutputTab === 'images' ? (
                    <div className="space-y-5">
                      <div className="panel rounded-[1.8rem] p-6">
                        <div className="text-xs uppercase tracking-[0.18em] text-white/36">
                          Generated images
                        </div>
                        <div className="mt-5 grid gap-4 md:grid-cols-2 2xl:grid-cols-3">
                          {derived.generatedImages.length > 0 ? (
                            derived.generatedImages.map((image, index) => (
                              <div
                                key={`${image.title}-${index}`}
                                className="rounded-[1.2rem] border border-white/8 bg-black/20 p-4"
                              >
                                <div className="text-sm font-semibold text-white">
                                  {image.title || `Image ${index + 1}`}
                                </div>
                                {image.url ? (
                                  <img
                                    src={image.url}
                                    alt={image.title || `Image ${index + 1}`}
                                    className="mt-4 aspect-square w-full rounded-[1rem] object-cover"
                                  />
                                ) : (
                                  <div className="mt-4 rounded-[1rem] border border-dashed border-white/10 px-4 py-10 text-center text-sm text-white/45">
                                    {image.error || 'No image preview available yet.'}
                                  </div>
                                )}
                                <div className="mt-3 text-xs leading-6 text-white/45">
                                  {image.prompt}
                                </div>
                              </div>
                            ))
                          ) : (
                            <div className="text-sm text-white/50">
                              No images were generated for this project yet.
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="panel rounded-[1.8rem] p-6">
                        <div className="text-xs uppercase tracking-[0.18em] text-white/36">
                          Generate more
                        </div>
                        <div className="mt-2 text-lg font-semibold text-white">
                          Add more {currentPlatform} image outputs
                        </div>
                        <p className="mt-3 max-w-2xl text-sm leading-7 text-white/58">
                          Use the current project inputs to generate more images for this platform.
                          We can wire the real per-platform generate controls into this area next.
                        </p>
                      </div>
                    </div>
                  ) : null}

                  {activeOutputTab === 'video' ? (
                    <div className="space-y-5">
                      <div className="panel rounded-[1.8rem] p-6">
                        <div className="text-xs uppercase tracking-[0.18em] text-white/36">Video</div>
                        <div className="mt-5 grid gap-4">
                          {derived.videoTasks.length > 0 ? (
                            derived.videoTasks.map((task, index) => (
                              <div
                                key={task.id || `${task.title}-${index}`}
                                className="rounded-[1.2rem] border border-white/8 bg-black/20 p-4"
                              >
                                <div className="flex items-center justify-between gap-3">
                                  <div className="text-sm font-semibold text-white">
                                    {task.title || `Video ${index + 1}`}
                                  </div>
                                  <div className="text-xs uppercase tracking-[0.16em] text-white/45">
                                    {task.status || 'pending'}
                                  </div>
                                </div>
                                <div className="mt-3 text-sm leading-7 text-white/66">
                                  {task.prompt}
                                </div>
                                {task.resultUrl ? (
                                  <video
                                    src={task.resultUrl}
                                    controls
                                    className="mt-4 w-full rounded-[1rem] border border-white/8 bg-black/30"
                                  />
                                ) : null}
                                <div className="mt-3 text-xs text-white/40">
                                  {task.note || 'No execution note yet.'}
                                </div>
                              </div>
                            ))
                          ) : (
                            <div className="text-sm text-white/50">
                              No video was generated for this project yet.
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="panel rounded-[1.8rem] p-6">
                        <div className="text-xs uppercase tracking-[0.18em] text-white/36">
                          Generate more
                        </div>
                        <div className="mt-2 text-lg font-semibold text-white">
                          Add more {currentPlatform} video outputs
                        </div>
                        <p className="mt-3 max-w-2xl text-sm leading-7 text-white/58">
                          This area is reserved for per-platform video generation controls so the
                          user can keep working without leaving the output view.
                        </p>
                      </div>
                    </div>
                  ) : null}
                </>
              ) : (
                <div className="space-y-5">
                  <div className="panel rounded-[1.8rem] p-6">
                    <div className="text-lg font-semibold text-white">Generate {currentPlatform} outputs</div>
                    <p className="mt-3 max-w-2xl text-sm leading-7 text-white/58">
                      This project was originally built for {projectData.project.platform}. Use the
                      current inputs to create a dedicated {currentPlatform} version here instead of
                      leaving the workspace.
                    </p>
                    <div className="mt-5 grid gap-3 md:grid-cols-3">
                      <div className="rounded-[1rem] border border-white/8 bg-white/[0.02] px-4 py-3 text-sm text-white/68">
                        Copy
                      </div>
                      <div className="rounded-[1rem] border border-white/8 bg-white/[0.02] px-4 py-3 text-sm text-white/68">
                        Images
                      </div>
                      <div className="rounded-[1rem] border border-white/8 bg-white/[0.02] px-4 py-3 text-sm text-white/68">
                        Video
                      </div>
                    </div>
                  </div>

                  <div className="panel rounded-[1.8rem] p-6">
                    <div className="text-xs uppercase tracking-[0.18em] text-white/36">
                      Generate more
                    </div>
                    <div className="mt-2 text-lg font-semibold text-white">
                      Create a platform-specific output set
                    </div>
                    <p className="mt-3 max-w-2xl text-sm leading-7 text-white/58">
                      We can connect this block to real platform generation next, so the user stays
                      inside the current project and expands outputs one platform at a time.
                    </p>
                  </div>
                </div>
              )}
            </>
          )}
        </section>
      </section>
    </main>
  )
}
