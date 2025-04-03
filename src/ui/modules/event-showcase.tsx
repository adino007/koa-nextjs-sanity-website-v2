'use client'

import { PortableText } from '@portabletext/react'
import { cn } from '@/lib/utils'
import { getEvents } from '@/lib/sanity/queries'
import { useEffect, useState } from 'react'
import { CarouselItem } from '@/components/ui/carousel'
import StandardCarousel from '@/ui/components/StandardCarousel'
import EventCard from '@/ui/modules/event/EventCard'

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
			const sortedEvents = allEvents.sort(
				(a: Sanity.Event, b: Sanity.Event) =>
					new Date(b.time.start).getTime() - new Date(a.time.start).getTime(),
			)
			setEvents(sortedEvents)
		}
		fetchEvents()
	}, [])

	if (!events?.length) return null

	return (
		<section
			className={cn(
				'section py-16',
				displayStyle === 'desert-neon' && 'bg-purple-900 text-white',
			)}
		>
			<div className="container mx-auto">
				{title && (
					<div className="mb-6" style={{ textAlign: 'center' }}>
						<h2
							className={cn(
								'font-moncheri text-4xl',
								displayStyle === 'desert-neon' && 'text-pink-400',
							)}
							style={{ textAlign: 'center' }}
						>
							{title}
						</h2>
					</div>
				)}

				{description && (
					<div className="richtext mb-8 text-center">
						<PortableText value={description} />
					</div>
				)}

				<div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
					{events.map((event) => (
						<div key={event._id} className="h-full">
							<div className="flex h-full flex-col">
								<div className="flex-grow">
									<EventCard event={event} />
								</div>
							</div>
						</div>
					))}
				</div>
			</div>
		</section>
	)
}
