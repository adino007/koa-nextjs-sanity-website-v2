import { getSite } from '@/lib/sanity/queries'
import CTA from '@/ui/CTA'
import LinkList from './LinkList'
import { cn } from '@/lib/utils'

export default async function Menu() {
	const { headerMenu } = await getSite()
	return (
		<nav className="max-lg:anim-fade-to-b max-lg:frosted-glass-dark inset-0 z-10 flex gap-y-16 [grid-area:nav] max-lg:fixed max-lg:h-screen max-lg:flex-col max-lg:pt-56 max-lg:text-center max-lg:header-closed:hidden">
			{headerMenu?.items?.map((item, key) => {
				switch (item._type) {
					case 'link':
						return (
							<CTA
								className="max-lg:anim-fade-to-b hover:link lg:px-3"
								link={item}
								key={key}
							/>
						)

					case 'link.list':
						return <LinkList {...item} key={key} />

					default:
						return null
				}
			})}
		</nav>
	)
}
