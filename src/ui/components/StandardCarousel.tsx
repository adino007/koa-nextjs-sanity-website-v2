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
		<div className="w-full pb-8">
			<Carousel
				opts={{
					align: "start",
					loop: true,
					containScroll: "trimSnaps",
					duration: 20,
					dragFree: false,
					skipSnaps: false
				}}
				setApi={setApi}
			>
				<CarouselContent>{children}</CarouselContent>
				<div className="flex items-center justify-center gap-8 pt-2">
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
