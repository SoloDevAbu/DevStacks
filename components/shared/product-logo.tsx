import { cn } from "@/lib/utils"

export const ProductLogo = ({
  text,
  bgColor,
  textColor,
  borderColor,
  className,
}: {
  text: string
  bgColor: string
  textColor: string
  borderColor?: string
  className?: string
}) => {
  return (
    <div
      className={cn(
        "flex items-center justify-center font-bold",
        bgColor,
        textColor,
        borderColor,
        className
      )}
    >
      {text}
    </div>
  )
}
