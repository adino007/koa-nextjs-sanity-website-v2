'use client'

import { useState } from 'react'

interface ContactFormProps {
	title?: string
	description?: string
	submitButtonText?: string
	successMessage?: string
}

export default function ContactForm({
	title = 'Contact Us',
	description,
	submitButtonText = 'Send Message',
	successMessage = 'Thank you for your message!',
}: ContactFormProps) {
	const [isSubmitting, setIsSubmitting] = useState(false)
	const [isSuccess, setIsSuccess] = useState(false)

	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault()
		setIsSubmitting(true)

		const formData = new FormData(e.currentTarget)
		const data = Object.fromEntries(formData)

		try {
			// Add your form submission logic here
			// Example: await fetch('/api/contact', { method: 'POST', body: JSON.stringify(data) })
			setIsSuccess(true)
		} catch (error) {
			console.error('Error submitting form:', error)
		} finally {
			setIsSubmitting(false)
		}
	}

	return (
		<div className="container mx-auto px-4 py-12">
			<div className="mx-auto max-w-2xl">
				{title && <h2 className="mb-4 text-3xl font-bold">{title}</h2>}
				{description && <p className="mb-8 text-gray-600">{description}</p>}

				{isSuccess ? (
					<div className="rounded-lg bg-green-50 p-4 text-green-700">
						{successMessage}
					</div>
				) : (
					<form onSubmit={handleSubmit} className="space-y-6">
						<div>
							<label htmlFor="name" className="mb-2 block text-sm font-medium">
								Name
							</label>
							<input
								type="text"
								id="name"
								name="name"
								required
								className="w-full rounded-lg border px-4 py-2"
							/>
						</div>
						<div>
							<label htmlFor="email" className="mb-2 block text-sm font-medium">
								Email
							</label>
							<input
								type="email"
								id="email"
								name="email"
								required
								className="w-full rounded-lg border px-4 py-2"
							/>
						</div>
						<div>
							<label
								htmlFor="message"
								className="mb-2 block text-sm font-medium"
							>
								Message
							</label>
							<textarea
								id="message"
								name="message"
								required
								rows={4}
								className="w-full rounded-lg border px-4 py-2"
							/>
						</div>
						<button
							type="submit"
							disabled={isSubmitting}
							className="w-full rounded-lg bg-black px-6 py-3 text-white transition-colors hover:bg-gray-800 disabled:opacity-50"
						>
							{isSubmitting ? 'Sending...' : submitButtonText}
						</button>
					</form>
				)}
			</div>
		</div>
	)
}
