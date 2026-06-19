<script>
	let expandedFaqItem = $state(/** @type {number | null} */ (null));

	// FAQ data — replace with your own questions and answers
	const faqData = [
		{
			question: 'What is The Fun Website?',
			answer: 'Placeholder answer. Tell visitors what The Fun Website is all about right here.'
		},
		{
			question: 'How do I get started?',
			answer: 'Placeholder answer. Explain how someone can jump in and start having fun.'
		},
		{
			question: 'Is it free?',
			answer: 'Placeholder answer. Let people know about pricing (or that it is free!).'
		},
		{
			question: 'Who is this for?',
			answer: 'Placeholder answer. Describe who will love The Fun Website.'
		},
		{
			question: 'Who made this?',
			answer: 'Placeholder answer. Add a little about the team behind The Fun Website.'
		}
	];

	/**
	 * @param {number} index
	 */
	function toggleFaqItem(index) {
		expandedFaqItem = expandedFaqItem === index ? null : index;
	}
</script>

<svelte:head>
	<title>The Fun Website</title>
	<meta property="og:title" content="The Fun Website" />
	<meta property="og:description" content="A placeholder description for The Fun Website." />
	<meta property="og:image" content="/ogimg.png" />
	<meta property="og:image:width" content="1200" />
	<meta property="og:image:height" content="630" />
	<meta property="og:type" content="website" />
	<meta name="twitter:card" content="summary_large_image" />
	<meta name="twitter:title" content="The Fun Website" />
	<meta name="twitter:description" content="A placeholder description for The Fun Website." />

	<meta name="theme-color" content="#73ACE0" />
</svelte:head>

