'use client'

import { useEffect } from 'react'
import { usePathname } from 'next/navigation'
import styles from './Header.module.css'

export default function Toggle() {
	const pathname = usePathname()

	useEffect(() => {
		const checkbox = document.querySelector('#header-open') as HTMLInputElement

		const handleChange = () => {
			document.body.style.overflow = checkbox.checked ? 'hidden' : 'unset'
		}

		checkbox?.addEventListener('change', handleChange)

		// Reset scroll lock on page change
		document.body.style.overflow = 'unset'
		if (checkbox) checkbox.checked = false

		return () => checkbox?.removeEventListener('change', handleChange)
	}, [pathname])

	return (
		<label className="sticky right-6 top-6 z-50 mb-6 mr-2 [grid-area:toggle] md:hidden">
			<input id="header-open" type="checkbox" hidden />
			<div className={styles.menu}>
				<span className={styles.bar}></span>
				<span className={styles.bar}></span>
				<span className={styles.bar}></span>
			</div>
		</label>
	)
}
