'use client'

import { useEffect } from 'react'
import { IoCloseCircleOutline, IoReorderThreeOutline } from 'react-icons/io5'

export default function Toggle() {
	useEffect(() => {
		const checkbox = document.querySelector('#header-open') as HTMLInputElement
		
		const handleChange = () => {
			document.body.style.overflow = checkbox.checked ? 'hidden' : 'unset'
		}
		
		checkbox?.addEventListener('change', handleChange)
		return () => checkbox?.removeEventListener('change', handleChange)
	}, [])

	return (
		<label className="z-50 [grid-area:toggle] md:hidden">
			<input id="header-open" type="checkbox" hidden />
			<span className="text-4xl font-bold header-closed:hidden">
				<IoCloseCircleOutline />
			</span>
			<span className="text-5xl header-open:hidden">
				<IoReorderThreeOutline />
			</span>
		</label>
	)
}
