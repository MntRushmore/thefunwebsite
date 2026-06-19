// Central registry of playable puzzles. Add a new puzzle by appending an entry
// here and creating a route at src/routes/(pages)/puzzles/<slug>/+page.svelte.
//
// `slug`   — URL segment under /puzzles and folder name
// `title`  — display name
// `blurb`  — one-line description for the index card
// `accent` — hex color used to theme the card border + button
// `emoji`  — small glyph shown on the card

/**
 * @typedef {Object} PuzzleMeta
 * @property {string} slug
 * @property {string} title
 * @property {string} blurb
 * @property {string} accent
 * @property {string} emoji
 */

/** @type {PuzzleMeta[]} */
export const puzzles = [
	{
		slug: 'wordle',
		title: 'Wordle',
		blurb: 'Guess the 5-letter word in 6 tries. Green means right letter, right spot!',
		accent: '#6aaa64',
		emoji: '🟩'
	},
	{
		slug: 'connections',
		title: 'Connections',
		blurb: 'Group 16 words into 4 secret categories. Find the hidden links!',
		accent: '#a855f7',
		emoji: '🔗'
	},
	{
		slug: 'spelling-bee',
		title: 'Spelling Bee',
		blurb: 'Make as many words as you can using 7 letters. Must use the center!',
		accent: '#f59e0b',
		emoji: '🐝'
	},
	{
		slug: 'mini-crossword',
		title: 'Mini Crossword',
		blurb: 'A quick 5x5 crossword puzzle. Perfect for a brain break!',
		accent: '#3b82f6',
		emoji: '✏️'
	},
	{
		slug: 'memory-match',
		title: 'Memory Match',
		blurb: 'Flip cards and find matching pairs. Test your memory!',
		accent: '#ec4899',
		emoji: '🃏'
	},
	{
		slug: 'number-puzzle',
		title: 'Digits',
		blurb: 'Use math operations to reach the target number. How close can you get?',
		accent: '#14b8a6',
		emoji: '🔢'
	}
];

/**
 * Look up a single puzzle by its slug.
 * @param {string} slug
 * @returns {PuzzleMeta | undefined}
 */
export function getPuzzle(slug) {
	return puzzles.find((p) => p.slug === slug);
}
