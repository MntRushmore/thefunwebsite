<script>
	import { onMount } from 'svelte';

	// Generate puzzles with solvable targets
	const PUZZLES = [
		{ numbers: [2, 3, 5, 7, 11, 13], target: 100 },
		{ numbers: [1, 4, 6, 8, 12, 25], target: 150 },
		{ numbers: [3, 6, 9, 12, 15, 20], target: 200 },
		{ numbers: [2, 5, 10, 15, 25, 50], target: 175 },
		{ numbers: [4, 7, 8, 11, 13, 19], target: 125 },
		{ numbers: [1, 2, 3, 4, 5, 100], target: 234 },
		{ numbers: [6, 7, 8, 9, 10, 25], target: 315 },
		{ numbers: [3, 5, 7, 11, 13, 17], target: 89 }
	];

	let puzzle = $state(null);
	let availableNumbers = $state([]);
	let expression = $state([]);
	let result = $state(null);
	let gameStatus = $state('playing');
	let bestScore = $state(null);
	let history = $state([]);

	const OPERATIONS = ['+', '-', '×', '÷'];

	function startNewGame() {
		puzzle = PUZZLES[Math.floor(Math.random() * PUZZLES.length)];
		availableNumbers = puzzle.numbers.map((n, i) => ({ id: i, value: n, used: false }));
		expression = [];
		result = null;
		gameStatus = 'playing';
		bestScore = null;
		history = [];
	}

	function selectNumber(num) {
		if (num.used || gameStatus !== 'playing') return;

		// Can only add number if expression is empty or last item is an operator
		if (expression.length === 0 || OPERATIONS.includes(expression[expression.length - 1])) {
			expression = [...expression, num.value];
			availableNumbers = availableNumbers.map(n =>
				n.id === num.id ? { ...n, used: true } : n
			);
			evaluateExpression();
		}
	}

	function selectOperation(op) {
		if (gameStatus !== 'playing') return;

		// Can only add operator if last item is a number
		if (expression.length > 0 && !OPERATIONS.includes(expression[expression.length - 1])) {
			expression = [...expression, op];
		}
	}

	function evaluateExpression() {
		if (expression.length === 0) {
			result = null;
			return;
		}

		// Check if expression ends with a number
		if (OPERATIONS.includes(expression[expression.length - 1])) {
			result = null;
			return;
		}

		try {
			// Convert to JavaScript expression
			const jsExpr = expression
				.map(item => item === '×' ? '*' : item === '÷' ? '/' : item)
				.join(' ');

			const evalResult = eval(jsExpr);

			// Check if result is valid (integer and positive)
			if (Number.isFinite(evalResult) && evalResult > 0) {
				result = Math.round(evalResult * 1000) / 1000; // Round to avoid floating point issues

				// Track best score
				const diff = Math.abs(result - puzzle.target);
				if (bestScore === null || diff < bestScore) {
					bestScore = diff;
				}

				// Check for exact match
				if (result === puzzle.target) {
					gameStatus = 'won';
				}
			} else {
				result = null;
			}
		} catch {
			result = null;
		}
	}

	function undo() {
		if (expression.length === 0) return;

		const lastItem = expression[expression.length - 1];
		expression = expression.slice(0, -1);

		// If we removed a number, make it available again
		if (!OPERATIONS.includes(lastItem)) {
			const numToRestore = availableNumbers.find(n => n.value === lastItem && n.used);
			if (numToRestore) {
				availableNumbers = availableNumbers.map(n =>
					n.id === numToRestore.id ? { ...n, used: false } : n
				);
			}
		}

		evaluateExpression();
	}

	function clear() {
		history = [...history, { expr: [...expression], result }];
		expression = [];
		result = null;
		availableNumbers = availableNumbers.map(n => ({ ...n, used: false }));
	}

	function submit() {
		if (result !== null && result === puzzle.target) {
			gameStatus = 'won';
		}
	}

	function getScoreMessage() {
		if (bestScore === null) return '';
		if (bestScore === 0) return 'Perfect! 🎯';
		if (bestScore <= 5) return 'So close! 🔥';
		if (bestScore <= 10) return 'Getting there! 💪';
		return 'Keep trying! 🧮';
	}

	onMount(() => {
		startNewGame();
	});
</script>

<svelte:head>
	<title>Digits · The Fun Website</title>
	<meta name="theme-color" content="#14b8a6" />
</svelte:head>

