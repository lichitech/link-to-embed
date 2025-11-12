import type { EmbedData, LinkToEmbedOptions, Transformer } from '../types'
import bilibili from './bilibili'

export const transformers: Transformer[] = [
	bilibili,
]

export async function transform(url: string, options: LinkToEmbedOptions = {}): Promise<EmbedData | null> {
	const { fetchOptions, additionalTransformers = [] } = options

	// Combine transformers: user-defined first (higher priority), then built-in
	// Sort by priority (higher priority first)
	const allTransformers = [
		...additionalTransformers,
		...transformers,
	].sort((a, b) => (b.priority ?? 0) - (a.priority ?? 0))

	for (let tIndex = 0; tIndex < allTransformers.length; tIndex++) {
		const { patterns, transform } = allTransformers[tIndex]
		for (let pIndex = 0; pIndex < patterns.length; pIndex++) {
			const pattern = patterns[pIndex]
			const matches = pattern.exec(url)

			if (matches === null)
				continue

			const result = await transform(url, matches, fetchOptions)

			return result
		}
	}
	return null
}
