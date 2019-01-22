export type BorderMap = {
    "level_-1": string,
    "level_0": string,
    "level_1": string,
    "level_2": string
  }
export  const borderMap: BorderMap = {
    "level_-1": "./assets/borders/no_border.png",
    "level_0": "./assets/borders/border_bronze.png",
    "level_1": "./assets/borders/border_silver.png",
    "level_2": "./assets/borders/border_gold.png"
  }
  
export function getBorderForLevel(level: string) {
    return borderMap[level]
  }
