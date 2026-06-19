<script>
	// A few album covers to tease the songs page. Files live in /static/music.
	const featuredCovers = [
		'potato pal pic.png',
		'glow pic.png',
		'golden days pic.png',
		'sunshine state of mind pic.png',
		'when the rain comes down pic.png'
	];
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
			<a href="/puzzles" class="badge badge-puzzles" aria-label="Puzzles">
				<img src="landing/buildhouses.png" alt="Puzzles" />
			</a>
			<a href="/quizzes" class="badge badge-quizzes" aria-label="Quizzes">
				<img src="landing/getprizes.png" alt="Quizzes" />
			</a>
		</div>
	</div>

	<a class="songs-banner" href="/songs" aria-label="Listen to our songs">
		<div class="songs-banner-text">
			<span class="songs-eyebrow">🎵 New album out now</span>
			<h2>Listen to our songs</h2>
			<p>13 brand-new tracks — tap a cover and press play.</p>
			<span class="songs-cta">Play now →</span>
		</div>
		<div class="songs-covers" aria-hidden="true">
			{#each featuredCovers as cover, i (cover)}
				<img
					src={`/music/${encodeURIComponent(cover)}`}
					alt=""
					loading="lazy"
					style={`--i:${i}`}
				/>
			{/each}
		</div>
	</a>

	<div class="prizes-row">
		<img src="prizes/crossword.png" alt="Crossword puzzle" class="prize-image" />
		<img src="prizes/personality-quiz.png" alt="Personality Quiz" class="prize-image" />
		<img src="prizes/fun-tickets.png" alt="The Fun Website tickets" class="prize-image highlight" />
		<img src="prizes/quiz-logo.png" alt="Quiz" class="prize-image" />
		<img src="prizes/subway-surfers.png" alt="Subway Surfers" class="prize-image" />
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
		left: 96%;
	}

	/* Prominent call-out to the songs page, with a fanned stack of real covers. */
	.songs-banner {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: clamp(20px, 5vw, 56px);
		flex-wrap: wrap;
		width: min(880px, calc(100% - 32px));
		margin: 64px auto 0;
		padding: clamp(24px, 4vw, 40px) clamp(24px, 5vw, 52px);
		background-color: rgba(255, 255, 255, 0.94);
		border: 5px solid var(--orange);
		border-radius: 32px;
		box-shadow: 0 18px 50px rgba(20, 50, 100, 0.3);
		text-decoration: none;
		transition:
			transform 0.2s ease,
			box-shadow 0.2s ease;
	}

	.songs-banner:hover {
		transform: translateY(-4px);
		box-shadow: 0 24px 60px rgba(20, 50, 100, 0.38);
	}

	.songs-banner-text {
		flex: 1 1 240px;
		text-align: left;
	}

	.songs-eyebrow {
		display: inline-block;
		background: var(--yellow);
		border: 2px solid var(--orange);
		border-radius: 100px;
		padding: 4px 14px;
		font-size: 0.85rem;
		font-weight: 700;
		color: #2c3e50;
		margin-bottom: 12px;
	}

	.songs-banner-text h2 {
		margin: 0 0 8px;
		font-size: clamp(1.8rem, 5vw, 2.6rem);
		font-weight: 800;
		color: #2c3e50;
		letter-spacing: -0.5px;
	}

	.songs-banner-text p {
		margin: 0 0 18px;
		color: #34495e;
		line-height: 1.5;
	}

	.songs-cta {
		display: inline-block;
		background: var(--yellow);
		border: 3px solid var(--orange);
		border-radius: 100px;
		padding: 10px 22px;
		font-weight: 800;
		color: #2c3e50;
		transition: background 0.2s ease;
	}

	.songs-banner:hover .songs-cta {
		background: var(--orange);
	}

	/* Covers fan out like a spread deck and straighten on hover. */
	.songs-covers {
		flex: 0 0 auto;
		display: flex;
		align-items: center;
		padding: 10px 0;
	}

	.songs-covers img {
		width: clamp(64px, 12vw, 96px);
		height: clamp(64px, 12vw, 96px);
		object-fit: cover;
		border-radius: 14px;
		border: 3px solid #fff;
		box-shadow: 0 8px 18px rgba(20, 50, 100, 0.28);
		margin-left: -28px;
		transform: rotate(calc((var(--i) - 2) * 6deg));
		transition:
			transform 0.2s ease,
			margin 0.2s ease;
	}

	.songs-covers img:first-child {
		margin-left: 0;
	}

	.songs-banner:hover .songs-covers img {
		transform: rotate(0deg);
		margin-left: -14px;
	}

	.songs-banner:hover .songs-covers img:first-child {
		margin-left: 0;
	}

	@media (max-width: 640px) {
		.songs-banner {
			justify-content: center;
			text-align: center;
		}

		.songs-banner-text {
			text-align: center;
			flex-basis: 100%;
		}
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

	.login-inputs :global(button) {
		cursor: pointer;
	}
</style>
