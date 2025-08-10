import { BackgroundType } from "@/lib/exoloader";

export const backgroundTypes = [
  {
    id: BackgroundType.Story,
    name: 'Story Background',
    description: 'Used in story scenes and dialogue',
    details:
      'Regular backgrounds that appear behind characters during story events. These are the most common type of custom background.',
    usage: 'Use in stories with: ~set bg = your_background_id'
  },
  {
    id: BackgroundType.Illustration,
    name: 'Illustration',
    description: 'Full-screen illustrations for special events (e.g. pinups)',
    details:
      'Large illustrations that temporarily remove text boxes so players can see the full image. `pinup_` will be automatically added to the id on export.',
    usage: 'Use in stories with: ~set bg = pinup_your_background_id'
  }
]
