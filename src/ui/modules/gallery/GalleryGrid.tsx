'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'

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
	const [currentIndex, setCurrentIndex] = useState(0)
	const [direction, setDirection] = useState(0)

	const slideVariants = {
		enter: (direction: number) => ({
			x: direction > 0 ? 1000 : -1000,
			opacity: 0,
			scale: 0.8,
			rotateY: direction > 0 ? 45 : -45,
		}),
		center: {
			x: 0,
			opacity: 1,
			scale: 1,
			rotateY: 0,
			transition: {
				duration: 0.6,
				ease: [0.16, 1, 0.3, 1],
				scale: { duration: 0.4 },
				opacity: { duration: 0.3 },
			},
		},
		exit: (direction: number) => ({
			x: direction < 0 ? 1000 : -1000,
			opacity: 0,
			scale: 0.8,
			rotateY: direction < 0 ? 45 : -45,
		}),
	}

	const swipeConfidenceThreshold = 5000 // Reduced from 10000
	const swipePower = (offset: number, velocity: number) => {
		return Math.abs(offset) * velocity * 1.5 // Added multiplier for increased sensitivity
	}

	const paginate = (newDirection: number) => {
		setDirection(newDirection)
		setCurrentIndex(
			(prevIndex) =>
				(prevIndex + newDirection + sortedEvents.length) % sortedEvents.length,
		)
	}

	useEffect(() => {
		const handleKeyDown = (e: KeyboardEvent) => {
			if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
				e.preventDefault()
				paginate(e.key === 'ArrowLeft' ? -1 : 1)
			}
		}
		window.addEventListener('keydown', handleKeyDown)
		return () => window.removeEventListener('keydown', handleKeyDown)
	}, [])
	useEffect(() => {
		const handleKeyDown = (e: KeyboardEvent) => {
			if (e.key === 'ArrowLeft') paginate(-1)
			if (e.key === 'ArrowRight') paginate(1)
		}
		window.addEventListener('keydown', handleKeyDown)
		return () => window.removeEventListener('keydown', handleKeyDown)
	}, [])

	return (
		<div className="container mx-auto px-4 pb-12 pt-2 select-none">
			<div className="relative h-[75vh] w-full overflow-hidden md:h-[75vh] lg:h-[70vh]">
				{/* Side Preview - Previous */}
				<div className="absolute left-[-25%] top-1/2 z-0 h-[75%] w-[80%] -translate-y-1/2 opacity-30 md:left-[-15%] md:w-[45%]">
					<Image
						src={
							sortedEvents[
								(currentIndex - 1 + sortedEvents.length) % sortedEvents.length
							]?.gallery?.[0]?.asset?.url ||
							sortedEvents[
								(currentIndex - 1 + sortedEvents.length) % sortedEvents.length
							]?.flyer?.asset?.url ||
							''
						}
						alt="Previous event"
						fill
						className="rounded-xl object-cover"
					/>
				</div>

				{/* Main Gallery Card */}
				<AnimatePresence initial={false} custom={direction}>
					<motion.div
						key={currentIndex}
						custom={direction}
						variants={slideVariants}
						initial="enter"
						animate="center"
						exit="exit"
						transition={{
							x: { type: 'spring', stiffness: 300, damping: 30 },
							opacity: { duration: 0.2 },
						}}
						drag="x"
						dragConstraints={{ left: 0, right: 0 }}
						dragElastic={1}
						onDragEnd={(e, { offset, velocity }) => {
							const swipe = swipePower(offset.x, velocity.x)
							if (swipe < -swipeConfidenceThreshold) {
								paginate(1)
							} else if (swipe > swipeConfidenceThreshold) {
								paginate(-1)
							}
						}}
						className="absolute left-[10%] z-10 h-full w-[80%] md:left-[27.5%] md:w-[45%]"
					>
						<Link
							href={`/gallery/${sortedEvents[currentIndex].metadata.slug.current}`}
							className="pointer-events-none relative block h-full w-full md:group-hover:pointer-events-auto"
						>
							<Image
								src={
									sortedEvents[currentIndex]?.gallery?.[0]?.asset?.url ||
									sortedEvents[currentIndex]?.flyer?.asset?.url ||
									''
								}
								alt={sortedEvents[currentIndex].name}
								fill
								className="rounded-xl object-cover object-center"
								sizes="(max-width: 768px) 80vw, 45vw"
							/>
							<div className="absolute inset-0 rounded-xl bg-gradient-to-b from-black/90 from-5% via-transparent via-50% to-black/80">
								<div className="absolute top-0 w-full p-8 text-center text-white">
									<h3 className="text-3xl font-bold leading-tight drop-shadow-lg">
										{sortedEvents[currentIndex].name}
									</h3>
									<p className="mt-2 text-xl leading-relaxed opacity-90 drop-shadow-lg">
										{new Date(
											sortedEvents[currentIndex].time.start,
										).toLocaleDateString()}
									</p>
									{sortedEvents[currentIndex].venue && (
										<p className="mt-1 text-xl leading-relaxed opacity-90 drop-shadow-lg">
											@ {sortedEvents[currentIndex].venue.name}
										</p>
									)}
								</div>
							</div>
						</Link>
					</motion.div>
				</AnimatePresence>

				{/* Side Preview - Next */}
				<div className="absolute right-[-25%] top-1/2 z-0 h-[75%] w-[80%] -translate-y-1/2 opacity-30 md:right-[-15%] md:w-[45%]">
					<Image
						src={
							sortedEvents[(currentIndex + 1) % sortedEvents.length]
								?.gallery?.[0]?.asset?.url ||
							sortedEvents[(currentIndex + 1) % sortedEvents.length]?.flyer
								?.asset?.url ||
							''
						}
						alt="Next event"
						fill
						className="rounded-xl object-cover"
					/>
				</div>

				{/* Navigation Arrows */}
				<button
					onClick={() => paginate(-1)}
					className="absolute left-4 top-1/2 z-20 -translate-y-1/2 rounded-full bg-black/50 p-2 transition-colors hover:bg-black/70"
				>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						fill="none"
						viewBox="0 0 24 24"
						strokeWidth={2}
						stroke="currentColor"
						className="h-6 w-6 text-white"
					>
						<path
							strokeLinecap="round"
							strokeLinejoin="round"
							d="M15.75 19.5L8.25 12l7.5-7.5"
						/>
					</svg>
				</button>

				<button
					onClick={() => paginate(1)}
					className="absolute right-4 top-1/2 z-20 -translate-y-1/2 rounded-full bg-black/50 p-2 transition-colors hover:bg-black/70"
				>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						fill="none"
						viewBox="0 0 24 24"
						strokeWidth={2}
						stroke="currentColor"
						className="h-6 w-6 text-white"
					>
						<path
							strokeLinecap="round"
							strokeLinejoin="round"
							d="M8.25 4.5l7.5 7.5-7.5 7.5"
						/>
					</svg>
				</button>
			</div>
		</div>
	)
}

export default GalleryGrid
