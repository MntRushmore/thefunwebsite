<script>	
	import LinkButton from '$lib/components/LinkButton.svelte';
</script>

<svelte:head>
	<title>Songs · The Fun Website</title>
	<meta name="theme-color" content="#73ACE0" />
</svelte:head>

<section class="panel">
	<h1>Songs</h1>
	<p>Enjoy the new songs page! Replace this content with your music player, song list, or fun lyrics.</p>

	<div class="actions">
		<LinkButton href="/" showarrow>Back to home</LinkButton>
	</div>
</section>

<style>
	.panel {
		width: min(680px, 100%);
		background-color: rgba(255, 255, 255, 0.92);
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

	p {
		margin: 0 0 28px;
		color: #34495e;
		line-height: 1.5;
	}

	.actions {
		display: flex;
		justify-content: center;
		gap: 16px;
		flex-wrap: wrap;
	}
</style>
