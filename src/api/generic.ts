export const ageStages = [
  { label: 'Child / game years 1-3', key: 'Child' },
  { label: 'Teen / game years 4-6', key: 'Teen' },
  { label: 'Adult / game years 7+', key: 'Adult' }
]

export const mapSkeletonTypes = [
  'anemone',
  'tang',
  'marz',
  'dys',
  'rex',
  'cal',
  'tammy',
  'nomi',
  'vace',
  'sym'
]

export const mainMenuTemplates = [
  {
    id: 'sol',
    name: 'Sol',
    position: [2.08, -0.01]
  },
  {
    id: 'anemone',
    name: 'Anemone',
    position: [2.75, 1.63]
  },
  {
    id: 'tang',
    name: 'Tang',
    position: [8.02, 2.36]
  },
  {
    id: 'marz',
    name: 'Marz',
    position: [8.28, 2.96]
  },
  {
    id: 'dys',
    name: 'Dys',
    position: [4.29, 3.39]
  },
  {
    id: 'rex',
    name: 'Rex',
    position: [-0.92, 1.84]
  },
  {
    id: 'cal',
    name: 'Cal',
    position: [5.21, 4.49]
  },
  {
    id: 'tammy',
    name: 'Tammy',
    position: [5.59, 4.75]
  },
  {
    id: 'nomi',
    name: 'Nomi',
    position: [-0.38, 2.79]
  },
  {
    id: 'vace',
    name: 'Vace',
    position: [0.56, 4.06]
  },
  {
    id: 'sym',
    name: 'Sym',
    position: [0.73, 5.15]
  }
].sort((a, b) => a.name.localeCompare(b.name))

type MapPositionTemplate = {
  id: string
  name: string
  position: [number, number, number]
}

type MapPositionTemplates = {
  preHelioMapSpots: MapPositionTemplate[]
  destroyedMapSpot: MapPositionTemplate[]
  postHelioMapSpots: MapPositionTemplate[]
  nearbyStratoMapSpots: MapPositionTemplate[]
  nearbyHelioMapSpots: MapPositionTemplate[]
  plainsMapSpots: MapPositionTemplate[]
  valleyMapSpots: MapPositionTemplate[]
  ridgeMapSpots: MapPositionTemplate[]
}

