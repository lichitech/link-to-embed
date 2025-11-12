import { it } from 'vitest'
import transformer from './bilibili'

it('bilibili', async ({ expect }) => {
	const url = 'https://www.bilibili.com/video/BV1ys411472E?t=3.4&p=4'
	for (let index = 0; index < transformer.patterns.length; index++) {
		const pattern = transformer.patterns[index]
		const matches = pattern.exec(url)
		if (matches === null)
			continue

		const info = await transformer.transform(url, matches)
		expect(info).toEqual({
			version: '1.0',
			type: 'video',
			title: '【官方双语/合集】线性代数的本质 - 系列合集',
			provider_name: 'Bilibili',
			provider_url: 'https://www.bilibili.com/',
			html: '<iframe src="//player.bilibili.com/player.html?high_quality=1&danmaku=0&as_wide=1&autoplay=0&bvid=BV1ys411472E&t=3.4&p=4" scrolling="no" border="0" frameborder="no" framespacing="0" allowfullscreen="true"></iframe>',
			width: 640,
			height: 360,
			author_name: '3Blue1Brown',
			author_url: 'https://space.bilibili.com/88461692',
			thumbnail_url: 'http://i2.hdslb.com/bfs/archive/c81a8eb032f3eaa1afd604272a410ac6896f281e.jpg',
			thumbnail_width: 1536,
			thumbnail_height: 960,
		})

		break
	}
})
