<script>
	import { onMount } from 'svelte';

	// Word list for the game
	const WORDS = [
		'APPLE', 'BEACH', 'BRAIN', 'CHAIR', 'CLOUD', 'DANCE', 'DREAM', 'EARTH', 'FLAME', 'GHOST',
		'GRAPE', 'HAPPY', 'HEART', 'HOUSE', 'JELLY', 'JUICE', 'KNOCK', 'LAUGH', 'LEMON', 'LIGHT',
		'MAGIC', 'MOUSE', 'MUSIC', 'NIGHT', 'OCEAN', 'PAINT', 'PARTY', 'PEACE', 'PIANO', 'PIZZA',
		'PLANT', 'PRIZE', 'QUEEN', 'QUICK', 'RADIO', 'RIVER', 'ROBOT', 'ROUND', 'SHINE', 'SMILE',
		'SNAKE', 'SOLAR', 'SOUND', 'SPACE', 'SPARK', 'SPICE', 'STACK', 'STAMP', 'STAND', 'STONE',
		'STORM', 'STORY', 'SUGAR', 'SUNNY', 'SWEET', 'SWING', 'TABLE', 'TASTE', 'THINK', 'TIGER',
		'TOAST', 'TOWER', 'TRAIN', 'TREAT', 'TRICK', 'TRUCK', 'TRUTH', 'TULIP', 'ULTRA', 'UNITY',
		'VIDEO', 'VIVID', 'WATER', 'WHEEL', 'WORLD', 'YOUTH', 'ZEBRA', 'ZESTY', 'JOLLY', 'FUZZY'
	];

	// Valid words that can be guessed (includes more words)
	const VALID_WORDS = new Set([
		...WORDS,
		'ABOUT', 'ABOVE', 'ABUSE', 'ACTOR', 'ACUTE', 'ADMIT', 'ADOPT', 'ADULT', 'AFTER', 'AGAIN',
		'AGENT', 'AGREE', 'AHEAD', 'ALARM', 'ALBUM', 'ALERT', 'ALIEN', 'ALIGN', 'ALIKE', 'ALIVE',
		'ALLOW', 'ALONE', 'ALONG', 'ALTER', 'AMONG', 'ANGER', 'ANGLE', 'ANGRY', 'APART', 'ARGUE',
		'ARISE', 'ASIDE', 'ASSET', 'AVOID', 'AWARD', 'AWFUL', 'BASIC', 'BASIS', 'BEAST', 'BEGIN',
		'BEING', 'BELOW', 'BENCH', 'BLACK', 'BLADE', 'BLAME', 'BLANK', 'BLAST', 'BLEND', 'BLESS',
		'BLIND', 'BLOCK', 'BLOOD', 'BOARD', 'BOOST', 'BOUND', 'BRAVE', 'BREAD', 'BREAK', 'BREED',
		'BRICK', 'BRIEF', 'BRING', 'BROAD', 'BROKE', 'BROWN', 'BUILD', 'BUNCH', 'BURST', 'CANDY',
		'CARRY', 'CATCH', 'CAUSE', 'CHAIN', 'CHAOS', 'CHARM', 'CHART', 'CHASE', 'CHEAP', 'CHECK',
		'CHEST', 'CHIEF', 'CHILD', 'CHINA', 'CHOSE', 'CIVIL', 'CLAIM', 'CLASS', 'CLEAN', 'CLEAR',
		'CLIMB', 'CLOCK', 'CLOSE', 'CLOTH', 'COACH', 'COAST', 'COULD', 'COUNT', 'COURT', 'COVER',
		'CRACK', 'CRAFT', 'CRASH', 'CRAZY', 'CREAM', 'CRIME', 'CROSS', 'CROWD', 'CROWN', 'CRUEL'
	]);

	let targetWord = '';
	let guesses = $state([]);
	let currentGuess = $state('');
	let gameStatus = $state('playing'); // 'playing', 'won', 'lost'
	let shake = $state(false);
	let message = $state('');

	const MAX_GUESSES = 6;

	function startNewGame() {
		targetWord = WORDS[Math.floor(Math.random() * WORDS.length)];
		guesses = [];
		currentGuess = '';
		gameStatus = 'playing';
		message = '';
	}

	function getLetterStatus(letter, position, word) {
		if (targetWord[position] === letter) {
			return 'correct';
		} else if (targetWord.includes(letter)) {
			// Count how many times this letter appears in target
			const targetCount = targetWord.split('').filter(l => l === letter).length;
			// Count how many times this letter is correctly placed or already marked present before this position
			let usedCount = 0;
			for (let i = 0; i < 5; i++) {
				if (word[i] === letter) {
					if (targetWord[i] === letter) {
						usedCount++;
					} else if (i < position) {
						usedCount++;
					}
				}
			}
			return usedCount < targetCount ? 'present' : 'absent';
		}
		return 'absent';
	}

	function submitGuess() {
		if (currentGuess.length !== 5) {
			message = 'Word must be 5 letters';
			shake = true;
			setTimeout(() => shake = false, 500);
			return;
		}

		if (!VALID_WORDS.has(currentGuess.toUpperCase())) {
			message = 'Not in word list';
			shake = true;
			setTimeout(() => shake = false, 500);
			return;
		}

		const guess = currentGuess.toUpperCase();
		guesses = [...guesses, guess];
		currentGuess = '';
		message = '';

		if (guess === targetWord) {
			gameStatus = 'won';
			message = ['Genius!', 'Magnificent!', 'Impressive!', 'Splendid!', 'Great!', 'Phew!'][guesses.length - 1];
		} else if (guesses.length >= MAX_GUESSES) {
			gameStatus = 'lost';
			message = `The word was ${targetWord}`;
		}
	}

	function handleKeyPress(key) {
		if (gameStatus !== 'playing') return;

		if (key === 'ENTER') {
			submitGuess();
		} else if (key === 'BACKSPACE') {
			currentGuess = currentGuess.slice(0, -1);
		} else if (/^[A-Z]$/.test(key) && currentGuess.length < 5) {
			currentGuess += key;
		}
	}

	function getKeyStatus(key) {
		let status = 'unused';
		for (const guess of guesses) {
			for (let i = 0; i < 5; i++) {
				if (guess[i] === key) {
					const letterStatus = getLetterStatus(key, i, guess);
					if (letterStatus === 'correct') return 'correct';
					if (letterStatus === 'present' && status !== 'correct') status = 'present';
					if (letterStatus === 'absent' && status === 'unused') status = 'absent';
				}
			}
		}
		return status;
	}

	const KEYBOARD_ROWS = [
		['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
		['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'],
		['ENTER', 'Z', 'X', 'C', 'V', 'B', 'N', 'M', 'BACKSPACE']
	];

	onMount(() => {
		startNewGame();

		function onKeyDown(e) {
			if (e.ctrlKey || e.metaKey || e.altKey) return;
			const key = e.key.toUpperCase();
			if (key === 'ENTER' || key === 'BACKSPACE' || /^[A-Z]$/.test(key)) {
				handleKeyPress(key);
			}
		}

		window.addEventListener('keydown', onKeyDown);
		return () => window.removeEventListener('keydown', onKeyDown);
	});
</script>

<svelte:head>
	<title>Wordle · The Fun Website</title>
	<meta name="theme-color" content="#6aaa64" />
</svelte:head>

<section class="panel">
	<header>
		<a href="/puzzles" class="back">← Puzzles</a>
		<h1>🟩 Wordle</h1>
		<p>Guess the 5-letter word in 6 tries!</p>
	</header>

	{#if message}
		<div class="message" class:win={gameStatus === 'won'} class:lose={gameStatus === 'lost'}>
			{message}
		</div>
	{/if}

	<div class="board" class:shake>
		{#each Array(MAX_GUESSES) as _, rowIndex}
			<div class="row">
				{#each Array(5) as _, colIndex}
					{@const letter = rowIndex < guesses.length
						? guesses[rowIndex][colIndex]
						: rowIndex === guesses.length
							? currentGuess[colIndex] || ''
							: ''}
					{@const status = rowIndex < guesses.length
						? getLetterStatus(letter, colIndex, guesses[rowIndex])
						: ''}
					<div
						class="cell"
						class:filled={letter}
						class:correct={status === 'correct'}
						class:present={status === 'present'}
						class:absent={status === 'absent'}
						class:pop={rowIndex === guesses.length && letter}
					>
						{letter}
					</div>
				{/each}
			</div>
		{/each}
	</div>

	<div class="keyboard">
		{#each KEYBOARD_ROWS as row}
			<div class="keyboard-row">
				{#each row as key}
					{@const status = getKeyStatus(key)}
					<button
						class="key"
						class:wide={key === 'ENTER' || key === 'BACKSPACE'}
						class:correct={status === 'correct'}
						class:present={status === 'present'}
						class:absent={status === 'absent'}
						onclick={() => handleKeyPress(key)}
					>
						{key === 'BACKSPACE' ? '⌫' : key}
					</button>
				{/each}
			</div>
		{/each}
	</div>

	{#if gameStatus !== 'playing'}
		<button class="new-game" onclick={startNewGame}>
			Play Again
		</button>
	{/if}
</section>

<style>
	.panel {
		width: min(500px, 100%);
		background-color: rgba(255, 255, 255, 0.95);
		border: 4px solid #6aaa64;
		border-radius: 28px;
		padding: clamp(20px, 4vw, 36px);
		text-align: center;
		box-shadow: 0 18px 50px rgba(20, 50, 100, 0.25);
	}

	header {
		margin-bottom: 20px;
	}

	.back {
		display: inline-block;
		margin-bottom: 8px;
		color: #6aaa64;
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

	.message {
		padding: 10px 20px;
		margin-bottom: 16px;
		border-radius: 12px;
		font-weight: 700;
		background: #f0f0f0;
		color: #333;
	}

	.message.win {
		background: #6aaa64;
		color: white;
	}

	.message.lose {
		background: #787c7e;
		color: white;
	}

	.board {
		display: flex;
		flex-direction: column;
		gap: 6px;
		margin-bottom: 20px;
	}

	.board.shake {
		animation: shake 0.5s ease;
	}

	@keyframes shake {
		0%, 100% { transform: translateX(0); }
		20% { transform: translateX(-8px); }
		40% { transform: translateX(8px); }
		60% { transform: translateX(-8px); }
		80% { transform: translateX(8px); }
	}

	.row {
		display: flex;
		justify-content: center;
		gap: 6px;
	}

	.cell {
		width: clamp(48px, 12vw, 62px);
		height: clamp(48px, 12vw, 62px);
		border: 2px solid #d3d6da;
		border-radius: 8px;
		display: flex;
		align-items: center;
		justify-content: center;
		font-size: clamp(1.5rem, 5vw, 2rem);
		font-weight: 800;
		text-transform: uppercase;
		background: white;
		transition: all 0.2s ease;
	}

	.cell.filled {
		border-color: #878a8c;
	}

	.cell.pop {
		animation: pop 0.1s ease;
	}

	@keyframes pop {
		50% { transform: scale(1.1); }
	}

	.cell.correct {
		background: #6aaa64;
		border-color: #6aaa64;
		color: white;
		animation: flip 0.5s ease;
	}

	.cell.present {
		background: #c9b458;
		border-color: #c9b458;
		color: white;
		animation: flip 0.5s ease;
	}

	.cell.absent {
		background: #787c7e;
		border-color: #787c7e;
		color: white;
		animation: flip 0.5s ease;
	}

	@keyframes flip {
		0% { transform: rotateX(0); }
		50% { transform: rotateX(90deg); }
		100% { transform: rotateX(0); }
	}

	.keyboard {
		display: flex;
		flex-direction: column;
		gap: 6px;
	}

	.keyboard-row {
		display: flex;
		justify-content: center;
		gap: 4px;
	}

	.key {
		min-width: clamp(28px, 7vw, 43px);
		height: clamp(48px, 10vw, 58px);
		border: none;
		border-radius: 6px;
		background: #d3d6da;
		font-size: clamp(0.75rem, 2.5vw, 1rem);
		font-weight: 700;
		cursor: pointer;
		transition: all 0.15s ease;
	}

	.key:hover {
		transform: scale(1.05);
	}

	.key:active {
		transform: scale(0.95);
	}

	.key.wide {
		min-width: clamp(52px, 12vw, 65px);
		font-size: clamp(0.65rem, 2vw, 0.8rem);
	}

	.key.correct {
		background: #6aaa64;
		color: white;
	}

	.key.present {
		background: #c9b458;
		color: white;
	}

	.key.absent {
		background: #787c7e;
		color: white;
	}

	.new-game {
		margin-top: 20px;
		padding: 14px 32px;
		border: 3px solid #6aaa64;
		border-radius: 16px;
		background: #6aaa64;
		color: white;
		font-size: 1.1rem;
		font-weight: 700;
		cursor: pointer;
		transition: all 0.2s ease;
	}

	.new-game:hover {
		background: #5a9a54;
		transform: translateY(-2px);
	}
</style>
