"use client"

import type React from "react"

import { useState } from "react"
import Image from "next/image"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Scale, Plus, Check, X, CheckCircle2, XCircle } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"
import { motion, AnimatePresence } from "framer-motion"
import type { EnhancedSkipData } from "../lib/skip-data"
import { calculateImageHeight, calculateImageWidth } from "../lib/utils"

interface ComparisonSectionProps {
  skips: EnhancedSkipData[]
  comparisonSkips: EnhancedSkipData[]
  setComparisonSkips: React.Dispatch<React.SetStateAction<EnhancedSkipData[]>>
  isDragOver: boolean
  onDragOver: (e: React.DragEvent<HTMLDivElement>) => void
  onDragLeave: (e: React.DragEvent<HTMLDivElement>) => void
  onDrop: (e: React.DragEvent<HTMLDivElement>) => void
}

export function ComparisonSection({
  skips,
  comparisonSkips,
  setComparisonSkips,
  isDragOver,
  onDragOver,
  onDragLeave,
  onDrop,
}: ComparisonSectionProps) {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [selectedSkipsForComparison, setSelectedSkipsForComparison] = useState<number[]>([])

  const removeFromComparison = (skipId: number) => {
    setComparisonSkips((prev) => prev.filter((skip) => skip.id !== skipId))
  }

  const toggleSkipSelection = (skipId: number) => {
    setSelectedSkipsForComparison((prev) => {
      if (prev.includes(skipId)) {
        return prev.filter((id) => id !== skipId)
      } else {
        return [...prev, skipId]
      }
    })
  }

  const addSelectedSkipsToComparison = () => {
    const skipsToAdd = skips.filter((skip) => selectedSkipsForComparison.includes(skip.id))

    // Only add skips that aren't already in the comparison
    const newSkips = skipsToAdd.filter(
      (skipToAdd) => !comparisonSkips.some((existingSkip) => existingSkip.id === skipToAdd.id),
    )

    setComparisonSkips((prev) => [...prev, ...newSkips])
    setSelectedSkipsForComparison([])
    setIsAddDialogOpen(false)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
      className={`mb-8 p-6 rounded-2xl border-2 border-dashed transition-all duration-300 ${
        isDragOver ? "border-orange bg-orange/10" : "border-gray-400 bg-gray-light"
      }`}
      onDragOver={onDragOver}
      onDragLeave={onDragLeave}
      onDrop={onDrop}
    >
      <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-4">
        <div className="flex items-center gap-2">
          <Scale className="w-5 h-5 text-foreground" />
          <h2 className="text-base sm:text-lg font-semibold text-foreground">Scale Reference & Comparison</h2>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="w-full sm:w-auto sm:ml-auto">
              <Button variant={"orange"} size="sm" >
                <Plus className="w-4 h-4 mr-1" />
                <span className="hidden sm:inline">Add to Comparison</span>
                <span className="sm:hidden">Add to Compare</span>
              </Button>
            </motion.div>
          </DialogTrigger>
          <DialogContent className="bg-gray-light text-foreground border-orange max-w-2xl">
            <DialogHeader>
              <DialogTitle className="text-foreground">Select Skips to Compare</DialogTitle>
              <DialogDescription className="text-foreground opacity-80">
                Choose the skips you want to add to the comparison zone.
              </DialogDescription>
            </DialogHeader>
            <ScrollArea className="h-[300px]  pr-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <AnimatePresence>
                  {skips.map((skip, index) => {
                    const isAlreadyInComparison = comparisonSkips.some((s) => s.id === skip.id)
                    const isSelected = selectedSkipsForComparison.includes(skip.id)

                    return (
                      <motion.div
                        key={skip.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                        // whileHover={{ scale: isAlreadyInComparison ? 1 : 1.02 }}
                        whileTap={{ scale: isAlreadyInComparison ? 1 : 0.98 }}
                        className={`p-3 rounded-lg flex items-center gap-2 cursor-pointer transition-colors ${
                          isAlreadyInComparison
                            ? "bg-gray-700 opacity-50 cursor-not-allowed"
                            : isSelected
                              ? "bg-orange/20 border border-orange"
                              : "bg-gray-700 hover:bg-gray-600"
                        }`}
                        onClick={() => {
                          if (!isAlreadyInComparison) {
                            toggleSkipSelection(skip.id)
                          }
                        }}
                      >
                        <div className="flex-shrink-0">
                          <Image
                            src={skip.imageSrc || "/placeholder.svg"}
                            alt={`${skip.size} yard skip`}
                            width={60}
                            height={30}
                            className="drop-shadow-md"
                          />
                        </div>
                        <div className="flex-grow">
                          <div className="font-medium">{skip.size} Yard Skip</div>
                          <div className="text-xs text-foreground opacity-80">£{skip.price_before_vat}</div>
                        </div>
                        <div className="flex-shrink-0">
                          {isAlreadyInComparison ? (
                            <motion.div
                              whileHover={{ scale: 1.05 }}
                            >
                              <Badge 
                                className="bg-gray-500 text-foreground cursor-pointer transition-colors"
                                onClick={(e) => {
                                  e.stopPropagation()
                                  removeFromComparison(skip.id)
                                }}
                              >
                                Added
                              </Badge>
                            </motion.div>
                          ) : isSelected ? (
                            <motion.div
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              transition={{ type: "spring", stiffness: 500, damping: 30 }}
                            >
                              <Check className="w-5 h-5 text-orange" />
                            </motion.div>
                          ) : (
                            <Plus className="w-5 h-5 text-foreground opacity-50" />
                          )}
                        </div>
                      </motion.div>
                    )
                  })}
                </AnimatePresence>
              </div>
            </ScrollArea>
            <div className="flex justify-end gap-2 mt-4">
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button
                  className="bg-orange hover:bg-orange/90 text-white"
                  onClick={addSelectedSkipsToComparison}
                  disabled={selectedSkipsForComparison.length === 0}
                >
                  Add Selected
                </Button>
              </motion.div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <AnimatePresence mode="wait">
        {comparisonSkips.length === 0 ? (
          <motion.div
            key="empty"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="text-center py-8"
          >
            <p className="text-lg mb-2 text-foreground">Drag skips here to compare sizes and specifications</p>
            <p className="text-sm text-foreground opacity-70">
              Compare pricing, placement options, and waste restrictions side by side
            </p>
          </motion.div>
        ) : (
          <motion.div
            key="comparison"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="mt-8"
          >
            {/* Visual comparison with person - Fixed position, scrollable skips */}
            <div className="relative h-[150px] mb-8">
              {/* Ground line */}
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-foreground opacity-50"></div>

              {/* Person reference - Fixed position */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="absolute bottom-2 left-4 z-10"
              >
                <div className="flex flex-col items-center py-3">
                  <Image
                    src="/images/worker.png"
                    alt="Worker for scale reference"
                    width={30}
                    height={60}
                    className="mb-1"
                  />
                  <span className="text-xs text-foreground opacity-70">6ft</span>
                </div>
              </motion.div>

              {/* Scrollable skip containers */}
              <div className="absolute bottom-2 left-20 right-0">
                <ScrollArea className="w-full ">
                  <div className="flex items-end gap-8 py-3 min-w-max">
                    <AnimatePresence>
                      {comparisonSkips.map((skip, index) => (
                        <motion.div
                          key={skip.id}
                          initial={{ opacity: 0, x: 50, y: 20 }}
                          animate={{ opacity: 1, x: 0, y: 0 }}
                          exit={{ opacity: 0, x: 0, y: 50 }}
                          // transition={{ delay: index * 0.1 }}
                          className="relative group flex-shrink-0"
                        >
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => removeFromComparison(skip.id)}
                            className="absolute -top-2 -right-2 bg-orange hover:bg-orange/90 rounded-full p-1 z-10 opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
                          >
                            <X className="w-3 h-3 text-white" />
                          </motion.button>

                          <div className="flex flex-col items-center">
                            <motion.div
                              whileHover={{ scale: 1.05 }}
                              transition={{ type: "spring", stiffness: 400, damping: 30 }}
                            >
                              <Image
                                src={skip.imageSrc || "/placeholder.svg"}
                                alt={`${skip.size} yard skip`}
                                width={calculateImageWidth(skip, skips)}
                                height={calculateImageHeight(skip, skips)}
                                className="mb-1"
                              />
                            </motion.div>
                            <span className="text-xs text-foreground">{skip.size}yd</span>
                          </div>
                        </motion.div>
                      ))}
                    </AnimatePresence>
                  </div>
                  <ScrollBar orientation="horizontal" />
                </ScrollArea>
              </div>
            </div>

            {/* Tabular comparison */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="overflow-x-auto -mx-2 sm:mx-0"
            >
              <div className="min-w-[600px] sm:min-w-0">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-gray-700">
                      <th className="py-2 px-2 sm:px-4 text-foreground font-medium w-24 sm:w-32 text-xs sm:text-sm">
                        Specification
                      </th>
                      {comparisonSkips.map((skip) => (
                        <th
                          key={`header-${skip.id}`}
                          className="py-2 px-2 sm:px-4 text-foreground font-medium text-center min-w-[120px] sm:min-w-[150px] text-xs sm:text-sm"
                        >
                          {skip.size} Yard Skip
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="text-xs sm:text-sm">


                    {/* Description */}
                    <motion.tr
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.45 }}
                      className="border-b border-gray-700/50"
                    >
                      <td className="py-2 px-4 text-foreground bg-[backgroundd] font-medium">Description</td>
                      {comparisonSkips.map((skip) => (
                        <td key={`desc-${skip.id}`} className="py-2 px-4 text-foreground text-center text-sm">
                          {skip.description}
                        </td>
                      ))}
                    </motion.tr>

                    {/* Bin Bag Capacity */}
                    <motion.tr
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.47 }}
                      className="border-b border-gray-700/50"
                    >
                      <td className="py-2 px-4 text-foreground bg-[backgroundd] font-medium">Bin Bag Capacity</td>
                      {comparisonSkips.map((skip) => (
                        <td key={`bags-${skip.id}`} className="py-2 px-4 text-center">
                          <div className="text-orange font-medium">{skip.bin_bag_capacity}</div>
                          <div className="text-xs text-foreground opacity-70">bags</div>
                        </td>
                      ))}
                    </motion.tr>

                    {/* Size */}
                    <motion.tr
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.5 }}
                      className="border-b border-gray-700/50"
                    >
                      <td className="py-2 px-4 text-foreground bg-[backgroundd] font-medium">Size</td>
                      {comparisonSkips.map((skip) => (
                        <td key={`size-${skip.id}`} className="py-2 px-4 text-center">
                          <div className="text-orange font-medium">{skip.dimensions.size.metric}</div>
                          <div className="text-xs text-foreground opacity-70">{skip.dimensions.size.imperial}</div>
                        </td>
                      ))}
                    </motion.tr>

                    {/* Length */}
                    <motion.tr
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.55 }}
                      className="border-b border-gray-700/50"
                    >
                      <td className="py-2 px-4 text-foreground bg-[backgroundd] font-medium">Length</td>
                      {comparisonSkips.map((skip) => (
                        <td key={`length-${skip.id}`} className="py-2 px-4 text-center">
                          <div className="text-orange font-medium">{skip.dimensions.length.metric}</div>
                          <div className="text-xs text-foreground opacity-70">{skip.dimensions.length.imperial}</div>
                        </td>
                      ))}
                    </motion.tr>

                    {/* Width */}
                    <motion.tr
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.6 }}
                      className="border-b border-gray-700/50"
                    >
                      <td className="py-2 px-4 text-foreground bg-[backgroundd] font-medium">Width</td>
                      {comparisonSkips.map((skip) => (
                        <td key={`width-${skip.id}`} className="py-2 px-4 text-center">
                          <div className="text-orange font-medium">{skip.dimensions.width.metric}</div>
                          <div className="text-xs text-foreground opacity-70">{skip.dimensions.width.imperial}</div>
                        </td>
                      ))}
                    </motion.tr>

                    {/* Height */}
                    <motion.tr
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.65 }}
                      className="border-b border-gray-700/50"
                    >
                      <td className="py-2 px-4 text-foreground bg-[backgroundd] font-medium">Height</td>
                      {comparisonSkips.map((skip) => (
                        <td key={`height-${skip.id}`} className="py-2 px-4 text-center">
                          <div className="text-orange font-medium">{skip.dimensions.height.metric}</div>
                          <div className="text-xs text-foreground opacity-70">{skip.dimensions.height.imperial}</div>
                        </td>
                      ))}
                    </motion.tr>

                    {/* Road Placement */}
                    <motion.tr
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.7 }}
                      className="border-b border-gray-700/50"
                    >
                      <td className="py-2 px-4 text-foreground bg-[backgroundd] font-medium">Road Placement</td>
                      {comparisonSkips.map((skip) => (
                        <td key={`road-${skip.id}`} className="py-2 px-4 text-center">
                          <div className="flex items-center justify-center">
                            {skip.allowed_on_road ? (
                              <CheckCircle2 className="w-5 h-5 text-green-400" />
                            ) : (
                              <XCircle className="w-5 h-5 text-red-400" />
                            )}
                            <span className="ml-1 text-foreground text-sm">
                              {skip.allowed_on_road ? "Allowed" : "Not Allowed"}
                            </span>
                          </div>
                        </td>
                      ))}
                    </motion.tr>

                    {/* Heavy Waste */}
                    <motion.tr
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.75 }}
                      className="border-b border-gray-700/50"
                    >
                      <td className="py-2 px-4 text-foreground bg-[backgroundd] font-medium">Heavy Waste</td>
                      {comparisonSkips.map((skip) => (
                        <td key={`heavy-${skip.id}`} className="py-2 px-4 text-center">
                          <div className="flex items-center justify-center">
                            {skip.allows_heavy_waste ? (
                              <CheckCircle2 className="w-5 h-5 text-green-400" />
                            ) : (
                              <XCircle className="w-5 h-5 text-red-400" />
                            )}
                            <span className="ml-1 text-foreground text-sm">
                              {skip.allows_heavy_waste ? "Allowed" : "Not Allowed"}
                            </span>
                          </div>
                        </td>
                      ))}
                    </motion.tr>

                    {/* Price */}
                    <motion.tr
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.8 }}
                      className="border-b border-gray-700/50"
                    >
                      <td className="py-2 px-4 text-foreground bg-[backgroundd] font-medium">Price (before VAT)</td>
                      {comparisonSkips.map((skip) => (
                        <td key={`price-${skip.id}`} className="py-2 px-4 text-center">
                          <div className="text-xl font-bold text-orange">£{skip.price_before_vat}</div>
                          <div className="text-xs text-foreground opacity-70">{skip.hire_period_days} day hire</div>
                        </td>
                      ))}
                    </motion.tr>
                  </tbody>
                </table>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}
