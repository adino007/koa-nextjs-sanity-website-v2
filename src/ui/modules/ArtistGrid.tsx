'use client'

import { useState, useEffect } from 'react'
import { getArtists } from '@/lib/sanity/queries'
import Image from 'next/image'

interface Artist {
	name: string
	photo: { asset: { url: string } }
	bio: string
	socialLinks: {
		platform: string
		url: string
	}[]
	upcomingEvents: {
		_id: string
		name: string
		date: string
		venue: { name: string }
	}[]
	pastEvents: {
		_id: string
		name: string
		date: string
		venue: { name: string }
	}[]
	gallery: string[]
}

const ITEMS_PER_PAGE = 9

export default function ArtistGrid() {
	const [artists, setArtists] = useState<Artist[]>([])
	const [sortOrder, setSortOrder] = useState<
		'alphabetical' | 'upcoming' | 'past'
	>('alphabetical')
	const [currentPage, setCurrentPage] = useState(1)
	const [loading, setLoading] = useState(true)
	const [selectedArtist, setSelectedArtist] = useState<Artist | null>(null)
	const [isModalOpen, setIsModalOpen] = useState(false)

	useEffect(() => {
		async function fetchArtists() {
			try {
				const data = await getArtists()
				setArtists(data)
			} catch (error) {
				console.error('Error fetching artists:', error)
			} finally {
				setLoading(false)
			}
		}
		fetchArtists()
	}, [])

	const sortedArtists = [...artists]
		.filter((artist) => {
			if (sortOrder === 'upcoming') {
				return artist.upcomingEvents && artist.upcomingEvents.length > 0
			} else if (sortOrder === 'past') {
				return artist.pastEvents && artist.pastEvents.length > 0
			}
			return true
		})
		.sort((a, b) => {
			if (sortOrder === 'alphabetical') {
				return a.name.localeCompare(b.name)
			} else if (sortOrder === 'upcoming') {
				const aEvent = a.upcomingEvents[0]?.date || ''
				const bEvent = b.upcomingEvents[0]?.date || ''
				return new Date(aEvent).getTime() - new Date(bEvent).getTime()
			} else if (sortOrder === 'past') {
				const aEvent = a.pastEvents[a.pastEvents.length - 1]?.date || ''
				const bEvent = b.pastEvents[b.pastEvents.length - 1]?.date || ''
				return new Date(bEvent).getTime() - new Date(aEvent).getTime()
			}
			return 0
		})

	const totalPages = Math.ceil(sortedArtists.length / ITEMS_PER_PAGE)
	const paginatedArtists = sortedArtists.slice(
		(currentPage - 1) * ITEMS_PER_PAGE,
		currentPage * ITEMS_PER_PAGE,
	)

	const handleNextPage = () =>
		setCurrentPage((prev) => Math.min(prev + 1, totalPages))
	const handlePreviousPage = () =>
		setCurrentPage((prev) => Math.max(prev - 1, 1))

	const openModal = (artist: Artist) => {
		setSelectedArtist(artist)
		setIsModalOpen(true)
	}

	const closeModal = () => {
		setSelectedArtist(null)
		setIsModalOpen(false)
	}

	if (loading) return <div className="text-center">Loading artists...</div>

	return (
		<div className="container mx-auto px-4">
			{/* Sorting Controls */}
			<div className="mb-4 flex items-center justify-between">
				<div className="flex space-x-4">
					<div>
						<label htmlFor="sort">Sort By:</label>
						<select
							id="sort"
							value={sortOrder}
							onChange={(e) =>
								setSortOrder(
									e.target.value as 'alphabetical' | 'upcoming' | 'past',
								)
							}
							className="rounded border p-2 uppercase text-black"
						>
							<option value="alphabetical">Alphabetical</option>
							<option value="upcoming">Upcoming Events</option>
							<option value="past">Past Events</option>
						</select>
					</div>
				</div>
			</div>

			{/* Artist Grid */}
			<div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3">
				{paginatedArtists.map((artist) => (
					<div
						key={artist.name}
						className="cursor-pointer overflow-hidden rounded-lg border shadow-md"
						onClick={() => openModal(artist)}
					>
						<div className="relative h-64 w-full">
							<Image
								src={artist.photo?.asset?.url || '/placeholder-image.jpg'}
								alt={artist.name}
								fill
								style={{ objectFit: 'cover' }}
								className="transform transition-transform duration-300 hover:scale-105"
							/>
						</div>
						<div className="bg-gray-800 p-4 text-center text-white">
							<h2 className="text-lg font-bold">{artist.name}</h2>
						</div>
					</div>
				))}
			</div>

			{/* Pagination */}
			<div className="mt-8 flex items-center justify-between">
				<button
					onClick={handlePreviousPage}
					disabled={currentPage === 1}
					className="bg-gray-800 px-4 py-2 text-white disabled:opacity-50"
				>
					Previous
				</button>
				<p>
					Page {currentPage} of {totalPages}
				</p>
				<button
					onClick={handleNextPage}
					disabled={currentPage === totalPages}
					className="bg-gray-800 px-4 py-2 text-white disabled:opacity-50"
				>
					Next
				</button>
			</div>

			{/* Modal */}
			{isModalOpen && selectedArtist && (
				<div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75">
					<div className="relative h-5/6 max-h-screen w-5/6 max-w-3xl overflow-y-auto rounded-lg bg-white p-6 text-black md:p-8">
						<button
							className="absolute right-4 top-4 text-gray-600 hover:text-gray-800"
							onClick={closeModal}
						>
							&times;
						</button>
						<div className="flex h-full flex-col items-center">
							<div className="md:w-1/2">
								<Image
									src={
										selectedArtist.photo?.asset?.url || '/placeholder-image.jpg'
									}
									alt={selectedArtist.name}
									width={500}
									height={500}
									style={{ objectFit: 'cover' }}
									className="rounded-lg"
								/>
							</div>
							<div className="mt-6 md:mt-0 md:w-1/2 md:pl-6">
								<h2 className="mb-4 text-3xl font-bold">
									{selectedArtist.name}
								</h2>
								<p className="mb-4">{selectedArtist.bio}</p>
								{selectedArtist.socialLinks &&
									selectedArtist.socialLinks.length > 0 && (
										<div className="mb-4">
											<h3 className="text-xl font-semibold">Social Links</h3>
											<ul className="list-disc pl-5">
												{selectedArtist.socialLinks.map((link, index) => (
													<li key={index}>
														<a
															href={link.url}
															target="_blank"
															rel="noopener noreferrer"
															className="text-blue-500"
														>
															{link.platform}
														</a>
													</li>
												))}
											</ul>
										</div>
									)}
								{/* Upcoming Events Section */}
								{selectedArtist.upcomingEvents &&
								selectedArtist.upcomingEvents.length > 0 ? (
									<div className="mb-4">
										<h3 className="text-xl font-semibold">Upcoming Events</h3>
										<ul className="list-disc pl-5">
											{selectedArtist.upcomingEvents.map((event) => (
												<li key={event._id}>
													{event.name} at {event.venue.name} on{' '}
													{new Date(event.date).toLocaleDateString()}
												</li>
											))}
										</ul>
									</div>
								) : (
									<p className="text-gray-600">No upcoming events</p>
								)}
								{/* Past Events Section */}
								{selectedArtist.pastEvents &&
								selectedArtist.pastEvents.length > 0 ? (
									<div className="mb-4">
										<h3 className="text-xl font-semibold">Past Events</h3>
										<ul className="list-disc pl-5">
											{selectedArtist.pastEvents.map((event) => (
												<li key={event._id}>
													{event.name} at {event.venue.name} on{' '}
													{new Date(event.date).toLocaleDateString()}
												</li>
											))}
										</ul>
									</div>
								) : (
									<p className="text-gray-600">No past events</p>
								)}
								{/* Gallery Section */}
								{selectedArtist.gallery &&
									selectedArtist.gallery.length > 0 && (
										<div className="mb-4">
											<h3 className="text-xl font-semibold">Gallery</h3>
											<div className="grid grid-cols-2 gap-2">
												{selectedArtist.gallery.map((imageUrl, index) => (
													<Image
														key={index}
														src={imageUrl}
														alt={`Gallery Image ${index + 1}`}
														width={200}
														height={200}
														style={{ objectFit: 'cover' }}
														className="rounded-lg"
													/>
												))}
											</div>
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
