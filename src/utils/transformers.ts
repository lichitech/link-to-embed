import type { Transformer } from '../types'

/**
 * 创建 Transformer 的辅助函数，提供完整的类型提示
 *
 * @param config - Transformer 配置对象
 * @returns 配置完整的 Transformer 对象
 *
 * @example
 * ```typescript
 * const myTransformer = defineTransformer({
 *   key: 'my-site',
 *   name: 'My Site',
 *   patterns: [/https?:\/\/mysite\.com\/(\w+)/],
 *   transform: (url, matches) => {
 *     return {
 *       type: 'rich',
 *       provider_name: 'My Site',
 *       html: `<iframe src="${url}"></iframe>`
 *     }
 *   },
 *   priority: 10
 * })
 * ```
 */
export function defineTransformer<const T extends Transformer>(config: T): T {
	return config
}
