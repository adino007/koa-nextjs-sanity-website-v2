'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { IoLocation } from 'react-icons/io5'
import DynamicBackground from '@/ui/modules/Styling Module/DynamicBackground'
import EventCard from '../event/EventCard'
import GalleryCarousel from '../../components/GalleryCarousel'
import {
	Carousel,
	CarouselContent,
	CarouselItem,
	CarouselNext,
	CarouselPrevious,
} from '@/components/ui/carousel'
import StandardCarousel from '@/ui/components/StandardCarousel'
import Link from 'next/link'

export default function VenueContent({ venue }: { venue: Sanity.Venue }) {
	const [events, setEvents] = useState<{ upcoming: any[]; past: any[] }>({
		upcoming: [],
		past: [],
	})

	const [venueArtists, setVenueArtists] = useState<
		Array<{
			_id: string
			name: string
			photo: {
				asset: {
					url: string
				}
			}
			metadata: {
				slug: {
					current: string
				}
			}
		}>
	>([])

	useEffect(() => {
		if (!venue.events) return

		const now = new Date()
		const upcoming = venue.events
			.filter((event) => new Date(event.time.start) >= now)
			.sort(
				(a, b) =>
					new Date(a.time.start).getTime() - new Date(b.time.start).getTime(),
			)

		const past = venue.events
			.filter((event) => new Date(event.time.start) < now)
			.sort(
				(a, b) =>
					new Date(b.time.start).getTime() - new Date(a.time.start).getTime(),
			)

		setEvents({ upcoming, past })
	}, [venue.events])

	useEffect(() => {
		if (!venue.events) return

		const artistsFromEvents = venue.events
			.filter((event) => event.artists && event.artists.length > 0)
			.reduce(
				(acc, event) => {
					event.artists?.forEach((artist) => {
						if (artist && !acc.find((a) => a._id === artist._id)) {
							acc.push(artist)
						}
					})
					return acc
				},
				[] as typeof venueArtists,
			)

		setVenueArtists(artistsFromEvents)
	}, [venue.events])
	return (
		<DynamicBackground imageUrl={venue.image?.asset?.url || ''}>
			<div className="container mx-auto overflow-hidden bg-transparent px-1 pb-4 transition-colors duration-500">
				<div className="flex flex-col items-center justify-center gap-8 text-center md:ml-10 lg:flex-row lg:items-start">
					{/* Left Column */}
					<div className="flex w-full flex-col lg:w-1/3">
						{venue.image?.asset?.url && (
							<div className="relative mx-auto mt-3 w-full max-w-sm cursor-pointer max-lg:aspect-square max-md:mt-0 lg:aspect-[3/4]">
								<Image
									src={venue.image.asset.url}
									alt={venue.name}
									fill
									className="rounded-lg object-cover"
									priority
								/>
							</div>
						)}

						{/* Desktop Artists */}
						{venueArtists.length > 0 && (
							<div className="hidden pt-12 lg:block">
								<h3 className="mb-4 text-xl font-semibold">Featured Artists</h3>
								<div className="flex flex-wrap justify-center gap-6">
									{venueArtists.map((artist) => (
										<Link
											key={artist._id}
											href={`/artist/${artist.metadata?.slug?.current}`}
											className="group flex w-20 flex-col items-center justify-start text-center"
										>
											<div className="relative mx-auto mb-1 h-20 w-20 transform transition-all duration-300 group-hover:scale-110">
												{artist.photo?.asset?.url && (
													<Image
														src={artist.photo.asset.url}
														alt={artist.name}
														fill
														className="rounded-full object-cover"
													/>
												)}
											</div>
											<span className="pt-3 text-sm leading-5 transition-colors duration-300 group-hover:text-blue-400">
												{artist.name}
											</span>
										</Link>
									))}
								</div>
							</div>
						)}
					</div>

					{/* Right Column */}
					<div className="mx-auto w-full max-w-2xl space-y-6 text-center max-md:py-4">
						<h1 className="text-5xl font-bold md:mt-8 lg:mt-10">
							{venue.name}
						</h1>

						{/* Location */}
						<div className="text-xl leading-10">
							<div
								className="cursor-pointer pt-2 text-sm leading-6 hover:text-blue-400"
								onClick={() =>
									window.open(
										`maps://maps.apple.com/?address=${encodeURIComponent(venue.location)}&dirflg=d`,
										'_blank',
									)
								}
							>
								<span className="flex flex-col">
									<span>
										<IoLocation className="mr-2 inline-block text-gray-400" />
										{venue.location.split(',')[0]}
									</span>
									<span>{venue.location.split(',').slice(1).join(',')}</span>
								</span>
							</div>
						</div>

						{/* Description */}
						{venue.description && (
							<div className="word-spacing-4 text-sm leading-6 tracking-wide [word-spacing:0.16rem] max-md:px-2">
								<p>{venue.description}</p>
							</div>
						)}

						{/* Events Section */}
						{venue.events && venue.events.length > 0 && (
							<div className="mx-auto w-full max-w-[100vw] pt-6 md:max-w-4xl">
								{events.upcoming.length > 0 && (
									<div className="relative w-full">
										<h2 className="text-2xl font-semibold">Upcoming Events</h2>
										<StandardCarousel>
											{events.upcoming.map((event) => (
												<CarouselItem key={event._id} className="w-full">
													<div className="mx-auto max-w-5xl px-4 py-4">
														<EventCard event={event} hideArtists={true} />
													</div>
												</CarouselItem>
											))}
										</StandardCarousel>
									</div>
								)}

								{events.past.length > 0 && (
									<div
										className={`relative w-full ${events.upcoming.length > 0 ? 'pt-8' : 'pt-4'}`}
									>
										<h2 className="text-2xl font-semibold">Past Events</h2>
										<StandardCarousel>
											{events.past.map((event) => (
												<CarouselItem key={event._id} className="w-full">
													<div className="mx-auto max-w-5xl px-4 py-4">
														<EventCard event={event} hideArtists={true} />
													</div>
												</CarouselItem>
											))}
										</StandardCarousel>
									</div>
								)}
							</div>
						)}

						{/* Gallery Section */}
						{venue.gallery && venue.gallery.length > 0 && (
							<div className="justify-center space-y-4 pt-20 text-center lg:pt-8">
								<h2 className="text-2xl font-semibold">Gallery</h2>
								<GalleryCarousel gallery={venue.gallery} />
							</div>
						)}

						{/* Mobile Artists */}
						{venueArtists.length > 0 && (
							<div className="pt-12 lg:hidden">
								<h3 className="mb-4 text-xl font-semibold">Featured Artists</h3>
								<div className="flex flex-wrap justify-center gap-6">
									{venueArtists.map((artist) => (
										<Link
											key={artist._id}
											href={`/artist/${artist.metadata?.slug?.current}`}
											className="group flex w-20 flex-col items-center justify-start text-center"
										>
											<div className="relative mx-auto mb-1 h-20 w-20 transform transition-all duration-300 group-hover:scale-110">
												{artist.photo?.asset?.url && (
													<Image
														src={artist.photo.asset.url}
														alt={artist.name}
														fill
														className="rounded-full object-cover"
													/>
												)}
											</div>
											<span className="pt-3 text-sm leading-5 transition-colors duration-300 group-hover:text-blue-400">
												{artist.name}
											</span>
										</Link>
									))}
								</div>
							</div>
						)}
					</div>
				</div>
			</div>
		</DynamicBackground>
	)
}
