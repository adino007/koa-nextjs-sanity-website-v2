'use client'

import { useState, useEffect } from 'react'
import { getArtists } from '@/lib/sanity/queries'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select'
import Link from 'next/link'

export default function ArtistGrid() {
	const router = useRouter()
	const [artists, setArtists] = useState<Sanity.Artist[]>([])
	const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc')
	const [loading, setLoading] = useState(true)

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
		.filter((artist: Sanity.Artist) => artist.isVisible !== false)
		.sort((a, b) => {
			return sortOrder === 'asc'
				? a.name.localeCompare(b.name)
				: b.name.localeCompare(a.name)
		})

	if (loading) {
		return (
			<div className="py-24 text-center text-xl text-white">
				<div className="inline-flex">
					Loading artists
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
		<div className="container mx-auto px-4 py-4">
			<div className="mb-4 flex justify-center sm:justify-end">
				<Select
					onValueChange={(value) => setSortOrder(value as 'asc' | 'desc')}
				>
					<SelectTrigger className="w-42 frosted-glass-dark px-2 uppercase leading-normal max-md:header-open:z-0 lg:mr-4">
						<SelectValue placeholder="Sort Artists" />
					</SelectTrigger>
					<SelectContent>
						<SelectItem className="frosted-glass-dark z-10 py-1" value="asc">
							A to Z
						</SelectItem>
						<SelectItem className="frosted-glass-dark z-10 py-1" value="desc">
							Z to A
						</SelectItem>
					</SelectContent>
				</Select>
			</div>

			<div className="grid grid-cols-3 gap-4 pt-4 sm:gap-6 md:grid-cols-4 lg:grid-cols-5 lg:gap-4 lg:gap-y-6">
				{sortedArtists.map((artist) => (
					<Link
						key={artist._id}
						href={
							artist?.metadata?.slug?.current
								? `/artist/${artist.metadata.slug.current}`
								: '/404'
						}
						className="cursor-pointer overflow-hidden outline-none transition-all duration-300 hover:scale-[1.12] hover:shadow-2xl"
						title={artist.name}
					>
						<div className="relative aspect-square w-full pt-2 lg:mx-auto lg:w-3/4">
							{artist.photo?.asset?.url ? (
								<Image
									src={artist.photo.asset.url}
									alt={artist.name}
									fill
									style={{ objectFit: 'cover' }}
									sizes="(max-width: 768px) 33vw, 25vw"
									className="rounded-lg transition-transform duration-300"
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
					</Link>
				))}
			</div>
		</div>
	)
}
