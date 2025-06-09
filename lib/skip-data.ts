interface SkipData {
  id: number
  size: number
  hire_period_days: number
  transport_cost: number | null
  per_tonne_cost: number | null
  price_before_vat: number
  vat: number
  postcode: string
  area: string
  forbidden: boolean
  created_at: string
  updated_at: string
  allowed_on_road: boolean
  allows_heavy_waste: boolean
}

export interface EnhancedSkipData extends SkipData {
  suitable: string[]
  imageSrc: string
  realImgSrc: string
  imageWidth: number
  imageHeight: number
  // Static data properties
  description: string
  bin_bag_capacity: string
  dimensions: {
    size: { imperial: string; metric: string }
    length: { imperial: string; metric: string }
    width: { imperial: string; metric: string }
    height: { imperial: string; metric: string }
  }
  type?: string
}

interface SkipDimensionsData {
  description: string
  bin_bag_capacity: string
  size: { imperial: string; metric: string }
  length: { imperial: string; metric: string }
  width: { imperial: string; metric: string }
  height: { imperial: string; metric: string }
  type?: string
}

// Static skip dimensions data
const skipDimensionsData: Record<number, SkipDimensionsData> = {
  4: {
    description: '4 yard skips, normally known as "midi skips", are a great size for small domestic jobs.',
    bin_bag_capacity: "30–40",
    size: { imperial: "4 cu YRDs", metric: "3.06m³" },
    length: { imperial: "5'11\"", metric: "1.80m" },
    width: { imperial: "4′", metric: "1.22m" },
    height: { imperial: "3'2″", metric: "0.96m" },
    type: "Standard",
  },
  6: {
    description: '6 yard skips are referred to as "builders skips" and are great for hardcore waste.',
    bin_bag_capacity: "50–60",
    size: { imperial: "6 cu YRDs", metric: "4.06m³" },
    length: { imperial: "8'6″", metric: "2.60m" },
    width: { imperial: "5′", metric: "1.52m" },
    height: { imperial: "4′", metric: "1.22m" },
  },
  8: {
    description:
      '8 yard skips are the most popular. They are referred to as "builders skips", great for hardcore waste.',
    bin_bag_capacity: "60–80",
    size: { imperial: "8 cu YRDs", metric: "6.12m³" },
    length: { imperial: "10'6″", metric: "3.2m" },
    width: { imperial: "5'9″", metric: "1.75m" },
    height: { imperial: "4′", metric: "1.22m" },
  },
  10: {
    description: "10 yard skips are great for big cleanouts and bulky waste.",
    bin_bag_capacity: "80–100",
    size: { imperial: "10 cu YRDs", metric: "7.6m³" },
    length: { imperial: "12′", metric: "3.5m" },
    width: { imperial: "5'9″", metric: "1.75m" },
    height: { imperial: "4'11\"", metric: "1.5m" },
  },
  12: {
    description:
      '12 yard skips, sometimes referred to as "maxi skips", are great for large business or house clear outs. Not suitable for heavy hardcore due to weight restrictions.',
    bin_bag_capacity: "100–120",
    size: { imperial: "12 cu YRDs", metric: "9.8m³" },
    length: { imperial: "12'2″", metric: "3.7m" },
    width: { imperial: "5'9″", metric: "1.75m" },
    height: { imperial: "5'6″", metric: "1.68m" },
  },
  14: {
    description: "14 yard skips are a bit larger than the 12 yards and are again usually used for large business or house clear outs. They are not suitable for heavy hardcore as they have a weight restriction.",
    bin_bag_capacity: "120–140",
    size: { imperial: "14 cu YRDs", metric: "10.7m³" },
    length: { imperial: "13′", metric: "3.96m" },
    width: { imperial: "6′", metric: "1.83m" },
    height: { imperial: "5'9″", metric: "1.75m" },
  },
  16: {
    description: "16 yard skips are the largest standard skips available, perfect for major house clearances and large renovation projects. They are not suitable for heavy hardcore due to weight restrictions.",
    bin_bag_capacity: "140–160",
    size: { imperial: "16 cu YRDs", metric: "12.2m³" },
    length: { imperial: "14′", metric: "4.27m" },
    width: { imperial: "6'3″", metric: "1.91m" },
    height: { imperial: "6′", metric: "1.83m" },
  },
  20: {
    type: "Roll on roll off",
    description: "20 yard roll on roll off skips are used for light construction and demolition waste solutions.",
    bin_bag_capacity: "160–200",
    size: { imperial: "20 cu YRDs", metric: "15.3m³" },
    length: { imperial: "19'11\"", metric: "6.07m" },
    width: { imperial: "7'4″", metric: "2.23m" },
    height: { imperial: "5'4″", metric: "1.62m" },
  },
  40: {
    type: "Roll on roll off",
    description:
      "40 yard roll on roll off commercial skips are mostly used for large light waste types. This is the biggest skip we supply.",
    bin_bag_capacity: "350–400",
    size: { imperial: "40 cu YRDs", metric: "30.58m³" },
    length: { imperial: "19'11\"", metric: "6.07m" },
    width: { imperial: "7'4″", metric: "2.23m" },
    height: { imperial: "8'10″", metric: "2.69m" },
  },
}

