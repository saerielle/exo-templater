import { Dispatch, SetStateAction } from 'react'

import ImageUpload from '@/components/ui/ImageUpload'
import { Ending } from '@/lib/exoloader'

interface ArtworkTabProps {
  formData: Ending
  projectId: string
  specialEndingImage: Blob | undefined
  setSpecialEndingImage: Dispatch<SetStateAction<Blob | undefined>>
  endingImageF: Blob | undefined
  setEndingImageF: Dispatch<SetStateAction<Blob | undefined>>
  endingImageM: Blob | undefined
  setEndingImageM: Dispatch<SetStateAction<Blob | undefined>>
  endingImageNB: Blob | undefined
  setEndingImageNB: Dispatch<SetStateAction<Blob | undefined>>
}

const ArtworkTab: React.FC<ArtworkTabProps> = ({
  formData,
  projectId,
  specialEndingImage,
  setSpecialEndingImage,
  endingImageF,
  setEndingImageF,
  endingImageM,
  setEndingImageM,
  endingImageNB,
  setEndingImageNB
}) => {
  return (
    <div className="space-y-6">
      <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
        <p className="text-sm text-purple-800">
          <strong>Ending Images:</strong> Upload the image(s) for this ending. If this is a special
          ending, upload a single image. Otherwise, upload three gendered images.
        </p>
      </div>
      {formData.isSpecial ? (
        <div>
          <ImageUpload
            label="Special Ending Image"
            value={specialEndingImage}
            onChange={setSpecialEndingImage}
            compact={true}
          />
        </div>
      ) : (
        <div>
          <h4 className="font-medium text-gray-900 mb-4">Gendered Ending Images</h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
              <ImageUpload
                label="Female Ending"
                value={endingImageF}
                onChange={setEndingImageF}
                compact={true}
              />
            </div>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
              <ImageUpload
                label="Male Ending"
                value={endingImageM}
                onChange={setEndingImageM}
                compact={true}
              />
            </div>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
              <ImageUpload
                label="Non-Binary Ending"
                value={endingImageNB}
                onChange={setEndingImageNB}
                compact={true}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default ArtworkTab
