import type { VideoEmbedData } from '../types'
import { getImageSize, getJson } from '../utils/fetch'
import { defineTransformer } from '../utils/transformers'

interface BiliBiliApiResponse {
	code: number
	message: string
	data: {
		pic: string
		title: string
		duration: number
		owner: { name: string, mid: number }
		dimension: { width: number, height: number }
	}
}

/**
 * Transformer for Bilibili(哔哩哔哩) URLs
 */
export default defineTransformer({
	key: 'bilibili',
	name: 'Bilibili',
	patterns: [
		/(?:https?:\/\/www\.)?bilibili\.com\/video\/(?:(?<bvid>BV\w+)|(?<avid>av\d+))\/?(?:\?(?<query>[^/]*))?/i,
		/(?:https?:\/\/www\.)?b23\.tv\/(?:(?<bvid>BV\w+)|(?<aid>av\d+))\/?(?:\?(?<query>[^/]*))?/i,
	],

	transform: async (url, matches, fetchOptions = {}): Promise<VideoEmbedData | null> => {
		const params: Record<string, string> = {
			high_quality: '1',
			danmaku: '0',
			as_wide: '1',
			autoplay: '0',
		}

		const { bvid, aid, query = '' } = matches.groups ?? {}
		const { t, p } = Object.fromEntries(query.split('&').map((item: string) => item.split('=')))
		if (bvid)
			params.bvid = bvid
		else
			params.aid = aid
		if (t)
			params.t = t
		if (p)
			params.p = p

		const attributes = {
			src: `//player.bilibili.com/player.html?${new URLSearchParams(params).toString()}`,
			scrolling: 'no',
			border: '0',
			frameborder: 'no',
			framespacing: '0',
			allowfullscreen: 'true',
		}
		const attributesString = Object.entries(attributes).map(([key, value]) => `${key}="${value}"`).join(' ')

		// Get more data from Bilibili API
		const result: VideoEmbedData = {
			type: 'video',
			provider_name: 'Bilibili',
			version: '1.0',
			provider_url: 'https://www.bilibili.com/',
			html: `<iframe ${attributesString}></iframe>`,
			width: 480,
			height: 360,
		}

		try {
			const { data } = await getJson<BiliBiliApiResponse>(`https://api.bilibili.com/x/web-interface/view?${bvid ? `bvid=${bvid}` : `aid=${aid}`}`, fetchOptions)
			result.title = data.title

			result.author_name = data.owner.name
			result.author_url = `https://space.bilibili.com/${data.owner.mid}`

			result.thumbnail_url = data.pic
			const { width, height } = await getImageSize(result.thumbnail_url, fetchOptions)
			result.thumbnail_width = width
			result.thumbnail_height = height
			result.width = data.dimension.width
			result.height = data.dimension.height
		}
		catch {}

		return result
	},
})
