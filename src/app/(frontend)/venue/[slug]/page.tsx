import { getVenue } from '@/lib/sanity/queries'
import { notFound } from 'next/navigation'
import VenueContent from '@/ui/modules/venue/VenueContent'
import DynamicBackground from '@/ui/modules/Styling Module/DynamicBackground'
import client from '@/lib/sanity/client'
import { groq } from '@/lib/sanity/fetch'

export default async function Page({ params }: Props) {
	const venue = await getVenue(params.slug!)
	if (!venue) notFound()

	return (
		<DynamicBackground imageUrl={venue.image?.asset?.url || ''}>
			<VenueContent venue={venue} />
		</DynamicBackground>
	)
}

export async function generateMetadata({ params }: Props) {
	const venue = await getVenue(params.slug!)
	if (!venue) notFound()

	const jsonLd = {
		'@context': 'https://schema.org',
		'@type': 'Place',
		name: venue.name,
		address: venue.location,
		description: venue.description,
		image: venue.image?.asset?.url,
		url: `${process.env.NEXT_PUBLIC_SITE_URL}/venue/${params.slug}`,
	}

	return {
		title: venue.name,
		description: venue.description,
		openGraph: {
			images: venue.image?.asset?.url ? [venue.image.asset.url] : [],
			url: `${process.env.NEXT_PUBLIC_SITE_URL}/venue/${params.slug}`,
		},
		alternates: {
			canonical: `/venue/${params.slug}`,
		},
		other: {
			'script:ld+json': JSON.stringify(jsonLd),
		},
	}
}

export async function generateStaticParams() {
	const slugs = await client.fetch<string[]>(
		groq`*[_type == 'venue' && defined(metadata.slug.current)].metadata.slug.current`,
	)
	return slugs.map((slug) => ({ slug }))
}

type Props = {
	params: { slug?: string }
}
