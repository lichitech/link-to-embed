import type { FetchOptions } from '../types'
import crossFetch from 'cross-fetch'
import { imageSize } from 'image-size'

async function proxyFetch(url: string, options: FetchOptions = {}): Promise<Response> {
	const { proxy = {}, signal = null } = options
	const {
		target,
		headers = {},
	} = proxy
	const res = await crossFetch(target + encodeURIComponent(url), {
		headers,
		signal,
	})
	return res
}

async function fetch(url: string, options: FetchOptions = {}): Promise<Response> {
	const isBrowser = typeof window !== 'undefined' && typeof document !== 'undefined'
	const { proxy, ...fetchOptions } = {
		headers: isBrowser
			? {}
			: { 'user-agent': 'Mozilla/5.0 (X11; Linux x86_64; rv:109.0) Gecko/20100101 Firefox/115.0' },
		proxy: null,
		agent: null,
		signal: null,
		...options,
	}

	const res = proxy ? await proxyFetch(url, options) : await crossFetch(url, fetchOptions)

	const status = res.status
	if (status >= 400) {
		throw new Error(`Request failed with error code ${status}`)
	}

	return res
}

export async function getHtml(url: string, options: FetchOptions = {}): Promise<string> {
	const res = await fetch(url, options)

	const text = await res.text()
	return text
}

export async function getJson<T extends object>(url: string, options: FetchOptions = {}): Promise<T> {
	const res = await fetch(url, options)

	try {
		const text = await res.text()
		return JSON.parse(text.trim())
	}
	catch {
		throw new Error('Failed to convert data to JSON object')
	}
}

export type ImageSize = ReturnType<typeof imageSize>
export async function getImageSize(url: string, options: FetchOptions = {}): Promise<ImageSize> {
	const res = await fetch(url, options)

	const buffer = await res.arrayBuffer()
	return imageSize(new Uint8Array(buffer))
}
