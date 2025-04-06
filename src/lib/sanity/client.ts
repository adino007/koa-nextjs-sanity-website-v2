import { createClient } from 'next-sanity'
import dev from '@/lib/env'

export default createClient({
	projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
	dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
	apiVersion: '2025-02-19',
	useCdn: !dev,
	stega: {
		enabled: false,
		studioUrl: '/admin',
	},
	perspective: 'published',
	timeout: 60000, // 60 seconds timeout
	token: process.env.NEXT_PUBLIC_SANITY_TOKEN,
	// Add UTF-8 support
	headers: {
		'Content-Type': 'application/json; charset=utf-8',
	},
})
