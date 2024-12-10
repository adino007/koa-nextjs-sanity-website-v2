import { defineType, defineField } from 'sanity'
import { MdLocationOn } from 'react-icons/md'

export default defineType({
	name: 'venue',
	title: 'Venue',
	icon: MdLocationOn,
	type: 'document',
	groups: [
		{ name: 'content', default: true },
		{ name: 'seo', title: 'SEO' },
	],
	fields: [
		defineField({
			name: 'name',
			title: 'Venue Name',
			type: 'string',
			group: 'content',
		}),
		defineField({
			name: 'location',
			title: 'Location',
			type: 'string',
			group: 'content',
		}),
		defineField({
			name: 'description',
			title: 'Description',
			type: 'text',
			group: 'content',
		}),
		defineField({
			name: 'image',
			title: 'Venue Image',
			type: 'image',
			options: { hotspot: true },
			fields: [
				{
					name: 'alt',
					title: 'Alternative Text',
					type: 'string',
					options: {
						isHighlighted: true,
					},
				},
			],
			group: 'content',
		}),
		defineField({
			name: 'gallery',
			title: 'Gallery',
			type: 'array',
			of: [
				{
					type: 'image',
					options: { hotspot: true }
				}
			],
			options: {
				layout: 'grid'
			},
			group: 'content'
		}),
		defineField({
			name: 'metadata',
			type: 'metadata',
			group: 'seo',
		}),
	],
	preview: {
		select: {
			title: 'name',
			media: 'image',
		},
	},
})
