'use client'

import { FastAverageColor } from 'fast-average-color'
import { useState, useEffect, useRef } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import CTAList from '@/ui/CTAList'
import { FaCalendar, FaClock } from 'react-icons/fa6'
import { IoLocation } from 'react-icons/io5'

export default function EventContent({ event }: { event: Sanity.Event }) {
	const [bgColor, setBgColor] = useState('transparent')
	const [isSticky, setIsSticky] = useState(false)
	const ctaRef = useRef(null)

	useEffect(() => {
		if (event.flyer?.asset?.url) {
			const fac = new FastAverageColor()
			const img = document.createElement('img')
			img.src = event.flyer.asset.url
			img.crossOrigin = 'anonymous'

			img.onload = () => {
				const color = fac.getColor(img)
				setBgColor(
					`rgba(${color.value[0]}, ${color.value[1]}, ${color.value[2]}, 0.7)`,
				)
			}
		}
	}, [event.flyer?.asset?.url])

	useEffect(() => {
		const observer = new IntersectionObserver(
			([entry]) => {
				setIsSticky(!entry.isIntersecting)
			},
			{ threshold: 1 },
		)

		if (ctaRef.current) {
			observer.observe(ctaRef.current)
		}

		return () => observer.disconnect()
	}, [])

	return (
		<>
			{/* Mobile Sticky CTA */}
			{isSticky && (
				<div
					className="fixed bottom-0 left-0 right-0 z-10 backdrop-blur-lg md:hidden"
					style={{ backgroundColor: bgColor }}
				>
					<div className="p-4">
						<CTAList ctas={[event.ticketlink]} className="text-center" />
					</div>
				</div>
			)}

			<div className="container mx-auto bg-transparent px-4 pb-12 transition-colors duration-500 max-sm:-my-6">
				<div className="flex flex-col items-center justify-center gap-8 lg:flex-row">
					{/* Flyer Section */}
					<div className="w-full lg:w-1/3">
						<div
							className="relative mx-auto mt-6 aspect-[3/4] w-full max-w-sm cursor-pointer"
							onClick={() =>
								event.ticketlink?.link?.external &&
								window.open(event.ticketlink.link.external, '_blank')
							}
						>
							{event.flyer?.asset?.url && (
								<Image
									src={event.flyer.asset.url}
									alt={event.name}
									fill
									className="rounded-lg object-cover transition-opacity hover:opacity-90"
									priority
								/>
							)}
						</div>
					</div>
					{/* Event Details Section */}
					<div className="space-y-6 text-center max-md:py-4 lg:w-1/2">
						<h1 className="text-5xl font-bold">{event.name}</h1>
						{event.venue && (
							<div className="text-xl">
								<IoLocation className="mr-2 inline-block text-gray-400" />
								<span
									className="cursor-pointer hover:text-blue-400"
									onClick={() =>
										window.open(
											`maps://maps.google.com/?q=${event.venue.location}`,
											'_blank',
										)
									}
								>
									<h2 className="inline-block font-semibold">
										{event.venue.name}
									</h2>
								</span>
								<p>{event.venue.location}</p>
							</div>
						)}
						<div className="text-sm">
							{event.time && (
								<div className="inline-flex items-center gap-2">
									<FaClock className="text-gray-400" />
									<p>
										{new Date(event.time.start).toLocaleTimeString([], {
											hour: '2-digit',
											minute: '2-digit',
										})}{' '}
										-
										{new Date(event.time.end).toLocaleTimeString([], {
											hour: '2-digit',
											minute: '2-digit',
										})}
									</p>
								</div>
							)}

							<div></div>

							<div className="inline-flex items-center gap-2 pt-2">
								<FaCalendar className="text-gray-400" />
								<p>{new Date(event.date).toLocaleDateString()}</p>
							</div>
						</div>

						{/* Artists Section - Centered */}
						{event.artists && event.artists.length > 0 && (
							<div className="flex justify-center gap-4 overflow-x-auto py-4">
								{event.artists.map(
									(artist) =>
										artist.metadata?.slug?.current && (
											<Link
												key={artist._id}
												href={`/artist/${artist.metadata.slug.current}`}
												className="flex-shrink-0 text-center"
											>
												{artist.photo?.asset?.url && (
													<div className="relative mx-auto mb-2 h-16 w-16">
														<Image
															src={artist.photo.asset.url}
															alt={artist.name}
															fill
															className="rounded-full object-cover"
														/>
													</div>
												)}
												<p className="text-sm font-medium">{artist.name}</p>
											</Link>
										),
								)}
							</div>
						)}

						{/* Regular CTA */}
						{event.ticketlink && (
							<div ref={ctaRef}>
								<CTAList
									ctas={[event.ticketlink]}
									className="justify-center text-center"
								/>
							</div>
						)}
					</div>
				</div>
			</div>
		</>
	)
}
