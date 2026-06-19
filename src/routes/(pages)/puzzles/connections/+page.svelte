<script>
	import { onMount } from 'svelte';

	// Daily puzzles - each has 4 categories of 4 words
	const PUZZLES = [
		{
			categories: [
				{ name: 'FRUITS', color: '#f9df6d', words: ['APPLE', 'GRAPE', 'LEMON', 'PEACH'] },
				{ name: 'PLANETS', color: '#a0c35a', words: ['MARS', 'VENUS', 'EARTH', 'SATURN'] },
				{ name: 'MUSIC GENRES', color: '#b0c4ef', words: ['ROCK', 'JAZZ', 'BLUES', 'METAL'] },
				{ name: 'CARD GAMES', color: '#ba81c5', words: ['POKER', 'BRIDGE', 'HEARTS', 'SPADES'] }
			]
		},
		{
			categories: [
				{ name: 'TYPES OF BREAD', color: '#f9df6d', words: ['WHITE', 'WHEAT', 'RYE', 'SOURDOUGH'] },
				{ name: 'SHADES OF BLUE', color: '#a0c35a', words: ['NAVY', 'SKY', 'ROYAL', 'TEAL'] },
				{ name: 'PIZZA TOPPINGS', color: '#b0c4ef', words: ['PEPPERONI', 'MUSHROOM', 'OLIVE', 'ONION'] },
				{ name: 'THINGS THAT SPIN', color: '#ba81c5', words: ['TOP', 'WHEEL', 'RECORD', 'TORNADO'] }
			]
		},
		{
			categories: [
				{ name: 'BODY PARTS', color: '#f9df6d', words: ['HEAD', 'HAND', 'FOOT', 'HEART'] },
				{ name: 'WEATHER', color: '#a0c35a', words: ['RAIN', 'SNOW', 'WIND', 'STORM'] },
				{ name: 'BOARD GAMES', color: '#b0c4ef', words: ['CHESS', 'CHECKERS', 'MONOPOLY', 'CLUE'] },
				{ name: 'COFFEE DRINKS', color: '#ba81c5', words: ['LATTE', 'MOCHA', 'ESPRESSO', 'AMERICANO'] }
			]
		},
		{
			categories: [
				{ name: 'COLORS', color: '#f9df6d', words: ['RED', 'BLUE', 'GREEN', 'YELLOW'] },
				{ name: 'ANIMALS', color: '#a0c35a', words: ['DOG', 'CAT', 'BIRD', 'FISH'] },
				{ name: 'SPORTS', color: '#b0c4ef', words: ['SOCCER', 'TENNIS', 'GOLF', 'HOCKEY'] },
				{ name: 'INSTRUMENTS', color: '#ba81c5', words: ['PIANO', 'GUITAR', 'DRUMS', 'VIOLIN'] }
			]
		},
		{
			categories: [
				{ name: 'THINGS IN A KITCHEN', color: '#f9df6d', words: ['STOVE', 'SINK', 'FRIDGE', 'OVEN'] },
				{ name: 'SOCIAL MEDIA', color: '#a0c35a', words: ['TWITTER', 'TIKTOK', 'SNAPCHAT', 'INSTAGRAM'] },
				{ name: 'MOVIE GENRES', color: '#b0c4ef', words: ['COMEDY', 'HORROR', 'ACTION', 'DRAMA'] },
				{ name: 'THINGS YOU WEAR', color: '#ba81c5', words: ['SHIRT', 'PANTS', 'SHOES', 'HAT'] }
			]
		},
		{
			categories: [
				{ name: 'TAYLOR SWIFT ALBUMS', color: '#f9df6d', words: ['FEARLESS', 'REPUTATION', 'LOVER', 'FOLKLORE'] },
				{ name: 'TYPES OF DANCE', color: '#a0c35a', words: ['SALSA', 'BALLET', 'TANGO', 'WALTZ'] },
				{ name: 'CANDY BARS', color: '#b0c4ef', words: ['SNICKERS', 'TWIX', 'MILKYWAY', 'KITKAT'] },
				{ name: '_____ KING', color: '#ba81c5', words: ['BURGER', 'LION', 'DRAG', 'HOMECOMING'] }
			]
		},
		{
			categories: [
				{ name: 'VEGETABLES', color: '#f9df6d', words: ['CARROT', 'BROCCOLI', 'SPINACH', 'CELERY'] },
				{ name: 'HARRY POTTER HOUSES', color: '#a0c35a', words: ['GRYFFINDOR', 'SLYTHERIN', 'RAVENCLAW', 'HUFFLEPUFF'] },
				{ name: 'SHOE BRANDS', color: '#b0c4ef', words: ['NIKE', 'ADIDAS', 'PUMA', 'REEBOK'] },
				{ name: 'THINGS WITH KEYS', color: '#ba81c5', words: ['PIANO', 'KEYBOARD', 'CAR', 'LOCK'] }
			]
		},
		{
			categories: [
				{ name: 'BREAKFAST FOODS', color: '#f9df6d', words: ['PANCAKES', 'WAFFLES', 'BACON', 'EGGS'] },
				{ name: 'SUPERHEROES', color: '#a0c35a', words: ['BATMAN', 'SUPERMAN', 'SPIDERMAN', 'IRONMAN'] },
				{ name: 'OCEAN CREATURES', color: '#b0c4ef', words: ['SHARK', 'DOLPHIN', 'OCTOPUS', 'WHALE'] },
				{ name: 'THINGS THAT ARE ROUND', color: '#ba81c5', words: ['BALL', 'MOON', 'PIZZA', 'COIN'] }
			]
		},
		{
			categories: [
				{ name: 'ICE CREAM FLAVORS', color: '#f9df6d', words: ['VANILLA', 'CHOCOLATE', 'STRAWBERRY', 'MINT'] },
				{ name: 'CAR BRANDS', color: '#a0c35a', words: ['TOYOTA', 'HONDA', 'FORD', 'TESLA'] },
				{ name: 'DISNEY PRINCESSES', color: '#b0c4ef', words: ['ARIEL', 'BELLE', 'JASMINE', 'MULAN'] },
				{ name: 'THINGS IN SPACE', color: '#ba81c5', words: ['STAR', 'COMET', 'ASTEROID', 'GALAXY'] }
			]
		},
		{
			categories: [
				{ name: 'FAST FOOD CHAINS', color: '#f9df6d', words: ['MCDONALDS', 'WENDYS', 'CHICKFILA', 'SUBWAY'] },
				{ name: 'GREEK GODS', color: '#a0c35a', words: ['ZEUS', 'POSEIDON', 'HADES', 'APOLLO'] },
				{ name: 'SCHOOL SUBJECTS', color: '#b0c4ef', words: ['MATH', 'ENGLISH', 'SCIENCE', 'HISTORY'] },
				{ name: 'THINGS WITH STRINGS', color: '#ba81c5', words: ['GUITAR', 'PUPPET', 'KITE', 'YOYO'] }
			]
		},
		{
			categories: [
				{ name: 'PASTA SHAPES', color: '#f9df6d', words: ['PENNE', 'SPAGHETTI', 'RIGATONI', 'FUSILLI'] },
				{ name: 'AVENGERS', color: '#a0c35a', words: ['THOR', 'HULK', 'HAWKEYE', 'WIDOW'] },
				{ name: 'DOG BREEDS', color: '#b0c4ef', words: ['POODLE', 'BEAGLE', 'HUSKY', 'BULLDOG'] },
				{ name: '_____ BALL', color: '#ba81c5', words: ['BASKET', 'FOOT', 'BASE', 'VOLLEY'] }
			]
		},
		{
			categories: [
				{ name: 'SEASONS', color: '#f9df6d', words: ['SPRING', 'SUMMER', 'FALL', 'WINTER'] },
				{ name: 'NINJA TURTLES', color: '#a0c35a', words: ['LEONARDO', 'DONATELLO', 'RAPHAEL', 'MICHELANGELO'] },
				{ name: 'PRECIOUS STONES', color: '#b0c4ef', words: ['DIAMOND', 'RUBY', 'EMERALD', 'SAPPHIRE'] },
				{ name: 'WORDS BEFORE "HOUSE"', color: '#ba81c5', words: ['WHITE', 'GREEN', 'TREE', 'FIRE'] }
			]
		},
		{
			categories: [
				{ name: 'FURNITURE', color: '#f9df6d', words: ['COUCH', 'TABLE', 'CHAIR', 'BED'] },
				{ name: 'ELEMENTS', color: '#a0c35a', words: ['OXYGEN', 'CARBON', 'HYDROGEN', 'NITROGEN'] },
				{ name: 'VIDEO GAMES', color: '#b0c4ef', words: ['MINECRAFT', 'FORTNITE', 'ROBLOX', 'ZELDA'] },
				{ name: 'THINGS THAT DRIP', color: '#ba81c5', words: ['FAUCET', 'CANDLE', 'NOSE', 'ICICLE'] }
			]
		},
		{
			categories: [
				{ name: 'PIZZA TYPES', color: '#f9df6d', words: ['MARGHERITA', 'PEPPERONI', 'HAWAIIAN', 'SUPREME'] },
				{ name: 'ZODIAC SIGNS', color: '#a0c35a', words: ['ARIES', 'LEO', 'SCORPIO', 'PISCES'] },
				{ name: 'COUNTRIES', color: '#b0c4ef', words: ['FRANCE', 'JAPAN', 'BRAZIL', 'EGYPT'] },
				{ name: 'THINGS THAT BLOOM', color: '#ba81c5', words: ['FLOWER', 'ROMANCE', 'ALGAE', 'YOUTH'] }
			]
		},
		{
			categories: [
				{ name: 'SODAS', color: '#f9df6d', words: ['COKE', 'PEPSI', 'SPRITE', 'FANTA'] },
				{ name: 'POKEMON', color: '#a0c35a', words: ['PIKACHU', 'CHARIZARD', 'BULBASAUR', 'SQUIRTLE'] },
				{ name: 'TREE TYPES', color: '#b0c4ef', words: ['OAK', 'MAPLE', 'PINE', 'BIRCH'] },
				{ name: 'WORDS AFTER "BLACK"', color: '#ba81c5', words: ['BERRY', 'BOARD', 'SMITH', 'JACK'] }
			]
		},
		{
			categories: [
				{ name: 'DESSERTS', color: '#f9df6d', words: ['CAKE', 'PIE', 'BROWNIE', 'COOKIE'] },
				{ name: 'STREAMING SERVICES', color: '#a0c35a', words: ['NETFLIX', 'HULU', 'DISNEY', 'AMAZON'] },
				{ name: 'DANCES', color: '#b0c4ef', words: ['FLOSS', 'MOONWALK', 'MACARENA', 'SHUFFLE'] },
				{ name: 'DOUBLE LETTERS', color: '#ba81c5', words: ['COMMITTEE', 'BALLOON', 'BROCCOLI', 'COFFEE'] }
			]
		},
		{
			categories: [
				{ name: 'BREAKFAST CEREALS', color: '#f9df6d', words: ['CHEERIOS', 'FROSTED', 'LUCKY', 'CAPTAIN'] },
				{ name: 'PLANETS IN ORDER', color: '#a0c35a', words: ['MERCURY', 'VENUS', 'EARTH', 'MARS'] },
				{ name: 'THINGS AT A BEACH', color: '#b0c4ef', words: ['SAND', 'WAVES', 'SHELLS', 'TOWEL'] },
				{ name: '_____ HOUSE', color: '#ba81c5', words: ['FULL', 'BEACH', 'HAUNTED', 'OPEN'] }
			]
		},
		{
			categories: [
				{ name: 'EMOTIONS', color: '#f9df6d', words: ['HAPPY', 'SAD', 'ANGRY', 'SCARED'] },
				{ name: 'BABY ANIMALS', color: '#a0c35a', words: ['PUPPY', 'KITTEN', 'CALF', 'LAMB'] },
				{ name: 'PHONES', color: '#b0c4ef', words: ['IPHONE', 'SAMSUNG', 'PIXEL', 'NOKIA'] },
				{ name: 'STARTS WITH "SUN"', color: '#ba81c5', words: ['SUNDAY', 'SUNFLOWER', 'SUNSET', 'SUNSHINE'] }
			]
		},
		{
			categories: [
				{ name: 'SANDWICHES', color: '#f9df6d', words: ['BLT', 'CLUB', 'GRILLED', 'REUBEN'] },
				{ name: 'MARVEL VILLAINS', color: '#a0c35a', words: ['THANOS', 'LOKI', 'ULTRON', 'MAGNETO'] },
				{ name: 'THINGS WITH WINGS', color: '#b0c4ef', words: ['BIRD', 'PLANE', 'BUTTERFLY', 'ANGEL'] },
				{ name: 'NBA TEAMS', color: '#ba81c5', words: ['LAKERS', 'CELTICS', 'BULLS', 'HEAT'] }
			]
		},
		{
			categories: [
				{ name: 'CHEESE TYPES', color: '#f9df6d', words: ['CHEDDAR', 'MOZZARELLA', 'SWISS', 'BRIE'] },
				{ name: 'SIMPSONS CHARACTERS', color: '#a0c35a', words: ['HOMER', 'MARGE', 'BART', 'LISA'] },
				{ name: 'FLOWERS', color: '#b0c4ef', words: ['ROSE', 'TULIP', 'DAISY', 'LILY'] },
				{ name: 'THINGS THAT TICK', color: '#ba81c5', words: ['CLOCK', 'BOMB', 'WATCH', 'METRONOME'] }
			]
		},
		{
			categories: [
				{ name: 'HOBBIES', color: '#f9df6d', words: ['PAINTING', 'READING', 'GAMING', 'COOKING'] },
				{ name: 'GAME OF THRONES HOUSES', color: '#a0c35a', words: ['STARK', 'LANNISTER', 'TARGARYEN', 'BARATHEON'] },
				{ name: 'MUSICAL TERMS', color: '#b0c4ef', words: ['TEMPO', 'RHYTHM', 'MELODY', 'HARMONY'] },
				{ name: 'WORDS WITH SILENT LETTERS', color: '#ba81c5', words: ['KNIGHT', 'GNOME', 'WRECK', 'ISLAND'] }
			]
		},
		{
			categories: [
				{ name: 'SUSHI TYPES', color: '#f9df6d', words: ['SALMON', 'TUNA', 'EEL', 'SHRIMP'] },
				{ name: 'OFFICE CHARACTERS', color: '#a0c35a', words: ['MICHAEL', 'DWIGHT', 'JIM', 'PAM'] },
				{ name: 'CAMPING GEAR', color: '#b0c4ef', words: ['TENT', 'SLEEPING', 'FLASHLIGHT', 'COMPASS'] },
				{ name: 'RHYMES WITH "NIGHT"', color: '#ba81c5', words: ['LIGHT', 'FIGHT', 'RIGHT', 'SIGHT'] }
			]
		},
		{
			categories: [
				{ name: 'BERRIES', color: '#f9df6d', words: ['STRAWBERRY', 'BLUEBERRY', 'RASPBERRY', 'BLACKBERRY'] },
				{ name: 'FRIENDS CHARACTERS', color: '#a0c35a', words: ['ROSS', 'RACHEL', 'MONICA', 'CHANDLER'] },
				{ name: 'OLYMPIC SPORTS', color: '#b0c4ef', words: ['SWIMMING', 'GYMNASTICS', 'TRACK', 'DIVING'] },
				{ name: 'APPLE PRODUCTS', color: '#ba81c5', words: ['IPHONE', 'IPAD', 'MACBOOK', 'AIRPODS'] }
			]
		},
		{
			categories: [
				{ name: 'SOUP TYPES', color: '#f9df6d', words: ['TOMATO', 'CHICKEN', 'CLAM', 'MINESTRONE'] },
				{ name: 'STAR WARS CHARACTERS', color: '#a0c35a', words: ['LUKE', 'VADER', 'YODA', 'LEIA'] },
				{ name: 'CURRENCIES', color: '#b0c4ef', words: ['DOLLAR', 'EURO', 'YEN', 'POUND'] },
				{ name: 'HOMOPHONES OF NUMBERS', color: '#ba81c5', words: ['WON', 'TOO', 'FOR', 'ATE'] }
			]
		}
	];

	let puzzle = $state(null);
	let words = $state([]);
	let selected = $state([]);
	let solvedCategories = $state([]);
	let mistakes = $state(0);
	let gameStatus = $state('playing');
	let message = $state('');
	let shake = $state(false);

	const MAX_MISTAKES = 4;

	function startNewGame() {
		puzzle = PUZZLES[Math.floor(Math.random() * PUZZLES.length)];
		words = shuffle([...puzzle.categories.flatMap(c => c.words)]);
		selected = [];
		solvedCategories = [];
		mistakes = 0;
		gameStatus = 'playing';
		message = '';
	}

	function shuffle(array) {
		const arr = [...array];
		for (let i = arr.length - 1; i > 0; i--) {
			const j = Math.floor(Math.random() * (i + 1));
			[arr[i], arr[j]] = [arr[j], arr[i]];
		}
		return arr;
	}

	function toggleWord(word) {
		if (gameStatus !== 'playing') return;
		if (solvedCategories.some(c => c.words.includes(word))) return;

		if (selected.includes(word)) {
			selected = selected.filter(w => w !== word);
		} else if (selected.length < 4) {
			selected = [...selected, word];
		}
	}

	function submitGuess() {
		if (selected.length !== 4) return;

		const matchingCategory = puzzle.categories.find(cat =>
			cat.words.every(w => selected.includes(w))
		);

		if (matchingCategory) {
			solvedCategories = [...solvedCategories, matchingCategory];
			selected = [];
			message = '';

			if (solvedCategories.length === 4) {
				gameStatus = 'won';
				message = 'Perfect! 🎉';
			}
		} else {
			// Check if 3/4 correct
			const almostCategory = puzzle.categories.find(cat =>
				cat.words.filter(w => selected.includes(w)).length === 3
			);

			if (almostCategory && !solvedCategories.includes(almostCategory)) {
				message = 'One away...';
			} else {
				message = 'Try again!';
			}

			mistakes++;
			shake = true;
			setTimeout(() => shake = false, 500);

			if (mistakes >= MAX_MISTAKES) {
				gameStatus = 'lost';
				// Reveal remaining categories
				solvedCategories = [...puzzle.categories];
				message = 'Game Over';
			}
		}
	}

	function shuffleRemaining() {
		const remaining = words.filter(w =>
			!solvedCategories.some(c => c.words.includes(w))
		);
		const solved = words.filter(w =>
			solvedCategories.some(c => c.words.includes(w))
		);
		words = [...solved, ...shuffle(remaining)];
	}

	function deselectAll() {
		selected = [];
	}

	onMount(() => {
		startNewGame();
	});