// Helper function to get skip dimensions
const getSkipDimensions = (size: number) => {
  return skipDimensionsData[size as keyof typeof skipDimensionsData]
}

export async function getExtendedSkips(postcode = "NR32", area = "Lowestoft"): Promise<EnhancedSkipData[]> {
  try {
    const apiBaseUrl = process.env.SKIP_API_BASE_URL || 'https://app.wewantwaste.co.uk/api/skips/by-location'
    const response = await fetch(
      `${apiBaseUrl}?postcode=${postcode}&area=${area}`,
      {
        // Add cache control for better performance
        next: { revalidate: 300 }, // Revalidate every 5 minutes
      },
    )

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const data: SkipData[] = await response.json()

    // Transform and enhance the API data
    const enhancedSkips: EnhancedSkipData[] = data.map((skip: SkipData) => {
      // Get static dimensions data
      const staticData = getSkipDimensions(skip.size)

      // Determine suitable waste types based on skip properties
      const suitableFor = []

      if (skip.size <= 8) {
        suitableFor.push("Garden waste", "Home clearance")
      } else if (skip.size <= 16) {
        suitableFor.push("Renovation waste", "Construction debris")
      } else {
        suitableFor.push("Commercial waste", "Large construction")
      }

      if (skip.allows_heavy_waste) {
        suitableFor.push("Heavy materials")
      }

      // Determine which image to use
      let imageSrc = "/images/skip-only.png"
      let realImgSrc = "/images/smSkip.png"
      let imageWidth = 120
      let imageHeight = 60

      if (skip.size === 20) {
        imageSrc = "/images/20yd.png"
        realImgSrc = "/images/lgSkip.png"
        imageWidth = 160
        imageHeight = 80
      } else if (skip.size === 40) {
        imageSrc = "/images/40yd.png"
        realImgSrc = "/images/lgSkip.png"
        imageWidth = 200
        imageHeight = 100
      }

      return {
        ...skip,
        suitable: suitableFor,
        realImgSrc,
        imageSrc,
        imageWidth,
        imageHeight,
        // Add static data
        description: staticData?.description || `${skip.size} yard skip for waste disposal`,
        bin_bag_capacity: staticData?.bin_bag_capacity || "N/A",
        dimensions: {
          size: staticData?.size || { imperial: `${skip.size} cu YRDs`, metric: "N/A" },
          length: staticData?.length || { imperial: "N/A", metric: "N/A" },
          width: staticData?.width || { imperial: "N/A", metric: "N/A" },
          height: staticData?.height || { imperial: "N/A", metric: "N/A" },
        },
        type: staticData?.type,
      }
    })

    return enhancedSkips
  } catch (error) {
    console.error("Error fetching skips:", error)
    throw new Error("Failed to load skip data. Please try again later.")
  }
}
