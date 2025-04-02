'use client'

import Image from 'next/image'
import Link from 'next/link'
import { FaCalendar, FaClock } from 'react-icons/fa6'
import { IoLocation } from 'react-icons/io5'
import CTAList from '@/ui/CTAList'
import { GrHide } from 'react-icons/gr'

interface EventCardProps {
	event: Sanity.Event
	hideArtists?: boolean
}

export default function EventCard({
	event,
	hideArtists = false,
}: EventCardProps) {
	const getMapUrl = (location: string) => {
		return `maps://maps.apple.com/?address=${encodeURIComponent(location)}&dirflg=d`
	}

	const generateCalendarUrl = (event: Sanity.Event) => {
		if (!event.time?.start) {
			console.error('Missing start time for event:', event)
			return '#'
		}

		try {
			const startDate = new Date(event.time.start)
			const endDate = event.time?.end
				? new Date(event.time.end)
				: new Date(startDate)

			if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
				console.error('Invalid date for event:', event)
				return '#'
			}

			const details = `
				${event.venue ? `Venue: ${event.venue.name}` : ''}
				${event.artists ? `Artists: ${event.artists.map((a) => a.name).join(', ')}` : ''}
			`.trim()

			return `data:text/calendar;charset=utf-8,BEGIN:VCALENDAR
	VERSION:2.0
	BEGIN:VEVENT
	DTSTART:${startDate
		.toISOString()
		.replace(/[-:]/g, '')
		.replace(/\.\d{3}/g, '')}
	DTEND:${endDate
		.toISOString()
		.replace(/[-:]/g, '')
		.replace(/\.\d{3}/g, '')}
	SUMMARY:${event.name}
	LOCATION:${event.venue?.location || ''}
	DESCRIPTION:${details}
	END:VEVENT
	END:VCALENDAR`.replace(/\n/g, '%0A')
		} catch (error) {
			console.error('Error generating calendar URL:', error)
			return '#'
		}
	}
	return (
		<div className="block">
			<Link
				href={
					event?.metadata?.slug?.current
						? `/event/${event.metadata.slug.current}`
						: '/404'
				}
				className="group relative block cursor-pointer overflow-hidden rounded-lg outline-none transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl"
				title={event.name}
			>
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

				<div className="relative z-10 flex flex-col items-start gap-6 rounded-lg bg-gradient-to-r from-black/60 via-black/40 to-transparent p-6 transition-colors duration-300 group-hover:from-black/70 md:flex-row md:items-center">
					<div className="flex-grow">
						<h2 className="mb-2 text-2xl font-bold">{event.name}</h2>
						<div className="space-y-2">
							{event.time?.start && (
								<div className="flex items-center gap-2">
									<a
										href={generateCalendarUrl(event)}
										download={`${event.name}.ics`}
										onClick={(e) => e.stopPropagation()}
										className="flex items-center gap-2 hover:text-blue-400"
									>
										<FaCalendar className="text-gray-400" />
										<span>
											{new Date(event.time.start).toLocaleDateString('en-US', {
												weekday: 'long',
												year: 'numeric',
												month: 'long',
												day: 'numeric',
											})}
										</span>
									</a>
								</div>
							)}
							{event.venue && (
								<div className="flex items-center gap-2">
									<IoLocation className="text-gray-400" />
									<a
										href={getMapUrl(event.venue.location)}
										target="_blank"
										rel="noopener noreferrer"
										onClick={(e) => e.stopPropagation()}
										className="cursor-pointer hover:text-blue-400"
										title={`View ${event.venue.name} on map`}
									>
										{event.venue.name}
									</a>
								</div>
							)}
							{event.time && (
								<div className="flex items-center gap-2">
									<FaClock className="text-gray-400" />
									<span>
										{new Date(event.time.start).toLocaleTimeString([], {
											hour: '2-digit',
											minute: '2-digit',
										})}{' '}
										-
										{new Date(event.time.end).toLocaleTimeString([], {
											hour: '2-digit',
											minute: '2-digit',
										})}
									</span>
								</div>
							)}
						</div>
					</div>

					{/* Artists Section */}
					{event.artists && event.artists && !hideArtists && (
						<div className="mt-4 flex w-full flex-wrap justify-start gap-6 md:mt-0 md:w-auto md:justify-end">
							{event.artists
								.filter((artist) => artist !== null)
								.map((artist) => (
									<Link
										key={artist._id}
										href={`/artist/${artist.metadata?.slug?.current}`}
										onClick={(e) => e.stopPropagation()}
										className="group/artist flex w-16 flex-col items-center justify-center text-center transition-none"
									>
										{artist.photo?.asset?.url && (
											<div className="relative mx-auto mb-1 h-12 w-12 transition-transform duration-300 group-hover/artist:scale-110">
												<Image
													src={artist.photo.asset.url}
													alt={artist.name}
													fill
													className="rounded-full object-cover"
												/>
											</div>
										)}
										<span className="pt-2 text-xs leading-5 group-hover/artist:text-blue-400">
											{artist.name}
										</span>
									</Link>
								))}
						</div>
					)}
					{event.eventCTAS &&
						Array.isArray(event.eventCTAS) &&
						event.eventCTAS.length > 0 &&
						event.eventCTAS[0]?.showCTA && (
							<div
								onClick={(e) => e.stopPropagation()}
								className="w-full text-center md:w-32"
							>
								<CTAList
									ctas={[event.eventCTAS[0]]}
									className="!mt-4 md:!mt-0"
								/>
							</div>
						)}
				</div>
			</Link>
		</div>
	)
}
