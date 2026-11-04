"use client"

import { ITEM_KIND } from "@/constants/items"
import { useVoteToggle } from "@/hooks/shared/use-vote-toggle"
import { setToolUpvote } from "@/lib/api/tools"

const TOOLS_LIST_QUERY_KEY = ["tools"]

export const useUpvoteTool = (slug: string) =>
  useVoteToggle({
    kind: ITEM_KIND.TOOL,
    slug,
    votedSlugsField: "upvotedToolSlugs",
    countsField: "toolUpvoteCounts",
    sendVote: setToolUpvote,
    listQueryKey: TOOLS_LIST_QUERY_KEY,
    errorTitle: "Your upvote wasn't saved",
  })
