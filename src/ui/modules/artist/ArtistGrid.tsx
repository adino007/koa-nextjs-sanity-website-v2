'use client'

import { useState, useEffect } from 'react'
import { getArtists } from '@/lib/sanity/queries'
import Image from 'next/image'
import { useRouter } from 'next/navigation'

const ITEMS_PER_PAGE = 9

export default function ArtistGrid() {
	const router = useRouter()
	const [artists, setArtists] = useState<Sanity.Artist[]>([])
	const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc')
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

	const sortedArtists = [...artists].sort((a, b) => {
		return sortOrder === 'asc'
			? a.name.localeCompare(b.name) // A to Z
			: b.name.localeCompare(a.name) // Z to A
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
		<div className="container mx-auto px-4 py-4">
			{/* Sorting Controls */}
			<div className="mb-4 flex justify-center sm:justify-end">
				<div className="flex flex-row space-x-2">
					<div className="flex items-center">
						<label
							htmlFor="sort"
							className="mr-1 text-sm font-medium text-white"
						>
							Sort:
						</label>
						<select
							id="sort"
							value={sortOrder}
							onChange={(e) => setSortOrder(e.target.value as 'asc' | 'desc')}
							className="w-32 rounded border p-1 text-sm uppercase text-black"
						>
							<option className="py-1" value="asc">
								A to Z
							</option>
							<option className="py-1" value="desc">
								Z to A
							</option>
						</select>
					</div>
				</div>
			</div>
			{/* Artist Grid */}
			<div className="grid grid-cols-6 gap-4 pt-4 max-md:grid-cols-4 max-sm:grid-cols-3 sm:ml-16 sm:gap-6 lg:gap-3">
				{sortedArtists.map((artist) => (
					<div
						key={artist._id}
						className="cursor-pointer overflow-hidden"
						onClick={() => {
							const slug = artist?.metadata?.slug?.current
							router.push(slug ? `/artist/${slug}` : '/404')
						}}
					>
						<div className="relative aspect-square w-full pt-2 lg:mx-auto lg:w-3/4">
							{artist.photo?.asset?.url ? (
								<Image
									src={artist.photo.asset.url}
									alt={artist.name}
									fill
									style={{ objectFit: 'cover' }}
									sizes="(max-width: 768px) 33vw, 25vw"
									className="rounded-lg transition-transform duration-300 hover:scale-105"
								/>
							) : (
								<div className="flex h-full w-full items-center justify-center rounded-lg bg-gray-300 text-gray-700">
									No Image
								</div>
							)}
						</div>
						<h2 className="mt-4 text-center text-sm font-medium text-white md:mt-6">
							{artist.name}
						</h2>
					</div>
				))}
			</div>

			{/* Pagination
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
			</div> */}
		</div>
	)
}
