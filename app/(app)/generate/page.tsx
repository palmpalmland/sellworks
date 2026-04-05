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
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()

  const handleCreateProject = async () => {
    try {
      setLoading(true)
      setError('')

      if (!productName.trim() || !sellingPoints.trim() || !platform.trim() || !style.trim()) {
        setError('Please fill in all required fields')
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
          Start a project, upload references, and run the generation pipeline
        </h1>
        <p className="mt-6 max-w-3xl text-lg leading-8 text-white/62">
          This flow now uploads your source assets first, then creates the project, generates
          copy, writes image prompts, and uses your product images as visual references whenever
          they exist.
        </p>
      </section>

      <section className="grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
        <section className="panel rounded-[2.2rem] p-8 md:p-10">
          <div className="space-y-4">
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

        <section className="panel rounded-[2.2rem] p-8 md:p-10">
          <div className="text-xs uppercase tracking-[0.2em] text-white/36">Pipeline</div>
          <div className="mt-4 space-y-4">
            <div className="rounded-[1.5rem] border border-white/8 bg-white/4 p-5 text-white/65">
              1. Upload product images and reference videos to Supabase Storage
            </div>
            <div className="rounded-[1.5rem] border border-white/8 bg-white/4 p-5 text-white/65">
              2. Create project and save uploaded asset metadata
            </div>
            <div className="rounded-[1.5rem] border border-white/8 bg-white/4 p-5 text-white/65">
              3. Generate copy and image prompts
            </div>
            <div className="rounded-[1.5rem] border border-white/8 bg-white/4 p-5 text-white/65">
              4. Use product images as references for text-to-image or image-to-image generation
            </div>
          </div>
        </section>
      </section>
    </main>
  )
}
