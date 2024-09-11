import { PortableText } from '@portabletext/react'
import CTAList from '@/ui/CTAList'
import { cn } from '@/lib/utils'
import { stegaClean } from '@sanity/client/stega'
import css from './Hero.module.css'
import dynamic from 'next/dynamic'

const MuxPlayer = dynamic(() => import('@mux/mux-player-react'), { ssr: false })

export default function HeroVideo({
	content,
	ctas,
	muxVideo,
	textAlign = 'center',
	alignItems,
}: Partial<{
	pretitle: string
	content: any
	ctas: Sanity.CTA[]
	muxVideo: {
		playbackId: string
		status: string
		filename: string
	}
	textAlign: React.CSSProperties['textAlign']
	alignItems: React.CSSProperties['alignItems']
}>) {
	const hasVideo = !!muxVideo?.playbackId

	// Sanitize playbackId to remove any unwanted characters
	const sanitizePlaybackId = (id: string): string => {
		return id.replace(/[^a-zA-Z0-9-_]/g, '')
	}

	const sanitizedPlaybackId = hasVideo
		? sanitizePlaybackId(muxVideo.playbackId)
		: null

	console.log('sanitizedPlaybackId', sanitizedPlaybackId)

	return (
		<section
			className={cn(
				'videosection',
				hasVideo &&
					'relative m-0 -mt-32 grid h-screen w-full overflow-hidden bg-ink object-cover p-0 text-canvas *:col-span-full *:row-span-full sm:-mt-32',
			)}
		>
			{/* Background Video */}
			<div className={cn(css.muxPlayerSettings, 'm-0 p-0')}>
				{hasVideo && sanitizedPlaybackId && (
					<MuxPlayer
						src={`https://stream.mux.com/${sanitizedPlaybackId}.m3u8`}
						autoPlay
						loop
						muted
						playsInline
						className="h-full w-full object-cover"
					/>
				)}
			</div>

			{content && (
				<div className="section relative z-10 flex h-full w-full">
					<div
						className={cn(
							'richtext relative isolate max-w-xl [&_:is(h1,h2)]:text-balance',
							hasVideo && 'text-shadow mb-12',
							css.txt,
							{
								'mb-8': stegaClean(alignItems) === 'start',
								'my-auto': stegaClean(alignItems) === 'center',
								'mt-auto': stegaClean(alignItems) === 'end',
							},
							{
								'mr-auto': stegaClean(textAlign) === 'left',
								'mx-auto': stegaClean(textAlign) === 'center',
								'ml-auto': stegaClean(textAlign) === 'right',
							},
						)}
						style={{ textAlign: stegaClean(textAlign) }}
					>
						<PortableText value={content} />
						<CTAList
							ctas={ctas}
							className={cn('!mt-4', {
								'justify-start': stegaClean(textAlign) === 'left',
								'justify-center': stegaClean(textAlign) === 'center',
								'justify-end': stegaClean(textAlign) === 'right',
							})}
						/>
					</div>
				</div>
			)}
		</section>
	)
}
