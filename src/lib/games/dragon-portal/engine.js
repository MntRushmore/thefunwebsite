// Dragon Portal Platformer — HTML5 Canvas port of the pygame original.
//
// This first cut covers the *playable core*: a dragon you can run + jump,
// platforms with collision, a smooth follow camera, a parallax background,
// and a win portal that ends the level. Enemies, fireballs, and hazards are
// deliberately left out for now but the structure (per-frame update/draw,
// world-space objects, camera transform) is set up so they drop in cleanly.
//
// Usage: `createGame(canvas)` returns a controller with start()/stop().

// -------------------------
// Tunables
// -------------------------
const WIDTH = 900;
const HEIGHT = 500;
const LEVEL_WIDTH = 6000;

const MAX_SPEED = 8.8;
const GROUND_ACCEL = 0.7;
const AIR_ACCEL = 0.6;
const FRICTION = 0.84;

const JUMP_POWER = -17.5;
const GRAVITY = 0.62;
const MAX_FALL_SPEED = 15;

const COYOTE_TIME = 0.13;
const CAMERA_SMOOTHNESS = 0.1;

// -------------------------
// Colors
// -------------------------
const SKY = '#87ceeb';
const GREEN = '#3cb44b';
const BROWN = '#8b4513';
const WHITE = '#ffffff';

const DRAGON_RED = '#dc2323';
const DARK_RED = '#961414';
const WING_RED = '#ff5038';
const WING_ORANGE = '#ff9632';
const VENOM_GREEN = '#50ff3c';

const YELLOW = '#ffdc00';
const ORANGE = '#ff8200';
const RED_ORANGE = '#ff3c00';
const BLUE = '#2878ff';
const PURPLE = '#aa46ff';
const CYAN = '#00e6e6';
const LIME = '#78ff50';

// Hazards
const LAVA_RED = '#dc1e00';
const LAVA_ORANGE = '#ff6e00';
const LAVA_YELLOW = '#ffdc00';
const SPIKE_GRAY = '#828282';
const SPIKE_DARK = '#464646';
const CHECKPOINT_BLUE = '#3c96ff';

// Corrupted lightning enemy
const CORRUPT_PURPLE = '#8200c8';
const CORRUPT_DARK_PURPLE = '#3c0064';
const LIGHTNING_PURPLE = '#d250ff';
const LIGHTNING_WHITE = '#f5dcff';
const WING_MEMBRANE = '#aa28e6';
const CORRUPT_EDGE = '#230041';
const ELECTRIC_BLUE = '#78d2ff';
const DARK_SHADOW = '#19002d';

// -------------------------
// Level definition
// -------------------------
function makeLevel() {
	return {
		platforms: [
			{ x: 0, y: 450, w: LEVEL_WIDTH, h: 50 }, // ground
			{ x: 500, y: 360, w: 115, h: 20 },
			{ x: 980, y: 300, w: 110, h: 20 },
			{ x: 1500, y: 240, w: 120, h: 20 },
			{ x: 2100, y: 340, w: 115, h: 20 },
			{ x: 2750, y: 260, w: 125, h: 20 },
			{ x: 3400, y: 180, w: 115, h: 20 },
			{ x: 4050, y: 320, w: 120, h: 20 },
			{ x: 4700, y: 240, w: 110, h: 20 },
			{ x: 5350, y: 350, w: 125, h: 20 }
		],
		portal: { x: 5880, y: 345, w: 80, h: 105 },
		spikes: [
			{ x: 800, y: 425, w: 35, h: 25 },
			{ x: 1400, y: 425, w: 35, h: 25 },
			{ x: 2300, y: 425, w: 35, h: 25 },
			{ x: 3200, y: 425, w: 35, h: 25 },
			{ x: 4100, y: 425, w: 35, h: 25 },
			{ x: 5000, y: 425, w: 35, h: 25 },
			{ x: 5750, y: 425, w: 35, h: 25 },
			{ x: 1015, y: 275, w: 35, h: 25 },
			{ x: 2765, y: 235, w: 35, h: 25 },
			{ x: 4710, y: 215, w: 35, h: 25 }
		],
		lavaPools: [
			{ x: 1150, y: 435, w: 120, h: 15 },
			{ x: 1800, y: 435, w: 130, h: 15 },
			{ x: 2900, y: 435, w: 140, h: 15 },
			{ x: 3800, y: 435, w: 130, h: 15 },
			{ x: 5200, y: 435, w: 140, h: 15 }
		],
		checkpoints: [
			{ x: 1600, y: 390, w: 42, h: 60 },
			{ x: 3600, y: 390, w: 42, h: 60 },
			{ x: 5400, y: 390, w: 42, h: 60 }
		]
	};
}

// Coins are consumed during play, so they're built fresh each run.
function makeCoins() {
	return [
		{ x: 550, y: 320, w: 20, h: 20 },
		{ x: 1030, y: 260, w: 20, h: 20 },
		{ x: 1550, y: 200, w: 20, h: 20 },
		{ x: 2150, y: 300, w: 20, h: 20 },
		{ x: 2800, y: 220, w: 20, h: 20 },
		{ x: 3450, y: 140, w: 20, h: 20 },
		{ x: 4100, y: 280, w: 20, h: 20 },
		{ x: 4750, y: 200, w: 20, h: 20 },
		{ x: 5400, y: 310, w: 20, h: 20 },
		// Ground-route coins
		{ x: 700, y: 410, w: 20, h: 20 },
		{ x: 1300, y: 410, w: 20, h: 20 },
		{ x: 1900, y: 410, w: 20, h: 20 },
		{ x: 2500, y: 410, w: 20, h: 20 },
		{ x: 3100, y: 410, w: 20, h: 20 },
		{ x: 3700, y: 410, w: 20, h: 20 },
		{ x: 4300, y: 410, w: 20, h: 20 },
		{ x: 4900, y: 410, w: 20, h: 20 },
		{ x: 5600, y: 410, w: 20, h: 20 }
	];
}

/**
 * @typedef {Object} Enemy
 * @property {number} x @property {number} baseY @property {number} y
 * @property {number} w @property {number} h
 * @property {number} minX @property {number} maxX
 * @property {number} speed @property {number} dir @property {number} phase
 * @property {number} flyAmp @property {number} flySpeed
 * @property {number} hp @property {number} maxHp
 */

/**
 * @param {number} x @param {number} baseY @param {number} minX @param {number} maxX
 * @param {number} speed @param {number} dir @param {number} phase
 * @param {number} flyAmp @param {number} flySpeed
 * @returns {Enemy}
 */
