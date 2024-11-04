import type { SanityImageObject } from '@sanity/image-url/lib/types/types'
import type { SanityDocument } from 'next-sanity'

declare global {
	namespace Sanity {
		// documents

		type Site = SanityDocument<{
			title: string
			logo?: Logo
			announcements?: Announcement[]
			ctas?: CTA[]
			headerMenu?: Navigation
			footerMenu?: Navigation
			social?: Navigation
			copyright?: any
			ogimage?: string
		}>

		type Navigation = SanityDocument<{
			title: string
			items?: (Link | LinkList)[]
		}>

		type Announcement = SanityDocument<{
			content: any
			cta?: Link
			start?: string
			end?: string
		}>

		// pages

		type PageBase = SanityDocument<{
			title?: string
			metadata: Metadata
		}>

		type Page = PageBase & {
			readonly _type: 'page'
			modules?: Module[]
		}

		type BlogPost = PageBase & {
			readonly _type: 'blog.post'
			body: any
			readTime: number
			headings?: { style: string; text: string }[]
			categories: BlogCategory[]
			featured: boolean
			hideTableOfContents: boolean
			publishDate: string
		}

		type BlogCategory = SanityDocument<{
			title: string
		}>

		type Event = PageBase & {
			readonly _type: 'event'
			name: string
			date: string
			ticketlink: CTA
			time: {
				start: string
				end: string
			}
			venue: {
				metadata: any
				name: ReactI18NextChildren | Iterable<ReactI18NextChildren>
				location: ReactI18NextChildren | Iterable<ReactI18NextChildren>
				_type: 'reference'
				to: Venue
			}
			artists: Array<{
				metadata: any
				_id: Key | null | undefined
				photo: any
				name: string
				_type: 'reference'
				to: Artist
			}>
			flyer?: {
				asset: {
					url: string
				}
				hotspot?: boolean
			}
			gallery?: Array<{
				type: 'image' | 'mux.video'
				title?: string
				asset: {
					url: string
				}
				hotspot?: boolean
			}>
			links?: string[]
			metadata: Metadata
		}
		type Artist = PageBase & {
			readonly _type: 'artist'
			name: string
			photo?: {
				asset: {
					url: string
				}
				hotspot?: boolean
			}
			bio?: string
			socialLinks?: Array<{
				platform: string
				url: string
			}>
			upcomingEvents?: Array<{
				_id: Key | null | undefined
				name: ReactI18NextChildren | Iterable<ReactI18NextChildren>
				date: string | number | Date
				venue: any
				type: 'reference'
				to: Event
			}>
			pastEvents?: Array<{
				type: 'reference'
				to: Event
			}>
			venuesPlayed?: Array<{
				name: ReactI18NextChildren | Iterable<ReactI18NextChildren>
				location: ReactI18NextChildren | Iterable<ReactI18NextChildren>
				type: 'reference'
				to: Venue
			}>
			gallery?: Array<{
				type: 'image'
				asset: {
					url: string
				}
				hotspot?: boolean
			}>
			metadata: Metadata
		}

		type Venue = PageBase & {
			readonly _type: 'venue'
			name: string
			location: string
			description?: string
			image?: {
				asset: {
					url: string
				}
				alt?: string
			}
			gallery?: Array<{
				_type: 'image' | 'mux.video'
				asset: {
					url: string
				}
			}>
			upcomingEvents?: Event[]
			pastEvents?: Event[]
			metadata: Metadata
		}

		// miscellaneous

		type Logo = SanityDocument<{
			name: string
			image?: Partial<{
				default: Image
				light: Image
				dark: Image
			}>
		}>

		type Pricing = SanityDocument<{
			title: string
			highlight?: string
			price: {
				base: number
				strikethrough?: number
				suffix?: string
			}
			ctas?: CTA[]
			content?: any
		}>

		type Reputation = SanityDocument<{
			title?: string
			subtitle?: string
			repo?: string
			limit?: number
			avatars?: Image[]
		}>

		type Testimonial = SanityDocument<{
			content: any
			author?: {
				name: string
				title?: string
				image?: Image
			}
		}>

		// objects

		type CTA = {
			link?: Link
			style?: string
		}

		type Image = SanityImageObject &
			Partial<{
				alt: string
				loading: 'lazy' | 'eager'
			}>

		type Link = {
			readonly _type: 'link'
			label: string
			type: 'internal' | 'external'
			internal?: Page | BlogPost
			external?: string
			params?: string
		}

		type LinkList = {
			readonly _type: 'link.list'
			link: Link
			links?: Link[]
		}

		type Metadata = {
			slug: { current: string }
			title: string
			description: string
			image?: Image
			ogimage?: string
			noIndex: boolean
		}

		type Module<T = string> = {
			_type: T
			_key: string
			uid?: string
		}
	}
}

export {}
