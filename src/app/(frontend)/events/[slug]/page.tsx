import client from '@/lib/sanity/client'
import { groq } from '@/lib/sanity/fetch'
import { getSingleEvent } from '@/lib/sanity/queries'
import { notFound } from 'next/navigation'
import EventContent from '@/ui/modules/event/EventContent'
import DynamicBackground from '@/ui/modules/event/DynamicBackground'

export default async function Page({ params }: Props) {
	const event = await getSingleEvent(params.slug!)
	if (!event) notFound()

	return (
		<DynamicBackground imageUrl={event.flyer?.asset?.url || ''}>
			<EventContent event={event} />
		</DynamicBackground>
	)
}

export async function generateMetadata({ params }: Props) {
	const event = await getSingleEvent(params.slug!)
	if (!event) notFound()

	return {
		title: event.name,
		description: `${event.name} at ${event.venue?.name}`,
		openGraph: {
			images: event.flyer?.asset?.url ? [event.flyer.asset.url] : [],
		},
	}
}

export async function generateStaticParams() {
	const slugs = await client.fetch<string[]>(
		groq`*[_type == 'event' && defined(slug.current)].slug.current`,
	)
	return slugs.map((slug) => ({ slug }))
}

type Props = {
	params: { slug?: string }
}