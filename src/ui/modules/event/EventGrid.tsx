'use client'

import { useState, useEffect } from 'react'
import { getEvents } from '@/lib/sanity/queries'
import { useRouter } from 'next/navigation'
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select'
import EventCard from '@/ui/modules/event/EventCard'

export default function EventGrid() {
	const router = useRouter()
	const [events, setEvents] = useState<Sanity.Event[]>([])
	const [filter, setFilter] = useState<'all' | 'upcoming' | 'past'>('all')
	const [loading, setLoading] = useState(true)

	useEffect(() => {
		async function fetchEvents() {
			try {
				const data = await getEvents()
				setEvents(data)
			} catch (error) {
				console.error('Error fetching events:', error)
			} finally {
				setLoading(false)
			}
		}
		fetchEvents()
	}, [])

	const filteredEvents = events
		.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
		.filter((event) => {
			const eventDate = new Date(event.date)
			const now = new Date()
			if (filter === 'upcoming') {
				return eventDate >= now
			} else if (filter === 'past') {
				return eventDate < now
			}
			return true
		})

	if (loading) {
		return (
			<div className="py-24 text-center text-xl text-white">
				<div className="inline-flex">
					Loading events
					<span className="ml-1">
						<span className="animate-pulse">.</span>
						<span className="animate-pulse delay-300">.</span>
						<span className="delay-600 animate-pulse">.</span>
					</span>
				</div>
			</div>
		)
	}

	return (
		<div className="container mx-auto px-4 pb-12">
			<div className="mb-4 flex justify-center pt-2 sm:justify-end">
				<Select
					onValueChange={(value) =>
						setFilter(value as 'all' | 'upcoming' | 'past')
					}
				>
					<SelectTrigger className="w-42 frosted-glass-dark px-2 uppercase leading-normal max-md:header-open:z-0 lg:mr-4">
						<SelectValue placeholder="Filter Events" />
					</SelectTrigger>
					<SelectContent>
						<SelectItem className="frosted-glass-dark z-10 py-1" value="all">
							All Events
						</SelectItem>
						<SelectItem
							className="frosted-glass-dark z-10 py-1"
							value="upcoming"
						>
							Upcoming
						</SelectItem>
						<SelectItem className="frosted-glass-dark z-10 py-1" value="past">
							Past
						</SelectItem>
					</SelectContent>
				</Select>
			</div>

			{/* Event List */}
			<div className="space-y-6">
				{filteredEvents.map((event) => (
					<EventCard key={event._id} event={event} />
				))}
			</div>
		</div>
	)
}