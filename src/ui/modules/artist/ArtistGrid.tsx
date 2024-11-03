'use client'

import { useState, useEffect } from 'react'
import { getArtists } from '@/lib/sanity/queries'
import Image from 'next/image'
import { useRouter } from 'next/navigation'

const ITEMS_PER_PAGE = 9

export default function ArtistGrid() {
	const router = useRouter()
	const [artists, setArtists] = useState<Sanity.Artist[]>([])
	const [sortOrder, setSortOrder] = useState<
		'alphabetical' | 'upcoming' | 'past'
	>('alphabetical')
	const [currentPage, setCurrentPage] = useState(1)
	const [loading, setLoading] = useState(true)

	useEffect(() => {
		async function fetchArtists() {
			try {
				const data = await getArtists()
				console.log('Fetched Artists Data:', data)
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
			} else if (sortOrder === 'upcoming' && a.upcomingEvents && b.upcomingEvents) {
				const aEvent = a.upcomingEvents[0]?.date || ''
				const bEvent = b.upcomingEvents[0]?.date || ''
				return new Date(aEvent).getTime() - new Date(bEvent).getTime()
			} else if (sortOrder === 'past' && a.pastEvents && b.pastEvents) {
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
							<option value="alphabetical">Name</option>
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
						key={artist._id}
						className="cursor-pointer overflow-hidden rounded-lg border shadow-md"
						onClick={() => {
							const slug = artist?.metadata?.slug?.current
							console.log('Slug: ', slug)
							router.push(slug ? `/artists/${slug}` : '/404')
						}}
					>
						<div className="relative h-64 w-full">
							{artist.photo?.asset?.url ? (
								<Image
									src={artist.photo.asset.url}
									alt={artist.name}
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
							<h2 className="text-lg font-bold">{artist.name}</h2>
						</div>
					</div>
				))}
			</div>

			{/* Pagination */}
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
