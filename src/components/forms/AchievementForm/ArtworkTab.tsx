import ImageUpload from '@/components/ui/ImageUpload'
import { Achievement } from '@/lib/exoloader'

interface ArtworkTabProps {
  formData: Achievement
  projectId: string
  achievementImage?: Blob
  setAchievementImage: (image: Blob) => void
}

const ArtworkTab: React.FC<ArtworkTabProps> = ({
  formData,
  projectId,
  achievementImage,
  setAchievementImage
}) => {
  return (
    <div className="space-y-6">
      <div className="bg-green-50 border border-green-200 rounded-lg p-4">
        <p className="text-sm text-green-800">
          <strong>Achievement Image:</strong> Upload the image that represents this achievement.
          This will be shown in the achievements panel when the achievement is unlocked.
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <ImageUpload
            label="Achievement Image"
            value={achievementImage}
            onChange={setAchievementImage}
            compact={true}
          />
        </div>
      </div>
    </div>
  )
}

export default ArtworkTab
