'use client'

import { forwardRef } from 'react'
import { getEvents } from '@/lib/sanity/queries'
import { useEffect, useState } from 'react'
import {
	Carousel,
	CarouselContent,
	CarouselItem,
	CarouselNext,
	CarouselPrevious,
} from '@/components/ui/carousel'
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
							new Date(b.time.start).getTime() - new Date(a.time.start).getTime(),
					)
				setEvents(filteredEvents)
			}
			fetchEvents()
		}, [currentEventId])

		if (!events.length) return null

		return (
			<div
				ref={ref}
				className="relative mx-auto w-full max-w-[100vw] overflow-visible px-2 pb-8 pt-8 md:max-w-5xl lg:pt-1"
			>
				<Carousel className="relative w-full overflow-visible">
					<CarouselContent className="overflow-visible">
						{events.map((event) => (
							<CarouselItem key={event._id} className="w-full snap-center">
								<EventCard event={event} />
							</CarouselItem>
						))}
					</CarouselContent>

					<div className="absolute -left-16 top-1/2 z-10 -ml-4 -translate-y-1/2 max-md:relative max-md:top-auto max-md:mt-[10%] max-md:flex max-md:-translate-y-0 max-md:justify-center lg:-left-6">
						<CarouselPrevious />
					</div>
					<div className="absolute -right-16 top-1/2 z-10 -translate-y-1/2 max-md:relative max-md:top-auto max-md:mt-[10%] max-md:flex max-md:-translate-y-0 max-md:justify-center lg:-right-4">
						<CarouselNext />
					</div>
				</Carousel>
			</div>
		)
	},
)

RelatedEvents.displayName = 'RelatedEvents'

export default RelatedEvents
