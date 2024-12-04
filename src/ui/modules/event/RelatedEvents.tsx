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
							new Date(b.date).getTime() - new Date(a.date).getTime(),
					)
				setEvents(filteredEvents)
			}
			fetchEvents()
		}, [currentEventId])

		if (!events.length) return null

		return (
			<div ref={ref} className="mx-auto w-full max-w-[100vw] pt-6 md:max-w-4xl">
				<div className="relative w-full">
					<h2 className="mb-4 text-center text-2xl font-semibold">
						More Events
					</h2>
					<Carousel className="relative w-full">
						<CarouselContent className="px-2">
							{events.map((event) => (
								<CarouselItem key={event._id} className="w-full">
									<div className="pr-4">
										<EventCard event={event} />
									</div>
								</CarouselItem>
							))}
						</CarouselContent>
						<div className="absolute -left-2 top-1/2 z-10 -translate-y-1/2">
							<CarouselPrevious />
						</div>
						<div className="absolute right-4 top-1/2 z-10 -translate-y-1/2">
							<CarouselNext />
						</div>
					</Carousel>
				</div>
			</div>
		)
	},
)

RelatedEvents.displayName = 'RelatedEvents'

export default RelatedEvents
