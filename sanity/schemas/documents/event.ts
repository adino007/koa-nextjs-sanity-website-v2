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
			name: 'date',
			title: 'Date',
			type: 'datetime',
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
			group: 'content',
		}),
		defineField({
			name: 'venue',
			title: 'Venue',
			type: 'reference',
			to: [{ type: 'venue' }],
			group: 'content',
		}),
		defineField({
			name: 'artists',
			title: 'Artists',
			type: 'array',
			of: [{ type: 'reference', to: { type: 'artist' } }],
			group: 'content',
		}),
		defineField({
			name: 'flyer',
			title: 'Flyer Image',
			type: 'image',
			options: { hotspot: true },
			group: 'content',
		}),
		defineField({
			name: 'gallery',
			title: 'Gallery Items',
			type: 'array',
			of: [
				{
					type: 'image',
					title: 'Photo',
					options: { hotspot: true },
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
		}),
	],
})
