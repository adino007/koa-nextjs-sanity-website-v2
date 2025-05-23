// schemas/modules/gallery.ts
import { defineType, defineField } from 'sanity'

export default defineType({
	name: 'gallery',
	title: 'Gallery',
	type: 'object', // Or "document" if you want a standalone document type
	fields: [
		defineField({
			name: 'title',
			title: 'Gallery Title',
			type: 'string',
			validation: (Rule) => Rule.required().error('Gallery Title is required'),
		}),
		defineField({
			name: 'description',
			title: 'Gallery Description',
			type: 'text',
		}),
		defineField({
			name: 'events',
			title: 'Select Events for Gallery',
			type: 'array',
			of: [{ type: 'reference', to: [{ type: 'event' }] }],
		}),
		defineField({
			name: 'images',
			title: 'Gallery Images',
			type: 'array',
			of: [
				{
					type: 'image',
					options: {
						hotspot: true,
						storeOriginalFilename: true,
					},
				},
			],
		}),
	],
})
