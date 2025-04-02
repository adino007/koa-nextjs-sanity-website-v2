import { PortableText } from '@portabletext/react'
import { cn } from '@/lib/utils'
import { stegaClean } from '@sanity/client/stega'
import RelatedEvents from './event/RelatedEvents'

export default function RelatedEventsModule({
	title,
	description,
	currentEventId,
	textAlign = 'center',
}: Partial<{
	title: string
	description: any
	currentEventId: string
	textAlign: React.CSSProperties['textAlign']
}>) {
	if (!currentEventId) return null

	return (
		<section className="section">
			<div
				className={cn('richtext', {
					'text-left': stegaClean(textAlign) === 'left',
					'text-center': stegaClean(textAlign) === 'center',
					'text-right': stegaClean(textAlign) === 'right',
				})}
			>
				{title && <h2 className="text-balance">{title}</h2>}
				{description && <PortableText value={description} />}
				<RelatedEvents currentEventId={currentEventId} />
			</div>
		</section>
	)
}
