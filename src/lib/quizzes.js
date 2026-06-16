// Quiz catalog. Each quiz is a self-contained object so new ones can be added
// here without touching the page. Questions hold answers keyed by a letter; the
// result with the most-picked letter wins, with optional two-letter tie-breaks.

/**
 * @typedef {Object} Answer
 * @property {string} key   Letter bucket this answer feeds (A, B, C, D...).
 * @property {string} text  What the player reads.
 *
 * @typedef {Object} Question
 * @property {string} prompt
 * @property {Answer[]} answers
 *
 * @typedef {Object} Result
 * @property {string} title    e.g. "Lion"
 * @property {string} emoji
 * @property {string} blurb
 *
 * @typedef {Object} Quiz
 * @property {string} id
 * @property {string} name
 * @property {string} emoji
 * @property {string} tagline
 * @property {string} accent   CSS color for this quiz's theming.
 * @property {Question[]} questions
 * @property {Record<string, Result>} results       Keyed by single letter.
 * @property {Record<string, Result>} [ties]        Keyed by sorted letter pair e.g. "AB".
 */

/** @type {Quiz[]} */
export const quizzes = [
	{
		id: 'animal',
		name: 'What Animal Are You?',
		emoji: '🦁',
		tagline: 'Ten quick questions reveal your inner creature.',
		accent: '#E8923C',
		questions: [
			{
				prompt: 'Your friends would describe you as:',
				answers: [
					{ key: 'A', text: 'Brave and confident' },
					{ key: 'B', text: 'Smart and observant' },
					{ key: 'C', text: 'Loyal and friendly' },
					{ key: 'D', text: 'Calm and independent' }
				]
			},
			{
				prompt: 'At a party or hangout, you are usually:',
				answers: [
					{ key: 'A', text: 'Leading the fun' },
					{ key: 'B', text: 'Watching and figuring people out' },
					{ key: 'C', text: 'Talking with everyone' },
					{ key: 'D', text: 'Chilling in your own space' }
				]
			},
			{
				prompt: 'If there’s a problem, you:',
				answers: [
					{ key: 'A', text: 'Face it head-on' },
					{ key: 'B', text: 'Think of a clever solution' },
					{ key: 'C', text: 'Ask others for help and teamwork' },
					{ key: 'D', text: 'Stay calm and handle it quietly' }
				]
			},
			{
				prompt: 'Your favorite type of activity is:',
				answers: [
					{ key: 'A', text: 'Sports, challenges, or adventures' },
					{ key: 'B', text: 'Puzzles, games, or learning new things' },
					{ key: 'C', text: 'Hanging out with friends' },
					{ key: 'D', text: 'Relaxing, drawing, reading, or exploring alone' }
				]
			},
			{
				prompt: 'Pick a superpower:',
				answers: [
					{ key: 'A', text: 'Super strength' },
					{ key: 'B', text: 'Mind-reading' },
					{ key: 'C', text: 'Healing powers' },
					{ key: 'D', text: 'Invisibility' }
				]
			},
			{
				prompt: 'What bothers you the most?',
				answers: [
					{ key: 'A', text: 'Being told you can’t do something' },
					{ key: 'B', text: 'People not thinking things through' },
					{ key: 'C', text: 'Friends fighting' },
					{ key: 'D', text: 'Too much noise or attention' }
				]
			},
			{
				prompt: 'Your dream home would be:',
				answers: [
					{ key: 'A', text: 'Somewhere wild and exciting' },
					{ key: 'B', text: 'Somewhere with secret rooms and cool tech' },
					{ key: 'C', text: 'Somewhere cozy with lots of people around' },
					{ key: 'D', text: 'Somewhere peaceful and quiet' }
				]
			},
			{
				prompt: 'If you joined a team, you would be:',
				answers: [
					{ key: 'A', text: 'The captain' },
					{ key: 'B', text: 'The strategist' },
					{ key: 'C', text: 'The supporter' },
					{ key: 'D', text: 'The quiet expert' }
				]
			},
			{
				prompt: 'Choose a snack:',
				answers: [
					{ key: 'A', text: 'Spicy chips' },
					{ key: 'B', text: 'Trail mix' },
					{ key: 'C', text: 'Cookies to share' },
					{ key: 'D', text: 'Fruit or something simple' }
				]
			},
			{
				prompt: 'Which word fits you best?',
				answers: [
					{ key: 'A', text: 'Bold' },
					{ key: 'B', text: 'Clever' },
					{ key: 'C', text: 'Caring' },
					{ key: 'D', text: 'Mysterious' }
				]
			}
		],
		results: {
			A: {
				title: 'Lion',
				emoji: '🦁',
				blurb:
					'You are bold, brave, and confident. You like challenges and don’t give up easily. People may look to you as a leader. Just remember that great leaders also listen to others.'
			},
			B: {
				title: 'Owl',
				emoji: '🦉',
				blurb:
					'You are thoughtful, smart, and observant. You notice details that other people miss. You probably like solving problems or learning interesting facts. Your brain is one of your biggest strengths.'
			},
			C: {
				title: 'Dog',
				emoji: '🐶',
				blurb:
					'You are loyal, friendly, and caring. You like being around people and making others feel included. Friends probably trust you because you’re supportive and kind.'
			},
			D: {
				title: 'Cat',
				emoji: '🐱',
				blurb:
					'You are independent, calm, and a little mysterious. You enjoy doing things your own way and may like quiet time. You don’t need a crowd to feel happy, and that makes you confident in your own style.'
			}
		},
		ties: {
			AB: { title: 'Tiger', emoji: '🐯', blurb: 'Brave and clever.' },
			AC: { title: 'Wolf', emoji: '🐺', blurb: 'A strong leader who cares about their group.' },
			AD: { title: 'Panther', emoji: '🐈‍⬛', blurb: 'Bold, quiet, and independent.' },
			BC: { title: 'Dolphin', emoji: '🐬', blurb: 'Smart, social, and helpful.' },
			BD: { title: 'Fox', emoji: '🦊', blurb: 'Clever, quiet, and creative.' },
			CD: { title: 'Panda', emoji: '🐼', blurb: 'Kind, calm, and peaceful.' }
		}
	}
];

/**
 * Score a finished quiz from the list of chosen letters.
 * Returns the single-letter winner, or the matching two-letter tie result when
 * exactly two letters share the top count and a tie entry exists.
 *
 * @param {Quiz} quiz
 * @param {string[]} picks  One letter per answered question.
 * @returns {{ result: Result, key: string }}
 */
export function scoreQuiz(quiz, picks) {
	/** @type {Record<string, number>} */
	const tally = {};
	for (const letter of picks) {
		tally[letter] = (tally[letter] ?? 0) + 1;
	}

	const max = Math.max(...Object.values(tally));
	const leaders = Object.keys(tally)
		.filter((letter) => tally[letter] === max)
		.sort();

	if (leaders.length === 2 && quiz.ties) {
		const tieKey = leaders.join('');
		if (quiz.ties[tieKey]) {
			return { result: quiz.ties[tieKey], key: tieKey };
		}
	}

	// Single winner, a 3+ way tie, or no tie entry: take the first leader.
	const key = leaders[0];
	return { result: quiz.results[key], key };
}
