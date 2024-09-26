import { defineType } from 'sanity'
import type { Rule } from 'sanity'

export default defineType({
	name: 'artist',
	title: 'Artist',
	type: 'document',
	fields: [
		{
			name: 'name',
			title: 'Artist Name',
			type: 'string',
		},
		{
			name: 'photo',
			title: 'Artist Photo',
			type: 'image',
			options: { hotspot: true },
		},
		{
			name: 'bio',
			title: 'Biography',
			type: 'text',
		},
		{
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
							validation: (Rule: Rule) => Rule.required(),
						},
						{
							name: 'url',
							title: 'URL',
							type: 'url',
							validation: (Rule: Rule) =>
								Rule.required().uri({
									scheme: ['http', 'https'],
								}),
						},
					],
					preview: {
						select: {
							title: 'platform',
							subtitle: 'url',
						},
					},
				},
			],
		},
		{
			name: 'upcomingEvents',
			title: 'Upcoming Events',
			type: 'array',
			of: [{ type: 'reference', to: [{ type: 'event' }] }],
		},
		{
			name: 'pastEvents',
			title: 'Past Events',
			type: 'array',
			of: [{ type: 'reference', to: [{ type: 'event' }] }],
		},
		{
			name: 'venuesPlayed',
			title: 'Venues Played',
			type: 'array',
			of: [{ type: 'reference', to: [{ type: 'venue' }] }],
		},
		{
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
		},
	],
})
