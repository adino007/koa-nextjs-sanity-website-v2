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

				document.body.style.backgroundColor = bgColor
				document.documentElement.style.backgroundColor = bgColor

				const header = document.querySelector('header')
				const footer = document.querySelector('footer')
				const main = document.querySelector('main')

				if (header) header.style.backgroundColor = bgColor
				if (footer) footer.style.backgroundColor = bgColor
				if (main) main.style.backgroundColor = bgColor
			}
		}

		return () => {
			document.body.style.backgroundColor = ''
			document.documentElement.style.backgroundColor = ''
			const elements = ['header', 'footer', 'main']
			elements.forEach((selector) => {
				const element = document.querySelector(selector)
				if (element) (element as HTMLElement).style.backgroundColor = ''
			})
		}
	}, [imageUrl])

	return <div className="container mx-auto px-4">{children}</div>
}
