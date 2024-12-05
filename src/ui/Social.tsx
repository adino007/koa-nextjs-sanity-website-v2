import { getSite } from '@/lib/sanity/queries'
import CTA from './CTA'
import { cn } from '@/lib/utils'

import {
	FaFacebookF,
	FaGithub,
	FaInstagram,
	FaLinkedinIn,
	FaSoundcloud,
	FaTiktok,
	FaXTwitter,
	FaYoutube,
} from 'react-icons/fa6'
import { IoIosLink } from 'react-icons/io'
import { SiLinktree } from 'react-icons/si' // Add this line to import SiLinktree

export default async function Social({
	className,
}: React.ComponentProps<'div'>) {
	const { social } = await getSite()

	if (!social?.items?.length) return null

	return (
		<nav
			className={cn('group flex flex-wrap items-center text-2xl', className)}
		>
			{social.items.map((item, key) => {
				switch (item._type) {
					case 'link':
						return (
							<CTA
								className="px-2 py-1 hover:!opacity-100 group-has-[a:hover]:opacity-50"
								link={item}
								key={key}
							>
								<Icon url={item.external} aria-label={item.label} />
							</CTA>
						)

					default:
						return null
				}
			})}
		</nav>
	)
}

function Icon({
	url,
	...props
}: { url?: string } & React.ComponentProps<'svg'>) {
	if (!url) return null

	return url?.includes('facebook.com') ? (
		<FaFacebookF {...props} />
	) : url?.includes('github.com') ? (
		<FaGithub {...props} />
	) : url?.includes('linktr.ee') ? (
		<SiLinktree {...props} />
	) : url?.includes('soundcloud.com') ? (
		<FaSoundcloud {...props} />
	) : url?.includes('instagram.com') ? (
		<FaInstagram {...props} />
	) : url?.includes('linkedin.com') ? (
		<FaLinkedinIn {...props} />
	) : url?.includes('tiktok.com') ? (
		<FaTiktok {...props} />
	) : url?.includes('twitter.com') || url?.includes('x.com') ? (
		<FaXTwitter {...props} />
	) : url?.includes('youtube.com') ? (
		<FaYoutube {...props} />
	) : (
		<IoIosLink {...props} />
	)
}
