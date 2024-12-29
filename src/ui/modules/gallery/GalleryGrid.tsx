'use client'

import { Swiper, SwiperSlide } from 'swiper/react'
import {
	A11y,
	HashNavigation,
	Keyboard,
	Navigation,
	Pagination,
} from 'swiper/modules'
import EffectCarousel from '../../swipers/swiper-carousel/effect-carousel.esm.js'
import Image from 'next/image'
import Link from 'next/link'

// Import Swiper styles
import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'
import '../../swipers/swiper-carousel/effect-carousel.css'

interface Props {
	events: Sanity.Event[]
}

function GalleryGrid({ events }: Props) {
	// Filter for gallery-enabled events first
	const galleryEvents = events.filter(
		(event) => 'showInGallery' in event && event.showInGallery,
	)
	// Then sort them by date
	const upcomingEvents = galleryEvents
		.filter((event) => new Date(event.time.start) >= new Date())
		.sort(
			(a, b) =>
				new Date(a.time.start).getTime() - new Date(b.time.start).getTime(),
		)

	const pastEvents = galleryEvents
		.filter((event) => new Date(event.time.start) < new Date())
		.sort(
			(a, b) =>
				new Date(b.time.start).getTime() - new Date(a.time.start).getTime(),
		)

	// Combine upcoming and past events, with upcoming first
	const sortedEvents = [...upcomingEvents, ...pastEvents]

	const swiperConfig = {
		modules: [
			A11y,
			HashNavigation,
			Keyboard,
			Navigation,
			Pagination,
			EffectCarousel,
		],
		slidesPerView: 3 as const,
		centeredSlides: true,
		loop: true,
		effect: 'carousel',
		navigation: {
			nextEl: '.swiper-button-next',
			prevEl: '.swiper-button-prev',
		},
		pagination: {
			el: '.swiper-pagination',
			clickable: true,
			bulletClass: 'swiper-pagination-bullet !bg-white',
		},
		keyboard: { enabled: true },
		hashNavigation: true,
		className: 'h-[75vh] w-full',
	}

	return (
		<div className="container relative mx-auto px-4 pb-12">
			<Swiper {...swiperConfig}>
				{sortedEvents.map((event, index) => (
					<SwiperSlide
						key={event._id}
						className="relative h-full overflow-hidden rounded-xl"
						data-hash={`event-${event._id}`}
					>
						<Link href={`/gallery/${event.metadata.slug.current}`}>
							<Image
								src={
									event?.gallery?.[0]?.asset?.url ||
									event?.flyer?.asset?.url ||
									''
								}
								alt={event.name}
								fill
								className="swiper-carousel-animate-opacity object-cover"
								sizes="(max-width: 768px) 100vw, 80vw"
								priority={index === 0}
							/>
							<div className="absolute inset-0 bg-gradient-to-b from-black/70 via-transparent to-black/70">
								<div className="absolute top-0 w-full p-8 text-center text-white">
									<h3 className="text-4xl font-bold leading-tight">
										{event.name}
									</h3>
									<p className="mt-3 text-xl opacity-90">
										{new Date(event.time.start).toLocaleDateString('en-US', {
											weekday: 'long',
											year: 'numeric',
											month: 'long',
											day: 'numeric',
										})}
									</p>
									{event.venue && (
										<p className="mt-2 text-xl font-medium opacity-90">
											@ {event.venue.name}
										</p>
									)}
								</div>
							</div>
						</Link>
					</SwiperSlide>
				))}
			</Swiper>
			<div className="swiper-pagination absolute bottom-4 z-10 !text-white" />
			<div className="swiper-button-prev !text-white" />
			<div className="swiper-button-next !text-white" />
		</div>
	)
}

export default GalleryGrid
