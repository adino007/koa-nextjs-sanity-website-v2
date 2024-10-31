'use client'

import Image from 'next/image'

export default function ArtistContent({ artist }: { artist: Sanity.Artist }) {
	return (
		<div className="container mx-auto bg-transparent px-4 py-8 transition-colors duration-500">
			<div className="flex flex-col items-center justify-center gap-8 lg:flex-row">
				<div className="w-full lg:w-1/3">
					{artist.photo?.asset?.url && (
						<div className="relative mx-auto aspect-square w-full max-w-sm">
							<Image
								src={artist.photo.asset.url}
								alt={artist.name}
								fill
								className="rounded-lg object-cover"
								priority
							/>
						</div>
					)}
				</div>

				<div className="space-y-6 text-center max-md:py-4 lg:w-1/2">
					<h1 className="text-4xl font-bold">{artist.name}</h1>

					{artist.bio && (
						<div className="text-xl">
							<p>{artist.bio}</p>
						</div>
					)}

					{artist.socialLinks && artist.socialLinks.length > 0 && (
						<div className="flex justify-center gap-4">
							{artist.socialLinks.map((link, index) => (
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

					{artist.upcomingEvents && artist.upcomingEvents.length > 0 && (
						<div className="space-y-2">
							<h2 className="text-2xl font-semibold">Upcoming Events</h2>
							{artist.upcomingEvents.map((event) => (
								<div key={event._id}>
									<p>{event.name}</p>
									<p>{new Date(event.date).toLocaleDateString()}</p>
									<p>{event.venue.name}</p>
								</div>
							))}
						</div>
					)}
				</div>
			</div>
		</div>
	)
}
