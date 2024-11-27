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
import {
	FaInstagram,
	FaFacebook,
	FaSpotify,
	FaSoundcloud,
	FaYoutube,
	FaTwitter,
	FaGlobe,
	FaCalendar,
	FaClock,
} from 'react-icons/fa6'
import { IoLocation } from 'react-icons/io5'
import CTAList from '@/ui/CTAList'
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"
import Autoplay from "embla-carousel-autoplay"
import useEmblaCarousel from "embla-carousel-react"
import EventCard from '../event/EventCard'

export default function ArtistContent({ artist }: { artist: Sanity.Artist }) {
	const [bgColor, setBgColor] = useState('transparent')
	const [upcomingCarouselRef] = useEmblaCarousel({
		align: "start",
		containScroll: "trimSnaps"
	})

	const [pastCarouselRef] = useEmblaCarousel({
		align: "start",
		containScroll: "trimSnaps"
	})

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
		<div className="container mx-auto bg-transparent px-4 pb-12 transition-colors duration-500">
			<div className="flex flex-col items-center justify-center gap-8 lg:flex-row lg:items-start">
				{/* Artist Photo Section */}
				<div className="w-full lg:w-1/3">
					{artist.photo?.asset?.url && (
						<div className="relative mx-auto mt-6 w-full max-w-sm cursor-pointer max-lg:aspect-square max-md:mt-0 lg:aspect-[3/4]">
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
						<div className="pt-3 text-xs leading-loose">
							<p>{artist.bio}</p>
						</div>
					)}

					{/* Social Links */}
					{artist.socialLinks && artist.socialLinks.length > 0 && (
						<div className="!mt-2 pb-10">
							<div className="flex justify-center gap-4">
								{artist.socialLinks.map((link, index) => (
									<Link
										key={index}
										href={link.url}
										target="_blank"
										rel="noopener noreferrer"
										className="text-2xl hover:text-blue-400"
										title={link.platform}
									>
										{getSocialIcon(link.url)}
									</Link>
								))}
							</div>
						</div>
					)}
						{/* Events Sections */}
						<div className="events-carousel-container">
							{artist.events && artist.events.length > 0 && (
								<div className="space-y-6">
									{(() => {
										const now = new Date()
										const upcoming = artist.events
											.filter(event => new Date(event.date) >= now)
											.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
										
										const past = artist.events
											.filter(event => new Date(event.date) < now)
											.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

										return (
											<>
												{upcoming.length > 0 && (
													<div className="space-y-6">
														<h2 className="text-2xl font-semibold">Upcoming Events</h2>
														<div className="space-y-6">
															{upcoming.map((event) => (
																<EventCard key={event._id} event={event} />
															))}
														</div>
													</div>
												)}

												{past.length > 0 && (
													<div className="space-y-6">
														<h2 className="text-2xl font-semibold">Past Events</h2>
														<div className="space-y-6">
															{past.map((event) => (
																<EventCard key={event._id} event={event} />
															))}
														</div>
													</div>
												)}
											</>
										)
									})()}
								</div>
							)}
						</div>
					{/* Venues Played Section */}
					{artist.venuesPlayed && artist.venuesPlayed.length > 0 && (
						<div className="space-y-4 pt-12">
							<h2 className="text-2xl font-semibold">Venues Played</h2>
							<div className="flex flex-wrap justify-center gap-4">
								{artist.venuesPlayed.map((venue, index) =>
									venue.metadata?.slug?.current ? (
										<Link
											key={index}
											href={`/venue/${venue.metadata.slug.current}`}
											className="hover:text-blue-400"
										>
											{venue.name}
										</Link>
									) : (
										<span key={index}>{venue.name}</span>
									),
								)}
							</div>
						</div>
					)}

					{/* Gallery Section */}
					{artist.gallery && artist.gallery.length > 0 && (
						<div className="space-y-4 pt-12">
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
				</div>
			</div>
		</div>
	)
}
