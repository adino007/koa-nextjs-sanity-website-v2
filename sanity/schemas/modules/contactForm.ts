import { defineType, defineField } from 'sanity'

export default defineType({
	name: 'contactForm',
	title: 'Contact Form',
	type: 'object',
	fields: [
		defineField({
			name: 'title',
			title: 'Form Title',
			type: 'string',
		}),
		defineField({
			name: 'description',
			title: 'Form Description',
			type: 'text',
		}),
		defineField({
			name: 'submitButtonText',
			title: 'Submit Button Text',
			type: 'string',
			initialValue: 'Send Message',
		}),
		defineField({
			name: 'successMessage',
			title: 'Success Message',
			type: 'string',
			initialValue: 'Thank you for your message. We will get back to you soon!',
		}),
	],
})
