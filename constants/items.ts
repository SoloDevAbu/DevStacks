export const ITEM_KIND = {
  TOOL: "tool",
  PRODUCT: "product",
} as const

export type ItemKind = (typeof ITEM_KIND)[keyof typeof ITEM_KIND]

export const ITEM_KIND_LABELS: Record<ItemKind, string> = {
  [ITEM_KIND.TOOL]: "Tool",
  [ITEM_KIND.PRODUCT]: "Product",
}
