<script>
	import LinkButton from '$lib/components/LinkButton.svelte';

	// Each song maps to its album cover in /static/music and (eventually) an
	// audio file. Drop an MP3 into /static/music named to match `audio` below
	// and that song becomes playable — no code change needed.
	const songs = [
		{ title: 'Potato Pal', cover: 'potato pal pic.png', audio: 'potato pal.mp3' },
		{ title: 'Taco Tom', cover: 'taco tom pic.png', audio: 'taco tom.mp3' },
		{ title: 'Burrito Bob', cover: 'burrito bob pic.png', audio: 'burrito bob.mp3' },
		{ title: 'Glow', cover: 'glow pic.png', audio: 'glow.mp3' },
		{ title: 'Level Up', cover: 'level up pic.png', audio: 'level up.mp3' },
		{ title: 'Golden Days', cover: 'golden days pic.png', audio: 'golden days.mp3' },
		{ title: 'Brighter Then B4', cover: 'brighter then be4 pic.png', audio: 'brighter then be4.mp3' },
		{ title: 'Field of Flowers', cover: 'feild of flowers pic.png', audio: 'feild of flowers.mp3' },
		{ title: 'Sunshine State of Mind', cover: 'sunshine state of mind pic.png', audio: 'sunshine state of mind.mp3' },
		{ title: 'If U Were Here', cover: 'if u were here pic.png', audio: 'if u were here.mp3' },
		{ title: 'Runaway Fireflies', cover: 'runaway fireflys pic.png', audio: 'runaway fireflies.mp3' },
		{ title: 'Moonlight on da Ocean', cover: 'moonlight on da ocean song.png', audio: 'moonlight on da ocean.mp3' },
		{ title: 'When the Rain Comes Down', cover: 'when the rain comes down pic.png', audio: 'when the rain comes down.mp3' }
	];

	/** @param {(typeof songs)[number]} song */
	const coverUrl = (song) => `/music/${encodeURIComponent(song.cover)}`;
	/** @param {(typeof songs)[number]} song */
	const audioUrl = (song) => `/music/${encodeURIComponent(song.audio)}`;

	/** @type {HTMLAudioElement | null} */
	let audioEl = $state(null);
	let current = $state(null); // index of the loaded song, or null
	let playing = $state(false);
	let progress = $state(0); // 0..1
	let duration = $state(0);
	let currentTime = $state(0);
	let missing = $state(false); // true when the chosen song has no audio file yet

	/** @param {number} i */
	function select(i) {
		if (current === i) {
			toggle();
			return;
		}
		current = i;
		missing = false;
		progress = 0;
		currentTime = 0;
		duration = 0;
		// Let the DOM update the <source> before we load + play.
		queueMicrotask(() => {
			if (!audioEl) return;
			audioEl.load();
			audioEl.play().catch(() => {
				// No file yet (404) or autoplay blocked — show the friendly note.
				playing = false;
			});
		});
	}

	function toggle() {
		if (!audioEl || current === null) return;
		if (playing) {
			audioEl.pause();
		} else {
			audioEl.play().catch(() => {});
		}
	}

	/** @param {number} t */
	function fmt(t) {
		if (!t || !isFinite(t)) return '0:00';
		const m = Math.floor(t / 60);
		const s = Math.floor(t % 60);
		return `${m}:${String(s).padStart(2, '0')}`;
	}

	/** @type {(e: MouseEvent & { currentTarget: EventTarget & HTMLElement }) => void} */
	const seek = (e) => {
		if (!audioEl || !duration) return;
		const rect = e.currentTarget.getBoundingClientRect();
		const ratio = Math.min(1, Math.max(0, (e.clientX - rect.left) / rect.width));
		audioEl.currentTime = ratio * duration;
	};

	function onTimeUpdate() {
		if (!audioEl) return;
		currentTime = audioEl.currentTime;
		progress = duration ? currentTime / duration : 0;
	}
</script>

<svelte:head>
	<title>Songs · The Fun Website</title>
	<meta name="theme-color" content="#73ACE0" />
</svelte:head>

