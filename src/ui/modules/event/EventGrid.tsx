'use client'

import { useState, useEffect } from 'react'
import { getEvents } from '@/lib/sanity/queries'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { FaCalendar, FaClock } from 'react-icons/fa'
import { IoLocation } from 'react-icons/io5'
import CTAList from '@/ui/CTAList'
const ITEMS_PER_PAGE = 9

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
		return <div className="text-center text-white">Loading events...</div>
	}

	return (
		<div className="container mx-auto px-4 pb-12">
			<div className="mb-4 flex justify-center pt-2 sm:justify-end">
				<div className="flex items-center">
					<label
						htmlFor="filter"
						className="mr-1 text-sm font-medium text-white"
					>
						Filter:
					</label>
					<select
						id="filter"
						value={filter}
						onChange={(e) =>
							setFilter(e.target.value as 'all' | 'upcoming' | 'past')
						}
						className="w-42 rounded border p-1 text-sm uppercase text-black"
					>
						<option className="py-1" value="all">
							All Events
						</option>
						<option className="py-1" value="upcoming">
							Upcoming
						</option>
						<option className="py-1" value="past">
							Past
						</option>
					</select>
				</div>
			</div>

			{/* Event List */}
			<div className="space-y-6">
				{filteredEvents.map((event) => (
					<div
						key={event._id}
						className="relative cursor-pointer overflow-hidden rounded-lg"
						onClick={() => {
							const slug = event?.metadata?.slug?.current
							router.push(slug ? `/event/${slug}` : '/404')
						}}
					>
						{/* Background Image with Blur */}
						{event.flyer?.asset?.url && (
							<div className="absolute inset-0">
								<Image
									src={event.flyer.asset.url}
									alt=""
									fill
									className="object-cover"
								/>
								<div className="absolute inset-0 bg-black/50 backdrop-blur-lg" />
							</div>
						)}

						<div className="relative z-10 flex flex-col items-start gap-6 p-6 md:flex-row md:items-center">
							<div className="flex-grow">
								<h2 className="mb-2 text-2xl font-bold">{event.name}</h2>
								<div className="space-y-2">
									<div className="flex items-center gap-2">
										<FaCalendar className="text-gray-400" />
										<span>
											{new Date(event.date).toLocaleDateString('en-US', {
												weekday: 'long',
												year: 'numeric',
												month: 'long',
												day: 'numeric',
											})}
										</span>
									</div>
									{event.venue && (
										<div className="flex items-center gap-2">
											<IoLocation className="text-gray-400" />
											<span
												className="cursor-pointer hover:text-blue-400"
												onClick={(e) => {
													e.stopPropagation()
													window.open(
														`maps://maps.google.com/?q=${event.venue.location}`,
														'_blank',
													)
												}}
											>
												{event.venue.name}
											</span>
										</div>
									)}
									{event.time && (
										<div className="flex items-center gap-2">
											<FaClock className="text-gray-400" />
											<span>
												{new Date(event.time.start).toLocaleTimeString([], {
													hour: '2-digit',
													minute: '2-digit',
												})}{' '}
												-
												{new Date(event.time.end).toLocaleTimeString([], {
													hour: '2-digit',
													minute: '2-digit',
												})}
											</span>
										</div>
									)}
								</div>
							</div>

							{/* Artists (Stacks on mobile) */}
							<div className="mt-4 flex w-full flex-wrap justify-start gap-4 md:mt-0 md:w-auto md:justify-end">
								{event.artists &&
									event.artists.map((artist) => (
										<div key={artist._id} className="w-16 text-center">
											{artist.photo?.asset?.url && (
												<div className="relative mx-auto mb-1 h-12 w-12">
													<Image
														src={artist.photo.asset.url}
														alt={artist.name}
														fill
														className="rounded-full object-cover"
													/>
												</div>
											)}
											<span className="text-xs">{artist.name}</span>
										</div>
									))}
							</div>
							{event.ticketlink && (
								<div
									onClick={(e) => e.stopPropagation()}
									className="w-full text-center md:w-32"
								>
									<CTAList
										ctas={[event.ticketlink]}
										className="!mt-4 md:!mt-0"
									/>
								</div>
							)}
						</div>
					</div>
				))}{' '}
			</div>
		</div>
	)
}
