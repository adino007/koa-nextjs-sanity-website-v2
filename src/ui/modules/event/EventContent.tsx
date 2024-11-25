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

	const getMapUrl = (location: string) => {
		return `maps://maps.apple.com/?address=${encodeURIComponent(location)}&dirflg=d`
	}

	useEffect(() => {
		if (event.flyer?.asset?.url) {
			const fac = new FastAverageColor()
			const img = document.createElement('img')
			img.src = event.flyer.asset.url
			img.crossOrigin = 'anonymous'

			// Calculate contrast ratio between background and white text
			const getContrastRatio = (r: number, g: number, b: number) => {
				const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255
				const textLuminance = 1 // White text
				const lighter = Math.max(textLuminance, luminance)
				const darker = Math.min(textLuminance, luminance)
				return (lighter + 0.05) / (darker + 0.05)
			}

			img.onload = () => {
				const mainColor = fac.getColor(img, {
					algorithm: 'dominant',
					mode: 'speed',
				})

				let finalColor = mainColor.value
				const contrastRatio = getContrastRatio(
					finalColor[0],
					finalColor[1],
					finalColor[2],
				)

				// If contrast is too low, adjust color until we reach desired ratio
				if (contrastRatio < 4.5) {
					finalColor = [
						Math.floor(finalColor[0] * 0.6),
						Math.floor(finalColor[1] * 0.6),
						Math.floor(finalColor[2] * 0.6),
						finalColor[3],
					]
				}

				const bgColorValue = `rgba(${finalColor[0]}, ${finalColor[1]}, ${finalColor[2]}, 0.9)`

				const root = document.documentElement
				root.style.setProperty('background-color', bgColorValue)
				root.style.setProperty('color-scheme', 'dark')
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

	useEffect(() => {
		console.log('Sticky state changed:', isSticky)
	}, [isSticky])

	return (
		<>
			{/* Mobile Sticky CTA */}
			{isSticky && event.eventCTAS?.[0] && (
				<div
					className="fixed left-0 right-0 z-10 py-5 lg:hidden"
					style={{
						background: bgColor,
						backdropFilter: 'blur(16px)',
						WebkitBackdropFilter: 'blur(16px)',
						bottom: 'env(safe-area-inset-bottom)',
						paddingBottom: 'env(safe-area-inset-bottom)',
					}}
				>
					<CTAList
						ctas={[event.eventCTAS[0]]}
						className="pb-2 text-center text-xl font-bold tracking-wide"
					/>
				</div>
			)}
			<div className="mx-auto px-4 transition-colors duration-500 md:pb-12">
				<div className="flex flex-col items-center justify-center gap-8 lg:flex-row">
					{/* Flyer Section */}
					<div className="w-full lg:w-1/3">
						<div
							className="relative mx-auto aspect-[3/4] w-full max-w-sm cursor-pointer md:mt-6"
							onClick={() =>
								event.eventCTAS?.[0]?.link?.external &&
								window.open(event.eventCTAS[0].link.external, '_blank')
							}
						>
							{event.flyer?.asset?.url && (
								<Image
									src={event.flyer.asset.url}
									alt={event.name}
									fill
									className="rounded-lg object-cover transition-opacity hover:opacity-90"
									loading="eager"
								/>
							)}
						</div>
					</div>
					{/* Event Details Section */}
					<div className="space-y-6 text-center max-md:py-4 md:mt-4 lg:w-1/2">
						<h1 className="text-5xl font-bold">{event.name}</h1>
						{event.venue && (
							<div className="text-xl">
								<Link
									href={`/venue/${event.venue.metadata.slug.current}`}
									className="hover:text-blue-400"
								>
									<h2 className="inline-block font-semibold">
										{event.venue.name}
									</h2>
								</Link>
								<div
									className="cursor-pointer pt-2 text-sm hover:text-blue-400"
									onClick={() =>
										window.open(getMapUrl(event.venue.location), '_blank')
									}
								>
									<IoLocation className="mr-2 inline-block text-gray-400" />
									<span>{event.venue.location}</span>
								</div>
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
						{event.eventCTAS && event.eventCTAS.length > 0 && (
							<div ref={ctaRef} className="!mt-4">
								<CTAList
									ctas={event.eventCTAS}
									className="text-center text-xl font-bold tracking-wide"
								/>
							</div>
						)}
					</div>
				</div>
			</div>
		</>
	)
}
