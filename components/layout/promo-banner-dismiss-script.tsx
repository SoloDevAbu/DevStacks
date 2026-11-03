import { PROMO_BANNER_DISMISS } from "@/constants/promo"

const DISMISS_SCRIPT = `try{if(localStorage.getItem(${JSON.stringify(PROMO_BANNER_DISMISS.STORAGE_KEY)}))document.documentElement.setAttribute(${JSON.stringify(PROMO_BANNER_DISMISS.HTML_ATTRIBUTE)},"")}catch(e){}`

// Server component: runs before first paint so a dismissed launch promo never flashes.
export const PromoBannerDismissScript = () => (
  <script dangerouslySetInnerHTML={{ __html: DISMISS_SCRIPT }} />
)
