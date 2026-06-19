// Central registry of playable games. Add a new game by appending an entry
// here and creating a route at src/routes/(pages)/games/<slug>/+page.svelte.
//
// `slug`   — URL segment under /games and folder name under src/lib/games/
// `title`  — display name
// `blurb`  — one-line description for the index card
// `accent` — hex color used to theme the card border + button
// `emoji`  — small glyph shown on the card (cheap art until we have thumbnails)

/**
 * @typedef {Object} GameMeta
 * @property {string} slug
 * @property {string} title
 * @property {string} blurb
 * @property {string} accent
 * @property {string} emoji
 * @property {string} [href]
 */

/** @type {GameMeta[]} */
export const games = [
	{
		slug: 'dragon-portal',
		title: 'Dragon Portal',
		blurb: 'Run, jump, and breathe fire across the sky to reach the swirling portal.',
		accent: '#dc2323',
		emoji: '🐉'
	},
	{
		slug: 'programiz-html-css',
		title: 'Zombie Pixel Runner',
		blurb: 'Jump, dodge, and race through a neon platformer challenge.',
		accent: '#7c4dff',
		emoji: '🕹️'
	},
	{
		slug: 'ice-lizard',
		title: 'Ice Lizard vs Glacier Monsters',
		blurb: 'Freeze enemies and platform through 5 icy levels as a blue ice lizard.',
		accent: '#55aad2',
		emoji: '🦎'
	}
];

/**
 * Look up a single game by its slug.
 * @param {string} slug
 * @returns {GameMeta | undefined}
 */
export function getGame(slug) {
	return games.find((g) => g.slug === slug);
}
