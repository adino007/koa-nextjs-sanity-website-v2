import client from '@/lib/sanity/client'
import dev from '@/lib/env'
import { ClientPerspective } from '@sanity/client'
import type { QueryParams, QueryOptions, FilteredResponseQueryOptions } from 'next-sanity'

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

	const fetchOptions: FilteredResponseQueryOptions = preview ? {
		stega: true,
		perspective: 'previewDrafts' as ClientPerspective,
		useCdn: false,
		token: process.env.NEXT_PUBLIC_SANITY_TOKEN,
		next: {
			revalidate: 60,
			tags: ['sanity', ...(next.tags || [])],
		},
	} : {
		perspective: 'published' as ClientPerspective,
		useCdn: true,
		next: {
			revalidate: 60,
			tags: ['sanity', ...(next.tags || [])],
		},
	}

	return client.fetch<T>(query, params, fetchOptions)
}