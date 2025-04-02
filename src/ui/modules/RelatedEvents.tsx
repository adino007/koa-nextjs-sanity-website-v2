import { RelatedEvents } from '@/components/RelatedEvents'
import { Section } from '@/components/ui/Section'
import { PortableText } from '@portabletext/react'

interface RelatedEventsModuleProps {
	title?: string
	description?: any
	currentEventId?: string
	maxEvents?: number
}

export default function RelatedEventsModule({
	title,
	description,
	currentEventId,
	maxEvents = 6,
}: RelatedEventsModuleProps) {
	return (
		<Section>
			<div className="container mx-auto px-4">
				{(title || description) && (
					<div className="mb-8 text-center">
						{title && (
							<h2 className="mb-4 text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
								{title}
							</h2>
						)}
						{description && (
							<div className="prose prose-lg mx-auto text-gray-600 dark:text-gray-300">
								<PortableText value={description} />
							</div>
						)}
					</div>
				)}
				<RelatedEvents currentEventId={currentEventId} maxEvents={maxEvents} />
			</div>
		</Section>
	)
}
