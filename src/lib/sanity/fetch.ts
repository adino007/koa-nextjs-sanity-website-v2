import client from '@/lib/sanity/client'
import dev from '@/lib/env'
import type { QueryParams, QueryOptions } from 'next-sanity'

export { default as groq } from 'groq'

// Ensure draftMode is handled server-side only
let isDraftModeEnabled = false

if (typeof window === 'undefined') {
	// Only require draftMode in a server-side environment
	try {
		const { draftMode } = require('next/headers')
		isDraftModeEnabled = draftMode().isEnabled
	} catch (error) {
		console.warn('draftMode is not available in this context.')
	}
}

export function fetchSanity<T = any>(
	query: string,
	{
		params = {},
		...next
	}: {
		params?: QueryParams
	} & QueryOptions['next'] = {},
) {
	const preview = dev || isDraftModeEnabled

	return client.fetch<T>(
		query,
		params,
		preview
			? {
					stega: true,
					perspective: 'previewDrafts',
					useCdn: false,
					token: process.env.NEXT_PUBLIC_SANITY_TOKEN,
					next: {
						revalidate: 0, // revalidate after 1 hour
						...next,
					},
				}
			: {
					perspective: 'published',
					useCdn: true,
					next: {
						revalidate: 360, // revalidate after 1 hour
						...next,
					},
				},
	)
}
