"use client"

import type React from "react"

import { useState } from "react"
import { motion } from "framer-motion"
import { SkipCard } from "./ui/skip-card"
import type { EnhancedSkipData } from "../lib/skip-data"

interface SkipCardListProps {
  skips: EnhancedSkipData[]
  onSkipClick: (skip: EnhancedSkipData) => void
  draggedSkip: EnhancedSkipData | null
  onDragStart: (e: React.DragEvent<HTMLDivElement>, skip: EnhancedSkipData) => void
  onDragEnd: () => void
}

export function SkipCardList({ skips, onSkipClick, draggedSkip, onDragStart, onDragEnd }: SkipCardListProps) {
  const [hoveredSkip, setHoveredSkip] = useState<number | null>(null)

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.2 }}
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 mb-8"
    >
      {skips.map((skip, index) => (
        <SkipCard
          key={skip.id}
          skip={skip}
          index={index}
          isHovered={hoveredSkip === skip.id}
          isDragged={draggedSkip?.id === skip.id}
          onMouseEnter={() => setHoveredSkip(skip.id)}
          onMouseLeave={() => setHoveredSkip(null)}
          onClick={() => onSkipClick(skip)}
          onDragStart={(e) => onDragStart(e, skip)}
          onDragEnd={onDragEnd}
        />
      ))}
    </motion.div>
  )
}
