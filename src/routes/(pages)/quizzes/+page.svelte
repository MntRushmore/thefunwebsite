<script>
	import { quizzes, scoreQuiz } from '$lib/quizzes.js';

	// Three stages: 'pick' a quiz, answer 'play', see 'result'.
	let stage = $state(/** @type {'pick' | 'play' | 'result'} */ ('pick'));

	let activeQuiz = $state(/** @type {import('$lib/quizzes.js').Quiz | null} */ (null));
	let current = $state(0); // index of the question on screen
	let picks = $state(/** @type {string[]} */ ([])); // chosen letter per question
	let selected = $state(/** @type {string | null} */ (null)); // highlighted answer before advancing
	let leaving = $state(false); // drives the slide-out animation between questions

	const progress = $derived(
		activeQuiz ? Math.round((picks.length / activeQuiz.questions.length) * 100) : 0
	);
	const outcome = $derived(
		stage === 'result' && activeQuiz ? scoreQuiz(activeQuiz, picks) : null
	);

	/** @param {import('$lib/quizzes.js').Quiz} quiz */
	function startQuiz(quiz) {
		activeQuiz = quiz;
		current = 0;
		picks = [];
		selected = null;
		leaving = false;
		stage = 'play';
	}

	/** @param {string} key */
	function choose(key) {
		if (selected || leaving) return; // ignore double taps mid-transition
		selected = key;

		// Brief pause so the player sees their pick light up, then slide on.
		setTimeout(() => {
			const quiz = activeQuiz;
			if (!quiz) return;
			const next = [...picks, key];
			picks = next;
			leaving = true;

			setTimeout(() => {
				if (next.length >= quiz.questions.length) {
					stage = 'result';
				} else {
					current += 1;
				}
				selected = null;
				leaving = false;
			}, 280);
		}, 220);
	}

	function backToPicker() {
		stage = 'pick';
		activeQuiz = null;
		picks = [];
		current = 0;
		selected = null;
	}

	function retake() {
		if (activeQuiz) startQuiz(activeQuiz);
	}

	const answerLetters = ['A', 'B', 'C', 'D', 'E', 'F'];
</script>

<svelte:head>
	<title>Quizzes · The Fun Website</title>
	<meta name="theme-color" content="#73ACE0" />
</svelte:head>

