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
			const sanityRedirects = await client.fetch(groq`*[_type == 'redirect']{
            source,
            destination,
            permanent
        }`)
			return sanityRedirects.length > 0
				? sanityRedirects
				: [
						{
							source: 'https://koalosangeles.com/:path*',
							destination: 'https://www.koalosangeles.com/:path*',
							permanent: true, // Default redirect for SEO
						},
					]
		} catch (error) {
			console.error('Error fetching redirects from Sanity:', error)
			return [
				{
					source: 'https://koalosangeles.com/:path*',
					destination: 'https://www.koalosangeles.com/:path*',
					permanent: true, // Default redirect
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
