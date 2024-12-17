import { getEvent } from '@/lib/sanity/queries'

export default async function GallerySpecificPage({
	params,
}: {
	params: { slug: string }
}) {
	const event = await getEvent(params.slug)

	return <h1>Gallery for event specific page!</h1>
}
