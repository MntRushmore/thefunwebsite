<script>
	import { onMount } from 'svelte';

	// Puzzle configurations: center letter + outer letters + valid words
	const PUZZLES = [
		{
			center: 'A',
			outer: ['P', 'L', 'N', 'T', 'E', 'R'],
			words: ['PLAN', 'PLANT', 'PLATE', 'PLANE', 'PLANET', 'PLANNER', 'PLANT', 'PALE', 'TALE', 'TAPE', 'LATE', 'LANE', 'LEAN', 'LEAP', 'REAP', 'PEAL', 'REAL', 'ALERT', 'ALTER', 'LATER', 'RENTAL', 'PARENT', 'PATTERN', 'PLATTER', 'PEAR', 'NEAR', 'EARN', 'LEARN', 'LEARNT', 'APART', 'PANEL', 'ANTE', 'RATE', 'ARENA', 'ATERAL', 'NATAL', 'RATTAN', 'RANT', 'RANT', 'ALTAR', 'RENTAL', 'TARTAN']
		},
		{
			center: 'O',
			outer: ['C', 'K', 'I', 'N', 'G', 'R'],
			words: ['COOK', 'COOKING', 'ROCK', 'ROCKING', 'KING', 'RING', 'CORK', 'COIN', 'ICON', 'NICK', 'RICK', 'KICK', 'KICKING', 'KNOCK', 'KNOCKING', 'CROOK', 'NOOK', 'GONG', 'GOING', 'ORING', 'ROCKING', 'COKING', 'CORKING', 'CROCKING', 'CONK', 'CONKING', 'GINKO', 'OINK', 'IONIC', 'IRONIC', 'GROG', 'GROK']
		},
		{
			center: 'E',
			outer: ['S', 'T', 'A', 'R', 'M', 'D'],
			words: ['STEAM', 'STREAM', 'DREAM', 'TEAM', 'SEAM', 'MEAT', 'SEAT', 'EAST', 'FEAST', 'BEAST', 'LEAST', 'MAST', 'MASTER', 'ASTER', 'ASTER', 'STEM', 'TERM', 'TERMS', 'TRADE', 'TRADED', 'DEAR', 'DEAR', 'READ', 'READS', 'READER', 'DREAD', 'TREAD', 'STEAD', 'STEAD', 'STEAD', 'STEAMED', 'STREAMED', 'SMEAR', 'EARED', 'EARED', 'EARED', 'STEAD', 'STEAD', 'DATE', 'DATED', 'RATE', 'RATED', 'MATE', 'MATED', 'STEAD', 'STEAD', 'STEAD', 'DARE', 'DARES', 'STARE', 'STARED', 'MARE', 'MARES', 'MADE', 'TRADE', 'TREAD', 'DETER', 'AMETER', 'AMETER', 'AMETER', 'SEMESTER']
		}
	];

	let puzzle = $state(null);
	let letters = $state([]);
	let currentWord = $state('');
	let foundWords = $state([]);
	let score = $state(0);
	let message = $state('');
	let messageType = $state('');

	function startNewGame() {
		puzzle = PUZZLES[Math.floor(Math.random() * PUZZLES.length)];
		letters = shuffle([...puzzle.outer]);
		currentWord = '';
		foundWords = [];
		score = 0;
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

	function shuffleLetters() {
		letters = shuffle([...letters]);
	}

	function addLetter(letter) {
		currentWord += letter;
	}

	function deleteLetter() {
		currentWord = currentWord.slice(0, -1);
	}

	function submitWord() {
		const word = currentWord.toUpperCase();

		if (word.length < 4) {
			showMessage('Too short', 'error');
			currentWord = '';
			return;
		}

		if (!word.includes(puzzle.center)) {
			showMessage('Missing center letter', 'error');
			currentWord = '';
			return;
		}

		const validLetters = new Set([puzzle.center, ...puzzle.outer]);
		if (!word.split('').every(l => validLetters.has(l))) {
			showMessage('Invalid letters', 'error');
			currentWord = '';
			return;
		}

		if (foundWords.includes(word)) {
			showMessage('Already found', 'error');
			currentWord = '';
			return;
		}

		if (puzzle.words.map(w => w.toUpperCase()).includes(word)) {
			const isPangram = new Set(word).size === 7;
			const points = word.length === 4 ? 1 : word.length + (isPangram ? 7 : 0);
			score += points;
			foundWords = [...foundWords, word].sort();

			if (isPangram) {
				showMessage('Pangram! +' + points, 'pangram');
			} else {
				showMessage('+' + points, 'success');
			}
		} else {
			showMessage('Not in word list', 'error');
		}

		currentWord = '';
	}

	function showMessage(text, type) {
		message = text;
		messageType = type;
		setTimeout(() => {
			message = '';
			messageType = '';
		}, 1500);
	}

	function getRank() {
		const maxScore = puzzle?.words.reduce((sum, w) => {
			const isPangram = new Set(w.toUpperCase()).size === 7;
			return sum + (w.length === 4 ? 1 : w.length + (isPangram ? 7 : 0));
		}, 0) || 100;

		const percent = (score / maxScore) * 100;

		if (percent >= 70) return 'Genius';
		if (percent >= 50) return 'Amazing';
		if (percent >= 40) return 'Great';
		if (percent >= 25) return 'Nice';
		if (percent >= 15) return 'Solid';
		if (percent >= 8) return 'Good';
		if (percent >= 2) return 'Beginner';
		return 'Starting';
	}

	function handleKeyPress(e) {
		if (e.ctrlKey || e.metaKey || e.altKey) return;

		const key = e.key.toUpperCase();
		const validLetters = puzzle ? [puzzle.center, ...puzzle.outer] : [];

		if (key === 'ENTER') {
			submitWord();
		} else if (key === 'BACKSPACE') {
			deleteLetter();
		} else if (validLetters.includes(key)) {
			addLetter(key);
		}
	}

	onMount(() => {
		startNewGame();
		window.addEventListener('keydown', handleKeyPress);
		return () => window.removeEventListener('keydown', handleKeyPress);
	});
</script>

<svelte:head>
	<title>Spelling Bee · The Fun Website</title>
	<meta name="theme-color" content="#f59e0b" />
</svelte:head>

<section class="panel">
	<header>
		<a href="/puzzles" class="back">← Puzzles</a>
		<h1>🐝 Spelling Bee</h1>
		<p>Make words using the letters. Must use the center letter!</p>
	</header>

	<div class="score-bar">
		<span class="rank">{getRank()}</span>
		<span class="score">{score} points</span>
	</div>

	{#if message}
		<div class="message {messageType}">
			{message}
		</div>
	{/if}

	<div class="input-display">
		{#each currentWord as letter}
			<span class:center={letter === puzzle?.center}>{letter}</span>
		{/each}
		<span class="cursor">|</span>
	</div>

	{#if puzzle}
		<div class="honeycomb">
			<!-- Top row -->
			<div class="hex-row">
				<button class="hex" onclick={() => addLetter(letters[0])}>{letters[0]}</button>
				<button class="hex" onclick={() => addLetter(letters[1])}>{letters[1]}</button>
			</div>
			<!-- Middle row with center -->
			<div class="hex-row">
				<button class="hex" onclick={() => addLetter(letters[2])}>{letters[2]}</button>
				<button class="hex center" onclick={() => addLetter(puzzle.center)}>{puzzle.center}</button>
				<button class="hex" onclick={() => addLetter(letters[3])}>{letters[3]}</button>
			</div>
			<!-- Bottom row -->
			<div class="hex-row">
				<button class="hex" onclick={() => addLetter(letters[4])}>{letters[4]}</button>
				<button class="hex" onclick={() => addLetter(letters[5])}>{letters[5]}</button>
			</div>
		</div>
	{/if}

	<div class="actions">
		<button class="action-btn" onclick={deleteLetter}>Delete</button>
		<button class="action-btn shuffle" onclick={shuffleLetters}>⟳</button>
		<button class="action-btn submit" onclick={submitWord}>Enter</button>
	</div>

	<div class="found-words">
		<h3>Found Words ({foundWords.length})</h3>
		<div class="word-list">
			{#each foundWords as word}
				<span class="word-tag">{word}</span>
			{/each}
			{#if foundWords.length === 0}
				<span class="empty">No words yet...</span>
			{/if}
		</div>
	</div>

	<button class="new-game" onclick={startNewGame}>
		New Puzzle
	</button>
</section>

<style>
	.panel {
		width: min(440px, 100%);
		background-color: rgba(255, 255, 255, 0.95);
		border: 4px solid #f59e0b;
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
		color: #f59e0b;
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
		font-size: 0.95rem;
	}

	.score-bar {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 12px 16px;
		margin-bottom: 16px;
		background: #fef3c7;
		border-radius: 12px;
	}

	.rank {
		font-weight: 700;
		color: #92400e;
	}

	.score {
		color: #78350f;
	}

	.message {
		padding: 8px 16px;
		margin-bottom: 12px;
		border-radius: 8px;
		font-weight: 600;
		animation: fadeIn 0.2s ease;
	}

	.message.success {
		background: #d1fae5;
		color: #065f46;
	}

	.message.error {
		background: #fee2e2;
		color: #991b1b;
	}

	.message.pangram {
		background: linear-gradient(135deg, #fef3c7, #fde68a);
		color: #92400e;
		font-size: 1.1rem;
	}

	@keyframes fadeIn {
		from { opacity: 0; transform: translateY(-10px); }
		to { opacity: 1; transform: translateY(0); }
	}

	.input-display {
		min-height: 48px;
		margin-bottom: 20px;
		font-size: 1.8rem;
		font-weight: 700;
		text-transform: uppercase;
		letter-spacing: 2px;
	}

	.input-display .center {
		color: #f59e0b;
	}

	.cursor {
		animation: blink 1s infinite;
		color: #aaa;
	}

	@keyframes blink {
		50% { opacity: 0; }
	}

	.honeycomb {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 6px;
		margin-bottom: 24px;
	}

	.hex-row {
		display: flex;
		gap: 6px;
	}

	.hex {
		width: 70px;
		height: 70px;
		border: none;
		background: #e5e5e5;
		font-size: 1.5rem;
		font-weight: 800;
		cursor: pointer;
		clip-path: polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%);
		transition: all 0.15s ease;
	}

	.hex:hover {
		background: #d5d5d5;
		transform: scale(1.05);
	}

	.hex:active {
		transform: scale(0.95);
	}

	.hex.center {
		background: #f59e0b;
		color: white;
	}

	.hex.center:hover {
		background: #d97706;
	}

	.actions {
		display: flex;
		justify-content: center;
		gap: 12px;
		margin-bottom: 24px;
	}

	.action-btn {
		padding: 12px 24px;
		border: 2px solid #333;
		border-radius: 24px;
		background: white;
		font-size: 1rem;
		font-weight: 600;
		cursor: pointer;
		transition: all 0.15s ease;
	}

	.action-btn:hover {
		background: #f5f5f5;
	}

	.action-btn.shuffle {
		font-size: 1.3rem;
		padding: 12px 16px;
	}

	.action-btn.submit {
		background: #333;
		color: white;
	}

	.action-btn.submit:hover {
		background: #444;
	}

	.found-words {
		background: #f9fafb;
		border-radius: 12px;
		padding: 16px;
		margin-bottom: 20px;
	}

	.found-words h3 {
		margin: 0 0 12px;
		font-size: 0.9rem;
		color: #6b7280;
	}

	.word-list {
		display: flex;
		flex-wrap: wrap;
		gap: 8px;
		justify-content: center;
	}

	.word-tag {
		padding: 4px 12px;
		background: white;
		border: 1px solid #e5e7eb;
		border-radius: 16px;
		font-size: 0.85rem;
		font-weight: 500;
	}

	.empty {
		color: #9ca3af;
		font-style: italic;
	}

	.new-game {
		padding: 14px 32px;
		border: 3px solid #f59e0b;
		border-radius: 16px;
		background: #f59e0b;
		color: white;
		font-size: 1.1rem;
		font-weight: 700;
		cursor: pointer;
		transition: all 0.2s ease;
	}

	.new-game:hover {
		background: #d97706;
		transform: translateY(-2px);
	}
</style>
