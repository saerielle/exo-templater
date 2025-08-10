import ImageUpload from '@/components/ui/ImageUpload'
import InputGroup from '@/components/ui/InputGroup'
import { Collectible } from '@/lib/exoloader'

interface ArtworkTabProps {
  formData: Collectible
  projectId: string
  updateFormData: (path: string, value: unknown) => void
  image?: Blob
  setImage: (image: Blob) => void
}

const ArtworkTab: React.FC<ArtworkTabProps> = ({
  formData,
  projectId,
  updateFormData,
  image,
  setImage
}) => {
  return (
    <div className="space-y-6">
      <div className="bg-green-50 border border-green-200 rounded-lg p-4">
        <p className="text-sm text-green-800">
          <strong>Collectible Artwork:</strong> Upload the image that represents this collectible.
          This image will be displayed in the player&apos;s card collection and during challenges.
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h4 className="font-medium text-gray-900 mb-4">Collectible Image</h4>
          <ImageUpload label="Collectible Image" value={image} onChange={setImage} compact={true} />
        </div>
        <div>
          <h4 className="font-medium text-gray-900 mb-4">Artist Credits</h4>
          <div className="space-y-4">
            <div>
              <InputGroup
                label="Artist Name"
                value={formData.artistName || ''}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  updateFormData('artistName', e.target.value)
                }
                placeholder="Artist's name"
              />
            </div>
            <div>
              <InputGroup
                label="Social Media Handle"
                value={formData.artistSocialAt || ''}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  updateFormData('artistSocialAt', e.target.value)
                }
                placeholder="@artistname"
              />
            </div>
            <div>
              <InputGroup
                label="Social Media/Website Link"
                type="url"
                value={formData.artistLink || ''}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  updateFormData('artistLink', e.target.value)
                }
                placeholder="https://artist-website.com"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ArtworkTab
