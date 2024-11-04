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

	return {
		title: venue.name,
		description: venue.description,
		openGraph: {
			images: venue.image?.asset?.url ? [venue.image.asset.url] : [],
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
