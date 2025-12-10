import type { EmbedData, LinkToEmbedOptions } from './types'

import { extract as oEmbedExtract } from '@extractus/oembed-extractor'
import { transform } from './transformers'
import { defineTransformer } from './utils/transformers'

export async function link2Embed(url: string, options: LinkToEmbedOptions = {}): Promise<EmbedData | null> {
	// Try to use oEmbed first
	const { oEmbedParams, fetchOptions } = options
	try {
		const oEmbedData = await oEmbedExtract(url, oEmbedParams, fetchOptions)
		return oEmbedData
	}
	catch {}

	// Fallback to internal compatible transformers
	return transform(url, options)
}

export { defineTransformer }
export type * from './types'
