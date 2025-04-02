import { getVenue } from '@/lib/sanity/queries'
import { notFound } from 'next/navigation'
import VenueContent from '@/ui/modules/venue/VenueContent'
import processMetadata from '@/lib/processMetadata'
import DynamicBackground from '@/ui/modules/Styling Module/DynamicBackground'
import client from '@/lib/sanity/client'
import { groq } from '@/lib/sanity/fetch'

export default async function VenuePage({
	params,
}: {
	params: { slug: string }
}) {
	const venue = await getVenue(params.slug)
	if (!venue) notFound()

	// Structured data for SEO
	const structuredData = {
		'@context': 'https://schema.org',
		'@type': 'Place',
		name: venue.name,
		address: venue.location,
		description: venue.metadata?.description,
		image: venue.image?.asset?.url,
		url: `${process.env.NEXT_PUBLIC_SITE_URL}/venue/${params.slug}`,
	}

	return (
		<>
			<script
				type="application/ld+json"
				dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
			/>
			<DynamicBackground imageUrl={venue.image?.asset?.url || ''}>
				<VenueContent venue={venue} />
			</DynamicBackground>
		</>
	)
}

export async function generateMetadata({
	params,
}: {
	params: { slug: string }
}) {
	const venue = await getVenue(params.slug)
	return processMetadata(venue)
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
