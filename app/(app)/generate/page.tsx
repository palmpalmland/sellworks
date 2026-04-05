'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import {
  buildProjectAssetPath,
  PROJECT_ASSETS_BUCKET,
  type UploadedProjectAsset,
} from '@/lib/project-storage'

async function uploadSelectedAssets(params: {
  userId: string
  productImages: File[]
  referenceVideos: File[]
}) {
  const { userId, productImages, referenceVideos } = params

  const uploadGroup = async (
    files: File[],
    assetType: 'product_image' | 'reference_video'
  ) => {
    const uploaded = await Promise.all(
      files.map(async (file) => {
        const storagePath = buildProjectAssetPath({
          userId,
          assetType,
          fileName: file.name,
        })

        const { error } = await supabase.storage
          .from(PROJECT_ASSETS_BUCKET)
          .upload(storagePath, file, {
            cacheControl: '3600',
            upsert: false,
            contentType: file.type,
          })

        if (error) {
          throw new Error(error.message)
        }

        return {
          assetType,
          fileName: file.name,
          mimeType: file.type,
          fileSize: file.size,
          storagePath,
        } satisfies UploadedProjectAsset
      })
    )

    return uploaded
  }

  const uploadedImages = await uploadGroup(productImages, 'product_image')
  const uploadedVideos = await uploadGroup(referenceVideos, 'reference_video')

  return [...uploadedImages, ...uploadedVideos]
}

