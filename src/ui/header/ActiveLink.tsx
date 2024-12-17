'use client'

import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'

export default function ActiveLink({
	children,
	className,
	path,
}: {
	children: React.ReactNode
	className?: string
	path?: string
}) {
	const pathname = usePathname()
	const isActive = pathname === `/${path || ''}`

	const handleClick = () => {
		if (isActive) {
			const checkbox = document.querySelector(
				'#header-open',
			) as HTMLInputElement
			if (checkbox) checkbox.checked = false
		}
	}

	return (
		<div
			className={cn(className, isActive && 'text-2xl')}
			onClick={handleClick}
		>
			{children}
		</div>
	)
}
