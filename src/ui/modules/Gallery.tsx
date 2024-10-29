'use client'

import { useState, useEffect } from 'react'
import { getGallery } from '@/lib/sanity/queries'
import Image from 'next/image'
import MuxPlayer from '@mux/mux-player-react'
import Lightbox from 'react-spring-lightbox'

interface Event {
	_id: string
	name: string
	date: string
	gallery: {
		_type: string // "photo" or "video"
		asset: {
			url: string
			muxPlaybackId?: string
		}
	}[]
}

const ITEMS_PER_PAGE = 9

export default function Gallery() {
	const [events, setEvents] = useState<Event[]>([])
	const [currentPage, setCurrentPage] = useState(1)
	const [loading, setLoading] = useState(true)
	const [selectedEvent, setSelectedEvent] = useState<Event | null>(null)
	const [isModalOpen, setIsModalOpen] = useState(false)
	const [lightboxIndex, setLightboxIndex] = useState<number | null>(null)
	const [viewType, setViewType] = useState<'photos' | 'videos'>('photos')

	useEffect(() => {
		async function fetchGalleryEvents() {
			try {
				const data = await getGallery()
				console.log(data) // Check the structure of fetched gallery data
				setEvents(data)
			} catch (error) {
				console.error('Error fetching gallery events:', error)
			} finally {
				setLoading(false)
			}
		}
		fetchGalleryEvents()
	}, [])

	// Sort events by date (latest first)
	const sortedEvents = [...events].sort(
		(a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
	)

	// Pagination logic
	const totalPages = Math.max(
		Math.ceil(sortedEvents.length / ITEMS_PER_PAGE),
		1,
	)
	const paginatedEvents = sortedEvents.slice(
		(currentPage - 1) * ITEMS_PER_PAGE,
		currentPage * ITEMS_PER_PAGE,
	)

	const handleNextPage = () =>
		setCurrentPage((prev) => Math.min(prev + 1, totalPages))
	const handlePreviousPage = () =>
		setCurrentPage((prev) => Math.max(prev - 1, 1))

	const openModal = (event: Event) => {
		setSelectedEvent(event)
		setIsModalOpen(true)
		setLightboxIndex(null) // Reset the lightbox index to start fresh
	}

	const closeModal = () => {
		setSelectedEvent(null)
		setIsModalOpen(false)
		setLightboxIndex(null)
	}

	if (loading) {
		return <div className="text-center text-white">Loading gallery...</div>
	}

	return (
		<div className="container mx-auto px-4">
			{/* Event Grid */}
			<div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3">
				{paginatedEvents.map((event) => {
					// Find the first photo from the gallery
					const firstPhoto = event.gallery.find(
						(item) => item._type === 'photo',
					)

					return (
						<div
							key={event._id}
							className="cursor-pointer overflow-hidden rounded-lg border shadow-md"
							onClick={() => openModal(event)}
						>
							<div className="relative h-64 w-full">
								{firstPhoto?.asset.url ? (
									<Image
										src={firstPhoto.asset.url}
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
							</div>
						</div>
					)
				})}
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
					<div className="relative h-5/6 max-h-screen w-5/6 max-w-3xl overflow-y-auto rounded-lg bg-white p-6 text-black md:p-8">
						<button
							className="absolute right-4 top-4 text-gray-600 hover:text-gray-800"
							onClick={closeModal}
						>
							&times;
						</button>
						<div className="flex flex-col items-center">
							{/* Toggle between Photos and Videos */}
							<div className="mb-4">
								<button
									onClick={() => setViewType('photos')}
									className={`px-4 py-2 text-white ${
										viewType === 'photos' ? 'bg-blue-500' : 'bg-gray-500'
									}`}
								>
									Photos
								</button>
								<button
									onClick={() => setViewType('videos')}
									className={`ml-4 px-4 py-2 text-white ${
										viewType === 'videos' ? 'bg-blue-500' : 'bg-gray-500'
									}`}
								>
									Videos
								</button>
							</div>

							{/* Lightbox Display */}
							<div className="w-full">
								{viewType === 'photos' ? (
									<div className="grid grid-cols-2 gap-2">
										{selectedEvent.gallery
											.filter((item) => item._type === 'photo')
											.map((photo, index) => (
												<Image
													key={index}
													src={photo.asset.url}
													alt={`Photo ${index + 1}`}
													width={200}
													height={200}
													style={{ objectFit: 'cover' }}
													className="rounded-lg"
													onClick={() => setLightboxIndex(index)}
												/>
											))}
									</div>
								) : (
									selectedEvent.gallery
										.filter((item) => item._type === 'video')
										.map((video, index) => (
											<div key={index} className="mb-4">
												<MuxPlayer
													playbackId={video.asset.muxPlaybackId}
													streamType="on-demand"
													metadata={{ videoTitle: selectedEvent.name }}
													className="w-full rounded-lg"
												/>
											</div>
										))
								)}
							</div>

							{/* Lightbox View */}
							{lightboxIndex !== null && viewType === 'photos' && (
								<Lightbox
									isOpen={lightboxIndex !== null}
									onClose={() => setLightboxIndex(null)}
									images={selectedEvent.gallery
										.filter((item) => item._type === 'photo')
										.map((photo) => ({ src: photo.asset.url, alt: `Photo` }))}
									currentIndex={lightboxIndex}
									onNext={() =>
										setLightboxIndex((prevIndex) =>
											prevIndex !== null
												? (prevIndex + 1) % selectedEvent.gallery.length
												: 0,
										)
									}
									onPrev={() =>
										setLightboxIndex((prevIndex) =>
											prevIndex !== null
												? (prevIndex + selectedEvent.gallery.length - 1) %
													selectedEvent.gallery.length
												: 0,
										)
									}
								/>
							)}
						</div>
					</div>
				</div>
			)}
		</div>
	)
}
