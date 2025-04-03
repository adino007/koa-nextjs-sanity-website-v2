import { defineField, defineType } from 'sanity'
import { VscCalendar } from 'react-icons/vsc'

export default defineType({
	name: 'event-showcase',
	title: 'Event Showcase',
	type: 'object',
	icon: VscCalendar,
	groups: [
		{ name: 'content', title: 'Content', default: true },
		{ name: 'options', title: 'Options' },
	],
	fields: [
		defineField({
			name: 'title',
			type: 'string',
			group: 'content',
		}),
		defineField({
			name: 'description',
			type: 'array',
			of: [{ type: 'block' }],
			group: 'content',
		}),
		defineField({
			name: 'maxEvents',
			type: 'number',
			description: 'Maximum number of events to display',
			initialValue: 3,
			validation: (Rule) => Rule.min(1).integer(),
			group: 'options',
		}),
		defineField({
			name: 'showVenue',
			type: 'boolean',
			description: 'Show venue information',
			initialValue: true,
			group: 'options',
		}),
		defineField({
			name: 'showDate',
			type: 'boolean',
			description: 'Show date information',
			initialValue: true,
			group: 'options',
		}),
		defineField({
			name: 'textAlign',
			type: 'string',
			options: {
				list: ['left', 'center', 'right'],
				layout: 'radio',
			},
			initialValue: 'center',
			group: 'options',
		}),
	],
	preview: {
		select: {
			title: 'title',
			description: 'description',
		},
		prepare: ({ title, description }) => ({
			title: title || 'Event Showcase',
			subtitle: description ? 'With description' : 'Without description',
		}),
	},
})
