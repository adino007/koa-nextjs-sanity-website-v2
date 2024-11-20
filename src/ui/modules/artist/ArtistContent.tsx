'use client'

import { FastAverageColor } from 'fast-average-color'
import {
	useState,
	useEffect,
	AwaitedReactNode,
	JSXElementConstructor,
	Key,
	ReactElement,
	ReactNode,
	ReactPortal,
} from 'react'
import Image from 'next/image'
import Link from 'next/link'

export default function ArtistContent({ artist }: { artist: Sanity.Artist }) {
	const [bgColor, setBgColor] = useState('transparent')

	useEffect(() => {
		if (artist.photo?.asset?.url) {
			const fac = new FastAverageColor()
			const img = document.createElement('img')
			img.src = artist.photo.asset.url
			img.crossOrigin = 'anonymous'

			img.onload = () => {
				const color = fac.getColor(img)
				setBgColor(
					`rgba(${color.value[0]}, ${color.value[1]}, ${color.value[2]}, 0.7)`,
				)
			}
		}
	}, [artist.photo?.asset?.url])

	return (
		<div className="container mx-auto bg-transparent px-4 pb-12 transition-colors duration-500">
			<div className="flex flex-col items-center justify-center gap-8 lg:flex-row lg:items-start">
				{/* Artist Photo Section */}
				<div className="w-full lg:w-1/3">
					{artist.photo?.asset?.url && (
						<div className="relative mx-auto mt-6 aspect-[3/4] w-full max-w-sm cursor-pointer max-md:mt-0">
							<Image
								src={artist.photo.asset.url}
								alt={artist.name}
								fill
								className="rounded-lg object-cover"
								loading="eager"
							/>
						</div>
					)}
				</div>

				{/* Artist Details Section */}
				<div className="pace-y-6 text-center max-md:py-4 lg:mt-6 lg:w-1/2">
					<h1 className="text-5xl font-bold md:mt-8 lg:mt-12">{artist.name}</h1>

					{artist.bio && (
						<div className="mt-6 text-sm">
							<p>{artist.bio}</p>
						</div>
					)}

					{/* Social Links */}
					{artist.socialLinks && artist.socialLinks.length > 0 && (
						<div className="!mt-4 flex justify-center">
							<div className="flex flex-wrap items-center justify-center gap-[.5em]">
								{artist.socialLinks.map((link, index) => (
									<a
										key={index}
										href={link.url}
										target="_blank"
										rel="noopener noreferrer"
										className="action text-lg md:px-8 md:py-4 md:text-xl"
									>
										{link.platform}
									</a>
								))}
							</div>
						</div>
					)}

					{/* Gallery Section */}
					{artist.gallery && artist.gallery.length > 0 && (
						<div className="space-y-4">
							<h2 className="text-2xl font-semibold">Gallery</h2>
							<div className="grid grid-cols-2 gap-4 md:grid-cols-3">
								{artist.gallery.map((image, index) => (
									<div key={index} className="relative aspect-square">
										<Image
											src={image.asset.url}
											alt={`${artist.name} gallery image ${index + 1}`}
											fill
											className="rounded-lg object-cover"
										/>
									</div>
								))}
							</div>
						</div>
					)}

					{/* Upcoming Events Section */}
					{artist.upcomingEvents && artist.upcomingEvents.length > 0 && (
						<div className="space-y-4">
							<h2 className="text-2xl font-semibold">Upcoming Events</h2>
							<div className="flex flex-col gap-4">
								{artist.upcomingEvents.map(
									(event: {
										_id: Key | null | undefined
										name:
											| string
											| number
											| bigint
											| boolean
											| ReactElement<any, string | JSXElementConstructor<any>>
											| Iterable<ReactNode>
											| ReactPortal
											| Promise<AwaitedReactNode>
											| Iterable<ReactNode>
											| null
											| undefined
										date: string | number | Date
										venue: {
											name:
												| string
												| number
												| bigint
												| boolean
												| ReactElement<any, string | JSXElementConstructor<any>>
												| Iterable<ReactNode>
												| ReactPortal
												| Promise<AwaitedReactNode>
												| Iterable<ReactNode>
												| null
												| undefined
										}
									}) => (
										<div key={event._id} className="rounded-lg bg-gray-800 p-4">
											<h3 className="font-bold">{event.name}</h3>
											<p>{new Date(event.date).toLocaleDateString()}</p>
											<p>{event.venue.name}</p>
										</div>
									),
								)}
							</div>
						</div>
					)}

					{/* Venues Played Section */}
					{artist.venuesPlayed && artist.venuesPlayed.length > 0 && (
						<div className="space-y-4">
							<h2 className="text-2xl font-semibold">Venues Played</h2>
							<div className="flex flex-wrap justify-center gap-4">
								{artist.venuesPlayed.map((venue, index) => (
									<div key={index} className="rounded-lg bg-gray-800 p-4">
										<h3 className="font-bold">{venue.name}</h3>
										<p>{venue.location}</p>
									</div>
								))}
							</div>
						</div>
					)}
				</div>
			</div>
		</div>
	)
}
