import type { Blog, Tool, Product, User } from "@/db/schema"

export interface BlogListItem {
  blog: Blog
  tool?: Tool | null
  product?: Product | null
  submitter?: User | null
}

