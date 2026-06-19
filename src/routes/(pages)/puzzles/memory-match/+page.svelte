<script>
	import { onMount } from 'svelte';

	const EMOJI_SETS = [
		['🍎', '🍊', '🍋', '🍇', '🍓', '🍒', '🥝', '🍑'],
		['🐶', '🐱', '🐭', '🐹', '🐰', '🦊', '🐻', '🐼'],
		['🌸', '🌺', '🌻', '🌹', '🌷', '🌼', '💐', '🪷'],
		['⚽', '🏀', '🏈', '⚾', '🎾', '🏐', '🎱', '🏓'],
		['🚗', '🚕', '🚌', '🚎', '🏎️', '🚓', '🚑', '🚒'],
		['🎸', '🎹', '🥁', '🎺', '🎷', '🪕', '🎻', '🪗']
	];

	let cards = $state([]);
	let flipped = $state([]);
	let matched = $state([]);
	let moves = $state(0);
	let gameStatus = $state('playing');
	let startTime = $state(0);
	let elapsed = $state(0);
	let timer = null;
	let isChecking = $state(false);

	function startNewGame() {
		const emojis = EMOJI_SETS[Math.floor(Math.random() * EMOJI_SETS.length)];
		const pairs = [...emojis, ...emojis];
		cards = shuffle(pairs.map((emoji, i) => ({ id: i, emoji })));
		flipped = [];
		matched = [];
		moves = 0;
		gameStatus = 'playing';
		isChecking = false;
		startTime = Date.now();
		elapsed = 0;

		if (timer) clearInterval(timer);
		timer = setInterval(() => {
			elapsed = Math.floor((Date.now() - startTime) / 1000);
		}, 1000);
	}

	function shuffle(array) {
		const arr = [...array];
		for (let i = arr.length - 1; i > 0; i--) {
			const j = Math.floor(Math.random() * (i + 1));
			[arr[i], arr[j]] = [arr[j], arr[i]];
		}
		return arr;
	}

	function formatTime(seconds) {
		const m = Math.floor(seconds / 60);
		const s = seconds % 60;
		return `${m}:${s.toString().padStart(2, '0')}`;
	}

	function flipCard(index) {
		if (isChecking) return;
		if (flipped.includes(index)) return;
		if (matched.includes(index)) return;
		if (flipped.length >= 2) return;

		flipped = [...flipped, index];

		if (flipped.length === 2) {
			moves++;
			isChecking = true;

			const [first, second] = flipped;
			if (cards[first].emoji === cards[second].emoji) {
				// Match!
				setTimeout(() => {
					matched = [...matched, first, second];
					flipped = [];
					isChecking = false;

					if (matched.length === cards.length) {
						gameStatus = 'won';
						if (timer) clearInterval(timer);
					}
				}, 500);
			} else {
				// No match
				setTimeout(() => {
					flipped = [];
					isChecking = false;
				}, 1000);
			}
		}
	}

	function getStars() {
		// Rating based on moves (for 8 pairs = 16 cards)
		if (moves <= 12) return '⭐⭐⭐';
		if (moves <= 18) return '⭐⭐';
		return '⭐';
	}

	onMount(() => {
		startNewGame();
		return () => {
			if (timer) clearInterval(timer);
		};
	});
</script>

<svelte:head>
	<title>Memory Match · The Fun Website</title>
	<meta name="theme-color" content="#ec4899" />
</svelte:head>

