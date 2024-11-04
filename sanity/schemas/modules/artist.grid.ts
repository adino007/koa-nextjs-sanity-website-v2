import { defineField, defineType } from 'sanity'
import { IoGridOutline } from 'react-icons/io5'

export default defineType({
	name: 'artist.grid',
	title: 'Artist Grid',
	icon: IoGridOutline,
	type: 'object',
	fields: [
		defineField({
			name: 'title',
			title: 'Title',
			type: 'string',
			description: 'Optional title for the artist grid section.',
		}),
	],
	preview: {
		select: {
			title: 'title',
		},
		prepare({ title }) {
			return {
				title: title || 'Artist Grid',
				subtitle: 'Dynamic artist grid',
			}
		},
	},
})
