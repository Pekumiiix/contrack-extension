export function ColorInput({ title, color }: ColorInputProps) {
  return (
    <div className="plasmo-flex plasmo-flex-col plasmo-gap-[5px]">
      <p className="plasmo-text-sm plasmo-leading-[19px] plasmo-font-medium plasmo-text-[#28242A] plasmo-font-sans">
        {title}
      </p>

      <div className="plasmo-flex plasmo-items-center plasmo-gap-2.5 plasmo-p-2 plasmo-rounded-[10px] plasmo-border plasmo-border-[#E2E8F0]">
        <div
          className="plasmo-w-[23px] plasmo-h-[29px] plasmo-border plasmo-border-[#00000033] plasmo-rounded-[5px]"
          style={{ backgroundColor: color }}
        />
        <p className="plasmo-text-xs plasmo-font-medium plasmo-leading-[19px] plasmo-font-sans">
          {color}
        </p>
      </div>
    </div>
  )
}

interface ColorInputProps {
  title: string
  color: string
}
