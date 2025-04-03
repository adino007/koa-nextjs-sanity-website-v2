export type CookieCategory =
	| 'necessary'
	| 'analytics'
	| 'marketing'
	| 'preferences'

export type CookieConsent = {
	necessary: boolean
	analytics: boolean
	marketing: boolean
	preferences: boolean
	timestamp: number
}

export const COOKIE_CONSENT_KEY = 'cookie-consent'
export const COOKIE_PREFERENCES_KEY = 'cookie-preferences'

export const DEFAULT_CONSENT: CookieConsent = {
	necessary: true,
	analytics: false,
	marketing: false,
	preferences: false,
	timestamp: Date.now(),
}

export function getCookieConsent(): CookieConsent {
	if (typeof window === 'undefined') return DEFAULT_CONSENT

	const stored = localStorage.getItem(COOKIE_CONSENT_KEY)
	if (!stored) return DEFAULT_CONSENT

	try {
		return JSON.parse(stored)
	} catch {
		return DEFAULT_CONSENT
	}
}

export function setCookieConsent(consent: Partial<CookieConsent>) {
	if (typeof window === 'undefined') return

	const current = getCookieConsent()
	const updated = {
		...current,
		...consent,
		timestamp: Date.now(),
	}

	localStorage.setItem(COOKIE_CONSENT_KEY, JSON.stringify(updated))
	return updated
}

export function getCookiePreferences(): CookieConsent {
	if (typeof window === 'undefined') return DEFAULT_CONSENT

	const stored = localStorage.getItem(COOKIE_PREFERENCES_KEY)
	if (!stored) return getCookieConsent()

	try {
		return JSON.parse(stored)
	} catch {
		return getCookieConsent()
	}
}

export function setCookiePreferences(preferences: Partial<CookieConsent>) {
	if (typeof window === 'undefined') return

	const current = getCookiePreferences()
	const updated = {
		...current,
		...preferences,
		timestamp: Date.now(),
	}

	localStorage.setItem(COOKIE_PREFERENCES_KEY, JSON.stringify(updated))
	return updated
}

export function isCategoryAllowed(category: CookieCategory): boolean {
	const consent = getCookieConsent()
	return consent[category] || false
}

export function revokeConsent() {
	if (typeof window === 'undefined') return

	localStorage.removeItem(COOKIE_CONSENT_KEY)
	localStorage.removeItem(COOKIE_PREFERENCES_KEY)
	return DEFAULT_CONSENT
}
