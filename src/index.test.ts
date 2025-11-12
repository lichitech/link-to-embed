import { it } from 'vitest'
import { link2Embed } from '.'

it('oEmbed', async ({ expect }) => {
	const data = await link2Embed('https://www.youtube.com/watch?v=x2bqscVkGxk')
	expect(data).toEqual({
		title: 'Let’s Internet Better',
		author_name: 'Google',
		author_url: 'https://www.youtube.com/@Google',
		type: 'video',
		height: 113,
		width: 200,
		version: '1.0',
		provider_name: 'YouTube',
		provider_url: 'https://www.youtube.com/',
		thumbnail_height: 360,
		thumbnail_width: 480,
		thumbnail_url: 'https://i.ytimg.com/vi/x2bqscVkGxk/hqdefault.jpg',
		html: '<iframe width="200" height="113" src="https://www.youtube.com/embed/x2bqscVkGxk?feature=oembed" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen title="Let’s Internet Better"></iframe>',
		method: 'provider-api',
	})
})

it('transformer', async ({ expect }) => {
	const data = await link2Embed('https://www.bilibili.com/video/BV1ys411472E?t=3.4&p=4')
	expect(data).toEqual({
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
})
