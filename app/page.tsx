"use server"

import { getExtendedSkips } from "../lib/skip-data"
import SkipYard from "../skip-yard"
import { Suspense } from "react"
import { Loader2 } from "lucide-react"

// Loading component
function SkipYardLoading() {
  return (
    <div className="w-full min-h-screen bg-[backgroundd] flex items-center justify-center">
      <div className="text-center">
        <Loader2 className="w-8 h-8 animate-spin text-orange mx-auto mb-4" />
        <p className="text-foreground">Loading skip data...</p>
      </div>
    </div>
  )
}


export default async function Page() {
  const skips = await getExtendedSkips("NR32", "Lowestoft")
  
  return (
    <Suspense fallback={<SkipYardLoading />}>
      <SkipYard initialSkips={skips} />
    </Suspense>
  )
}
