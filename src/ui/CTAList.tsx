import { cn } from '@/lib/utils'
import CTA from './CTA'

export default function CTAList({
	ctas,
	className,
}: {
	ctas?: Sanity.CTA[]
} & React.ComponentProps<'div'>) {
	if (!ctas?.length) return null

	return (
		<div className={cn('flex flex-wrap items-center gap-[.5em]', className)}>
			{ctas
				?.filter((cta) => cta.showCTA)
				.map((cta, key) => <CTA key={key} {...cta} />)}
		</div>
	)
}
