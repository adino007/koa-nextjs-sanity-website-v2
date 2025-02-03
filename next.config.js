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
			// Fetch redirects from Sanity
			const sanityRedirects = await client.fetch(
				groq`*[_type == 'redirect']{
          source,
          destination,
          permanent
        }`,
			)

			// If we have any redirects from Sanity, map them to ensure the source is a relative path.
			if (sanityRedirects.length > 0) {
				return sanityRedirects.map((redirect) => ({
					// Remove any protocol and domain from the source.
					source: redirect.source.replace(/^https?:\/\/[^\/]+/, ''),
					destination: redirect.destination,
					permanent: redirect.permanent,
				}))
			}

			// Fallback default redirect if no redirects are defined in Sanity.
			return [
				{
					source: '/:path*', // Relative path for the source
					destination: 'https://www.koalosangeles.com/:path*',
					permanent: true, // 301 Redirect (SEO-friendly)
				},
			]
		} catch (error) {
			console.error('Error fetching redirects from Sanity:', error)
			// Return the default redirect in case of an error
			return [
				{
					source: '/:path*', // Relative path for the source
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
