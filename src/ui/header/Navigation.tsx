import { getSite } from '@/lib/sanity/queries'
import CTA from '@/ui/CTA'
import LinkList from './LinkList'
import { cn } from '@/lib/utils'

export default async function Menu() {
	const { headerMenu } = await getSite()
	return (
		<nav className="max-md:anim-fade-to-b max-md:frosted-glass-dark inset-0 z-10 flex gap-y-16 [grid-area:nav] max-md:fixed max-md:h-screen max-md:flex-col max-md:pt-56 max-md:text-center max-md:header-closed:hidden">
			{headerMenu?.items?.map((item, key) => {
				switch (item._type) {
					case 'link':
						return (
							<CTA
								className="max-md:anim-fade-to-b hover:link md:px-3"
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
