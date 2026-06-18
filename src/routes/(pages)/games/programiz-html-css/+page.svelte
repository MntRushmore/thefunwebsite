<script>
	import LinkButton from '$lib/components/LinkButton.svelte';
</script>

<svelte:head>
	<title>Zombie Pixel Runner · The Fun Website</title>
	<meta name="theme-color" content="#73ACE0" />
</svelte:head>

<section class="panel">
	<h1>Zombie Pixel Runner</h1>
	<p>
		Play this pixel-style runner directly here. If you want the full-screen version, you can also
		open the original page.
	</p>

	<div class="game-shell">
		<iframe
			src="https://everettmartin.github.io/My-Website/programiz-html-css/index.html"
			title="Zombie Pixel Runner"
			loading="lazy"
			referrerpolicy="strict-origin-when-cross-origin"
		></iframe>
	</div>

	<div class="actions">
		<LinkButton href="/games" showarrow>More games</LinkButton>
	</div>
</section>

<style>
	.panel {
		width: min(1100px, 100%);
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
		font-size: clamp(2rem, 6vw, 3rem);
		font-weight: 800;
		color: #2c3e50;
		letter-spacing: -0.5px;
	}

	p {
		margin: 0 0 24px;
		color: #34495e;
		line-height: 1.5;
	}

	.game-shell {
		width: 100%;
		margin: 0 auto 28px;
		border-radius: 18px;
		overflow: hidden;
		box-shadow: 0 10px 30px rgba(20, 50, 100, 0.25);
		background: #0f1117;
	}

	iframe {
		display: block;
		width: 100%;
		height: min(80vh, 760px);
		border: 0;
	}

	.actions {
		display: flex;
		justify-content: center;
	}
</style>
