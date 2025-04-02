import { defineType, defineField } from 'sanity'

export default defineType({
	name: 'relatedEvents',
	title: 'Related Events',
	type: 'object',
	fields: [
		defineField({
			name: 'title',
			title: 'Section Title',
			type: 'string',
			description: 'Optional title for the related events section',
		}),
		defineField({
			name: 'description',
			title: 'Section Description',
			type: 'text',
			description: 'Optional description for the related events section',
		}),
		defineField({
			name: 'currentEventId',
			title: 'Current Event ID',
			type: 'string',
			description: 'The ID of the current event to exclude from related events',
		}),
		defineField({
			name: 'maxEvents',
			title: 'Maximum Events',
			type: 'number',
			description: 'Maximum number of related events to show',
			initialValue: 6,
		}),
	],
	preview: {
		select: {
			title: 'title',
		},
		prepare({ title }) {
			return {
				title: title || 'Related Events',
			}
		},
	},
})
