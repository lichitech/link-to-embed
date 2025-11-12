import type { FetchOptions as ExtractorFetchOptions, LinkTypeData as LinkEmbedData, Params, PhotoTypeData as PhotoEmbedData, RichTypeData as RichEmbedData, VideoTypeData as VideoEmbedData } from '@extractus/oembed-extractor'

export type { LinkEmbedData, PhotoEmbedData, RichEmbedData, VideoEmbedData }

export type FetchOptions = Omit<ExtractorFetchOptions, 'signal'> & { signal?: AbortSignal }

export type EmbedData = Partial<LinkEmbedData | PhotoEmbedData | RichEmbedData | VideoEmbedData>

export interface Transformer {
	/** Unique key identifier for the transformer */
	key: string
	/** Display name of the transformer */
	name: string
	/** Regular expressions that match URL patterns */
	patterns: RegExp[]
	/** Function to transform a URL into embed data */
	transform: (url: string, matches: RegExpExecArray, fetchOptions?: FetchOptions) => Promise<EmbedData | null> | EmbedData | null
	/** Priority of the transformer (higher values are processed first) */
	priority?: number
}

export interface LinkToEmbedOptions {
	/** Additional transformers to use */
	additionalTransformers?: Transformer[]
	/** Query parameters to oEmbed API endpoint */
	oEmbedParams?: Params
	/** Params to set request headers to fetch */
	fetchOptions?: FetchOptions
}
