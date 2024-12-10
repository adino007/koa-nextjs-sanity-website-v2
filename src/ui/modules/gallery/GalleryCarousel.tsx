'use client'

import { useEffect, useState } from 'react'
import { FaDownload, FaShare } from 'react-icons/fa6'
import Image from 'next/image'
import { IoClose } from 'react-icons/io5'
import {
	Carousel,
	CarouselContent,
	CarouselItem,
	CarouselNext,
	CarouselPrevious,
} from '@/components/ui/carousel'

export default function GalleryCarousel({ gallery }: { gallery: any[] }) {
	const [fullscreen, setFullscreen] = useState(false)
	const [currentIndex, setCurrentIndex] = useState(0)
	const [mainApi, setMainApi] = useState<any>(null)
	const [fullscreenApi, setFullscreenApi] = useState<any>(null)

	useEffect(() => {
		if (!mainApi) return

		mainApi.on('select', () => {
			setCurrentIndex(mainApi.selectedScrollSnap())
		})
	}, [mainApi])

	useEffect(() => {
		if (fullscreen && fullscreenApi) {
			fullscreenApi.scrollTo(currentIndex)
		}
	}, [fullscreen, fullscreenApi, currentIndex])

	useEffect(() => {
		const toggleScroll = (disable: boolean) => {
			document.body.style.overflow = disable ? 'hidden' : 'auto'
		}

		toggleScroll(fullscreen)

		return () => {
			toggleScroll(false)
		}
	}, [fullscreen])

	const handleDownload = async (imageUrl: string) => {
		const response = await fetch(imageUrl)
		const blob = await response.blob()
		const url = window.URL.createObjectURL(blob)
		const link = document.createElement('a')
		link.href = url
		link.download = 'image.jpg'
		document.body.appendChild(link)
		link.click()
		document.body.removeChild(link)
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
				// User cancelled the share
				return
			}
			console.error('Error sharing:', error)
			alert('Failed to share. Please try again.')
		}
	}

	return (
		<>
			{/* Regular Carousel */}
			<div className="relative">
				<Carousel
					className="relative w-full justify-center"
					setApi={setMainApi}
				>
					<CarouselContent>
						{gallery.map((image, index) => (
							<CarouselItem key={index} className="w-full">
								<div
									className="cursor-pointer px-2"
									onClick={() => {
										setCurrentIndex(index)
										setFullscreen(true)
									}}
								>
									<div className="relative aspect-square">
										<Image
											src={image.asset.url}
											alt={`Gallery image ${index + 1}`}
											fill
											className="rounded-lg object-cover"
										/>
									</div>
									<span className="mt-2 block pt-2 text-center text-xs text-gray-400">
										tap the image for fullscreen mode
									</span>
								</div>
							</CarouselItem>
						))}
					</CarouselContent>
					{/* Previous Button */}
					<div className="absolute -left-16 top-1/2 z-10 -translate-y-1/2 max-md:relative max-md:top-auto max-md:mt-[7%] max-md:flex max-md:-translate-y-0 max-md:justify-center lg:-left-8">
						<CarouselPrevious />
					</div>

					{/* Next Button */}
					<div className="absolute -right-16 top-1/2 z-10 -translate-y-1/2 max-md:relative max-md:top-auto max-md:mt-[7%] max-md:flex max-md:-translate-y-0 max-md:justify-center lg:-right-5">
						<CarouselNext />
					</div>
				</Carousel>
			</div>

			{/* Fullscreen Modal */}
			{fullscreen && (
				<div className="fixed inset-0 z-[9999] bg-almostBlack !px-0 pb-16">
					<button
						onClick={() => setFullscreen(false)}
						className="absolute right-4 top-4 z-50 text-4xl text-white hover:text-gray-300"
					>
						<IoClose />
					</button>

					<div style={{ height: 'calc(100vh - 80px)', marginTop: '40px' }}>
						<Carousel
							className="flex h-full w-screen items-center"
							setApi={setFullscreenApi}
						>
							<CarouselContent className="h-full !p-0">
								{gallery.map((image, index) => (
									<CarouselItem
										key={index}
										className="flex h-full w-full items-center justify-center !px-0"
									>
										<div className="relative h-[100vh] w-[100vw] items-center justify-center">
											<Image
												src={image.asset.url}
												alt={`Gallery image ${index + 1}`}
												fill
												priority
												sizes="90vw"
												className="object-contain"
											/>
										</div>
									</CarouselItem>
								))}
							</CarouselContent>
							<div className="absolute left-4 top-1/2 z-[60] -translate-y-1/2 max-md:absolute max-md:bottom-28 max-md:left-[15%] max-md:top-auto">
								<CarouselPrevious className="bg-black/80" />
							</div>

							<div className="hidden max-md:absolute max-md:bottom-[5.9rem] max-md:left-1/2 max-md:z-[60] max-md:flex max-md:-translate-x-1/2 max-md:gap-4">
								<button
									onClick={() =>
										handleDownload(gallery[currentIndex].asset.url)
									}
									className="rounded-full bg-black/80 p-3 ring-1 ring-white"
								>
									<FaDownload className="text-white" />
								</button>
								<button
									onClick={() => handleShare(gallery[currentIndex].asset.url)}
									className="rounded-full bg-black/80 p-3 ring-1 ring-white"
								>
									<FaShare className="text-white" />
								</button>
							</div>
							<div className="absolute right-10 top-1/2 z-[60] -translate-y-1/2 max-md:absolute max-md:bottom-28 max-md:right-[20%] max-md:top-auto">
								<CarouselNext className="bg-black/30" />
							</div>
						</Carousel>
					</div>
				</div>
			)}
		</>
	)
}
