import { GoogleTagManager } from '@next/third-parties/google'
import type { Metadata } from 'next'
import SkipToContent from '@/ui/SkipToContent'
import Announcement from '@/ui/Announcement'
import Header from '@/ui/header'
import Footer from '@/ui/footer'
import { Analytics } from '@vercel/analytics/react'
import { SpeedInsights } from '@vercel/speed-insights/next'
import VisualEditingControls from '@/ui/VisualEditingControls'
import '@/styles/app.css'
import { CookieConsent } from '@/components/ui/CookieConsent'

export const metadata: Metadata = {
	icons: {
		icon: '/icons/favicon.ico',
		shortcut: '/icons/favicon.ico',
		apple: '/icons/apple-touch-icon.png',
		other: [
			{
				rel: 'icon',
				type: 'image/png',
				sizes: '32x32',
				url: '/icons/favicon-32x32.png',
			},
			{
				rel: 'icon',
				type: 'image/png',
				sizes: '16x16',
				url: '/icons/favicon-16x16.png',
			},
			{
				rel: 'icon',
				type: 'image/png',
				sizes: '192x192',
				url: '/icons/android-chrome-192x192.png',
			},
			{
				rel: 'icon',
				type: 'image/png',
				sizes: '512x512',
				url: '/icons/android-chrome-512x512.png',
			},
		],
	},
}
export default async function RootLayout({
	children,
}: {
	children: React.ReactNode
}) {
	return (
		<html lang="en" className="h-full">
			<head>
				<GoogleTagManager gtmId="GTM-TLJKF7C4" />
				<meta name="seobility" content="856ff90b386856cdb709d1280d0b618e" />
				<meta
					name="viewport"
					content="width=device-width, initial-scale=1, viewport-fit=cover, interactive-widget=resizes-content, maximum-scale=1, user-scalable=no"
				/>
				<link
					rel="preload"
					as="image"
					href="https://cdn.sanity.io/images/z2grrz9f/production/e767975773de37e33985d82b4…"
					imageSrcSet="(your srcset here if applicable)"
					imageSizes="(your sizes here if applicable)"
				/>
			</head>

			<body className="min-h-full bg-almostBlack font-moncheri uppercase text-white">
				<SkipToContent />
				<Announcement />
				<Header />
				<main id="main-content" tabIndex={-1}>
					{children}
				</main>
				<Footer />

				<Analytics />
				<SpeedInsights />
				<VisualEditingControls />
				<CookieConsent />
			</body>
		</html>
	)
}
