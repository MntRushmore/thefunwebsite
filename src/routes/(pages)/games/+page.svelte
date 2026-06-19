<script>
	import { games } from '$lib/games/index.js';
</script>

<svelte:head>
	<title>Games · The Fun Website</title>
	<meta name="theme-color" content="#73ACE0" />
</svelte:head>

<section class="panel">
	<h1>Games</h1>
	<p>Pick a game and start having fun. More are on the way!</p>

	<ul class="grid">
		{#each games as game (game.slug)}
			<li>
				<a class="card" href={game.href ?? `/games/${game.slug}`} style="--accent: {game.accent}">
					<span class="emoji" aria-hidden="true">{game.emoji}</span>
					<span class="title">{game.title}</span>
					<span class="blurb">{game.blurb}</span>
					<span class="play">Play →</span>
				</a>
			</li>
		{/each}
	</ul>
</section>

<style>
	.panel {
		width: min(880px, 100%);
		background-color: rgba(255, 255, 255, 0.92);
		border: 4px solid var(--orange);
		border-radius: 28px;
		padding: clamp(24px, 5vw, 44px);
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

	p {
		margin: 0 0 28px;
		color: #34495e;
		line-height: 1.5;
	}

	.grid {
		list-style: none;
		margin: 0;
		padding: 0;
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
		gap: 18px;
		text-align: left;
	}

	.card {
		display: flex;
		flex-direction: column;
		gap: 8px;
		height: 100%;
		padding: 20px;
		border: 3px solid var(--accent, #2878ff);
		border-radius: 20px;
		background: #fff;
		text-decoration: none;
		box-shadow: 0 8px 20px rgba(20, 50, 100, 0.12);
		transition:
			transform 0.18s ease,
			box-shadow 0.18s ease;
	}

	.card:hover {
		transform: translateY(-4px) rotate(-0.5deg);
		box-shadow: 0 14px 30px rgba(20, 50, 100, 0.22);
	}

	.emoji {
		font-size: 2.4rem;
		line-height: 1;
	}

	.title {
		font-size: 1.25rem;
		font-weight: 800;
		color: #2c3e50;
	}

	.blurb {
		color: #4a5b6b;
		line-height: 1.45;
		flex: 1;
	}

	.play {
		margin-top: 6px;
		font-weight: 700;
		color: var(--accent, #2878ff);
	}
</style>