function makeEnemy(x, baseY, minX, maxX, speed, dir, phase, flyAmp, flySpeed) {
	return { x, baseY, y: baseY, w: 42, h: 76, minX, maxX, speed, dir, phase, flyAmp, flySpeed, hp: 5, maxHp: 5 };
}

function createEnemies() {
	return [
		makeEnemy(520, 260, 450, 650, 2.0, 1, 0.0, 24, 2.5),
		makeEnemy(920, 250, 840, 1050, 2.4, -1, 1.1, 32, 2.3),
		makeEnemy(1500, 220, 1420, 1650, 2.3, -1, 2.2, 34, 2.1),
		makeEnemy(2120, 270, 2030, 2260, 2.2, -1, 3.1, 38, 1.9),
		makeEnemy(2740, 200, 2640, 2890, 1.9, 1, 4.1, 24, 2.6),
		makeEnemy(3360, 250, 3260, 3500, 2.4, -1, 4.9, 35, 2.0),
		makeEnemy(3980, 210, 3880, 4130, 2.3, 1, 5.6, 34, 2.2),
		makeEnemy(4600, 260, 4500, 4750, 2.0, -1, 6.6, 30, 2.8),
		makeEnemy(5220, 210, 5120, 5370, 2.1, -1, 7.7, 28, 2.6),
		makeEnemy(5700, 250, 5600, 5860, 2.3, 1, 8.9, 36, 2.0)
	];
}

/**
 * @typedef {{ x: number, y: number, w: number, h: number }} Box
 * @param {Box} a
 * @param {Box} b
 */
function rectsOverlap(a, b) {
	return a.x < b.x + b.w && a.x + a.w > b.x && a.y < b.y + b.h && a.y + a.h > b.y;
}

// -------------------------
// Game factory
// -------------------------
/**
 * @param {HTMLCanvasElement} canvas
 */
