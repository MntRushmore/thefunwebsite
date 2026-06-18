<script>
	import { onMount } from 'svelte';
	import LinkButton from '$lib/components/LinkButton.svelte';
	import { createGame } from '$lib/games/ice-lizard/engine.js';

	/** @type {HTMLCanvasElement} */
	let canvas;

	onMount(() => {
		const game = createGame(canvas);
		game.start();
		return () => game.stop();
	});
</script>

<svelte:head>
	<title>Ice Lizard vs Glacier Monsters · The Fun Website</title>
	<meta name="theme-color" content="#55aad2" />
</svelte:head>

<section class="panel">
	<h1>Ice Lizard vs Glacier Monsters</h1>
	<p>
		Guide the blue ice lizard through 5 glacier levels. Move with A/D or arrows, jump with W/Up,
		duck with Down. Tap Space to shoot ice shards, or hold Space to auto-target enemies. Freeze
		monsters and use them as platforms. Reach the portal to advance!
	</p>

	<div class="stage">
		<canvas bind:this={canvas} aria-label="Ice Lizard platformer game"></canvas>
	</div>

	<div class="actions">
		<LinkButton href="/games" showarrow>More games</LinkButton>
	</div>
</section>

<style>
	.panel {
		width: min(980px, 100%);
		background-color: rgba(255, 255, 255, 0.92);
		border: 4px solid var(--orange);
		border-radius: 28px;
		padding: clamp(20px, 4vw, 40px);
		text-align: center;
		box-shadow: 0 18px 50px rgba(20, 50, 100, 0.25);
		backdrop-filter: blur(2px);
	}

	h1 {
		margin: 0 0 12px;
		font-size: clamp(1.8rem, 5vw, 2.5rem);
		font-weight: 800;
		color: #2c3e50;
		letter-spacing: -0.5px;
	}

	p {
		margin: 0 0 24px;
		color: #34495e;
		line-height: 1.5;
	}

	.stage {
		width: 100%;
		margin: 0 auto 28px;
		border-radius: 18px;
		overflow: hidden;
		box-shadow: 0 10px 30px rgba(20, 50, 100, 0.25);
		background: #090d1c;
		aspect-ratio: 960 / 640;
	}

	canvas {
		display: block;
		width: 100%;
		height: 100%;
		image-rendering: auto;
		touch-action: none;
	}

	.actions {
		display: flex;
		justify-content: center;
		gap: 16px;
		flex-wrap: wrap;
	}
</style>
