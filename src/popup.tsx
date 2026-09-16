import Logo from "data-base64:~assets/icon.png"
import { useEffect, useState } from "react"

import { ColorInput } from "~features/color-input"
import { ContrastResult } from "~features/contrast-result"

import "~style.css"

import { calculateContrast } from "~utils/contrast"

function IndexPopup() {
  const [textColor, setTextColor] = useState("#000")
  const [bgColor, setBgColor] = useState("#fff")
  const [isInspecting, setIsInspecting] = useState(false)

  useEffect(() => {
    const colorListener = (request: {
      action: string
      payload?: { textColor: string; backgroundColor: string }
    }) => {
      if (request.action === "hoverColorsDetected" && request.payload) {
        setTextColor(request.payload.textColor)
        setBgColor(request.payload.backgroundColor)
      }
    }

    chrome.runtime.onMessage.addListener(colorListener)

    return () => {
      chrome.runtime.onMessage.removeListener(colorListener)
    }
  }, [])

  useEffect(() => {
    let port: chrome.runtime.Port | null = null

    const connectToTab = async () => {
      if (isInspecting) {
        const [tab] = await chrome.tabs.query({
          active: true,
          currentWindow: true
        })
        if (tab?.id) {
          port = chrome.tabs.connect(tab.id, {
            name: "popup-inspect-connection"
          })
        }
      }
    }

    connectToTab()

    return () => {
      if (port) {
        port.disconnect()
      }
    }
  }, [isInspecting])

  const toggleInspect = async () => {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true })
    if (tab?.id) {
      const response = await chrome.tabs.sendMessage(tab.id, {
        action: "toggle_inspect"
      })
      if (response) {
        setIsInspecting(response.isInspecting)
      }
    }
  }

  const contrast = calculateContrast(textColor, bgColor)

  return (
    <div className="plasmo-flex plasmo-flex-col plasmo-gap-[7px] plasmo-h-fit plasmo-max-h-[550px] plasmo-w-[370px] plasmo-rounded-[14px] plasmo-bg-white plasmo-overflow-y-auto">
      <div className="plasmo-flex plasmo-items-center plasmo-gap-[7px] plasmo-py-[15px] plasmo-px-[19px] plasmo-bg-[#F8FAFC80] plasmo-border-b plasmo-border-[#F1F5F9]">
        <img src={Logo} alt="Logo" className="plasmo-size-[35px]" />
        <p className="plasmo-text-xl plasmo-leading-7 plasmo-font-bold plasmo-text-black plasmo-font-sans">
          Contrack
        </p>
      </div>

      <div className="plasmo-flex plasmo-flex-col plasmo-gap-6 plasmo-py-[9px] plasmo-px-[19px]">
        <div className="plasmo-grid plasmo-grid-cols-2 plasmo-gap-[15px]">
          <ColorInput title="Text Color" color={textColor} />
          <ColorInput title="Background Color" color={bgColor} />
        </div>

        <div
          className="plasmo-w-full plasmo-h-fit plasmo-flex plasmo-flex-col plasmo-items-center plasmo-py-[27px] plasmo-border plasmo-border-[#E2E8F0] plasmo-rounded-[10px] plasmo-transition-colors plasmo-duration-150"
          style={{ backgroundColor: bgColor }}>
          <p
            className="plasmo-text-center plasmo-text-[22px] plasmo-leading-[33px] plasmo-font-bold plasmo-font-sans plasmo-transition-colors plasmo-duration-150"
            style={{ color: textColor }}>
            Aa
          </p>
          <p
            className="plasmo-text-center plasmo-leading-9 plasmo-font-sans plasmo-transition-colors plasmo-duration-150"
            style={{ color: textColor }}>
            The quick brown fox
          </p>
        </div>

        <div className="plasmo-flex plasmo-flex-col plasmo-gap-3.5">
          <div className="plasmo-flex plasmo-items-end plasmo-justify-between">
            <p className="plasmo-text-sm plasmo-leading-[19px] plasmo-font-medium plasmo-text-[#878588] plasmo-font-sans">
              Contrast Ratio
            </p>

            <p className="plasmo-text-[28px] plasmo-font-semibold plasmo-leading-[43px] -plasmo-tracking-[1px] plasmo-text-[#16A34A] plasmo-font-sans">
              {contrast.ratio}
            </p>
          </div>

          <div className="plasmo-grid plasmo-grid-cols-2 plasmo-gap-x-[9px] plasmo-gap-y-2.5">
            <ContrastResult result={contrast.aaNormal} type="AA Normal" />
            <ContrastResult result={contrast.aaLarge} type="AA Large" />
            <ContrastResult result={contrast.aaaNormal} type="AAA Normal" />
            <ContrastResult result={contrast.aaaLarge} type="AAA Large" />
          </div>
        </div>
      </div>

      <div className="plasmo-flex plasmo-flex-col plasmo-gap-3 plasmo-py-[21px] plasmo-px-5">
        {isInspecting ? (
          <button
            onClick={toggleInspect}
            disabled={!isInspecting}
            className="plasmo-w-full plasmo-h-fit plasmo-py-3 plasmp-px-8 plasmo-rounded-full plasmo-bg-gray-100 plasmo-text-sm plasmo-font-medium plasmo-font-sans plasmo-text-black plasmo-leading-[100%]">
            Exit Inspect Mode
          </button>
        ) : (
          <button
            disabled={isInspecting}
            onClick={toggleInspect}
            className="plasmo-w-full plasmo-h-fit plasmo-py-3 plasmp-px-8 plasmo-rounded-full plasmo-bg-[#6B4CF5] plasmo-text-sm plasmo-font-medium plasmo-font-sans plasmo-text-white plasmo-leading-[100%]">
            Inspect Page Element
          </button>
        )}
      </div>
    </div>
  )
}

export default IndexPopup