export function createGame(canvas) {
	const ctx = /** @type {CanvasRenderingContext2D} */ (canvas.getContext('2d'));
	canvas.width = WIDTH;
	canvas.height = HEIGHT;

	const level = makeLevel();

	const state = {
		player: { x: 100, y: 300, w: 54, h: 38, vx: 0, vy: 0 },
		onGround: false,
		facingRight: true,
		coyoteTimer: 0,
		cameraX: 0,
		animTime: 0,
		won: false,
		winTimer: 0,
		raf: 0,
		lastTime: 0,
		running: false,
		// Combat + collectibles
		/** @type {any[]} */
		fireballs: [],
		/** @type {any[]} */
		particles: [],
		/** @type {Enemy[]} */
		enemies: createEnemies(),
		/** @type {Box[]} */
		coins: makeCoins(),
		score: 0,
		/** @type {Set<number>} */
		activatedCheckpoints: new Set(),
		checkpointX: 100,
		checkpointY: 300,
		// Fire-charge tracking
		spaceHolding: false,
		spaceHoldTime: 0,
		fireRepeatTimer: 0
	};

	const keys = new Set();

	// Respawn at the most recent checkpoint (or the start).
	function resetPlayer() {
		const p = state.player;
		p.x = state.checkpointX;
		p.y = state.checkpointY;
		p.vx = 0;
		p.vy = 0;
		state.onGround = false;
	}

	function restart() {
		state.checkpointX = 100;
		state.checkpointY = 300;
		resetPlayer();
		state.facingRight = true;
		state.cameraX = 0;
		state.won = false;
		state.winTimer = 0;
		state.fireballs = [];
		state.particles = [];
		state.enemies = createEnemies();
		state.coins = makeCoins();
		state.score = 0;
		state.activatedCheckpoints = new Set();
		state.spaceHolding = false;
		state.spaceHoldTime = 0;
		state.fireRepeatTimer = 0;
	}

	// -------------------------
	// Fireballs + particles
	// -------------------------
	function mouthPosition() {
		const p = state.player;
		return state.facingRight ? { x: p.x + 112, y: p.y + 16 } : { x: p.x - 64, y: p.y + 16 };
	}

	/** @param {number} radius */
	function shootFireball(radius) {
		const m = mouthPosition();
		const direction = state.facingRight ? 1 : -1;
		state.fireballs.push({
			x: m.x,
			y: m.y,
			vx: direction * (12 + radius * 0.12),
			radius,
			life: 3.0,
			direction,
			wobble: Math.random() * 100
		});
	}

	/** @param {any} fb */
	function spawnFireParticles(fb) {
		const { x, y, radius: r, direction } = fb;
		for (let i = 0; i < 3; i++) {
			state.particles.push({
				x: x - direction * rand(r * 0.5, r * 1.4),
				y: y + rand(-r * 0.6, r * 0.6),
				vx: -direction * rand(1.0, 4.0),
				vy: rand(-1.5, 1.5),
				radius: rand(2, Math.max(3, r * 0.25)),
				life: rand(0.25, 0.6),
				maxLife: 0.6,
				color: pick([RED_ORANGE, ORANGE, YELLOW]),
				type: 'fire'
			});
		}
		if (Math.random() < 0.35) {
			const g = Math.round(rand(70, 120));
			state.particles.push({
				x: x - direction * rand(r, r * 2),
				y: y + rand(-r * 0.4, r * 0.4),
				vx: -direction * rand(0.3, 1.2),
				vy: rand(-0.8, -0.2),
				radius: rand(5, Math.max(6, r * 0.45)),
				life: rand(0.5, 1.0),
				maxLife: 1.0,
				color: `rgb(${g},${g},${g})`,
				type: 'smoke'
			});
		}
	}

	/** @param {Enemy} enemy @param {number} count @param {number} maxSpeed @param {number} maxLife */
	function spawnEnemyParticles(enemy, count, maxSpeed, maxLife) {
		const cx = enemy.x + enemy.w / 2;
		const cy = enemy.y + enemy.h / 2;
		const cols = [LIGHTNING_PURPLE, LIGHTNING_WHITE, ELECTRIC_BLUE, CORRUPT_PURPLE];
		for (let i = 0; i < count; i++) {
			const angle = rand(0, Math.PI * 2);
			const speed = rand(maxSpeed * 0.4, maxSpeed);
			state.particles.push({
				x: cx,
				y: cy,
				vx: Math.cos(angle) * speed,
				vy: Math.sin(angle) * speed,
				radius: rand(2, 5),
				life: rand(maxLife * 0.5, maxLife),
				maxLife,
				color: pick(cols),
				type: 'fire'
			});
		}
	}

	/** @param {number} dt @param {number} step */
	function updateParticles(dt, step) {
		for (let i = state.particles.length - 1; i >= 0; i--) {
			const pt = state.particles[i];
			pt.x += pt.vx * step;
			pt.y += pt.vy * step;
			pt.life -= dt;
			if (pt.type === 'smoke') {
				pt.vy -= 0.03 * step;
				pt.radius += 0.08 * step;
			} else {
				pt.radius -= 0.03 * step;
			}
			if (pt.life <= 0 || pt.radius <= 0) state.particles.splice(i, 1);
		}
	}

	/** @param {number} step @param {number} t */
	function updateEnemies(step, t) {
		for (const e of state.enemies) {
			e.x += e.dir * e.speed * step;
			if (e.x < e.minX) {
				e.x = e.minX;
				e.dir = 1;
			}
			if (e.x > e.maxX) {
				e.x = e.maxX;
				e.dir = -1;
			}
			e.y = e.baseY + Math.sin(t * e.flySpeed + e.phase) * e.flyAmp + Math.sin(t * 8 + e.phase) * 2;
		}
	}

	/** @param {number} step @param {number} dt */
	function updateFireballs(step, dt) {
		for (let i = state.fireballs.length - 1; i >= 0; i--) {
			const fb = state.fireballs[i];
			fb.x += fb.vx * step;
			fb.life -= dt;
			spawnFireParticles(fb);

			const r = fb.radius;
			const fbRect = { x: fb.x - r, y: fb.y - r, w: r * 2, h: r * 2 };

			let hit = false;

			// Hit enemies (generous hitbox)
			for (let j = state.enemies.length - 1; j >= 0; j--) {
				const e = state.enemies[j];
				const box = { x: e.x - 17, y: e.y - 12, w: e.w + 34, h: e.h + 24 };
				if (rectsOverlap(fbRect, box)) {
					e.hp -= 1;
					spawnEnemyParticles(e, 12, 4, 0.45);
					hit = true;
					if (e.hp <= 0) {
						spawnEnemyParticles(e, 35, 7, 0.8);
						state.enemies.splice(j, 1);
					}
					break;
				}
			}

			// Hit non-ground platforms
			if (!hit) {
				for (const plat of level.platforms) {
					if (plat.y >= 440 && plat.w >= LEVEL_WIDTH) continue; // skip the ground
					if (rectsOverlap(fbRect, plat)) {
						hit = true;
						break;
					}
				}
			}

			if (fb.x < -100 || fb.x > LEVEL_WIDTH + 100 || fb.life <= 0 || hit) {
				state.fireballs.splice(i, 1);
			}
		}
	}

	// -------------------------
	// Update
	// -------------------------
	/** @param {number} dt */
	function update(dt) {
		const step = dt * 60;
		state.animTime += dt;

		if (state.won) {
			state.winTimer -= dt;
			if (state.winTimer <= 0) restart();
			return;
		}

		const p = state.player;

		// Horizontal input + acceleration
		let dir = 0;
		if (keys.has('left')) {
			dir = -1;
			state.facingRight = false;
		}
		if (keys.has('right')) {
			dir = 1;
			state.facingRight = true;
		}

		if (dir !== 0) {
			const accel = state.onGround ? GROUND_ACCEL : AIR_ACCEL;
			p.vx += dir * accel * step;
			p.vx = Math.max(-MAX_SPEED, Math.min(MAX_SPEED, p.vx));
		} else {
			p.vx *= Math.pow(FRICTION, step);
			if (Math.abs(p.vx) < 0.05) p.vx = 0;
		}

		// Coyote time + jump
		if (state.onGround) {
			state.coyoteTimer = COYOTE_TIME;
		} else {
			state.coyoteTimer -= dt;
		}

		if (keys.has('jump') && state.coyoteTimer > 0) {
			p.vy = JUMP_POWER;
			state.onGround = false;
			state.coyoteTimer = 0;
			keys.delete('jump'); // consume edge — re-pressed on next keydown
		}

		// Gravity
		p.vy += GRAVITY * step;
		p.vy = Math.min(p.vy, MAX_FALL_SPEED);

		// Fireball charging — hold for a bigger fireball, auto-repeat while held
		if (state.spaceHolding) {
			state.spaceHoldTime += dt;
			state.fireRepeatTimer -= dt;
			if (state.spaceHoldTime > 0.25 && state.fireRepeatTimer <= 0) {
				shootFireball(Math.min(30, 10 + state.spaceHoldTime * 16));
				state.fireRepeatTimer = 0.35;
			}
		}

		// Horizontal movement + collision
		p.x += p.vx * step;
		for (const plat of level.platforms) {
			if (rectsOverlap(p, plat)) {
				if (p.vx > 0) p.x = plat.x - p.w;
				else if (p.vx < 0) p.x = plat.x + plat.w;
				p.vx = 0;
			}
		}

		// Vertical movement + collision
		p.y += p.vy * step;
		state.onGround = false;
		for (const plat of level.platforms) {
			if (rectsOverlap(p, plat)) {
				if (p.vy > 0) {
					p.y = plat.y - p.h;
					p.vy = 0;
					state.onGround = true;
				} else if (p.vy < 0) {
					p.y = plat.y + plat.h;
					p.vy = 0;
				}
			}
		}

		// World bounds
		if (p.x < 0) p.x = 0;
		if (p.x + p.w > LEVEL_WIDTH) p.x = LEVEL_WIDTH - p.w;

		// Entity updates
		updateFireballs(step, dt);
		updateParticles(dt, step);
		updateEnemies(step, state.animTime);

		// Coins
		for (let i = state.coins.length - 1; i >= 0; i--) {
			if (rectsOverlap(p, state.coins[i])) {
				state.coins.splice(i, 1);
				state.score += 1;
			}
		}

		// Checkpoints — touching one saves the respawn point
		for (let i = 0; i < level.checkpoints.length; i++) {
			if (rectsOverlap(p, level.checkpoints[i])) {
				state.activatedCheckpoints.add(i);
				state.checkpointX = level.checkpoints[i].x;
				state.checkpointY = 390;
			}
		}

		// Hazard + enemy contact damage → respawn
		let died = false;
		for (const s of level.spikes) {
			if (rectsOverlap(p, inflate(s, -14, -8))) {
				died = true;
				break;
			}
		}
		if (!died) {
			for (const lava of level.lavaPools) {
				if (rectsOverlap(p, inflate(lava, -20, -4))) {
					died = true;
					break;
				}
			}
		}
		if (!died) {
			for (const e of state.enemies) {
				if (rectsOverlap(p, inflate({ x: e.x, y: e.y, w: e.w, h: e.h }, -8, -8))) {
					died = true;
					break;
				}
			}
		}
		if (died) resetPlayer();

		// Fell off the bottom
		if (p.y > HEIGHT) resetPlayer();

		// Reach the portal → win
		if (rectsOverlap(p, level.portal)) {
			state.won = true;
			state.winTimer = 2.2;
		}

		// Camera follow
		let targetCam = p.x + p.w / 2 - WIDTH / 2;
		targetCam = Math.max(0, Math.min(LEVEL_WIDTH - WIDTH, targetCam));
		state.cameraX += (targetCam - state.cameraX) * Math.min(1, CAMERA_SMOOTHNESS * step);
		state.cameraX = Math.max(0, Math.min(LEVEL_WIDTH - WIDTH, state.cameraX));
	}

	// -------------------------
	// Drawing helpers
	// -------------------------
	const cam = () => Math.round(state.cameraX);

	/** @param {number} t */
	function drawBackground(t) {
		ctx.fillStyle = SKY;
		ctx.fillRect(0, 0, WIDTH, HEIGHT);

		// Sun
		fillCircle(760, 80, 42, 'rgba(255,240,140,1)');
		fillCircle(760, 80, 28, 'rgba(255,250,190,1)');

		// Clouds (slow parallax drift)
		const cloudShift = mod(state.cameraX * 0.12 - t * 15, 400);
		for (let baseX = -400 - cloudShift; baseX < WIDTH + 500; baseX += 400) {
			const cy = 80 + Math.sin(t + baseX * 0.01) * 6;
			fillCircle(baseX + 60, cy, 22, WHITE);
			fillCircle(baseX + 85, cy - 10, 28, WHITE);
			fillCircle(baseX + 115, cy, 22, WHITE);
			fillEllipse(baseX + 45, cy, 95, 25, WHITE);
		}

		// Far hills
		const farShift = mod(state.cameraX * 0.25, 320);
		for (let baseX = -320 - farShift; baseX < WIDTH + 400; baseX += 320) {
			fillTriangle(baseX, 450, baseX + 160, 260, baseX + 320, 450, '#5ab478');
		}

		// Near hills
		const nearShift = mod(state.cameraX * 0.45, 420);
		for (let baseX = -420 - nearShift; baseX < WIDTH + 500; baseX += 420) {
			fillTriangle(baseX, 450, baseX + 210, 310, baseX + 420, 450, '#37965a');
		}
	}

	function drawPlatforms() {
		const c = cam();
		for (const plat of level.platforms) {
			ctx.fillStyle = BROWN;
			ctx.fillRect(plat.x - c, plat.y, plat.w, plat.h);
			ctx.fillStyle = GREEN;
			ctx.fillRect(plat.x - c, plat.y, plat.w, 5);
		}
	}

	/** @param {number} t */
	function drawPortal(t) {
		const pr = level.portal;
		const c = cam();
		const cx = pr.x - c + pr.w / 2;
		const cy = pr.y + pr.h / 2;

		const col1 = rgb(120 + Math.sin(t * 3) * 80, 80 + Math.sin(t * 4 + 2) * 80, 220 + Math.sin(t * 5) * 35);
		const col2 = rgb(80 + Math.sin(t * 5 + 1) * 80, 220 + Math.sin(t * 3 + 3) * 35, 180 + Math.sin(t * 4) * 70);
		const col3 = rgb(220 + Math.sin(t * 4) * 35, 120 + Math.sin(t * 5 + 2) * 80, 80 + Math.sin(t * 3 + 1) * 80);
		const ring = [col1, col2, col3];

		glow(cx, cy, 75, col1, 0.24);
		glow(cx, cy, 55, col2, 0.32);
		glow(cx, cy, 35, col3, 0.4);

		for (let i = 0; i < 5; i++) {
			ctx.strokeStyle = ring[i % 3];
			ctx.lineWidth = 3;
			ctx.beginPath();
			ctx.ellipse(cx, cy, 32 + i * 5, 45 + i * 4, 0, 0, Math.PI * 2);
			ctx.stroke();
		}

		// Swirling arms
		for (let arm = 0; arm < 3; arm++) {
			ctx.strokeStyle = ring[arm];
			ctx.lineWidth = 3;
			ctx.beginPath();
			for (let i = 0; i < 40; i++) {
				const angle = t * 4 + arm * 2.1 + i * 0.25;
				const radius = i * 1.1;
				const x = cx + Math.cos(angle) * radius;
				const y = cy + Math.sin(angle) * radius * 1.35;
				if (i === 0) ctx.moveTo(x, y);
				else ctx.lineTo(x, y);
			}
			ctx.stroke();
		}

		fillEllipse(cx - 10, cy - 18, 20, 36, WHITE);

		// Base
		ctx.fillStyle = '#464655';
		ctx.fillRect(pr.x - c - 8, pr.y + pr.h - 8, pr.w + 16, 10);
		ctx.fillStyle = '#787891';
		ctx.fillRect(pr.x - c, pr.y + pr.h - 16, pr.w, 8);
	}

	// Dragon — drawn into an offscreen buffer so we can flip it horizontally.
	const dragonBuf = document.createElement('canvas');
	dragonBuf.width = 190;
	dragonBuf.height = 110;
	const dctx = /** @type {CanvasRenderingContext2D} */ (dragonBuf.getContext('2d'));

	/** @param {number} t */
	function drawDragon(t) {
		const p = state.player;
		dctx.clearRect(0, 0, 190, 110);
		const x = 70;
		const y = 48;
		const flap = Math.sin(t * 8) * 3;

		// Tail
		const tail = [
			[x + 8, y + 24],
			[x - 10, y + 30],
			[x - 28, y + 22],
			[x - 42, y + 10],
			[x - 35, y - 2],
			[x - 18, y - 5]
		];
		dctx.strokeStyle = DARK_RED;
		dctx.lineWidth = 14;
		dctx.lineJoin = 'round';
		dctx.lineCap = 'round';
		dctx.beginPath();
		dctx.moveTo(tail[0][0], tail[0][1]);
		for (let i = 1; i < tail.length; i++) dctx.lineTo(tail[i][0], tail[i][1]);
		dctx.stroke();
		const tailSizes = [10, 9, 8, 7, 6, 5];
		tail.forEach((pt, i) => bufCircle(pt[0], pt[1], tailSizes[i], DARK_RED));

		const tailScaleCols = [CYAN, PURPLE, YELLOW, LIME, BLUE];
		tail.slice(1).forEach((pt, i) => {
			const [sx, sy] = pt;
			bufTriangle(sx - 4, sy - 7, sx + 2, sy - 18, sx + 8, sy - 7, tailScaleCols[i % tailScaleCols.length]);
		});
		const tip = tail[tail.length - 1];
		bufTriangle(tip[0] - 5, tip[1], tip[0] - 22, tip[1] - 5, tip[0] - 5, tip[1] + 7, VENOM_GREEN);

		// Wing
		bufPoly(
			[
				[x + 12, y + 8],
				[x + 28, y - 25 + flap],
				[x + 56, y + 12],
				[x + 45, y + 28],
				[x + 32, y + 16],
				[x + 20, y + 28]
			],
			WING_RED
		);
		bufPoly(
			[
				[x + 18, y + 10],
				[x + 29, y - 12 + flap],
				[x + 42, y + 14],
				[x + 35, y + 22],
				[x + 26, y + 14]
			],
			WING_ORANGE
		);

		// Body
		bufEllipse(x + 5 + 25, y + 10 + 14, 25, 14, DRAGON_RED);
		[ORANGE, YELLOW, ORANGE].forEach((col, i) => bufEllipse(x + 17 + i * 10 + 6, y + 22 + 4.5, 6, 4.5, col));

		// Head / snout
		bufEllipse(x + 45 + 12.5, y + 8 + 11.5, 12.5, 11.5, DRAGON_RED);
		bufCircle(x + 70, y + 17, 15, DRAGON_RED);
		bufPoly(
			[
				[x + 78, y + 9],
				[x + 112, y + 14],
				[x + 114, y + 23],
				[x + 78, y + 27]
			],
			DRAGON_RED
		);
		bufPoly(
			[
				[x + 80, y + 23],
				[x + 112, y + 23],
				[x + 105, y + 31],
				[x + 82, y + 29]
			],
			DARK_RED
		);
		bufCircle(x + 105, y + 17, 2, '#000');

		// Horns
		bufTriangle(x + 62, y + 7, x + 55, y - 12, x + 70, y + 4, WHITE);
		bufTriangle(x + 75, y + 6, x + 82, y - 12, x + 85, y + 8, WHITE);

		// Eye
		bufCircle(x + 75, y + 14, 5, YELLOW);
		bufCircle(x + 77, y + 14, 2, '#000');

		// Fangs + venom drip
		bufTriangle(x + 91, y + 24, x + 96, y + 24, x + 93, y + 37, WHITE);
		bufTriangle(x + 104, y + 24, x + 109, y + 24, x + 106, y + 35, WHITE);
		const drip = Math.sin(t * 5) * 2;
		dctx.strokeStyle = VENOM_GREEN;
		dctx.lineWidth = 3;
		dctx.beginPath();
		dctx.moveTo(x + 93, y + 35);
		dctx.lineTo(x + 93, y + 45 + drip);
		dctx.stroke();
		bufCircle(x + 93, y + 47 + drip, 4, VENOM_GREEN);

		// Legs / claws
		dctx.fillStyle = DARK_RED;
		dctx.fillRect(x + 18, y + 34, 8, 14);
		dctx.fillRect(x + 40, y + 34, 8, 14);
		bufTriangle(x + 16, y + 48, x + 31, y + 48, x + 26, y + 53, '#000');
		bufTriangle(x + 38, y + 48, x + 53, y + 48, x + 48, y + 53, '#000');

		// Back scales
		const scaleCols = [YELLOW, CYAN, PURPLE, BLUE, LIME, ORANGE];
		const scalePos = [
			[x + 13, y + 13],
			[x + 23, y + 9],
			[x + 33, y + 9],
			[x + 44, y + 11],
			[x + 58, y + 5],
			[x + 70, y + 3],
			[x + 83, y + 7]
		];
		scalePos.forEach(([sx, sy], i) => bufTriangle(sx, sy, sx + 5, sy - 11, sx + 10, sy, scaleCols[i % scaleCols.length]));

		// Blit to screen (flip if facing left)
		const dx = Math.round(p.x - state.cameraX - 70);
		const dy = p.y - 50;
		if (state.facingRight) {
			ctx.drawImage(dragonBuf, dx, dy);
		} else {
			ctx.save();
			ctx.translate(dx + 190, dy);
			ctx.scale(-1, 1);
			ctx.drawImage(dragonBuf, 0, 0);
			ctx.restore();
		}
	}

	/** @param {Box} s */
	function drawSpikes(s) {
		const c = cam();
		const x = s.x - c;
		const count = Math.max(1, Math.floor(s.w / 18));
		const sw = s.w / count;
		for (let i = 0; i < count; i++) {
			const left = x + i * sw;
			const right = x + (i + 1) * sw;
			const mid = (left + right) / 2;
			fillTriangle(left, s.y + s.h, mid, s.y, right, s.y + s.h, SPIKE_GRAY);
			ctx.strokeStyle = SPIKE_DARK;
			ctx.lineWidth = 2;
			ctx.beginPath();
			ctx.moveTo(mid, s.y);
			ctx.lineTo(left, s.y + s.h);
			ctx.stroke();
		}
	}

	/** @param {Box} lava @param {number} t */
	function drawLava(lava, t) {
		const c = cam();
		const x = lava.x - c;
		ctx.fillStyle = LAVA_RED;
		ctx.fillRect(x, lava.y, lava.w, lava.h);
		ctx.fillStyle = LAVA_ORANGE;
		ctx.fillRect(x, lava.y, lava.w, 8);
		ctx.strokeStyle = LAVA_YELLOW;
		ctx.lineWidth = 3;
		ctx.beginPath();
		for (let px = x; px <= x + lava.w + 10; px += 10) {
			const wy = lava.y + 6 + Math.sin(t * 5 + px * 0.05) * 3;
			if (px === x) ctx.moveTo(px, wy);
			else ctx.lineTo(px, wy);
		}
		ctx.stroke();
	}

	/** @param {number} t */
	function drawCheckpoints(t) {
		const c = cam();
		level.checkpoints.forEach((cp, i) => {
			const x = cp.x - c;
			const poleX = x + 12;
			const poleTop = cp.y - 10;
			const poleBottom = cp.y + cp.h;
			const active = state.activatedCheckpoints.has(i);

			let flagColor = CHECKPOINT_BLUE;
			if (active) {
				const pulse = Math.sin(t * 4 + i) * 0.5 + 0.5;
				flagColor = rgb(80 + pulse * 120, 180 + pulse * 75, 120 + pulse * 120);
				glow(poleX + 22, poleTop + 22, 38 + Math.sin(t * 5 + i) * 4, flagColor, 0.28);
			}

			// Stone base
			ctx.fillStyle = '#50505a';
			ctx.fillRect(x + 2, cp.y + cp.h - 8, 36, 8);
			ctx.fillStyle = '#787882';
			ctx.fillRect(x + 6, cp.y + cp.h - 14, 28, 6);
			// Pole
			ctx.fillStyle = '#b4b4be';
			ctx.fillRect(poleX, poleTop, 5, poleBottom - poleTop);
			// Crystal top
			const crystal = active ? LIME : CHECKPOINT_BLUE;
			fillTriangle(poleX + 2, poleTop - 14, poleX - 7, poleTop - 2, poleX + 2, poleTop + 8, crystal);
			fillTriangle(poleX + 2, poleTop + 8, poleX + 11, poleTop - 2, poleX + 2, poleTop - 14, crystal);
			// Waving flag
			const w1 = Math.sin(t * 6 + i) * 5;
			const w2 = Math.sin(t * 6 + i + 1.5) * 5;
			ctx.fillStyle = flagColor;
			ctx.beginPath();
			ctx.moveTo(poleX + 5, poleTop + 8);
			ctx.lineTo(poleX + 62, poleTop + 14 + w1);
			ctx.lineTo(poleX + 48, poleTop + 28 + w2);
			ctx.lineTo(poleX + 62, poleTop + 42 + w1);
			ctx.lineTo(poleX + 5, poleTop + 36);
			ctx.closePath();
			ctx.fill();
		});
	}

	/** @param {Enemy} e @param {number} t */
	function drawEnemy(e, t) {
		const c = cam();
		const sx = e.x - c;
		const sy = e.y;
		const w = e.w;
		const cxv = sx + w / 2;
		const cyv = sy + e.h / 2;
		const pulse = Math.sin(t * 7 + e.phase) * 5;
		const flap = Math.sin(t * 11 + e.phase) * 10;

		const head = { x: cxv, y: sy + 12 };
		const torsoTop = sy + 28;
		const torsoBottom = sy + 52;

		glow(cxv, cyv, 70 + pulse, CORRUPT_PURPLE, 0.18);
		glow(cxv, cyv, 48 + pulse, LIGHTNING_PURPLE, 0.28);

		// Wings (shadow + membrane)
		fillPoly(
			[
				[cxv - 12, sy + 30],
				[cxv - 82, sy + 2 + flap],
				[cxv - 62, sy + 38],
				[cxv - 65, sy + 78 - flap * 0.35],
				[cxv - 32, sy + 55]
			],
			DARK_SHADOW
		);
		fillPoly(
			[
				[cxv - 20, sy + 34],
				[cxv - 66, sy + 17 + flap],
				[cxv - 50, sy + 40],
				[cxv - 55, sy + 62],
				[cxv - 34, sy + 52]
			],
			WING_MEMBRANE
		);
		fillPoly(
			[
				[cxv + 12, sy + 30],
				[cxv + 82, sy + 2 + flap],
				[cxv + 62, sy + 38],
				[cxv + 65, sy + 78 - flap * 0.35],
				[cxv + 32, sy + 55]
			],
			DARK_SHADOW
		);
		fillPoly(
			[
				[cxv + 20, sy + 34],
				[cxv + 66, sy + 17 + flap],
				[cxv + 50, sy + 40],
				[cxv + 55, sy + 62],
				[cxv + 34, sy + 52]
			],
			WING_MEMBRANE
		);

		// Body
		fillPoly(
			[
				[cxv - 16, torsoTop],
				[cxv + 16, torsoTop],
				[cxv + 9, torsoBottom],
				[cxv - 9, torsoBottom]
			],
			CORRUPT_EDGE
		);
		fillCircle(cxv, sy + 39, 10, LIGHTNING_PURPLE);
		fillCircle(cxv, sy + 39, 5, ELECTRIC_BLUE);
		fillCircle(cxv, sy + 39, 2, WHITE);

		// Arms (lightning hands)
		const lh = { x: cxv - 36, y: sy + 39 + Math.sin(t * 6 + e.phase) * 5 };
		const rh = { x: cxv + 36, y: sy + 39 + Math.sin(t * 6 + e.phase + 1.5) * 5 };
		strokeLine(cxv - 16, torsoTop, lh.x, lh.y, CORRUPT_DARK_PURPLE, 7);
		strokeLine(cxv + 16, torsoTop, rh.x, rh.y, CORRUPT_DARK_PURPLE, 7);
		fillCircle(lh.x, lh.y, 6, LIGHTNING_PURPLE);
		fillCircle(rh.x, rh.y, 6, LIGHTNING_PURPLE);

		// Legs
		strokeLine(cxv - 9, torsoBottom, cxv - 28, sy + 72, CORRUPT_DARK_PURPLE, 7);
		strokeLine(cxv + 9, torsoBottom, cxv + 27, sy + 72, CORRUPT_DARK_PURPLE, 7);

		// Head
		fillCircle(head.x, head.y, 16, CORRUPT_EDGE);
		fillCircle(head.x, head.y, 10, CORRUPT_PURPLE);
		fillPoly(
			[
				[head.x - 16, head.y - 3],
				[head.x - 10, head.y - 22],
				[head.x, head.y - 26],
				[head.x + 10, head.y - 22],
				[head.x + 16, head.y - 3]
			],
			CORRUPT_EDGE
		);
		fillCircle(head.x - 5, head.y - 2, 3, WHITE);
		fillCircle(head.x + 5, head.y - 2, 3, WHITE);

		// Lightning aura
		ctx.strokeStyle = LIGHTNING_PURPLE;
		ctx.lineWidth = 2;
		for (let i = 0; i < 8; i++) {
			const a = t * 5 + e.phase + i * 0.8;
			ctx.beginPath();
			ctx.moveTo(cxv + Math.cos(a) * 20, cyv + Math.sin(a) * 28);
			ctx.lineTo(cxv + Math.cos(a + 0.85) * 62, cyv + Math.sin(a + 0.85) * 60);
			ctx.stroke();
		}

		// HP bar
		const bw = 42;
		const bx = cxv - bw / 2;
		const by = sy - 18;
		ctx.fillStyle = '#000';
		ctx.fillRect(bx - 1, by - 1, bw + 2, 8);
		ctx.fillStyle = CORRUPT_DARK_PURPLE;
		ctx.fillRect(bx, by, bw, 6);
		ctx.fillStyle = LIGHTNING_PURPLE;
		ctx.fillRect(bx, by, (e.hp / e.maxHp) * bw, 6);
	}

	function drawCoins() {
		const c = cam();
		for (const coin of state.coins) {
			fillEllipse(coin.x - c, coin.y, coin.w, coin.h, YELLOW);
			fillCircle(coin.x - c + coin.w / 2, coin.y + coin.h / 2, 4, WHITE);
		}
	}

	/** @param {any} fb */
	function drawFireball(fb) {
		const x = fb.x - state.cameraX;
		const y = fb.y;
		const r = fb.radius;
		const flicker = Math.sin(state.animTime * 25 + fb.wobble) * 0.12 + rand(-0.08, 0.08);
		const outer = Math.max(2, r * (1.25 + flicker));
		const middle = Math.max(2, r * (0.85 + flicker));
		const core = Math.max(2, r * (0.45 + flicker));
		glow(x, y, outer * 2.2, RED_ORANGE, 0.18);
		glow(x, y, outer * 1.6, ORANGE, 0.26);
		glow(x, y, outer, YELLOW, 0.35);
		fillCircle(x, y, outer, RED_ORANGE);
		fillCircle(x, y, middle, ORANGE);
		fillCircle(x, y, core, YELLOW);
		if (r > 14) fillCircle(x, y, Math.max(2, r * 0.2), WHITE);
	}

	function drawParticles() {
		for (const pt of state.particles) {
			const life = Math.max(0, Math.min(1, pt.life / pt.maxLife));
			if (pt.radius <= 0) continue;
			const alpha = pt.type === 'smoke' ? 0.35 * life : 0.86 * life;
			ctx.fillStyle = withAlpha(toRgb(pt.color), alpha);
			ctx.beginPath();
			ctx.arc(pt.x - state.cameraX, pt.y, pt.radius, 0, Math.PI * 2);
			ctx.fill();
		}
	}

	function drawChargeGlow() {
		const m = mouthPosition();
		const x = m.x - state.cameraX;
		const r = Math.min(24, 5 + state.spaceHoldTime * 14);
		glow(x, m.y, r * 2, RED_ORANGE, 0.2);
		glow(x, m.y, r, ORANGE, 0.35);
		fillCircle(x, m.y, r, ORANGE);
		fillCircle(x, m.y, Math.max(2, r / 2), YELLOW);
		if (r > 14) fillCircle(x, m.y, Math.max(2, r / 5), WHITE);
	}

	function drawHUD() {
		ctx.fillStyle = '#000';
		ctx.font = '20px sans-serif';
		ctx.textBaseline = 'top';
		ctx.textAlign = 'left';
		ctx.fillText(`Coins: ${state.score}`, 20, 20);
		ctx.fillText('Arrows / A·D move   Space·W·↑ jump   Hold Space: fire', 20, 48);
		if (state.coins.length === 0) {
			ctx.fillText('All coins collected!', 20, 76);
		}

		if (state.won) {
			ctx.fillStyle = 'rgba(0,0,0,0.55)';
			ctx.fillRect(0, 0, WIDTH, HEIGHT);
			ctx.textAlign = 'center';
			ctx.fillStyle = WHITE;
			ctx.font = 'bold 64px sans-serif';
			ctx.fillText('YOU WIN!', WIDTH / 2, 180);
			ctx.fillStyle = '#f5dcff';
			ctx.font = '28px sans-serif';
			ctx.fillText('The dragon escaped through the portal!', WIDTH / 2, 260);
			ctx.fillStyle = WHITE;
			ctx.fillText('Restarting…', WIDTH / 2, 300);
			ctx.textAlign = 'left';
		}
	}

	function draw() {
		const t = state.animTime;
		drawBackground(t);
		drawPlatforms();
		for (const lava of level.lavaPools) drawLava(lava, t);
		for (const s of level.spikes) drawSpikes(s);
		drawCheckpoints(t);
		for (const e of state.enemies) drawEnemy(e, t);
		drawPortal(t);
		drawCoins();
		drawParticles();
		for (const fb of state.fireballs) drawFireball(fb);
		drawDragon(t);
		if (state.spaceHolding && !state.won) drawChargeGlow();
		drawHUD();
	}

	// -------------------------
	// Low-level canvas primitives
	// -------------------------
	/** @param {number} x @param {number} y @param {number} r @param {string} color */
	function fillCircle(x, y, r, color) {
		ctx.fillStyle = color;
		ctx.beginPath();
		ctx.arc(x, y, r, 0, Math.PI * 2);
		ctx.fill();
	}
	/** @param {number} x @param {number} y @param {number} w @param {number} h @param {string} color */
	function fillEllipse(x, y, w, h, color) {
		ctx.fillStyle = color;
		ctx.beginPath();
		ctx.ellipse(x + w / 2, y + h / 2, w / 2, h / 2, 0, 0, Math.PI * 2);
		ctx.fill();
	}
	/** @param {number} x1 @param {number} y1 @param {number} x2 @param {number} y2 @param {number} x3 @param {number} y3 @param {string} color */
	function fillTriangle(x1, y1, x2, y2, x3, y3, color) {
		ctx.fillStyle = color;
		ctx.beginPath();
		ctx.moveTo(x1, y1);
		ctx.lineTo(x2, y2);
		ctx.lineTo(x3, y3);
		ctx.closePath();
		ctx.fill();
	}
	/** @param {number} x @param {number} y @param {number} r @param {string} color @param {number} alpha */
	function glow(x, y, r, color, alpha) {
		if (r <= 0) return;
		const g = ctx.createRadialGradient(x, y, 0, x, y, r);
		g.addColorStop(0, withAlpha(toRgb(color), alpha));
		g.addColorStop(1, withAlpha(toRgb(color), 0));
		ctx.fillStyle = g;
		ctx.beginPath();
		ctx.arc(x, y, r, 0, Math.PI * 2);
		ctx.fill();
	}
	/** @param {number[][]} points @param {string} color */
	function fillPoly(points, color) {
		ctx.fillStyle = color;
		ctx.beginPath();
		ctx.moveTo(points[0][0], points[0][1]);
		for (let i = 1; i < points.length; i++) ctx.lineTo(points[i][0], points[i][1]);
		ctx.closePath();
		ctx.fill();
	}
	/** @param {number} x1 @param {number} y1 @param {number} x2 @param {number} y2 @param {string} color @param {number} width */
	function strokeLine(x1, y1, x2, y2, color, width) {
		ctx.strokeStyle = color;
		ctx.lineWidth = width;
		ctx.lineCap = 'round';
		ctx.beginPath();
		ctx.moveTo(x1, y1);
		ctx.lineTo(x2, y2);
		ctx.stroke();
	}

	// Offscreen dragon-buffer primitives
	/** @param {number} x @param {number} y @param {number} r @param {string} color */
	function bufCircle(x, y, r, color) {
		dctx.fillStyle = color;
		dctx.beginPath();
		dctx.arc(x, y, r, 0, Math.PI * 2);
		dctx.fill();
	}
	/** @param {number} cx @param {number} cy @param {number} rx @param {number} ry @param {string} color */
	function bufEllipse(cx, cy, rx, ry, color) {
		dctx.fillStyle = color;
		dctx.beginPath();
		dctx.ellipse(cx, cy, rx, ry, 0, 0, Math.PI * 2);
		dctx.fill();
	}
	/** @param {number} x1 @param {number} y1 @param {number} x2 @param {number} y2 @param {number} x3 @param {number} y3 @param {string} color */
	function bufTriangle(x1, y1, x2, y2, x3, y3, color) {
		dctx.fillStyle = color;
		dctx.beginPath();
		dctx.moveTo(x1, y1);
		dctx.lineTo(x2, y2);
		dctx.lineTo(x3, y3);
		dctx.closePath();
		dctx.fill();
	}
	/** @param {number[][]} points @param {string} color */
	function bufPoly(points, color) {
		dctx.fillStyle = color;
		dctx.beginPath();
		dctx.moveTo(points[0][0], points[0][1]);
		for (let i = 1; i < points.length; i++) dctx.lineTo(points[i][0], points[i][1]);
		dctx.closePath();
		dctx.fill();
	}

	// -------------------------
	// Input
	// -------------------------
	/** @param {KeyboardEvent} e */
	function keyToAction(e) {
		switch (e.key) {
			case 'ArrowLeft':
			case 'a':
			case 'A':
				return 'left';
			case 'ArrowRight':
			case 'd':
			case 'D':
				return 'right';
			case 'ArrowUp':
			case 'w':
			case 'W':
				return 'jump';
			case ' ':
				return 'fire';
			default:
				return null;
		}
	}

	/** @param {KeyboardEvent} e */
	function onKeyDown(e) {
		const action = keyToAction(e);
		if (!action) return;
		e.preventDefault();
		if (e.repeat) return; // browsers auto-repeat keydown — ignore for edge logic

		if (action === 'fire') {
			// Tap fires a small fireball immediately; holding charges bigger ones.
			if (!state.won && !state.spaceHolding) {
				state.spaceHolding = true;
				state.spaceHoldTime = 0;
				state.fireRepeatTimer = 0.35;
				shootFireball(8);
			}
			return;
		}
		keys.add(action);
	}
	/** @param {KeyboardEvent} e */
	function onKeyUp(e) {
		const action = keyToAction(e);
		if (!action) return;
		e.preventDefault();
		if (action === 'fire') {
			state.spaceHolding = false;
			state.spaceHoldTime = 0;
			state.fireRepeatTimer = 0;
			return;
		}
		keys.delete(action);
	}

	// -------------------------
	// Loop lifecycle
	// -------------------------
	/** @param {number} now */
	function frame(now) {
		if (!state.running) return;
		const dt = Math.min(0.05, (now - state.lastTime) / 1000 || 0);
		state.lastTime = now;
		update(dt);
		draw();
		state.raf = requestAnimationFrame(frame);
	}

	function start() {
		if (state.running) return;
		state.running = true;
		state.lastTime = performance.now();
		window.addEventListener('keydown', onKeyDown);
		window.addEventListener('keyup', onKeyUp);
		state.raf = requestAnimationFrame(frame);
	}

	function stop() {
		state.running = false;
		cancelAnimationFrame(state.raf);
		window.removeEventListener('keydown', onKeyDown);
		window.removeEventListener('keyup', onKeyUp);
	}

	return { start, stop, restart };
}

