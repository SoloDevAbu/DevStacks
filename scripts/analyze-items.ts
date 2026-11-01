import fs from "fs"

const data = JSON.parse(fs.readFileSync("backups/db-analysis.json", "utf8"))

console.log("=== PRODUCTS (37) ===")
data.products.forEach((p: any, i: number) => {
  console.log(`[${i + 1}] "${p.name}"`)
  console.log(`    Legacy Category: "${p.cat_name}" (${p.cat_slug})`)
  console.log(`    Tagline: "${p.tagline}"`)
  console.log(`    Tags: ${(p.tags || []).join(", ")}`)
  console.log(`    Description: "${(p.description || "").slice(0, 150)}..."\n`)
})

console.log("\n=== DEVELOPER TOOLS (35) ===")
data.tools.forEach((t: any, i: number) => {
  console.log(`[${i + 1}] "${t.name}"`)
  console.log(`    Legacy Category: "${t.cat_name}" (${t.cat_slug})`)
  console.log(`    Tagline: "${t.tagline}"`)
  console.log(`    Tags: ${(t.tags || []).join(", ")}`)
  console.log(`    Description: "${(t.description || "").slice(0, 150)}..."\n`)
})

