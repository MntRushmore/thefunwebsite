<script>
	import { onMount } from 'svelte';
	import LinkButton from '$lib/components/LinkButton.svelte';
	import { createGame } from '$lib/games/ice-lizard/engine.js';

	/** @type {HTMLCanvasElement} */
	let canvas;
	/** @type {HTMLDivElement} */
	let stage;
	let isFullscreen = false;

	function toggleFullscreen() {
		if (!document.fullscreenElement) {
			stage.requestFullscreen().catch(() => {});
		} else {
			document.exitFullscreen();
		}
	}

	function handleFullscreenChange() {
		isFullscreen = !!document.fullscreenElement;
	}

	onMount(() => {
		const game = createGame(canvas);
		game.start();

		document.addEventListener('fullscreenchange', handleFullscreenChange);

		return () => {
			game.stop();
			document.removeEventListener('fullscreenchange', handleFullscreenChange);
		};
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

	<div class="stage" bind:this={stage}>
		<canvas bind:this={canvas} aria-label="Ice Lizard platformer game"></canvas>
		<button class="fullscreen-btn" on:click={toggleFullscreen} title={isFullscreen ? 'Exit fullscreen' : 'Fullscreen'}>
			{#if isFullscreen}
				<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
					<path d="M8 3v3a2 2 0 0 1-2 2H3m18 0h-3a2 2 0 0 1-2-2V3m0 18v-3a2 2 0 0 1 2-2h3M3 16h3a2 2 0 0 1 2 2v3"/>
				</svg>
			{:else}
				<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
					<path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3"/>
				</svg>
			{/if}
		</button>
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
		position: relative;
		width: 100%;
		margin: 0 auto 28px;
		border-radius: 18px;
		overflow: hidden;
		box-shadow: 0 10px 30px rgba(20, 50, 100, 0.25);
		background: #090d1c;
		aspect-ratio: 960 / 640;
	}

	.stage:fullscreen {
		border-radius: 0;
		display: flex;
		align-items: center;
		justify-content: center;
		background: #000;
	}

	.stage:fullscreen canvas {
		max-width: 100%;
		max-height: 100%;
		width: auto;
		height: auto;
		aspect-ratio: 960 / 640;
	}

	canvas {
		display: block;
		width: 100%;
		height: 100%;
		image-rendering: auto;
		touch-action: none;
	}

	.fullscreen-btn {
		position: absolute;
		bottom: 12px;
		right: 12px;
		width: 40px;
		height: 40px;
		border: none;
		border-radius: 8px;
		background: rgba(0, 0, 0, 0.6);
		color: white;
		cursor: pointer;
		display: flex;
		align-items: center;
		justify-content: center;
		transition: background 0.2s, transform 0.1s;
		z-index: 10;
	}

	.fullscreen-btn:hover {
		background: rgba(0, 0, 0, 0.8);
		transform: scale(1.05);
	}

	.fullscreen-btn svg {
		width: 22px;
		height: 22px;
	}

	.actions {
		display: flex;
		justify-content: center;
		gap: 16px;
		flex-wrap: wrap;
	}
</style>
