import FailIcon from "data-base64:~assets/fail.svg"
import PassIcon from "data-base64:~assets/pass.svg"

export function ContrastResult({ result, type }: ContrastResultProps) {
  return (
    <div
      className="plasmo-flex plasmo-items-center plasmo-justify-between plasmo-p-[9px] plasmo-rounded-[7px] plasmo-transition-colors plasmo-duration-150"
      style={{ backgroundColor: CONTRAST_RESULT_CONFIG[result].bg }}>
      <p
        className="plasmo-leading-6 plasmo-font-sans plasmo-transition-colors plasmo-duration-150"
        style={{ color: CONTRAST_RESULT_CONFIG[result].text }}>
        {type}
      </p>
      <img
        src={CONTRAST_RESULT_CONFIG[result].icon}
        alt={CONTRAST_RESULT_CONFIG[result].alt}
        className="size-[19px]"
      />
    </div>
  )
}

const CONTRAST_RESULT_CONFIG: Record<
  "pass" | "fail",
  { bg: string; text: string; alt: string; icon: string }
> = {
  pass: { bg: "#F0FDF4", text: "#16A34A", icon: PassIcon, alt: "Check" },
  fail: { bg: "#FEF2F2", text: "#B91C1C", icon: FailIcon, alt: "Failed" }
}

interface ContrastResultProps {
  result: "pass" | "fail"
  type: "AA Normal" | "AA Large" | "AAA Normal" | "AAA Large"
}
