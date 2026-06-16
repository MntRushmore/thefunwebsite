<script>
	let { children } = $props();
</script>

<div class="page-bg">
	<a class="corner-logo-link" href="/" aria-label="Back to home">
		<img class="corner-logo" src="/logo.png" alt="The Fun Website logo" />
	</a>

	<div class="page-content">
		{@render children?.()}
	</div>
</div>

<style>
	.page-bg {
		position: relative;
		min-height: 100vh;
		width: 100%;
		/* Tiled hand-painted sky. The square texture repeats seamlessly. */
		background-image: url('/background.png');
		background-repeat: repeat;
		background-size: 640px auto;
		background-position: center top;
		/* Pin a subtle blue base so any seams blend into the palette. */
		background-color: #2e63b0;
	}

	/* Soft top-down wash so content reads cleanly over the clouds without
	   hiding the artwork — lighter at the top, gentle depth toward the bottom. */
	.page-bg::before {
		content: '';
		position: absolute;
		inset: 0;
		pointer-events: none;
		background: linear-gradient(
			180deg,
			rgba(115, 172, 224, 0.15) 0%,
			rgba(115, 172, 224, 0) 35%,
			rgba(46, 99, 176, 0.18) 100%
		);
	}

	.corner-logo-link {
		position: absolute;
		top: 16px;
		left: 16px;
		z-index: 10;
		display: inline-block;
		transition: transform 0.2s ease;
	}

	.corner-logo-link:hover {
		transform: scale(1.06) rotate(-3deg);
	}

	.corner-logo {
		width: min(90px, 18vw);
		height: auto;
		display: block;
		filter: drop-shadow(0 4px 10px rgba(20, 50, 100, 0.35));
	}

	.page-content {
		position: relative;
		z-index: 1;
		min-height: 100vh;
		padding: clamp(96px, 14vh, 140px) clamp(16px, 5vw, 48px) clamp(48px, 8vh, 80px);
		display: flex;
		flex-direction: column;
		align-items: center;
	}

	/* On narrow screens, shrink the tile so more clouds stay in view
	   instead of long stretches of flat blue. */
	@media (max-width: 600px) {
		.page-bg {
			background-size: 360px auto;
		}
	}
</style>
