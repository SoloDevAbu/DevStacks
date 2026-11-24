interface RobotsRule {
  allow: boolean
  pattern: string
}

interface RobotsGroup {
  agents: string[]
  rules: RobotsRule[]
}

const parseGroups = (robotsTxt: string): RobotsGroup[] => {
  const groups: RobotsGroup[] = []
  let current: RobotsGroup | null = null
  let lastWasAgent = false

  for (const rawLine of robotsTxt.split(/\r?\n/)) {
    const line = rawLine.replace(/#.*$/, "").trim()
    const separator = line.indexOf(":")
    if (separator === -1) continue

    const key = line.slice(0, separator).trim().toLowerCase()
    const value = line.slice(separator + 1).trim()

    if (key === "user-agent") {
      if (!current || !lastWasAgent) {
        current = { agents: [], rules: [] }
        groups.push(current)
      }
      current.agents.push(value.toLowerCase())
      lastWasAgent = true
      continue
    }

    lastWasAgent = false
    if (!current || (key !== "allow" && key !== "disallow")) continue
    // An empty Disallow allows everything, so it adds no rule.
    if (value) current.rules.push({ allow: key === "allow", pattern: value })
  }

  return groups
}

const patternMatches = (pattern: string, path: string) => {
  const anchored = pattern.endsWith("$")
  const body = (anchored ? pattern.slice(0, -1) : pattern)
    .split("*")
    .map((part) => part.replace(/[.+?^${}()|[\]\\]/g, "\\$&"))
    .join(".*")
  return new RegExp(`^${body}${anchored ? "$" : ""}`).test(path)
}

// RFC 9309: the most specific matching group wins, then the longest matching rule (Allow on a tie).
export const isPathAllowedForAgent = (
  robotsTxt: string,
  userAgent: string,
  path = "/"
) => {
  const groups = parseGroups(robotsTxt)
  const agent = userAgent.toLowerCase()
  const named = groups.filter((group) => group.agents.includes(agent))
  const applicable =
    named.length > 0
      ? named
      : groups.filter((group) => group.agents.includes("*"))

  const matching = applicable
    .flatMap((group) => group.rules)
    .filter((rule) => patternMatches(rule.pattern, path))
    .toSorted(
      (a, b) =>
        b.pattern.length - a.pattern.length || Number(b.allow) - Number(a.allow)
    )

  return matching[0]?.allow ?? true
}