// -------------------------
// Module-level helpers
// -------------------------
/** @param {number} n @param {number} m */
function mod(n, m) {
	return ((n % m) + m) % m;
}
/** @param {number} r @param {number} g @param {number} b */
function rgb(r, g, b) {
	/** @param {number} v */
	const clamp = (v) => Math.max(0, Math.min(255, Math.round(v)));
	return `rgb(${clamp(r)},${clamp(g)},${clamp(b)})`;
}
/** @param {string} rgbStr @param {number} alpha */
function withAlpha(rgbStr, alpha) {
	// rgbStr is "rgb(r,g,b)"
	const nums = rgbStr.match(/\d+/g);
	if (!nums || nums.length < 3) return rgbStr;
	return `rgba(${nums[0]},${nums[1]},${nums[2]},${alpha})`;
}
/**
 * Normalize a color to "rgb(r,g,b)" so withAlpha can splice in an alpha.
 * Accepts hex (#rgb / #rrggbb) or an existing rgb()/rgba() string.
 * @param {string} color
 */
function toRgb(color) {
	if (color[0] === '#') {
		let hex = color.slice(1);
		if (hex.length === 3) hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2];
		const n = parseInt(hex, 16);
		return `rgb(${(n >> 16) & 255},${(n >> 8) & 255},${n & 255})`;
	}
	return color;
}
/**
 * Grow (or shrink, with negatives) a box around its center.
 * @param {Box} b @param {number} dw @param {number} dh
 * @returns {Box}
 */
function inflate(b, dw, dh) {
	return { x: b.x - dw / 2, y: b.y - dh / 2, w: b.w + dw, h: b.h + dh };
}
/** @param {number} lo @param {number} hi */
function rand(lo, hi) {
	return lo + Math.random() * (hi - lo);
}
/** @param {string[]} arr */
function pick(arr) {
	return arr[Math.floor(Math.random() * arr.length)];
}
