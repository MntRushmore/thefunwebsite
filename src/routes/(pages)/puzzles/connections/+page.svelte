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
