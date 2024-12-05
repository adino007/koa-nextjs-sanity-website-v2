'use client'

import { FastAverageColor } from 'fast-average-color'
import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import {
	FaInstagram,
	FaFacebook,
	FaSpotify,
	FaSoundcloud,
	FaYoutube,
	FaTwitter,
	FaGlobe,
} from 'react-icons/fa6'
import {
	Carousel,
	CarouselContent,
	CarouselItem,
	CarouselNext,
	CarouselPrevious,
} from '@/components/ui/carousel'
import EventCard from '../event/EventCard'
import VenuesPlayed from './VenuesPlayed'
import GalleryCarousel from '../gallery/GalleryCarousel'

export default function ArtistContent({ artist }: { artist: Sanity.Artist }) {
	const [bgColor, setBgColor] = useState('transparent')
	const [events, setEvents] = useState<{ upcoming: any[]; past: any[] }>({
		upcoming: [],
		past: [],
	})

	useEffect(() => {
		if (!artist.events) return

		const now = new Date()
		const upcoming = artist.events
			.filter((event) => new Date(event.date) >= now)
			.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())

		const past = artist.events
			.filter((event) => new Date(event.date) < now)
			.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

		setEvents({ upcoming, past })
	}, [artist.events])

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

	const getSocialIcon = (url: string) => {
		const domain = new URL(url).hostname.toLowerCase()

		if (domain.includes('instagram')) return <FaInstagram />
		if (domain.includes('facebook')) return <FaFacebook />
		if (domain.includes('spotify')) return <FaSpotify />
		if (domain.includes('soundcloud')) return <FaSoundcloud />
		if (domain.includes('youtube')) return <FaYoutube />
		if (domain.includes('twitter')) return <FaTwitter />
		return <FaGlobe />
	}

	return (
		<div className="container mx-auto overflow-x-auto bg-transparent px-1 pb-4 transition-colors duration-500">
			<div className="flex flex-col items-center justify-center gap-8 text-center md:ml-10 lg:flex-row lg:items-start">
				<div className="flex w-full flex-col lg:w-1/3">
					{artist.photo?.asset?.url && (
						<div className="relative mx-auto mt-3 w-full max-w-sm cursor-pointer max-lg:aspect-square max-md:mt-0 lg:aspect-[3/4]">
							<Image
								src={artist.photo.asset.url}
								alt={artist.name}
								fill
								className="rounded-lg object-cover"
								loading="eager"
							/>
						</div>
					)}
					{/* Desktop version - above events */}
					{artist.venuesPlayed && artist.venuesPlayed.length > 0 && (
						<div className="hidden pt-4 lg:block">
							<VenuesPlayed venues={artist.venuesPlayed} />
						</div>
					)}
				</div>

				{/* Artist Details Section */}
				<div className="mx-auto w-full max-w-2xl space-y-6 text-center max-md:py-4">
					<h1 className="text-5xl font-bold md:mt-8 lg:mt-10">{artist.name}</h1>

					{artist.bio && (
						<div className="word-spacing-4 text-sm leading-6 tracking-wide [word-spacing:0.16rem]">
							<p>{artist.bio}</p>
						</div>
					)}

					{/* Social Links */}
					{artist.socialLinks && artist.socialLinks.length > 0 && (
						<div className="!mt-2 pb-6">
							<div className="flex justify-center gap-4">
								{artist.socialLinks.map((link, index) => (
									<Link
										key={index}
										href={link.url}
										target="_blank"
										rel="noopener noreferrer"
										className="text-3xl hover:text-blue-400"
										title={link.platform}
									>
										{getSocialIcon(link.url)}
									</Link>
								))}
							</div>
						</div>
					)}
					{/* Events Section - Separated from bio with fixed width */}
					{artist.events && artist.events.length > 0 && (
						<div className="mx-auto w-full max-w-[100vw] space-y-8 md:max-w-4xl">
							{events.upcoming.length > 0 && (
								<div className="relative w-full">
									<h2 className="mb-4 text-2xl font-semibold">
										Upcoming Events
									</h2>
									<Carousel className="relative w-full">
										<CarouselContent className="px-1">
											{/* Upcoming Events */}
											{events.upcoming.map((event) => (
												<CarouselItem
													key={event._id}
													className="flex w-full snap-center justify-center"
												>
													<div className="w-full">
														<EventCard event={event} />
													</div>
												</CarouselItem>
											))}
										</CarouselContent>
										<div className="absolute -left-16 top-1/2 z-10 -ml-4 -translate-y-1/2 max-md:relative max-md:top-auto max-md:mt-[10%] max-md:flex max-md:-translate-y-0 max-md:justify-center lg:-left-8">
											<CarouselPrevious />
										</div>
										<div className="absolute -right-16 top-1/2 z-10 -translate-y-1/2 max-md:relative max-md:top-auto max-md:mt-[10%] max-md:flex max-md:-translate-y-0 max-md:justify-center lg:-right-5">
											<CarouselNext />
										</div>
									</Carousel>
								</div>
							)}

							{events.past.length > 0 && (
								<div className="relative w-full pt-20 lg:pt-4">
									<h2 className="mb-4 text-2xl font-semibold">Past Events</h2>
									<Carousel className="relative w-full">
										<CarouselContent className="px-1">
											{/* Upcoming Events */}
											{events.past.map((event) => (
												<CarouselItem
													key={event._id}
													className="flex w-full snap-center justify-center"
												>
													<div className="w-full">
														<EventCard event={event} />
													</div>
												</CarouselItem>
											))}
										</CarouselContent>
										<div className="absolute -left-16 top-1/2 z-10 -ml-4 -translate-y-1/2 max-md:relative max-md:top-auto max-md:mt-[10%] max-md:flex max-md:-translate-y-0 max-md:justify-center lg:-left-8">
											<CarouselPrevious />
										</div>
										<div className="absolute -right-16 top-1/2 z-10 -translate-y-1/2 max-md:relative max-md:top-auto max-md:mt-[10%] max-md:flex max-md:-translate-y-0 max-md:justify-center lg:-right-5">
											<CarouselNext />
										</div>
									</Carousel>
								</div>
							)}
						</div>
					)}

					{/* Gallery Section */}
					{artist.gallery && artist.gallery.length > 0 && (
						<div className="justify-center space-y-4 pt-20 text-center lg:pt-8">
							<h2 className="text-2xl font-semibold">Gallery</h2>
							<GalleryCarousel gallery={artist.gallery} />
						</div>
					)}

					{/* Mobile/Tablet version - at bottom */}
					{artist.venuesPlayed && artist.venuesPlayed.length > 0 && (
						<div className="pt-20 lg:hidden lg:pt-8">
							<VenuesPlayed venues={artist.venuesPlayed} />
						</div>
					)}
				</div>
			</div>
		</div>
	)
}