export default function GeneratePage() {
  const [productName, setProductName] = useState('')
  const [sellingPoints, setSellingPoints] = useState('')
  const [platform, setPlatform] = useState('Amazon')
  const [style, setStyle] = useState('Performance marketing')
  const [productUrl, setProductUrl] = useState('')
  const [productImages, setProductImages] = useState<File[]>([])
  const [referenceVideos, setReferenceVideos] = useState<File[]>([])
  const [generateCopy, setGenerateCopy] = useState(true)
  const [generateImages, setGenerateImages] = useState(true)
  const [generateVideo, setGenerateVideo] = useState(false)
  const [imageCount, setImageCount] = useState(2)
  const [imageRequirements, setImageRequirements] = useState(['', ''])
  const [videoDuration, setVideoDuration] = useState(5)
  const [videoDescription, setVideoDescription] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()

  const handleImageRequirementChange = (index: number, value: string) => {
    setImageRequirements((current) => {
      const next = [...current]
      next[index] = value
      return next
    })
  }

  const handleCreateProject = async () => {
    try {
      setLoading(true)
      setError('')

      if (!productName.trim() || !sellingPoints.trim() || !platform.trim() || !style.trim()) {
        setError('Please fill in all required fields')
        return
      }

      if (!generateCopy && !generateImages && !generateVideo) {
        setError('Select at least one output type')
        return
      }

      const {
        data: { session },
      } = await supabase.auth.getSession()

      const accessToken = session?.access_token
      const userId = session?.user?.id

      if (!accessToken || !userId) {
        throw new Error('Please log in first')
      }

      const uploadedAssets = await uploadSelectedAssets({
        userId,
        productImages,
        referenceVideos,
      })

      const res = await fetch('/api/projects', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
          productName,
          sellingPoints,
          platform,
          style,
          productUrl,
          uploadedAssets,
          generationPlan: {
            generateCopy,
            generateImages,
            generateVideo,
            imageCount,
            imageRequirements: imageRequirements.slice(0, imageCount),
            videoDuration,
            videoDescription,
          },
        }),
      })

      const json = await res.json()

      if (!res.ok) {
        setError(json.error || 'Failed to create project')
        return
      }

      router.push(`/projects/${json.projectId}`)
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to create project')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="space-y-6 py-2">
      <section className="panel-strong rounded-[2.2rem] p-8 md:p-10">
        <div className="eyebrow">Create Project</div>
        <h1 className="headline mt-6 text-4xl font-black text-white md:text-6xl">
          Choose exactly what this project should generate
        </h1>
        <p className="mt-6 max-w-3xl text-lg leading-8 text-white/62">
          Copy, images, and video are separated now. Build the project in a cleaner order:
          product info first, then upload references, then decide which outputs to run.
        </p>

        <div className="mt-8 grid gap-3 rounded-[1.8rem] border border-white/10 bg-white/5 p-4 md:grid-cols-4">
          <div className="rounded-[1.2rem] border border-white/8 bg-black/18 px-4 py-4 text-sm text-white/62">
            1. Fill product info
          </div>
          <div className="rounded-[1.2rem] border border-white/8 bg-black/18 px-4 py-4 text-sm text-white/62">
            2. Upload optional references
          </div>
          <div className="rounded-[1.2rem] border border-white/8 bg-black/18 px-4 py-4 text-sm text-white/62">
            3. Choose outputs
          </div>
          <div className="rounded-[1.2rem] border border-white/8 bg-black/18 px-4 py-4 text-sm text-white/62">
            4. Fine-tune image or video settings
          </div>
        </div>
      </section>

      <section className="panel rounded-[2.2rem] p-8 md:p-10">
        <div className="space-y-8">
          <section className="space-y-4">
            <div className="text-xs uppercase tracking-[0.2em] text-white/36">Product Info</div>
            <input
              type="text"
              placeholder="Product name"
              className="field"
              value={productName}
              onChange={(e) => setProductName(e.target.value)}
            />

            <textarea
              placeholder="Selling points, audience, benefits, and positioning"
              className="field min-h-[180px]"
              value={sellingPoints}
              onChange={(e) => setSellingPoints(e.target.value)}
            />

            <div className="grid gap-4 md:grid-cols-2">
              <select
                className="field"
                value={platform}
                onChange={(e) => setPlatform(e.target.value)}
              >
                <option value="Amazon">Amazon</option>
                <option value="TikTok">TikTok</option>
                <option value="Xiaohongshu">Xiaohongshu</option>
                <option value="Shopify">Shopify</option>
              </select>

              <input
                type="text"
                placeholder="Style"
                className="field"
                value={style}
                onChange={(e) => setStyle(e.target.value)}
              />
            </div>

            <input
              type="url"
              placeholder="Product URL (optional)"
              className="field"
              value={productUrl}
              onChange={(e) => setProductUrl(e.target.value)}
            />
          </section>

          <section className="space-y-4">
            <div className="text-xs uppercase tracking-[0.2em] text-white/36">Reference Assets</div>
            <div className="grid gap-4 md:grid-cols-2">
              <label className="rounded-[1.5rem] border border-white/10 bg-white/4 p-4 text-sm text-white/70">
                <div className="text-xs uppercase tracking-[0.2em] text-white/36">Product Images</div>
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  className="mt-3 block w-full text-sm"
                  onChange={(e) => setProductImages(Array.from(e.target.files || []))}
                />
                <div className="mt-3 text-xs text-white/45">
                  Selected: {productImages.length}
                </div>
              </label>

              <label className="rounded-[1.5rem] border border-white/10 bg-white/4 p-4 text-sm text-white/70">
                <div className="text-xs uppercase tracking-[0.2em] text-white/36">Reference Videos</div>
                <input
                  type="file"
                  multiple
                  accept="video/*"
                  className="mt-3 block w-full text-sm"
                  onChange={(e) => setReferenceVideos(Array.from(e.target.files || []))}
                />
                <div className="mt-3 text-xs text-white/45">
                  Selected: {referenceVideos.length}
                </div>
              </label>
            </div>
          </section>

          <section className="space-y-4">
            <div className="text-xs uppercase tracking-[0.2em] text-white/36">Output Selection</div>
            <div className="grid gap-3 md:grid-cols-3">
              <label className="rounded-[1.2rem] border border-white/10 bg-black/18 px-4 py-4 text-sm text-white/75">
                <input
                  type="checkbox"
                  checked={generateCopy}
                  onChange={(e) => setGenerateCopy(e.target.checked)}
                  className="mr-3"
                />
                Generate Copy
              </label>
              <label className="rounded-[1.2rem] border border-white/10 bg-black/18 px-4 py-4 text-sm text-white/75">
                <input
                  type="checkbox"
                  checked={generateImages}
                  onChange={(e) => setGenerateImages(e.target.checked)}
                  className="mr-3"
                />
                Generate Images
              </label>
              <label className="rounded-[1.2rem] border border-white/10 bg-black/18 px-4 py-4 text-sm text-white/75">
                <input
                  type="checkbox"
                  checked={generateVideo}
                  onChange={(e) => setGenerateVideo(e.target.checked)}
                  className="mr-3"
                />
                Generate Video
              </label>
            </div>
          </section>

          {(generateImages || generateVideo) && (
            <section className="space-y-4">
              <div className="text-xs uppercase tracking-[0.2em] text-white/36">Output Setup</div>

              {generateImages && (
                <div className="rounded-[1.6rem] border border-white/10 bg-white/4 p-5">
                  <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                    <div className="text-sm font-semibold text-white">Image Setup</div>
                    <select
                      className="field max-w-[180px]"
                      value={imageCount}
                      onChange={(e) => setImageCount(Number(e.target.value))}
                    >
                      <option value={1}>1 image</option>
                      <option value={2}>2 images</option>
                    </select>
                  </div>
                  <div className="mt-4 space-y-4">
                    {Array.from({ length: imageCount }).map((_, index) => (
                      <textarea
                        key={index}
                        placeholder={`Optional requirement for image ${index + 1}`}
                        className="field min-h-[120px]"
                        value={imageRequirements[index]}
                        onChange={(e) => handleImageRequirementChange(index, e.target.value)}
                      />
                    ))}
                  </div>
                </div>
              )}

              {generateVideo && (
                <div className="rounded-[1.6rem] border border-white/10 bg-white/4 p-5">
                  <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                    <div className="text-sm font-semibold text-white">Video Setup</div>
                    <select
                      className="field max-w-[180px]"
                      value={videoDuration}
                      onChange={(e) => setVideoDuration(Number(e.target.value))}
                    >
                      <option value={2}>2 seconds</option>
                      <option value={5}>5 seconds</option>
                      <option value={8}>8 seconds</option>
                      <option value={10}>10 seconds</option>
                    </select>
                  </div>
                  <div className="mt-4 text-sm leading-7 text-white/55">
                    Longer videos usually take longer to generate and consume more tokens.
                  </div>
                  <textarea
                    placeholder="Optional video description to further define mood, camera movement, pacing, scenes, or CTA"
                    className="field mt-4 min-h-[120px]"
                    value={videoDescription}
                    onChange={(e) => setVideoDescription(e.target.value)}
                  />
                  <div className="mt-3 text-xs leading-6 text-white/45">
                    Product images stay as reference assets for the project. They are not automatically treated as the first frame.
                  </div>
                </div>
              )}
            </section>
          )}

          <button
            onClick={handleCreateProject}
            disabled={loading}
            className="cta-primary w-full disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? 'Uploading and creating project...' : 'Create Project'}
          </button>
        </div>

        {error && (
          <div className="mt-5 rounded-[1.4rem] border border-red-400/20 bg-red-400/10 px-4 py-4 text-sm text-red-100">
            {error}
          </div>
        )}
      </section>
    </main>
  )
}