<section class="panel" class:has-player={current !== null}>
	<h1>Songs</h1>
	<p>Our whole album, all in one place. Tap a cover to play. 🎵</p>

	<ul class="grid">
		{#each songs as song, i (song.title)}
			<li>
				<button
					class="card"
					class:active={current === i}
					onclick={() => select(i)}
					aria-label={`Play ${song.title}`}
				>
					<span class="art">
						<img src={coverUrl(song)} alt={`${song.title} album cover`} loading="lazy" />
						<span class="overlay" aria-hidden="true">
							{#if current === i && playing}⏸{:else}▶{/if}
						</span>
					</span>
					<span class="name">{song.title}</span>
				</button>
			</li>
		{/each}
	</ul>

	<div class="actions">
		<LinkButton href="/" showarrow>Back to home</LinkButton>
	</div>
</section>

{#if current !== null}
	<div class="player" role="region" aria-label="Now playing">
		<img class="player-art" src={coverUrl(songs[current])} alt="" />
		<div class="player-meta">
			<div class="player-top">
				<button class="play-btn" onclick={toggle} aria-label={playing ? 'Pause' : 'Play'}>
					{#if playing}⏸{:else}▶{/if}
				</button>
				<div class="player-title">
					<strong>{songs[current].title}</strong>
					{#if missing}
						<span class="note">Audio coming soon — drop the MP3 in /static/music</span>
					{/if}
				</div>
				<span class="time">{fmt(currentTime)} / {fmt(duration)}</span>
			</div>
			<!-- svelte-ignore a11y_click_events_have_key_events, a11y_no_static_element_interactions -->
			<div class="bar" onclick={seek}>
				<div class="bar-fill" style={`width:${progress * 100}%`}></div>
			</div>
		</div>
	</div>

	<audio
		bind:this={audioEl}
		onplay={() => (playing = true)}
		onpause={() => (playing = false)}
		onended={() => (playing = false)}
		onerror={() => {
			playing = false;
			missing = true;
		}}
		onloadedmetadata={() => (duration = audioEl?.duration ?? 0)}
		ontimeupdate={onTimeUpdate}
	>
		<source src={audioUrl(songs[current])} type="audio/mpeg" />
	</audio>
{/if}

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

	/* Leave room so the sticky player never covers the last row / button. */
	.panel.has-player {
		margin-bottom: 120px;
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
		margin: 0 0 28px;
		padding: 0;
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
		gap: 18px;
	}

	.card {
		display: flex;
		flex-direction: column;
		gap: 10px;
		width: 100%;
		padding: 0;
		border: none;
		background: none;
		font: inherit;
		cursor: pointer;
		text-align: center;
	}

	.art {
		position: relative;
		display: block;
		border-radius: 18px;
		overflow: hidden;
		border: 3px solid var(--orange);
		box-shadow: 0 8px 20px rgba(20, 50, 100, 0.18);
		aspect-ratio: 1 / 1;
		transition:
			transform 0.18s ease,
			box-shadow 0.18s ease;
	}

	.art img {
		width: 100%;
		height: 100%;
		object-fit: cover;
		display: block;
	}

	.overlay {
		position: absolute;
		inset: 0;
		display: flex;
		align-items: center;
		justify-content: center;
		font-size: 2.6rem;
		color: #fff;
		background: rgba(20, 40, 80, 0.32);
		opacity: 0;
		transition: opacity 0.18s ease;
		text-shadow: 0 2px 8px rgba(0, 0, 0, 0.45);
	}

	.card:hover .art {
		transform: translateY(-4px) rotate(-0.5deg);
		box-shadow: 0 14px 30px rgba(20, 50, 100, 0.28);
	}

	.card:hover .overlay,
	.card.active .overlay {
		opacity: 1;
	}

	.card.active .art {
		border-color: var(--blue);
	}

	.name {
		font-weight: 800;
		color: #2c3e50;
		line-height: 1.25;
	}

	.actions {
		display: flex;
		justify-content: center;
		gap: 16px;
		flex-wrap: wrap;
	}

	/* --- Sticky now-playing bar --- */
	.player {
		position: fixed;
		left: 50%;
		bottom: 16px;
		transform: translateX(-50%);
		z-index: 20;
		width: min(720px, calc(100% - 24px));
		display: flex;
		align-items: center;
		gap: 14px;
		padding: 12px 16px;
		background-color: rgba(255, 255, 255, 0.96);
		border: 4px solid var(--orange);
		border-radius: 20px;
		box-shadow: 0 14px 40px rgba(20, 50, 100, 0.3);
		backdrop-filter: blur(4px);
	}

	.player-art {
		width: 56px;
		height: 56px;
		border-radius: 12px;
		object-fit: cover;
		flex-shrink: 0;
		border: 2px solid var(--orange);
	}

	.player-meta {
		flex: 1;
		min-width: 0;
	}

	.player-top {
		display: flex;
		align-items: center;
		gap: 12px;
	}

	.play-btn {
		flex-shrink: 0;
		width: 40px;
		height: 40px;
		border-radius: 50%;
		border: 3px solid var(--orange);
		background: var(--yellow);
		color: #2c3e50;
		font-size: 1.1rem;
		line-height: 1;
		cursor: pointer;
		transition: background 0.2s ease;
	}

	.play-btn:hover {
		background: var(--orange);
	}

	.player-title {
		flex: 1;
		min-width: 0;
		text-align: left;
		color: #2c3e50;
		overflow: hidden;
	}

	.player-title strong {
		display: block;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}

	.note {
		display: block;
		font-size: 0.7rem;
		font-weight: 500;
		color: #8a6d3b;
	}

	.time {
		flex-shrink: 0;
		font-size: 0.8rem;
		color: #4a5b6b;
		font-variant-numeric: tabular-nums;
	}

	.bar {
		margin-top: 8px;
		height: 8px;
		border-radius: 100px;
		background: rgba(115, 172, 224, 0.3);
		cursor: pointer;
		overflow: hidden;
	}

	.bar-fill {
		height: 100%;
		background: var(--blue);
		border-radius: 100px;
		transition: width 0.1s linear;
	}

	@media (max-width: 520px) {
		.time {
			display: none;
		}
	}
</style>
