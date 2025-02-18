import { getSite } from '@/lib/sanity/queries'
import processUrl from './processUrl'
import type { Metadata } from 'next'

export default async function processMetadata(
	data: Sanity.Page | Sanity.BlogPost | Sanity.Event | Sanity.Venue | Sanity.Artist | null,
): Promise<Metadata> {
	const site = await getSite()

	if (!data) {
		return {
			title: 'KÖA Afro House Events',
			description: 'Experience the best Afro House events in Los Angeles with KÖA.',
			openGraph: {
				title: 'KÖA Afro House Events',
				description: 'Experience the best Afro House events in Los Angeles with KÖA.',
				images: site?.ogimage ? [{ url: site.ogimage }] : [],
			},
		}
	}

	const url = processUrl(data)
	const { title, description, ogimage, noIndex } = data.metadata

	// Handle different types of data
	const name = 'name' in data ? data.name : 'title' in data ? data.title : ''
	const imageUrl =
		'image' in data
			? data.image?.asset?.url
			: 'flyer' in data
			? data.flyer?.asset?.url
			: 'photo' in data
			? data.photo?.asset?.url
			: undefined

	// Structured data for SEO
	const structuredData = {
		'@context': 'https://schema.org',
		'@type': data._type === 'event' ? 'Event' : data._type === 'venue' ? 'Place' : data._type === 'artist' ? 'Person' : 'WebSite',
		name,
		description: data.metadata?.description,
		image: imageUrl,
		url,
		...(data._type === 'event' && {
			startDate: data.time?.start,
			endDate: data.time?.end,
			location: {
				'@type': 'Place',
				name: data.venue?.name,
				address: data.venue?.location,
			},
		}),
		...(data._type === 'artist' && {
			sameAs: data.socialLinks?.map((link) => link.url),
		}),
	}

	return {
		metadataBase: new URL(process.env.NEXT_PUBLIC_BASE_URL!),
		title,
		description,
		openGraph: {
			type: 'website',
			url,
			title,
			description,
			siteName: 'KÖA Afro House Events',
			images: ogimage ? [{ url: ogimage }] : site?.ogimage ? [{ url: site.ogimage }] : [],
		},
		twitter: {
			card: 'summary_large_image',
			title,
			description,
			images: ogimage ? [ogimage] : site?.ogimage ? [site.ogimage] : [],
		},
		robots: {
			index: !noIndex,
			follow: !noIndex,
			googleBot: {
				index: !noIndex,
				follow: !noIndex,
				'max-video-preview': -1,
				'max-image-preview': 'large',
				'max-snippet': -1,
			},
		},
		alternates: {
			canonical: url,
		},
		verification: {
			google: process.env.NEXT_PUBLIC_GOOGLE_VERIFICATION,
		}
	}}