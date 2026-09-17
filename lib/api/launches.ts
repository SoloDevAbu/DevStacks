import axios from "axios"
import type { FeedItem } from "@/components/shared/feed-card"

export const fetchWeeklyLaunches = async (year: number, week: number): Promise<FeedItem[]> => {
  const { data } = await axios.get<FeedItem[]>("/api/launches/weekly", {
    params: { year, week },
  })
  return data
}
