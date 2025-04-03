import { defineField, defineType } from 'sanity'
import { VscCalendar } from 'react-icons/vsc'

export default defineType({
	name: 'event-showcase',
	title: 'Event Showcase',
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
			title: 'Section Title',
			description: 'e.g. "Upcoming Events" or "This Weekend"',
			group: 'content',
		}),
		defineField({
			name: 'description',
			type: 'array',
			of: [{ type: 'block' }],
			title: 'Description',
			group: 'content',
		}),
		defineField({
			name: 'maxEvents',
			type: 'number',
			title: 'Number of Events',
			description: 'Maximum number of events to display',
			initialValue: 3,
			validation: (Rule) => Rule.min(1).max(10),
			group: 'settings',
		}),
		defineField({
			name: 'displayStyle',
			type: 'string',
			title: 'Display Style',
			options: {
				list: [
					{ title: 'Desert Neon (Purple/Pink)', value: 'desert-neon' },
					{ title: 'Classic Dark', value: 'classic-dark' },
					{ title: 'Minimal Light', value: 'minimal-light' },
				],
			},
			initialValue: 'desert-neon',
			group: 'settings',
		}),
		defineField({
			name: 'showVenue',
			type: 'boolean',
			title: 'Show Venue',
			description: 'Display venue information below each event',
			initialValue: true,
			group: 'settings',
		}),
		defineField({
			name: 'showDate',
			type: 'boolean',
			title: 'Show Date',
			description: 'Display event date',
			initialValue: true,
			group: 'settings',
		}),
		defineField({
			name: 'textAlign',
			type: 'string',
			title: 'Text Alignment',
			options: {
				list: [
					{ title: 'Left', value: 'left' },
					{ title: 'Center', value: 'center' },
					{ title: 'Right', value: 'right' },
				],
			},
			initialValue: 'center',
			group: 'settings',
		}),
	],
	preview: {
		select: {
			title: 'title',
			style: 'displayStyle',
		},
		prepare: ({ title, style }) => ({
			title: title || 'Event Showcase',
			subtitle: `Style: ${style}`,
			media: VscCalendar,
		}),
	},
})
