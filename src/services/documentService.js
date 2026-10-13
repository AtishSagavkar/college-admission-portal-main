const allowedTypes = new Set([
  'application/pdf',
  'image/jpeg',
  'image/png',
])

const maxFileSize = 10 * 1024 * 1024

const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME
const uploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET

function getContentType(file) {
  if (file.type) {
    return file.type
  }

  const extension = file.name.toLowerCase().split('.').pop()

  if (extension === 'pdf') return 'application/pdf'
  if (extension === 'jpg' || extension === 'jpeg') return 'image/jpeg'
  if (extension === 'png') return 'image/png'

  return ''
}

export async function uploadApplicationDocuments(userId, files) {
  if (!cloudName) {
    throw new Error('Cloudinary cloud name is missing.')
  }

  if (!uploadPreset) {
    throw new Error('Cloudinary upload preset is missing.')
  }

  return Promise.all(
    files.map(async (file) => {
      const contentType = getContentType(file)

      // File type validation
      if (!allowedTypes.has(contentType)) {
        throw new Error(
          `${file.name} is not a supported PDF or image.`
        )
      }

      // File size validation
      if (file.size > maxFileSize) {
        throw new Error(
          `${file.name} exceeds the 10 MB limit.`
        )
      }

      const safeName = file.name.replace(
        /[^a-zA-Z0-9._-]/g,
        '_'
      )

      const uniqueId = crypto.randomUUID()

      const formData = new FormData()

      formData.append('file', file)
      formData.append('upload_preset', uploadPreset)

      // Organize files inside Cloudinary
      formData.append(
        'folder',
        `users/${userId}/applications`
      )

      // Give every uploaded file a unique ID
      formData.append(
        'public_id',
        `${uniqueId}-${safeName.replace(/\.[^/.]+$/, '')}`
      )

      const uploadUrl =
        `https://api.cloudinary.com/v1_1/${cloudName}/auto/upload`

      const response = await fetch(uploadUrl, {
        method: 'POST',
        body: formData,
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(
          data?.error?.message ||
          `Failed to upload ${file.name}.`
        )
      }

      return {
        id: data.public_id || uniqueId,
        name: file.name,
        type: contentType,
        size: `${(file.size / 1024 / 1024).toFixed(1)} MB`,
        url: data.secure_url || data.url,
        publicId: data.public_id,
        resourceType: data.resource_type,
        format: data.format,
        status: 'uploaded',

        // Kept for compatibility with your existing
        // AdmissionForm document structure.
        storagePath: data.public_id,
      }
    })
  )
}

/*
 * Cloudinary unsigned uploads cannot be securely deleted
 * directly from the browser because deletion requires
 * authenticated/server-side access.
 *
 * This function is intentionally kept so your existing
 * AdmissionForm.jsx does not break.
 *
 * Removing a document from the form will remove it from
 * the current application state. The uploaded Cloudinary
 * asset itself remains until it is deleted through a
 * server-side/admin operation.
 */
export async function deleteApplicationDocument() {
  return
}