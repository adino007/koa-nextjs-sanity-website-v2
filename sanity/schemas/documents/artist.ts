import { defineType, defineField } from 'sanity'
import { MdPerson } from 'react-icons/md'

export default defineType({
	name: 'artist',
	title: 'Artist',
	icon: MdPerson,
	type: 'document',
	groups: [
		{ name: 'content', default: true },
		{ name: 'social', title: 'Social Media' },
		{ name: 'events', title: 'Events' },
		{ name: 'seo', title: 'SEO' },
	],
	fields: [
		defineField({
			name: 'name',
			title: 'Artist Name',
			type: 'string',
			group: 'content',
			validation: (Rule) => Rule.required(),
		}),
		defineField({
			name: 'photo',
			title: 'Artist Photo',
			type: 'image',
			options: { hotspot: true },
			group: 'content',
		}),
		defineField({
			name: 'bio',
			title: 'Biography',
			type: 'text',
			group: 'content',
		}),
		defineField({
			name: 'socialLinks',
			title: 'Social Links',
			type: 'array',
			of: [
				{
					type: 'object',
					fields: [
						{
							name: 'platform',
							title: 'Platform',
							type: 'string',
							validation: (Rule) => Rule.required(),
						},
						{
							name: 'url',
							title: 'URL',
							type: 'url',
							validation: (Rule) =>
								Rule.required().uri({
									scheme: ['http', 'https'],
								}),
						},
					],
				},
			],
			group: 'social',
		}),
		defineField({
			name: 'gallery',
			title: 'Gallery',
			type: 'array',
			of: [
				{
					type: 'image',
					options: { hotspot: true },
				},
			],
			options: {
				layout: 'grid',
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
})
