'use client'

import Image from 'next/image'

export default function VenueContent({ venue }: { venue: Sanity.Venue }) {
    return (
        <div className="container mx-auto bg-transparent px-4 py-8 transition-colors duration-500">
            <div className="flex flex-col items-center justify-center gap-8 lg:flex-row">
                <div className="w-full lg:w-1/3">
                    {venue.image?.asset?.url && (
                        <div className="sticky top-24 relative mx-auto aspect-square w-full max-w-sm">
                            <Image
                                src={venue.image.asset.url}
                                alt={venue.name}
                                fill
                                className="rounded-lg object-cover"
                                priority
                            />
                        </div>
                    )}
                </div>

                <div className="space-y-6 text-center lg:w-1/2">
                    <h1 className="text-4xl font-bold">{venue.name}</h1>
                    <p className="text-xl">{venue.location}</p>

                    {venue.description && (
                        <div className="text-xl">
                            <p>{venue.description}</p>
                        </div>
                    )}

                    {(venue as any).socialLinks && (venue as any).socialLinks.length > 0 && (
                        <div className="flex justify-center gap-4">
                            {(venue as any).socialLinks.map((link: any, index: number) => (
                                <a
                                    key={index}
                                    href={link.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="hover:opacity-70"
                                >
                                    {link.platform}
                                </a>
                            ))}
                        </div>
                    )}

                    {venue.upcomingEvents && venue.upcomingEvents.length > 0 && (
                        <div className="space-y-2">
                            <h2 className="text-2xl font-semibold">Upcoming Events</h2>
                            {venue.upcomingEvents.map((event) => (
                                <div key={event._id}>
                                    <p>{event.name}</p>
                                    <p>{new Date(event.date).toLocaleDateString()}</p>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
