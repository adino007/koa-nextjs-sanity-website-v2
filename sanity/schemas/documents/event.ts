// schemas/event.ts
import { defineType, defineField } from 'sanity'
import { MdEvent } from 'react-icons/md'

export default defineType({
	name: 'event',
	title: 'Event',
	icon: MdEvent,
	type: 'document',
	groups: [
		{ name: 'content', default: true },
		{ name: 'seo', title: 'SEO' },
		{ name: 'options', title: 'Options' },
	],
	fields: [
		defineField({
			name: 'name',
			title: 'Event Name',
			type: 'string',
			validation: (Rule) => Rule.required(),
			group: 'content',
		}),
		defineField({
			name: 'time',
			title: 'Event Time',
			type: 'object',
			fields: [
				defineField({
					name: 'start',
					title: 'Start Time',
					type: 'datetime',
				}),
				defineField({
					name: 'end',
					title: 'End Time',
					type: 'datetime',
				}),
			],
			validation: (Rule) => Rule.required(),
			group: 'content',
		}),
		defineField({
			name: 'eventCTAS',
			title: 'Event Call-to-Actions',
			type: 'array',
			of: [{ type: 'cta' }],
			group: 'content',
		}),
		defineField({
			name: 'venue',
			title: 'Venue',
			type: 'reference',
			to: [{ type: 'venue' }],
			group: 'content',
			validation: (Rule) => Rule.required(),
		}),
		defineField({
			name: 'artists',
			title: 'Artists',
			type: 'array',
			of: [{ type: 'reference', to: { type: 'artist' } }],
			group: 'content',
			validation: (Rule) => Rule.required(),
		}),
		defineField({
			name: 'flyer',
			title: 'Flyer Image',
			type: 'image',
			options: { hotspot: true },
			group: 'content',
			validation: (Rule) => Rule.required(),
		}),
		{
			name: 'showInGallery',
			title: 'Show in Gallery',
			type: 'boolean',
			description: 'Toggle to display this event in the gallery grid',
			initialValue: false,
			group: 'options',
		},
		defineField({
			name: 'gallery',
			title: 'Gallery Items',
			description: 'First image will display as gallery grid image',
			type: 'array',
			of: [
				{
					type: 'image',
					title: 'Photo',
					options: {
						hotspot: true,
						storeOriginalFilename: true,
						accept: 'image/*',
					},
					fields: [
						{
							name: 'alt',
							type: 'string',
							title: 'Alternative text',
							description: 'Important for SEO and accessibility.',
						},
						{
							name: 'caption',
							type: 'string',
							title: 'Caption',
							description: 'Optional caption for the image.',
						},
					],
				},
				{
					type: 'mux.video',
					title: 'Video',
				},
			],
			options: {
				layout: 'grid',
			},
			group: 'content',
		}),
		defineField({
			name: 'links',
			title: 'Links',
			type: 'array',
			of: [{ type: 'url' }],
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
