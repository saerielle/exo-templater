import ImageUpload from '@/components/ui/ImageUpload'

interface ArtworkTabProps {
  mainImage?: Blob | undefined
  thumbnailImage?: Blob | undefined
  setMainImage: (image: Blob | undefined) => void
  setThumbnailImage: (image: Blob | undefined) => void
}

const ArtworkTab: React.FC<ArtworkTabProps> = ({
  mainImage,
  thumbnailImage,
  setMainImage,
  setThumbnailImage
}) => {
  return (
    <div className="space-y-6">
      <div className="bg-green-50 border border-green-200 rounded-lg p-4">
        <p className="text-sm text-green-800">
          <strong>Background Images:</strong> Upload the main background image and optionally a
          thumbnail for the gallery (ExoLoader will fallback to the regular image and make a
          thumbnail out of it).
        </p>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div>
          <ImageUpload
            label="Main Background Image"
            value={mainImage}
            onChange={setMainImage}
            compact={true}
          />
        </div>
        <div>
          <ImageUpload
            label="Gallery Thumbnail (optional)"
            value={thumbnailImage}
            onChange={setThumbnailImage}
            compact={true}
          />
        </div>
      </div>
    </div>
  )
}

export default ArtworkTab