export const mapPositionTemplates: MapPositionTemplates = {
  preHelioMapSpots: [
    { 'id': 'quiet-anemone', 'name': 'Anemone (quiet)', 'position': [2.45, 0.01, -44.06] },
    { 'id': 'quiet-cal', 'name': 'Cal (quiet)', 'position': [48.03, 3.85, -24.15] },
    { 'id': 'quiet-dys', 'name': 'Dys (quiet)', 'position': [21.01, 2.67, -36.28] },
    { 'id': 'quiet-mars', 'name': 'Marz (quiet)', 'position': [36.88, 9.58, 0.22] },
    { 'id': 'quiet-tang', 'name': 'Tang (quiet)', 'position': [-0.32, 0.28, -27.58] },
    { 'id': 'quiet-tammy', 'name': 'Tammy (quiet)', 'position': [16.18, 0.56, -8.31] },
    { 'id': 'quiet-mom', 'name': 'Mom (quiet)', 'position': [37.71, 3.82, -24.39] },
    { 'id': 'quiet-dad', 'name': 'Dad (quiet)', 'position': [39.61, 3.87, -22.41] },

    { 'id': 'pollen-anemone', 'name': 'Anemone (pollen)', 'position': [-5.86, -0.16, -26.33] },
    { 'id': 'pollen-cal', 'name': 'Cal (pollen)', 'position': [17.36, 0.91, -12.62] },
    { 'id': 'pollen-dys', 'name': 'Dys (pollen)', 'position': [7.35, -0.03, -37.74] },
    { 'id': 'pollen-mars', 'name': 'Marz (pollen)', 'position': [25.78, 5.68, 3.77] },
    { 'id': 'pollen-tang', 'name': 'Tang (pollen)', 'position': [-4.30, 0.51, -2.76] },
    { 'id': 'pollen-tammy', 'name': 'Tammy (pollen)', 'position': [15.54, 0.82, -12.77] },
    { 'id': 'pollen-mom', 'name': 'Mom (pollen)', 'position': [37.12, 3.83, -22.98] },
    { 'id': 'pollen-dad', 'name': 'Dad (pollen)', 'position': [34.75, 3.86, -22.21] },

    { 'id': 'dust-anemone', 'name': 'Anemone (dust)', 'position': [-10.79, 0.01, -20.47] },
    { 'id': 'dust-cal', 'name': 'Cal (dust)', 'position': [27.66, 3.86, -16.93] },
    { 'id': 'dust-dys', 'name': 'Dys (dust)', 'position': [27.84, 3.78, -33.95] },
    { 'id': 'dust-mars', 'name': 'Marz (dust)', 'position': [28.39, 10.37, 8.07] },
    { 'id': 'dust-tang', 'name': 'Tang (dust)', 'position': [-2.89, 0.83, -5.00] },
    { 'id': 'dust-tammy', 'name': 'Tammy (dust)', 'position': [1.81, 0.95, 1.09] },
    { 'id': 'dust-mom', 'name': 'Mom (dust)', 'position': [25.56, 3.74, -27.31] },
    { 'id': 'dust-dad', 'name': 'Dad (dust)', 'position': [28.08, 3.83, -25.95] },

    { 'id': 'wet-anemone', 'name': 'Anemone (wet)', 'position': [-16.35, 0.01, -17.20] },
    { 'id': 'wet-cal', 'name': 'Cal (wet)', 'position': [10.33, 0.08, -15.21] },
    { 'id': 'wet-dys', 'name': 'Dys (wet)', 'position': [9.05, -0.08, -39.07] },
    { 'id': 'wet-mars', 'name': 'Marz (wet)', 'position': [34.32, 11.06, 8.60] },
    { 'id': 'wet-tang', 'name': 'Tang (wet)', 'position': [-11.93, 0.50, -7.68] },
    { 'id': 'wet-tammy', 'name': 'Tammy (wet)', 'position': [4.77, 0.41, -0.29] },
    { 'id': 'wet-mom', 'name': 'Mom (wet)', 'position': [38.80, 3.83, -23.56] },
    { 'id': 'wet-dad', 'name': 'Dad (wet)', 'position': [29.05, 3.78, -33.27] },

    { 'id': 'glow-anemone', 'name': 'Anemone (glow)', 'position': [17.86, 0.15, -23.22] },
    { 'id': 'glow-dys', 'name': 'Dys (glow)', 'position': [45.16, 3.78, -37.00] },
    { 'id': 'glow-mom', 'name': 'Mom (glow)', 'position': [15.04, 0.07, -11.72] },
  ],
  destroyedMapSpot: [
    { 'id': 'quiet-cal', 'name': 'Cal', 'position': [47.20, 6.51, -36.35] },
    { 'id': 'quiet-dys', 'name': 'Dys', 'position': [41.05, 6.30, -48.83] },
    { 'id': 'quiet-marz', 'name': 'Marz', 'position': [10.90, 3.34, -21.57] },
    { 'id': 'quiet-tang', 'name': 'Tang', 'position': [9.30, 2.90, -19.37] },
    { 'id': 'quiet-mom', 'name': 'Mom', 'position': [48.88, 6.35, -39.22] },
    { 'id': 'quiet-dad', 'name': 'Dad', 'position': [40.00, 6.35, -30.47] },
  ],
  postHelioMapSpots: [
    { 'id': 'quiet-anemone', 'name': 'Anemone (quiet)', 'position': [33.66, 3.40, -48.24] },
    { 'id': 'quiet-cal', 'name': 'Cal (quiet)', 'position': [-35.75, 0.83, 12.67] },
    { 'id': 'quiet-dys', 'name': 'Dys (quiet)', 'position': [-40.72, 12.14, -57.87] },
    { 'id': 'quiet-mars', 'name': 'Marz (quiet)', 'position': [-7.24, 11.30, -13.36] },
    { 'id': 'quiet-nomi', 'name': 'Nomi (quiet)', 'position': [15.01, 3.69, -17.69] },
    { 'id': 'quiet-rex', 'name': 'Rex (quiet)', 'position': [16.80, 3.80, -17.35] },
    { 'id': 'quiet-tang', 'name': 'Tang (quiet)', 'position': [46.49, 4.48, -23.10] },
    { 'id': 'quiet-tammy', 'name': 'Tammy (quiet)', 'position': [30.53, 1.05, 9.25] },
    { 'id': 'quiet-vace', 'name': 'Vace (quiet)', 'position': [8.23, 3.40, -43.79] },
    { 'id': 'quiet-mom', 'name': 'Mom (quiet)', 'position': [-54.07, 3.23, 5.35] },
    { 'id': 'quiet-dad', 'name': 'Dad (quiet)', 'position': [-51.91, 2.65, 5.50] },

    { 'id': 'pollen-anemone', 'name': 'Anemone (pollen)', 'position': [5.31, 3.40, -43.82] },
    { 'id': 'pollen-cal', 'name': 'Cal (pollen)', 'position': [21.38, 0.35, 1.72] },
    { 'id': 'pollen-dys', 'name': 'Dys (pollen)', 'position': [-28.73, 11.57, -38.61] },
    { 'id': 'pollen-mars', 'name': 'Marz (pollen)', 'position': [-10.55, 4.01, -22.17] },
    { 'id': 'pollen-nomi', 'name': 'Nomi (pollen)', 'position': [6.25, 4.44, -21.15] },
    { 'id': 'pollen-rex', 'name': 'Rex (pollen)', 'position': [-8.71, 4.08, -22.04] },
    { 'id': 'pollen-tang', 'name': 'Tang (pollen)', 'position': [40.83, 4.03, -23.77] },
    { 'id': 'pollen-tammy', 'name': 'Tammy (pollen)', 'position': [20.38, 0.40, 1.39] },
    { 'id': 'pollen-vace', 'name': 'Vace (pollen)', 'position': [11.96, 3.45, -53.32] },
    { 'id': 'pollen-mom', 'name': 'Mom (pollen)', 'position': [-43.55, 0.03, 25.47] },
    { 'id': 'pollen-dad', 'name': 'Dad (pollen)', 'position': [-40.53, 0.94, 13.65] },

    { 'id': 'dust-anemone', 'name': 'Anemone (dust)', 'position': [38.99, 3.40, -48.73] },
    { 'id': 'dust-cal', 'name': 'Cal (dust)', 'position': [-43.04, 3.40, -11.75] },
    { 'id': 'dust-dys', 'name': 'Dys (dust)', 'position': [-40.06, 12.06, -65.76] },
    { 'id': 'dust-mars', 'name': 'Marz (dust)', 'position': [-4.54, 11.78, -10.49] },
    { 'id': 'dust-nomi', 'name': 'Nomi (dust)', 'position': [31.35, 1.00, -6.66] },
    { 'id': 'dust-rex', 'name': 'Rex (dust)', 'position': [-4.82, 3.93, -17.95] },
    { 'id': 'dust-tang', 'name': 'Tang (dust)', 'position': [54.52, 6.19, -27.67] },
    { 'id': 'dust-tammy', 'name': 'Tammy (dust)', 'position': [34.22, 0.62, 6.42] },
    { 'id': 'dust-vace', 'name': 'Vace (dust)', 'position': [16.24, 3.45, -54.29] },
    { 'id': 'dust-mom', 'name': 'Mom (dust)', 'position': [-38.67, 0.40, 17.86] },
    { 'id': 'dust-dad', 'name': 'Dad (dust)', 'position': [-55.06, 3.51, -9.00] },

    { 'id': 'wet-anemone', 'name': 'Anemone (wet)', 'position': [6.38, 3.40, -51.17] },
    { 'id': 'wet-cal', 'name': 'Cal (wet)', 'position': [-43.98, 0.40, 18.50] },
    { 'id': 'wet-dys', 'name': 'Dys (wet)', 'position': [-46.37, 11.76, -66.26] },
    { 'id': 'wet-mars', 'name': 'Marz (wet)', 'position': [-7.47, 3.70, -16.84] },
    { 'id': 'wet-nomi', 'name': 'Nomi (wet)', 'position': [-43.82, 11.80, -64.16] },
    { 'id': 'wet-rex', 'name': 'Rex (wet)', 'position': [-5.75, 3.72, -15.47] },
    { 'id': 'wet-tang', 'name': 'Tang (wet)', 'position': [47.86, 4.31, -22.71] },
    { 'id': 'wet-tammy', 'name': 'Tammy (wet)', 'position': [24.31, 0.70, 3.18] },
    { 'id': 'wet-vace', 'name': 'Vace (wet)', 'position': [7.47, 3.44, -52.17] },
    { 'id': 'wet-mom', 'name': 'Mom (wet)', 'position': [-51.31, 3.41, -6.66] },
    { 'id': 'wet-dad', 'name': 'Dad (wet)', 'position': [-48.93, 3.16, 11.77] },

    { 'id': 'glow-anemone', 'name': 'Anemone (glow)', 'position': [13.74, 3.45, -51.89] },
    { 'id': 'glow-cal', 'name': 'Cal (glow)', 'position': [27.83, 0.35, 8.13] },
    { 'id': 'glow-dys', 'name': 'Dys (glow)', 'position': [9.35, 5.87, -23.15] },
    { 'id': 'glow-tang', 'name': 'Tang (glow)', 'position': [48.47, 4.29, -22.16] },
    { 'id': 'glow-vace', 'name': 'Vace (glow)', 'position': [14.79, 3.45, -52.70] },
    { 'id': 'glow-mom', 'name': 'Mom (glow)', 'position': [35.16, 0.85, 9.37] },
    { 'id': 'glow-dad', 'name': 'Dad (glow)', 'position': [36.66, 0.69, 8.97] },
  ],
  nearbyStratoMapSpots: [],
  nearbyHelioMapSpots: [],
  plainsMapSpots: [],
  valleyMapSpots: [],
  ridgeMapSpots: [],
}
