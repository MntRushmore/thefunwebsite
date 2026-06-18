import { redirect } from '@sveltejs/kit';

// The dragon game moved under /games. Keep this old path working for the
// landing-page badge and any existing links.
export function load() {
	redirect(308, '/games/dragon-portal');
}
