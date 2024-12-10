'use client'

import { FaDownload, FaShare } from 'react-icons/fa6'
import { useEffect, useState } from 'react'
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

	useEffect(() => {
		if (fullscreen) {
			document.body.style.overflow = 'hidden'
		} else {
			document.body.style.overflow = 'unset'
		}
		return () => {
			document.body.style.overflow = 'unset'
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
		if (navigator.share) {
			try {
				await navigator.share({
					title: 'Check out this image',
					url: imageUrl,
				})
			} catch (error) {
				console.log('Error sharing:', error)
			}
		}
	}

	return (
		<>
			{/* Regular Carousel */}
			<div className="relative">
				<Carousel className="relative w-full justify-center">
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
						<Carousel className="flex h-full w-screen items-center">
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

							<div className="absolute left-4 top-1/2 z-[60] -translate-y-1/2 max-md:absolute max-md:bottom-28 max-md:left-[20%] max-md:top-auto">
								<CarouselPrevious />
							</div>

							<div className="hidden max-md:absolute max-md:bottom-24 max-md:left-1/2 max-md:z-[60] max-md:flex max-md:-translate-x-1/2 max-md:gap-4">
								<button
									onClick={() =>
										handleDownload(gallery[currentIndex].asset.url)
									}
									className="rounded-full bg-white/10 p-3 hover:bg-white/20"
								>
									<FaDownload className="text-white" />
								</button>
								<button
									onClick={() => handleShare(gallery[currentIndex].asset.url)}
									className="rounded-full bg-white/10 p-3 hover:bg-white/20"
								>
									<FaShare className="text-white" />
								</button>
							</div>
							<div className="absolute right-10 top-1/2 z-[60] -translate-y-1/2 max-md:absolute max-md:bottom-28 max-md:right-[20%] max-md:top-auto">
								<CarouselNext />
							</div>
						</Carousel>
					</div>
				</div>
			)}
		</>
	)
}
