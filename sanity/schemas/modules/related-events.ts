import { defineField, defineType } from 'sanity'
import { VscCalendar } from 'react-icons/vsc'
import { textAlign } from '../fragments/fields/alignment'

export default defineType({
	name: 'related-events',
	title: 'Related Events',
	icon: VscCalendar,
	type: 'object',
	groups: [
		{ name: 'content', title: 'Content', default: true },
		{ name: 'settings', title: 'Settings' },
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
			name: 'currentEventId',
			title: 'Current Event ID',
			type: 'string',
			description: 'ID of the current event to exclude from related events',
			group: 'settings',
			validation: (Rule) => Rule.required(),
		}),
		defineField({
			name: 'maxEvents',
			title: 'Maximum Events',
			type: 'number',
			initialValue: 6,
			validation: (Rule) => Rule.min(1).max(12),
			group: 'settings',
		}),
		textAlign,
	],
	preview: {
		select: {
			title: 'title',
		},
		prepare: ({ title }) => ({
			title: title || 'Related Events',
			media: VscCalendar,
		}),
	},
})
