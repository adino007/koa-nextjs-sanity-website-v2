'use client'

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
								</div>
							</CarouselItem>
						))}
					</CarouselContent>

					<div className="absolute -left-16 top-1/2 z-10 -ml-4 -translate-y-1/2 max-md:relative max-md:top-auto max-md:mt-[10%] max-md:flex max-md:-translate-y-0 max-md:justify-center lg:-left-5">
						<CarouselPrevious />
					</div>
					<div className="absolute -right-16 top-1/2 z-10 -translate-y-1/2 max-md:relative max-md:top-auto max-md:mt-[10%] max-md:flex max-md:-translate-y-0 max-md:justify-center lg:-right-2">
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

							<div className="absolute left-4 top-1/2 z-[60] -translate-y-1/2 max-md:absolute max-md:bottom-24 max-md:left-[14%] max-md:top-auto lg:left-10">
								<CarouselPrevious />
							</div>
							<div className="absolute right-4 top-1/2 z-[60] -translate-y-1/2 max-md:absolute max-md:bottom-24 max-md:right-[20%] max-md:top-auto lg:right-16">
								<CarouselNext />
							</div>
						</Carousel>
					</div>
				</div>
			)}
		</>
	)
}
