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
import StandardCarousel from '@/ui/components/StandardCarousel'

export default function ArtistContent({ artist }: { artist: Sanity.Artist }) {
	const [bgColor, setBgColor] = useState('transparent')
	const [events, setEvents] = useState<{ upcoming: any[]; past: any[] }>({
		upcoming: [],
		past: [],
	})

	useEffect(() => {
		if (!artist.events) return

		const now = new Date()
		const past = artist.events
			.filter((event) => new Date(event.time.start) < now)
			.sort((a, b) => {
				const dateA = new Date(a.time.start).valueOf()
				const dateB = new Date(b.time.start).valueOf()
				return dateB - dateA
			})

		const upcoming = artist.events
			.filter((event) => new Date(event.time.start) >= now)
			.sort((a, b) => {
				const dateA = new Date(a.time.start).valueOf()
				const dateB = new Date(b.time.start).valueOf()
				return dateA - dateB
			})
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
		<div className="container mx-auto overflow-x-auto overflow-x-hidden bg-transparent px-1 pb-4 transition-colors duration-500">
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
				<div className="mx-auto w-full max-w-2xl space-y-2 text-center max-md:py-4">
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
					{/* Events Section */}
					{artist.events && artist.events.length > 0 && (
						<div className="mx-auto w-full max-w-[100vw] space-y-4 md:max-w-4xl">
							{events.upcoming.length > 0 && (
								<div className="relative w-full">
									<div className="container mx-auto">
										<h2 className="mt-4 text-2xl font-semibold">
											Upcoming Events
										</h2>
										<StandardCarousel>
											{events.upcoming.map((event) => (
												<CarouselItem key={event._id} className="w-full">
													<div className="mx-auto max-w-5xl px-4 py-4">
														<div className="mx-auto">
															<EventCard event={event} />
														</div>
													</div>
												</CarouselItem>
											))}
										</StandardCarousel>
									</div>
								</div>
							)}

							{events.past.length > 0 && (
								<div className="relative w-full">
									<div className="container mx-auto">
										<h2 className="fo nt-semibold mt-6 text-2xl lg:mt-8">
											Past Events
										</h2>
										<StandardCarousel>
											{events.past.map((event) => (
												<CarouselItem key={event._id} className="w-full">
													<div className="mx-auto max-w-5xl px-4 py-4">
														<div className="mx-auto">
															<EventCard event={event} />
														</div>
													</div>
												</CarouselItem>
											))}
										</StandardCarousel>
									</div>
								</div>
							)}
						</div>
					)}
					{/* Gallery Section */}
					{artist.gallery && artist.gallery.length > 0 && (
						<div className="justify-center space-y-4 pt-8 text-center lg:pt-8">
							<h2 className="text-2xl font-semibold">Gallery</h2>
							<GalleryCarousel gallery={artist.gallery} />
						</div>
					)}

					{/* Mobile/Tablet version - at bottom */}
					{artist.venuesPlayed && artist.venuesPlayed.length > 0 && (
						<div className="pt-12 lg:hidden lg:pt-8">
							<VenuesPlayed venues={artist.venuesPlayed} />
						</div>
					)}
				</div>
			</div>
		</div>
	)
}
