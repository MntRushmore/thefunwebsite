<script>
	import { onMount } from 'svelte';

	const PUZZLES = [
		{
			grid: [
				['S', 'T', 'A', 'R', 'S'],
				['H', 'E', 'R', 'O', '#'],
				['A', 'R', 'E', 'A', '#'],
				['R', 'E', 'D', '#', '#'],
				['E', 'S', '#', '#', '#']
			],
			clues: {
				across: [
					{ num: 1, clue: 'Celestial bodies', row: 0, col: 0, length: 5 },
					{ num: 6, clue: 'Superman, for one', row: 1, col: 0, length: 4 },
					{ num: 7, clue: 'Square footage', row: 2, col: 0, length: 4 },
					{ num: 8, clue: 'Color of a stop sign', row: 3, col: 0, length: 3 },
					{ num: 9, clue: 'Affirmatives', row: 4, col: 0, length: 2 }
				],
				down: [
					{ num: 1, clue: 'Divide equally', row: 0, col: 0, length: 5 },
					{ num: 2, clue: 'Foot digits', row: 0, col: 1, length: 4 },
					{ num: 3, clue: 'Constellation with Betelgeuse', row: 0, col: 2, length: 4 },
					{ num: 4, clue: 'Street', row: 0, col: 3, length: 3 },
					{ num: 5, clue: 'Ginger ___', row: 0, col: 4, length: 1 }
				]
			}
		},
		{
			grid: [
				['P', 'L', 'A', 'N', 'E'],
				['A', 'U', 'R', 'A', '#'],
				['R', 'N', 'A', '#', '#'],
				['K', 'A', '#', '#', '#'],
				['S', '#', '#', '#', '#']
			],
			clues: {
				across: [
					{ num: 1, clue: 'Boeing product', row: 0, col: 0, length: 5 },
					{ num: 6, clue: 'Vibe or energy', row: 1, col: 0, length: 4 },
					{ num: 7, clue: 'Genetic material', row: 2, col: 0, length: 3 },
					{ num: 8, clue: 'Opposite of UN', row: 3, col: 0, length: 2 },
					{ num: 9, clue: 'Plural of S', row: 4, col: 0, length: 1 }
				],
				down: [
					{ num: 1, clue: 'Green spaces', row: 0, col: 0, length: 5 },
					{ num: 2, clue: 'Moon goddess', row: 0, col: 1, length: 4 },
					{ num: 3, clue: 'Bra size', row: 0, col: 2, length: 3 },
					{ num: 4, clue: 'Not available: Abbr.', row: 0, col: 3, length: 2 },
					{ num: 5, clue: 'Letter after D', row: 0, col: 4, length: 1 }
				]
			}
		},
		{
			grid: [
				['B', 'R', 'A', 'I', 'N'],
				['L', 'I', 'M', 'E', '#'],
				['U', 'C', 'E', '#', '#'],
				['E', 'E', '#', '#', '#'],
				['S', '#', '#', '#', '#']
			],
			clues: {
				across: [
					{ num: 1, clue: 'Think tank?', row: 0, col: 0, length: 5 },
					{ num: 6, clue: 'Citrus fruit', row: 1, col: 0, length: 4 },
					{ num: 7, clue: 'Frozen water in Spanish', row: 2, col: 0, length: 3 },
					{ num: 8, clue: 'Online address ending', row: 3, col: 0, length: 2 },
					{ num: 9, clue: 'Snake sound', row: 4, col: 0, length: 1 }
				],
				down: [
					{ num: 1, clue: 'Sad feelings', row: 0, col: 0, length: 5 },
					{ num: 2, clue: 'Grain or frozen treat', row: 0, col: 1, length: 4 },
					{ num: 3, clue: 'Acronym for I Am', row: 0, col: 2, length: 3 },
					{ num: 4, clue: 'Internet Explorer abbr.', row: 0, col: 3, length: 2 },
					{ num: 5, clue: 'Letter between M and O', row: 0, col: 4, length: 1 }
				]
			}
		}
	];

	let puzzle = $state(null);
	let userGrid = $state([]);
	let selectedCell = $state(null);
	let direction = $state('across');
	let gameStatus = $state('playing');
	let startTime = $state(0);
	let elapsed = $state(0);
	let timer = null;

	function startNewGame() {
		puzzle = PUZZLES[Math.floor(Math.random() * PUZZLES.length)];
		userGrid = puzzle.grid.map(row =>
			row.map(cell => cell === '#' ? '#' : '')
		);
		selectedCell = { row: 0, col: 0 };
		direction = 'across';
		gameStatus = 'playing';
		startTime = Date.now();
		elapsed = 0;

		if (timer) clearInterval(timer);
		timer = setInterval(() => {
			elapsed = Math.floor((Date.now() - startTime) / 1000);
		}, 1000);
	}

	function formatTime(seconds) {
		const m = Math.floor(seconds / 60);
		const s = seconds % 60;
		return `${m}:${s.toString().padStart(2, '0')}`;
	}

	function selectCell(row, col) {
		if (puzzle.grid[row][col] === '#') return;

		if (selectedCell?.row === row && selectedCell?.col === col) {
			direction = direction === 'across' ? 'down' : 'across';
		} else {
			selectedCell = { row, col };
		}
	}

	function getCellNumber(row, col) {
		const allClues = [...puzzle.clues.across, ...puzzle.clues.down];
		const clue = allClues.find(c => c.row === row && c.col === col);
		return clue?.num;
	}

	function handleInput(key) {
		if (!selectedCell || gameStatus !== 'playing') return;

		const { row, col } = selectedCell;

		if (key === 'Backspace') {
			if (userGrid[row][col]) {
				userGrid[row][col] = '';
			} else {
				// Move back
				const prev = getPrevCell(row, col);
				if (prev) {
					selectedCell = prev;
					userGrid[prev.row][prev.col] = '';
				}
			}
		} else if (/^[A-Za-z]$/.test(key)) {
			userGrid[row][col] = key.toUpperCase();

			// Move to next cell
			const next = getNextCell(row, col);
			if (next) {
				selectedCell = next;
			}

			checkWin();
		}
	}

	function getNextCell(row, col) {
		if (direction === 'across') {
			for (let c = col + 1; c < 5; c++) {
				if (puzzle.grid[row][c] !== '#') return { row, col: c };
			}
		} else {
			for (let r = row + 1; r < 5; r++) {
				if (puzzle.grid[r][col] !== '#') return { row: r, col };
			}
		}
		return null;
	}

	function getPrevCell(row, col) {
		if (direction === 'across') {
			for (let c = col - 1; c >= 0; c--) {
				if (puzzle.grid[row][c] !== '#') return { row, col: c };
			}
		} else {
			for (let r = row - 1; r >= 0; r--) {
				if (puzzle.grid[r][col] !== '#') return { row: r, col };
			}
		}
		return null;
	}

	function isHighlighted(row, col) {
		if (!selectedCell) return false;

		if (direction === 'across') {
			return row === selectedCell.row && puzzle.grid[row][col] !== '#';
		} else {
			return col === selectedCell.col && puzzle.grid[row][col] !== '#';
		}
	}

	function checkWin() {
		for (let r = 0; r < 5; r++) {
			for (let c = 0; c < 5; c++) {
				if (puzzle.grid[r][c] !== '#' && userGrid[r][c] !== puzzle.grid[r][c]) {
					return;
				}
			}
		}
		gameStatus = 'won';
		if (timer) clearInterval(timer);
	}

	function getCurrentClue() {
		if (!selectedCell || !puzzle) return null;

		const clues = direction === 'across' ? puzzle.clues.across : puzzle.clues.down;

		// Find the clue that contains this cell
		return clues.find(clue => {
			if (direction === 'across') {
				return clue.row === selectedCell.row &&
					   selectedCell.col >= clue.col &&
					   selectedCell.col < clue.col + clue.length;
			} else {
				return clue.col === selectedCell.col &&
					   selectedCell.row >= clue.row &&
					   selectedCell.row < clue.row + clue.length;
			}
		});
	}

	onMount(() => {
		startNewGame();

		function onKeyDown(e) {
			if (e.ctrlKey || e.metaKey || e.altKey) return;
			if (e.key === 'ArrowRight') {
				e.preventDefault();
				if (selectedCell && selectedCell.col < 4) {
					const next = { row: selectedCell.row, col: selectedCell.col + 1 };
					if (puzzle.grid[next.row][next.col] !== '#') selectedCell = next;
				}
			} else if (e.key === 'ArrowLeft') {
				e.preventDefault();
				if (selectedCell && selectedCell.col > 0) {
					const prev = { row: selectedCell.row, col: selectedCell.col - 1 };
					if (puzzle.grid[prev.row][prev.col] !== '#') selectedCell = prev;
				}
			} else if (e.key === 'ArrowDown') {
				e.preventDefault();
				if (selectedCell && selectedCell.row < 4) {
					const next = { row: selectedCell.row + 1, col: selectedCell.col };
					if (puzzle.grid[next.row][next.col] !== '#') selectedCell = next;
				}
			} else if (e.key === 'ArrowUp') {
				e.preventDefault();
				if (selectedCell && selectedCell.row > 0) {
					const prev = { row: selectedCell.row - 1, col: selectedCell.col };
					if (puzzle.grid[prev.row][prev.col] !== '#') selectedCell = prev;
				}
			} else if (e.key === 'Tab') {
				e.preventDefault();
				direction = direction === 'across' ? 'down' : 'across';
			} else {
				handleInput(e.key);
			}
		}

		window.addEventListener('keydown', onKeyDown);
		return () => {
			window.removeEventListener('keydown', onKeyDown);
			if (timer) clearInterval(timer);
		};
	});
