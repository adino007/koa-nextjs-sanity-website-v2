import { getEvent } from '@/lib/sanity/queries'
import GalleryView from '../../../../ui/modules/gallery/GalleryView'

export default async function GallerySpecificPage({
	params,
}: {
	params: { slug: string }
}) {
	const event = await getEvent(params.slug)
	return <GalleryView event={event} />
}
