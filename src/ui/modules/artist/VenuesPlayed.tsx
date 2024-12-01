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
	return (
		<div className="mt-5">
			<h2 className="mb-2 text-lg font-semibold">Venues Played</h2>
			<div className="flex flex-wrap items-start justify-center gap-8">
				{venues.map((venue) => (
					<Link
						key={venue._id}
						href={`/venue/${venue.metadata?.slug?.current}`}
						className="group flex w-14 flex-col items-center justify-start text-center"
					>
						<div className="relative mx-auto mb-1 h-14 w-14 transform transition-all duration-300 group-hover:scale-110">
							{venue.image?.asset?.url && (
								<Image
									src={venue.image.asset.url}
									alt={venue.name}
									fill
									className="rounded-full object-cover"
								/>
							)}
						</div>
						<span className="pt-1 text-[11px] leading-4 transition-colors duration-300 group-hover:text-blue-400">
							{venue.name}
						</span>
					</Link>
				))}
			</div>
		</div>
	)
}
