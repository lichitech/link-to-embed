//
// https://m.v.qq.com/txp/v3/src/iframeapi/new.html

import type { VideoEmbedData } from '../types'
import { getImageSize } from '../utils/fetch'
import { defineTransformer } from '../utils/transformers'

export default defineTransformer({
	key: 'tencent',
	name: 'Tencent Video',
	patterns: [
		// video https://v.qq.com/x/page/u3178217ugp.html
		// https://vpic-cover.puui.qpic.cn/u3178217ugp/u3178217ugp_1762696174_hz.jpg/1280?max_age=7776000
		/(?:https?:\/\/)?v.qq.com\/x\/page\/(?<vid>\w+).html/i,
	],
	transform: async (url, matches): Promise<VideoEmbedData> => {
		const { vid } = matches.groups ?? {}

		const thumbnail_url = `https://vpic-cover.puui.qpic.cn/${vid}/${vid}_hz.jpg`

		const result: VideoEmbedData = {
			type: 'video',
			version: '1.0',
			width: 640,
			height: 390,
			html: `<iframe src="//v.qq.com/txp/iframe/player.html?vid=${vid}" allowfullscreen="true"></iframe>`,
			provider_name: 'Tencent Video',
			provider_url: 'https://v.qq.com',
			thumbnail_url,
		}

		const { width, height } = await getImageSize(thumbnail_url)
		result.thumbnail_width = width
		result.thumbnail_height = height
		result.width = width
		result.height = height

		return result
	},
})
