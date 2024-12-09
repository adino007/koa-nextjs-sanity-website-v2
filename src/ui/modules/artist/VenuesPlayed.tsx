'use client'

import Image from 'next/image'
import Link from 'next/link'

type VenuePlayedProps = Pick<
	Sanity.Venue,
	'_id' | 'name' | 'location' | 'image' | 'metadata'
>

export default function VenuesPlayed({
	venues,
}: {
	venues: VenuePlayedProps[]
}) {
	// Remove duplicates by venue ID if any slip through
	const uniqueVenues = venues.filter(
		(venue, index, self) =>
			index === self.findIndex((v) => v._id === venue._id),
	)

	return (
		<div className="mt-6">
			<h2 className="mb-2 text-xl font-semibold">Venues Played</h2>
			<div className="flex flex-wrap items-start justify-center gap-10 pt-2 lg:gap-12">
				{uniqueVenues.map((venue) => (
					<Link
						key={venue._id}
						href={`/venue/${venue.metadata?.slug?.current}`}
						className="lg:w-18 group flex w-20 flex-col items-center justify-start text-center"
					>
						<div className="lg:h-18 lg:w-18 relative mx-auto mb-1 h-20 w-20 transform transition-all duration-300 group-hover:scale-110">
							{venue.image?.asset?.url && (
								<Image
									src={venue.image.asset.url}
									alt={venue.name}
									fill
									className="rounded-full object-cover"
								/>
							)}
						</div>
						<span className="pt-3 text-sm leading-4 transition-colors duration-300 group-hover:text-blue-400">
							{venue.name}
						</span>
					</Link>
				))}
			</div>
		</div>
	)
}
