import { cn } from '@/lib/utils'
import InteractiveDetails from './InteractiveDetails'
import CTA from '@/ui/CTA'
import ActiveLink from './ActiveLink'
import { CgChevronRight } from 'react-icons/cg'

export default function LinkList({ link, links }: Sanity.LinkList) {
	return (
		<InteractiveDetails className="group relative" closeAfterNavigate>
			<ActiveLink path={link.internal?.metadata?.slug?.current}>
				<summary className="flex items-center gap-1 md:px-3">
					{link.label}
					<CgChevronRight className="transition-transform group-open:rotate-90 md:rotate-90" />
				</summary>
			</ActiveLink>

			<ul className="anim-fade-to-b left-0 top-full px-3 py-2 max-md:border-l md:absolute md:min-w-max md:rounded md:border md:bg-canvas md:shadow-md">
				{links?.map((link, key) => (
					<li key={key}>
						<ActiveLink path={link.internal?.metadata?.slug?.current}>
							<CTA
								className={cn(
									'hover:link inline-block py-px',
									link.external?.startsWith('http') && 'is-external',
								)}
								link={link}
							/>
						</ActiveLink>
					</li>
				))}
			</ul>
		</InteractiveDetails>
	)
}
