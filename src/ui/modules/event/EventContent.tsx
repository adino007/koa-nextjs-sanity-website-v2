'use client'

import { useState, useEffect, useRef } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import DynamicBackground from '@/ui/modules/Styling Module/DynamicBackground'
import CTAList from '@/ui/CTAList'
import { FaCalendar, FaClock } from 'react-icons/fa6'
import { IoLocation } from 'react-icons/io5'
import RelatedEvents from './RelatedEvents'

export default function EventContent({ event }: { event: Sanity.Event }) {
	const [isSticky, setIsSticky] = useState(true)
	const ctaRef = useRef(null)
	const moreEventsRef = useRef(null)

	const getMapUrl = (location: string) => {
		return `maps://maps.apple.com/?address=${encodeURIComponent(location)}&dirflg=d`
	}

	useEffect(() => {
		const observer = new IntersectionObserver(
			([entry]) => {
				// Only show sticky when we're above the regular CTA
				setIsSticky(entry.boundingClientRect.top > window.innerHeight)
			},
			{
				threshold: 0,
			},
		)

		if (ctaRef.current) observer.observe(ctaRef.current)
		return () => observer.disconnect()
	}, [])
	return (
		<DynamicBackground imageUrl={event.flyer?.asset?.url || ''}>
			{isSticky && event.eventCTAS && event.eventCTAS[0] && (
				<div
					className="fixed bottom-0 left-0 right-0 z-30 overflow-x-auto py-2 lg:hidden"
					style={{
						background: `var(--dynamic-bg, rgba(0, 0, 0, 0.7))`,
						backdropFilter: 'blur(16px)',
						WebkitBackdropFilter: 'blur(16px)',
					}}
				>
					<CTAList
						ctas={[event.eventCTAS[0]]}
						className="text-center text-xl font-bold tracking-wide"
					/>
				</div>
			)}

			<div className="container mx-auto overflow-visible overflow-x-auto bg-transparent px-4 transition-colors duration-500 md:pb-12">
				<div className="flex flex-col items-center justify-center gap-8 lg:flex-row">
					{/* Flyer Section */}
					<div className="w-full lg:w-1/3 lg:self-start">
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
							<div className="text-xl leading-10">
								<Link
									href={`/venue/${event.venue.metadata.slug.current}`}
									className="hover:text-blue-400"
								>
									<h2 className="inline-block font-semibold">
										{event.venue.name}
									</h2>
								</Link>
								<div
									className="cursor-pointer pt-2 text-sm leading-6 hover:text-blue-400"
									onClick={() =>
										window.open(getMapUrl(event.venue.location), '_blank')
									}
								>
									<span className="flex flex-col">
										<span>
											<IoLocation className="mr-2 inline-block text-gray-400" />
											{event.venue.location.split(',')[0]}
										</span>
										<span>
											{event.venue.location.split(',').slice(1).join(',')}
										</span>
									</span>
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
								<p>{new Date(event.time.start).toLocaleDateString()}</p>
							</div>
						</div>
						{/* Artists Section */}
						{event.artists && event.artists.length > 0 && (
							<div className="flex flex-wrap justify-center gap-10 overflow-x-auto py-3 lg:mx-auto lg:max-w-[32rem]">
								{event.artists
									.filter((artist) => artist !== null)
									.map((artist) => (
										<Link
											key={artist._id}
											href={`/artist/${artist.metadata?.slug?.current}`}
											className="group flex w-20 flex-col items-center justify-start text-center"
											onClick={(e) => e.stopPropagation()}
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
			<div className="flex w-full max-w-[100vw] justify-center !overflow-visible pt-2">
				<RelatedEvents ref={moreEventsRef} currentEventId={event._id} />
			</div>
		</DynamicBackground>
	)
}
