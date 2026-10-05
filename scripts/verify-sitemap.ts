import "dotenv/config"
import { normalizeSitemapUrl } from "../utils/urls"
import sitemap from "../app/sitemap"

const runTests = async () => {
  console.log("=== Testing normalizeSitemapUrl ===")

  const testCases: [string, string][] = [
    [
      "https://www.launchnests.comhttps://www.launchnests.com/producthunt-alternative",
      "https://www.launchnests.com/producthunt-alternative",
    ],
    [
      "https://www.launchnests.com/producthunt-alternative",
      "https://www.launchnests.com/producthunt-alternative",
    ],
    [
      "http://www.launchnests.com/producthunt-alternative",
      "https://www.launchnests.com/producthunt-alternative",
    ],
    [
      "/producthunt-alternative",
      "https://www.launchnests.com/producthunt-alternative",
    ],
    [
      "producthunt-alternative",
      "https://www.launchnests.com/producthunt-alternative",
    ],
    [
      "https://www.launchnests.com",
      "https://www.launchnests.com",
    ],
    [
      "https://www.launchnests.com/",
      "https://www.launchnests.com",
    ],
    [
      "/",
      "https://www.launchnests.com",
    ],
    [
      "/tools",
      "https://www.launchnests.com/tools",
    ],
    [
      "https://www.launchnests.com/tools",
      "https://www.launchnests.com/tools",
    ],
    [
      "/tools?category=AI",
      "https://www.launchnests.com/tools?category=AI",
    ],
    [
      "https://www.launchnests.com/tools?category=AI",
      "https://www.launchnests.com/tools?category=AI",
    ],
    [
      "http://localhost:3000/products",
      "https://www.launchnests.com/products",
    ],
  ]

  let passed = 0
  for (const [input, expected] of testCases) {
    const actual = normalizeSitemapUrl(input)
    if (actual === expected) {
      console.log(`[PASS] ${input} -> ${actual}`)
      passed++
    } else {
      console.error(`[FAIL] ${input}\n  Expected: ${expected}\n  Actual:   ${actual}`)
    }
  }

  console.log(`\nURL normalization: ${passed}/${testCases.length} passed.`)

  if (passed !== testCases.length) {
    process.exit(1)
  }

  console.log("\n=== Testing sitemap() generator on main ===")
  const entries = await sitemap()
  console.log(`Total entries generated: ${entries.length}`)

  let allValid = true
  const seen = new Set<string>()

  for (const entry of entries) {
    if (!entry.url.startsWith("https://www.launchnests.com")) {
      console.error(`[FAIL] Not production https: ${entry.url}`)
      allValid = false
    }

    if (entry.url.includes("https://www.launchnests.comhttps")) {
      console.error(`[FAIL] Duplicate origin: ${entry.url}`)
      allValid = false
    }

    if (entry.url.startsWith("http://") || entry.url.includes("http://")) {
      console.error(`[FAIL] HTTP protocol detected: ${entry.url}`)
      allValid = false
    }

    if (seen.has(entry.url)) {
      console.error(`[FAIL] Duplicate entry: ${entry.url}`)
      allValid = false
    }
    seen.add(entry.url)
  }

  if (allValid) {
    console.log(`[PASS] All ${entries.length} sitemap entries verified successfully!`)
    console.log("\nSample verified entries:")
    entries.slice(0, 10).forEach((e) => console.log(` - ${e.url}`))
  } else {
    console.error("[FAIL] Sitemap entries verification failed.")
    process.exit(1)
  }
}

runTests().catch((err) => {
  console.error("Error during test:", err)
  process.exit(1)
})
