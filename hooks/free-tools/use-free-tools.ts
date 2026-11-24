"use client"

import { useMutation } from "@tanstack/react-query"
import {
  checkAiReadiness,
  checkDomainRatings,
  checkLlmsTxt,
} from "@/lib/api/free-tools"

export const useDomainRatingCheck = () =>
  useMutation({ mutationFn: checkDomainRatings })

export const useAiReadinessCheck = () =>
  useMutation({ mutationFn: checkAiReadiness })

export const useLlmsTxtCheck = () => useMutation({ mutationFn: checkLlmsTxt })
