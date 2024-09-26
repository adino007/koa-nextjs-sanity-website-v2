export default {
	name: 'venue',
	title: 'Venue',
	type: 'document',
	fields: [
		{
			name: 'name',
			title: 'Venue Name',
			type: 'string',
		},
		{
			name: 'location',
			title: 'Location',
			type: 'string',
		},
		{
			name: 'description',
			title: 'Description',
			type: 'text',
		},
		{
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
						isHighlighted: true, // This ensures the field is easily accessible for editors
					},
				},
			],
		},
		{
			name: 'upcomingEvents',
			title: 'Upcoming Events',
			type: 'array',
			of: [{ type: 'reference', to: [{ type: 'event' }] }],
		},
		{
			name: 'pastEvents',
			title: 'Past Events',
			type: 'array',
			of: [{ type: 'reference', to: [{ type: 'event' }] }],
		},
	],
	preview: {
		select: {
			title: 'name',
			media: 'image',
		},
	},
}
