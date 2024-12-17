import { getEvents } from '@/lib/sanity/queries'
import GalleryGrid from '@/ui/modules/gallery/GalleryGrid'

export default async function GalleryPage() {
	const events = await getEvents()

	return <GalleryGrid events={events} />
}
