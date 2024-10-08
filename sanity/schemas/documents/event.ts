import { defineField, defineType } from 'sanity'

export default defineType({
	name: 'event',
	title: 'Event',
	type: 'document',
	fields: [
		defineField({
			name: 'name',
			title: 'Event Name',
			type: 'string',
			validation: (Rule) => Rule.required(),
		}),
		defineField({
			name: 'date',
			title: 'Date',
			type: 'datetime',
			validation: (Rule) => Rule.required(),
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
		}),
		defineField({
			name: 'venue',
			title: 'Venue',
			type: 'reference',
			to: [{ type: 'venue' }],
		}),
		defineField({
			name: 'artists',
			title: 'Artists',
			type: 'array',
			of: [{ type: 'reference', to: { type: 'artist' } }],
		}),
		defineField({
			name: 'links',
			title: 'Links',
			type: 'array',
			of: [{ type: 'url' }],
		}),
		defineField({
			name: 'flyer',
			title: 'Flyer Image',
			type: 'image',
			options: { hotspot: true },
		}),
		defineField({
			name: 'gallery',
			title: 'Gallery',
			type: 'array',
			of: [{ type: 'image' }],
			options: { layout: 'grid' },
		}),
	],
})
