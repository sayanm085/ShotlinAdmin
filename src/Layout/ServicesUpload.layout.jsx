// src/pages/ProductUploadPage.jsx

import React, { useState, useRef, useEffect } from 'react'
import { useParams } from 'react-router'
import {
  Card, CardHeader, CardTitle, CardContent, CardFooter,
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import {
  Dialog, DialogContent, DialogHeader,
  DialogTitle, DialogFooter,
} from '@/components/ui/dialog'
import {Spinner} from '@/components/ui/spinner'
import { toast } from 'react-hot-toast'
import { X } from 'lucide-react'
import {
  useUploadProduct,
  useProductDetails,
  useUpdateProduct,
} from '@/Hooks/useServiceContent'

export default function ProductUploadPage() {
  const { id } = useParams()
  const isEdit = Boolean(id)

  // ─── All Hooks At The Top ─────────────────────────────────────────────────────
  const [form, setForm] = useState({
    name: '', category: '', title: '',
    description: '', details: '',
    features: [''], livePreview: '',
  })
  const [tags, setTags] = useState([])
  const [tagInput, setTagInput] = useState('')
  const [selectedImages, setSelectedImages] = useState([])
  const [errors, setErrors] = useState({})
  const [showSubmitting, setShowSubmitting] = useState(false)
  const [showSuccessDialog, setShowSuccessDialog] = useState(false)

  const fileInputRef = useRef(null)
  const inputRef      = useRef(null)

  // ⚛️ Data Fetch
  const { data: existing, isLoading: loadingDetails } = useProductDetails(id)

  // ⚛️ Populate on Edit
  useEffect(() => {
    if (!existing) return
    const {
      name, category, title, description,
      details, features, livePreview,
      tags: srvTags, image: srvImage,
    } = existing

    setForm({
      name,
      category: category || '',
      title,
      description,
      details,
      features: features.length ? features : [''],
      livePreview,
    })
    setTags(srvTags || [])
    setSelectedImages((srvImage || []).map((url) => ({ url, file: null })))
  }, [existing])

  // ⚛️ Mutations (always called)
  const { mutateAsync: upload, isLoading: uploading }   = useUploadProduct()
  const { mutateAsync: update,  isLoading: updating }   = useUpdateProduct()

  // ─── Early Loading Return (after all hooks) ───────────────────────────────────
  if (isEdit && loadingDetails) {
    return <p className="p-6 text-center">Loading product…</p>
  }

  // ─── Handlers & Submit ────────────────────────────────────────────────────────
  const handleInputChange = (e) => {
    const { name, value } = e.target
    setForm(f => ({ ...f, [name]: value }))
    setErrors(p => ({ ...p, [name]: '' }))
  }

  const handleFeatureChange = (idx, val) => {
    setForm(f => {
      const feats = [...f.features]
      feats[idx] = val
      return { ...f, features: feats }
    })
    setErrors(p => ({ ...p, features: '' }))
  }

  const addFeature = () =>
    setForm(f => ({ ...f, features: [...f.features, ''] }))

  const removeFeature = (idx) =>
    setForm(f => ({
      ...f,
      features: f.features.filter((_, i) => i !== idx),
    }))

  const addTag = (val) => {
    const t = val.trim()
    if (t && !tags.includes(t)) setTags(ts => [...ts, t])
    setErrors(p => ({ ...p, tags: '' }))
  }
  const onTagKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault()
      addTag(tagInput)
      setTagInput('')
    }
  }
  const removeTag = (idx) =>
    setTags(ts => ts.filter((_, i) => i !== idx))

  const handleFilesChange = (e) => {
    if (!e.target.files) return
    const files = Array.from(e.target.files)
      .slice(0, 20 - selectedImages.length)
    const previews = files.map(f => ({
      file: f,
      url: URL.createObjectURL(f),
    }))
    setSelectedImages(prev => [...prev, ...previews])
    setErrors(p => ({ ...p, images: '' }))
    e.target.value = ''
  }
  const removeImage = (idx) => {
    URL.revokeObjectURL(selectedImages[idx].url)
    setSelectedImages(prev => prev.filter((_, i) => i !== idx))
  }
  const clearAllImages = () => {
    selectedImages.forEach(img => URL.revokeObjectURL(img.url))
    setSelectedImages([])
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const errs = {}
    if (!form.name) errs.name = 'Required'
    if (!form.category) errs.category = 'Required'
    if (!form.title) errs.title = 'Required'
    if (!form.description) errs.description = 'Required'
    if (!form.details) errs.details = 'Required'
    if (form.features.some(f => !f.trim())) errs.features = 'Fill all features'
    if (!form.livePreview) errs.livePreview = 'Required'
    if (!tags.length) errs.tags = 'Add at least one tag'
    if (!isEdit && selectedImages.length < 5)
      errs.images = 'Select at least 5 images'

    if (Object.keys(errs).length) {
      setErrors(errs)
      toast.error('Please fix errors in form')
      return
    }

    const fd = new FormData()
    Object.entries(form).forEach(([k, v]) => {
      if (k === 'features') {
        v.forEach(x => fd.append('features', x))
      } else {
        fd.append(k, v)
      }
    })
    tags.forEach(t => fd.append('tags', t))
    selectedImages
      .filter(img => img.file)
      .forEach(img => fd.append('productImage', img.file))

    try {
      setShowSubmitting(true)

      if (isEdit) {
        await update({ id, formData: fd })
      } else {
        await upload(fd)
      }

      setShowSubmitting(false)
      setShowSuccessDialog(true)

      if (!isEdit) {
        setForm({
          name: '', category: '', title: '',
          description: '', details: '',
          features: [''], livePreview: '',
        })
        setTags([])
        clearAllImages()
      }
    } catch (err) {
      setShowSubmitting(false)
      toast.error(err.message || 'Operation failed')
    }
  }

  const inputErrorClass = (field) =>
    errors[field] ? 'border-red-500 ring-red-300 ring-1' : ''

  // ─── Render ───────────────────────────────────────────────────────────────────
  return (
    <>
      {/* Submitting Overlay */}
      {showSubmitting && (
        <div className="fixed inset-0 bg-[#00000027]  flex items-center justify-center z-50">
          <div className=" p-6 rounded flex flex-col items-center gap-4">
            <Spinner />
            <span>Submitting…</span>
          </div>
        </div>
      )}

      {/* Success Dialog */}
      <Dialog
        open={showSuccessDialog}
        onOpenChange={setShowSuccessDialog}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Success!</DialogTitle>
          </DialogHeader>
          <p>
            Your product has been {isEdit ? 'updated' : 'uploaded'} successfully.
          </p>
          <DialogFooter>
            <Button onClick={() => setShowSuccessDialog(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Main Form */}
      <div className="max-w-3xl mx-auto my-12">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">
              {isEdit ? 'Edit Product' : 'Upload New Product'}
            </CardTitle>
          </CardHeader>

          <form onSubmit={handleSubmit} className="space-y-6">
            <CardContent className="space-y-6">
              {/* Product Name */}
              <div>
                <Label>Product Name <span className="text-red-500">*</span></Label>
                <Input
                  name="name"
                  value={form.name}
                  onChange={handleInputChange}
                  className={inputErrorClass('name')}
                />
                {errors.name && <p className="text-red-500">{errors.name}</p>}
              </div>

              {/* Title / Category / LivePreview */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label>
                    Page Title (SEO) <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    name="title"
                    value={form.title}
                    onChange={handleInputChange}
                    className={inputErrorClass('title')}
                  />
                  {errors.title && <p className="text-red-500">{errors.title}</p>}
                </div>
                <div>
                  <Label>Category <span className="text-red-500">*</span></Label>
                  <select
                    name="category"
                    value={form.category}
                    onChange={handleInputChange}
                    className={`mt-1 w-full border rounded p-2 ${
                      errors.category ? 'border-red-500' : 'border-gray-300'
                    }`}
                  >
                    <option value="">Select category</option>
                    <option value="Business website">Business website</option>
                    <option value="UX Branding">UX Branding</option>
                    <option value="E-commerce">E-commerce</option>
                    <option value="Other">Other</option>
                  </select>
                  {errors.category && <p className="text-red-500">{errors.category}</p>}
                </div>
                <div>
                  <Label>
                    Live Preview URL <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    name="livePreview"
                    value={form.livePreview}
                    onChange={handleInputChange}
                    className={inputErrorClass('livePreview')}
                  />
                  {errors.livePreview && (
                    <p className="text-red-500">{errors.livePreview}</p>
                  )}
                </div>
              </div>

              {/* Description */}
              <div>
                <Label>Short Description <span className="text-red-500">*</span></Label>
                <Textarea
                  name="description"
                  value={form.description}
                  onChange={handleInputChange}
                  className={inputErrorClass('description')}
                  rows={3}
                />
                {errors.description && (
                  <p className="text-red-500">{errors.description}</p>
                )}
              </div>

              {/* Details */}
              <div>
                <Label>Full Details <span className="text-red-500">*</span></Label>
                <Textarea
                  name="details"
                  value={form.details}
                  onChange={handleInputChange}
                  className={inputErrorClass('details')}
                  rows={4}
                />
                {errors.details && <p className="text-red-500">{errors.details}</p>}
              </div>

              {/* Features */}
              <div>
                <div className="flex justify-between items-center">
                  <Label>Key Features <span className="text-red-500">*</span></Label>
                  <Button size="sm" variant="outline" onClick={addFeature}>
                    + Add Feature
                  </Button>
                </div>
                {errors.features && <p className="text-red-500">{errors.features}</p>}
                <div className="space-y-2 mt-2">
                  {form.features.map((feat, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <Input
                        value={feat}
                        onChange={e => handleFeatureChange(idx, e.target.value)}
                        placeholder={`Feature ${idx + 1}`}
                        className={inputErrorClass('features')}
                      />
                      {form.features.length > 1 && (
                        <Button
                          variant="destructive"
                          size="icon"
                          onClick={() => removeFeature(idx)}
                        >
                          ✕
                        </Button>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Tags */}
              <div>
                <Label>Tags <span className="text-red-500">*</span></Label>
                {errors.tags && <p className="text-red-500">{errors.tags}</p>}
                <div className="flex flex-wrap gap-2 p-2 border rounded mt-1">
                  {tags.map((tag, idx) => (
                    <span
                      key={idx}
                      className="flex items-center gap-1 bg-gray-100 px-2 py-1 rounded"
                    >
                      {tag}
                      <button onClick={() => removeTag(idx)}>
                        <X size={12} />
                      </button>
                    </span>
                  ))}
                  <input
                    ref={inputRef}
                    value={tagInput}
                    onChange={e => setTagInput(e.target.value)}
                    onKeyDown={onTagKeyDown}
                    placeholder="Type & press Enter"
                    className="outline-none flex-1 min-w-[100px]"
                  />
                </div>
              </div>

              {/* Images */}
              <div>
                <Label>
                  Product Images (5–20) <span className="text-red-500">*</span>
                </Label>
                {errors.images && <p className="text-red-500">{errors.images}</p>}
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mt-2 mb-2">
                  {selectedImages.map((img, idx) => (
                    <div key={idx} className="relative group">
                      <img
                        src={img.url}
                        alt="Preview"
                        className="h-24 w-full object-cover rounded"
                      />
                      <button
                        onClick={() => removeImage(idx)}
                        className="absolute top-1 right-1 bg-white p-1 rounded hover:bg-red-700"
                      >
                        <X size={12} />
                      </button>
                    </div>
                  ))}
                  {selectedImages.length < 20 && (
                    <div
                      className="flex items-center justify-center border-2 border-dashed p-6 cursor-pointer hover:border-gray-400"
                      onClick={() => fileInputRef.current?.click()}
                    >
                      <span>Select Images</span>
                    </div>
                  )}
                </div>
                {selectedImages.length > 0 && (
                  <Button
                    variant="outline"
                    size="sm"
                    className="mt-2"
                    onClick={clearAllImages}
                  >
                    Clear All
                  </Button>
                )}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  multiple
                  className="hidden"
                  onChange={handleFilesChange}
                />
              </div>
            </CardContent>

            <CardFooter className="flex justify-end">
              <Button type="submit" disabled={uploading || updating}>
                {uploading || updating
                  ? isEdit
                    ? 'Updating…'
                    : 'Uploading…'
                  : isEdit
                  ? 'Save Changes'
                  : 'Submit'}
              </Button>
            </CardFooter>
          </form>
        </Card>
      </div>
    </>
  )
}
