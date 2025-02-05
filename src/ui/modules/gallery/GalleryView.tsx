'use client'

import { useState, useEffect } from 'react'
import { Swiper, SwiperSlide } from 'swiper/react'
import { A11y, Keyboard, Navigation } from 'swiper/modules'
import EffectCarousel from '../../swipers/swiper-carousel/effect-carousel.esm.js'
import Image from 'next/image'
import { IoClose } from 'react-icons/io5'
import { FaDownload, FaShare } from 'react-icons/fa6'

import 'swiper/css'
import 'swiper/css/navigation'
import '../../swipers/swiper-carousel/effect-carousel.css'

export default function GalleryView({ event }: { event: any }) {
	const [fullscreen, setFullscreen] = useState(false)
	const [currentIndex, setCurrentIndex] = useState(0)
	const photos = event?.gallery || []

	useEffect(() => {
		if (fullscreen) {
			document.body.style.overflow = 'hidden'
			document.documentElement.style.overflow = 'hidden'
		} else {
			document.body.style.overflow = ''
			document.documentElement.style.overflow = ''
		}
		return () => {
			document.body.style.overflow = ''
			document.documentElement.style.overflow = ''
		}
	}, [fullscreen])

	if (!photos.length) {
		return (
			<div className="container mx-auto px-4 py-12 text-center">
				<h1 className="mb-4 text-4xl font-bold">{event?.name || 'Gallery'}</h1>
				<p className="text-gray-600">No photos available for this event yet.</p>
			</div>
		)
	}

	const swiperConfig = {
		modules: [A11y, Keyboard, Navigation, EffectCarousel],
		slidesPerView: 1.2,
		breakpoints: {
			768: {
				slidesPerView: 1.5,
			},
		},
		centeredSlides: true,
		loop: true,
		effect: 'carousel',
		speed: 500,
		navigation: {
			nextEl: '.swiper-button-next',
			prevEl: '.swiper-button-prev',
		},
		keyboard: { enabled: true },
		className: 'h-[65vh] w-full',
		slideActiveClass: 'swiper-slide-active',
	}

	const fullscreenSwiperConfig = {
		...swiperConfig,
		slidesPerView: 1,
		breakpoints: {},
		centeredSlides: true,
		initialSlide: currentIndex,
		className: 'h-full w-screen',
	}

	const handleDownload = async (imageUrl: string) => {
		try {
			const response = await fetch(imageUrl)
			if (!response.ok) throw new Error('Failed to fetch image')
			const blob = await response.blob()
			const url = window.URL.createObjectURL(blob)
			const link = document.createElement('a')
			link.href = url
			link.download = 'image.jpg'
			document.body.appendChild(link)
			link.click()
			document.body.removeChild(link)
			window.URL.revokeObjectURL(url)
		} catch (error) {
			console.error('Download failed:', error)
			alert('Failed to download image. Please try again.')
		}
	}

	const handleShare = async (imageUrl: string) => {
		try {
			if (navigator.canShare && navigator.canShare({ url: imageUrl })) {
				await navigator.share({
					title: 'Check out this image',
					text: 'Take a look at this image!',
					url: imageUrl,
				})
			} else if (navigator.clipboard) {
				await navigator.clipboard.writeText(imageUrl)
				alert('Image URL copied to clipboard!')
			} else {
				alert('Sharing not supported on this device')
			}
		} catch (error: unknown) {
			if (error instanceof Error && error.name === 'AbortError') {
				return
			}
			console.error('Error sharing:', error)
			alert('Failed to share. Please try again.')
		}
	}

	return (
		<>
			<div className="container relative mx-auto mt-2 px-4 pb-12">
				<h1 className="mb-8 text-center text-4xl font-bold">{event?.name}</h1>
				<Swiper {...swiperConfig}>
					{photos.map((photo: any, index: number) =>
						photo?.asset?.url ? (
							<SwiperSlide
								key={index}
								className="group relative h-full cursor-pointer overflow-hidden rounded-xl"
								onClick={() => {
									setCurrentIndex(index)
									setFullscreen(true)
								}}
							>
								<div
									className={`pointer-events-none group-[.swiper-slide-active]:pointer-events-auto`}
								>
									<div className="blurred-overlay group-[.swiper-slide-active]:-webkit-backdrop-filter-none absolute inset-0 z-10 group-[.swiper-slide-active]:backdrop-blur-none" />
									<Image
										src={photo.asset.url}
										alt={`Event photo ${index + 1}`}
										fill
										className="object-cover"
										sizes="(max-width: 768px) 100vw, 80vw"
										priority={index === 0}
									/>
									<div className="absolute inset-0 bg-gradient-to-b from-black/70 via-transparent to-black/70">
										<div className="absolute bottom-0 hidden w-full bg-black/30 p-2 text-center text-white backdrop-blur-sm group-[.swiper-slide-active]:block">
											<span className="text-xs">
												tap the image for fullscreen mode
											</span>
										</div>
									</div>
								</div>
							</SwiperSlide>
						) : null,
					)}
				</Swiper>
				<div className="swiper-button-prev !text-white" />
				<div className="swiper-button-next !text-white" />
			</div>
			{fullscreen && (
				<div className="fixed inset-0 z-[9999] bg-almostBlack !px-0 pb-16">
					<button
						onClick={() => setFullscreen(false)}
						className="absolute right-4 top-4 z-50 text-4xl text-white hover:text-gray-300"
					>
						<IoClose />
					</button>

					<div style={{ height: 'calc(100vh - 80px)', marginTop: '40px' }}>
						<Swiper
							{...fullscreenSwiperConfig}
							onSlideChange={(swiper) => setCurrentIndex(swiper.realIndex)}
							className="flex h-full w-screen items-center"
						>
							{photos.map((photo: any, index: number) => (
								<SwiperSlide
									key={index}
									className="flex h-full w-full items-center justify-center"
								>
									<div className="relative h-[100vh] w-[100vw] items-center justify-center">
										<div 
											className={`absolute inset-0 z-10 transition-all duration-300 ease-in-out
											${fullscreen ? 'backdrop-blur-0' : 'backdrop-blur-[4px] group-[.swiper-slide-active]:backdrop-blur-0'}`} 
										/>
										{photo?.asset?.url && (
											<Image
												src={photo.asset.url}
												alt={`Event photo ${index + 1}`}
												fill
												priority={index === currentIndex}
												sizes="100vw"
												className="swiper-carousel-animate-opacity object-contain transition-opacity duration-300"
											/>
										)}
									</div>
								</SwiperSlide>
							))}
						</Swiper>

						<div className="absolute left-4 top-1/2 z-[60] -translate-y-1/2 max-md:absolute max-md:bottom-28 max-md:left-[15%] max-md:top-auto">
							<div className="swiper-button-prev !h-12 !w-12 bg-black/80 !text-white after:!text-2xl" />
						</div>

						<div className="absolute bottom-[5.9rem] left-1/2 z-[60] flex -translate-x-1/2 gap-4">
							<button
								onClick={() => handleDownload(photos[currentIndex].asset.url)}
								className="rounded-full bg-black/80 p-3 ring-1 ring-white"
							>
								<FaDownload className="text-white" />
							</button>
							<button
								onClick={() => handleShare(photos[currentIndex].asset.url)}
								className="rounded-full bg-black/80 p-3 ring-1 ring-white"
							>
								<FaShare className="text-white" />
							</button>
						</div>

						<div className="absolute right-10 top-1/2 z-[60] -translate-y-1/2 max-md:absolute max-md:bottom-28 max-md:right-[20%] max-md:top-auto">
							<div className="swiper-button-next !h-12 !w-12 bg-black/80 !text-white after:!text-2xl" />
						</div>
					</div>
				</div>
			)}
		</>
	)
}
