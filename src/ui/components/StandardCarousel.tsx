'use client'

import {
	Carousel,
	CarouselContent,
	CarouselItem,
	CarouselNext,
	CarouselPrevious,
} from '@/components/ui/carousel'

export default function StandardCarousel({
	children,
	setApi,
}: {
	children: React.ReactNode
	setApi?: (api: any) => void
}) {
	return (
		<div className="container mx-auto w-full max-w-[100vw] !overflow-visible md:max-w-5xl">
			<Carousel className="relative w-full !overflow-visible" setApi={setApi}>
				<CarouselContent className="!overflow-visible">
					{children}
				</CarouselContent>
				<div className="mt-8 flex items-center justify-center gap-8">
					<div className="relative w-6">
						<CarouselPrevious className="!-left-0" />
					</div>
					<span className="block text-center text-xs text-gray-400">
						swipe through events
					</span>
					<div className="relative w-6">
						<CarouselNext className="!-right-0" />
					</div>
				</div>
			</Carousel>
		</div>
	)
}
