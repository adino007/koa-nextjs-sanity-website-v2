'use client'

import { useState, useEffect } from 'react'
import { getEvents } from '@/lib/sanity/queries'
import Image from 'next/image'

interface Event {
	_id: string
	name: string
	date: string
	time: {
		start: string
		end: string
	}
	venue: {
		_id: string
		name: string
		location: string
		description: string
	}
	artists: {
		_id: string
		name: string
		photo: {
			asset: {
				url: string
			}
		}
		bio: string
	}[]
	flyer: {
		asset: {
			url: string
		}
	}
	gallery: {
		asset: {
			url: string
		}
	}[]
	links: string[]
}

const ITEMS_PER_PAGE = 9
const FALLBACK_IMAGE = '/placeholder-image.jpg'

export default function EventGrid() {
	const [events, setEvents] = useState<Event[]>([])
	const [sortOrder, setSortOrder] = useState<'alphabetical' | 'date'>('date')
	const [filter, setFilter] = useState<'all' | 'upcoming' | 'past'>('all')
	const [currentPage, setCurrentPage] = useState(1)
	const [loading, setLoading] = useState(true)
	const [selectedEvent, setSelectedEvent] = useState<Event | null>(null)
	const [isModalOpen, setIsModalOpen] = useState(false)

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

	// Filter events based on date
	const filteredEvents = events.filter((event) => {
		const eventDate = new Date(event.date)
		const now = new Date()
		if (filter === 'upcoming') {
			return eventDate >= now
		} else if (filter === 'past') {
			return eventDate < now
		}
		return true // 'all' case
	})

	// Sort events
	const sortedEvents = [...filteredEvents].sort((a, b) => {
		if (sortOrder === 'alphabetical') {
			return a.name.localeCompare(b.name)
		} else if (sortOrder === 'date') {
			return new Date(a.date).getTime() - new Date(b.date).getTime()
		}
		return 0
	})

	// Pagination
	const totalPages = Math.max(
		Math.ceil(sortedEvents.length / ITEMS_PER_PAGE),
		1,
	)
	const paginatedEvents = sortedEvents.slice(
		(currentPage - 1) * ITEMS_PER_PAGE,
		currentPage * ITEMS_PER_PAGE,
	)

	// Pagination handlers
	const handleNextPage = () =>
		setCurrentPage((prev) => Math.min(prev + 1, totalPages))
	const handlePreviousPage = () =>
		setCurrentPage((prev) => Math.max(prev - 1, 1))

	const openModal = (event: Event) => {
		setSelectedEvent(event)
		setIsModalOpen(true)
	}

	const closeModal = () => {
		setSelectedEvent(null)
		setIsModalOpen(false)
	}

	if (loading) {
		return <div className="text-center text-white">Loading events...</div>
	}

	return (
		<div className="container mx-auto px-4">
			{/* Sorting and Filtering Controls */}
			<div className="mb-4 flex items-center justify-between">
				<div className="flex space-x-4">
					{/* Sort By */}
					<div>
						<label htmlFor="sort" className="mr-2 font-medium text-white">
							Sort By:
						</label>
						<select
							id="sort"
							value={sortOrder}
							onChange={(e) =>
								setSortOrder(e.target.value as 'alphabetical' | 'date')
							}
							className="rounded border p-2 uppercase text-black"
						>
							<option value="date">Event Date</option>
							<option value="alphabetical">Alphabetical</option>
						</select>
					</div>
					{/* Filter By Event Type */}
					<div>
						<label htmlFor="filter" className="mr-2 font-medium text-white">
							Filter By:
						</label>
						<select
							id="filter"
							value={filter}
							onChange={(e) =>
								setFilter(e.target.value as 'all' | 'upcoming' | 'past')
							}
							className="rounded border p-2 uppercase text-black"
						>
							<option value="all">All Events</option>
							<option value="upcoming">Upcoming Events</option>
							<option value="past">Past Events</option>
						</select>
					</div>
				</div>
			</div>

			{/* Event Grid */}
			<div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3">
				{paginatedEvents.map((event) => (
					<div
						key={event._id}
						className="cursor-pointer overflow-hidden rounded-lg border shadow-md"
						onClick={() => openModal(event)}
					>
						<div className="relative h-64 w-full">
							<Image
								src={event.flyer?.asset?.url || FALLBACK_IMAGE}
								alt={event.name}
								layout="fill"
								objectFit="cover"
								className="transform transition-transform duration-300 hover:scale-105"
							/>
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
							{event.venue ? (
								<span className="text-blue-400">{event.venue.name}</span>
							) : (
								'Venue not specified'
							)}
							<div className="mt-2 flex justify-center space-x-2">
								{event.artists?.map((artist) => (
									<span key={artist._id} className="text-sm text-blue-400">
										{artist.name}
									</span>
								))}
							</div>
						</div>
					</div>
				))}
			</div>

			{/* Pagination Controls */}
			<div className="mt-8 flex items-center justify-between">
				<button
					onClick={handlePreviousPage}
					disabled={currentPage === 1}
					className="rounded bg-gray-800 px-4 py-2 text-white disabled:opacity-50"
				>
					Previous
				</button>
				<p className="text-white">
					Page {currentPage} of {totalPages}
				</p>
				<button
					onClick={handleNextPage}
					disabled={currentPage === totalPages}
					className="rounded bg-gray-800 px-4 py-2 text-white disabled:opacity-50"
				>
					Next
				</button>
			</div>

			{/* Modal */}
			{isModalOpen && selectedEvent && (
				<div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75">
					<div className="relative mx-4 my-8 max-h-screen w-full max-w-screen-lg overflow-y-auto rounded-lg bg-white p-6 md:p-8">
						<button
							className="absolute right-4 top-4 text-gray-600 hover:text-gray-800"
							onClick={closeModal}
						>
							&times;
						</button>
						<div className="flex flex-col md:flex-row">
							<div className="md:w-1/2">
								<Image
									src={selectedEvent.flyer?.asset?.url || FALLBACK_IMAGE}
									alt={selectedEvent.name}
									width={500}
									height={300}
									objectFit="cover"
									className="rounded-lg"
								/>
								{selectedEvent.gallery && selectedEvent.gallery.length > 0 && (
									<div className="mt-4">
										<h3 className="text-xl font-semibold">Gallery</h3>
										<div className="grid grid-cols-2 gap-2">
											{selectedEvent.gallery.map((image, index) => (
												<Image
													key={index}
													src={image.asset.url}
													alt={`Gallery Image ${index + 1}`}
													width={200}
													height={200}
													objectFit="cover"
													className="rounded-lg"
												/>
											))}
										</div>
									</div>
								)}
							</div>
							<div className="mt-6 md:mt-0 md:w-1/2 md:pl-6">
								<h2 className="mb-4 text-3xl font-bold">
									{selectedEvent.name}
								</h2>
								<p className="mb-2">
									Date: {new Date(selectedEvent.date).toLocaleDateString()}
								</p>
								<p className="mb-2">
									Time:{' '}
									{selectedEvent.time?.start && selectedEvent.time?.end
										? `${new Date(selectedEvent.time.start).toLocaleTimeString(
												[],
												{
													hour: '2-digit',
													minute: '2-digit',
												},
											)} - ${new Date(
												selectedEvent.time.end,
											).toLocaleTimeString([], {
												hour: '2-digit',
												minute: '2-digit',
											})}`
										: 'Time not specified'}
								</p>
								{selectedEvent.venue && (
									<div className="mb-4">
										<h3 className="text-xl font-semibold">Venue</h3>
										<p>{selectedEvent.venue.name}</p>
										<p>{selectedEvent.venue.location}</p>
										<p>{selectedEvent.venue.description}</p>
									</div>
								)}
								{selectedEvent.artists && selectedEvent.artists.length > 0 && (
									<div className="mb-4">
										<h3 className="text-xl font-semibold">Artists</h3>
										<ul className="list-disc pl-5">
											{selectedEvent.artists.map((artist) => (
												<li key={artist._id}>
													<span
														className="cursor-pointer text-blue-500"
														onClick={() => {
															// Optionally, handle artist click to show artist info
														}}
													>
														{artist.name}
													</span>
												</li>
											))}
										</ul>
									</div>
								)}
								{selectedEvent.links && selectedEvent.links.length > 0 && (
									<div className="mb-4">
										<h3 className="text-xl font-semibold">Links</h3>
										<ul className="list-disc pl-5">
											{selectedEvent.links.map((link, index) => (
												<li key={index}>
													<a
														href={link}
														target="_blank"
														rel="noopener noreferrer"
														className="text-blue-500"
													>
														{link}
													</a>
												</li>
											))}
										</ul>
									</div>
								)}
								<button
									className="mt-4 rounded bg-gray-800 px-4 py-2 text-white"
									onClick={closeModal}
								>
									Close
								</button>
							</div>
						</div>
					</div>
				</div>
			)}
		</div>
	)
}
