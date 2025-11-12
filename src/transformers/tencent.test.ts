import { it } from 'vitest'
import transformer from './tencent'

it('tencent', async ({ expect }) => {
	const url = 'https://v.qq.com/x/page/u3178217ugp.html'
	for (let index = 0; index < transformer.patterns.length; index++) {
		const pattern = transformer.patterns[index]
		const matches = pattern.exec(url)
		if (matches === null)
			continue

		const info = await transformer.transform(url, matches)
		expect(info).toEqual({
			type: 'video',
			version: '1.0',
			width: 1280,
			height: 720,
			html: `<iframe src="//v.qq.com/txp/iframe/player.html?vid=u3178217ugp" allowfullscreen="true"></iframe>`,
			provider_name: 'Tencent Video',
			provider_url: 'https://v.qq.com',
			thumbnail_url: 'https://vpic-cover.puui.qpic.cn/u3178217ugp/u3178217ugp_hz.jpg',
			thumbnail_width: 1280,
			thumbnail_height: 720,
		})

		break
	}
})