<main>
	<img class="corner-logo" src="logo.png" alt="The Fun Website logo" />

	<img class="logo-bg" src="hero.png" alt="The Fun Website" />

	<div class="login-inputs">
		<p style="color: white; font-size: 1.1rem; margin-bottom: 0.25rem;">click a button to have fun!</p>
		<a href="https://docs.google.com/document/d/1rGTrUIS2fze64H3hUzArpsPUuLhjR6w9DKL8-fJ6OIE/edit?tab=t.0" style="color: #fff575; font-size: 1.4rem; font-weight: 700; margin-top: 0.5rem; display: block;">our business plan</a>
	</div>

	<div class="sample-room">
		<div class="logo-stage">
			<img src="logo.png" class="room-bg" alt="The Fun Website" />

			<a href="/games" class="badge badge-games" aria-label="Games">
				<img src="landing/makegames.png" alt="Games" />
			</a>
		<a href="/songs" class="badge badge-songs" aria-label="Songs">
			<img src="/songs-final-button.png" alt="Songs" />
		</a>
			<a href="/quizzes" class="badge badge-quizzes" aria-label="Quizzes">
				<img src="landing/getprizes.png" alt="Quizzes" />
			</a>
		</div>
	</div>

	<div class="prizes-row">
		<img src="prizes/crossword.png" alt="Crossword puzzle" class="prize-image" />
		<img src="prizes/personality-quiz.png" alt="Personality Quiz" class="prize-image" />
		<img src="prizes/fun-tickets.png" alt="The Fun Website tickets" class="prize-image highlight" />
		<img src="prizes/quiz-logo.png" alt="Quiz" class="prize-image" />
		<img src="prizes/subway-surfers.png" alt="Subway Surfers" class="prize-image" />
	</div>

	<div class="faq-section">
		<h3>Have questions? We answer them!!!</h3>
		<div class="faq-list">
			{#each faqData as item, index}
				<div class="faq-item">
					<button class="faq-question" onclick={() => toggleFaqItem(index)}>
						<span>{item.question}</span>
						<span class="faq-arrow" class:expanded={expandedFaqItem === index}>▼</span>
					</button>

					{#if expandedFaqItem === index}
						<div class="faq-answer">
							<p>{item.answer}</p>
						</div>
					{/if}
				</div>
			{/each}
		</div>
	</div>

	<footer>
		<p>made with ❤️ by your team</p>
		<p>placeholder footer text — add credits or links here</p>
	</footer>
</main>

<style>
	footer {
		width: 100%;
		text-align: center;
		padding: 20px;
	}

	footer p {
		margin: 4px 0;
	}

	main {
		position: relative;
		width: 100%;
		background-color: #74ade1;
		min-height: 100%;

		padding-bottom: 24px;
	}

	.logo-bg {
		width: 100%;
		margin-bottom: -45%;
	}

	.corner-logo {
		position: absolute;
		top: 16px;
		left: 16px;
		width: min(90px, 18vw);
		height: auto;
		z-index: 10;
	}

	.login-inputs {
		width: 100%;
		display: flex;
		flex-flow: column;
		justify-content: center;
		align-items: center;
		text-align: center;
	}

	.sample-room {
		position: relative;
		display: flex;
		justify-content: center;
		align-items: center;
		margin-top: 80px;
		min-height: 50vw;
	}

	/* Sized to the logo so badge percentages reference the circle itself. */
	.logo-stage {
		position: relative;
		width: 50vw;
	}

	.logo-stage .room-bg {
		width: 100%;
		display: block;
	}

	/* Round sticker links that orbit the circular logo. Each is centered on
	   its anchor point via translate(-50%, -50%), then nudged onto the
	   logo's perimeter so they frame it evenly without covering the face. */
	.badge {
		position: absolute;
		width: 14vw;
		display: block;
		transform: translate(-50%, -50%);
		transition: transform 0.2s ease;
		filter: drop-shadow(0 6px 12px rgba(20, 50, 100, 0.25));
		z-index: 2;
	}

	.badge img {
		width: 100%;
		height: auto;
		display: block;
	}

	.badge:hover {
		transform: translate(-50%, -50%) scale(1.1) rotate(-4deg);
	}

	/* games — left rim, vertically centered in the clear band between the
	   "fun website" text above and the names below */
	.badge-games {
		top: 50%;
		left: -4%;
	}

	/* puzzles — bottom-left corner, pushed outside the circle so it sits below
	   the names arc in open sky */
	.badge-puzzles {
		top: 100%;
		left: 6%;
	}

	/* quizzes — bottom-right corner, mirrored */
	.badge-quizzes {
		top: 100%;
		left: 94%;
	}

	/* songs — top-right, outside the logo circle */
	.badge-songs {
		top: 18%;
		left: 88%;
	}

	.prizes-row {
		display: flex;
		justify-content: center;
		align-items: center;
		gap: clamp(2px, 2.5vw, 48px);
		margin-top: 40px;
		width: 100%;
		box-sizing: border-box;
		padding: 24px 6px;
		overflow-x: hidden;
	}

	.prize-image {
		height: clamp(42px, 13vw, 150px);
		width: auto;
		object-fit: contain;
		filter: drop-shadow(0 6px 12px rgba(20, 50, 100, 0.25));
		animation: bounce 2s ease-in-out infinite;
	}

	.prize-image.highlight {
		height: clamp(68px, 19vw, 230px);
	}

	.prize-image:first-child {
		animation-delay: 0s;
	}

	.prize-image:nth-child(2) {
		animation-delay: 0.2s;
	}

	.prize-image:nth-child(3) {
		animation-delay: 0.4s;
	}

	.prize-image:nth-child(4) {
		animation-delay: 0.6s;
	}

	.prize-image:nth-child(5) {
		animation-delay: 0.8s;
	}

	@keyframes bounce {
		0%,
		100% {
			transform: translateY(0);
		}
		50% {
			transform: translateY(-10px);
		}
	}

	.faq-section {
		margin: 40px 20px;
		padding: 32px;
		text-align: center;
	}

	.faq-section h3 {
		margin: 0 0 24px 0;
		color: #2c3e50;
		font-size: 24px;
		font-weight: 700;
		letter-spacing: -0.5px;
	}

	.faq-list {
		text-align: left;
		max-width: 600px;
		margin: 0 auto;
	}

	.faq-item {
		margin-bottom: 0;
	}

	.faq-item:last-child {
		border-bottom: none;
	}

	.faq-question {
		width: 100%;
		background: none;
		border: none;
		padding: 20px 16px;
		text-align: left;
		cursor: pointer;
		display: flex;
		justify-content: space-between;
		align-items: center;
		color: #2c3e50;
		font-size: 1em;
		font-family: inherit;
		font-weight: 600;
		line-height: 1.4;
	}

	.faq-question:hover {
		color: #1a252f;
	}

	.faq-arrow {
		transition: transform 0.2s;
		font-size: 14px;
		color: #435b89;
		margin-left: 12px;
		flex-shrink: 0;
	}

	.faq-arrow.expanded {
		transform: rotate(180deg);
	}

	.faq-answer {
		padding: 0 16px 20px 16px;
		color: #34495e;
		line-height: 1.6;
		font-size: 1em;
		font-family: inherit;
	}

	.faq-answer p {
		margin: 0;
		font-weight: 400;
	}

	.login-inputs :global(button) {
		cursor: pointer;
	}
</style>