<section class="panel">
	<header>
		<a href="/puzzles" class="back">← Puzzles</a>
		<h1>🃏 Memory Match</h1>
		<p>Find all the matching pairs!</p>
	</header>

	<div class="stats">
		<div class="stat">
			<span class="label">Time</span>
			<span class="value">{formatTime(elapsed)}</span>
		</div>
		<div class="stat">
			<span class="label">Moves</span>
			<span class="value">{moves}</span>
		</div>
		<div class="stat">
			<span class="label">Pairs</span>
			<span class="value">{matched.length / 2} / 8</span>
		</div>
	</div>

	{#if gameStatus === 'won'}
		<div class="win-banner">
			<div class="stars">{getStars()}</div>
			<div>Completed in {formatTime(elapsed)} with {moves} moves!</div>
		</div>
	{/if}

	<div class="grid">
		{#each cards as card, index}
			<button
				class="card"
				class:flipped={flipped.includes(index) || matched.includes(index)}
				class:matched={matched.includes(index)}
				onclick={() => flipCard(index)}
				disabled={matched.includes(index)}
			>
				<div class="card-inner">
					<div class="card-front">?</div>
					<div class="card-back">{card.emoji}</div>
				</div>
			</button>
		{/each}
	</div>

	<button class="new-game" onclick={startNewGame}>
		{gameStatus === 'won' ? 'Play Again' : 'Restart'}
	</button>
</section>

<style>
	.panel {
		width: min(480px, 100%);
		background-color: rgba(255, 255, 255, 0.95);
		border: 4px solid #ec4899;
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
		color: #ec4899;
		text-decoration: none;
		font-weight: 600;
	}

	.back:hover {
		text-decoration: underline;
	}

	h1 {
		margin: 0 0 4px;
		font-size: clamp(1.5rem, 5vw, 2rem);
		font-weight: 800;
		color: #2c3e50;
	}

	p {
		margin: 0;
		color: #5a6c7d;
	}

	.stats {
		display: flex;
		justify-content: center;
		gap: 24px;
		margin-bottom: 20px;
	}

	.stat {
		display: flex;
		flex-direction: column;
	}

	.stat .label {
		font-size: 0.75rem;
		color: #94a3b8;
		text-transform: uppercase;
		letter-spacing: 1px;
	}

	.stat .value {
		font-size: 1.3rem;
		font-weight: 700;
		color: #334155;
	}

	.win-banner {
		padding: 16px 20px;
		margin-bottom: 20px;
		background: linear-gradient(135deg, #ec4899, #db2777);
		border-radius: 16px;
		color: white;
		font-weight: 600;
	}

	.stars {
		font-size: 1.5rem;
		margin-bottom: 8px;
	}

	.grid {
		display: grid;
		grid-template-columns: repeat(4, 1fr);
		gap: 10px;
		margin-bottom: 24px;
		perspective: 1000px;
	}

	.card {
		aspect-ratio: 1;
		border: none;
		background: transparent;
		cursor: pointer;
		perspective: 1000px;
	}

	.card:disabled {
		cursor: default;
	}

	.card-inner {
		position: relative;
		width: 100%;
		height: 100%;
		transform-style: preserve-3d;
		transition: transform 0.5s ease;
	}

	.card.flipped .card-inner {
		transform: rotateY(180deg);
	}

	.card-front, .card-back {
		position: absolute;
		width: 100%;
		height: 100%;
		border-radius: 12px;
		display: flex;
		align-items: center;
		justify-content: center;
		backface-visibility: hidden;
		font-size: 2rem;
	}

	.card-front {
		background: linear-gradient(135deg, #f472b6, #ec4899);
		color: white;
		font-weight: 800;
		box-shadow: 0 4px 12px rgba(236, 72, 153, 0.3);
	}

	.card:hover:not(.flipped):not(:disabled) .card-front {
		background: linear-gradient(135deg, #f9a8d4, #f472b6);
		transform: scale(1.02);
	}

	.card-back {
		background: white;
		border: 3px solid #fce7f3;
		transform: rotateY(180deg);
	}

	.card.matched .card-back {
		background: #fce7f3;
		border-color: #ec4899;
		animation: matchPop 0.3s ease;
	}

	@keyframes matchPop {
		50% { transform: rotateY(180deg) scale(1.1); }
	}

	.new-game {
		padding: 14px 32px;
		border: 3px solid #ec4899;
		border-radius: 16px;
		background: #ec4899;
		color: white;
		font-size: 1.1rem;
		font-weight: 700;
		cursor: pointer;
		transition: all 0.2s ease;
	}

	.new-game:hover {
		background: #db2777;
		transform: translateY(-2px);
	}
</style>
