import { getSite } from '@/lib/sanity/queries'
import CTA from '@/ui/CTA'
import LinkList from './LinkList'

export default async function Menu() {
	const { headerMenu } = await getSite()

	return (
		<nav className="max-md:anim-fade-to-l inset-0 z-50 flex gap-y-16 [grid-area:nav] max-md:fixed max-md:my-4 max-md:mt-28 max-md:h-screen max-md:flex-col max-md:bg-black max-md:bg-opacity-50 max-md:pt-28 max-md:text-center max-md:backdrop-blur-lg max-md:header-closed:hidden">
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
