import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import type { EnhancedSkipData } from "./skip-data"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Get the appropriate color class for skip size labels based on yard size
 * @param size - The skip size in yards
 * @returns The appropriate background color class
 */
export function getSkipLabelColorClass(size: number): string {
  if (size >= 4 && size <= 8) {
    return "bg-orange-light"
  } else if (size >= 10 && size <= 16) {
    return "bg-orange"
  } else if (size === 20 || size === 40) {
    return "bg-orange-dark"
  }
  return "bg-orange" // default fallback
}

/**
 * Calculate image height based on actual dimensions relative to other skips
 * @param skip - The skip to calculate height for
 * @param allSkips - Array of all skips for comparison
 * @param baseHeight - Base height in pixels (default: 120)
 * @returns Calculated height in pixels
 */
export function calculateImageHeight(skip: EnhancedSkipData, allSkips: EnhancedSkipData[], baseHeight = 120): number {
  const heightStr = skip.dimensions.height.metric.replace("m", "")
  const height = Number.parseFloat(heightStr)

  if (isNaN(height)) return baseHeight

  const tallestHeight = Math.max(
    ...allSkips.map((s) => {
      const h = Number.parseFloat(s.dimensions.height.metric.replace("m", ""))
      return isNaN(h) ? 0 : h
    }),
  )

  if (tallestHeight === 0) return baseHeight

  const ratio = height / tallestHeight
  return Math.max(baseHeight * ratio, 50)
}

/**
 * Calculate image width based on actual dimensions relative to other skips
 * @param skip - The skip to calculate width for
 * @param allSkips - Array of all skips for comparison
 * @param baseWidth - Base width in pixels (default: 200)
 * @returns Calculated width in pixels
 */
export function calculateImageWidth(skip: EnhancedSkipData, allSkips: EnhancedSkipData[], baseWidth = 200): number {
  const lengthStr = skip.dimensions.length.metric.replace("m", "")
  const length = Number.parseFloat(lengthStr)

  if (isNaN(length)) return baseWidth

  const longestLength = Math.max(
    ...allSkips.map((s) => {
      const l = Number.parseFloat(s.dimensions.length.metric.replace("m", ""))
      return isNaN(l) ? 0 : l
    }),
  )

  if (longestLength === 0) return baseWidth

  const ratio = length / longestLength
  return Math.max(baseWidth * ratio, 100)
}
