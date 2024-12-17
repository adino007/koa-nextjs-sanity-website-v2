import { PortableText } from '@portabletext/react'
import Pretitle from '@/ui/Pretitle'
import Reputation from '@/ui/Reputation'
import CTAList from '@/ui/CTAList'
import Img from '@/ui/Img'
import { cn } from '@/lib/utils'

export default function HeroSplit({
	pretitle,
	content,
	ctas,
	reputation,
	image,
}: Partial<{
	pretitle: string
	content: any
	ctas: Sanity.CTA[]
	reputation: Sanity.Reputation
	image: Sanity.Image & {
		onRight?: boolean
		onBottom?: boolean
	}
}>) {
	return (
		<section className="section grid items-center gap-8 md:grid-cols-2 md:gap-x-12">
			<figure
				className={cn(
					'max-md:full-bleed px-6 md:px-0',
					image?.onRight && 'md:order-1',
					image?.onBottom && 'max-md:order-last',
				)}
			>
				<Img image={image} imageWidth={1200} className="-mt-8 rounded-xl" />
			</figure>
			<div className="richtext mx-auto w-full max-w-lg px-2 [&_:is(h1,h2)]:text-balance">
				<Pretitle>{pretitle}</Pretitle>
				<PortableText value={content} />
				<Reputation className="!mt-4" reputation={reputation} />
				<CTAList ctas={ctas} className="!mt-4" />
			</div>
		</section>
	)
}
