import client from '@/lib/sanity/client'
import { fetchSanity, groq } from '@/lib/sanity/fetch'
import { modulesQuery } from '@/lib/sanity/queries'
import { notFound } from 'next/navigation'
import Modules from '@/ui/modules'
import EventContent from '@/ui/modules/event/EventContent'

export default async function Page({ params }: Props) {
	const page = await getPageTemplate()
	const event = await getEvent(params)
	if (!page || !event) notFound()

	return (
		<>
			<EventContent event={event} />
			<Modules modules={page?.modules} page={page} />
		</>
	)
}

export async function generateMetadata({ params }: Props) {
	const event = await getEvent(params)
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

async function getEvent(params: Props['params']) {
	return await fetchSanity<Sanity.Event>(
		groq`*[_type == 'event' && metadata.slug.current == $slug][0]{
			_type,
			name,
			date,
			time,
			metadata {
				title,
				description,
				ogimage,
				noIndex,
				slug {
					current
				}
			},
			venue->{
				_id,
				name,
				location,
				metadata {
					slug {
						current
					}
				}
			},
			artists[]->{
				_id,
				name,
				metadata {
					slug {
						current
					}
				},
				photo{
					asset->{
						url
					}
				}

			},
			flyer{
				asset->{
					url
				}
			},
			gallery[]{
				_type,
				asset->
			},
			links
		}`,
		{
			params,
			tags: ['event'],
		},
	)
}

async function getPageTemplate() {
	return await fetchSanity<Sanity.Page>(
		groq`*[_type == 'page' && metadata.slug.current == 'events/*'][0]{
			...,
			modules[]{ ${modulesQuery} },
			metadata { slug }
		}`,
		{ tags: ['events/*'] },
	)
}

type Props = {
	params: { slug?: string }
}
