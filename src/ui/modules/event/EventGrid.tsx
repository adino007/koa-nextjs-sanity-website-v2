'use client'

import { useState, useEffect } from 'react'
import { getEvents } from '@/lib/sanity/queries'
import Image from 'next/image'
import { useRouter } from 'next/navigation'

const ITEMS_PER_PAGE = 9

export default function EventGrid() {
	const router = useRouter()
	const [events, setEvents] = useState<Sanity.Event[]>([])
	const [sortOrder, setSortOrder] = useState<'alphabetical' | 'date'>('date')
	const [filter, setFilter] = useState<'all' | 'upcoming' | 'past'>('all')
	const [currentPage, setCurrentPage] = useState(1)
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

	const filteredEvents = events.filter((event) => {
		const eventDate = new Date(event.date)
		const now = new Date()
		if (filter === 'upcoming') {
			return eventDate >= now
		} else if (filter === 'past') {
			return eventDate < now
		}
		return true
	})

	const sortedEvents = [...filteredEvents].sort((a, b) => {
		if (sortOrder === 'alphabetical') {
			return a.name.localeCompare(b.name)
		} else if (sortOrder === 'date') {
			return new Date(b.date).getTime() - new Date(a.date).getTime()
		}
		return 0
	})

	const totalPages = Math.max(
		Math.ceil(sortedEvents.length / ITEMS_PER_PAGE),
		1,
	)
	const paginatedEvents = sortedEvents.slice(
		(currentPage - 1) * ITEMS_PER_PAGE,
		currentPage * ITEMS_PER_PAGE,
	)

	if (loading) {
		return <div className="text-center text-white">Loading events...</div>
	}

	return (
		<div className="container mx-auto px-4">
			<div className="mb-4 flex justify-center sm:justify-end">
				<div className="flex flex-row space-x-2">
					<div className="flex items-center">
						<label htmlFor="sort" className="mr-1 font-medium text-white text-sm">Sort:</label>
						<select
							id="sort"
							value={sortOrder}
							onChange={(e) =>
								setSortOrder(e.target.value as 'alphabetical' | 'date')
							}
							className="rounded border p-1 text-sm uppercase text-black w-24"
						>
							<option value="date">Date</option>
							<option value="alphabetical">Name</option>
						</select>
					</div>
					<div className="flex items-center">
						<label htmlFor="filter" className="mr-1 font-medium text-white text-sm">Filter:</label>
						<select
							id="filter"
							value={filter}
							onChange={(e) =>
								setFilter(e.target.value as 'all' | 'upcoming' | 'past')
							}
							className="rounded border p-1 text-sm uppercase text-black w-24"
						>
							<option value="all">All</option>
							<option value="upcoming">Upcoming</option>
							<option value="past">Past</option>
						</select>
					</div>
				</div>
			</div>
			<div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3">
				{paginatedEvents.map((event) => (
					<div
						key={event._id}
						className="cursor-pointer overflow-hidden rounded-lg border shadow-md"
						onClick={() => {
							const slug = event?.metadata?.slug?.current
							router.push(slug ? `/events/${slug}` : '/404')
						}}
					>
						<div className="relative h-64 w-full">
							{event.flyer?.asset?.url ? (
								<Image
									src={event.flyer.asset.url}
									alt={event.name}
									fill
									style={{ objectFit: 'cover' }}
									sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
									className="transform transition-transform duration-300 hover:scale-105"
								/>
							) : (
								<div className="flex h-full w-full items-center justify-center bg-gray-300 text-gray-700">
									No Image Available
								</div>
							)}
						</div>
						<div className="bg-gray-800 p-4 text-center text-white">
							<h2 className="text-lg font-bold">{event.name}</h2>
							<p>{new Date(event.date).toLocaleDateString()}</p>
							<p>
								{event.time?.start && event.time?.end
									? `${new Date(event.time.start).toLocaleTimeString([], {
											hour: '2-digit',
											minute: '2-digit',
										})} - ${new Date(event.time.end).toLocaleTimeString([], {
											hour: '2-digit',
											minute: '2-digit',
										})}`
									: 'Time not specified'}
							</p>
							{event.venue && (
								<span className="text-blue-400">{event.venue.name}</span>
							)}
						</div>
					</div>
				))}
			</div>

			<div className="mt-8 flex items-center justify-between">
				<button
					onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
					disabled={currentPage === 1}
					className="rounded bg-gray-800 px-4 py-2 text-white disabled:opacity-50"
				>
					Previous
				</button>
				<p className="text-white">
					Page {currentPage} of {totalPages}
				</p>
				<button
					onClick={() =>
						setCurrentPage((prev) => Math.min(prev + 1, totalPages))
					}
					disabled={currentPage === totalPages}
					className="rounded bg-gray-800 px-4 py-2 text-white disabled:opacity-50"
				>
					Next
				</button>
			</div>
		</div>
	)
}

/*

interface Event {
	_id: string
	name: string
	date: string
	metadata: {
		title: string
		description: string
		ogimage?: string
		noIndex: boolean
		slug: {
			current: string
		}
	}
	time: {
		start: string
		end: string
	}
	venue: {
		_id: string
		name: string
		location: string
		metadata: {
			slug: {
				current: string
			}
		}
	}
	artists: {
		_id: string
		name: string
		metadata: {
			slug: {
				current: string
			}
		}
		photo: {
			asset: {
				url: string
			}
		}
	}[]
	flyer: {
		asset: {
			url: string
		}
	}
}
	*/
