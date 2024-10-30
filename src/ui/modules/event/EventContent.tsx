import Image from 'next/image'
import Link from 'next/link'
import { useState, useEffect } from 'react'
import { getPaletteFromURL } from 'color-thief-node'

export default function EventContent({ event }: { event: Sanity.Event }) {


    const [bgColor, setBgColor] = useState('')

    useEffect(() => {
        if (event.flyer?.asset?.url) {
            getPaletteFromURL(event.flyer.asset.url).then(color => {
                const [r, g, b] = color
                setBgColor(`rgba(${r}, ${g}, ${b}, 0.7)`)
            })
        }
    }, [event.flyer?.asset?.url])

    return (
        <div 
            className="container mx-auto px-4 py-8"
            style={{ backgroundColor: bgColor }}
        >
			<div className="flex flex-col items-center justify-center gap-8 lg:flex-row">
				{/* Flyer Section */}
				<div className="w-full lg:w-1/3">
					{event.flyer?.asset?.url && (
						<div className="relative mx-auto aspect-[3/4] w-full max-w-sm">
							<Image
								src={event.flyer.asset.url}
								alt={event.name}
								fill
								className="rounded-lg object-cover"
								priority
							/>
						</div>
					)}
				</div>

				{/* Event Details Section */}
				<div className="space-y-6 text-center max-md:py-4 lg:w-1/2">
					<h1 className="text-4xl font-bold">{event.name}</h1>

					<div className="text-xl">
						<p>{new Date(event.date).toLocaleDateString()}</p>
						{event.time && (
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
						)}
					</div>

					{event.venue?.metadata?.slug?.current && (
						<Link
							href={`/venues/${event.venue.metadata.slug.current}`}
							className="hover:opacity-70"
						>
							<div className="text-xl">
								<h2 className="font-semibold">{event.venue.name}</h2>
								<p>{event.venue.location}</p>
							</div>
						</Link>
					)}

					{/* Artists Section - Centered */}
					{event.artists && event.artists.length > 0 && (
						<div className="flex justify-center gap-4 overflow-x-auto py-4">
							{event.artists.map(
								(artist) =>
									artist.metadata?.slug?.current && (
										<Link
											key={artist._id}
											href={`/artists/${artist.metadata.slug.current}`}
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

					{/* Ticket CTA - Centered */}
					{event.links && event.links.length > 0 && (
						<div className="text-center">
							<a
								href={event.links[0]}
								target="_blank"
								rel="noopener noreferrer"
								className="bg-primary inline-block rounded-lg px-8 py-3 font-semibold text-white transition-opacity hover:opacity-90"
							>
								Buy Tickets
							</a>
						</div>
					)}
				</div>
			</div>
		</div>
	)

}