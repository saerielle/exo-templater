import ImageUpload from '@/components/ui/ImageUpload'
import InputGroup from '@/components/ui/InputGroup'
import { Card } from '@/lib/exoloader'

interface ArtworkTabProps {
  formData: Card
  projectId: string
  updateFormData: (path: string, value: unknown) => void
  cardImage?: Blob
  setCardImage: (image: Blob) => void
}

const ArtworkTab: React.FC<ArtworkTabProps> = ({
  formData,
  projectId,
  updateFormData,
  cardImage,
  setCardImage
}) => {
  return (
    <div className="space-y-6">
      <div className="bg-green-50 border border-green-200 rounded-lg p-4">
        <p className="text-sm text-green-800">
          <strong>Card Artwork:</strong> Upload the visual representation of your card. This image
          will be displayed in the player&apos;s card collection and during challenges.
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h4 className="font-medium text-gray-900 mb-4">Card Image</h4>
          <ImageUpload
            label="Card Image"
            value={cardImage}
            onChange={setCardImage}
            compact={true}
          />
        </div>
        <div>
          <h4 className="font-medium text-gray-900 mb-4">Artist Credits</h4>
          <div className="space-y-4">
            <div>
              <InputGroup
                label="Artist Name"
                value={formData.artistName || ''}
                onChange={(e) => updateFormData('artistName', e.target.value)}
                placeholder="Artist's name"
              />
            </div>
            <div>
              <InputGroup
                label="Social Media Handle"
                value={formData.artistSocialAt || ''}
                onChange={(e) => updateFormData('artistSocialAt', e.target.value)}
                placeholder="@artistname"
              />
            </div>
            <div>
              <InputGroup
                label="Social Media/Website Link"
                type="url"
                value={formData.artistSocialLink || ''}
                onChange={(e) => updateFormData('artistSocialLink', e.target.value)}
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
