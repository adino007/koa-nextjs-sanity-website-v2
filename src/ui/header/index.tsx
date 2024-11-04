import { getSite } from '@/lib/sanity/queries'
import Wrapper from './Wrapper'
import Link from 'next/link'
import Img from '../Img'
import Navigation from './Navigation'
import CTAList from '@/ui/CTAList'
import Toggle from './Toggle'
import { cn } from '@/lib/utils'
import css from './Header.module.css'

export default async function Header() {
	const { title, logo, ctas } = await getSite()

	const logoImage = logo?.image?.dark || logo?.image?.default

	return (
		<Wrapper className="frosted-glass sticky top-0 z-40 font-moncheri uppercase text-white md:pl-8">
			<div
				className={cn(
					css.header,
					'mx-auto grid max-w-screen-xl items-center gap-x-6 p-6 pb-4 max-sm:pb-0',
					'relative'
				)}
			>
				<div className="z-50 [grid-area:logo] max-md:mb-8 sticky top-0">
					<Link
						className={cn(
							'h3 md:h2 inline-block',
							logo?.image && 'max-w-[550px]',
						)}
						href="/"
					>
						{logoImage ? (
							<Img
								className="inline-block max-h-[4em] w-auto"
								image={logoImage}
								alt={logo?.name || title}
							/>
						) : (
							<span className="text-gradient">{title}</span>
						)}
					</Link>
				</div>

				<Navigation />

				<Toggle />
			</div>
		</Wrapper>
	)
}
