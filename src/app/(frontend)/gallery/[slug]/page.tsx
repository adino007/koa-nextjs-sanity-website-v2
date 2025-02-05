import { getEvent } from '@/lib/sanity/queries'
import GalleryView from '@/ui/modules/gallery/GalleryView'
import processMetadata from '@/lib/processMetadata'
import client from '@/lib/sanity/client'
import { groq } from '@/lib/sanity/fetch'

export default async function GalleryPage({
	params,
}: {
	params: { slug: string }
}) {
	const event = await getEvent(params.slug)

	// Structured data for SEO
	const structuredData = {
		'@context': 'https://schema.org',
		'@type': 'Event',
		name: event?.title,
		description: event?.metadata?.description,
		startDate: event?.time?.start,
		endDate: event?.time?.end,
		location: {
			'@type': 'Place',
			name: event?.venue?.name,
			address: event?.venue?.location,
		},
		image: event?.flyer?.asset?.url,
		url: `${process.env.NEXT_PUBLIC_SITE_URL}/gallery/${params.slug}`,
	}

	return (
		<>
			<script
				type="application/ld+json"
				dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
			/>
			<GalleryView event={event} />
		</>
	)
}

export async function generateMetadata({
	params,
}: {
	params: { slug: string }
}) {
	const event = await getEvent(params.slug)
	return processMetadata(event)
}

export async function generateStaticParams() {
	const slugs = await client.fetch<string[]>(
		groq`*[_type == 'event' && defined(metadata.slug.current)].metadata.slug.current`,
	)
	return slugs.map((slug) => ({ slug }))
}

type Props = {
	params: { slug?: string }
}
