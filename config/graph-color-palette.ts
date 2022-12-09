const palettes = [
  'green',
  'purple',
  'oceanBlue',
  'coffee',
  'earth',
  'ocean',
  'halloween',
  'pastel',
  'forest',
  'chocolate'
] as const

export type PaletteType = typeof palettes[number]

const graphColorPalettes = {
  green: {
    bg: ['#00876c', '#63b179', '#aed987', '#ef8250', '#d43d51'],
    text: ['dark', 'dark', 'dark', 'dark', 'dark']
  },
  purple: {
    bg: ['#4b0082', '#af0073', '#eb1a53', '#ff742c', '#ffbf00'],
    text: ['light', 'light', 'dark', 'dark', 'dark']
  },
  oceanBlue: {
    bg: ['#004c6d', '#346888', '#5886a5', '#7aa6c2', '#9dc6e0', '#c1e7ff'],
    text: ['light', 'light', 'dark', 'dark', 'dark', 'dark']
  },
  coffee: {
    bg: ['#967E76', '#EEE3CB', '#B7C4CF', '#D7C0AE', '#EEE3CB', '#B7C4CF'],
    text: ['dark', 'dark', 'dark', 'dark', 'dark', 'dark']
  },
  earth: {
    bg: ['#5F939A', '#3A6351', '#A0937D', '#F2EDD7', '#3A6351', '#A0937D', '#F2EDD7'],
    text: ['dark', 'light', 'dark', 'dark', 'light', 'dark', 'dark']
  },
  ocean: {
    bg: ['#22577E', '#5584AC', '#95D1CC', '#F6F2D4', '#5584AC', '#95D1CC'],
    text: ['light', 'dark', 'dark', 'dark', 'dark', 'dark']
  },
  halloween: {
    bg: ['#EE8572', '#35495E', '#347474', '#63B7AF', '#35495E', '#347474'],
    text: ['dark', 'light', 'light', 'dark', 'light', 'dark']
  },
  pastel: {
    bg: ['#D68060', '#F1AE89', '#DFF3E3', '#86ABA1', '#F1AE89', '#DFF3E3', '#86ABA1'],
    text: ['dark', 'dark', 'dark', 'dark', 'dark', 'dark', 'dark']
  },
  forest: {
    bg: ['#1C6758', '#3D8361', '#D6CDA4', '#EEF2E6', '#3D8361', '#D6CDA4'],
    text: ['light', 'dark', 'dark', 'dark', 'dark', 'dark']
  },
  chocolate: {
    bg: ['#FFE3E3', '#A45D5D', '#FFC069', '#D7C0AE', '#A45D5D', '#FFC069', '#D7C0AE'],
    text: ['dark', 'light', 'dark', 'dark', 'light', 'dark', 'dark']
  }
}

export default graphColorPalettes
