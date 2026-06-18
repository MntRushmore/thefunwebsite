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
			AB: {
				title: 'Flight',
				emoji: '🦅',
				blurb: 'Brave and brilliant — nothing can hold you down.'
			},
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
		name: 'What Element Are You?',
		emoji: '🔥',
		tagline: 'Fire, water, earth, or air — what powers you?',
		accent: '#9B5DE5',
		questions: [
			{
				prompt: 'Your friends would describe you as:',
				answers: [
					{ key: 'A', text: 'Energetic and bold' },
					{ key: 'B', text: 'Calm and thoughtful' },
					{ key: 'C', text: 'Steady and reliable' },
					{ key: 'D', text: 'Free-spirited and curious' }
				]
			},
			{
				prompt: 'When you face a problem, you usually:',
				answers: [
					{ key: 'A', text: 'Act fast and deal with it' },
					{ key: 'B', text: 'Think deeply and go with your feelings' },
					{ key: 'C', text: 'Make a practical plan' },
					{ key: 'D', text: 'Look for a creative or unusual solution' }
				]
			},
			{
				prompt: 'Your ideal place to relax is:',
				answers: [
					{ key: 'A', text: 'Somewhere exciting, like a sports game or concert' },
					{ key: 'B', text: 'Near water, like a beach, lake, or pool' },
					{ key: 'C', text: 'In nature, like a forest, garden, or mountains' },
					{ key: 'D', text: 'Somewhere open and breezy, like a rooftop or field' }
				]
			},
			{
				prompt: 'In a group project, you are:',
				answers: [
					{ key: 'A', text: 'The motivator who gets things moving' },
					{ key: 'B', text: 'The listener who understands everyone' },
					{ key: 'C', text: 'The planner who keeps things organized' },
					{ key: 'D', text: 'The idea person who thinks outside the box' }
				]
			},
			{
				prompt: 'Pick a power:',
				answers: [
					{ key: 'A', text: 'Shooting flames' },
					{ key: 'B', text: 'Controlling waves' },
					{ key: 'C', text: 'Growing plants or moving rocks' },
					{ key: 'D', text: 'Flying or controlling wind' }
				]
			},
			{
				prompt: 'What annoys you most?',
				answers: [
					{ key: 'A', text: 'Being held back' },
					{ key: 'B', text: 'People being careless with feelings' },
					{ key: 'C', text: 'Messy plans or chaos' },
					{ key: 'D', text: 'Boring routines' }
				]
			},
			{
				prompt: 'Your style is usually:',
				answers: [
					{ key: 'A', text: 'Bold and noticeable' },
					{ key: 'B', text: 'Soft and comfortable' },
					{ key: 'C', text: 'Simple and practical' },
					{ key: 'D', text: 'Unique and random' }
				]
			},
			{
				prompt: 'Choose a word:',
				answers: [
					{ key: 'A', text: 'Passion' },
					{ key: 'B', text: 'Emotion' },
					{ key: 'C', text: 'Strength' },
					{ key: 'D', text: 'Freedom' }
				]
			},
			{
				prompt: 'If your friend is upset, you:',
				answers: [
					{ key: 'A', text: 'Try to hype them up and distract them' },
					{ key: 'B', text: 'Listen and comfort them' },
					{ key: 'C', text: 'Help them solve the problem' },
					{ key: 'D', text: 'Suggest doing something fun or different' }
				]
			},
			{
				prompt: 'Your dream adventure would be:',
				answers: [
					{ key: 'A', text: 'Exploring a volcano or desert' },
					{ key: 'B', text: 'Sailing across the ocean' },
					{ key: 'C', text: 'Hiking through a giant forest' },
					{ key: 'D', text: 'Floating in a hot air balloon or skydiving' }
				]
			}
		],
		results: {
			A: {
				title: 'Fire',
				emoji: '🔥',
				blurb:
					'You are passionate, bold, and full of energy. You like action and aren’t afraid of challenges. People may see you as confident and exciting. Just remember to slow down sometimes so you don’t burn out.'
			},
			B: {
				title: 'Water',
				emoji: '🌊',
				blurb:
					'You are thoughtful, caring, and emotionally smart. You understand people’s feelings and can be very calming to be around. You may go with the flow, but you also have quiet strength.'
			},
			C: {
				title: 'Earth',
				emoji: '🌱',
				blurb:
					'You are dependable, patient, and grounded. People can count on you because you’re steady and practical. You like things that feel real and meaningful. Your strength is being reliable even when things get difficult.'
			},
			D: {
				title: 'Air',
				emoji: '🌬️',
				blurb:
					'You are curious, creative, and independent. You like freedom, ideas, and exploring new possibilities. You may get bored with the same routine, but your imagination helps you see the world differently.'
			}
		},
		ties: {
			AB: { title: 'Steam', emoji: '♨️', blurb: 'Intense, emotional, and powerful.' },
			AC: { title: 'Lava', emoji: '🌋', blurb: 'Strong, bold, and unstoppable.' },
			AD: { title: 'Lightning', emoji: '⚡', blurb: 'Fast, exciting, and unpredictable.' },
			BC: { title: 'Mud/Clay', emoji: '🪨', blurb: 'Caring, steady, and adaptable.' },
			BD: { title: 'Mist', emoji: '🌫️', blurb: 'Dreamy, thoughtful, and mysterious.' },
			CD: { title: 'Dust Storm', emoji: '🏜️', blurb: 'Grounded but adventurous.' }
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
	},
	{
		id: 'drink',
		name: 'What Drink Are You?',
		emoji: '🥤',
		tagline: 'Sip your way to your true personality.',
		accent: '#FF6B6B',
		questions: [
			{
				prompt: 'Your friends would describe you as:',
				answers: [
					{ key: 'A', text: 'Energetic and fun' },
					{ key: 'B', text: 'Calm and reliable' },
					{ key: 'C', text: 'Sweet and caring' },
					{ key: 'D', text: 'Creative and unique' },
					{ key: 'E', text: 'Chill and easygoing' }
				]
			},
			{
				prompt: 'Your perfect weekend would be:',
				answers: [
					{ key: 'A', text: 'Going somewhere exciting' },
					{ key: 'B', text: 'Relaxing and getting organized' },
					{ key: 'C', text: 'Hanging out with people you love' },
					{ key: 'D', text: 'Making art, music, videos, or stories' },
					{ key: 'E', text: 'Staying comfy and doing whatever sounds good' }
				]
			},
			{
				prompt: 'In a group project, you are usually:',
				answers: [
					{ key: 'A', text: 'The one with big energy' },
					{ key: 'B', text: 'The one keeping everyone on track' },
					{ key: 'C', text: 'The one making sure everyone feels included' },
					{ key: 'D', text: 'The one with cool ideas' },
					{ key: 'E', text: 'The one who keeps things relaxed' }
				]
			},
			{
				prompt: 'Pick a color:',
				answers: [
					{ key: 'A', text: 'Bright red' },
					{ key: 'B', text: 'Clear blue' },
					{ key: 'C', text: 'Soft pink' },
					{ key: 'D', text: 'Purple' },
					{ key: 'E', text: 'Light yellow' }
				]
			},
			{
				prompt: 'If something goes wrong, you:',
				answers: [
					{ key: 'A', text: 'React fast and try to fix it' },
					{ key: 'B', text: 'Stay calm and think logically' },
					{ key: 'C', text: 'Talk to someone about it' },
					{ key: 'D', text: 'Try a totally new solution' },
					{ key: 'E', text: 'Take a break, then deal with it' }
				]
			},
			{
				prompt: 'Your favorite kind of weather is:',
				answers: [
					{ key: 'A', text: 'Sunny and hot' },
					{ key: 'B', text: 'Cool and fresh' },
					{ key: 'C', text: 'Cozy and rainy' },
					{ key: 'D', text: 'Weird and dramatic, like thunderstorms' },
					{ key: 'E', text: 'Warm with a nice breeze' }
				]
			},
			{
				prompt: 'Pick a snack:',
				answers: [
					{ key: 'A', text: 'Spicy chips' },
					{ key: 'B', text: 'Crackers or fruit' },
					{ key: 'C', text: 'Cookies' },
					{ key: 'D', text: 'Something unusual or new' },
					{ key: 'E', text: 'Popcorn' }
				]
			},
			{
				prompt: 'Which word fits you best?',
				answers: [
					{ key: 'A', text: 'Exciting' },
					{ key: 'B', text: 'Steady' },
					{ key: 'C', text: 'Kind' },
					{ key: 'D', text: 'Original' },
					{ key: 'E', text: 'Relaxed' }
				]
			}
		],
		results: {
			A: {
				title: 'Soda',
				emoji: '🥤',
				blurb:
					'You’re bubbly, energetic, and fun to be around. You bring excitement wherever you go, and people probably like your confidence and humor.'
			},
			B: {
				title: 'Water',
				emoji: '💧',
				blurb:
					'You’re calm, dependable, and balanced. You may not always need attention, but people trust you because you’re steady and real.'
			},
			C: {
				title: 'Hot Chocolate',
				emoji: '☕',
				blurb:
					'You’re warm, sweet, and caring. You make people feel comfortable and safe, and you probably care a lot about your friends and family.'
			},
			D: {
				title: 'Smoothie',
				emoji: '🍓',
				blurb:
					'You’re creative, colorful, and different in a good way. You have your own style and probably like trying new ideas or making things.'
			},
			E: {
				title: 'Lemonade',
				emoji: '🍋',
				blurb:
					'You’re chill, bright, and easygoing. You can make boring situations more fun, and you usually have a relaxed but positive vibe.'
			}
		},
		ties: {
			AD: { title: 'Fruit Punch', emoji: '🍹', blurb: 'Bold, creative, and full of personality.' },
			AE: { title: 'Sparkling Lemonade', emoji: '🥂', blurb: 'Fun, friendly, and cheerful.' },
			BC: { title: 'Warm Tea', emoji: '🍵', blurb: 'Peaceful, thoughtful, and comforting.' },
			BE: { title: 'Iced Water', emoji: '🧊', blurb: 'Cool, calm, and relaxed.' },
			CD: { title: 'Strawberry Milk', emoji: '🥛', blurb: 'Sweet, creative, and lovable.' },
			DE: { title: 'Bubble Tea', emoji: '🧋', blurb: 'Unique, fun, and chill.' }
		}
	},
	{
		id: 'fruit',
		name: 'What Fruit Are You?',
		emoji: '🍓',
		tagline: 'A juicy little quiz to find your flavor.',
		accent: '#FF85A2',
		questions: [
			{
				prompt: 'Your friends would describe you as:',
				answers: [
					{ key: 'A', text: 'Fun and energetic' },
					{ key: 'B', text: 'Sweet and caring' },
					{ key: 'C', text: 'Chill and relaxed' },
					{ key: 'D', text: 'Bold and confident' },
					{ key: 'E', text: 'Unique and creative' }
				]
			},
			{
				prompt: 'Your perfect day would be:',
				answers: [
					{ key: 'A', text: 'Doing something exciting with friends' },
					{ key: 'B', text: 'Having a cozy day with people you love' },
					{ key: 'C', text: 'Relaxing, watching movies, or gaming' },
					{ key: 'D', text: 'Trying something new and adventurous' },
					{ key: 'E', text: 'Making art, music, videos, or stories' }
				]
			},
			{
				prompt: 'In a group project, you are usually:',
				answers: [
					{ key: 'A', text: 'The one who brings the energy' },
					{ key: 'B', text: 'The one who helps everyone get along' },
					{ key: 'C', text: 'The one who keeps things calm' },
					{ key: 'D', text: 'The one who takes charge' },
					{ key: 'E', text: 'The one with original ideas' }
				]
			},
			{
				prompt: 'Pick a color:',
				answers: [
					{ key: 'A', text: 'Bright yellow' },
					{ key: 'B', text: 'Red or pink' },
					{ key: 'C', text: 'Green' },
					{ key: 'D', text: 'Orange' },
					{ key: 'E', text: 'Purple' }
				]
			},
			{
				prompt: 'If something goes wrong, you:',
				answers: [
					{ key: 'A', text: 'Try to make the best of it' },
					{ key: 'B', text: 'Check if everyone is okay' },
					{ key: 'C', text: 'Stay calm and go with the flow' },
					{ key: 'D', text: 'Face it directly' },
					{ key: 'E', text: 'Think of a creative solution' }
				]
			},
			{
				prompt: 'What sounds most like you?',
				answers: [
					{ key: 'A', text: 'I like making people laugh' },
					{ key: 'B', text: 'I care a lot about my friends' },
					{ key: 'C', text: 'I don’t like drama' },
					{ key: 'D', text: 'I like a challenge' },
					{ key: 'E', text: 'I like being different' }
				]
			},
			{
				prompt: 'Choose a snack:',
				answers: [
					{ key: 'A', text: 'Popcorn' },
					{ key: 'B', text: 'Cookies' },
					{ key: 'C', text: 'Crackers' },
					{ key: 'D', text: 'Spicy chips' },
					{ key: 'E', text: 'Something unusual I haven’t tried before' }
				]
			},
			{
				prompt: 'Your biggest strength is:',
				answers: [
					{ key: 'A', text: 'Positivity' },
					{ key: 'B', text: 'Kindness' },
					{ key: 'C', text: 'Patience' },
					{ key: 'D', text: 'Confidence' },
					{ key: 'E', text: 'Imagination' }
				]
			}
		],
		results: {
			A: {
				title: 'Banana',
				emoji: '🍌',
				blurb:
					'You’re cheerful, funny, and full of good energy. You can make boring moments more fun, and people probably like being around your positive vibe.'
			},
			B: {
				title: 'Strawberry',
				emoji: '🍓',
				blurb:
					'You’re sweet, kind, and caring. You make people feel appreciated and supported. Friends may come to you when they need comfort or advice.'
			},
			C: {
				title: 'Watermelon',
				emoji: '🍉',
				blurb:
					'You’re chill, relaxed, and easy to be around. You don’t like unnecessary drama, and you’re good at helping people calm down.'
			},
			D: {
				title: 'Orange',
				emoji: '🍊',
				blurb:
					'You’re bold, confident, and adventurous. You like trying new things and facing challenges. You bring excitement and courage to your group.'
			},
			E: {
				title: 'Grape',
				emoji: '🍇',
				blurb:
					'You’re creative, unique, and interesting. You have your own style and ideas, and you’re not afraid to be a little different.'
			}
		},
		ties: {
			AB: { title: 'Mango', emoji: '🥭', blurb: 'Cheerful, sweet, and lovable.' },
			AC: { title: 'Pineapple', emoji: '🍍', blurb: 'Fun, relaxed, and bright.' },
			AD: { title: 'Lemon', emoji: '🍋', blurb: 'Bold, energetic, and sharp.' },
			BC: { title: 'Peach', emoji: '🍑', blurb: 'Gentle, calm, and kind.' },
			BE: { title: 'Cherry', emoji: '🍒', blurb: 'Sweet, creative, and memorable.' },
			CE: { title: 'Kiwi', emoji: '🥝', blurb: 'Chill, unique, and quietly cool.' },
			DE: { title: 'Dragon Fruit', emoji: '🐉', blurb: 'Bold, creative, and one-of-a-kind.' }
		}
	},
	{
		id: 'songgenre',
		name: 'What Song Genre Are You?',
		emoji: '🎶',
		tagline: 'Turn up the volume on your personality.',
		accent: '#7B5BE6',
		questions: [
			{
				prompt: 'Your friends would describe you as:',
				answers: [
					{ key: 'A', text: 'Energetic and confident' },
					{ key: 'B', text: 'Emotional and thoughtful' },
					{ key: 'C', text: 'Chill and easygoing' },
					{ key: 'D', text: 'Creative and different' },
					{ key: 'E', text: 'Fun and dramatic' }
				]
			},
			{
				prompt: 'Your perfect weekend would be:',
				answers: [
					{ key: 'A', text: 'Going somewhere exciting' },
					{ key: 'B', text: 'Having deep talks or relaxing alone' },
					{ key: 'C', text: 'Hanging out with friends with no big plan' },
					{ key: 'D', text: 'Making something: art, videos, writing, music, etc.' },
					{ key: 'E', text: 'Doing something loud, fun, or unforgettable' }
				]
			},
			{
				prompt: 'When you’re in a group, you usually:',
				answers: [
					{ key: 'A', text: 'Bring the hype' },
					{ key: 'B', text: 'Notice how everyone feels' },
					{ key: 'C', text: 'Keep things relaxed' },
					{ key: 'D', text: 'Come up with unique ideas' },
					{ key: 'E', text: 'Make people laugh or entertain them' }
				]
			},
			{
				prompt: 'Pick a lyric vibe:',
				answers: [
					{ key: 'A', text: '“I’m unstoppable.”' },
					{ key: 'B', text: '“I feel everything.”' },
					{ key: 'C', text: '“Life is better when I’m relaxed.”' },
					{ key: 'D', text: '“I see the world differently.”' },
					{ key: 'E', text: '“Let’s make this moment legendary.”' }
				]
			},
			{
				prompt: 'If something goes wrong, you:',
				answers: [
					{ key: 'A', text: 'Push through it' },
					{ key: 'B', text: 'Think about it a lot' },
					{ key: 'C', text: 'Stay calm and move on' },
					{ key: 'D', text: 'Turn it into inspiration' },
					{ key: 'E', text: 'Make a joke or turn it into a story' }
				]
			},
			{
				prompt: 'Choose a color:',
				answers: [
					{ key: 'A', text: 'Red' },
					{ key: 'B', text: 'Dark blue' },
					{ key: 'C', text: 'Light green' },
					{ key: 'D', text: 'Purple' },
					{ key: 'E', text: 'Gold' }
				]
			},
			{
				prompt: 'Your dream concert would be:',
				answers: [
					{ key: 'A', text: 'Huge lights, big bass, everyone jumping' },
					{ key: 'B', text: 'A smaller show where the lyrics really matter' },
					{ key: 'C', text: 'Outdoor festival with chill music' },
					{ key: 'D', text: 'A weird, artsy concert with cool visuals' },
					{ key: 'E', text: 'A super dramatic performance with costumes and effects' }
				]
			},
			{
				prompt: 'Which word fits you best?',
				answers: [
					{ key: 'A', text: 'Bold' },
					{ key: 'B', text: 'Deep' },
					{ key: 'C', text: 'Relaxed' },
					{ key: 'D', text: 'Original' },
					{ key: 'E', text: 'Expressive' }
				]
			}
		],
		results: {
			A: {
				title: 'Pop',
				emoji: '🎤',
				blurb:
					'You’re energetic, confident, and fun to be around. You like excitement and good vibes, and you know how to bring people together.'
			},
			B: {
				title: 'R&B / Soul',
				emoji: '🎙️',
				blurb:
					'You’re thoughtful, emotional, and caring. You feel things deeply and probably understand people better than they realize.'
			},
			C: {
				title: 'Reggae / Chill Music',
				emoji: '🌴',
				blurb:
					'You’re calm, relaxed, and easygoing. You don’t like unnecessary drama, and you help people feel more peaceful.'
			},
			D: {
				title: 'Alternative / Indie',
				emoji: '🎸',
				blurb:
					'You’re creative, unique, and original. You like things that feel different, interesting, or meaningful. You have your own style.'
			},
			E: {
				title: 'Musical Theater / Show Tunes',
				emoji: '🎭',
				blurb:
					'You’re expressive, fun, and dramatic in the best way. You know how to make moments memorable and probably have a big imagination.'
			}
		},
		ties: {
			AB: { title: 'Hip-Hop', emoji: '🎧', blurb: 'Confident, expressive, and honest.' },
			AC: { title: 'Dance/Electronic', emoji: '🪩', blurb: 'Upbeat, fun, and energetic.' },
			AD: { title: 'K-Pop', emoji: '💖', blurb: 'Bold, creative, and full of style.' },
			AE: { title: 'Rock', emoji: '🤘', blurb: 'Loud, powerful, and exciting.' },
			BC: { title: 'Acoustic', emoji: '🎵', blurb: 'Calm, emotional, and real.' },
			BD: { title: 'Lo-fi', emoji: '🎚️', blurb: 'Thoughtful, creative, and chill.' },
			CD: { title: 'Indie Pop', emoji: '🎹', blurb: 'Relaxed, unique, and catchy.' },
			DE: {
				title: 'Experimental Pop',
				emoji: '🌈',
				blurb: 'Creative, dramatic, and one-of-a-kind.'
			}
		}
	},
	{
		id: 'booktype',
		name: 'What Type of Book Are You?',
		emoji: '📚',
		tagline: 'Every reader is a story. Which one are you?',
		accent: '#C0843C',
		questions: [
			{
				prompt: 'Your friends would describe you as:',
				answers: [
					{ key: 'A', text: 'Brave and adventurous' },
					{ key: 'B', text: 'Thoughtful and emotional' },
					{ key: 'C', text: 'Funny and energetic' },
					{ key: 'D', text: 'Curious and clever' },
					{ key: 'E', text: 'Creative and mysterious' }
				]
			},
			{
				prompt: 'Your perfect day would be:',
				answers: [
					{ key: 'A', text: 'Going on an adventure or trying something new' },
					{ key: 'B', text: 'Having a cozy, meaningful day with people you care about' },
					{ key: 'C', text: 'Laughing with friends and doing something fun' },
					{ key: 'D', text: 'Solving puzzles, learning facts, or exploring interesting ideas' },
					{ key: 'E', text: 'Creating art, stories, videos, or spending time in your imagination' }
				]
			},
			{
				prompt: 'If you were the main character, your story would start with:',
				answers: [
					{ key: 'A', text: 'A map, a mission, and a dangerous journey' },
					{ key: 'B', text: 'A big feeling or important life change' },
					{ key: 'C', text: 'A hilarious misunderstanding' },
					{ key: 'D', text: 'A strange clue that needs solving' },
					{ key: 'E', text: 'A secret door to another world' }
				]
			},
			{
				prompt: 'In a group project, you are usually:',
				answers: [
					{ key: 'A', text: 'The person ready to take action' },
					{ key: 'B', text: 'The person who understands everyone’s feelings' },
					{ key: 'C', text: 'The person who keeps things fun' },
					{ key: 'D', text: 'The person who notices details and asks good questions' },
					{ key: 'E', text: 'The person with imaginative ideas' }
				]
			},
			{
				prompt: 'Pick a setting:',
				answers: [
					{ key: 'A', text: 'A jungle, mountain, ocean, or lost city' },
					{ key: 'B', text: 'A small town, home, school, or cozy place' },
					{ key: 'C', text: 'A chaotic school trip or funny neighborhood' },
					{ key: 'D', text: 'A museum, old mansion, lab, or detective office' },
					{ key: 'E', text: 'A castle, enchanted forest, spaceship, or magical city' }
				]
			},
			{
				prompt: 'What kind of problem would you be best at handling?',
				answers: [
					{ key: 'A', text: 'A challenge that needs courage' },
					{ key: 'B', text: 'A friendship or family problem' },
					{ key: 'C', text: 'An awkward situation' },
					{ key: 'D', text: 'A mystery that needs solving' },
					{ key: 'E', text: 'A magical or impossible problem' }
				]
			},
			{
				prompt: 'Choose a quote vibe:',
				answers: [
					{ key: 'A', text: '“Let’s go before it’s too late!”' },
					{ key: 'B', text: '“Some moments change who you are.”' },
					{ key: 'C', text: '“Well, that went terribly.”' },
					{ key: 'D', text: '“The clue was there the whole time.”' },
					{ key: 'E', text: '“Nothing is impossible here.”' }
				]
			},
			{
				prompt: 'Your biggest strength is:',
				answers: [
					{ key: 'A', text: 'Courage' },
					{ key: 'B', text: 'Empathy' },
					{ key: 'C', text: 'Humor' },
					{ key: 'D', text: 'Intelligence' },
					{ key: 'E', text: 'Imagination' }
				]
			}
		],
		results: {
			A: {
				title: 'Adventure Book',
				emoji: '🗺️',
				blurb:
					'You’re brave, energetic, and ready for new experiences. You like action, challenges, and stories where something exciting is always happening.'
			},
			B: {
				title: 'Realistic Fiction',
				emoji: '📖',
				blurb:
					'You’re thoughtful, caring, and emotionally aware. You understand people and feelings, and you probably enjoy stories that feel real and meaningful.'
			},
			C: {
				title: 'Comedy Book',
				emoji: '😂',
				blurb:
					'You’re fun, playful, and good at making people smile. You can turn awkward moments into great stories, and your energy makes life more entertaining.'
			},
			D: {
				title: 'Mystery Book',
				emoji: '🔎',
				blurb:
					'You’re curious, clever, and observant. You notice details other people miss and enjoy figuring things out. Your brain is basically a detective notebook.'
			},
			E: {
				title: 'Fantasy/Sci-Fi Book',
				emoji: '🐉',
				blurb:
					'You’re imaginative, creative, and full of big ideas. You like worlds that are different from everyday life and probably enjoy asking “what if?”'
			}
		},
		ties: {
			AB: {
				title: 'Historical Fiction',
				emoji: '🏛️',
				blurb: 'Meaningful, brave, and full of big moments.'
			},
			AC: { title: 'Action Comedy', emoji: '💥', blurb: 'Adventurous, funny, and exciting.' },
			AD: { title: 'Spy Thriller', emoji: '🕵️', blurb: 'Daring, clever, and sneaky-smart.' },
			AE: { title: 'Epic Fantasy', emoji: '⚔️', blurb: 'Adventurous, imaginative, and bold.' },
			BC: { title: 'Slice of Life Comedy', emoji: '☕', blurb: 'Realistic, warm, and funny.' },
			BD: { title: 'Drama Mystery', emoji: '🎭', blurb: 'Emotional, thoughtful, and curious.' },
			BE: { title: 'Magical Realism', emoji: '✨', blurb: 'Meaningful, creative, and dreamy.' },
			CD: { title: 'Funny Mystery', emoji: '🃏', blurb: 'Clever, chaotic, and entertaining.' },
			CE: { title: 'Wacky Fantasy', emoji: '🦄', blurb: 'Silly, imaginative, and unpredictable.' },
			DE: { title: 'Sci-Fi Mystery', emoji: '🚀', blurb: 'Curious, creative, and mind-bending.' }
		}
	},
	{
		id: 'superpower',
		name: 'What Superpower Would You Have?',
		emoji: '🦸',
		tagline: 'Eight questions to unlock your hidden ability.',
		accent: '#4D9DE0',
		questions: [
			{
				prompt: 'Your friends would describe you as:',
				answers: [
					{ key: 'A', text: 'Brave and energetic' },
					{ key: 'B', text: 'Smart and observant' },
					{ key: 'C', text: 'Caring and protective' },
					{ key: 'D', text: 'Creative and unpredictable' },
					{ key: 'E', text: 'Calm and independent' }
				]
			},
			{
				prompt: 'If there was a problem, you would:',
				answers: [
					{ key: 'A', text: 'Jump in and take action' },
					{ key: 'B', text: 'Think carefully and find the best plan' },
					{ key: 'C', text: 'Help people feel safe and supported' },
					{ key: 'D', text: 'Try a weird but clever solution' },
					{ key: 'E', text: 'Stay quiet and handle it your own way' }
				]
			},
			{
				prompt: 'Your ideal mission would be:',
				answers: [
					{ key: 'A', text: 'Stopping a runaway train' },
					{ key: 'B', text: 'Solving a mystery before time runs out' },
					{ key: 'C', text: 'Rescuing people during a disaster' },
					{ key: 'D', text: 'Exploring another dimension' },
					{ key: 'E', text: 'Sneaking into a secret base' }
				]
			},
			{
				prompt: 'In a team, you are usually:',
				answers: [
					{ key: 'A', text: 'The fearless one' },
					{ key: 'B', text: 'The strategist' },
					{ key: 'C', text: 'The protector' },
					{ key: 'D', text: 'The wild-card idea person' },
					{ key: 'E', text: 'The quiet expert' }
				]
			},
			{
				prompt: 'Pick a superhero outfit color:',
				answers: [
					{ key: 'A', text: 'Red' },
					{ key: 'B', text: 'Blue' },
					{ key: 'C', text: 'Green' },
					{ key: 'D', text: 'Purple' },
					{ key: 'E', text: 'Black' }
				]
			},
			{
				prompt: 'What would annoy you most?',
				answers: [
					{ key: 'A', text: 'Feeling weak or helpless' },
					{ key: 'B', text: 'People ignoring obvious clues' },
					{ key: 'C', text: 'Someone being treated unfairly' },
					{ key: 'D', text: 'Boring rules' },
					{ key: 'E', text: 'Too much attention' }
				]
			},
			{
				prompt: 'Choose a place to train:',
				answers: [
					{ key: 'A', text: 'A giant obstacle course' },
					{ key: 'B', text: 'A high-tech lab' },
					{ key: 'C', text: 'A peaceful forest' },
					{ key: 'D', text: 'A floating magical island' },
					{ key: 'E', text: 'A rooftop at night' }
				]
			},
			{
				prompt: 'Your biggest strength is:',
				answers: [
					{ key: 'A', text: 'Courage' },
					{ key: 'B', text: 'Intelligence' },
					{ key: 'C', text: 'Kindness' },
					{ key: 'D', text: 'Imagination' },
					{ key: 'E', text: 'Focus' }
				]
			}
		],
		results: {
			A: {
				title: 'Super Strength',
				emoji: '💪',
				blurb:
					'You’re bold, brave, and ready to face challenges head-on. You’d be the hero who protects people by standing strong when things get tough.'
			},
			B: {
				title: 'Mind Reading',
				emoji: '🧠',
				blurb:
					'You’re clever, observant, and good at understanding what’s really going on. You’d use your power to solve problems, uncover secrets, and help people communicate.'
			},
			C: {
				title: 'Healing Powers',
				emoji: '✨',
				blurb:
					'You’re caring, loyal, and protective. You’d be the hero people trust when they need help, comfort, or someone who truly cares.'
			},
			D: {
				title: 'Teleportation',
				emoji: '🌀',
				blurb:
					'You’re creative, adventurous, and unpredictable. You’d love being able to go anywhere instantly and escape boring situations whenever you want.'
			},
			E: {
				title: 'Invisibility',
				emoji: '🫥',
				blurb:
					'You’re calm, independent, and focused. You don’t always need attention, and you’d be great at sneaky missions, observing details, and solving problems quietly.'
			}
		},
		ties: {
			AB: { title: 'Super Speed', emoji: '⚡', blurb: 'Brave, quick-thinking, and sharp.' },
			AC: { title: 'Force Field', emoji: '🛡️', blurb: 'Protective, strong, and loyal.' },
			AD: { title: 'Shape-Shifting', emoji: '🦎', blurb: 'Bold, creative, and adaptable.' },
			AE: { title: 'Night Vision', emoji: '🌙', blurb: 'Brave, quiet, and focused.' },
			BC: { title: 'Empathy Power', emoji: '💞', blurb: 'Smart, caring, and emotionally aware.' },
			BD: { title: 'Time Control', emoji: '⏳', blurb: 'Clever, creative, and powerful.' },
			BE: { title: 'Telekinesis', emoji: '🔮', blurb: 'Focused, intelligent, and mysterious.' },
			CD: { title: 'Nature Control', emoji: '🌿', blurb: 'Caring, creative, and connected.' },
			CE: { title: 'Animal Communication', emoji: '🐾', blurb: 'Gentle, quiet, and trustworthy.' },
			DE: { title: 'Portal Power', emoji: '🌌', blurb: 'Imaginative, independent, and secretive.' }
		}
	},
	{
		id: 'magicalanimal',
		name: 'What Magical Animal Are You?',
		emoji: '🐉',
		tagline: 'Discover the legendary beast within.',
		accent: '#9B5DE5',
		questions: [
			{
				prompt: 'Your friends would describe you as:',
				answers: [
					{ key: 'A', text: 'Brave and powerful' },
					{ key: 'B', text: 'Kind and hopeful' },
					{ key: 'C', text: 'Mysterious and independent' },
					{ key: 'D', text: 'Wise and observant' },
					{ key: 'E', text: 'Playful and curious' }
				]
			},
			{
				prompt: 'Your perfect adventure would be:',
				answers: [
					{ key: 'A', text: 'Climbing a volcano or exploring a dangerous cave' },
					{ key: 'B', text: 'Finding a hidden meadow full of glowing flowers' },
					{ key: 'C', text: 'Sneaking through an enchanted forest at midnight' },
					{ key: 'D', text: 'Solving an ancient riddle in a forgotten library' },
					{ key: 'E', text: 'Following a sparkling trail to a secret world' }
				]
			},
			{
				prompt: 'In a group, you are usually:',
				answers: [
					{ key: 'A', text: 'The protector' },
					{ key: 'B', text: 'The peacemaker' },
					{ key: 'C', text: 'The quiet one with a secret plan' },
					{ key: 'D', text: 'The thinker' },
					{ key: 'E', text: 'The one making everything more fun' }
				]
			},
			{
				prompt: 'Pick a magical power:',
				answers: [
					{ key: 'A', text: 'Breathing fire' },
					{ key: 'B', text: 'Healing magic' },
					{ key: 'C', text: 'Shadow walking' },
					{ key: 'D', text: 'Seeing the future' },
					{ key: 'E', text: 'Turning invisible for pranks or exploring' }
				]
			},
			{
				prompt: 'Choose a place to live:',
				answers: [
					{ key: 'A', text: 'A mountain cave full of treasure' },
					{ key: 'B', text: 'A peaceful forest clearing' },
					{ key: 'C', text: 'A moonlit castle ruin' },
					{ key: 'D', text: 'A tower filled with books and maps' },
					{ key: 'E', text: 'A bright hidden village with portals everywhere' }
				]
			},
			{
				prompt: 'What annoys you most?',
				answers: [
					{ key: 'A', text: 'People underestimating you' },
					{ key: 'B', text: 'Cruelty or unfairness' },
					{ key: 'C', text: 'Being forced to explain yourself' },
					{ key: 'D', text: 'People not listening to good advice' },
					{ key: 'E', text: 'Being bored' }
				]
			},
			{
				prompt: 'Pick a color:',
				answers: [
					{ key: 'A', text: 'Red or gold' },
					{ key: 'B', text: 'White or pastel pink' },
					{ key: 'C', text: 'Black or silver' },
					{ key: 'D', text: 'Blue or bronze' },
					{ key: 'E', text: 'Green or rainbow' }
				]
			},
			{
				prompt: 'Your biggest strength is:',
				answers: [
					{ key: 'A', text: 'Courage' },
					{ key: 'B', text: 'Kindness' },
					{ key: 'C', text: 'Independence' },
					{ key: 'D', text: 'Wisdom' },
					{ key: 'E', text: 'Imagination' }
				]
			}
		],
		results: {
			A: {
				title: 'Dragon',
				emoji: '🐉',
				blurb:
					'You’re bold, brave, and powerful. You protect the people you care about and don’t back down easily. You have a strong personality and big energy.'
			},
			B: {
				title: 'Unicorn',
				emoji: '🦄',
				blurb:
					'You’re kind, hopeful, and gentle. You bring comfort and positivity to others. You probably care a lot about fairness, friendship, and making the world better.'
			},
			C: {
				title: 'Griffin',
				emoji: '🦅',
				blurb:
					'You’re mysterious, independent, and strong. You like doing things your own way and may not reveal everything you’re thinking. People respect your confidence.'
			},
			D: {
				title: 'Phoenix',
				emoji: '🔥',
				blurb:
					'You’re wise, thoughtful, and resilient. Even when things are difficult, you can rise again and keep going. You learn from experiences and come back stronger.'
			},
			E: {
				title: 'Fairy',
				emoji: '🧚',
				blurb:
					'You’re playful, curious, and creative. You bring magic into everyday life through your imagination and fun ideas. You probably love discovering new things.'
			}
		},
		ties: {
			AB: { title: 'Pegasus', emoji: '🐴', blurb: 'Brave, kind, and free-spirited.' },
			AC: { title: 'Chimera', emoji: '🦁', blurb: 'Powerful, mysterious, and intense.' },
			AD: { title: 'Firebird', emoji: '🦚', blurb: 'Bold, wise, and unstoppable.' },
			AE: { title: 'Baby Dragon', emoji: '🐲', blurb: 'Adventurous, playful, and fiery.' },
			BC: { title: 'Moon Unicorn', emoji: '🌙', blurb: 'Gentle, mysterious, and graceful.' },
			BD: { title: 'Celestial Deer', emoji: '🦌', blurb: 'Kind, wise, and peaceful.' },
			BE: { title: 'Pixie', emoji: '🧚‍♀️', blurb: 'Sweet, playful, and magical.' },
			CD: { title: 'Sphinx', emoji: '🐱', blurb: 'Mysterious, wise, and clever.' },
			CE: { title: 'Shadow Fairy', emoji: '🌑', blurb: 'Curious, sneaky, and creative.' },
			DE: { title: 'Time Sprite', emoji: '⏳', blurb: 'Imaginative, clever, and magical.' }
		}
	},
	{
		id: 'cat',
		name: 'What Breed of Cat Are You?',
		emoji: '🐱',
		tagline: 'Find the feline that matches your vibe.',
		accent: '#A487C3',
		questions: [
			{
				prompt: 'Your friends would describe you as:',
				answers: [
					{ key: 'A', text: 'Fancy and confident' },
					{ key: 'B', text: 'Friendly and playful' },
					{ key: 'C', text: 'Calm and gentle' },
					{ key: 'D', text: 'Curious and energetic' },
					{ key: 'E', text: 'Mysterious and independent' }
				]
			},
			{
				prompt: 'Your perfect afternoon would be:',
				answers: [
					{ key: 'A', text: 'Dressing up, taking photos, or feeling stylish' },
					{ key: 'B', text: 'Playing games or hanging out with friends' },
					{ key: 'C', text: 'Reading, relaxing, or being cozy' },
					{ key: 'D', text: 'Exploring somewhere new' },
					{ key: 'E', text: 'Spending quiet time alone doing your own thing' }
				]
			},
			{
				prompt: 'In a group, you usually:',
				answers: [
					{ key: 'A', text: 'Stand out without trying' },
					{ key: 'B', text: 'Make people laugh and join in' },
					{ key: 'C', text: 'Keep things peaceful' },
					{ key: 'D', text: 'Ask questions and investigate' },
					{ key: 'E', text: 'Watch quietly before joining' }
				]
			},
			{
				prompt: 'Pick a favorite place:',
				answers: [
					{ key: 'A', text: 'A fancy room with soft pillows' },
					{ key: 'B', text: 'A sunny backyard or fun hangout spot' },
					{ key: 'C', text: 'A cozy blanket fort' },
					{ key: 'D', text: 'A high shelf, treehouse, or lookout spot' },
					{ key: 'E', text: 'A quiet corner where nobody bothers you' }
				]
			},
			{
				prompt: 'If something goes wrong, you:',
				answers: [
					{ key: 'A', text: 'Stay confident and act like you meant to do that' },
					{ key: 'B', text: 'Try to make it fun anyway' },
					{ key: 'C', text: 'Stay calm and comfort others' },
					{ key: 'D', text: 'Figure out what happened' },
					{ key: 'E', text: 'Disappear for a bit and think alone' }
				]
			},
			{
				prompt: 'Choose a snack:',
				answers: [
					{ key: 'A', text: 'Something fancy' },
					{ key: 'B', text: 'Something sweet' },
					{ key: 'C', text: 'Something warm and cozy' },
					{ key: 'D', text: 'Something new you’ve never tried' },
					{ key: 'E', text: 'Something simple and reliable' }
				]
			},
			{
				prompt: 'What annoys you most?',
				answers: [
					{ key: 'A', text: 'Being ignored' },
					{ key: 'B', text: 'Boring activities' },
					{ key: 'C', text: 'Loud drama' },
					{ key: 'D', text: 'Not knowing the answer' },
					{ key: 'E', text: 'People not giving you space' }
				]
			},
			{
				prompt: 'Your biggest strength is:',
				answers: [
					{ key: 'A', text: 'Confidence' },
					{ key: 'B', text: 'Friendliness' },
					{ key: 'C', text: 'Patience' },
					{ key: 'D', text: 'Curiosity' },
					{ key: 'E', text: 'Independence' }
				]
			}
		],
		results: {
			A: {
				title: 'Persian Cat',
				emoji: '😺',
				blurb:
					'You’re stylish, confident, and a little fancy. You know your worth and probably like comfort, beauty, or having your own special vibe.'
			},
			B: {
				title: 'Maine Coon',
				emoji: '🐾',
				blurb:
					'You’re friendly, playful, and fun to be around. Maine Coons are known as “gentle giants,” and you probably bring warm, happy energy to your group.'
			},
			C: {
				title: 'Ragdoll',
				emoji: '💤',
				blurb:
					'You’re calm, gentle, and cozy. You like peaceful spaces and make people feel relaxed. You’re the kind of person others feel safe around.'
			},
			D: {
				title: 'Bengal Cat',
				emoji: '🐆',
				blurb:
					'You’re curious, adventurous, and energetic. You like exploring, learning, and trying new things. Sitting still for too long might not be your favorite.'
			},
			E: {
				title: 'Russian Blue',
				emoji: '💙',
				blurb:
					'You’re independent, thoughtful, and a little mysterious. You may be quiet at first, but you have a strong personality once people know you.'
			}
		},
		ties: {
			AB: { title: 'Siamese', emoji: '🐈', blurb: 'Confident, social, and expressive.' },
			AC: { title: 'Birman', emoji: '🐈', blurb: 'Elegant, gentle, and loyal.' },
			AD: { title: 'Abyssinian', emoji: '🐈', blurb: 'Stylish, curious, and active.' },
			AE: { title: 'British Shorthair', emoji: '🐈', blurb: 'Classy, calm, and independent.' },
			BC: { title: 'Scottish Fold', emoji: '🐈', blurb: 'Sweet, friendly, and relaxed.' },
			BD: { title: 'Savannah Cat', emoji: '🐆', blurb: 'Playful, adventurous, and bold.' },
			BE: { title: 'Turkish Van', emoji: '🐈', blurb: 'Fun, independent, and surprising.' },
			CD: {
				title: 'Norwegian Forest Cat',
				emoji: '🌲',
				blurb: 'Calm, curious, and nature-loving.'
			},
			CE: { title: 'Chartreux', emoji: '🐈', blurb: 'Quiet, gentle, and loyal.' },
			DE: { title: 'Sphynx', emoji: '🐈', blurb: 'Unique, curious, and confident.' }
		}
	},
	{
		id: 'dog',
		name: 'What Breed of Dog Are You?',
		emoji: '🐶',
		tagline: 'Sniff out the pup that matches your personality.',
		accent: '#D9A066',
		questions: [
			{
				prompt: 'Your friends would describe you as:',
				answers: [
					{ key: 'A', text: 'Loyal and protective' },
					{ key: 'B', text: 'Friendly and energetic' },
					{ key: 'C', text: 'Smart and focused' },
					{ key: 'D', text: 'Calm and gentle' },
					{ key: 'E', text: 'Funny and unique' }
				]
			},
			{
				prompt: 'Your perfect afternoon would be:',
				answers: [
					{ key: 'A', text: 'Spending time with close friends or family' },
					{ key: 'B', text: 'Running around, playing, or doing something active' },
					{ key: 'C', text: 'Learning a new skill or working on a goal' },
					{ key: 'D', text: 'Relaxing somewhere cozy' },
					{ key: 'E', text: 'Doing something random and silly' }
				]
			},
			{
				prompt: 'In a group, you usually:',
				answers: [
					{ key: 'A', text: 'Look out for everyone' },
					{ key: 'B', text: 'Bring the excitement' },
					{ key: 'C', text: 'Help organize or solve problems' },
					{ key: 'D', text: 'Keep the peace' },
					{ key: 'E', text: 'Make people laugh' }
				]
			},
			{
				prompt: 'Pick a favorite place:',
				answers: [
					{ key: 'A', text: 'Home with people you care about' },
					{ key: 'B', text: 'A park, field, or beach' },
					{ key: 'C', text: 'A classroom, club, workshop, or challenge area' },
					{ key: 'D', text: 'A cozy couch or quiet room' },
					{ key: 'E', text: 'Anywhere interesting or unexpected' }
				]
			},
			{
				prompt: 'If something goes wrong, you:',
				answers: [
					{ key: 'A', text: 'Protect your friends and stand up for what’s right' },
					{ key: 'B', text: 'Try to stay positive and keep moving' },
					{ key: 'C', text: 'Think through the best solution' },
					{ key: 'D', text: 'Stay calm and comfort others' },
					{ key: 'E', text: 'Make a joke, then figure it out' }
				]
			},
			{
				prompt: 'Choose a snack:',
				answers: [
					{ key: 'A', text: 'A classic favorite' },
					{ key: 'B', text: 'Something you can eat fast before going back to fun' },
					{ key: 'C', text: 'Something healthy or energizing' },
					{ key: 'D', text: 'Something warm and comforting' },
					{ key: 'E', text: 'Something weird but tasty' }
				]
			},
			{
				prompt: 'What annoys you most?',
				answers: [
					{ key: 'A', text: 'People being unfair to someone you care about' },
					{ key: 'B', text: 'Sitting still too long' },
					{ key: 'C', text: 'Confusing instructions' },
					{ key: 'D', text: 'Loud drama' },
					{ key: 'E', text: 'Being expected to act “normal” all the time' }
				]
			},
			{
				prompt: 'Your biggest strength is:',
				answers: [
					{ key: 'A', text: 'Loyalty' },
					{ key: 'B', text: 'Energy' },
					{ key: 'C', text: 'Intelligence' },
					{ key: 'D', text: 'Gentleness' },
					{ key: 'E', text: 'Humor' }
				]
			}
		],
		results: {
			A: {
				title: 'German Shepherd',
				emoji: '🐕‍🦺',
				blurb:
					'You’re loyal, brave, and protective. People can count on you, and you care deeply about your friends and family. You’re the kind of person who stands up for others.'
			},
			B: {
				title: 'Golden Retriever',
				emoji: '🐕',
				blurb:
					'You’re friendly, energetic, and positive. You bring happiness into the room and probably make friends pretty easily. You’re fun, warm, and easy to like.'
			},
			C: {
				title: 'Border Collie',
				emoji: '🐾',
				blurb:
					'You’re smart, focused, and hardworking. You like challenges and are good at figuring things out. You might enjoy learning, strategy games, sports, or improving at a skill.'
			},
			D: {
				title: 'Cavalier King Charles Spaniel',
				emoji: '🐶',
				blurb:
					'You’re gentle, calm, and comforting. You’re good at making others feel safe and relaxed. You probably care a lot about peace, kindness, and cozy vibes.'
			},
			E: {
				title: 'Corgi',
				emoji: '🦊',
				blurb:
					'You’re funny, unique, and full of personality. You may be silly, bold, or a little dramatic in the best way. People probably remember you because you bring fun energy.'
			}
		},
		ties: {
			AB: { title: 'Labrador Retriever', emoji: '🐕', blurb: 'Loyal, friendly, and playful.' },
			AC: { title: 'Doberman', emoji: '🐕‍🦺', blurb: 'Protective, smart, and serious.' },
			AD: { title: 'Bernese Mountain Dog', emoji: '🏔️', blurb: 'Loyal, gentle, and calm.' },
			AE: { title: 'Boxer', emoji: '🥊', blurb: 'Protective, funny, and energetic.' },
			BC: {
				title: 'Australian Shepherd',
				emoji: '🐑',
				blurb: 'Energetic, smart, and adventurous.'
			},
			BD: { title: 'Beagle', emoji: '🐶', blurb: 'Friendly, gentle, and curious.' },
			BE: { title: 'Dachshund', emoji: '🌭', blurb: 'Playful, funny, and bold.' },
			CD: { title: 'Poodle', emoji: '🐩', blurb: 'Smart, gentle, and stylish.' },
			CE: { title: 'Shiba Inu', emoji: '🦴', blurb: 'Clever, independent, and full of attitude.' },
			DE: { title: 'Pug', emoji: '🐶', blurb: 'Cozy, funny, and lovable.' }
		}
	},
	{
		id: 'forestanimal',
		name: 'What Forest Animal Are You?',
		emoji: '🌲',
		tagline: 'Wander into the woods and find your wild side.',
		accent: '#5C8A4A',
		questions: [
			{
				prompt: 'Your friends would describe you as:',
				answers: [
					{ key: 'A', text: 'Brave and protective' },
					{ key: 'B', text: 'Clever and curious' },
					{ key: 'C', text: 'Gentle and peaceful' },
					{ key: 'D', text: 'Energetic and playful' },
					{ key: 'E', text: 'Quiet and mysterious' }
				]
			},
			{
				prompt: 'Your perfect afternoon would be:',
				answers: [
					{ key: 'A', text: 'Going on a big adventure' },
					{ key: 'B', text: 'Exploring somewhere new or solving a puzzle' },
					{ key: 'C', text: 'Relaxing in a calm, cozy place' },
					{ key: 'D', text: 'Running around, playing games, or being active' },
					{ key: 'E', text: 'Spending time alone thinking, reading, or creating' }
				]
			},
			{
				prompt: 'In a group, you usually:',
				answers: [
					{ key: 'A', text: 'Look out for everyone' },
					{ key: 'B', text: 'Come up with smart ideas' },
					{ key: 'C', text: 'Keep things calm' },
					{ key: 'D', text: 'Bring the fun' },
					{ key: 'E', text: 'Watch quietly and notice details' }
				]
			},
			{
				prompt: 'Pick a forest home:',
				answers: [
					{ key: 'A', text: 'A hidden cave' },
					{ key: 'B', text: 'A den with secret tunnels' },
					{ key: 'C', text: 'A peaceful meadow' },
					{ key: 'D', text: 'A tree branch high above the ground' },
					{ key: 'E', text: 'A shadowy spot under tall trees' }
				]
			},
			{
				prompt: 'If something goes wrong, you:',
				answers: [
					{ key: 'A', text: 'Stand strong and protect others' },
					{ key: 'B', text: 'Think fast and find a clever solution' },
					{ key: 'C', text: 'Stay calm and avoid drama' },
					{ key: 'D', text: 'Move quickly and try something new' },
					{ key: 'E', text: 'Observe first, then act carefully' }
				]
			},
			{
				prompt: 'Choose a snack:',
				answers: [
					{ key: 'A', text: 'Trail mix' },
					{ key: 'B', text: 'Berries' },
					{ key: 'C', text: 'Fresh fruit' },
					{ key: 'D', text: 'Crunchy snacks' },
					{ key: 'E', text: 'Something simple and quiet' }
				]
			},
			{
				prompt: 'What annoys you most?',
				answers: [
					{ key: 'A', text: 'People being unfair' },
					{ key: 'B', text: 'Being tricked or confused' },
					{ key: 'C', text: 'Loud chaos' },
					{ key: 'D', text: 'Being bored' },
					{ key: 'E', text: 'Too much attention' }
				]
			},
			{
				prompt: 'Your biggest strength is:',
				answers: [
					{ key: 'A', text: 'Courage' },
					{ key: 'B', text: 'Cleverness' },
					{ key: 'C', text: 'Kindness' },
					{ key: 'D', text: 'Energy' },
					{ key: 'E', text: 'Focus' }
				]
			}
		],
		results: {
			A: {
				title: 'Bear',
				emoji: '🐻',
				blurb:
					'You’re brave, protective, and strong-hearted. You care about your people and can be very loyal. You may seem tough, but you probably have a softer side too.'
			},
			B: {
				title: 'Fox',
				emoji: '🦊',
				blurb:
					'You’re clever, curious, and quick-thinking. You notice things other people miss and can solve problems in creative ways. You have a smart, sneaky-cool vibe.'
			},
			C: {
				title: 'Deer',
				emoji: '🦌',
				blurb:
					'You’re gentle, peaceful, and kind. You don’t like unnecessary drama, and you’re good at making people feel calm. You have a quiet strength.'
			},
			D: {
				title: 'Squirrel',
				emoji: '🐿️',
				blurb:
					'You’re energetic, playful, and fun. You probably like being active, joking around, or jumping between different ideas. You bring movement and excitement to the group.'
			},
			E: {
				title: 'Owl',
				emoji: '🦉',
				blurb:
					'You’re quiet, observant, and thoughtful. You may not always be the loudest person, but you understand a lot. You’re wise, focused, and mysterious in a cool way.'
			}
		},
		ties: {
			AB: { title: 'Wolf', emoji: '🐺', blurb: 'Brave, clever, and loyal.' },
			AC: { title: 'Moose', emoji: '🫎', blurb: 'Strong, calm, and gentle.' },
			AD: { title: 'Raccoon', emoji: '🦝', blurb: 'Bold, playful, and mischievous.' },
			AE: { title: 'Lynx', emoji: '🐱', blurb: 'Protective, quiet, and powerful.' },
			BC: { title: 'Rabbit', emoji: '🐰', blurb: 'Gentle, quick, and curious.' },
			BD: { title: 'Chipmunk', emoji: '🐿️', blurb: 'Clever, energetic, and fun.' },
			BE: { title: 'Raven', emoji: '🐦‍⬛', blurb: 'Smart, mysterious, and observant.' },
			CD: { title: 'Hedgehog', emoji: '🦔', blurb: 'Sweet, playful, and cozy.' },
			CE: { title: 'Moth', emoji: '🦋', blurb: 'Quiet, gentle, and dreamy.' },
			DE: { title: 'Bat', emoji: '🦇', blurb: 'Energetic, mysterious, and unique.' }
		}
	},
	{
		id: 'career',
		name: 'What Future Career Fits You?',
		emoji: '💼',
		tagline: 'Just for fun — your real future can always change.',
		accent: '#3C9D9B',
		questions: [
			{
				prompt: 'Your friends would describe you as:',
				answers: [
					{ key: 'A', text: 'Creative and imaginative' },
					{ key: 'B', text: 'Helpful and caring' },
					{ key: 'C', text: 'Smart and curious' },
					{ key: 'D', text: 'Confident and organized' },
					{ key: 'E', text: 'Active and adventurous' }
				]
			},
			{
				prompt: 'Your favorite kind of school project is:',
				answers: [
					{ key: 'A', text: 'Art, writing, videos, or design' },
					{ key: 'B', text: 'Helping people or working in a group' },
					{ key: 'C', text: 'Science, math, research, or puzzles' },
					{ key: 'D', text: 'Planning, presenting, or leading' },
					{ key: 'E', text: 'Building, moving, exploring, or hands-on work' }
				]
			},
			{
				prompt: 'If you had a free afternoon, you would rather:',
				answers: [
					{ key: 'A', text: 'Make something cool' },
					{ key: 'B', text: 'Spend time helping someone or hanging out with friends' },
					{ key: 'C', text: 'Learn about something interesting' },
					{ key: 'D', text: 'Work on a goal or start a plan' },
					{ key: 'E', text: 'Go outside, play sports, or try something new' }
				]
			},
			{
				prompt: 'In a group project, you are usually:',
				answers: [
					{ key: 'A', text: 'The idea person' },
					{ key: 'B', text: 'The teammate who makes sure everyone feels included' },
					{ key: 'C', text: 'The problem-solver' },
					{ key: 'D', text: 'The leader or organizer' },
					{ key: 'E', text: 'The person who gets things done physically' }
				]
			},
			{
				prompt: 'Pick a tool:',
				answers: [
					{ key: 'A', text: 'Camera, sketchbook, or music app' },
					{ key: 'B', text: 'First-aid kit or notebook for advice' },
					{ key: 'C', text: 'Microscope, computer, or calculator' },
					{ key: 'D', text: 'Planner, microphone, or laptop' },
					{ key: 'E', text: 'Hammer, sports gear, or map' }
				]
			},
			{
				prompt: 'What would make a job exciting for you?',
				answers: [
					{ key: 'A', text: 'Getting to be creative every day' },
					{ key: 'B', text: 'Making people’s lives better' },
					{ key: 'C', text: 'Solving big questions or problems' },
					{ key: 'D', text: 'Being in charge of something important' },
					{ key: 'E', text: 'Doing something different and active' }
				]
			},
			{
				prompt: 'What bothers you most?',
				answers: [
					{ key: 'A', text: 'Being told there’s only one “right” way to do things' },
					{ key: 'B', text: 'People being treated unfairly' },
					{ key: 'C', text: 'Not understanding how something works' },
					{ key: 'D', text: 'Chaos with no plan' },
					{ key: 'E', text: 'Sitting still for too long' }
				]
			},
			{
				prompt: 'Choose a dream workplace:',
				answers: [
					{ key: 'A', text: 'A studio, stage, game company, or design room' },
					{ key: 'B', text: 'A hospital, school, animal shelter, or community center' },
					{ key: 'C', text: 'A lab, tech office, library, or space center' },
					{ key: 'D', text: 'An office, business, courtroom, or leadership meeting' },
					{ key: 'E', text: 'Outdoors, a workshop, sports field, or travel job' }
				]
			}
		],
		results: {
			A: {
				title: 'Creative Career',
				emoji: '🎨',
				blurb:
					'You might enjoy careers like artist, writer, musician, actor, filmmaker, animator, game designer, fashion designer, or content creator. You have imagination and original ideas, and you’d probably like a job where you can express yourself and make things.'
			},
			B: {
				title: 'Helping Career',
				emoji: '🤝',
				blurb:
					'You might enjoy careers like teacher, doctor, nurse, therapist, veterinarian, social worker, coach, or counselor. You care about people and want to make a difference, and you’d probably do well where kindness and listening matter.'
			},
			C: {
				title: 'Science or Tech Career',
				emoji: '🔬',
				blurb:
					'You might enjoy careers like scientist, engineer, coder, inventor, doctor, researcher, astronaut, or data analyst. You’re curious and like figuring things out, so you’d probably enjoy a career where you solve problems and learn new things.'
			},
			D: {
				title: 'Leadership or Business Career',
				emoji: '📈',
				blurb:
					'You might enjoy careers like entrepreneur, lawyer, manager, politician, business owner, marketer, or project leader. You’re organized, confident, and good at planning — you might like leading teams, making decisions, or building something big.'
			},
			E: {
				title: 'Active or Hands-On Career',
				emoji: '🛠️',
				blurb:
					'You might enjoy careers like athlete, firefighter, police officer, builder, mechanic, chef, pilot, park ranger, or travel guide. You like movement, action, and real-world challenges, and may prefer a job where every day feels different.'
			}
		},
		ties: {
			AB: {
				title: 'Creative + Helping',
				emoji: '📕',
				blurb: 'Children’s book author, art therapist, teacher, or performer.'
			},
			AC: {
				title: 'Creative + Tech',
				emoji: '🕹️',
				blurb: 'Game designer, inventor, architect, or animator.'
			},
			AD: {
				title: 'Creative + Business',
				emoji: '🎬',
				blurb: 'Creative director, entrepreneur, filmmaker, or fashion brand owner.'
			},
			AE: {
				title: 'Creative + Active',
				emoji: '📷',
				blurb: 'Photographer, chef, stunt performer, or travel creator.'
			},
			BC: {
				title: 'Helping + Science',
				emoji: '🩺',
				blurb: 'Doctor, veterinarian, psychologist, or environmental scientist.'
			},
			BD: {
				title: 'Helping + Business',
				emoji: '🏫',
				blurb: 'Principal, lawyer, nonprofit leader, or community organizer.'
			},
			BE: {
				title: 'Helping + Active',
				emoji: '🚒',
				blurb: 'Coach, firefighter, nurse, or animal rescue worker.'
			},
			CD: {
				title: 'Science + Business',
				emoji: '💻',
				blurb: 'Engineer, tech founder, scientist, or financial analyst.'
			},
			CE: {
				title: 'Science + Active',
				emoji: '✈️',
				blurb: 'Pilot, forensic scientist, robotics engineer, or wildlife biologist.'
			},
			DE: {
				title: 'Business + Active',
				emoji: '🏟️',
				blurb: 'Business owner, event planner, military leader, or sports manager.'
			}
		}
	},
	{
		id: 'dreamhouse',
		name: 'What Would Your Dream House Be?',
		emoji: '🏡',
		tagline: 'Open the door to the home that fits you.',
		accent: '#5BA0D6',
		questions: [
			{
				prompt: 'Your perfect weekend would be:',
				answers: [
					{ key: 'A', text: 'Swimming, relaxing in the sun, or going somewhere beautiful' },
					{ key: 'B', text: 'Playing games, watching movies, or hanging out with friends' },
					{ key: 'C', text: 'Reading, drawing, baking, or doing something cozy' },
					{ key: 'D', text: 'Exploring nature or going on an adventure' },
					{ key: 'E', text: 'Creating, decorating, or building something cool' }
				]
			},
			{
				prompt: 'Your friends would describe you as:',
				answers: [
					{ key: 'A', text: 'Chill and fun' },
					{ key: 'B', text: 'Social and energetic' },
					{ key: 'C', text: 'Calm and comforting' },
					{ key: 'D', text: 'Adventurous and outdoorsy' },
					{ key: 'E', text: 'Creative and unique' }
				]
			},
			{
				prompt: 'Pick a view from your window:',
				answers: [
					{ key: 'A', text: 'Ocean waves' },
					{ key: 'B', text: 'A city skyline' },
					{ key: 'C', text: 'A quiet garden' },
					{ key: 'D', text: 'Mountains or forest' },
					{ key: 'E', text: 'A colorful neighborhood or cool courtyard' }
				]
			},
			{
				prompt: 'Your dream room would have:',
				answers: [
					{ key: 'A', text: 'Big windows and beachy colors' },
					{ key: 'B', text: 'A game room, movie room, or hangout space' },
					{ key: 'C', text: 'Soft blankets, bookshelves, and warm lights' },
					{ key: 'D', text: 'Camping gear, sports stuff, or outdoor equipment' },
					{ key: 'E', text: 'Art supplies, music gear, or a secret creative space' }
				]
			},
			{
				prompt: 'What matters most in a home?',
				answers: [
					{ key: 'A', text: 'Relaxing and feeling like you’re on vacation' },
					{ key: 'B', text: 'Having space for people and fun' },
					{ key: 'C', text: 'Feeling safe, cozy, and peaceful' },
					{ key: 'D', text: 'Being close to nature' },
					{ key: 'E', text: 'Showing your personality' }
				]
			},
			{
				prompt: 'Choose a home feature:',
				answers: [
					{ key: 'A', text: 'Pool or balcony' },
					{ key: 'B', text: 'Huge living room' },
					{ key: 'C', text: 'Fireplace or reading nook' },
					{ key: 'D', text: 'Treehouse, garden, or hiking trail nearby' },
					{ key: 'E', text: 'Secret room, art studio, or rooftop space' }
				]
			},
			{
				prompt: 'If you hosted friends, you would:',
				answers: [
					{ key: 'A', text: 'Have a pool party or beach day' },
					{ key: 'B', text: 'Throw a game/movie night' },
					{ key: 'C', text: 'Make snacks and have a cozy hangout' },
					{ key: 'D', text: 'Go outside for an adventure' },
					{ key: 'E', text: 'Plan a themed party or creative activity' }
				]
			},
			{
				prompt: 'Pick a color palette:',
				answers: [
					{ key: 'A', text: 'Blue, white, and sandy beige' },
					{ key: 'B', text: 'Bright colors and bold lights' },
					{ key: 'C', text: 'Cream, brown, and soft gold' },
					{ key: 'D', text: 'Green, gray, and wood tones' },
					{ key: 'E', text: 'Purple, teal, black, or rainbow colors' }
				]
			}
		],
		results: {
			A: {
				title: 'Beach House',
				emoji: '🌊',
				blurb:
					'Your dream house would be bright, sunny, and relaxing. You’d love big windows, ocean views, and a peaceful vacation feeling. Your home would be the perfect place to chill and recharge.'
			},
			B: {
				title: 'Modern City House',
				emoji: '🏙️',
				blurb:
					'Your dream house would be stylish, exciting, and full of fun spaces. You’d probably want a game room, movie area, cool lights, and plenty of room for friends. Your home would feel energetic and social.'
			},
			C: {
				title: 'Cozy Cottage',
				emoji: '🕯️',
				blurb:
					'Your dream house would be warm, peaceful, and comforting. Think blankets, books, candles, a fireplace, and a kitchen that smells like cookies. Your home would feel safe and relaxing.'
			},
			D: {
				title: 'Forest Cabin',
				emoji: '🌲',
				blurb:
					'Your dream house would be surrounded by nature. You’d love trees, trails, animals, fresh air, and maybe a treehouse or garden. Your home would be adventurous but still peaceful.'
			},
			E: {
				title: 'Creative Dream House',
				emoji: '🎨',
				blurb:
					'Your dream house would be unique and full of personality. It might have secret rooms, colorful walls, a studio, a music space, or weird furniture that somehow looks awesome. Your home would be totally yours.'
			}
		},
		ties: {
			AB: {
				title: 'Luxury Penthouse with a pool',
				emoji: '🏊',
				blurb: 'Social, stylish, and relaxing.'
			},
			AC: { title: 'Seaside Cottage', emoji: '🐚', blurb: 'Calm, cozy, and beachy.' },
			AD: { title: 'Lake House', emoji: '🛶', blurb: 'Peaceful, outdoorsy, and fun.' },
			AE: { title: 'Colorful Beach Villa', emoji: '🌴', blurb: 'Creative, sunny, and unique.' },
			BC: { title: 'Big Family House', emoji: '🏠', blurb: 'Fun, cozy, and welcoming.' },
			BD: { title: 'Mountain Lodge', emoji: '🏔️', blurb: 'Social, adventurous, and warm.' },
			BE: { title: 'Futuristic Smart House', emoji: '🤖', blurb: 'Bold, fun, and creative.' },
			CD: { title: 'Woodland Cottage', emoji: '🍄', blurb: 'Peaceful, cozy, and nature-loving.' },
			CE: { title: 'Storybook House', emoji: '📖', blurb: 'Cozy, magical, and artistic.' },
			DE: {
				title: 'Eco Treehouse',
				emoji: '🌳',
				blurb: 'Adventurous, creative, and close to nature.'
			}
		}
	},
	{
		id: 'plant',
		name: 'What Plant Are You?',
		emoji: '🌿',
		tagline: 'Take root and discover your green personality.',
		accent: '#6FA85A',
		questions: [
			{
				prompt: 'Your friends would describe you as:',
				answers: [
					{ key: 'A', text: 'Bright and cheerful' },
					{ key: 'B', text: 'Calm and peaceful' },
					{ key: 'C', text: 'Strong and independent' },
					{ key: 'D', text: 'Creative and different' },
					{ key: 'E', text: 'Caring and dependable' }
				]
			},
			{
				prompt: 'Your perfect afternoon would be:',
				answers: [
					{ key: 'A', text: 'Spending time outside or laughing with friends' },
					{ key: 'B', text: 'Reading, relaxing, or listening to music' },
					{ key: 'C', text: 'Working on a goal or doing your own thing' },
					{ key: 'D', text: 'Making art, decorating, or trying a new idea' },
					{ key: 'E', text: 'Helping someone or spending time with family/friends' }
				]
			},
			{
				prompt: 'In a group, you usually:',
				answers: [
					{ key: 'A', text: 'Bring positive energy' },
					{ key: 'B', text: 'Keep things calm' },
					{ key: 'C', text: 'Stay focused and handle problems' },
					{ key: 'D', text: 'Add unique ideas' },
					{ key: 'E', text: 'Make sure everyone feels included' }
				]
			},
			{
				prompt: 'Pick a place to grow:',
				answers: [
					{ key: 'A', text: 'A sunny field' },
					{ key: 'B', text: 'A quiet pond' },
					{ key: 'C', text: 'A dry desert' },
					{ key: 'D', text: 'A colorful garden' },
					{ key: 'E', text: 'A cozy backyard' }
				]
			},
			{
				prompt: 'If something goes wrong, you:',
				answers: [
					{ key: 'A', text: 'Try to stay positive' },
					{ key: 'B', text: 'Take a deep breath and stay calm' },
					{ key: 'C', text: 'Push through and don’t give up' },
					{ key: 'D', text: 'Think of a creative solution' },
					{ key: 'E', text: 'Check on everyone and help fix it' }
				]
			},
			{
				prompt: 'Choose a color:',
				answers: [
					{ key: 'A', text: 'Yellow' },
					{ key: 'B', text: 'Blue or white' },
					{ key: 'C', text: 'Green' },
					{ key: 'D', text: 'Purple or rainbow' },
					{ key: 'E', text: 'Pink or red' }
				]
			},
			{
				prompt: 'What annoys you most?',
				answers: [
					{ key: 'A', text: 'Negative energy' },
					{ key: 'B', text: 'Loud chaos' },
					{ key: 'C', text: 'People giving up too fast' },
					{ key: 'D', text: 'Being forced to be boring' },
					{ key: 'E', text: 'People being unkind' }
				]
			},
			{
				prompt: 'Your biggest strength is:',
				answers: [
					{ key: 'A', text: 'Positivity' },
					{ key: 'B', text: 'Peacefulness' },
					{ key: 'C', text: 'Resilience' },
					{ key: 'D', text: 'Imagination' },
					{ key: 'E', text: 'Loyalty' }
				]
			}
		],
		results: {
			A: {
				title: 'Sunflower',
				emoji: '🌻',
				blurb:
					'You’re bright, cheerful, and full of positive energy. You can make people smile and bring warmth into a room. People probably enjoy your happy, sunny vibe.'
			},
			B: {
				title: 'Water Lily',
				emoji: '🪷',
				blurb:
					'You’re calm, peaceful, and thoughtful. You don’t need to be loud to be noticed. You have a gentle energy that helps people feel relaxed.'
			},
			C: {
				title: 'Cactus',
				emoji: '🌵',
				blurb:
					'You’re strong, independent, and resilient. You can handle tough situations and keep going. You may like your space, but you’re still awesome to be around.'
			},
			D: {
				title: 'Orchid',
				emoji: '🌺',
				blurb:
					'You’re creative, unique, and interesting. You have your own style and ideas, and you probably don’t like being forced to fit in.'
			},
			E: {
				title: 'Rose',
				emoji: '🌹',
				blurb:
					'You’re caring, loyal, and dependable. You protect the people you care about and bring beauty and kindness into your friendships.'
			}
		},
		ties: {
			AB: { title: 'Daisy', emoji: '🌼', blurb: 'Cheerful, gentle, and sweet.' },
			AC: { title: 'Aloe Vera', emoji: '🪴', blurb: 'Positive, strong, and helpful.' },
			AD: { title: 'Hibiscus', emoji: '🌺', blurb: 'Bright, creative, and bold.' },
			AE: { title: 'Tulip', emoji: '🌷', blurb: 'Cheerful, loyal, and kind.' },
			BC: { title: 'Bonsai Tree', emoji: '🎍', blurb: 'Calm, strong, and patient.' },
			BD: { title: 'Lavender', emoji: '💜', blurb: 'Peaceful, creative, and soothing.' },
			BE: { title: 'Cherry Blossom', emoji: '🌸', blurb: 'Gentle, caring, and beautiful.' },
			CD: { title: 'Venus Flytrap', emoji: '🪤', blurb: 'Independent, unique, and surprising.' },
			CE: { title: 'Ivy', emoji: '🌿', blurb: 'Loyal, strong, and dependable.' },
			DE: { title: 'Poppy', emoji: '🌺', blurb: 'Creative, caring, and memorable.' }
		}
	},
	{
		id: 'color',
		name: 'What Color Are You?',
		emoji: '🎨',
		tagline: 'Eight questions to reveal your true shade.',
		accent: '#E0567A',
		questions: [
			{
				prompt: 'Your friends would describe you as:',
				answers: [
					{ key: 'A', text: 'Energetic and bold' },
					{ key: 'B', text: 'Calm and trustworthy' },
					{ key: 'C', text: 'Kind and cheerful' },
					{ key: 'D', text: 'Creative and mysterious' },
					{ key: 'E', text: 'Peaceful and balanced' }
				]
			},
			{
				prompt: 'Your perfect day would be:',
				answers: [
					{ key: 'A', text: 'Doing something exciting or competitive' },
					{ key: 'B', text: 'Relaxing, reading, or having a deep conversation' },
					{ key: 'C', text: 'Laughing with friends or helping someone' },
					{ key: 'D', text: 'Making art, music, videos, stories, or trying something unusual' },
					{ key: 'E', text: 'Spending time in nature or somewhere quiet' }
				]
			},
			{
				prompt: 'In a group, you usually:',
				answers: [
					{ key: 'A', text: 'Bring the energy' },
					{ key: 'B', text: 'Stay calm and think things through' },
					{ key: 'C', text: 'Make people feel included' },
					{ key: 'D', text: 'Come up with original ideas' },
					{ key: 'E', text: 'Keep things peaceful and fair' }
				]
			},
			{
				prompt: 'Pick a place:',
				answers: [
					{ key: 'A', text: 'A stadium, concert, or amusement park' },
					{ key: 'B', text: 'The ocean, a library, or a quiet room' },
					{ key: 'C', text: 'A sunny park or cozy kitchen' },
					{ key: 'D', text: 'An art studio, theater, or hidden room' },
					{ key: 'E', text: 'A forest, garden, or mountain trail' }
				]
			},
			{
				prompt: 'If something goes wrong, you:',
				answers: [
					{ key: 'A', text: 'Take action fast' },
					{ key: 'B', text: 'Stay calm and make a smart plan' },
					{ key: 'C', text: 'Check how everyone is feeling' },
					{ key: 'D', text: 'Think of a creative solution' },
					{ key: 'E', text: 'Try to keep the peace and fix things gently' }
				]
			},
			{
				prompt: 'Choose a word:',
				answers: [
					{ key: 'A', text: 'Power' },
					{ key: 'B', text: 'Trust' },
					{ key: 'C', text: 'Joy' },
					{ key: 'D', text: 'Imagination' },
					{ key: 'E', text: 'Balance' }
				]
			},
			{
				prompt: 'What annoys you most?',
				answers: [
					{ key: 'A', text: 'Being told you can’t do something' },
					{ key: 'B', text: 'People being dishonest' },
					{ key: 'C', text: 'Negativity' },
					{ key: 'D', text: 'Boring routines' },
					{ key: 'E', text: 'Unfairness or drama' }
				]
			},
			{
				prompt: 'Your biggest strength is:',
				answers: [
					{ key: 'A', text: 'Confidence' },
					{ key: 'B', text: 'Loyalty' },
					{ key: 'C', text: 'Positivity' },
					{ key: 'D', text: 'Creativity' },
					{ key: 'E', text: 'Patience' }
				]
			}
		],
		results: {
			A: {
				title: 'Red',
				emoji: '❤️',
				blurb:
					'You’re bold, energetic, and passionate. You like action and don’t back down easily. People may see you as confident, exciting, and brave.'
			},
			B: {
				title: 'Blue',
				emoji: '💙',
				blurb:
					'You’re calm, thoughtful, and trustworthy. People can rely on you because you’re steady and honest. You probably think before you act.'
			},
			C: {
				title: 'Yellow',
				emoji: '💛',
				blurb:
					'You’re cheerful, friendly, and positive. You bring light into people’s lives and know how to make things feel more fun and hopeful.'
			},
			D: {
				title: 'Purple',
				emoji: '💜',
				blurb:
					'You’re creative, imaginative, and unique. You have your own style and may enjoy art, music, stories, or mysterious things. You think differently in a cool way.'
			},
			E: {
				title: 'Green',
				emoji: '💚',
				blurb:
					'You’re peaceful, balanced, and caring. You like harmony and fairness, and you may feel connected to nature or calm spaces.'
			}
		},
		ties: {
			AB: { title: 'Navy', emoji: '🔵', blurb: 'Strong, focused, and trustworthy.' },
			AC: { title: 'Orange', emoji: '🧡', blurb: 'Energetic, cheerful, and bold.' },
			AD: { title: 'Magenta', emoji: '💗', blurb: 'Dramatic, creative, and confident.' },
			AE: { title: 'Maroon', emoji: '🟤', blurb: 'Powerful, grounded, and steady.' },
			BC: { title: 'Sky Blue', emoji: '🩵', blurb: 'Calm, friendly, and bright.' },
			BD: { title: 'Indigo', emoji: '🔷', blurb: 'Thoughtful, creative, and deep.' },
			BE: { title: 'Teal', emoji: '🩵', blurb: 'Peaceful, smart, and balanced.' },
			CD: { title: 'Pink', emoji: '💖', blurb: 'Joyful, creative, and sweet.' },
			CE: { title: 'Lime', emoji: '💚', blurb: 'Bright, kind, and fresh.' },
			DE: { title: 'Sage', emoji: '🌿', blurb: 'Creative, calm, and thoughtful.' }
		}
	},
	{
		id: 'bird',
		name: 'What Bird Are You?',
		emoji: '🐦',
		tagline: 'Spread your wings and find your flock.',
		accent: '#4DA8B0',
		questions: [
			{
				prompt: 'Your friends would describe you as:',
				answers: [
					{ key: 'A', text: 'Brave and focused' },
					{ key: 'B', text: 'Colorful and social' },
					{ key: 'C', text: 'Wise and observant' },
					{ key: 'D', text: 'Peaceful and kind' },
					{ key: 'E', text: 'Energetic and playful' }
				]
			},
			{
				prompt: 'Your perfect day would be:',
				answers: [
					{ key: 'A', text: 'Working toward a goal or going on an adventure' },
					{ key: 'B', text: 'Hanging out with friends and doing something fun' },
					{ key: 'C', text: 'Reading, thinking, or solving a mystery' },
					{ key: 'D', text: 'Relaxing somewhere calm and beautiful' },
					{ key: 'E', text: 'Running around, playing games, or trying random activities' }
				]
			},
			{
				prompt: 'In a group, you usually:',
				answers: [
					{ key: 'A', text: 'Take charge when needed' },
					{ key: 'B', text: 'Talk, laugh, and connect with people' },
					{ key: 'C', text: 'Notice details and think things through' },
					{ key: 'D', text: 'Keep things calm and fair' },
					{ key: 'E', text: 'Bring energy and silliness' }
				]
			},
			{
				prompt: 'Pick a place to fly:',
				answers: [
					{ key: 'A', text: 'Over mountains' },
					{ key: 'B', text: 'Through a colorful rainforest' },
					{ key: 'C', text: 'Under the moon at night' },
					{ key: 'D', text: 'Across a peaceful lake' },
					{ key: 'E', text: 'Around a sunny backyard or park' }
				]
			},
			{
				prompt: 'If something goes wrong, you:',
				answers: [
					{ key: 'A', text: 'Stay focused and handle it' },
					{ key: 'B', text: 'Ask friends for support or talk it out' },
					{ key: 'C', text: 'Think quietly until you understand it' },
					{ key: 'D', text: 'Try to calm everyone down' },
					{ key: 'E', text: 'Distract people with humor, then help fix it' }
				]
			},
			{
				prompt: 'Choose a color:',
				answers: [
					{ key: 'A', text: 'Brown or gold' },
					{ key: 'B', text: 'Rainbow or bright colors' },
					{ key: 'C', text: 'Dark blue or silver' },
					{ key: 'D', text: 'White or soft gray' },
					{ key: 'E', text: 'Yellow or green' }
				]
			},
			{
				prompt: 'What annoys you most?',
				answers: [
					{ key: 'A', text: 'Giving up too easily' },
					{ key: 'B', text: 'Being ignored' },
					{ key: 'C', text: 'People not paying attention' },
					{ key: 'D', text: 'Fighting or unfairness' },
					{ key: 'E', text: 'Being bored' }
				]
			},
			{
				prompt: 'Your biggest strength is:',
				answers: [
					{ key: 'A', text: 'Determination' },
					{ key: 'B', text: 'Friendliness' },
					{ key: 'C', text: 'Wisdom' },
					{ key: 'D', text: 'Peacefulness' },
					{ key: 'E', text: 'Energy' }
				]
			}
		],
		results: {
			A: {
				title: 'Eagle',
				emoji: '🦅',
				blurb:
					'You’re brave, focused, and determined. You like goals, challenges, and feeling independent. People may see you as strong and confident.'
			},
			B: {
				title: 'Parrot',
				emoji: '🦜',
				blurb:
					'You’re colorful, social, and expressive. You bring fun energy to people around you and probably enjoy talking, laughing, or sharing ideas.'
			},
			C: {
				title: 'Owl',
				emoji: '🦉',
				blurb:
					'You’re wise, observant, and thoughtful. You notice details and may enjoy mysteries, facts, books, or figuring things out.'
			},
			D: {
				title: 'Dove',
				emoji: '🕊️',
				blurb:
					'You’re peaceful, kind, and calming. You care about fairness and want people to get along. Your gentle energy can make others feel safe.'
			},
			E: {
				title: 'Hummingbird',
				emoji: '🌺',
				blurb:
					'You’re energetic, playful, and curious. You move quickly between ideas and activities, and you bring bright, lively energy wherever you go.'
			}
		},
		ties: {
			AB: { title: 'Hawk', emoji: '🦅', blurb: 'Bold, sharp, and expressive.' },
			AC: { title: 'Raven', emoji: '🐦‍⬛', blurb: 'Focused, clever, and mysterious.' },
			AD: { title: 'Swan', emoji: '🦢', blurb: 'Graceful, strong, and peaceful.' },
			AE: { title: 'Falcon', emoji: '🦅', blurb: 'Fast, brave, and energetic.' },
			BC: { title: 'Cockatoo', emoji: '🦜', blurb: 'Social, clever, and funny.' },
			BD: { title: 'Lovebird', emoji: '🐦', blurb: 'Friendly, sweet, and peaceful.' },
			BE: { title: 'Toucan', emoji: '🦜', blurb: 'Colorful, playful, and fun.' },
			CD: { title: 'Crane', emoji: '🦩', blurb: 'Thoughtful, calm, and graceful.' },
			CE: { title: 'Woodpecker', emoji: '🪶', blurb: 'Curious, focused, and energetic.' },
			DE: { title: 'Robin', emoji: '🐦', blurb: 'Cheerful, kind, and lively.' }
		}
	},
	{
		id: 'maincharacter',
		name: 'What Kind of Main Character Are You?',
		emoji: '✨',
		tagline: 'If your life were a story, who would you be?',
		accent: '#B05BE6',
		questions: [
			{
				prompt: 'Your friends would describe you as:',
				answers: [
					{ key: 'A', text: 'Brave and bold' },
					{ key: 'B', text: 'Funny and chaotic' },
					{ key: 'C', text: 'Smart and curious' },
					{ key: 'D', text: 'Kind and loyal' },
					{ key: 'E', text: 'Creative and mysterious' }
				]
			},
			{
				prompt: 'If your life became a movie, the opening scene would be:',
				answers: [
					{ key: 'A', text: 'You getting ready for a big challenge' },
					{ key: 'B', text: 'You accidentally causing a hilarious problem' },
					{ key: 'C', text: 'You discovering a strange clue' },
					{ key: 'D', text: 'You helping a friend who needs you' },
					{ key: 'E', text: 'You finding a secret door, map, or message' }
				]
			},
			{
				prompt: 'In a group project, you are usually:',
				answers: [
					{ key: 'A', text: 'The leader' },
					{ key: 'B', text: 'The comedian' },
					{ key: 'C', text: 'The problem-solver' },
					{ key: 'D', text: 'The supporter' },
					{ key: 'E', text: 'The idea person' }
				]
			},
			{
				prompt: 'Pick a sidekick:',
				answers: [
					{ key: 'A', text: 'A brave wolf' },
					{ key: 'B', text: 'A talking raccoon' },
					{ key: 'C', text: 'A robot assistant' },
					{ key: 'D', text: 'A loyal golden retriever' },
					{ key: 'E', text: 'A magical black cat' }
				]
			},
			{
				prompt: 'If you found a mysterious glowing object, you would:',
				answers: [
					{ key: 'A', text: 'Pick it up and see what happens' },
					{ key: 'B', text: 'Make a joke, then poke it with a stick' },
					{ key: 'C', text: 'Study it carefully' },
					{ key: 'D', text: 'Ask if it could be dangerous for anyone nearby' },
					{ key: 'E', text: 'Feel like it was meant for you' }
				]
			},
			{
				prompt: 'Your biggest strength is:',
				answers: [
					{ key: 'A', text: 'Courage' },
					{ key: 'B', text: 'Humor' },
					{ key: 'C', text: 'Intelligence' },
					{ key: 'D', text: 'Kindness' },
					{ key: 'E', text: 'Imagination' }
				]
			},
			{
				prompt: 'Choose a setting:',
				answers: [
					{ key: 'A', text: 'A battlefield, arena, or mountain' },
					{ key: 'B', text: 'A school where everything keeps going wrong' },
					{ key: 'C', text: 'A lab, library, or detective office' },
					{ key: 'D', text: 'A cozy town full of friends and family' },
					{ key: 'E', text: 'An enchanted forest or hidden magical city' }
				]
			},
			{
				prompt: 'What annoys you most?',
				answers: [
					{ key: 'A', text: 'People giving up too fast' },
					{ key: 'B', text: 'Boring situations' },
					{ key: 'C', text: 'Not knowing the answer' },
					{ key: 'D', text: 'People being mean or unfair' },
					{ key: 'E', text: 'Being forced to act normal' }
				]
			}
		],
		results: {
			A: {
				title: 'The Hero Main Character',
				emoji: '🗡️',
				blurb:
					'You’re brave, determined, and ready to face challenges. You’re the type of main character who protects others and doesn’t quit easily.'
			},
			B: {
				title: 'The Comedy Main Character',
				emoji: '😂',
				blurb:
					'You’re funny, playful, and full of personality. Even when things go wrong, you can make the story entertaining.'
			},
			C: {
				title: 'The Mystery Main Character',
				emoji: '🔎',
				blurb:
					'You’re curious, clever, and observant. You notice details other people miss and would probably solve the case before everyone else.'
			},
			D: {
				title: 'The Heart-of-the-Story Main Character',
				emoji: '💛',
				blurb:
					'You’re loyal, caring, and trustworthy. You’re the character people root for because you care about doing the right thing.'
			},
			E: {
				title: 'The Magical Main Character',
				emoji: '🌙',
				blurb:
					'You’re creative, unique, and imaginative. Your story would be full of secrets, magic, and big “chosen one” energy.'
			}
		},
		ties: {
			AB: { title: 'Action Comedy Star', emoji: '💥', blurb: 'Brave, funny, and chaotic.' },
			AC: { title: 'Spy Hero', emoji: '🕵️', blurb: 'Bold, smart, and focused.' },
			AD: { title: 'Noble Protector', emoji: '🛡️', blurb: 'Brave, loyal, and kind.' },
			AE: { title: 'Chosen One', emoji: '⚡', blurb: 'Powerful, creative, and adventurous.' },
			BC: { title: 'Funny Detective', emoji: '🔍', blurb: 'Clever, silly, and unpredictable.' },
			BD: { title: 'Best Friend Main Character', emoji: '🤝', blurb: 'Sweet, funny, and lovable.' },
			BE: { title: 'Magical Trickster', emoji: '🎩', blurb: 'Creative, funny, and mysterious.' },
			CD: {
				title: 'Thoughtful Problem-Solver',
				emoji: '🧩',
				blurb: 'Smart, kind, and dependable.'
			},
			CE: { title: 'Secret Genius', emoji: '🧠', blurb: 'Mysterious, imaginative, and clever.' },
			DE: { title: 'Gentle Dreamer', emoji: '🌸', blurb: 'Caring, creative, and magical.' }
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
