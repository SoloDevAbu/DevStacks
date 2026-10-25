import fs from "fs"
import path from "path"
import { FEATURED_BADGES } from "../constants/featured-badges"

const BADGES_DIR = path.join(process.cwd(), "public", "badges")

if (!fs.existsSync(BADGES_DIR)) {
  fs.mkdirSync(BADGES_DIR, { recursive: true })
}

export const syncFeaturedBadges = () => {
  console.log(`Local featured badges directory verified: ${BADGES_DIR}`)
  const files = fs.readdirSync(BADGES_DIR)
  console.log(`Found ${files.length} local badge files.`)
}

syncFeaturedBadges()
