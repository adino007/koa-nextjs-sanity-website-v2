import { getSingleArtist } from '@/lib/sanity/queries'
import { notFound } from 'next/navigation'
import ArtistContent from '@/ui/modules/artist/ArtistContent'
import DynamicBackground from '@/ui/modules/event/DynamicBackground'
import client from '@/lib/sanity/client'
import groq from 'groq'

export default async function Page({ params }: Props) {
  const artist = await getSingleArtist(params.slug!)
  if (!artist) notFound()

  return (
    <DynamicBackground imageUrl={artist.photo?.asset?.url || ''}>
      <ArtistContent artist={artist} />
    </DynamicBackground>
  )
}

export async function generateMetadata({ params }: Props) {
	const artist = await getSingleArtist(params.slug!)
	if (!artist) notFound()

	return {
		title: artist.name,
		description: artist.bio,
		openGraph: {
			images: artist.photo?.asset?.url ? [artist.photo.asset.url] : [],
		},
	}
}

export async function generateStaticParams() {
	const slugs = await client.fetch<string[]>(
		groq`*[_type == 'artist' && defined(slug.current)].slug.current`,
	)
	return slugs.map((slug) => ({ slug }))
}

type Props = {
	params: { slug?: string }
}