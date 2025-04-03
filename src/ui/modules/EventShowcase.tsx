'use client'

import { PortableText } from '@portabletext/react'
import { cn } from '@/lib/utils'
import { getEvents } from '@/lib/sanity/queries'
import { useEffect, useState } from 'react'
import { CarouselItem } from '@/components/ui/carousel'
import StandardCarousel from '@/ui/components/StandardCarousel'
import EventCard from './event/EventCard'

interface EventShowcaseProps {
	title?: string
	description?: any
	maxEvents?: number
	displayStyle?: 'desert-neon' | 'classic-dark' | 'minimal-light'
	showVenue?: boolean
	showDate?: boolean
	textAlign?: 'left' | 'center' | 'right'
}

export default function EventShowcase({
	title,
	description,
	maxEvents = 3,
	displayStyle = 'desert-neon',
	showVenue = true,
	showDate = true,
	textAlign = 'center',
}: EventShowcaseProps) {
	const [events, setEvents] = useState<Sanity.Event[]>([])

	useEffect(() => {
		const fetchEvents = async () => {
			const allEvents = await getEvents()
			const sortedEvents = allEvents
				.sort(
					(a: Sanity.Event, b: Sanity.Event) =>
						new Date(b.time.start).getTime() - new Date(a.time.start).getTime(),
				)
				.slice(0, maxEvents)
			setEvents(sortedEvents)
		}
		fetchEvents()
	}, [maxEvents])

	if (!events?.length) return null

	return (
		<section
			className={cn(
				'section py-16',
				displayStyle === 'desert-neon' && 'bg-purple-900 text-white',
				`text-${textAlign}`,
			)}
		>
			<div className="container mx-auto">
				{title && (
					<div className="mb-6 flex w-full justify-center">
						<h2
							className={cn(
								'w-full text-center font-moncheri text-4xl',
								displayStyle === 'desert-neon' && 'text-pink-400',
							)}
						>
							{title}
						</h2>
					</div>
				)}

				{description && (
					<div className="richtext mb-8">
						<PortableText value={description} />
					</div>
				)}

				<StandardCarousel>
					{events.map((event) => (
						<CarouselItem key={event._id} className="w-full">
							<div className="mx-auto max-w-5xl p-4">
								<div className="mx-auto">
									<EventCard event={event} />
								</div>
							</div>
						</CarouselItem>
					))}
				</StandardCarousel>
			</div>
		</section>
	)
}
