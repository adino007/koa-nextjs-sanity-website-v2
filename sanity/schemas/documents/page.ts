import { defineField, defineType } from 'sanity'
import { VscHome, VscEyeClosed, VscQuestion, VscEdit } from 'react-icons/vsc'

export default defineType({
	name: 'page',
	title: 'Page',
	type: 'document',
	groups: [
		{ name: 'content', default: true },
		{ name: 'seo', title: 'SEO' },
	],
	fields: [
		defineField({
			name: 'title',
			type: 'string',
			group: 'content',
			validation: (Rule) => Rule.required(),
		}),
		defineField({
			name: 'modules',
			title: 'Page Modules',
			description: 'Page content',
			type: 'array',
			of: [
				{ type: 'accordion-list' },
				{ type: 'artist.grid' },
				{ type: 'event.grid' },
				{ type: 'gallery' },
				{ type: 'blog-frontpage' },
				{ type: 'blog-list' },
				{ type: 'blog-post-content' },
				{ type: 'breadcrumbs' },
				{ type: 'callout' },
				{ type: 'creative-module' },
				{ type: 'custom-html' },
				{ type: 'contactForm' },
				{ type: 'flag-list' },
				{ type: 'hero' },
				{ type: 'hero.video' },
				{ type: 'hero.saas' },
				{ type: 'hero.split' },
				{ type: 'logo-list' },
				{ type: 'pricing-list' },
				{ type: 'richtext-module' },
				{ type: 'stat-list' },
				{ type: 'step-list' },
				{ type: 'testimonial-list' },
				{ type: 'testimonial.featured' },
				{ type: 'event-showcase' },
			],
			options: {
				insertMenu: {
					views: [{ name: 'list' }, { name: 'grid' }],
					groups: [
						{ name: 'blog', of: ['blog-list', 'blog-post-content'] },
						{
							name: 'hero',
							of: ['hero', 'hero.video', 'hero.saas', 'hero.split'],
						},
						{
							name: 'testimonial',
							of: ['testimonial-list', 'testimonial.featured'],
						},
						{ name: 'artists', of: ['artist.grid'] },
						{
							name: 'events',
							of: ['event.grid', 'event-showcase'],
						},
					],
				},
			},
			group: 'content',
		}),
		defineField({
			name: 'metadata',
			type: 'metadata',
			group: 'seo',
			validation: (Rule) => Rule.required(),
		}),
	],
	preview: {
		select: {
			title: 'title',
			slug: 'metadata.slug.current',
			media: 'metadata.image',
			noindex: 'metadata.noIndex',
		},
		prepare: ({ title, slug, media, noindex }) => ({
			title,
			subtitle: slug && (slug === 'index' ? '/' : `/${slug}`),
			media:
				media ||
				(slug === 'index' && VscHome) ||
				(slug === '404' && VscQuestion) ||
				(['blog', 'blog/*'].includes(slug) && VscEdit) ||
				(noindex && VscEyeClosed),
		}),
	},
})
