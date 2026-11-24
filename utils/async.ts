export const mapInBatches = async <T, R>(
  items: readonly T[],
  batchSize: number,
  mapper: (item: T) => Promise<R>
): Promise<R[]> => {
  const results: R[] = []
  for (let start = 0; start < items.length; start += batchSize) {
    const batch = items.slice(start, start + batchSize)
    results.push(...(await Promise.all(batch.map(mapper))))
  }
  return results
}
