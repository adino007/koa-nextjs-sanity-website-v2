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
				const bgColor = `rgba(${r}, ${g}, ${b}, 0.7)`

				// Apply to all major sections
				document.body.style.backgroundColor = bgColor
				document.documentElement.style.backgroundColor = bgColor

				// Target header and footer specifically
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
				if (element) element.style.backgroundColor = ''
			})
		}
	}, [imageUrl])

	return <div className="container mx-auto px-4">{children}</div>
}
