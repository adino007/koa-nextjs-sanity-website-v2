import { fetchSanity, groq } from '@/lib/sanity/fetch'
import { NextResponse } from 'next/server'

export async function GET() {
	const events = await fetchSanity(
		groq`*[_type == "event"] | order(date desc) {
      _type,
      _id,
      name,
      date,
      slug,
      venue->,
      artists[]->,
      flyer
    }`,
	)

	return NextResponse.json(events)
}
