import type { PlasmoCSConfig } from "plasmo"

export const config: PlasmoCSConfig = {
  matches: ["<all_urls>"]
}

let isInspecting = false

chrome.runtime.onConnect.addListener((port) => {
  if (port.name === "popup-inspect-connection") {
    port.onDisconnect.addListener(() => {
      cleanup()
    })
  }
})

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "toggle_inspect") {
    isInspecting = !isInspecting

    if (isInspecting) {
      document.addEventListener("mousemove", handleMouseMove)
      document.body.style.cursor = "crosshair"
    } else {
      cleanup()
    }
    sendResponse({ isInspecting })
  }
})

const handleMouseMove = (e: MouseEvent) => {
  if (!isInspecting) return

  const target = e.target as HTMLElement
  if (!target) return

  const textColor = window.getComputedStyle(target).color

  let currentElement: HTMLElement | null = target
  let backgroundColor = "rgb(255, 255, 255)"

  while (currentElement) {
    const styles = window.getComputedStyle(currentElement)
    const bgColor = styles.backgroundColor

    if (bgColor !== "rgba(0, 0, 0, 0)" && bgColor !== "transparent") {
      backgroundColor = bgColor
      break
    }

    currentElement = currentElement.parentElement
  }

  chrome.runtime
    .sendMessage({
      action: "hoverColorsDetected",
      payload: {
        textColor,
        backgroundColor
      }
    })
    .catch(() => {
      cleanup()
    })
}

const cleanup = () => {
  isInspecting = false
  document.removeEventListener("mousemove", handleMouseMove)
  document.body.style.cursor = "default"
}
