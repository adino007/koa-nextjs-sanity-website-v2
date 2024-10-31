import client from '@/lib/sanity/client'
import { fetchSanity, groq } from '@/lib/sanity/fetch'
import { modulesQuery } from '@/lib/sanity/queries'
import { notFound } from 'next/navigation'
import Modules from '@/ui/modules'

export default async function Page({ params }: Props) {
	const page = await getPageTemplate()
	const artist = await getArtist(params)
	if (!page || !artist) notFound()

	return (
		<div>
			<h1>{artist.name}</h1>
			<div>{artist.bio}</div>
			{artist.photo && <img src={artist.photo.asset.url} alt={artist.name} />}
		</div>
	)
}

export async function generateMetadata({ params }: Props) {
	const artist = await getArtist(params)
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

async function getArtist(params: Props['params']) {
	return await fetchSanity<Sanity.Artist>(
		groq`*[_type == 'artist' && metadata.slug.current == $slug][0]{
            _type,
            name,
            bio,
            metadata {
                title,
                description,
                ogimage,
                noIndex,
                slug {
                    current
                }
            },
            photo{
                asset->{
                    url
                }
            },
            events[]->{
                _id,
                name,
                date,
                metadata {
                    slug {
                        current
                    }
                }
            }
        }`,
		{
			params,
			tags: ['artist'],
		},
	)
}

async function getPageTemplate() {
	return await fetchSanity<Sanity.Page>(
		groq`*[_type == 'page' && metadata.slug.current == 'artists/*'][0]{
            ...,
            modules[]{ ${modulesQuery} },
            metadata { slug }
        }`,
		{ tags: ['artists/*'] },
	)
}

type Props = {
	params: { slug?: string }
}
