import { RelatedEventsModule } from './RelatedEventsModule'
import { TestimonialListModule } from './TestimonialListModule'
import { ContactFormModule } from './ContactFormModule'

interface ModuleProps {
	_type: string
	[key: string]: any
}

export function ModuleComponent({ module }: { module: ModuleProps }) {
	const Component = moduleResolver[module._type]
	if (!Component) return null
	return <Component {...module} />
}

export const moduleResolver: { [key: string]: React.ComponentType<any> } = {
	testimonialList: TestimonialListModule,
	contactForm: ContactFormModule,
	relatedEvents: RelatedEventsModule,
}
