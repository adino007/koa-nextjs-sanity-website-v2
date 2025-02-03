const { createClient } = require('next-sanity')
const groq = require('groq')

const client = createClient({
	projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
	dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
	apiVersion: '2024-07-01',
	useCdn: true,
})

/** @type {import('next').NextConfig} */
const nextConfig = {
	images: {
		remotePatterns: [
			{
				protocol: 'https',
				hostname: 'cdn.sanity.io',
			},
		],
	},

	async redirects() {
		try {
			// Fetch dynamic redirects from Sanity
			const sanityRedirects = await client.fetch(
				groq`*[_type == 'redirect']{
          source,
          destination,
          permanent
        }`,
			)

			if (sanityRedirects.length > 0) {
				// Normalize each redirect's source to be relative and (if desired) add a host condition.
				return sanityRedirects.map((redirect) => {
					// Convert absolute URLs to relative paths.
					const relativeSource = redirect.source.replace(
						/^https?:\/\/[^\/]+/,
						'',
					)
					// (Optional) If you know the redirect should only trigger for non-www,
					// you can add a condition. For example:
					// has: [{ type: 'host', value: 'koalosangeles.com' }]
					return {
						source: relativeSource,
						destination: redirect.destination,
						permanent: redirect.permanent,
						// Uncomment and modify if needed:
						// has: [{ type: 'host', value: 'koalosangeles.com' }],
					}
				})
			}

			// Fallback: Only redirect if the request's host is exactly 'koalosangeles.com'
			return [
				{
					source: '/:path*', // Matches any path on the naked domain.
					// Only apply if the host header is 'koalosangeles.com'
					has: [
						{
							type: 'host',
							value: 'koalosangeles.com',
						},
					],
					destination: 'https://www.koalosangeles.com/:path*',
					permanent: true, // 301 redirect for SEO
				},
			]
		} catch (error) {
			console.error('Error fetching redirects from Sanity:', error)
			// In case of error, fallback with the same host-based redirect.
			return [
				{
					source: '/:path*',
					has: [
						{
							type: 'host',
							value: 'koalosangeles.com',
						},
					],
					destination: 'https://www.koalosangeles.com/:path*',
					permanent: true,
				},
			]
		}
	},

	// logging: {
	// 	fetches: {
	// 		fullUrl: true,
	// 	},
	// },
}

module.exports = {
	...nextConfig,
	productionBrowserSourceMaps: true,
}
