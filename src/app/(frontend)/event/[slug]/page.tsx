import client from '@/lib/sanity/client'
import { groq } from '@/lib/sanity/fetch'
import { getEvent } from '@/lib/sanity/queries'
import { notFound } from 'next/navigation'
import EventContent from '@/ui/modules/event/EventContent'
import DynamicBackground from '@/ui/modules/Styling Module/DynamicBackground'
import { draftMode } from 'next/headers'

export default async function Page({ params }: Props) {
	const event = await getEvent(params.slug!)
	if (!event) notFound()

	return (
		<DynamicBackground imageUrl={event.flyer?.asset?.url || ''}>
			<EventContent event={event} />
		</DynamicBackground>
	)
}

export async function generateMetadata({ params }: Props) {
	const event = await getEvent(params.slug!)
	if (!event) notFound()

	const jsonLd = {
		'@context': 'https://schema.org',
		'@type': 'Event',
		name: event.name,
		startDate: event.time?.start,
		endDate: event.time?.end,
		location: {
			'@type': 'Place',
			name: event.venue?.name,
			address: event.venue?.location,
		},
		image: event.flyer?.asset?.url,
		performers: event.artists?.map((artist) => ({
			'@type': 'PerformingGroup',
			name: artist.name,
		})),
		url: `${process.env.NEXT_PUBLIC_SITE_URL}/event/${params.slug}`,
	}

	return {
		title: event.name,
		description: `${event.name} at ${event.venue?.name}`,
		openGraph: {
			images: event.flyer?.asset?.url ? [event.flyer.asset.url] : [],
			url: `${process.env.NEXT_PUBLIC_SITE_URL}/event/${params.slug}`,
		},
		alternates: {
			canonical: `/event/${params.slug}`,
		},
		other: {
			'script:ld+json': JSON.stringify(jsonLd),
		},
	}
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
