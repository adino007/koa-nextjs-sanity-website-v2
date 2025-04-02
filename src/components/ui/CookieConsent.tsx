'use client'

import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
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

	const handleNecessaryOnly = () => {
		localStorage.setItem('cookie-consent', 'necessary')
		setIsVisible(false)
	}

	if (!isVisible) return null

	return (
		<div
			className={cn(
				'fixed bottom-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-md',
				'border-t border-gray-800',
				'animate-slide-up',
			)}
		>
			<div className="container mx-auto px-4 py-2">
				<div className="flex flex-col items-center justify-between gap-2 sm:flex-row">
					<div className="text-center sm:text-left">
						<p className="text-xs text-gray-300">
							We use cookies to enhance your browsing experience and analyze our
							traffic. By continuing to use our site, you agree to our use of
							cookies.
						</p>
						<p className="mt-0.5 text-[10px] text-gray-400">
							You can choose to accept all cookies, only necessary cookies, or
							decline non-essential cookies.
						</p>
					</div>
					<div className="flex flex-wrap justify-center gap-1">
						<Button
							onClick={handleAccept}
							className="h-7 bg-white px-2 text-xs uppercase text-black hover:bg-gray-200"
						>
							Accept All
						</Button>
						<Button
							variant="ghost"
							onClick={handleDecline}
							className="h-7 px-2 text-xs uppercase text-gray-300 hover:bg-white/10 hover:text-white"
						>
							Decline
						</Button>
						<Button
							variant="outline"
							onClick={handleNecessaryOnly}
							className="h-7 border-gray-700 bg-black/50 px-2 text-xs uppercase text-white hover:bg-black/70"
						>
							Necessary Only
						</Button>
					</div>
				</div>
			</div>
		</div>
	)
}
