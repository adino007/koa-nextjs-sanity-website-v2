'use client'

import { FastAverageColor } from 'fast-average-color'
import { useEffect } from 'react'

export default function DynamicBackground({
	imageUrl,
	children,
}: {
	imageUrl: string
	children: React.ReactNode
}) {
	useEffect(() => {
		if (imageUrl) {
			const fac = new FastAverageColor()
			const img = document.createElement('img')
			img.src = imageUrl
			img.crossOrigin = 'anonymous'

			img.onload = () => {
				const color = fac.getColor(img)
				const [r, g, b] = color.value

				// Calculate relative luminance
				const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255

				// Darken the background if too light for white text
				const adjustedR = luminance > 0.5 ? r * 0.6 : r
				const adjustedG = luminance > 0.5 ? g * 0.6 : g
				const adjustedB = luminance > 0.5 ? b * 0.6 : b

				const bgColor = `rgba(${adjustedR}, ${adjustedG}, ${adjustedB}, 0.7)`

				// Apply background color with lower z-index
				document.body.style.setProperty('--dynamic-bg', bgColor)
				document.documentElement.style.setProperty('--dynamic-bg', bgColor)

				const elements = ['header', 'footer', 'main']
				elements.forEach((selector) => {
					const element = document.querySelector(selector)
					if (element) {
						element.style.setProperty('--dynamic-bg', bgColor)
						element.style.backgroundColor = 'var(--dynamic-bg)'
					}
				})
			}
		}

		return () => {
			document.body.style.removeProperty('--dynamic-bg')
			document.documentElement.style.removeProperty('--dynamic-bg')
			const elements = ['header', 'footer', 'main']
			elements.forEach((selector) => {
				const element = document.querySelector(selector)
				if (element) {
					element.style.removeProperty('--dynamic-bg')
					element.style.backgroundColor = ''
				}
			})
		}
	}, [imageUrl])

	return (
		<div className="relative z-0">
			<div
				className="absolute inset-0 -z-10"
				style={{ backgroundColor: 'var(--dynamic-bg)' }}
			/>
			<div className="relative z-10">{children}</div>
		</div>
	)
}
