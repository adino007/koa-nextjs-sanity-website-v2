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
		defineField({
			name: 'sorting',
			title: 'Sorting Order',
			type: 'string',
			options: {
				list: [
					{ title: 'Alphabetical', value: 'alphabetical' },
					{ title: 'Event Date', value: 'date' },
				],
			},
			initialValue: 'alphabetical',
			description: 'Choose the default sorting order for artists.',
		}),
		defineField({
			name: 'filter',
			title: 'Filter by Event',
			type: 'string',
			options: {
				list: [
					{ title: 'All', value: 'all' },
					{ title: 'Upcoming Events', value: 'upcoming' },
					{ title: 'Past Events', value: 'past' },
				],
			},
			initialValue: 'all',
			description: 'Filter artists by events: all, upcoming, or past events.',
		}),
		defineField({
			name: 'artists',
			title: 'Artists',
			type: 'array',
			of: [{ type: 'reference', to: [{ type: 'artist' }] }],
			description: 'Select artists to display in the grid.',
		}),
		defineField({
			name: 'events',
			title: 'Events',
			type: 'array',
			of: [{ type: 'reference', to: [{ type: 'event' }] }],
			description: 'Optionally link specific events to show in the grid.',
		}),
	],
	preview: {
		select: {
			title: 'title',
			artistCount: 'artists.length',
		},
		prepare({ title, artistCount }) {
			return {
				title: title || 'Artist Grid',
				subtitle: `${artistCount || 0} artists`,
			}
		},
	},
})
