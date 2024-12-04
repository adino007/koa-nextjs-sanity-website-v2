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
				<Carousel className="relative w-full">
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

					<CarouselPrevious className="absolute -left-6 md:-left-10" />
					<CarouselNext className="absolute -right-6 md:-right-10" />
				</Carousel>
			</div>

			{/* Fullscreen Modal */}
			{fullscreen && (
				<div className="fixed inset-0 z-[9999] bg-black">
					<button
						onClick={() => setFullscreen(false)}
						className="absolute right-4 top-4 z-50 text-4xl text-white hover:text-gray-300"
					>
						<IoClose />
					</button>

					<div style={{ height: 'calc(100vh - 80px)', marginTop: '40px' }}>
						<Carousel className="h-full">
							<CarouselContent>
								{gallery.map((image, index) => (
									<CarouselItem
										key={index}
										className="flex h-full items-center justify-center"
									>
										<div className="relative h-[100vh] w-[100vw]">
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
							<CarouselPrevious className="left-6" />
							<CarouselNext className="right-6" />
						</Carousel>
					</div>
				</div>
			)}
		</>
	)
}
