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

	const socialIcons = {
		instagram: FaInstagram,
		facebook: FaFacebook,
		spotify: FaSpotify,
		soundcloud: FaSoundcloud,
		youtube: FaYoutube,
		twitter: FaTwitter,
		website: FaGlobe,
	}

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
					{/* Upcoming Events Section */}
					{artist.upcomingEvents && artist.upcomingEvents.length > 0 && (
						<div className="space-y-6">
							<h2 className="text-2xl font-semibold">Upcoming Events</h2>
							<div className="space-y-6">
								{artist.upcomingEvents.map((event) => (
									<div key={event._id} className="block">
										<Link
											href={`/event/${event.metadata?.slug?.current}`}
											className="relative block cursor-pointer overflow-hidden rounded-lg group transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl outline-none"
											title={event.name}
										>
											{/* Background Image with Blur */}
											{event.flyer?.asset?.url && (
												<div className="absolute inset-0">
													<Image
														src={event.flyer.asset.url}
														alt={event.name}
														fill
														sizes="(max-width: 768px) 100vw, 50vw"
														className="object-cover"
														priority={true}
													/>
													<div className="absolute inset-0 bg-black/50 backdrop-blur-lg transition-all duration-300 group-hover:bg-black/30 group-hover:backdrop-blur-[2px]" />
												</div>
											)}
											
											{/* Rest of your event content */}
											<div className="relative z-10 flex flex-col items-start gap-6 rounded-lg bg-gradient-to-r from-black/60 via-black/40 to-transparent p-6 transition-colors duration-300 group-hover:from-black/70 md:flex-row md:items-center">
												<div className="flex-grow">
													<h2 className="mb-2 text-2xl font-bold">
														{event.name}
													</h2>
													<div className="space-y-2">
														<div className="flex items-center gap-2">
															<FaCalendar className="text-gray-400" />
															<span>
																{new Date(event.date).toLocaleDateString(
																	'en-US',
																	{
																		weekday: 'long',
																		year: 'numeric',
																		month: 'long',
																		day: 'numeric',
																	},
																)}
															</span>
														</div>
														{event.venue && (
															<div className="flex items-center gap-2">
																<IoLocation className="text-gray-400" />
																<span>{event.venue.name}</span>
															</div>
														)}
														{event.time && (
															<div className="flex items-center gap-2">
																<FaClock className="text-gray-400" />
																<span>
																	{new Date(
																		event.time.start,
																	).toLocaleTimeString([], {
																		hour: '2-digit',
																		minute: '2-digit',
																	})}{' '}
																	-
																	{new Date(event.time.end).toLocaleTimeString(
																		[],
																		{
																			hour: '2-digit',
																			minute: '2-digit',
																		},
																	)}
																</span>
															</div>
														)}
													</div>
												</div>
												{event.eventCTAS &&
													Array.isArray(event.eventCTAS) &&
													event.eventCTAS.length > 0 &&
													event.eventCTAS[0]?.showCTA && (
														<div className="w-full text-center md:w-32">
															<CTAList
																ctas={[event.eventCTAS[0]]}
																className="!mt-4 md:!mt-0"
															/>
														</div>
													)}
											</div>
										</Link>
									</div>
								))}
							</div>
						</div>
					)}
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
