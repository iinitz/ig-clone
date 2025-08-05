'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import Image from 'next/image'

export default function CreatePostPage() {
  const [caption, setCaption] = useState('')
  const [image, setImage] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const { user } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!user) {
      router.push('/login')
    }
  }, [user, router])

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      setImage(file)
      setImagePreview(URL.createObjectURL(file))
    } else {
      setImage(null)
      setImagePreview(null)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!image) {
      alert('Please select an image.')
      return
    }

    const formData = new FormData()
    formData.append('caption', caption)
    formData.append('image', image)

    try {
      const res = await fetch('http://localhost:3001/api/posts', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${user?.token}`,
        },
        body: formData,
      })

      if (res.ok) {
        setCaption('')
        setImage(null)
        setImagePreview(null)
        router.push('/')
      } else {
        console.error('Failed to create post')
        alert('Failed to create post. Please try again.')
      }
    } catch (error) {
      console.error('Error creating post:', (error as Error).message)
      alert('An error occurred. Please try again.')
    }
  }

  if (!user) return null // Render nothing if not authenticated, redirect will handle it

  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-80px)]">
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <h1 className="text-3xl font-bold text-center mb-6">Create New Post</h1>

        <div className="mb-6">
          <label htmlFor="image-upload" className="block text-gray-700 text-sm font-bold mb-2">Image</label>
          <input
            type="file"
            id="image-upload"
            accept="image/*"
            onChange={handleImageChange}
            className="block w-full text-sm text-gray-500
              file:mr-4 file:py-2 file:px-4
              file:rounded-full file:border-0
              file:text-sm file:font-semibold
              file:bg-blue-50 file:text-blue-700
              hover:file:bg-blue-100"
          />
          {imagePreview && (
            <div className="mt-4">
              <Image src={imagePreview} alt="Image Preview" width={500} height={300} className="w-full h-48 object-cover rounded-md" />
            </div>
          )}
        </div>

        <div className="mb-6">
          <label htmlFor="caption" className="block text-gray-700 text-sm font-bold mb-2">Caption</label>
          <textarea
            id="caption"
            placeholder="Write a caption..."
            value={caption}
            onChange={(e) => setCaption(e.target.value)}
            rows={4}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline resize-none"
          />
        </div>

        <button
          type="submit"
          className="w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
        >
          Create Post
        </button>
      </form>
    </div>
  )
}
