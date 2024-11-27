'use client'

import Image from 'next/image'
import Link from 'next/link'

export default function VenuesPlayed({ venues }: { venues: any[] }) {
    return (
        <div className="space-y-4 pt-12">
            <h2 className="text-2xl font-semibold">Venues Played</h2>
            <div className="flex flex-wrap justify-center gap-4">
                {venues.map((venue) => (
                    <Link
                        key={`venue-${venue._id}`}
                        href={venue?.metadata?.slug?.current ? `/venue/${venue.metadata.slug.current}` : '#'}
                        className="flex w-24 flex-col items-center justify-center text-center transition-none group/venue"
                    >
                        {venue.photo?.asset?.url && (
                            <div className="relative mx-auto mb-1 h-16 w-16 transition-transform duration-300 group-hover/venue:scale-110">
                                <Image
                                    src={venue.photo.asset.url}
                                    alt={venue.name}
                                    fill
                                    className="rounded-lg object-cover"
                                />
                            </div>
                        )}
                        <span className="pt-2 text-sm leading-5 group-hover/venue:text-blue-400">
                            {venue.name}
                        </span>
                    </Link>
                ))}
            </div>
        </div>
    )
}
