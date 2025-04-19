import { getSite } from '@/lib/sanity/queries'
import CTA from '@/ui/CTA'
import LinkList from './LinkList'
import ActiveLink from './ActiveLink'

export default async function Menu() {
	const { headerMenu } = await getSite()

	return (
		<nav className="max-lg:anim-fade-to-b inset-0 z-10 flex gap-y-16 [grid-area:nav] max-lg:fixed max-lg:h-screen max-lg:flex-col max-lg:pt-56 max-lg:text-center max-lg:frosted-glass-dark max-lg:header-closed:hidden">
			{headerMenu?.items?.map((item, key) => {
				switch (item._type) {
					case 'link':
						return (
							<ActiveLink
								key={key}
								path={item.internal?.metadata?.slug?.current}
							>
								<CTA
									className="max-lg:anim-fade-to-b hover:link lg:px-3"
									link={item}
								/>
							</ActiveLink>
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