<section class="panel">
	<header>
		<a href="/puzzles" class="back">← Puzzles</a>
		<h1>🔢 Digits</h1>
		<p>Use math to reach the target number!</p>
	</header>

	<div class="target">
		<span class="label">Target</span>
		<span class="number">{puzzle?.target}</span>
	</div>

	{#if gameStatus === 'won'}
		<div class="win-banner">
			🎉 You got it! Target: {puzzle.target}
		</div>
	{:else if bestScore !== null}
		<div class="score-message">{getScoreMessage()}</div>
	{/if}

	<div class="workspace">
		<div class="expression">
			{#if expression.length === 0}
				<span class="placeholder">Pick a number...</span>
			{:else}
				{#each expression as item}
					<span class:operator={OPERATIONS.includes(item)}>{item}</span>
				{/each}
			{/if}
		</div>

		{#if result !== null}
			<div class="result" class:exact={result === puzzle?.target}>
				= {result}
				{#if result !== puzzle?.target}
					<span class="diff">({result < puzzle.target ? '+' : ''}{puzzle.target - result} to go)</span>
				{/if}
			</div>
		{/if}
	</div>

	<div class="numbers">
		{#each availableNumbers as num}
			<button
				class="num-btn"
				class:used={num.used}
				onclick={() => selectNumber(num)}
				disabled={num.used || gameStatus !== 'playing'}
			>
				{num.value}
			</button>
		{/each}
	</div>

	<div class="operations">
		{#each OPERATIONS as op}
			<button
				class="op-btn"
				onclick={() => selectOperation(op)}
				disabled={gameStatus !== 'playing'}
			>
				{op}
			</button>
		{/each}
	</div>

	<div class="actions">
		<button class="action-btn" onclick={undo} disabled={expression.length === 0 || gameStatus !== 'playing'}>
			Undo
		</button>
		<button class="action-btn" onclick={clear} disabled={expression.length === 0 || gameStatus !== 'playing'}>
			Clear
		</button>
	</div>

	{#if history.length > 0}
		<div class="history">
			<h4>Previous attempts:</h4>
			{#each history.slice(-3) as attempt}
				<div class="attempt">
					{attempt.expr.join(' ')} = {attempt.result}
				</div>
			{/each}
		</div>
	{/if}

	<button class="new-game" onclick={startNewGame}>
		{gameStatus === 'won' ? 'Play Again' : 'New Puzzle'}
	</button>
</section>

<style>
	.panel {
		width: min(440px, 100%);
		background-color: rgba(255, 255, 255, 0.95);
		border: 4px solid #14b8a6;
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
		color: #14b8a6;
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

	.target {
		display: flex;
		flex-direction: column;
		align-items: center;
		padding: 16px;
		margin-bottom: 16px;
		background: linear-gradient(135deg, #14b8a6, #0d9488);
		border-radius: 16px;
		color: white;
	}

	.target .label {
		font-size: 0.8rem;
		text-transform: uppercase;
		letter-spacing: 2px;
		opacity: 0.9;
	}

	.target .number {
		font-size: 2.5rem;
		font-weight: 800;
	}

	.win-banner {
		padding: 12px 20px;
		margin-bottom: 16px;
		background: #d1fae5;
		border-radius: 12px;
		color: #065f46;
		font-weight: 700;
	}

	.score-message {
		margin-bottom: 12px;
		font-weight: 600;
		color: #0f766e;
	}

	.workspace {
		background: #f0fdfa;
		border-radius: 12px;
		padding: 16px;
		margin-bottom: 20px;
		min-height: 80px;
	}

	.expression {
		font-size: 1.4rem;
		font-weight: 600;
		margin-bottom: 8px;
		display: flex;
		justify-content: center;
		flex-wrap: wrap;
		gap: 8px;
	}

	.expression .placeholder {
		color: #94a3b8;
		font-weight: 400;
	}

	.expression .operator {
		color: #14b8a6;
	}

	.result {
		font-size: 1.2rem;
		color: #64748b;
	}

	.result.exact {
		color: #059669;
		font-weight: 700;
	}

	.diff {
		font-size: 0.9rem;
		margin-left: 8px;
	}

	.numbers {
		display: flex;
		justify-content: center;
		gap: 10px;
		flex-wrap: wrap;
		margin-bottom: 16px;
	}

	.num-btn {
		width: 56px;
		height: 56px;
		border: 3px solid #14b8a6;
		border-radius: 12px;
		background: white;
		font-size: 1.3rem;
		font-weight: 700;
		cursor: pointer;
		transition: all 0.15s ease;
	}

	.num-btn:hover:not(:disabled) {
		background: #f0fdfa;
		transform: scale(1.05);
	}

	.num-btn.used {
		opacity: 0.3;
		cursor: not-allowed;
	}

	.operations {
		display: flex;
		justify-content: center;
		gap: 12px;
		margin-bottom: 16px;
	}

	.op-btn {
		width: 52px;
		height: 52px;
		border: none;
		border-radius: 50%;
		background: #14b8a6;
		color: white;
		font-size: 1.5rem;
		font-weight: 700;
		cursor: pointer;
		transition: all 0.15s ease;
	}

	.op-btn:hover:not(:disabled) {
		background: #0d9488;
		transform: scale(1.1);
	}

	.op-btn:disabled {
		opacity: 0.5;
		cursor: not-allowed;
	}

	.actions {
		display: flex;
		justify-content: center;
		gap: 12px;
		margin-bottom: 20px;
	}

	.action-btn {
		padding: 10px 24px;
		border: 2px solid #333;
		border-radius: 20px;
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
		opacity: 0.4;
		cursor: not-allowed;
	}

	.history {
		background: #f8fafc;
		border-radius: 12px;
		padding: 12px;
		margin-bottom: 20px;
		text-align: left;
	}

	.history h4 {
		margin: 0 0 8px;
		font-size: 0.8rem;
		color: #64748b;
		text-transform: uppercase;
	}

	.attempt {
		font-size: 0.9rem;
		color: #475569;
		padding: 4px 0;
	}

	.new-game {
		padding: 14px 32px;
		border: 3px solid #14b8a6;
		border-radius: 16px;
		background: #14b8a6;
		color: white;
		font-size: 1.1rem;
		font-weight: 700;
		cursor: pointer;
		transition: all 0.2s ease;
	}

	.new-game:hover {
		background: #0d9488;
		transform: translateY(-2px);
	}
</style>
