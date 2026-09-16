export interface ContrastResult {
  ratio: string
  aaNormal: "pass" | "fail"
  aaLarge: "pass" | "fail"
  aaaNormal: "pass" | "fail"
  aaaLarge: "pass" | "fail"
}

function parseToRgb(color: string): [number, number, number] {
  const hexMatch = color.match(/^#?([a-f\d]{3,8})$/i)
  if (hexMatch) {
    let hex = hexMatch[1]

    if (hex.length === 3 || hex.length === 4) {
      hex = hex
        .split("")
        .map((char) => char + char)
        .join("")
    }

    return [
      parseInt(hex.slice(0, 2), 16),
      parseInt(hex.slice(2, 4), 16),
      parseInt(hex.slice(4, 6), 16)
    ]
  }

  const rgbMatch = color.match(/rgba?\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)/i)

  if (rgbMatch) {
    return [
      parseInt(rgbMatch[1], 10),
      parseInt(rgbMatch[2], 10),
      parseInt(rgbMatch[3], 10)
    ]
  }

  console.warn(
    `[calculateContrast]: Unrecognized color format "${color}". Defaulting to black.`
  )
  return [0, 0, 0]
}

function getsRGBLinear(c: number): number {
  const sRGB = c / 255
  return sRGB <= 0.04045 ? sRGB / 12.92 : Math.pow((sRGB + 0.055) / 1.055, 2.4)
}

function getLuminance(colorString: string): number {
  const [r, g, b] = parseToRgb(colorString)

  const rLinear = getsRGBLinear(r)
  const gLinear = getsRGBLinear(g)
  const bLinear = getsRGBLinear(b)

  return 0.2126 * rLinear + 0.7152 * gLinear + 0.0722 * bLinear
}

export function calculateContrast(
  color1: string,
  color2: string
): ContrastResult {
  const luminance1 = getLuminance(color1)
  const luminance2 = getLuminance(color2)

  const lighter = Math.max(luminance1, luminance2)
  const darker = Math.min(luminance1, luminance2)

  const ratio = (lighter + 0.05) / (darker + 0.05)
  const formatRatio = ratio.toFixed(2)

  return {
    ratio: formatRatio,
    aaNormal: ratio >= 4.5 ? "pass" : "fail",
    aaLarge: ratio >= 3.0 ? "pass" : "fail",
    aaaNormal: ratio >= 7.0 ? "pass" : "fail",
    aaaLarge: ratio >= 4.5 ? "pass" : "fail"
  }
}
