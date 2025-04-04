import { map } from 'rxjs'
import type { DocumentLocationResolver } from 'sanity/presentation'

export const locations: DocumentLocationResolver = (params, context) => {
	if (['page', 'blog.post'].includes(params.type)) {
		const doc$ = context.documentStore.listenQuery(
			`*[_id == $id][0]{title,metadata}`,
			{
				...params,
				version: params.version || '',
				perspectiveStack: params.perspectiveStack || [],
			},
			{ perspective: 'drafts' },
		)

		return doc$.pipe(
			map((doc) => {
				if (!doc?.metadata?.slug?.current) return null

				const segment = params.type === 'blog.post' ? '/blog' : ''
				const slug = doc.metadata.slug.current
				const path = slug === 'index' ? '' : `/${slug}`

				return {
					locations: [
						{
							title: doc.title || doc.metadata.title || 'Untitled',
							href: [segment, path].filter(Boolean).join(''),
						},
					],
				}
			}),
		)
	}

	return null
}
