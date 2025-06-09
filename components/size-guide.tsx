"use client"

import { AlertTriangle, HardHat } from "lucide-react"
import { motion } from "framer-motion"

export function SizeGuide() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5 }}
      className="rounded-2xl p-6 shadow-lg bg-gray-light"
    >
      <h3 className="font-semibold text-lg mb-4 text-foreground">Skip Size Guide</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded-sm bg-orange-light"/>
          <span className="text-foreground">
            <strong>4-8yd:</strong> Home projects, garden clearance
          </span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded-sm bg-orange"/>
          <span className="text-foreground">
            <strong>10-16yd:</strong> Renovations, construction debris
          </span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded-sm bg-orange-dark"/>
          <span className="text-foreground">
            <strong>20-40yd:</strong> Commercial, large construction
          </span>
        </div>
      </div>
      <div className="mt-4 pt-4 border-t border-gray-600 flex flex-wrap gap-4 text-xs text-foreground opacity-80">
        <div className="flex items-center gap-1">
          <AlertTriangle className="w-3 h-3 text-orange" />
          <span>Not allowed on road</span>
        </div>
        <div className="flex items-center gap-1">
          <HardHat className="w-3 h-3 text-orange" />
          <span>No heavy waste</span>
        </div>
      </div>
    </motion.div>
  )
}