</script>

<svelte:head>
	<title>Connections · The Fun Website</title>
	<meta name="theme-color" content="#a855f7" />
</svelte:head>

<section class="panel">
	<header>
		<a href="/puzzles" class="back">← Puzzles</a>
		<h1>🔗 Connections</h1>
		<p>Find groups of 4 words that share something in common</p>
	</header>

	<div class="mistakes">
		Mistakes remaining:
		{#each Array(MAX_MISTAKES) as _, i}
			<span class="dot" class:used={i < mistakes}>●</span>
		{/each}
	</div>

	{#if message}
		<div class="message" class:win={gameStatus === 'won'} class:lose={gameStatus === 'lost'}>
			{message}
		</div>
	{/if}

	<!-- Solved categories -->
	{#each solvedCategories as category}
		<div class="solved-category" style="background: {category.color}">
			<strong>{category.name}</strong>
			<span>{category.words.join(', ')}</span>
		</div>
	{/each}

	<!-- Word grid -->
	<div class="grid" class:shake>
		{#each words.filter(w => !solvedCategories.some(c => c.words.includes(w))) as word}
			<button
				class="word"
				class:selected={selected.includes(word)}
				onclick={() => toggleWord(word)}
				disabled={gameStatus !== 'playing'}
			>
				{word}
			</button>
		{/each}
	</div>

	{#if gameStatus === 'playing'}
		<div class="actions">
			<button class="action-btn" onclick={shuffleRemaining}>Shuffle</button>
			<button class="action-btn" onclick={deselectAll} disabled={selected.length === 0}>
				Deselect All
			</button>
			<button
				class="action-btn submit"
				onclick={submitGuess}
				disabled={selected.length !== 4}
			>
				Submit
			</button>
		</div>
	{:else}
		<button class="new-game" onclick={startNewGame}>
			Play Again
		</button>
	{/if}
</section>

<style>
	.panel {
		width: min(520px, 100%);
		background-color: rgba(255, 255, 255, 0.95);
		border: 4px solid #a855f7;
		border-radius: 28px;
		padding: clamp(20px, 4vw, 36px);
		text-align: center;
		box-shadow: 0 18px 50px rgba(20, 50, 100, 0.25);
	}

	header {
		margin-bottom: 16px;
	}

	.back {
		display: inline-block;
		margin-bottom: 8px;
		color: #a855f7;
		text-decoration: none;
		font-weight: 600;
	}

	.back:hover {
		text-decoration: underline;
	}

	h1 {
		margin: 0 0 8px;
		font-size: clamp(1.5rem, 5vw, 2rem);
		font-weight: 800;
		color: #2c3e50;
	}

	p {
		margin: 0;
		color: #5a6c7d;
	}

	.mistakes {
		margin-bottom: 16px;
		font-size: 0.9rem;
		color: #5a6c7d;
	}

	.dot {
		color: #333;
		margin-left: 4px;
	}

	.dot.used {
		color: #ccc;
	}

	.message {
		padding: 10px 20px;
		margin-bottom: 16px;
		border-radius: 12px;
		font-weight: 700;
		background: #f0f0f0;
		color: #333;
	}

	.message.win {
		background: #a0c35a;
		color: white;
	}

	.message.lose {
		background: #787c7e;
		color: white;
	}

	.solved-category {
		padding: 14px;
		margin-bottom: 8px;
		border-radius: 12px;
		text-align: center;
	}

	.solved-category strong {
		display: block;
		font-size: 0.85rem;
		margin-bottom: 4px;
	}

	.solved-category span {
		font-size: 0.9rem;
	}

	.grid {
		display: grid;
		grid-template-columns: repeat(4, 1fr);
		gap: 8px;
		margin-bottom: 20px;
	}

	.grid.shake {
		animation: shake 0.5s ease;
	}

	@keyframes shake {
		0%, 100% { transform: translateX(0); }
		20% { transform: translateX(-5px); }
		40% { transform: translateX(5px); }
		60% { transform: translateX(-5px); }
		80% { transform: translateX(5px); }
	}

	.word {
		padding: clamp(14px, 3vw, 18px) 8px;
		border: none;
		border-radius: 10px;
		background: #efefe6;
		font-size: clamp(0.7rem, 2.5vw, 0.95rem);
		font-weight: 700;
		cursor: pointer;
		transition: all 0.15s ease;
		text-transform: uppercase;
	}

	.word:hover:not(:disabled) {
		transform: scale(1.02);
		background: #e5e5dc;
	}

	.word.selected {
		background: #5a5a4d;
		color: white;
	}

	.word:disabled {
		cursor: not-allowed;
		opacity: 0.7;
	}

	.actions {
		display: flex;
		justify-content: center;
		gap: 10px;
		flex-wrap: wrap;
	}

	.action-btn {
		padding: 12px 24px;
		border: 2px solid #333;
		border-radius: 24px;
		background: white;
		font-size: 0.95rem;
		font-weight: 600;
		cursor: pointer;
		transition: all 0.15s ease;
	}

	.action-btn:hover:not(:disabled) {
		background: #f5f5f5;
	}

	.action-btn:disabled {
		opacity: 0.5;
		cursor: not-allowed;
	}

	.action-btn.submit {
		background: #333;
		color: white;
	}

	.action-btn.submit:hover:not(:disabled) {
		background: #444;
	}

	.new-game {
		margin-top: 20px;
		padding: 14px 32px;
		border: 3px solid #a855f7;
		border-radius: 16px;
		background: #a855f7;
		color: white;
		font-size: 1.1rem;
		font-weight: 700;
		cursor: pointer;
		transition: all 0.2s ease;
	}

	.new-game:hover {
		background: #9333ea;
		transform: translateY(-2px);
	}
</style>
