import Image from "next/image"
import { cn } from "@/lib/utils"

interface GoogleIconProps {
  className?: string
  size?: number
}

export const GoogleIcon = ({ className, size = 16 }: GoogleIconProps) => (
  <Image
    src="/social-logo/search.png"
    alt="Google"
    width={size}
    height={size}
    className={cn("shrink-0 object-contain", className ?? "size-4")}
  />
)
