import { defineField, defineType } from 'sanity'
import { FiGrid } from 'react-icons/fi'

export default defineType({
	name: 'event.grid',
	title: 'Event Grid',
	type: 'object',
	icon: FiGrid,
	fields: [
		defineField({
			name: 'title',
			title: 'Title',
			type: 'string',
			validation: (Rule) => Rule.required(),
		}),
		defineField({
			name: 'events',
			title: 'Events',
			type: 'array',
			of: [
				{
					type: 'reference',
					to: [{ type: 'event' }],
					options: {
						filter: 'date >= $now',
						filterParams: { now: new Date().toISOString() },
					},
				},
			],
			description: 'Select the events you want to display in the grid',
			validation: (Rule) =>
				Rule.min(1).error('You must add at least one event.'),
		}),
		defineField({
			name: 'layout',
			title: 'Grid Layout',
			type: 'string',
			options: {
				list: [
					{ title: '3 Columns', value: '3-cols' },
					{ title: '4 Columns', value: '4-cols' },
				],
				layout: 'radio',
			},
			initialValue: '3-cols',
			validation: (Rule) => Rule.required(),
		}),
	],
	preview: {
		select: {
			title: 'title',
			eventCount: 'events.length',
		},
		prepare(selection) {
			const { title, eventCount } = selection
			return {
				title: `${title || 'Event Grid'}`,
				subtitle: `${eventCount || 0} events`,
			}
		},
	},
})