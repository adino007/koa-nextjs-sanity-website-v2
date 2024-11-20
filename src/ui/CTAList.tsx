import { cn } from '@/lib/utils'
import CTA from './CTA'

export default function CTAList({
	ctas,
	className,
	...props
}: {
	ctas?: Sanity.CTA[]
} & React.ComponentProps<'div'>) {
	if (!ctas?.length) return null

	const visibleCtas = ctas.filter((cta) => cta.showCTA)
	if (!visibleCtas.length) return null

	return (
		<div
			className={cn(
				'flex flex-wrap items-center justify-center gap-[.5em]',
				className,
			)}
			role="navigation"
			aria-label="Call to action links"
			{...props}
		>
			{visibleCtas.map((cta, key) => (
				<CTA key={key} {...cta} />
			))}
		</div>
	)
}
