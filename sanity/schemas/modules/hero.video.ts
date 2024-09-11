import { defineField, defineType } from 'sanity'
import { TfiLayoutCtaCenter } from 'react-icons/tfi'
import { getBlockText } from '../../src/utils'
import {
	textAlign,
	alignItems,
	alignmentFieldset,
} from '../fragments/fields/alignment'

export default defineType({
	name: 'hero.video',
	title: 'Hero (Video)',
	icon: TfiLayoutCtaCenter,
	type: 'object',
	groups: [
		{ name: 'content', default: true },
		{ name: 'video' },
		{ name: 'options' },
	],
	fieldsets: [alignmentFieldset],
	fields: [
		defineField({
			name: 'content',
			type: 'array',
			of: [{ type: 'block' }],
			group: 'content',
		}),
		defineField({
			name: 'ctas',
			title: 'Call-to-actions',
			type: 'array',
			of: [{ type: 'cta' }],
			group: 'content',
		}),
		defineField({
			name: 'muxVideo',
			type: 'mux.video',
			title: 'Background Video',
			description: 'Upload or select a video from Mux',
			group: 'video',
		}),
		defineField({
			...textAlign,
			fieldset: 'alignment',
		}),
		defineField({
			...alignItems,
			fieldset: 'alignment',
		}),
	],
	preview: {
		select: {
			content: 'content',
			media: 'muxVideo',
		},
		prepare: ({ content, media }) => ({
			title: getBlockText(content),
			subtitle: 'Hero (Video)',
			media,
		}),
	},
})
