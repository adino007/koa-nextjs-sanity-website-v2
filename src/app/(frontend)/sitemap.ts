import { fetchSanity, groq } from '@/lib/sanity/fetch'
import type { MetadataRoute } from 'next'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
	const allPages = await fetchSanity<Record<string, MetadataRoute.Sitemap>>(
		groq`{
			'pages': *[
				_type == 'page' &&
				!(metadata.slug.current in ['404', 'blog/*', 'event/*', 'artist/*', 'venue/*']) &&
				metadata.noIndex != true
			]|order(metadata.slug.current){
				'url': $baseUrl + select(metadata.slug.current == 'index' => '', metadata.slug.current),
				'lastModified': _updatedAt,
				'priority': select(
					metadata.slug.current == 'index' => 1,
					0.5
				),
				'changefreq': 'daily'
			},
			'events': *[_type == 'event' && defined(metadata.slug.current)]|order(date desc){
				'url': $baseUrl + 'event/' + metadata.slug.current,
				'lastModified': _updatedAt,
				'priority': 0.8,
				'changefreq': 'always'
			},
			'artists': *[_type == 'artist' && defined(metadata.slug.current)]|order(name){
				'url': $baseUrl + 'artist/' + metadata.slug.current,
				'lastModified': _updatedAt,
				'priority': 0.7,
				'changefreq': 'weekly'
			},
			'venues': *[_type == 'venue' && defined(metadata.slug.current)]|order(name){
				'url': $baseUrl + 'venue/' + metadata.slug.current,
				'lastModified': _updatedAt,
				'priority': 0.6,
				'changefreq': 'weekly'
			}
		}`,
		{
			params: {
				baseUrl: process.env.NEXT_PUBLIC_BASE_URL + '/',
			},
			tags: ['sitemap'],
		},
	)

	return Object.values(allPages).flat()
}
