'use client'

import { Swiper, SwiperSlide } from 'swiper/react'
import { A11y, Keyboard, Navigation, Pagination } from 'swiper/modules'
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
		modules: [A11y, Keyboard, Navigation, Pagination, EffectCarousel],
		slidesPerView: 1.5 as const,
		centeredSlides: true,
		loop: true,
		effect: 'carousel',
		speed: 500,
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
		className: 'h-[75vh] w-full',
		slideActiveClass: 'swiper-slide-active',
	}
	return (
		<div className="container relative mx-auto px-4 pb-12">
			<Swiper {...swiperConfig}>
				{sortedEvents.map((event, index) => (
					<SwiperSlide
						key={event._id}
						className="group relative h-full cursor-pointer overflow-hidden rounded-xl group-[.swiper-slide-active]:backdrop-blur-sm"
						onClick={(e) => {
							const target = e.currentTarget
							if (!target.classList.contains('swiper-slide-active')) {
								const swiperContainer = e.currentTarget.closest(
									'.swiper',
								) as HTMLElement
								const swiperInstance = (swiperContainer as any).swiper

								if (target.classList.contains('swiper-slide-next')) {
									swiperInstance?.slideNext()
								} else if (target.classList.contains('swiper-slide-prev')) {
									swiperInstance?.slidePrev()
								}
							}
						}}
					>
						<div
							className={`pointer-events-none group-[.swiper-slide-active]:pointer-events-auto`}
						>
							<Link href={`/gallery/${event.metadata.slug.current}`}>
								<div className="absolute inset-0 z-10 backdrop-blur-[4px] group-[.swiper-slide-active]:backdrop-blur-[none]" />
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
								<div className="swiper-carousel-animate-opacity absolute inset-0 bg-gradient-to-b from-black/70 via-transparent to-black/70">
									<div className="absolute top-0 w-full p-8 text-center text-white">
										<h3 className="text-4xl font-bold leading-tight max-md:text-3xl">
											{event.name}
										</h3>
										<p className="text-md mt-3 opacity-90">
											{new Date(event.time.start).toLocaleDateString('en-US', {
												weekday: 'long',
												year: 'numeric',
												month: 'long',
												day: 'numeric',
											})}
										</p>
										{/* {event.venue && (
											<p className="mt-2 text-xl font-medium opacity-90">
												@ {event.venue.name}
											</p>
										)} */}
									</div>
								</div>
							</Link>
						</div>
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
