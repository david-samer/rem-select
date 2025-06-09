"use client"

import { Check } from "lucide-react"
import { motion } from "framer-motion"

interface StepperHeaderProps {
  currentStep?: number
}

const steps = [
  { id: 1, name: "Postcode", completed: true },
  { id: 2, name: "Waste Type", completed: true },
  { id: 3, name: "Select Skip", completed: false, current: true },
  { id: 4, name: "Permit Check", completed: false },
  { id: 5, name: "Choose Date", completed: false },
  { id: 6, name: "Payment", completed: false },
]

export function SkipYardHeader({ currentStep = 3 }: StepperHeaderProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="backdrop-blur-sm border-b border-gray-700 p-4 sticky top-0 z-20 bg-[backgroundd]"
    >
      <div className="max-w-7xl mx-auto">
        {/* Mobile stepper */}
        <div className="block sm:hidden">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-foreground">
              Step {currentStep} of {steps.length}
            </span>
            <span className="text-xs text-foreground opacity-70">
              {Math.round((currentStep / steps.length) * 100)}% Complete
            </span>
          </div>
          <div className="w-full bg-gray-700 rounded-full h-2 mb-3">
            <div
              className="bg-orange h-2 rounded-full transition-all duration-300"
              style={{ width: `${(currentStep / steps.length) * 100}%` }}
            />
          </div>
          <div className="text-center">
            <h2 className="text-lg font-semibold text-foreground">
              {steps.find((step) => step.current)?.name || steps[currentStep - 1]?.name}
            </h2>
          </div>
        </div>

        {/* Desktop stepper */}
        <div className="hidden sm:block">
          <nav aria-label="Progress">
            <ol className="flex items-center justify-between w-full max-w-4xl mx-auto">
              {steps.map((step, stepIdx) => (
                <li key={step.name} className="flex items-center flex-1">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: stepIdx * 0.1 }}
                    className="flex flex-col items-center w-full "
                  >
                    <div className="flex items-center w-full">
                      {stepIdx > 0 && (
                        <div
                          className={`flex-1 h-0.5 transition-colors ${
                            step.completed || step.current ? "bg-orange" : "bg-gray-600"
                          }`}
                        />
                      )}
                      <div
                        className={`flex h-8 w-8 items-center justify-center rounded-full border-2 text-sm font-medium transition-colors mx-2 ${
                          step.completed
                            ? "border-orange bg-orange text-white"
                            : step.current
                              ? "border-orange bg-[backgroundd] text-orange"
                              : "border-gray-600 bg-[backgroundd] text-gray-400"
                        }`}
                      >
                        {step.completed ? <Check className="h-4 w-4" /> : <span>{step.id}</span>}
                      </div>
                      {stepIdx < steps.length - 1 && (
                        <div
                          className={`flex-1 h-0.5 transition-colors  ${
                            steps[stepIdx + 1].completed || steps[stepIdx + 1].current ? "bg-orange" : "bg-gray-600"
                          }`}
                        />
                      )}
                    </div>
                    <div className="mt-2 text-center">
                      <span
                        className={`text-xs font-medium ${
                          step.completed || step.current ? "text-foreground" : "text-gray-400"
                        }`}
                      >
                        {step.name}
                      </span>
                    </div>
                  </motion.div>
                </li>
              ))}
            </ol>
          </nav>
        </div>
      </div>
    </motion.div>
  )
}
