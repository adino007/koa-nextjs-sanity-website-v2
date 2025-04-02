import { getArtist } from '@/lib/sanity/queries'
import { notFound } from 'next/navigation'
import ArtistContent from '@/ui/modules/artist/ArtistContent'
import processMetadata from '@/lib/processMetadata'
import DynamicBackground from '@/ui/modules/Styling Module/DynamicBackground'
import client from '@/lib/sanity/client'
import { groq } from '@/lib/sanity/fetch'

export default async function ArtistPage({
	params,
}: {
	params: { slug: string }
}) {
	const artist = await getArtist(params.slug)
	if (!artist) notFound()

	// Structured data for SEO
	const structuredData = {
		'@context': 'https://schema.org',
		'@type': 'Person',
		name: artist.name,
		description: artist.bio,
		image: artist.photo?.asset?.url,
		url: `${process.env.NEXT_PUBLIC_SITE_URL}/artist/${params.slug}`,
		sameAs: artist.socialLinks?.map((link) => link.url),
	}

	return (
		<>
			<script
				type="application/ld+json"
				dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
			/>
			<DynamicBackground imageUrl={artist.photo?.asset?.url || ''}>
				<ArtistContent artist={artist} />
			</DynamicBackground>
		</>
	)
}

export async function generateMetadata({
	params,
}: {
	params: { slug: string }
}) {
	const artist = await getArtist(params.slug)
	return processMetadata(artist)
}

export async function generateStaticParams() {
	const slugs = await client.fetch<string[]>(
		groq`*[_type == 'artist' && defined(metadata.slug.current)].metadata.slug.current`,
	)
	return slugs.map((slug) => ({ slug }))
}

type Props = {
	params: { slug?: string }
}
