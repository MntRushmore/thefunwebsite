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
	},
	{
		id: 'pizza',
		name: 'Which Pizza Topping Are You?',
		emoji: '🍕',
		tagline: 'A cheesy little quiz to find your slice of life.',
		accent: '#D64545',
		questions: [
			{
				prompt: 'Your ideal weekend is:',
				answers: [
					{ key: 'A', text: 'Loud, packed, and full of plans' },
					{ key: 'B', text: 'A few close friends and good vibes' },
					{ key: 'C', text: 'Something totally new and random' },
					{ key: 'D', text: 'Cozy at home, no surprises' }
				]
			},
			{
				prompt: 'How do you make decisions?',
				answers: [
					{ key: 'A', text: 'Go big or go home' },
					{ key: 'B', text: 'Whatever keeps everyone happy' },
					{ key: 'C', text: 'Trust the chaos' },
					{ key: 'D', text: 'Keep it classic and safe' }
				]
			},
			{
				prompt: 'Pick a vibe:',
				answers: [
					{ key: 'A', text: 'Spicy and bold' },
					{ key: 'B', text: 'Warm and friendly' },
					{ key: 'C', text: 'Weird and wonderful' },
					{ key: 'D', text: 'Simple and reliable' }
				]
			},
			{
				prompt: 'Your friends call you the:',
				answers: [
					{ key: 'A', text: 'Hype machine' },
					{ key: 'B', text: 'Glue of the group' },
					{ key: 'C', text: 'Wildcard' },
					{ key: 'D', text: 'Steady one' }
				]
			},
			{
				prompt: 'Choose a color:',
				answers: [
					{ key: 'A', text: 'Fiery red' },
					{ key: 'B', text: 'Sunny yellow' },
					{ key: 'C', text: 'Electric purple' },
					{ key: 'D', text: 'Calm beige' }
				]
			},
			{
				prompt: 'What ruins a good day?',
				answers: [
					{ key: 'A', text: 'Boredom' },
					{ key: 'B', text: 'Drama between friends' },
					{ key: 'C', text: 'Everything being too predictable' },
					{ key: 'D', text: 'Sudden chaos' }
				]
			},
			{
				prompt: 'Pick a movie night genre:',
				answers: [
					{ key: 'A', text: 'Action blockbuster' },
					{ key: 'B', text: 'Feel-good comedy' },
					{ key: 'C', text: 'Something nobody’s heard of' },
					{ key: 'D', text: 'A classic you’ve seen 10 times' }
				]
			},
			{
				prompt: 'Your energy level is usually:',
				answers: [
					{ key: 'A', text: 'Maxed out' },
					{ key: 'B', text: 'Warm and steady' },
					{ key: 'C', text: 'Unpredictable' },
					{ key: 'D', text: 'Chill and even' }
				]
			},
			{
				prompt: 'Pick a dessert:',
				answers: [
					{ key: 'A', text: 'Hot fudge sundae' },
					{ key: 'B', text: 'Fresh-baked cookies' },
					{ key: 'C', text: 'Some flavor you can’t pronounce' },
					{ key: 'D', text: 'Plain vanilla, and proud of it' }
				]
			},
			{
				prompt: 'One word for you:',
				answers: [
					{ key: 'A', text: 'Fierce' },
					{ key: 'B', text: 'Friendly' },
					{ key: 'C', text: 'Quirky' },
					{ key: 'D', text: 'Dependable' }
				]
			}
		],
		results: {
			A: {
				title: 'Pepperoni',
				emoji: '🍕',
				blurb:
					'You are the bold crowd-pleaser everyone gets excited about. You bring the heat and the energy, and a party isn’t really a party until you show up.'
			},
			B: {
				title: 'Extra Cheese',
				emoji: '🧀',
				blurb:
					'You are warm, comforting, and impossible not to love. You hold your friend group together and make everyone feel a little cozier just by being around.'
			},
			C: {
				title: 'Pineapple',
				emoji: '🍍',
				blurb:
					'You are delightfully unexpected. Some people don’t get you at first, but the ones who do are obsessed. You make life more interesting.'
			},
			D: {
				title: 'Plain Cheese',
				emoji: '🍕',
				blurb:
					'You are a timeless classic. Reliable, drama-free, and secretly everyone’s favorite when things get complicated. Never underestimate a classic.'
			}
		},
		ties: {
			AB: { title: 'Meat Lovers', emoji: '🥓', blurb: 'Bold and beloved by the whole crew.' },
			AC: { title: 'Buffalo Chicken', emoji: '🌶️', blurb: 'Spicy with a wild streak.' },
			AD: { title: 'Sausage', emoji: '🍕', blurb: 'Bold but dependable.' },
			BC: { title: 'Veggie Supreme', emoji: '🫑', blurb: 'Friendly and a little fancy.' },
			BD: { title: 'Margherita', emoji: '🍅', blurb: 'Cozy and timeless.' },
			CD: { title: 'BBQ Chicken', emoji: '🍗', blurb: 'Quirky but easy to love.' }
		}
	},
	{
		id: 'superhero',
		name: 'What’s Your Superpower?',
		emoji: '🦸',
		tagline: 'Discover the hidden power you were born with.',
		accent: '#3C7DE8',
		questions: [
			{
				prompt: 'In a crisis, you:',
				answers: [
					{ key: 'A', text: 'Jump in and take charge' },
					{ key: 'B', text: 'Figure out the smartest move' },
					{ key: 'C', text: 'Make sure everyone’s okay' },
					{ key: 'D', text: 'Slip away and handle it solo' }
				]
			},
			{
				prompt: 'Your secret strength is:',
				answers: [
					{ key: 'A', text: 'Pure courage' },
					{ key: 'B', text: 'A brilliant mind' },
					{ key: 'C', text: 'A huge heart' },
					{ key: 'D', text: 'Total focus' }
				]
			},
			{
				prompt: 'People come to you for:',
				answers: [
					{ key: 'A', text: 'Motivation' },
					{ key: 'B', text: 'Answers' },
					{ key: 'C', text: 'Comfort' },
					{ key: 'D', text: 'Getting things done' }
				]
			},
			{
				prompt: 'Your ideal sidekick is:',
				answers: [
					{ key: 'A', text: 'A loyal fighter' },
					{ key: 'B', text: 'A genius gadget-maker' },
					{ key: 'C', text: 'A kind healer' },
					{ key: 'D', text: 'A silent shadow' }
				]
			},
			{
				prompt: 'Pick a lair:',
				answers: [
					{ key: 'A', text: 'A mountaintop fortress' },
					{ key: 'B', text: 'A high-tech lab' },
					{ key: 'C', text: 'A safe haven for everyone' },
					{ key: 'D', text: 'A hidden underground base' }
				]
			},
			{
				prompt: 'Your weakness might be:',
				answers: [
					{ key: 'A', text: 'Being too reckless' },
					{ key: 'B', text: 'Overthinking everything' },
					{ key: 'C', text: 'Caring too much' },
					{ key: 'D', text: 'Working alone too often' }
				]
			},
			{
				prompt: 'Pick a costume color:',
				answers: [
					{ key: 'A', text: 'Blazing red' },
					{ key: 'B', text: 'Sleek silver' },
					{ key: 'C', text: 'Glowing gold' },
					{ key: 'D', text: 'Midnight black' }
				]
			},
			{
				prompt: 'Your battle cry is:',
				answers: [
					{ key: 'A', text: '“Let’s go!”' },
					{ key: 'B', text: '“I’ve got a plan.”' },
					{ key: 'C', text: '“I’ve got you.”' },
					{ key: 'D', text: '“…”' }
				]
			},
			{
				prompt: 'You win by:',
				answers: [
					{ key: 'A', text: 'Never backing down' },
					{ key: 'B', text: 'Outsmarting the enemy' },
					{ key: 'C', text: 'Bringing people together' },
					{ key: 'D', text: 'Striking when no one expects it' }
				]
			},
			{
				prompt: 'One word for your hero:',
				answers: [
					{ key: 'A', text: 'Fearless' },
					{ key: 'B', text: 'Genius' },
					{ key: 'C', text: 'Protector' },
					{ key: 'D', text: 'Stealthy' }
				]
			}
		],
		results: {
			A: {
				title: 'Super Strength',
				emoji: '💪',
				blurb:
					'You charge in where others freeze. Your power is unstoppable courage — when something needs doing, you’re the one who makes it happen. Just remember even the strongest heroes need a team.'
			},
			B: {
				title: 'Super Intelligence',
				emoji: '🧠',
				blurb:
					'Your mind is your greatest weapon. You see solutions nobody else can and you’re always three steps ahead. The world needs thinkers like you to outsmart any challenge.'
			},
			C: {
				title: 'Healing Powers',
				emoji: '💖',
				blurb:
					'Your superpower is your heart. You lift people up, mend what’s broken, and make everyone feel safe. Never underestimate how powerful kindness really is.'
			},
			D: {
				title: 'Invisibility',
				emoji: '🌫️',
				blurb:
					'You move unseen and strike when it matters most. You’re focused, mysterious, and full of surprises. People never see your brilliance coming until it’s too late.'
			}
		},
		ties: {
			AB: { title: 'Flight', emoji: '🦅', blurb: 'Brave and brilliant — nothing can hold you down.' },
			AC: { title: 'Super Speed', emoji: '⚡', blurb: 'Fast, fearless, and always there to help.' },
			AD: { title: 'Force Fields', emoji: '🛡️', blurb: 'Tough, focused, and unbreakable.' },
			BC: { title: 'Telepathy', emoji: '🔮', blurb: 'A wise mind with a caring soul.' },
			BD: { title: 'Time Control', emoji: '⏳', blurb: 'Clever and quietly unstoppable.' },
			CD: { title: 'Shapeshifting', emoji: '🦎', blurb: 'Kind, adaptable, and full of secrets.' }
		}
	},
	{
		id: 'season',
		name: 'Which Season Matches Your Soul?',
		emoji: '🍂',
		tagline: 'Spring, summer, fall, or winter — what are you really?',
		accent: '#E07A5F',
		questions: [
			{
				prompt: 'Your perfect day feels:',
				answers: [
					{ key: 'A', text: 'Fresh and full of new beginnings' },
					{ key: 'B', text: 'Bright, hot, and adventurous' },
					{ key: 'C', text: 'Cozy and a little nostalgic' },
					{ key: 'D', text: 'Quiet, crisp, and peaceful' }
				]
			},
			{
				prompt: 'Pick a drink:',
				answers: [
					{ key: 'A', text: 'Fresh-squeezed lemonade' },
					{ key: 'B', text: 'An ice-cold smoothie' },
					{ key: 'C', text: 'A warm spiced latte' },
					{ key: 'D', text: 'Hot cocoa by the fire' }
				]
			},
			{
				prompt: 'Your style is:',
				answers: [
					{ key: 'A', text: 'Light, fun, and colorful' },
					{ key: 'B', text: 'Bold and breezy' },
					{ key: 'C', text: 'Cozy layers and warm tones' },
					{ key: 'D', text: 'Soft, snug, and minimal' }
				]
			},
			{
				prompt: 'How do you recharge?',
				answers: [
					{ key: 'A', text: 'Trying something brand new' },
					{ key: 'B', text: 'Out with friends in the sun' },
					{ key: 'C', text: 'A long walk and good thoughts' },
					{ key: 'D', text: 'Staying in, warm and calm' }
				]
			},
			{
				prompt: 'Pick a sound:',
				answers: [
					{ key: 'A', text: 'Birds chirping' },
					{ key: 'B', text: 'Waves on the beach' },
					{ key: 'C', text: 'Leaves crunching' },
					{ key: 'D', text: 'Silent snowfall' }
				]
			},
			{
				prompt: 'Your mood is usually:',
				answers: [
					{ key: 'A', text: 'Hopeful and excited' },
					{ key: 'B', text: 'Energetic and social' },
					{ key: 'C', text: 'Thoughtful and warm' },
					{ key: 'D', text: 'Calm and reflective' }
				]
			},
			{
				prompt: 'Pick a vacation:',
				answers: [
					{ key: 'A', text: 'A blooming garden city' },
					{ key: 'B', text: 'A tropical beach' },
					{ key: 'C', text: 'A cabin in the woods' },
					{ key: 'D', text: 'A snowy mountain town' }
				]
			},
			{
				prompt: 'What do you value most?',
				answers: [
					{ key: 'A', text: 'Growth' },
					{ key: 'B', text: 'Fun' },
					{ key: 'C', text: 'Comfort' },
					{ key: 'D', text: 'Peace' }
				]
			},
			{
				prompt: 'Pick a color palette:',
				answers: [
					{ key: 'A', text: 'Pastels and greens' },
					{ key: 'B', text: 'Bright blues and golds' },
					{ key: 'C', text: 'Oranges and browns' },
					{ key: 'D', text: 'Whites and icy blues' }
				]
			},
			{
				prompt: 'One word for you:',
				answers: [
					{ key: 'A', text: 'Hopeful' },
					{ key: 'B', text: 'Vibrant' },
					{ key: 'C', text: 'Cozy' },
					{ key: 'D', text: 'Serene' }
				]
			}
		],
		results: {
			A: {
				title: 'Spring',
				emoji: '🌸',
				blurb:
					'You’re all about fresh starts and growth. You bring hope and new energy wherever you go, and people feel lighter around you. You’re proof that good things bloom.'
			},
			B: {
				title: 'Summer',
				emoji: '☀️',
				blurb:
					'You’re warm, lively, and impossible to ignore. You chase fun and adventure, and your energy lights up every room. Life’s a party and you’re always invited.'
			},
			C: {
				title: 'Autumn',
				emoji: '🍂',
				blurb:
					'You’re cozy, thoughtful, and a little nostalgic. You appreciate the small beautiful moments and make everything feel warmer. People treasure your comforting presence.'
			},
			D: {
				title: 'Winter',
				emoji: '❄️',
				blurb:
					'You’re calm, deep, and quietly powerful. You find beauty in stillness and bring a sense of peace to chaos. There’s magic in your quiet strength.'
			}
		},
		ties: {
			AB: { title: 'Early Summer', emoji: '🌻', blurb: 'Fresh energy with sunshine to spare.' },
			AC: { title: 'Harvest', emoji: '🌾', blurb: 'Growing and grounded all at once.' },
			AD: { title: 'First Frost', emoji: '🌬️', blurb: 'New beginnings with a calm soul.' },
			BC: { title: 'Indian Summer', emoji: '🔥', blurb: 'Warm, lively, and cozy too.' },
			BD: { title: 'Polar Day', emoji: '🌅', blurb: 'Vibrant but with a peaceful heart.' },
			CD: { title: 'Late Autumn', emoji: '🌙', blurb: 'Cozy and serene together.' }
		}
	},
	{
		id: 'snack',
		name: 'What Snack Are You?',
		emoji: '🍿',
		tagline: 'Find out which munchie matches your personality.',
		accent: '#E8A33C',
		questions: [
			{
				prompt: 'At a sleepover you’re the one who:',
				answers: [
					{ key: 'A', text: 'Keeps everyone laughing' },
					{ key: 'B', text: 'Starts the deep midnight talks' },
					{ key: 'C', text: 'Plans the whole night out' },
					{ key: 'D', text: 'Falls asleep first, no shame' }
				]
			},
			{
				prompt: 'Pick a texture:',
				answers: [
					{ key: 'A', text: 'Crunchy' },
					{ key: 'B', text: 'Sweet and gooey' },
					{ key: 'C', text: 'Salty and savory' },
					{ key: 'D', text: 'Soft and simple' }
				]
			},
			{
				prompt: 'Your humor is:',
				answers: [
					{ key: 'A', text: 'Loud and silly' },
					{ key: 'B', text: 'Sweet and goofy' },
					{ key: 'C', text: 'Sharp and clever' },
					{ key: 'D', text: 'Chill and easygoing' }
				]
			},
			{
				prompt: 'Pick a hangout spot:',
				answers: [
					{ key: 'A', text: 'A buzzing arcade' },
					{ key: 'B', text: 'A candy shop' },
					{ key: 'C', text: 'A trendy café' },
					{ key: 'D', text: 'The comfiest couch ever' }
				]
			},
			{
				prompt: 'How do you handle stress?',
				answers: [
					{ key: 'A', text: 'Make jokes about it' },
					{ key: 'B', text: 'Treat yourself' },
					{ key: 'C', text: 'Make a plan' },
					{ key: 'D', text: 'Take it slow' }
				]
			},
			{
				prompt: 'Pick a flavor:',
				answers: [
					{ key: 'A', text: 'Bold and spicy' },
					{ key: 'B', text: 'Super sweet' },
					{ key: 'C', text: 'Salty and rich' },
					{ key: 'D', text: 'Mild and comforting' }
				]
			},
			{
				prompt: 'Your friends rely on you for:',
				answers: [
					{ key: 'A', text: 'Good vibes' },
					{ key: 'B', text: 'A pick-me-up' },
					{ key: 'C', text: 'Smart advice' },
					{ key: 'D', text: 'Calm support' }
				]
			},
			{
				prompt: 'Pick an emoji:',
				answers: [
					{ key: 'A', text: '😂' },
					{ key: 'B', text: '🥰' },
					{ key: 'C', text: '😏' },
					{ key: 'D', text: '😌' }
				]
			},
			{
				prompt: 'Your ideal Friday night:',
				answers: [
					{ key: 'A', text: 'A big group adventure' },
					{ key: 'B', text: 'A fun little treat night' },
					{ key: 'C', text: 'Something a little fancy' },
					{ key: 'D', text: 'Pajamas and a movie' }
				]
			},
			{
				prompt: 'One word for you:',
				answers: [
					{ key: 'A', text: 'Fun' },
					{ key: 'B', text: 'Sweet' },
					{ key: 'C', text: 'Clever' },
					{ key: 'D', text: 'Comforting' }
				]
			}
		],
		results: {
			A: {
				title: 'Popcorn',
				emoji: '🍿',
				blurb:
					'You’re light, fun, and the life of every gathering. People pop in just to be around your energy. You make even an ordinary night feel like an event.'
			},
			B: {
				title: 'Chocolate',
				emoji: '🍫',
				blurb:
					'You’re sweet, comforting, and everyone’s little treat. You know how to brighten a bad day and people are low-key obsessed with you. Stay sweet.'
			},
			C: {
				title: 'Pretzel',
				emoji: '🥨',
				blurb:
					'You’re salty, clever, and a little extra in the best way. You’ve got layers and a twist nobody expects. You keep things interesting.'
			},
			D: {
				title: 'Cookie',
				emoji: '🍪',
				blurb:
					'You’re warm, classic, and impossible not to love. You bring comfort wherever you go and you’re always there when people need a pick-me-up.'
			}
		},
		ties: {
			AB: { title: 'Candy', emoji: '🍬', blurb: 'Fun and sweet — a total mood.' },
			AC: { title: 'Nachos', emoji: '🧀', blurb: 'Fun, bold, and full of flavor.' },
			AD: { title: 'Chips', emoji: '🥔', blurb: 'Fun and comforting all in one.' },
			BC: { title: 'Donut', emoji: '🍩', blurb: 'Sweet with a clever twist.' },
			BD: { title: 'Brownie', emoji: '🍰', blurb: 'Sweet, warm, and cozy.' },
			CD: { title: 'Cheese & Crackers', emoji: '🧀', blurb: 'Clever and comforting.' }
		}
	},
	{
		id: 'element',
		name: 'Which Element Are You?',
		emoji: '🔥',
		tagline: 'Fire, water, earth, or air — what powers you?',
		accent: '#9B5DE5',
		questions: [
			{
				prompt: 'Your personality is best described as:',
				answers: [
					{ key: 'A', text: 'Passionate and fiery' },
					{ key: 'B', text: 'Calm and deep' },
					{ key: 'C', text: 'Steady and grounded' },
					{ key: 'D', text: 'Free and curious' }
				]
			},
			{
				prompt: 'When you’re excited, you:',
				answers: [
					{ key: 'A', text: 'Burst with energy' },
					{ key: 'B', text: 'Feel it deeply and quietly' },
					{ key: 'C', text: 'Stay cool and steady' },
					{ key: 'D', text: 'Bounce between ideas' }
				]
			},
			{
				prompt: 'Pick a place:',
				answers: [
					{ key: 'A', text: 'A roaring bonfire' },
					{ key: 'B', text: 'A deep ocean' },
					{ key: 'C', text: 'A quiet forest' },
					{ key: 'D', text: 'A high mountain peak' }
				]
			},
			{
				prompt: 'Your friends value your:',
				answers: [
					{ key: 'A', text: 'Drive and passion' },
					{ key: 'B', text: 'Emotional depth' },
					{ key: 'C', text: 'Reliability' },
					{ key: 'D', text: 'Imagination' }
				]
			},
			{
				prompt: 'How do you face challenges?',
				answers: [
					{ key: 'A', text: 'Head-on with fire' },
					{ key: 'B', text: 'Adapt and flow around them' },
					{ key: 'C', text: 'Stand firm and outlast them' },
					{ key: 'D', text: 'Find a clever new angle' }
				]
			},
			{
				prompt: 'Pick a power move:',
				answers: [
					{ key: 'A', text: 'Unleash a flame' },
					{ key: 'B', text: 'Command the tides' },
					{ key: 'C', text: 'Shake the ground' },
					{ key: 'D', text: 'Summon a storm' }
				]
			},
			{
				prompt: 'Your weakness is:',
				answers: [
					{ key: 'A', text: 'Burning too hot too fast' },
					{ key: 'B', text: 'Getting lost in feelings' },
					{ key: 'C', text: 'Being too stubborn' },
					{ key: 'D', text: 'Drifting without focus' }
				]
			},
			{
				prompt: 'Pick a time of day:',
				answers: [
					{ key: 'A', text: 'High noon' },
					{ key: 'B', text: 'Late night' },
					{ key: 'C', text: 'Early morning' },
					{ key: 'D', text: 'Golden hour' }
				]
			},
			{
				prompt: 'People feel ___ around you:',
				answers: [
					{ key: 'A', text: 'Energized' },
					{ key: 'B', text: 'Understood' },
					{ key: 'C', text: 'Safe' },
					{ key: 'D', text: 'Inspired' }
				]
			},
			{
				prompt: 'One word for you:',
				answers: [
					{ key: 'A', text: 'Fierce' },
					{ key: 'B', text: 'Deep' },
					{ key: 'C', text: 'Solid' },
					{ key: 'D', text: 'Free' }
				]
			}
		],
		results: {
			A: {
				title: 'Fire',
				emoji: '🔥',
				blurb:
					'You’re passionate, bold, and full of energy. You chase what you want and inspire others to do the same. Your spark is contagious — just remember to rest before you burn out.'
			},
			B: {
				title: 'Water',
				emoji: '🌊',
				blurb:
					'You’re deep, intuitive, and emotionally wise. You adapt to anything and feel things fully. People trust you with their hearts because you truly understand them.'
			},
			C: {
				title: 'Earth',
				emoji: '🌍',
				blurb:
					'You’re grounded, dependable, and strong. You’re the rock everyone leans on, and you bring stability to any storm. People feel safe knowing you’ve got their back.'
			},
			D: {
				title: 'Air',
				emoji: '🌬️',
				blurb:
					'You’re curious, free-spirited, and full of ideas. You see the world from every angle and never stop exploring. Your imagination takes everyone to new places.'
			}
		},
		ties: {
			AB: { title: 'Steam', emoji: '♨️', blurb: 'Passion and depth combined.' },
			AC: { title: 'Lava', emoji: '🌋', blurb: 'Fierce and unstoppable.' },
			AD: { title: 'Lightning', emoji: '⚡', blurb: 'Fiery, fast, and free.' },
			BC: { title: 'Ice', emoji: '🧊', blurb: 'Deep and solid as stone.' },
			BD: { title: 'Mist', emoji: '🌫️', blurb: 'Deep, dreamy, and free.' },
			CD: { title: 'Sandstorm', emoji: '🏜️', blurb: 'Grounded but wild.' }
		}
	},
	{
		id: 'crewrole',
		name: 'What’s Your Friend-Group Role?',
		emoji: '👯',
		tagline: 'Every squad has these. Which one are you?',
		accent: '#F15BB5',
		questions: [
			{
				prompt: 'When the group makes plans, you:',
				answers: [
					{ key: 'A', text: 'Organize the whole thing' },
					{ key: 'B', text: 'Hype everyone up to come' },
					{ key: 'C', text: 'Make sure no one’s left out' },
					{ key: 'D', text: 'Just show up and vibe' }
				]
			},
			{
				prompt: 'Your group chat role is:',
				answers: [
					{ key: 'A', text: 'The one who reminds everyone' },
					{ key: 'B', text: 'The meme machine' },
					{ key: 'C', text: 'The peacemaker' },
					{ key: 'D', text: 'The lurker who drops gold occasionally' }
				]
			},
			{
				prompt: 'At a party you’re:',
				answers: [
					{ key: 'A', text: 'Running logistics' },
					{ key: 'B', text: 'On the dance floor' },
					{ key: 'C', text: 'Having heart-to-hearts' },
					{ key: 'D', text: 'Vibing in the corner happily' }
				]
			},
			{
				prompt: 'When a friend is sad, you:',
				answers: [
					{ key: 'A', text: 'Make a plan to fix it' },
					{ key: 'B', text: 'Cheer them up with fun' },
					{ key: 'C', text: 'Listen for hours' },
					{ key: 'D', text: 'Sit with them, no pressure' }
				]
			},
			{
				prompt: 'Your superpower in the squad:',
				answers: [
					{ key: 'A', text: 'Getting things done' },
					{ key: 'B', text: 'Bringing the fun' },
					{ key: 'C', text: 'Keeping the peace' },
					{ key: 'D', text: 'Being effortlessly chill' }
				]
			},
			{
				prompt: 'Pick a road-trip job:',
				answers: [
					{ key: 'A', text: 'Driver and navigator' },
					{ key: 'B', text: 'DJ and hype crew' },
					{ key: 'C', text: 'Snack manager for all' },
					{ key: 'D', text: 'Window-staring philosopher' }
				]
			},
			{
				prompt: 'Friends describe you as:',
				answers: [
					{ key: 'A', text: 'Dependable' },
					{ key: 'B', text: 'Hilarious' },
					{ key: 'C', text: 'Caring' },
					{ key: 'D', text: 'Easygoing' }
				]
			},
			{
				prompt: 'What stresses you out?',
				answers: [
					{ key: 'A', text: 'When plans fall apart' },
					{ key: 'B', text: 'A boring vibe' },
					{ key: 'C', text: 'Friends arguing' },
					{ key: 'D', text: 'Too much pressure' }
				]
			},
			{
				prompt: 'Pick a snack to bring:',
				answers: [
					{ key: 'A', text: 'A perfectly planned spread' },
					{ key: 'B', text: 'Something fun and wild' },
					{ key: 'C', text: 'Enough to share with everyone' },
					{ key: 'D', text: 'Whatever was in the cabinet' }
				]
			},
			{
				prompt: 'One word for you:',
				answers: [
					{ key: 'A', text: 'Organized' },
					{ key: 'B', text: 'Fun' },
					{ key: 'C', text: 'Kind' },
					{ key: 'D', text: 'Chill' }
				]
			}
		],
		results: {
			A: {
				title: 'The Mom Friend',
				emoji: '🧺',
				blurb:
					'You’re the glue and the planner. Nothing happens without you, and honestly the group would fall apart in a week if you took a vacation. They appreciate you more than they say.'
			},
			B: {
				title: 'The Hype Friend',
				emoji: '🎉',
				blurb:
					'You bring the energy and the laughs. You turn ordinary days into core memories and your enthusiasm is contagious. The party literally starts when you arrive.'
			},
			C: {
				title: 'The Therapist Friend',
				emoji: '🫂',
				blurb:
					'You’re the heart of the group. People come to you with everything because you actually listen and care. You keep the peace and hold everyone together.'
			},
			D: {
				title: 'The Chill Friend',
				emoji: '😎',
				blurb:
					'You’re drama-free and easy to be around. You go with the flow and somehow make everyone feel relaxed. Your calm energy is exactly what the squad needs.'
			}
		},
		ties: {
			AB: { title: 'The Captain', emoji: '🚩', blurb: 'Organized and full of hype.' },
			AC: { title: 'The Rock', emoji: '🪨', blurb: 'Dependable and deeply caring.' },
			AD: { title: 'The Steady One', emoji: '⚓', blurb: 'Organized but easygoing.' },
			BC: { title: 'The Sunshine', emoji: '🌞', blurb: 'Fun and full of heart.' },
			BD: { title: 'The Wildcard', emoji: '🃏', blurb: 'Fun and totally chill.' },
			CD: { title: 'The Comfort Zone', emoji: '🛋️', blurb: 'Kind and calming.' }
		}
	},
	{
		id: 'mythical',
		name: 'Which Mythical Creature Are You?',
		emoji: '🐉',
		tagline: 'Unlock the legendary beast living inside you.',
		accent: '#00BBF9',
		questions: [
			{
				prompt: 'Your energy is:',
				answers: [
					{ key: 'A', text: 'Powerful and proud' },
					{ key: 'B', text: 'Magical and graceful' },
					{ key: 'C', text: 'Wild and untamed' },
					{ key: 'D', text: 'Mysterious and wise' }
				]
			},
			{
				prompt: 'Pick a treasure:',
				answers: [
					{ key: 'A', text: 'A hoard of gold' },
					{ key: 'B', text: 'A shimmering crystal' },
					{ key: 'C', text: 'Total freedom' },
					{ key: 'D', text: 'Ancient knowledge' }
				]
			},
			{
				prompt: 'How do others see you?',
				answers: [
					{ key: 'A', text: 'A bit intimidating' },
					{ key: 'B', text: 'Enchanting' },
					{ key: 'C', text: 'Fearless' },
					{ key: 'D', text: 'Deep and unreadable' }
				]
			},
			{
				prompt: 'Pick a home:',
				answers: [
					{ key: 'A', text: 'A volcanic cavern' },
					{ key: 'B', text: 'An enchanted forest' },
					{ key: 'C', text: 'The open skies' },
					{ key: 'D', text: 'A misty mountain' }
				]
			},
			{
				prompt: 'Your special ability:',
				answers: [
					{ key: 'A', text: 'Breathe fire' },
					{ key: 'B', text: 'Heal with magic' },
					{ key: 'C', text: 'Fly faster than the wind' },
					{ key: 'D', text: 'See the future' }
				]
			},
			{
				prompt: 'What do you fight for?',
				answers: [
					{ key: 'A', text: 'Power and respect' },
					{ key: 'B', text: 'Beauty and good' },
					{ key: 'C', text: 'Freedom and adventure' },
					{ key: 'D', text: 'Truth and balance' }
				]
			},
			{
				prompt: 'Pick a glow:',
				answers: [
					{ key: 'A', text: 'Fiery red-gold' },
					{ key: 'B', text: 'Soft rainbow shimmer' },
					{ key: 'C', text: 'Flashing silver' },
					{ key: 'D', text: 'Deep glowing blue' }
				]
			},
			{
				prompt: 'In a legend, you’d be:',
				answers: [
					{ key: 'A', text: 'The fearsome guardian' },
					{ key: 'B', text: 'The pure-hearted savior' },
					{ key: 'C', text: 'The untamed hero' },
					{ key: 'D', text: 'The ancient oracle' }
				]
			},
			{
				prompt: 'One word for you:',
				answers: [
					{ key: 'A', text: 'Mighty' },
					{ key: 'B', text: 'Magical' },
					{ key: 'C', text: 'Free' },
					{ key: 'D', text: 'Wise' }
				]
			}
		],
		results: {
			A: {
				title: 'Dragon',
				emoji: '🐉',
				blurb:
					'You’re powerful, proud, and impossible to ignore. You command respect wherever you go and you protect what’s yours fiercely. Few dare to challenge your strength.'
			},
			B: {
				title: 'Unicorn',
				emoji: '🦄',
				blurb:
					'You’re magical, kind, and one of a kind. You bring beauty and hope into the world, and people are drawn to your pure, enchanting energy. There’s real magic in you.'
			},
			C: {
				title: 'Griffin',
				emoji: '🦅',
				blurb:
					'You’re wild, fearless, and free. You soar above limits and chase adventure with a brave heart. Nothing can cage your untamed spirit.'
			},
			D: {
				title: 'Phoenix',
				emoji: '🔥',
				blurb:
					'You’re wise, resilient, and always rising. No matter what knocks you down, you come back stronger and brighter. You’re living proof that endings are just new beginnings.'
			}
		},
		ties: {
			AB: { title: 'Pegasus', emoji: '🐴', blurb: 'Mighty and magical.' },
			AC: { title: 'Wyvern', emoji: '🐲', blurb: 'Mighty and free.' },
			AD: { title: 'Kraken', emoji: '🐙', blurb: 'Powerful and ancient.' },
			BC: { title: 'Fairy', emoji: '🧚', blurb: 'Magical and free.' },
			BD: { title: 'Mermaid', emoji: '🧜', blurb: 'Magical and wise.' },
			CD: { title: 'Sphinx', emoji: '🦁', blurb: 'Free-spirited and wise.' }
		}
	},
	{
		id: 'donut',
		name: 'What Kind of Donut Are You?',
		emoji: '🍩',
		tagline: 'A sweet, sprinkly look into your true self.',
		accent: '#FF99C8',
		questions: [
			{
				prompt: 'Your first impression on people is:',
				answers: [
					{ key: 'A', text: 'Fun and colorful' },
					{ key: 'B', text: 'Sweet and classic' },
					{ key: 'C', text: 'A little extra' },
					{ key: 'D', text: 'Cool and simple' }
				]
			},
			{
				prompt: 'Pick a topping:',
				answers: [
					{ key: 'A', text: 'Rainbow sprinkles' },
					{ key: 'B', text: 'Smooth glaze' },
					{ key: 'C', text: 'Gooey filling' },
					{ key: 'D', text: 'Just a little sugar' }
				]
			},
			{
				prompt: 'Your style is:',
				answers: [
					{ key: 'A', text: 'Bright and bold' },
					{ key: 'B', text: 'Soft and pretty' },
					{ key: 'C', text: 'Loud and unexpected' },
					{ key: 'D', text: 'Clean and minimal' }
				]
			},
			{
				prompt: 'How do you cheer someone up?',
				answers: [
					{ key: 'A', text: 'Be their burst of joy' },
					{ key: 'B', text: 'Be sweetly supportive' },
					{ key: 'C', text: 'Surprise them' },
					{ key: 'D', text: 'Just be there, simply' }
				]
			},
			{
				prompt: 'Pick a place to be:',
				answers: [
					{ key: 'A', text: 'A festival' },
					{ key: 'B', text: 'A cozy café' },
					{ key: 'C', text: 'Somewhere brand new' },
					{ key: 'D', text: 'Anywhere quiet and nice' }
				]
			},
			{
				prompt: 'Your secret is:',
				answers: [
					{ key: 'A', text: 'You’re even more fun inside' },
					{ key: 'B', text: 'You’re sweeter than you let on' },
					{ key: 'C', text: 'You’re full of surprises' },
					{ key: 'D', text: 'You’re deeper than you look' }
				]
			},
			{
				prompt: 'Pick a color:',
				answers: [
					{ key: 'A', text: 'Every color at once' },
					{ key: 'B', text: 'Soft pink' },
					{ key: 'C', text: 'Bold purple' },
					{ key: 'D', text: 'Warm cream' }
				]
			},
			{
				prompt: 'At a bakery you’d be in the:',
				answers: [
					{ key: 'A', text: 'Flashy front window' },
					{ key: 'B', text: 'Beloved classics section' },
					{ key: 'C', text: 'Specialty surprise box' },
					{ key: 'D', text: 'Simple staples shelf' }
				]
			},
			{
				prompt: 'One word for you:',
				answers: [
					{ key: 'A', text: 'Joyful' },
					{ key: 'B', text: 'Sweet' },
					{ key: 'C', text: 'Surprising' },
					{ key: 'D', text: 'Chill' }
				]
			}
		],
		results: {
			A: {
				title: 'Sprinkle Donut',
				emoji: '🍩',
				blurb:
					'You’re pure joy in a person. Colorful, fun, and impossible to be sad around. You make every moment a little brighter just by showing up.'
			},
			B: {
				title: 'Glazed Donut',
				emoji: '🍩',
				blurb:
					'You’re the timeless classic everybody loves. Sweet, smooth, and reliable — you never go out of style and you’re always exactly what people are craving.'
			},
			C: {
				title: 'Jelly-Filled Donut',
				emoji: '🍩',
				blurb:
					'You’re full of surprises. There’s way more to you than meets the eye, and the people who discover your hidden depths are lucky. You keep life exciting.'
			},
			D: {
				title: 'Old-Fashioned Donut',
				emoji: '🍩',
				blurb:
					'You’re simple, genuine, and quietly the best. No frills, no drama — just real and dependable. People who know good things know you’re a treasure.'
			}
		},
		ties: {
			AB: { title: 'Frosted Donut', emoji: '🧁', blurb: 'Joyful and sweet.' },
			AC: { title: 'Funfetti Donut', emoji: '🎂', blurb: 'Joyful and full of surprises.' },
			AD: { title: 'Powdered Donut', emoji: '🍩', blurb: 'Joyful but easygoing.' },
			BC: { title: 'Boston Cream', emoji: '🍮', blurb: 'Sweet with a surprise inside.' },
			BD: { title: 'Cinnamon Donut', emoji: '🍩', blurb: 'Sweet and simple.' },
			CD: { title: 'Maple Bar', emoji: '🍁', blurb: 'Surprising yet chill.' }
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
