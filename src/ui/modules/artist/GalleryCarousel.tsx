'use client'

import { useState } from 'react'
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

	return (
		<>
			{/* Regular Carousel */}
			<div className="relative" data-debug="outer-container">
				<Carousel className="relative w-full" data-debug="carousel">
					<CarouselContent className="relative" data-debug="carousel-content">
						{gallery.map((image, index) => (
							<CarouselItem key={index} className="w-full" data-debug="carousel-item">
								<div
									className="cursor-pointer px-1"
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
					<CarouselPrevious data-debug="prev-button" />
					<CarouselNext data-debug="next-button" />
				</Carousel>
			</div>
			{/* Fullscreen Modal */}
			{fullscreen && (
				<div className="fixed inset-0 z-50 bg-black">
					<button
						onClick={() => setFullscreen(false)}
						className="absolute right-4 top-4 z-50 text-4xl text-white hover:text-gray-300"
					>
						<IoClose />
					</button>

					<Carousel className="h-full">
						<CarouselContent>
							{gallery.map((image, index) => (
								<CarouselItem key={index} className="h-full">
									<div className="relative h-full">
										<Image
											src={image.asset.url}
											alt={`Gallery image ${index + 1}`}
											fill
											className="object-contain"
										/>
									</div>
								</CarouselItem>
							))}
						</CarouselContent>
						<CarouselPrevious className="left-4" />
						<CarouselNext className="right-4" />
					</Carousel>
				</div>
			)}
		</>
	)
}
