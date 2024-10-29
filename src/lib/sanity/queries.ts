import { fetchSanity, groq } from './fetch'

// --- LINK QUERY ---
export const linkQuery = groq`
  ...,
  internal->{ _type, title, metadata }
`

// --- HERO VIDEO QUERY ---
export const heroVideoQuery = groq`
  *[_type == "hero.video"]{
    ...,
    "muxVideo": muxVideo.asset->{
      playbackId,
      status,
      filename
    }
  }
`

export async function getHeroVideo() {
	const heroVideo = await fetchSanity(heroVideoQuery)
	if (!heroVideo || heroVideo.length === 0) {
		throw new Error('No hero video found in Sanity.')
	}
	return heroVideo[0]
}

// --- NAVIGATION QUERY ---
const navigationQuery = groq`
  title,
  items[]{
    ${linkQuery},
    link{ ${linkQuery} },
    links[]{ ${linkQuery} }
  }
`

// --- CTA QUERY ---
export const ctaQuery = groq`
  ...,
  link{ ${linkQuery} }
`

export async function getSite() {
	const site = await fetchSanity<Sanity.Site>(
		groq`
      *[_type == 'site'][0]{
        ...,
        ctas[]{ ${ctaQuery} },
        headerMenu->{ ${navigationQuery} },
        footerMenu->{ ${navigationQuery} },
        social->{ ${navigationQuery} },
        'ogimage': ogimage.asset->url
      }
    `,
		{ tags: ['site'] },
	)
	if (!site) throw new Error("Missing 'site' document in Sanity Studio")
	return site
}

// --- ARTIST QUERY ---
export const artistQuery = groq`
  *[_type == "artist"]{
    _id,
    name,
    photo{
      asset->{
        url
      }
    },
    bio,
    socialLinks,
    "gallery": gallery[].asset->url,
    "upcomingEvents": upcomingEvents[]->{
      _id,
      name,
      date,
      venue->{
        name
      }
    },
    "pastEvents": pastEvents[]->{
      _id,
      name,
      date,
      venue->{
        name
      }
    }
  }
`

export async function getArtists() {
	const artists = await fetchSanity(artistQuery)
	return artists
}

// --- EVENT QUERY ---
export const eventQuery = groq`
  *[_type == "event"]{
    _id,
    name,
    date,
    time{
      start,
      end
    },
    venue->{
      _id,
      name,
      location,
      description
    },
    artists[]->{
      _id,
      name,
      bio,
      photo{
        asset->{
          url
        }
      }
    },
    flyer{
      asset->{
        url
      }
    },
    gallery[]{
      asset->{
        url
      }
    },
    links
  }
`

export async function getEvents() {
	const events = await fetchSanity(eventQuery)
	return events
}

// queries.ts
export const galleryQuery = groq`
    *[_type == "event" && defined(gallery)] {
    _id,
    name,
    date,
    gallery[]{
      _type,
      asset->{
        url,
        "muxPlaybackId": coalesce(mux.assetId, null)
      }
    }
  }
`
// Fetch function to get gallery data
export async function getGallery() {
	const galleryData = await fetchSanity(galleryQuery)
	return galleryData
}

// --- VENUE QUERY ---
export const venueQuery = groq`
  *[_type == "venue"]{
    name,
    location,
    description,
    socialLinks,
    "upcomingEvents": *[_type == "event" && references(^._id) && date >= now()]{
      name,
      date
    },
    "pastEvents": *[_type == "event" && references(^._id) && date < now()]{
      name,
      date
    }
  }
`

export async function getVenues() {
	const venues = await fetchSanity(venueQuery)
	return venues
}

// --- MODULES QUERY (including artist.grid and event.grid) ---
export const modulesQuery = groq`
  ...,
  ctas[]{
    ...,
    link{ ${linkQuery} }
  },
  _type == 'blog-list' => { filteredCategory-> },
  _type == 'breadcrumbs' => { crumbs[]{ ${linkQuery} } },
  _type == 'creative-module' => {
    modules[]{
      ...,
      subModules[]{
        ...,
        ctas[]{ ${ctaQuery} }
      }
    }
  },
  _type == 'hero' => { reputation-> },
  _type == 'hero.video' => {
    ...,
    "muxVideo": muxVideo.asset->{
      playbackId,
      status,
      filename
    },
    ctas[]{ ${ctaQuery} }
  },
  _type == 'hero.saas' => { reputation-> },
  _type == 'hero.split' => { reputation-> },
  _type == 'logo-list' => { logos[]-> },
  _type == 'pricing-list' => {
    tiers[]->{
      ...,
      ctas[]{ ${ctaQuery} }
    }
  },
  _type == 'richtext-module' => {
    'headings': select(
      tableOfContents => content[style in ['h2', 'h3', 'h4', 'h5', 'h6']]{
        style,
        'text': pt::text(@)
      }
    )
  },
  _type == 'artist.grid' => {
    ...,
    "artists": *[_type == "artist"]{ name, photo, bio }
  },
  _type == 'event.grid' => {
    ...,
    "events": *[_type == "event"]{
      name,
      date,
      time,
      venue->{ name, location },
      flyer{ asset->{ url } }
    }
  },
  _type == 'gallery' => {
    ...,
    "events": *[_type == "event" && defined(gallery)]{
      _id,
      name,
      date,
      gallery[]{
        _type,
        asset->{
          url,
          "muxPlaybackId": coalesce(mux.assetId, null)
        }
      }
    }
  },
  _type == 'testimonial.featured' => { testimonial-> },
  _type == 'testimonial-list' => { testimonials[]-> },
`

// ### Explanation:

// 1. **Artist Grid Query:**
//    - For the `artist.grid` module, we fetch all artists with their `name`, `photo`, and `bio`.
//    - This allows you to render an artist grid that is dynamically populated from Sanity.

// 2. **Event Grid Query:**
//    - For the `event.grid` module, we fetch event details including `name`, `date`, `time`, `venue`, and `flyer`.
//    - This allows you to display a grid of events with relevant information from Sanity.

// 3. **Modular Fetching:**
//    - The queries for `artist.grid` and `event.grid` are now part of the `modulesQuery`, ensuring they can be used within your modular components, just like any other module in Sanity.

// 4. **Scalability:**
//    - If you add more modules in the future, you can simply append them to the `modulesQuery` without disrupting the structure.

// This implementation ensures that your `artist.grid` and `event.grid` modules are both properly queried and can be displayed as part of your modular system within Sanity and Next.js. If you need any adjustments or additional enhancements, feel free to ask!
