import { it } from 'vitest'
import { getImageSize } from './fetch'

it('getImageDimension', async ({ expect }) => {
	const dim = await getImageSize('https://placehold.co/600x400/EEE/31343C')
	expect(dim).contain({ width: 600, height: 400 })
})
