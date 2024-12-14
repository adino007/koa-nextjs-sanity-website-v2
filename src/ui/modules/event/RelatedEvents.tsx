'use client'

import { forwardRef } from 'react'
import { getEvents } from '@/lib/sanity/queries'
import { useEffect, useState } from 'react'
import { CarouselItem } from '@/components/ui/carousel'
import StandardCarousel from '@/ui/components/StandardCarousel'
import EventCard from './EventCard'

const RelatedEvents = forwardRef<HTMLDivElement, { currentEventId: string }>(
	({ currentEventId }, ref) => {
		const [events, setEvents] = useState<Sanity.Event[]>([])

		useEffect(() => {
			const fetchEvents = async () => {
				const allEvents = await getEvents()
				const filteredEvents = allEvents
					.filter((event: Sanity.Event) => event._id !== currentEventId)
					.sort(
						(a: Sanity.Event, b: Sanity.Event) =>
							new Date(b.time.start).getTime() -
							new Date(a.time.start).getTime(),
					)
				setEvents(filteredEvents)
			}
			fetchEvents()
		}, [currentEventId])

		if (!events.length) return null
		return (
			<div ref={ref} className="container mx-auto">
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
		)
	},
)

RelatedEvents.displayName = 'RelatedEvents'

export default RelatedEvents
