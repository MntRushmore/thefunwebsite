export async function handle({ event, resolve }) {
	const response = await resolve(event);

	// Add security headers
	response.headers.set('X-Frame-Options', 'SAMEORIGIN');
	response.headers.set('X-Content-Type-Options', 'nosniff');
	response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
	response.headers.set('Permissions-Policy', 'geolocation=(), microphone=(), camera=()');

	// Content Security Policy - allow inline styles/scripts for Svelte
	const csp = [
		"default-src 'self'",
		"script-src 'self' 'unsafe-inline'",
		"style-src 'self' 'unsafe-inline'",
		"img-src 'self' data: https:",
		"font-src 'self' data: https://db.onlinewebfonts.com",
		"connect-src 'self'",
		"media-src 'self' data:",
		"object-src 'none'",
		"frame-src 'self' https://everettmartin.github.io",
		"base-uri 'self'",
		"form-action 'self'",
		"frame-ancestors 'self'"
	].join('; ');

	response.headers.set('Content-Security-Policy', csp);

	return response;
}