{#if stage === 'pick'}
	<section class="panel">
		<h1>Pick a Quiz!</h1>
		<p class="lede">Which one are you in the mood for? Tap a card to begin.</p>

		<div class="quiz-grid">
			{#each quizzes as quiz (quiz.id)}
				<button
					class="quiz-card"
					style="--accent: {quiz.accent}"
					onclick={() => startQuiz(quiz)}
				>
					<span class="quiz-emoji">{quiz.emoji}</span>
					<span class="quiz-name">{quiz.name}</span>
					<span class="quiz-tagline">{quiz.tagline}</span>
					<span class="quiz-go">Start →</span>
				</button>
			{/each}

			<div class="quiz-card quiz-card--soon" aria-hidden="true">
				<span class="quiz-emoji">✨</span>
				<span class="quiz-name">More coming soon</span>
				<span class="quiz-tagline">New quizzes are on the way!</span>
			</div>
		</div>
	</section>
{:else if stage === 'play' && activeQuiz}
	{@const question = activeQuiz.questions[current]}
	<section class="panel panel--play" style="--accent: {activeQuiz.accent}">
		<div class="play-head">
			<span class="play-title">{activeQuiz.emoji} {activeQuiz.name}</span>
			<span class="play-count">
				Question {current + 1} / {activeQuiz.questions.length}
			</span>
		</div>

		<div class="progress-track">
			<div class="progress-fill" style="width: {progress}%"></div>
		</div>

		{#key current}
			<div class="question-stage" class:leaving>
				<h2 class="prompt">{question.prompt}</h2>

				<div class="answers">
					{#each question.answers as answer, i}
						<button
							class="answer"
							class:chosen={selected === answer.key}
							class:dimmed={selected !== null && selected !== answer.key}
							onclick={() => choose(answer.key)}
						>
							<span class="answer-letter">{answerLetters[i]}</span>
							<span class="answer-text">{answer.text}</span>
						</button>
					{/each}
				</div>
			</div>
		{/key}

		<button class="text-link" onclick={backToPicker}>← Pick a different quiz</button>
	</section>
{:else if stage === 'result' && activeQuiz && outcome}
	<section class="panel panel--result" style="--accent: {activeQuiz.accent}">
		<p class="result-kicker">You are a…</p>
		<div class="result-emoji">{outcome.result.emoji}</div>
		<h1 class="result-title">{outcome.result.title}</h1>
		<p class="result-blurb">{outcome.result.blurb}</p>

		<div class="actions">
			<button class="btn-secondary" onclick={retake}>Take it again</button>
			<button class="btn-primary" onclick={backToPicker}>
				Try another quiz
				<svg viewBox="0 0 14 16" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
					<path
						d="M1 7C0.447715 7 4.82823e-08 7.44772 0 8C-4.82823e-08 8.55228 0.447715 9 1 9L1 8L1 7ZM13.7071 8.70711C14.0976 8.31658 14.0976 7.68342 13.7071 7.29289L7.34315 0.928933C6.95262 0.538408 6.31946 0.538408 5.92893 0.928933C5.53841 1.31946 5.53841 1.95262 5.92893 2.34315L11.5858 8L5.92893 13.6569C5.53841 14.0474 5.53841 14.6805 5.92893 15.0711C6.31946 15.4616 6.95262 15.4616 7.34315 15.0711L13.7071 8.70711ZM1 8L1 9L13 9L13 8L13 7L1 7L1 8Z"
						fill="currentColor"
					/>
				</svg>
			</button>
		</div>
	</section>
{/if}

<style>
	.panel {
		width: min(680px, 100%);
		background-color: rgba(255, 255, 255, 0.94);
		border: 4px solid var(--orange);
		border-radius: 28px;
		padding: clamp(28px, 5vw, 48px);
		text-align: center;
		box-shadow: 0 18px 50px rgba(20, 50, 100, 0.25);
		backdrop-filter: blur(2px);
	}

	h1 {
		margin: 0 0 12px;
		font-size: clamp(2rem, 6vw, 3rem);
		font-weight: 800;
		color: #2c3e50;
		letter-spacing: -0.5px;
	}

	.lede {
		margin: 0 0 28px;
		color: #34495e;
		line-height: 1.5;
	}

	/* ---------- Quiz picker ---------- */
	.quiz-grid {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
		gap: 18px;
	}

	.quiz-card {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 6px;
		padding: 28px 20px;
		border: 4px solid var(--accent, var(--orange));
		border-radius: 24px;
		background-color: var(--yellow);
		font-family: inherit;
		cursor: pointer;
		text-align: center;
		transition: transform 0.18s ease, box-shadow 0.18s ease;
	}

	.quiz-card:hover {
		transform: translateY(-6px) rotate(-1deg);
		box-shadow: 0 14px 28px rgba(20, 50, 100, 0.22);
	}

	.quiz-emoji {
		font-size: 3rem;
		line-height: 1;
	}

	.quiz-name {
		font-weight: 800;
		font-size: 1.15rem;
		color: #2c3e50;
	}

	.quiz-tagline {
		font-size: 0.85rem;
		color: #5a6b7e;
		line-height: 1.35;
	}

	.quiz-go {
		margin-top: 8px;
		font-weight: 800;
		color: var(--accent, var(--orange));
		filter: brightness(0.8);
	}

	.quiz-card--soon {
		background-color: rgba(255, 255, 255, 0.6);
		border-style: dashed;
		border-color: #b9c6d6;
		cursor: default;
		opacity: 0.85;
	}

	.quiz-card--soon:hover {
		transform: none;
		box-shadow: none;
	}

	/* ---------- Play / questions ---------- */
	.panel--play {
		text-align: left;
	}

	.play-head {
		display: flex;
		justify-content: space-between;
		align-items: baseline;
		gap: 12px;
		margin-bottom: 14px;
		flex-wrap: wrap;
	}

	.play-title {
		font-weight: 800;
		color: #2c3e50;
	}

	.play-count {
		font-size: 0.85rem;
		font-weight: 700;
		color: var(--accent, var(--orange));
		filter: brightness(0.8);
	}

	.progress-track {
		width: 100%;
		height: 12px;
		background-color: rgba(0, 0, 0, 0.08);
		border-radius: 100px;
		overflow: hidden;
		margin-bottom: 28px;
	}

	.progress-fill {
		height: 100%;
		background-color: var(--accent, var(--orange));
		border-radius: 100px;
		transition: width 0.35s ease;
	}

	.question-stage {
		animation: slide-in 0.32s ease both;
	}

	.question-stage.leaving {
		animation: slide-out 0.28s ease forwards;
	}

	@keyframes slide-in {
		from {
			opacity: 0;
			transform: translateX(24px);
		}
		to {
			opacity: 1;
			transform: translateX(0);
		}
	}

	@keyframes slide-out {
		from {
			opacity: 1;
			transform: translateX(0);
		}
		to {
			opacity: 0;
			transform: translateX(-24px);
		}
	}

	.prompt {
		margin: 0 0 22px;
		font-size: clamp(1.3rem, 3.5vw, 1.7rem);
		font-weight: 800;
		color: #2c3e50;
		line-height: 1.3;
	}

	.answers {
		display: grid;
		gap: 14px;
	}

	.answer {
		display: flex;
		align-items: center;
		gap: 14px;
		width: 100%;
		padding: 16px 18px;
		border: 3px solid var(--orange);
		border-radius: 18px;
		background-color: #fff;
		font-family: inherit;
		font-size: 1rem;
		color: #2c3e50;
		text-align: left;
		cursor: pointer;
		transition: transform 0.15s ease, background-color 0.15s ease, border-color 0.15s ease,
			opacity 0.15s ease;
	}

	.answer:hover {
		transform: translateX(4px);
		background-color: var(--yellow);
	}

	.answer.chosen {
		background-color: var(--accent, var(--orange));
		border-color: var(--accent, var(--orange));
		color: #fff;
		transform: scale(1.02);
	}

	.answer.chosen .answer-letter {
		background-color: rgba(255, 255, 255, 0.9);
		color: var(--accent, var(--orange));
	}

	.answer.dimmed {
		opacity: 0.45;
	}

	.answer-letter {
		flex-shrink: 0;
		width: 34px;
		height: 34px;
		display: grid;
		place-items: center;
		border-radius: 50%;
		background-color: var(--yellow);
		font-weight: 800;
		color: #2c3e50;
	}

	.text-link {
		display: inline-block;
		margin-top: 26px;
		background: none;
		border: none;
		font-family: inherit;
		font-size: 0.9rem;
		color: #5a6b7e;
		cursor: pointer;
		padding: 4px;
	}

	.text-link:hover {
		color: #2c3e50;
		text-decoration: underline;
	}

	/* ---------- Result ---------- */
	.panel--result {
		animation: pop 0.4s ease both;
	}

	@keyframes pop {
		0% {
			opacity: 0;
			transform: scale(0.85);
		}
		60% {
			transform: scale(1.04);
		}
		100% {
			opacity: 1;
			transform: scale(1);
		}
	}

	.result-kicker {
		margin: 0;
		font-weight: 700;
		color: #5a6b7e;
		letter-spacing: 0.5px;
	}

	.result-emoji {
		font-size: clamp(4rem, 18vw, 7rem);
		line-height: 1;
		margin: 8px 0;
		animation: bob 2.2s ease-in-out infinite;
	}

	@keyframes bob {
		0%,
		100% {
			transform: translateY(0) rotate(-2deg);
		}
		50% {
			transform: translateY(-10px) rotate(2deg);
		}
	}

	.result-title {
		margin: 0 0 14px;
		color: var(--accent, var(--orange));
		filter: brightness(0.85);
	}

	.result-blurb {
		margin: 0 auto 28px;
		max-width: 46ch;
		color: #34495e;
		line-height: 1.6;
	}

	.actions {
		display: flex;
		justify-content: center;
		gap: 16px;
		flex-wrap: wrap;
		align-items: center;
	}

	.btn-secondary {
		border: 4px solid var(--orange);
		background: none;
		padding: 8px 16px;
		border-radius: 100px;
		font-family: inherit;
		font-size: inherit;
		color: black;
		cursor: pointer;
		transition: 0.2s;
	}

	.btn-secondary:hover {
		background-color: var(--yellow);
	}

	.btn-primary {
		display: inline-flex;
		align-items: center;
		gap: 6px;
		border: 4px solid var(--orange);
		background-color: var(--yellow);
		padding: 8px 16px;
		border-radius: 100px;
		font-family: inherit;
		font-size: inherit;
		color: black;
		cursor: pointer;
		transition: 0.2s;
	}

	.btn-primary svg {
		height: 1em;
		transition: 0.2s;
	}

	.btn-primary:hover {
		background-color: var(--orange);
	}

	.btn-primary:hover svg {
		transform: translateX(4px);
	}
</style>