</script>

<svelte:head>
	<title>Mini Crossword · The Fun Website</title>
	<meta name="theme-color" content="#3b82f6" />
</svelte:head>

<section class="panel">
	<header>
		<a href="/puzzles" class="back">← Puzzles</a>
		<h1>✏️ Mini Crossword</h1>
		<div class="timer">{formatTime(elapsed)}</div>
	</header>

	{#if gameStatus === 'won'}
		<div class="win-banner">
			🎉 Completed in {formatTime(elapsed)}!
		</div>
	{/if}

	{#if puzzle}
		{@const currentClue = getCurrentClue()}
		{#if currentClue}
			<div class="current-clue">
				<span class="clue-num">{currentClue.num}{direction === 'across' ? 'A' : 'D'}</span>
				{currentClue.clue}
			</div>
		{/if}

		<div class="grid">
			{#each puzzle.grid as row, rowIndex}
				{#each row as cell, colIndex}
					{@const cellNum = getCellNumber(rowIndex, colIndex)}
					<button
						class="cell"
						class:black={cell === '#'}
						class:selected={selectedCell?.row === rowIndex && selectedCell?.col === colIndex}
						class:highlighted={isHighlighted(rowIndex, colIndex)}
						class:correct={gameStatus === 'won' && cell !== '#'}
						onclick={() => selectCell(rowIndex, colIndex)}
						disabled={cell === '#'}
					>
						{#if cellNum}
							<span class="cell-num">{cellNum}</span>
						{/if}
						{#if cell !== '#'}
							<span class="cell-letter">{userGrid[rowIndex][colIndex]}</span>
						{/if}
					</button>
				{/each}
			{/each}
		</div>

		<div class="clues">
			<div class="clue-section">
				<h3>Across</h3>
				{#each puzzle.clues.across as clue}
					<div class="clue" class:active={direction === 'across' && getCurrentClue()?.num === clue.num}>
						<span class="num">{clue.num}</span>
						{clue.clue}
					</div>
				{/each}
			</div>
			<div class="clue-section">
				<h3>Down</h3>
				{#each puzzle.clues.down as clue}
					<div class="clue" class:active={direction === 'down' && getCurrentClue()?.num === clue.num}>
						<span class="num">{clue.num}</span>
						{clue.clue}
					</div>
				{/each}
			</div>
		</div>
	{/if}

	<button class="new-game" onclick={startNewGame}>
		New Puzzle
	</button>
</section>

<style>
	.panel {
		width: min(480px, 100%);
		background-color: rgba(255, 255, 255, 0.95);
		border: 4px solid #3b82f6;
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
		color: #3b82f6;
		text-decoration: none;
		font-weight: 600;
	}

	.back:hover {
		text-decoration: underline;
	}

	h1 {
		margin: 0;
		font-size: clamp(1.5rem, 5vw, 2rem);
		font-weight: 800;
		color: #2c3e50;
	}

	.timer {
		font-size: 1.2rem;
		font-weight: 600;
		color: #64748b;
		margin-top: 8px;
	}

	.win-banner {
		padding: 12px 20px;
		margin-bottom: 16px;
		background: linear-gradient(135deg, #3b82f6, #2563eb);
		border-radius: 12px;
		color: white;
		font-weight: 700;
		font-size: 1.1rem;
	}

	.current-clue {
		padding: 12px 16px;
		margin-bottom: 16px;
		background: #eff6ff;
		border-radius: 10px;
		font-size: 0.95rem;
		text-align: left;
	}

	.clue-num {
		font-weight: 700;
		color: #3b82f6;
		margin-right: 8px;
	}

	.grid {
		display: grid;
		grid-template-columns: repeat(5, 1fr);
		gap: 2px;
		margin-bottom: 20px;
		background: #333;
		padding: 2px;
		border-radius: 8px;
	}

	.cell {
		position: relative;
		aspect-ratio: 1;
		border: none;
		background: white;
		font-size: 1.4rem;
		font-weight: 700;
		cursor: pointer;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.cell.black {
		background: #333;
		cursor: default;
	}

	.cell.highlighted {
		background: #dbeafe;
	}

	.cell.selected {
		background: #3b82f6;
	}

	.cell.selected .cell-letter {
		color: white;
	}

	.cell.correct {
		background: #bbf7d0;
	}

	.cell-num {
		position: absolute;
		top: 2px;
		left: 4px;
		font-size: 0.6rem;
		font-weight: 600;
		color: #64748b;
	}

	.cell.selected .cell-num {
		color: rgba(255,255,255,0.8);
	}

	.cell-letter {
		text-transform: uppercase;
	}

	.clues {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 16px;
		text-align: left;
		margin-bottom: 20px;
	}

	.clue-section h3 {
		margin: 0 0 8px;
		font-size: 0.9rem;
		color: #3b82f6;
		text-transform: uppercase;
		letter-spacing: 1px;
	}

	.clue {
		font-size: 0.85rem;
		padding: 4px 8px;
		border-radius: 4px;
		margin-bottom: 4px;
	}

	.clue.active {
		background: #eff6ff;
	}

	.clue .num {
		font-weight: 700;
		margin-right: 4px;
	}

	.new-game {
		padding: 14px 32px;
		border: 3px solid #3b82f6;
		border-radius: 16px;
		background: #3b82f6;
		color: white;
		font-size: 1.1rem;
		font-weight: 700;
		cursor: pointer;
		transition: all 0.2s ease;
	}

	.new-game:hover {
		background: #2563eb;
		transform: translateY(-2px);
	}
</style>
