'use client'

import { useEffect, useState } from 'react'
import { Button } from './Button'
import { cn } from '@/lib/utils'

export function CookieConsent() {
	const [isVisible, setIsVisible] = useState(false)

	useEffect(() => {
		// Check if user has already made a choice
		const consent = localStorage.getItem('cookie-consent')
		if (!consent) {
			setIsVisible(true)
		}
	}, [])

	const handleAccept = () => {
		localStorage.setItem('cookie-consent', 'accepted')
		setIsVisible(false)
	}

	const handleDecline = () => {
		localStorage.setItem('cookie-consent', 'declined')
		setIsVisible(false)
	}

	if (!isVisible) return null

	return (
		<div
			className={cn(
				'fixed bottom-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md dark:bg-gray-900/80',
				'border-t border-gray-200 dark:border-gray-800',
				'animate-slide-up',
			)}
		>
			<div className="container mx-auto px-4 py-4">
				<div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
					<div className="text-center sm:text-left">
						<p className="text-sm text-gray-600 dark:text-gray-300">
							We use cookies to enhance your browsing experience and analyze our
							traffic.
						</p>
						<p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
							By clicking "Accept", you consent to our use of cookies.
						</p>
					</div>
					<div className="flex gap-2">
						<Button variant="ghost" onClick={handleDecline} className="text-sm">
							Decline
						</Button>
						<Button onClick={handleAccept} className="text-sm">
							Accept
						</Button>
					</div>
				</div>
			</div>
		</div>
	)
}
