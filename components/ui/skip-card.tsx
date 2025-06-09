"use client"

import type React from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { AlertTriangle, CheckCircle2, XCircle, HardHat } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import type { EnhancedSkipData } from "../../lib/skip-data"
import { cn, getSkipLabelColorClass } from "@/lib/utils"

interface SkipCardProps {
  skip: EnhancedSkipData
  index: number
  isHovered: boolean
  isDragged: boolean
  onMouseEnter: () => void
  onMouseLeave: () => void
  onClick: () => void
  onDragStart: (e: React.DragEvent<HTMLDivElement>) => void
  onDragEnd: () => void
}

export function SkipCard({
  skip,
  index,
  isHovered,
  isDragged,
  onMouseEnter,
  onMouseLeave,
  onClick,
  onDragStart,
  onDragEnd,
}: SkipCardProps) {
  return (
    <TooltipProvider>
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.01 }}
        whileTap={{ scale: 0.98 }}
        className={`relative rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer group bg-gray-light ${
          isDragged ? "opacity-50" : ""
        }`}
        onClick={(e: React.MouseEvent<HTMLDivElement>) => {
          // Only trigger click if not clicking on the draggable image
          if (!(e.target as HTMLElement).closest('[data-draggable="true"]')) {
            onClick()
          }
        }}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
      >
      {/* Skip Image Container - Draggable to comparison zone */}
      <div className="flex items-center justify-center mb-4 relative h-[100px]">
        <motion.div
          whileHover={{
            scale: isHovered ? 1.05 : 1,
          }}
          transition={{ type: "spring", stiffness: 400, damping: 30 }}
          className="relative h-full flex items-center justify-center"
        >
          <div
            className="cursor-grab active:cursor-grabbing h-full flex items-center justify-center"
            data-draggable="true"
            draggable
            onDragStart={onDragStart}
            onDragEnd={onDragEnd}
          >
            <Image
              src={skip.realImgSrc || "/placeholder.svg"}
              alt={`${skip.size} yard skip`}
              width={skip.imageWidth}
              height={skip.imageHeight}
              className="drop-shadow-lg pointer-events-none max-h-[100px] w-auto object-contain"
            />

            {/* Drag indicator */}
            {isDragged && (
              <div className="absolute inset-0 border-2 border-dashed border-orange rounded-lg bg-orange/10" />
            )}
          </div>
        </motion.div>

        {/* Restriction indicators */}
        <div className="absolute -top-1 -right-1 sm:-top-2 sm:-right-2 flex gap-1 pointer-events-auto z-10">
          <AnimatePresence>
            {!skip.allowed_on_road && (
              <Tooltip>
                <TooltipTrigger asChild>
                  <motion.div
                    key="road-restriction"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0 }}
                    className="rounded-full p-1 bg-gray-dark shadow-md"
                  >
                    <AlertTriangle className="w-3 h-3 text-orange" />
                  </motion.div>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Not allowed on road - Private property only</p>
                </TooltipContent>
              </Tooltip>
            )}
            {!skip.allows_heavy_waste && (
              <Tooltip>
                <TooltipTrigger asChild>
                  <motion.div
                    key="heavy-waste-restriction"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0 }}
                    className="rounded-full p-1 bg-gray-dark shadow-md"
                  >
                    <HardHat className="w-3 h-3 text-orange" />
                  </motion.div>
                </TooltipTrigger>
                <TooltipContent>
                  <p>No heavy waste - General waste only</p>
                </TooltipContent>
              </Tooltip>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Skip Details */}
      <div className="text-center">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 + index * 0.05 }}
          className={cn(
            "text-sm font-bold px-3 py-1 rounded-full inline-block mb-3 text-foreground",
            getSkipLabelColorClass(skip.size)
          )}
        >
          {skip.size} Yard Skip
        </motion.div>
        <div className="text-2xl font-bold mb-1 text-foreground">£{skip.price_before_vat}</div>
        <div className="text-sm mb-3 text-foreground opacity-80">Before VAT • {skip.hire_period_days} days</div>

        {/* Quick Info */}
        <div className="space-y-2 text-xs">
          <div className="flex items-center justify-center gap-1">
            {skip.allowed_on_road ? (
              <CheckCircle2 className="w-3 h-3 text-green-400" />
            ) : (
              <XCircle className="w-3 h-3 text-red-400" />
            )}
            <span className="text-foreground opacity-90">
              {skip.allowed_on_road ? "Road placement OK" : "Private property only"}
            </span>
          </div>
          <div className="flex items-center justify-center gap-1">
            {skip.allows_heavy_waste ? (
              <CheckCircle2 className="w-3 h-3 text-green-400" />
            ) : (
              <XCircle className="w-3 h-3 text-red-400" />
            )}
            <span className="text-foreground opacity-90">
              {skip.allows_heavy_waste ? "Heavy waste OK" : "General waste only"}
            </span>
          </div>
        </div>

        {/* Dimensions */}
        <div className="mt-3 text-xs text-foreground opacity-70">
          {skip.dimensions.length.metric} × {skip.dimensions.width.metric} × {skip.dimensions.height.metric}
        </div>

        {/* Bin bag capacity */}
        <div className="mt-1 text-xs text-orange font-medium">{skip.bin_bag_capacity} bin bags</div>

        {/* Hover effect */}
        <motion.div
          initial={{ opacity: 1 }}
          // animate={{ opacity: isHovered ? 1 : 0 }}
          transition={{ duration: 0.3 }}
          className="mt-4"
        >
          <Button variant={"orange"} size="sm" >
            View Details
          </Button>
        </motion.div>

        {/* Drag hint */}
        <div className="mt-2 text-xs opacity-60 text-foreground">Drag image to compare</div>
      </div>
    </motion.div>
    </TooltipProvider>
  )
}
