"use client"

import type React from "react"
import Image from "next/image"

import { useState } from "react"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Clock, Package, CheckCircle2, XCircle, Trash2, ArrowRight } from "lucide-react"
import { motion } from "framer-motion"
import { toast } from "sonner"
import type { EnhancedSkipData } from "./lib/skip-data"
import { SkipYardHeader } from "./components/skip-yard-header"
import { ComparisonSection } from "./components/comparison-section"
import { SkipCardList } from "./components/skip-card-list"
import { SizeGuide } from "./components/size-guide"
import { Scrollbar } from "@radix-ui/react-scroll-area"

interface SkipYardProps {
  initialSkips: EnhancedSkipData[]
}

export default function SkipYard({ initialSkips }: SkipYardProps) {
  const [skips] = useState<EnhancedSkipData[]>(initialSkips)
  const [selectedSkip, setSelectedSkip] = useState<EnhancedSkipData | null>(null)
  const [sheetOpen, setSheetOpen] = useState(false)
  const [comparisonSkips, setComparisonSkips] = useState<EnhancedSkipData[]>([])
  const [draggedSkip, setDraggedSkip] = useState<EnhancedSkipData | null>(null)
  const [isDragOver, setIsDragOver] = useState(false)

  const handleSkipClick = (skip: EnhancedSkipData) => {
    setSelectedSkip(skip)
    setSheetOpen(true)
  }

  // Native html5 drag and drop handlers
  const handleDragStart = (e: React.DragEvent<HTMLDivElement>, skip: EnhancedSkipData) => {
    setDraggedSkip(skip)
    e.dataTransfer.effectAllowed = "copy"
    e.dataTransfer.setData("text/plain", skip.id.toString())

    // Create a custom drag image
    // const dragImage = e.currentTarget.cloneNode(true) as HTMLElement
    // dragImage.style.transform = "rotate(5deg) scale(1.1)"
    // dragImage.style.opacity = "0.8"
    // document.body.appendChild(dragImage)
    // e.dataTransfer.setDragImage(dragImage, 0, 0)
    // setTimeout(() => document.body.removeChild(dragImage), 0)
  }

  const handleDragEnd = () => {
    setDraggedSkip(null)
    setIsDragOver(false)
  }

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = "copy"
    setIsDragOver(true)
  }

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    // Only set to false if we're actually leaving the drop zone
    const rect = e.currentTarget.getBoundingClientRect()
    const x = e.clientX
    const y = e.clientY

    if (x < rect.left || x > rect.right || y < rect.top || y > rect.bottom) {
      setIsDragOver(false)
    }
  }

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragOver(false)

    if (draggedSkip && !comparisonSkips.find((skip) => skip.id === draggedSkip.id)) {
      setComparisonSkips((prev) => [...prev, draggedSkip])
    }
    setDraggedSkip(null)
  }

  // Calculate VAT amount and total price
  const calculateVATAmount = (skip: EnhancedSkipData) => {
    return Math.round(skip.price_before_vat * (skip.vat / 100))
  }

  const calculateTotalPrice = (skip: EnhancedSkipData) => {
    return skip.price_before_vat + calculateVATAmount(skip)
  }

  return (
    <div className="w-full min-h-screen bg-[backgroundd]">
      {/* Header */}
      <SkipYardHeader currentStep={3} />

      {/* Main Content */}
      <div className="max-w-7xl mx-auto p-6">
        {/* Comparison Area */}
        <ComparisonSection
          skips={skips}
          comparisonSkips={comparisonSkips}
          setComparisonSkips={setComparisonSkips}
          isDragOver={isDragOver}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        />

        {/* Skip Grid */}
        <SkipCardList
          skips={skips}
          onSkipClick={handleSkipClick}
          draggedSkip={draggedSkip}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
        />

        {/* Size Guide */}
        <SizeGuide />
      </div>

      {/* Selection Sheet */}
      <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
        <SheetContent
          side="bottom"
          className="h-[80vh] sm:max-w-md sm:h-screen bg-gray-light text-foreground overflow-hidden p-2 md:p-5"
        >
          {selectedSkip && (
            <div className="h-full flex flex-col">
              <SheetHeader className="flex-shrink-0">
                <SheetTitle className="flex items-center gap-2 text-foreground">
                  <Package className="w-5 h-5" />
                  {selectedSkip.area} Yard Skip
                </SheetTitle>
                <SheetDescription className="text-foreground opacity-80">{selectedSkip.description}</SheetDescription>
              </SheetHeader>

              {/* Real skip image */}
              <div className="flex items-center justify-center py-4 border-b border-gray-600">
                <Image
                  src={
                    selectedSkip.size === 20 || selectedSkip.size === 40 ? "/images/lgSkip.png" : "/images/smSkip.png"
                  }
                  alt={`${selectedSkip.size} yard skip`}
                  width={selectedSkip.size === 20 || selectedSkip.size === 40 ? 240 : 200}
                  height={selectedSkip.size === 20 || selectedSkip.size === 40 ? 144 : 120}
                  className="drop-shadow-lg"
                />
              </div>

              <ScrollArea className="flex-1 mt-6 h-[30vh] ">
                <div className="space-y-4 pr-4">
                  {/* Price breakdown */}
                  <div className="bg-[backgroundd] p-4 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-lg font-bold text-foreground">£{selectedSkip.price_before_vat}</span>
                      <Badge variant="outline" className="flex items-center border-orange text-foreground">
                        <Clock className="w-4 h-4 mr-1" />
                        {selectedSkip.hire_period_days} day hire
                      </Badge>
                    </div>
                    <div className="text-sm text-foreground opacity-80 mb-3">Before VAT</div>

                    <div className="space-y-1 text-sm">
                      <div className="flex justify-between">
                        <span className="text-foreground opacity-80">VAT ({selectedSkip.vat}%)</span>
                        <span className="text-foreground">£{calculateVATAmount(selectedSkip)}</span>
                      </div>
                      <div className="border-t border-gray-600 pt-1 flex justify-between font-bold">
                        <span className="text-orange">Total Price</span>
                        <span className="text-orange">£{calculateTotalPrice(selectedSkip)}</span>
                      </div>
                    </div>
                  </div>

                  {/* Bin bag capacity highlight */}
                  <div className="bg-orange/20 p-3 rounded-lg border border-orange/30">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-orange">{selectedSkip.bin_bag_capacity}</div>
                      <div className="text-sm text-foreground opacity-80">bin bags capacity</div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3 rounded-lg bg-[backgroundd]">
                    <div className="flex items-start gap-2">
                      <div className="mt-0.5">
                        {selectedSkip.allowed_on_road ? (
                          <CheckCircle2 className="w-5 h-5 text-green-400" />
                        ) : (
                          <XCircle className="w-5 h-5 text-red-400" />
                        )}
                      </div>
                      <div>
                        <div className="font-medium text-sm text-foreground">Placement</div>
                        <div className="text-xs text-foreground opacity-80">
                          {selectedSkip.allowed_on_road ? "Can be placed on road with permit" : "Private property only"}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-start gap-2">
                      <div className="mt-0.5">
                        {selectedSkip.allows_heavy_waste ? (
                          <CheckCircle2 className="w-5 h-5 text-green-400" />
                        ) : (
                          <XCircle className="w-5 h-5 text-red-400" />
                        )}
                      </div>
                      <div>
                        <div className="font-medium text-sm text-foreground">Waste Type</div>
                        <div className="text-xs text-foreground opacity-80">
                          {selectedSkip.allows_heavy_waste
                            ? "Suitable for heavy waste including soil, rubble, and concrete"
                            : "Suitable for general waste, but not heavy materials"}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold mb-2 text-sm text-foreground">Perfect for:</h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedSkip.suitable.map((item, index) => (
                        <Badge key={index} variant="secondary" className="text-xs bg-orange text-foreground">
                          {item}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  {/* Enhanced Dimensions section in the Sheet */}
                  <div className="bg-[backgroundd] p-3 rounded-lg">
                    <div className="font-medium text-sm mb-2 text-foreground">Detailed Dimensions</div>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <div className="text-xs text-foreground opacity-70">Length</div>
                        <div className="font-medium text-orange">{selectedSkip.dimensions.length.metric}</div>
                        <div className="text-xs text-foreground opacity-50">
                          {selectedSkip.dimensions.length.imperial}
                        </div>
                      </div>
                      <div className="space-y-1">
                        <div className="text-xs text-foreground opacity-70">Width</div>
                        <div className="font-medium text-orange">{selectedSkip.dimensions.width.metric}</div>
                        <div className="text-xs text-foreground opacity-50">
                          {selectedSkip.dimensions.width.imperial}
                        </div>
                      </div>
                      <div className="space-y-1">
                        <div className="text-xs text-foreground opacity-70">Height</div>
                        <div className="font-medium text-orange">{selectedSkip.dimensions.height.metric}</div>
                        <div className="text-xs text-foreground opacity-50">
                          {selectedSkip.dimensions.height.imperial}
                        </div>
                      </div>
                      <div className="space-y-1">
                        <div className="text-xs text-foreground opacity-70">Capacity</div>
                        <div className="font-medium text-orange">{selectedSkip.dimensions.size.metric}</div>
                        <div className="text-xs text-foreground opacity-50">{selectedSkip.dimensions.size.imperial}</div>
                      </div>
                    </div>
                  </div>

                  {selectedSkip.transport_cost && (
                    <div className="p-3 rounded-lg text-xs bg-[backgroundd]">
                      <div className="font-medium text-orange">Transport & Disposal Details</div>
                      <div className="mt-1 text-foreground opacity-80">
                        Transport cost: £{selectedSkip.transport_cost} • Per tonne cost: £{selectedSkip.per_tonne_cost}
                      </div>
                    </div>
                  )}
                </div>
                <Scrollbar orientation="vertical"/>
              </ScrollArea>

              <div className="flex gap-3 pt-4 flex-shrink-0 border-t border-gray-600">
                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="flex-1">
                  <Button 
                    variant={"orange"} 
                    size="lg"
                    onClick={() => {
                      toast.success(`${selectedSkip.size} yard skip selected!`, {
                        description: `You've selected the ${selectedSkip.size} yard skip for £${calculateTotalPrice(selectedSkip)} (inc. VAT)`,
                        duration: 3000,
                      })
                    }}
                    className="w-full flex items-center justify-center gap-2"
                  >
                    <ArrowRight className="w-4 h-4" />
                    Select This Skip
                  </Button>
                </motion.div>
              </div>
            </div>
          )}
        </SheetContent>
      </Sheet>
    </div>
  )
}
