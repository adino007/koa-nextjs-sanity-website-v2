import { getArtist } from '@/lib/sanity/queries'
import { notFound } from 'next/navigation'
import ArtistContent from '@/ui/modules/artist/ArtistContent'
import DynamicBackground from '@/ui/modules/Styling Module/DynamicBackground'
import client from '@/lib/sanity/client'
import { groq } from '@/lib/sanity/fetch'

export default async function Page({ params }: Props) {
	const artist = await getArtist(params.slug!)
	if (!artist) notFound()

	return (
		<DynamicBackground imageUrl={artist.photo?.asset?.url || ''}>
			<ArtistContent artist={artist} />
		</DynamicBackground>
	)
}

export async function generateMetadata({ params }: Props) {
	const artist = await getArtist(params.slug!)
	if (!artist) notFound()

	const jsonLd = {
		'@context': 'https://schema.org',
		'@type': 'Person',
		name: artist.name,
		description: artist.bio,
		image: artist.photo?.asset?.url,
		url: `${process.env.NEXT_PUBLIC_SITE_URL}/artist/${params.slug}`,
		sameAs: artist.socialLinks?.map((link) => link.url),
	}

	return {
		title: artist.name,
		description: artist.bio,
		openGraph: {
			images: artist.photo?.asset?.url ? [artist.photo.asset.url] : [],
			url: `${process.env.NEXT_PUBLIC_SITE_URL}/artist/${params.slug}`,
		},
		alternates: {
			canonical: `/artist/${params.slug}`,
		},
		other: {
			'script:ld+json': JSON.stringify(jsonLd),
		},
	}
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
