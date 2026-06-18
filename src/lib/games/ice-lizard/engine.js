// Blue Ice Lizard vs Glacier Monsters - JavaScript/Canvas port
// Original Python/Pygame game converted for web

// -----------------------------
// Settings
// -----------------------------
const WIDTH = 960;
const HEIGHT = 640;
const TILE = 32;
const FPS = 60;

const LEVEL_W = 165;
const LEVEL_H = 45;

const GRAVITY = 0.7;
const MAX_FALL = 18;

const SHARD_TARGET_RADIUS = 340;
const FREEZE_TIME = FPS * 7;

const POISON_SLOW_TIME = FPS * 10;
const BURN_TIME = FPS * 10;

const TOTAL_ENEMIES = 50;
const SPAWN_BATCH_SIZE = 5;
const SPAWN_INTERVAL_FRAMES = FPS * 15;
const ACTIVE_ATTACKER_LIMIT = 2;

const AUTO_TARGET_HOLD_FRAMES = 12;
const TAIL_LASH_FRAMES = FPS * 5;

const MAX_LEVELS = 5;

const NON_FLYING_ENEMY_KINDS = new Set([
	'crystal_basilisk',
	'venom_drake',
	'ash_wyvern'
]);

// -----------------------------
// Helper functions
// -----------------------------
function clamp(v, lo, hi) {
	return Math.max(lo, Math.min(hi, v));
}

function sign(v) {
	if (v < 0) return -1;
	if (v > 0) return 1;
	return 0;
}

function dist(a, b) {
	return Math.hypot(a[0] - b[0], a[1] - b[1]);
}

function noise(x, y) {
	return (x * 928371 + y * 12377) & 255;
}

function levelEnemyGoal(levelNumber) {
	return Math.min(TOTAL_ENEMIES + (levelNumber - 1) * 5, 75);
}

function levelTitle(levelNumber) {
	const names = {
		1: 'Frozen Pass',
		2: 'Crystal Caverns',
		3: 'Poison Glacier',
		4: 'Ember Icefields',
		5: 'Storm Peak'
	};
	return names[levelNumber] || `Level ${levelNumber}`;
}

// Simple seeded random
class SeededRandom {
	constructor(seed) {
		this.seed = seed;
	}
	random() {
		this.seed = (this.seed * 9301 + 49297) % 233280;
		return this.seed / 233280;
	}
	randint(lo, hi) {
		return Math.floor(this.random() * (hi - lo + 1)) + lo;
	}
	choice(arr) {
		return arr[Math.floor(this.random() * arr.length)];
	}
	shuffle(arr) {
		for (let i = arr.length - 1; i > 0; i--) {
			const j = Math.floor(this.random() * (i + 1));
			[arr[i], arr[j]] = [arr[j], arr[i]];
		}
	}
	uniform(lo, hi) {
		return lo + this.random() * (hi - lo);
	}
}

// Simple rect class
class Rect {
	constructor(x, y, w, h) {
		this.x = x;
		this.y = y;
		this.width = w;
		this.height = h;
	}
	get left() { return this.x; }
	get right() { return this.x + this.width; }
	get top() { return this.y; }
	get bottom() { return this.y + this.height; }
	get centerx() { return this.x + this.width / 2; }
	get centery() { return this.y + this.height / 2; }
	get center() { return [this.centerx, this.centery]; }
	set left(v) { this.x = v; }
	set right(v) { this.x = v - this.width; }
	set top(v) { this.y = v; }
	set bottom(v) { this.y = v - this.height; }
	set centerx(v) { this.x = v - this.width / 2; }
	set centery(v) { this.y = v - this.height / 2; }
	colliderect(other) {
		return !(this.right <= other.left || this.left >= other.right ||
			this.bottom <= other.top || this.top >= other.bottom);
	}
}

// -----------------------------
// Level
// -----------------------------
class Level {
	constructor(seed, levelNumber) {
		this.levelNumber = levelNumber || 1;
		this.seed = seed ?? Math.floor(Math.random() * 9999999);
		this.rng = new SeededRandom(this.seed);

		this.grid = Array.from({ length: LEVEL_H }, () => Array(LEVEL_W).fill('.'));
		this.routeClear = new Set();
		this.safeHazards = new Set();

		this.spawn = [4 * TILE, 34 * TILE];
		this.exitRect = new Rect(0, 0, TILE, TILE);
		this.enemySpawnSpots = [];

		this.generate();
		this.enemySpawnSpots = this.findEnemySpawnSpots();
	}

	inside(tx, ty) {
		return tx >= 0 && tx < LEVEL_W && ty >= 0 && ty < LEVEL_H;
	}

	isSolid(tx, ty) {
		if (!this.inside(tx, ty)) return true;
		return this.grid[ty][tx] === '#';
	}

	placeSolid(tx, ty, force = false) {
		if (!this.inside(tx, ty)) return;
		if (!force && this.routeClear.has(`${tx},${ty}`)) return;
		if (this.grid[ty][tx] !== 'X') {
			this.grid[ty][tx] = '#';
		}
	}

	makePlatform(x, y, length, safe = false) {
		for (let xx = x; xx < x + length; xx++) {
			if (xx >= 1 && xx < LEVEL_W - 1 && y >= 2 && y < LEVEL_H - 2) {
				this.placeSolid(xx, y, safe);
				this.placeSolid(xx, y + 1, safe);
			}
		}
		if (safe) {
			for (let xx = x - 2; xx < x + length + 3; xx++) {
				for (let yy = y - 6; yy < y; yy++) {
					if (this.inside(xx, yy)) {
						this.routeClear.add(`${xx},${yy}`);
					}
				}
			}
			for (let xx = x; xx < x + length; xx++) {
				this.safeHazards.add(`${xx},${y - 1}`);
			}
		}
	}

	generate() {
		// Borders
		for (let y = 0; y < LEVEL_H; y++) {
			this.grid[y][0] = '#';
			this.grid[y][LEVEL_W - 1] = '#';
		}
		// Bottom floor
		for (let x = 0; x < LEVEL_W; x++) {
			this.grid[LEVEL_H - 1][x] = '#';
			this.grid[LEVEL_H - 2][x] = '#';
		}

		const route = [];
		const startY = 37;
		this.makePlatform(2, startY, 14, true);
		this.spawn = [4 * TILE, startY * TILE - 54];
		route.push([2, startY, 14]);

		let x = 10;
		let y = startY;
		let verticalDir = -1;
		let turnStreak = 0;

		// Main route
		while (x < LEVEL_W - 25) {
			if (y <= 10) {
				verticalDir = 1;
				turnStreak = 0;
			} else if (y >= 36) {
				verticalDir = -1;
				turnStreak = 0;
			} else if (turnStreak >= this.rng.randint(2, 4) || this.rng.random() < 0.28) {
				verticalDir *= -1;
				turnStreak = 0;
			}

			const style = this.rng.random();
			let nx, ny, length;

			if (style < 0.42) {
				nx = x + this.rng.randint(3, 5);
				ny = clamp(y + verticalDir * this.rng.choice([3, 4, 5]), 8, 37);
				length = this.rng.randint(4, 7);
			} else if (style < 0.68) {
				nx = x + this.rng.randint(4, 6);
				ny = clamp(y + this.rng.choice([-2, -1, 0, 1, 2]), 8, 37);
				length = this.rng.randint(3, 6);
			} else {
				nx = x + this.rng.randint(5, 8);
				ny = clamp(y + verticalDir * this.rng.choice([1, 2, 3]), 8, 37);
				length = this.rng.randint(7, 11);
			}

			this.makePlatform(nx, ny, length, true);
			route.push([nx, ny, length]);

			x = nx + this.rng.randint(1, 3);
			y = ny;
			turnStreak++;

			if (this.rng.random() < 0.20 && x < LEVEL_W - 28) {
				verticalDir *= -1;
				nx = x + this.rng.randint(3, 5);
				ny = clamp(y + verticalDir * this.rng.choice([3, 4]), 8, 37);
				length = this.rng.randint(4, 7);
				this.makePlatform(nx, ny, length, true);
				route.push([nx, ny, length]);
				x = nx + this.rng.randint(1, 3);
				y = ny;
				turnStreak = 1;
			}
		}

		// Exit portal
		const [ex, ey, elen] = route[route.length - 1];
		const exitTx = ex + Math.floor(elen / 2);
		const exitTy = ey - 1;
		this.grid[exitTy][exitTx] = 'X';
		this.exitRect = new Rect(exitTx * TILE, exitTy * TILE, TILE, TILE);

		// Fake branches
		const fakeBranchCount = Math.min(55 + this.levelNumber * 8, 100);
		for (let i = 0; i < fakeBranchCount; i++) {
			if (route.length < 8) break;
			const [bx, by, blen] = this.rng.choice(route.slice(3, -3));
			let fx = bx + this.rng.randint(-2, blen + 3);
			let fy = clamp(by + this.rng.choice([-7, -6, -5, 5, 6, 7]), 8, 37);
			let branchDir = this.rng.choice([-1, 1]);

			for (let j = 0; j < this.rng.randint(2, 5); j++) {
				fx += this.rng.randint(3, 7);
				fy = clamp(fy + branchDir * this.rng.choice([-3, -2, 0, 2, 3]), 8, 37);
				if (fx < 18 && fy > 30) continue;
				this.makePlatform(fx, fy, this.rng.randint(3, 8), false);
				if (this.rng.random() < 0.35) branchDir *= -1;
			}
		}

		// Extra platforms
		const extraPlatformCount = Math.min(120 + this.levelNumber * 10, 190);
		for (let i = 0; i < extraPlatformCount; i++) {
			const px = this.rng.randint(4, LEVEL_W - 14);
			const py = this.rng.randint(7, LEVEL_H - 6);
			const length = this.rng.randint(3, 13);
			for (let xx = px; xx < px + length; xx++) {
				this.placeSolid(xx, py);
				if (this.rng.random() < 0.45) this.placeSolid(xx, py + 1);
			}
		}

		// Maze walls
		const wallCount = Math.min(55 + this.levelNumber * 7, 100);
		for (let i = 0; i < wallCount; i++) {
			const wx = this.rng.randint(8, LEVEL_W - 8);
			const wy = this.rng.randint(7, LEVEL_H - 12);
			const height = this.rng.randint(3, 10);
			if (wx < 18 && wy > 28) continue;
			for (let yy = wy; yy < wy + height; yy++) {
				this.placeSolid(wx, yy);
			}
		}

		// Ceiling chunks
		const ceilingCount = Math.min(45 + this.levelNumber * 6, 90);
		for (let i = 0; i < ceilingCount; i++) {
			const cx = this.rng.randint(5, LEVEL_W - 8);
			const cy = this.rng.randint(4, LEVEL_H - 15);
			const length = this.rng.randint(2, 8);
			for (let xx = cx; xx < cx + length; xx++) {
				this.placeSolid(xx, cy);
			}
		}

		// Restore exit portal
		this.grid[exitTy][exitTx] = 'X';

		// Hazards
		const groundSpots = [];
		for (let ty = 2; ty < LEVEL_H - 2; ty++) {
			for (let tx = 2; tx < LEVEL_W - 2; tx++) {
				if (this.grid[ty][tx] === '.' && this.grid[ty + 1][tx] === '#') {
					if (!this.safeHazards.has(`${tx},${ty}`) && !(tx < 18 && ty > 30)) {
						groundSpots.push([tx, ty]);
					}
				}
			}
		}
		this.rng.shuffle(groundSpots);

		const spikeCount = Math.min(70 + this.levelNumber * 10, 130);
		for (let i = 0; i < spikeCount && i < groundSpots.length; i++) {
			const [tx, ty] = groundSpots[i];
			if (this.grid[ty][tx] === '.') {
				this.grid[ty][tx] = 'S';
			}
		}

		const lavaCount = Math.min(25 + this.levelNumber * 6, 60);
		for (let i = 0; i < lavaCount && groundSpots.length > 0; i++) {
			const [tx, ty] = this.rng.choice(groundSpots);
			const poolLen = this.rng.randint(2, 5);
			for (let xx = tx; xx < tx + poolLen; xx++) {
				if (xx >= 1 && xx < LEVEL_W - 1) {
					if (this.grid[ty][xx] === '.' && this.grid[ty + 1][xx] === '#') {
						if (!this.safeHazards.has(`${xx},${ty}`)) {
							this.grid[ty][xx] = 'L';
						}
					}
				}
			}
		}
	}

	findEnemySpawnSpots() {
		const spots = [];
		for (let ty = 5; ty < LEVEL_H - 5; ty++) {
			for (let tx = 5; tx < LEVEL_W - 5; tx++) {
				if (this.grid[ty][tx] !== '.') continue;
				const worldX = tx * TILE;
				const worldY = ty * TILE;
				if (Math.abs(worldX - this.spawn[0]) < 650 && Math.abs(worldY - this.spawn[1]) < 350) continue;

				let clear = true;
				for (let yy = ty - 2; yy <= ty + 2 && clear; yy++) {
					for (let xx = tx - 2; xx <= tx + 2 && clear; xx++) {
						if (!this.inside(xx, yy) || this.grid[yy][xx] === '#') {
							clear = false;
						}
					}
				}
				if (clear) spots.push([tx, ty]);
			}
		}
		this.rng.shuffle(spots);
		return spots;
	}

	solidRects(rect) {
		const rects = [];
		const tx1 = Math.max(0, Math.floor(rect.left / TILE) - 1);
		const tx2 = Math.min(LEVEL_W - 1, Math.floor(rect.right / TILE) + 1);
		const ty1 = Math.max(0, Math.floor(rect.top / TILE) - 1);
		const ty2 = Math.min(LEVEL_H - 1, Math.floor(rect.bottom / TILE) + 1);

		for (let ty = ty1; ty <= ty2; ty++) {
			for (let tx = tx1; tx <= tx2; tx++) {
				if (this.grid[ty][tx] === '#') {
					rects.push(new Rect(tx * TILE, ty * TILE, TILE, TILE));
				}
			}
		}
		return rects;
	}

	hazardRects(rect) {
		const rects = [];
		const tx1 = Math.max(0, Math.floor(rect.left / TILE) - 1);
		const tx2 = Math.min(LEVEL_W - 1, Math.floor(rect.right / TILE) + 1);
		const ty1 = Math.max(0, Math.floor(rect.top / TILE) - 1);
		const ty2 = Math.min(LEVEL_H - 1, Math.floor(rect.bottom / TILE) + 1);

		for (let ty = ty1; ty <= ty2; ty++) {
			for (let tx = tx1; tx <= tx2; tx++) {
				const cell = this.grid[ty][tx];
				if (cell === 'S') {
					rects.push(new Rect(tx * TILE + 5, ty * TILE + 8, TILE - 10, TILE - 8));
				} else if (cell === 'L') {
					rects.push(new Rect(tx * TILE, ty * TILE + 8, TILE, TILE - 8));
				}
			}
		}
		return rects;
	}

	drawBackground(ctx, cameraX, cameraY, t) {
		ctx.fillStyle = '#090d1c';
		ctx.fillRect(0, 0, WIDTH, HEIGHT);
		ctx.fillStyle = '#0c142a';
		ctx.fillRect(0, 0, WIDTH, HEIGHT);
		ctx.fillStyle = '#080c1a';
		ctx.fillRect(0, HEIGHT / 2, WIDTH, HEIGHT / 2);

		const offset = Math.floor(cameraX * 0.12) % WIDTH;
		for (let baseX = -WIDTH; baseX < WIDTH * 2; baseX += 220) {
			const x = baseX - offset;
			// Mountain
			ctx.fillStyle = '#162642';
			ctx.beginPath();
			ctx.moveTo(x, HEIGHT - 120);
			ctx.lineTo(x + 110, HEIGHT - 350);
			ctx.lineTo(x + 240, HEIGHT - 120);
			ctx.closePath();
			ctx.fill();
			// Snow cap
			ctx.fillStyle = '#233e5c';
			ctx.beginPath();
			ctx.moveTo(x + 110, HEIGHT - 350);
			ctx.lineTo(x + 76, HEIGHT - 280);
			ctx.lineTo(x + 130, HEIGHT - 300);
			ctx.closePath();
			ctx.fill();
		}

		// Stars
		for (let i = 0; i < 90; i++) {
			const sx = (i * 137 + Math.floor(t * 14)) % WIDTH;
			const sy = (i * 73 + Math.floor(cameraY * 0.05)) % HEIGHT;
			const b = 130 + noise(i, Math.floor(t * 10)) % 90;
			ctx.fillStyle = `rgb(${b},${b},${Math.min(255, b + 25)})`;
			ctx.beginPath();
			ctx.arc(sx, sy, 1, 0, Math.PI * 2);
			ctx.fill();
		}
	}

	drawTileIce(ctx, sx, sy, tx, ty) {
		const shade = 58 + noise(tx, ty) % 38;
		ctx.fillStyle = `rgb(${shade},${shade + 18},${shade + 38})`;
		ctx.fillRect(sx, sy, TILE, TILE);
		ctx.strokeStyle = '#182a41';
		ctx.strokeRect(sx, sy, TILE, TILE);
		ctx.strokeStyle = '#bef5ff';
		ctx.beginPath();
		ctx.moveTo(sx + 3, sy + 4);
		ctx.lineTo(sx + TILE - 4, sy + 4);
		ctx.stroke();

		if (noise(tx + 9, ty + 4) % 4 === 0) {
			ctx.strokeStyle = '#78c8eb';
			ctx.beginPath();
			ctx.moveTo(sx + 8, sy + 11);
			ctx.lineTo(sx + 18, sy + 19);
			ctx.lineTo(sx + 14, sy + 27);
			ctx.stroke();
		}
	}

	drawSpike(ctx, sx, sy) {
		ctx.fillStyle = '#d2ebf5';
		ctx.beginPath();
		ctx.moveTo(sx + TILE / 2, sy + 4);
		ctx.lineTo(sx + 5, sy + TILE - 3);
		ctx.lineTo(sx + TILE - 5, sy + TILE - 3);
		ctx.closePath();
		ctx.fill();
		ctx.strokeStyle = '#465f73';
		ctx.lineWidth = 2;
		ctx.stroke();
		ctx.lineWidth = 1;
		ctx.strokeStyle = '#faffff';
		ctx.beginPath();
		ctx.moveTo(sx + TILE / 2, sy + 7);
		ctx.lineTo(sx + TILE / 2 - 5, sy + TILE - 7);
		ctx.stroke();
	}

	drawLava(ctx, sx, sy, tx, ty, t) {
		const pulse = 70 + Math.floor(35 * Math.sin(t * 5 + tx * 0.4));

		// Glow
		const gradient = ctx.createRadialGradient(sx + TILE / 2, sy + TILE / 2, 0, sx + TILE / 2, sy + TILE / 2, TILE);
		gradient.addColorStop(0, `rgba(255,180,50,${pulse / 255})`);
		gradient.addColorStop(1, `rgba(255,75,15,0)`);
		ctx.fillStyle = gradient;
		ctx.fillRect(sx - 18, sy - 18, TILE + 36, TILE + 36);

		ctx.fillStyle = '#460e08';
		ctx.fillRect(sx, sy, TILE, TILE);
		ctx.fillStyle = '#821808';
		ctx.fillRect(sx, sy + 4, TILE, TILE - 4);

		const colors = ['#ff420c', '#ff7314', '#ffb932', '#ffeb82'];
		for (let i = 0; i < 4; i++) {
			const waveY = sy + 8 + i * 6 + Math.sin(t * 4.5 + tx * 0.7 + i) * 2;
			ctx.strokeStyle = colors[i];
			ctx.lineWidth = 2;
			ctx.beginPath();
			for (let k = 0; k < 6; k++) {
				const px = sx - 2 + k * 7;
				const py = waveY + Math.sin(t * 8 + k + i * 2 + tx) * 2;
				if (k === 0) ctx.moveTo(px, py);
				else ctx.lineTo(px, py);
			}
			ctx.stroke();
		}
		ctx.lineWidth = 1;
	}

	drawPortal(ctx, sx, sy, t) {
		ctx.fillStyle = '#16123b';
		ctx.fillRect(sx, sy, TILE, TILE);

		const cx = sx + TILE / 2;
		const cy = sy + TILE / 2;
		const pulse = 4 + Math.floor(Math.sin(t * 6) * 3);

		ctx.strokeStyle = '#50beff';
		ctx.lineWidth = 2;
		ctx.beginPath();
		ctx.arc(cx, cy, 15 + pulse, 0, Math.PI * 2);
		ctx.stroke();

		ctx.strokeStyle = '#b4f5ff';
		ctx.beginPath();
		ctx.arc(cx, cy, 9, 0, Math.PI * 2);
		ctx.stroke();

		ctx.fillStyle = '#f5ffff';
		ctx.beginPath();
		ctx.arc(cx, cy, 4, 0, Math.PI * 2);
		ctx.fill();

		ctx.fillStyle = '#82dcff';
		for (let i = 0; i < 5; i++) {
			const angle = t * 3 + i * Math.PI * 2 / 5;
			const px = cx + Math.cos(angle) * 14;
			const py = cy + Math.sin(angle) * 14;
			ctx.beginPath();
			ctx.arc(px, py, 2, 0, Math.PI * 2);
			ctx.fill();
		}
		ctx.lineWidth = 1;
	}

	draw(ctx, cameraX, cameraY, t) {
		this.drawBackground(ctx, cameraX, cameraY, t);

		const startTx = Math.max(0, Math.floor(cameraX / TILE) - 2);
		const endTx = Math.min(LEVEL_W, Math.floor((cameraX + WIDTH) / TILE) + 3);
		const startTy = Math.max(0, Math.floor(cameraY / TILE) - 2);
		const endTy = Math.min(LEVEL_H, Math.floor((cameraY + HEIGHT) / TILE) + 3);

		for (let ty = startTy; ty < endTy; ty++) {
			for (let tx = startTx; tx < endTx; tx++) {
				const cell = this.grid[ty][tx];
				const sx = Math.floor(tx * TILE - cameraX);
				const sy = Math.floor(ty * TILE - cameraY);

				if (cell === '#') {
					this.drawTileIce(ctx, sx, sy, tx, ty);
				} else if (cell === 'S') {
					this.drawSpike(ctx, sx, sy);
				} else if (cell === 'L') {
					this.drawLava(ctx, sx, sy, tx, ty, t);
				} else if (cell === 'X') {
					this.drawPortal(ctx, sx, sy, t);
				}
			}
		}
	}
}

// -----------------------------
// Player
// -----------------------------
class Player {
	constructor(spawn) {
		this.spawn = spawn;
		this.standW = 30;
		this.standH = 46;
		this.duckW = 38;
		this.duckH = 28;

		this.rect = new Rect(spawn[0], spawn[1], this.standW, this.standH);
		this.x = this.rect.x;
		this.y = this.rect.y;

		this.vx = 0;
		this.vy = 0;

		this.onGround = false;
		this.doubleJumps = 1;

		this.health = 3;
		this.invuln = 0;

		this.facing = 1;
		this.shootCooldown = 0;
		this.spaceHoldFrames = 0;

		this.ducking = false;

		this.poisonTimer = 0;
		this.poisonTick = 0;

		this.burnTimer = 0;
		this.burnTick = 0;
	}

	mouthPos() {
		if (this.ducking) {
			return [this.rect.centerx + this.facing * 30, this.rect.top + 10];
		}
		return [this.rect.centerx + this.facing * 26, this.rect.top + 15];
	}

	respawn() {
		this.rect.x = this.spawn[0];
		this.rect.y = this.spawn[1];
		this.rect.width = this.standW;
		this.rect.height = this.standH;
		this.ducking = false;

		this.x = this.rect.x;
		this.y = this.rect.y;

		this.vx = 0;
		this.vy = 0;
		this.onGround = false;
		this.doubleJumps = 1;
	}

	loseHealth() {
		this.health--;
		if (this.health <= 0) {
			this.health = 3;
			this.poisonTimer = 0;
			this.burnTimer = 0;
		}
		this.invuln = 90;
		this.respawn();
	}

	hurt() {
		if (this.invuln <= 0) {
			this.loseHealth();
		}
	}

	poison() {
		this.poisonTimer = Math.max(this.poisonTimer, POISON_SLOW_TIME);
		if (this.invuln <= 0) {
			this.loseHealth();
		}
	}

	burn() {
		this.burnTimer = Math.max(this.burnTimer, BURN_TIME);
		if (this.invuln <= 0) {
			this.loseHealth();
		}
	}

	jump() {
		if (this.ducking) return;
		if (this.onGround) {
			this.vy = -15;
			this.onGround = false;
			this.doubleJumps = 1;
		} else if (this.doubleJumps > 0) {
			this.vy = -14;
			this.doubleJumps--;
		}
	}

	setDucking(wantsDuck, level) {
		const oldBottom = this.rect.bottom;
		const oldCenterX = this.rect.centerx;

		if (wantsDuck) {
			if (!this.ducking) {
				this.ducking = true;
				this.rect.width = this.duckW;
				this.rect.height = this.duckH;
				this.rect.centerx = oldCenterX;
				this.rect.bottom = oldBottom;
				this.x = this.rect.x;
				this.y = this.rect.y;
			}
		} else {
			if (this.ducking) {
				const testRect = new Rect(0, 0, this.standW, this.standH);
				testRect.centerx = oldCenterX;
				testRect.bottom = oldBottom;

				let blocked = false;
				for (const tile of level.solidRects(testRect)) {
					if (testRect.colliderect(tile)) {
						blocked = true;
						break;
					}
				}

				if (!blocked) {
					this.ducking = false;
					this.rect = testRect;
					this.x = this.rect.x;
					this.y = this.rect.y;
				}
			}
		}
	}

	shootIce(enemies, homing = false) {
		if (this.shootCooldown > 0) return [];
		this.shootCooldown = 10;
		const mouth = this.mouthPos();
		const shards = [];

		if (homing) {
			const candidates = [];
			for (const enemy of enemies) {
				if (enemy.alive && enemy.frozenTimer <= 0) {
					const d = dist(mouth, enemy.rect.center);
					if (d <= SHARD_TARGET_RADIUS) {
						candidates.push([d, enemy]);
					}
				}
			}
			candidates.sort((a, b) => a[0] - b[0]);
			const targets = candidates.slice(0, 2).map(c => c[1]);

			if (targets.length > 0) {
				for (const target of targets) {
					shards.push(new IceShard(mouth[0], mouth[1], this.facing, target));
				}
				return shards;
			}
		}

		shards.push(new IceShard(mouth[0], mouth[1], this.facing));
		return shards;
	}

	updateStatusEffects() {
		if (this.invuln > 0) this.invuln--;
		if (this.shootCooldown > 0) this.shootCooldown--;

		if (this.poisonTimer > 0) {
			this.poisonTimer--;
			this.poisonTick++;
			if (this.poisonTick >= 120) {
				this.poisonTick = 0;
				if (this.invuln <= 0) this.loseHealth();
			}
		}

		if (this.burnTimer > 0) {
			this.burnTimer--;
			this.burnTick++;
			if (this.burnTick >= 90) {
				this.burnTick = 0;
				if (this.invuln <= 0) this.loseHealth();
			}
		}
	}

	update(keys, level) {
		this.updateStatusEffects();
		this.setDucking(keys.down, level);

		let move = 0;
		if (keys.left) move -= 1;
		if (keys.right) move += 1;

		if (move !== 0) this.facing = move;

		let maxSpeed = this.ducking ? 3.1 : 5.5;
		let accel = this.ducking ? 0.55 : 0.82;

		if (this.poisonTimer > 0) {
			maxSpeed *= 0.55;
			accel *= 0.55;
		}

		this.vx += move * accel;
		this.vx = clamp(this.vx, -maxSpeed, maxSpeed);

		if (move === 0) {
			this.vx *= 0.82;
			if (Math.abs(this.vx) < 0.08) this.vx = 0;
		}

		this.vy += GRAVITY;
		this.vy = Math.min(this.vy, MAX_FALL);

		// Horizontal
		this.x += this.vx;
		this.rect.x = Math.round(this.x);

		for (const tile of level.solidRects(this.rect)) {
			if (this.rect.colliderect(tile)) {
				if (this.vx > 0) {
					this.rect.right = tile.left;
				} else if (this.vx < 0) {
					this.rect.left = tile.right;
				}
				this.x = this.rect.x;
				this.vx = 0;
			}
		}

		// Vertical
		this.y += this.vy;
		this.rect.y = Math.round(this.y);
		this.onGround = false;

		for (const tile of level.solidRects(this.rect)) {
			if (this.rect.colliderect(tile)) {
				if (this.vy > 0) {
					this.rect.bottom = tile.top;
					this.onGround = true;
					this.doubleJumps = 1;
				} else if (this.vy < 0) {
					this.rect.top = tile.bottom;
				}
				this.y = this.rect.y;
				this.vy = 0;
			}
		}

		for (const hazard of level.hazardRects(this.rect)) {
			if (this.rect.colliderect(hazard)) {
				this.hurt();
			}
		}

		if (this.rect.top > LEVEL_H * TILE) {
			this.hurt();
		}
	}

	draw(ctx, cameraX, cameraY, time = 0) {
		if (this.invuln > 0 && this.invuln % 8 < 4) return;

		const sx = this.rect.x - cameraX;
		const sy = this.rect.y - cameraY;
		const d = this.facing;
		const t = time || Date.now() / 1000;

		// Color palette - rich ice blues
		const darkBlue = '#0a3d5c';
		const midBlue = '#1a7a9e';
		const lightBlue = '#4dc4e8';
		const paleBlue = '#a8e4f5';
		const white = '#e8faff';
		const bellyColor = '#c5eef8';
		const eyeGold = '#f0d848';
		const eyeRim = '#8b6914';

		let bodyH, bodyW, bodyY, headY, tailY;
		if (this.ducking) {
			bodyH = 24; bodyW = 50; bodyY = sy + 6; headY = sy + 4; tailY = sy + 20;
		} else {
			bodyH = 30; bodyW = 44; bodyY = sy + 14; headY = sy + 8; tailY = sy + 32;
		}

		const bodyCenterX = sx + 15;
		const bodyCenterY = bodyY + bodyH / 2;

		// Animated tail wave
		const tailWave = Math.sin(t * 4) * 6;
		const tailWave2 = Math.sin(t * 3.5 + 1) * 4;

		// Shadow with gradient
		const shadowGrad = ctx.createRadialGradient(bodyCenterX, sy + this.rect.height, 0, bodyCenterX, sy + this.rect.height, 40);
		shadowGrad.addColorStop(0, 'rgba(0,20,40,0.4)');
		shadowGrad.addColorStop(1, 'rgba(0,20,40,0)');
		ctx.fillStyle = shadowGrad;
		ctx.beginPath();
		ctx.ellipse(bodyCenterX, sy + this.rect.height, 40, 8, 0, 0, Math.PI * 2);
		ctx.fill();

		// === TAIL ===
		const tailBase = [bodyCenterX - d * 10, tailY];
		const tailMid = [bodyCenterX - d * 38 + tailWave * d * 0.3, tailY + 2 + tailWave2];
		const tailEnd = [bodyCenterX - d * 70 + tailWave * d, tailY - 2 + tailWave];

		// Tail gradient
		ctx.lineCap = 'round';
		ctx.strokeStyle = darkBlue;
		ctx.lineWidth = 14;
		ctx.beginPath();
		ctx.moveTo(tailBase[0], tailBase[1]);
		ctx.quadraticCurveTo(tailMid[0], tailMid[1], tailEnd[0], tailEnd[1]);
		ctx.stroke();

		ctx.strokeStyle = midBlue;
		ctx.lineWidth = 10;
		ctx.beginPath();
		ctx.moveTo(tailBase[0], tailBase[1]);
		ctx.quadraticCurveTo(tailMid[0], tailMid[1], tailEnd[0], tailEnd[1]);
		ctx.stroke();

		// Tail highlight
		ctx.strokeStyle = lightBlue;
		ctx.lineWidth = 4;
		ctx.beginPath();
		ctx.moveTo(tailBase[0], tailBase[1] - 3);
		ctx.quadraticCurveTo(tailMid[0], tailMid[1] - 3, tailEnd[0], tailEnd[1] - 2);
		ctx.stroke();

		// Tail tip ice spike
		ctx.fillStyle = white;
		ctx.beginPath();
		ctx.moveTo(tailEnd[0], tailEnd[1] - 4);
		ctx.lineTo(tailEnd[0] - d * 12, tailEnd[1] - 1);
		ctx.lineTo(tailEnd[0], tailEnd[1] + 4);
		ctx.closePath();
		ctx.fill();
		ctx.strokeStyle = paleBlue;
		ctx.lineWidth = 1;
		ctx.stroke();

		// === BACK LEGS ===
		ctx.lineCap = 'round';
		const legOffset = this.ducking ? 0 : 4;

		// Back leg (behind body)
		ctx.strokeStyle = darkBlue;
		ctx.lineWidth = 7;
		const backLegX = bodyCenterX - d * 5;
		const backFootY = sy + this.rect.height - 2;
		ctx.beginPath();
		ctx.moveTo(backLegX, bodyCenterY + 6);
		ctx.lineTo(backLegX - d * 8, backFootY);
		ctx.stroke();

		ctx.strokeStyle = midBlue;
		ctx.lineWidth = 5;
		ctx.beginPath();
		ctx.moveTo(backLegX, bodyCenterY + 6);
		ctx.lineTo(backLegX - d * 8, backFootY);
		ctx.stroke();

		// Back foot claws
		this.drawClaws(ctx, backLegX - d * 8, backFootY, d, darkBlue);

		// === BODY ===
		// Body base (darker outline)
		ctx.fillStyle = darkBlue;
		ctx.beginPath();
		ctx.ellipse(bodyCenterX, bodyCenterY, bodyW / 2 + 2, bodyH / 2 + 2, 0, 0, Math.PI * 2);
		ctx.fill();

		// Main body
		const bodyGrad = ctx.createLinearGradient(bodyCenterX, bodyY, bodyCenterX, bodyY + bodyH);
		bodyGrad.addColorStop(0, lightBlue);
		bodyGrad.addColorStop(0.4, midBlue);
		bodyGrad.addColorStop(1, darkBlue);
		ctx.fillStyle = bodyGrad;
		ctx.beginPath();
		ctx.ellipse(bodyCenterX, bodyCenterY, bodyW / 2, bodyH / 2, 0, 0, Math.PI * 2);
		ctx.fill();

		// Belly
		ctx.fillStyle = bellyColor;
		ctx.beginPath();
		ctx.ellipse(bodyCenterX + d * 5, bodyCenterY + bodyH * 0.2, bodyW * 0.35, bodyH * 0.35, d * 0.2, 0, Math.PI * 2);
		ctx.fill();

		// Body scales pattern
		for (let row = 0; row < 3; row++) {
			for (let col = 0; col < 4; col++) {
				const scaleX = bodyCenterX - 12 + col * 8 + (row % 2) * 4;
				const scaleY = bodyY + 6 + row * 7;
				ctx.fillStyle = row === 0 ? paleBlue : (row === 1 ? lightBlue : midBlue);
				ctx.beginPath();
				ctx.ellipse(scaleX, scaleY, 4, 3, 0, 0, Math.PI);
				ctx.fill();
				ctx.strokeStyle = darkBlue;
				ctx.lineWidth = 0.5;
				ctx.stroke();
			}
		}

		// === ICE CREST SPINES ===
		const crestCount = this.ducking ? 4 : 5;
		for (let i = 0; i < crestCount; i++) {
			const spineX = bodyCenterX - 8 + i * 8;
			const spineH = 16 - i * 2 + Math.sin(t * 6 + i) * 1.5;
			const spineWave = Math.sin(t * 4 + i * 0.5) * 1;

			// Spine glow
			ctx.fillStyle = 'rgba(200,240,255,0.3)';
			ctx.beginPath();
			ctx.moveTo(spineX - 1, bodyY + 2);
			ctx.lineTo(spineX + 4 + spineWave, bodyY - spineH - 3);
			ctx.lineTo(spineX + 9, bodyY + 2);
			ctx.closePath();
			ctx.fill();

			// Main spine
			const spineGrad = ctx.createLinearGradient(spineX, bodyY, spineX, bodyY - spineH);
			spineGrad.addColorStop(0, paleBlue);
			spineGrad.addColorStop(0.5, white);
			spineGrad.addColorStop(1, '#ffffff');
			ctx.fillStyle = spineGrad;
			ctx.beginPath();
			ctx.moveTo(spineX, bodyY + 2);
			ctx.lineTo(spineX + 4 + spineWave, bodyY - spineH);
			ctx.lineTo(spineX + 8, bodyY + 2);
			ctx.closePath();
			ctx.fill();

			ctx.strokeStyle = lightBlue;
			ctx.lineWidth = 1;
			ctx.stroke();
		}

		// === FRONT LEG ===
		const frontLegX = bodyCenterX + d * 12;
		ctx.strokeStyle = darkBlue;
		ctx.lineWidth = 8;
		ctx.beginPath();
		ctx.moveTo(frontLegX, bodyCenterY + 4);
		ctx.lineTo(frontLegX + d * 14, backFootY);
		ctx.stroke();

		ctx.strokeStyle = midBlue;
		ctx.lineWidth = 6;
		ctx.beginPath();
		ctx.moveTo(frontLegX, bodyCenterY + 4);
		ctx.lineTo(frontLegX + d * 14, backFootY);
		ctx.stroke();

		ctx.strokeStyle = lightBlue;
		ctx.lineWidth = 2;
		ctx.beginPath();
		ctx.moveTo(frontLegX, bodyCenterY + 2);
		ctx.lineTo(frontLegX + d * 12, backFootY - 2);
		ctx.stroke();

		this.drawClaws(ctx, frontLegX + d * 14, backFootY, d, darkBlue);

		// === NECK ===
		const neckX = bodyCenterX + d * 18;
		ctx.fillStyle = midBlue;
		ctx.beginPath();
		ctx.ellipse(neckX, headY + 12, 10, 8, d * 0.3, 0, Math.PI * 2);
		ctx.fill();

		// === HEAD ===
		const headX = bodyCenterX + d * 32;
		const headCenterY = headY + 4;

		// Head base
		ctx.fillStyle = darkBlue;
		ctx.beginPath();
		ctx.ellipse(headX, headCenterY, 16, 13, d * 0.15, 0, Math.PI * 2);
		ctx.fill();

		// Head main
		const headGrad = ctx.createRadialGradient(headX - d * 3, headCenterY - 4, 0, headX, headCenterY, 16);
		headGrad.addColorStop(0, paleBlue);
		headGrad.addColorStop(0.5, lightBlue);
		headGrad.addColorStop(1, midBlue);
		ctx.fillStyle = headGrad;
		ctx.beginPath();
		ctx.ellipse(headX, headCenterY, 14, 11, d * 0.15, 0, Math.PI * 2);
		ctx.fill();

		// Snout
		const snoutTipX = headX + d * 28;
		const snoutTipY = headCenterY + 2;
		ctx.fillStyle = lightBlue;
		ctx.beginPath();
		ctx.moveTo(headX + d * 10, headCenterY - 6);
		ctx.quadraticCurveTo(snoutTipX + d * 4, headCenterY - 2, snoutTipX, snoutTipY);
		ctx.quadraticCurveTo(snoutTipX - d * 2, headCenterY + 6, headX + d * 8, headCenterY + 8);
		ctx.closePath();
		ctx.fill();

		// Snout highlight
		ctx.strokeStyle = paleBlue;
		ctx.lineWidth = 2;
		ctx.beginPath();
		ctx.moveTo(headX + d * 12, headCenterY - 4);
		ctx.quadraticCurveTo(snoutTipX - d * 5, headCenterY - 3, snoutTipX - d * 2, snoutTipY);
		ctx.stroke();

		// Jaw line
		ctx.strokeStyle = darkBlue;
		ctx.lineWidth = 1.5;
		ctx.beginPath();
		ctx.moveTo(headX + d * 6, headCenterY + 6);
		ctx.quadraticCurveTo(headX + d * 18, headCenterY + 5, snoutTipX - d * 3, snoutTipY + 1);
		ctx.stroke();

		// Nostrils
		ctx.fillStyle = darkBlue;
		ctx.beginPath();
		ctx.ellipse(snoutTipX - d * 4, snoutTipY - 2, 2, 1.5, 0, 0, Math.PI * 2);
		ctx.fill();

		// === EYE ===
		const eyeX = headX + d * 4;
		const eyeY = headCenterY - 3;

		// Eye socket
		ctx.fillStyle = darkBlue;
		ctx.beginPath();
		ctx.ellipse(eyeX, eyeY, 6, 5, 0, 0, Math.PI * 2);
		ctx.fill();

		// Eye white/gold
		const eyeGrad = ctx.createRadialGradient(eyeX - d, eyeY - 1, 0, eyeX, eyeY, 5);
		eyeGrad.addColorStop(0, '#fff8d0');
		eyeGrad.addColorStop(0.6, eyeGold);
		eyeGrad.addColorStop(1, eyeRim);
		ctx.fillStyle = eyeGrad;
		ctx.beginPath();
		ctx.ellipse(eyeX, eyeY, 5, 4, 0, 0, Math.PI * 2);
		ctx.fill();

		// Pupil (vertical slit)
		ctx.fillStyle = '#0a1520';
		ctx.beginPath();
		ctx.ellipse(eyeX + d * 0.5, eyeY, 1.5, 3.5, 0, 0, Math.PI * 2);
		ctx.fill();

		// Eye highlight
		ctx.fillStyle = '#ffffff';
		ctx.beginPath();
		ctx.arc(eyeX - d * 1.5, eyeY - 1.5, 1.5, 0, Math.PI * 2);
		ctx.fill();

		// Eye rim
		ctx.strokeStyle = eyeRim;
		ctx.lineWidth = 1;
		ctx.beginPath();
		ctx.ellipse(eyeX, eyeY, 5, 4, 0, 0, Math.PI * 2);
		ctx.stroke();

		// Small head scales
		for (let i = 0; i < 3; i++) {
			const scX = headX - d * 6 + i * 5 * d;
			const scY = headCenterY - 6 + i * 2;
			ctx.fillStyle = paleBlue;
			ctx.beginPath();
			ctx.ellipse(scX, scY, 3, 2, 0, 0, Math.PI);
			ctx.fill();
		}

		// Brow ridge
		ctx.strokeStyle = midBlue;
		ctx.lineWidth = 2;
		ctx.beginPath();
		ctx.arc(eyeX, eyeY - 2, 7, Math.PI + 0.5, Math.PI * 2 - 0.5);
		ctx.stroke();

		// Mouth frost
		if (this.shootCooldown <= 3) {
			const [mx, my] = this.mouthPos();
			const mxs = mx - cameraX;
			const mys = my - cameraY;
			ctx.fillStyle = '#aaf0ff';
			ctx.beginPath();
			ctx.arc(mxs, mys, 4, 0, Math.PI * 2);
			ctx.fill();
			ctx.fillStyle = '#ebffff';
			ctx.beginPath();
			ctx.arc(mxs, mys, 2, 0, Math.PI * 2);
			ctx.fill();
		}

		// Status indicators
		if (this.poisonTimer > 0) {
			ctx.fillStyle = '#5aff64';
			ctx.beginPath();
			ctx.arc(sx + 16, sy - 7, 5, 0, Math.PI * 2);
			ctx.fill();
			ctx.strokeStyle = '#1e7828';
			ctx.stroke();
		}

		if (this.burnTimer > 0) {
			const flameX = sx + 25;
			const flameY = sy - 8;
			const flicker = Math.floor(Math.sin(Date.now() * 0.02) * 3);

			ctx.fillStyle = '#ff5014';
			ctx.beginPath();
			ctx.moveTo(flameX, flameY - 8 - flicker);
			ctx.lineTo(flameX - 6, flameY + 5);
			ctx.lineTo(flameX + 6, flameY + 5);
			ctx.closePath();
			ctx.fill();

			ctx.fillStyle = '#ffd250';
			ctx.beginPath();
			ctx.moveTo(flameX, flameY - 4 - flicker);
			ctx.lineTo(flameX - 3, flameY + 4);
			ctx.lineTo(flameX + 3, flameY + 4);
			ctx.closePath();
			ctx.fill();
		}
	}

	drawClaws(ctx, x, y, direction, color) {
		ctx.strokeStyle = '#e8faff';
		ctx.lineWidth = 2;
		ctx.lineCap = 'round';
		for (let i = 0; i < 3; i++) {
			ctx.beginPath();
			ctx.moveTo(x, y);
			ctx.lineTo(x + direction * (6 + i * 3), y + 2 + i * 2);
			ctx.stroke();
		}
		ctx.strokeStyle = color;
		ctx.lineWidth = 1;
		for (let i = 0; i < 3; i++) {
			ctx.beginPath();
			ctx.moveTo(x + direction * (6 + i * 3) - direction, y + 1 + i * 2);
			ctx.lineTo(x + direction * (8 + i * 3), y + 3 + i * 2);
			ctx.stroke();
		}
	}
}

// -----------------------------
// Ice Shard
// -----------------------------
class IceShard {
	constructor(x, y, direction, target = null) {
		this.direction = direction;
		this.target = target;

		this.rect = new Rect(x, y, 34, 14);
		this.x = this.rect.x;
		this.y = this.rect.y;

		const speed = 13.2;
		if (target && target.alive) {
			const dx = target.rect.centerx - x;
			const dy = target.rect.centery - y;
			const length = Math.max(1, Math.hypot(dx, dy));
			this.vx = dx / length * speed;
			this.vy = dy / length * speed;
		} else {
			this.vx = direction * speed;
			this.vy = (Math.random() - 0.5) * 0.7;
		}

		this.alive = true;
		this.life = 85;
		this.trail = [];
	}

	update(level) {
		this.life--;
		if (this.life <= 0) {
			this.alive = false;
			return;
		}

		if (this.target && this.target.alive && this.target.frozenTimer <= 0) {
			const dx = this.target.rect.centerx - this.rect.centerx;
			const dy = this.target.rect.centery - this.rect.centery;
			const length = Math.max(1, Math.hypot(dx, dy));

			const desiredVx = dx / length * 13.2;
			const desiredVy = dy / length * 13.2;

			this.vx += (desiredVx - this.vx) * 0.16;
			this.vy += (desiredVy - this.vy) * 0.16;
		}

		this.trail.push([this.rect.centerx, this.rect.centery]);
		if (this.trail.length > 10) this.trail.shift();

		this.x += this.vx;
		this.y += this.vy;

		this.rect.x = Math.round(this.x);
		this.rect.y = Math.round(this.y);

		for (const tile of level.solidRects(this.rect)) {
			if (this.rect.colliderect(tile)) {
				this.alive = false;
				return;
			}
		}
	}

	draw(ctx, cameraX, cameraY, t) {
		// Trail
		for (let i = 0; i < this.trail.length; i++) {
			const amount = i / Math.max(1, this.trail.length - 1);
			const tx = this.trail[i][0] - cameraX;
			const ty = this.trail[i][1] - cameraY;
			ctx.fillStyle = `rgb(${Math.floor(120 * amount)},${Math.floor(210 * amount)},${Math.floor(255 * amount)})`;
			ctx.beginPath();
			ctx.arc(tx, ty, 2 + amount * 5, 0, Math.PI * 2);
			ctx.fill();
		}

		const cx = this.rect.centerx - cameraX;
		const cy = this.rect.centery - cameraY;
		const angle = Math.atan2(this.vy, this.vx);

		const rp = (lx, ly) => {
			const ca = Math.cos(angle);
			const sa = Math.sin(angle);
			return [cx + lx * ca - ly * sa, cy + lx * sa + ly * ca];
		};

		const points = [rp(24, 0), rp(10, -7), rp(-17, -5), rp(-25, 0), rp(-17, 5), rp(10, 7)];

		ctx.fillStyle = '#d2f5ff';
		ctx.beginPath();
		ctx.moveTo(points[0][0], points[0][1]);
		for (let i = 1; i < points.length; i++) {
			ctx.lineTo(points[i][0], points[i][1]);
		}
		ctx.closePath();
		ctx.fill();

		ctx.strokeStyle = '#4baadc';
		ctx.lineWidth = 2;
		ctx.stroke();
		ctx.lineWidth = 1;

		const tip = rp(22, 0);
		ctx.strokeStyle = '#ffffff';
		ctx.lineWidth = 2;
		ctx.beginPath();
		ctx.moveTo(cx, cy);
		ctx.lineTo(tip[0], tip[1]);
		ctx.stroke();
		ctx.lineWidth = 1;

		ctx.strokeStyle = '#78dcff';
		ctx.beginPath();
		ctx.arc(cx, cy, 18, 0, Math.PI * 2);
		ctx.stroke();
	}
}

// -----------------------------
// Enemy
// -----------------------------
class Enemy {
	constructor(kind, x, y) {
		this.kind = kind;

		const sizes = {
			'ash_wyvern': [58, 38],
			'venom_drake': [60, 38],
			'obsidian_gargoyle': [66, 46],
			'ember_wraith': [52, 44],
			'storm_screecher': [54, 34],
			'crystal_basilisk': [62, 40]
		};

		const [w, h] = sizes[kind] || [58, 38];

		this.rect = new Rect(x, y, w, h);
		this.x = this.rect.x;
		this.y = this.rect.y;

		this.vx = Math.random() < 0.5 ? -2.0 : 2.0;
		this.vy = (Math.random() - 0.5) * 2;

		this.direction = Math.random() < 0.5 ? -1 : 1;
		this.timer = Math.floor(Math.random() * 120);

		this.alive = true;
		this.frozenTimer = 0;

		this.wingPhase = Math.random() * Math.PI * 2;
		this.tailPhase = Math.random() * Math.PI * 2;
		this.chargeFlash = 0;

		this.canAttack = false;
		this.grounded = NON_FLYING_ENEMY_KINDS.has(kind);
		this.onGround = false;
	}

	freeze() {
		this.frozenTimer = FREEZE_TIME;
		this.vx = 0;
		this.vy = 0;
	}

	palette() {
		const palettes = {
			'ash_wyvern': { body: '#b93e14', wing: '#5f2419', glow: '#ff8223', eye: '#ffe646' },
			'venom_drake': { body: '#559137', wing: '#2d502d', glow: '#50ff6e', eye: '#a0ff64' },
			'obsidian_gargoyle': { body: '#4b4648', wing: '#2d2c32', glow: '#ff5023', eye: '#ff552d' },
			'ember_wraith': { body: '#b4375f', wing: '#5a1941', glow: '#ff50a0', eye: '#ffd2f5' },
			'crystal_basilisk': { body: '#55aad2', wing: '#2d5f82', glow: '#aaf5ff', eye: '#dcffff' },
			'storm_screecher': { body: '#5055be', wing: '#2d2d82', glow: '#96beff', eye: '#e6f5ff' }
		};
		return palettes[this.kind] || palettes['ash_wyvern'];
	}

	mouthWorldPos() {
		return [this.rect.centerx + this.direction * 50, this.rect.centery - 6];
	}

	powerPhase(period) {
		return (this.timer % period) / period;
	}

	tailHitbox() {
		if (this.frozenTimer > 0 || !this.canAttack) {
			return new Rect(0, 0, 0, 0);
		}
		// Simplified tail hitbox
		const d = this.direction;
		return new Rect(
			this.rect.centerx - d * 120,
			this.rect.centery - 20,
			80,
			60
		);
	}

	moveAndCollide(level) {
		this.x += this.vx;
		this.rect.x = Math.round(this.x);

		for (const tile of level.solidRects(this.rect)) {
			if (this.rect.colliderect(tile)) {
				if (this.vx > 0) {
					this.rect.right = tile.left;
					this.direction = -1;
				} else if (this.vx < 0) {
					this.rect.left = tile.right;
					this.direction = 1;
				}
				this.x = this.rect.x;
				if (this.grounded) this.vx = 0;
				else this.vx *= -0.45;
			}
		}

		this.y += this.vy;
		this.rect.y = Math.round(this.y);

		if (this.grounded) this.onGround = false;

		for (const tile of level.solidRects(this.rect)) {
			if (this.rect.colliderect(tile)) {
				if (this.vy > 0) {
					this.rect.bottom = tile.top;
					if (this.grounded) this.onGround = true;
				} else if (this.vy < 0) {
					this.rect.top = tile.bottom;
				}
				this.y = this.rect.y;
				if (this.grounded) this.vy = 0;
				else this.vy *= -0.45;
			}
		}
	}

	update(level, player) {
		this.timer++;
		if (this.chargeFlash > 0) this.chargeFlash--;

		if (this.frozenTimer > 0) {
			this.frozenTimer--;
			this.vx = 0;
			this.vy = 0;
			return;
		}

		const dx = player.rect.centerx - this.rect.centerx;
		const dy = player.rect.centery - this.rect.centery;
		const d = Math.max(1, Math.hypot(dx, dy));

		if (Math.abs(dx) > 8) this.direction = sign(dx);

		if (this.grounded) {
			let chaseRange = 420, accelX = 0.20, maxVx = 3.8;

			if (this.kind === 'venom_drake') {
				chaseRange = 430; accelX = 0.24; maxVx = 4.4;
			} else if (this.kind === 'ash_wyvern') {
				chaseRange = 460; accelX = 0.22; maxVx = 4.1;
			}

			if (this.canAttack && d < chaseRange) {
				this.vx += sign(dx) * accelX;
				if (this.timer % 130 === 0) {
					this.vx += this.direction * 3.2;
					this.chargeFlash = 18;
				}
				if (this.onGround && dy < -80 && Math.abs(dx) < 220) {
					this.vy = -11.5;
				}
			} else {
				maxVx = 1.6;
				this.vx += Math.sin(this.timer * 0.025 + this.tailPhase) * 0.05;
				if (d > 700) this.vx += sign(dx) * 0.06;
			}

			if (this.onGround) this.vx *= 0.96;
			this.vx = clamp(this.vx, -maxVx, maxVx);
			this.vy += GRAVITY;
			this.vy = Math.min(this.vy, MAX_FALL);
		} else {
			// Flying enemies
			let chaseRange = 400, accelXY = 0.08, maxV = 3.2;

			if (this.kind === 'storm_screecher') {
				chaseRange = 480; accelXY = 0.12; maxV = 4.5;
			} else if (this.kind === 'obsidian_gargoyle') {
				chaseRange = 350; accelXY = 0.06; maxV = 2.4;
			} else if (this.kind === 'ember_wraith') {
				chaseRange = 200; accelXY = 0.04; maxV = 2.0;
			}

			if (this.canAttack && d < chaseRange) {
				this.vx += sign(dx) * accelXY;
				this.vy += sign(dy) * accelXY * 0.7;
			} else {
				this.vx += Math.sin(this.timer * 0.03 + this.wingPhase) * 0.06;
				this.vy += Math.cos(this.timer * 0.025 + this.wingPhase) * 0.04;
			}

			this.vx = clamp(this.vx, -maxV, maxV);
			this.vy = clamp(this.vy, -maxV * 0.6, maxV * 0.6);
		}

		this.moveAndCollide(level);
	}

	applyPowerToPlayer(player) {
		if (!this.canAttack || this.frozenTimer > 0) return;

		const px = player.rect.centerx;
		const py = player.rect.centery;
		const [mx, my] = this.mouthWorldPos();
		const dx = px - this.rect.centerx;
		const dy = py - this.rect.centery;
		const distance = Math.max(1, Math.hypot(dx, dy));
		const facingPlayer = sign(dx) === this.direction || Math.abs(dx) < 20;

		if (this.kind === 'ash_wyvern') {
			const phase = this.powerPhase(180);
			if (phase < 0.42 && distance < 450 && facingPlayer) {
				const flameRect = new Rect(
					this.direction > 0 ? mx : mx - 190,
					my - 48,
					190,
					96
				);
				if (player.rect.colliderect(flameRect)) {
					player.burn();
				}
			}
		} else if (this.kind === 'venom_drake') {
			const phase = this.powerPhase(240);
			if (phase < 0.36 && distance < 410 && facingPlayer) {
				const tongueRect = new Rect(
					Math.min(mx, px) - 15,
					Math.min(my, py) - 15,
					Math.abs(px - mx) + 30,
					Math.abs(py - my) + 30
				);
				if (player.rect.colliderect(tongueRect)) {
					player.vx += sign(this.rect.centerx - px) * 6.5;
					player.vy -= 3.0;
					player.poison();
				}
			}
		} else if (this.kind === 'ember_wraith') {
			const phase = this.powerPhase(200);
			if (phase < 0.58 && distance < 175) {
				const curseRect = new Rect(
					this.rect.centerx - 110,
					this.rect.centery - 110,
					220,
					220
				);
				if (player.rect.colliderect(curseRect)) {
					player.poison();
				}
			}
		} else if (this.kind === 'obsidian_gargoyle') {
			const phase = this.powerPhase(210);
			if (phase < 0.25 && distance < 350) {
				const shockRect = new Rect(
					this.rect.centerx - 165,
					this.rect.bottom - 12,
					330,
					42
				);
				if (player.rect.colliderect(shockRect)) {
					player.hurt();
				}
			}
		} else if (this.kind === 'crystal_basilisk') {
			const phase = this.powerPhase(190);
			if (phase < 0.32 && distance < 370 && facingPlayer) {
				const crystalRect = new Rect(
					this.direction > 0 ? this.rect.right : this.rect.left - 140,
					this.rect.centery - 45,
					140,
					90
				);
				if (player.rect.colliderect(crystalRect)) {
					player.hurt();
				}
			}
		} else if (this.kind === 'storm_screecher') {
			const phase = this.powerPhase(160);
			if (phase < 0.23 && distance < 460 && facingPlayer) {
				const lightningRect = new Rect(
					Math.min(mx, px) - 22,
					Math.min(my, py) - 22,
					Math.abs(px - mx) + 44,
					Math.abs(py - my) + 44
				);
				if (player.rect.colliderect(lightningRect)) {
					player.hurt();
				}
			}
		}
	}

	draw(ctx, cameraX, cameraY, t, player) {
		const sx = this.rect.x - cameraX;
		const sy = this.rect.y - cameraY;

		const p = this.palette();
		let bodyColor = p.body;
		let wingColor = p.wing;
		let glowColor = p.glow;
		let eyeColor = p.eye;

		if (this.frozenTimer > 0) {
			bodyColor = '#96e1ff';
			wingColor = '#78c8f0';
			eyeColor = '#ebffff';
		}

		const bx = sx + this.rect.width / 2;
		const by = sy + this.rect.height / 2;
		const d = this.direction;

		let flap = 0;
		if (this.frozenTimer <= 0 && !this.grounded) {
			flap = Math.sin(t * 12 + this.wingPhase) * 12;
		}

		// Glow aura
		if (this.canAttack && this.frozenTimer <= 0) {
			ctx.strokeStyle = glowColor;
			ctx.lineWidth = 2;
			ctx.beginPath();
			ctx.ellipse(bx, by, 58, 48, 0, 0, Math.PI * 2);
			ctx.stroke();
		} else if (this.frozenTimer > 0) {
			ctx.strokeStyle = '#78d2ff';
			ctx.lineWidth = 2;
			ctx.beginPath();
			ctx.ellipse(bx, by, 52, 42, 0, 0, Math.PI * 2);
			ctx.stroke();
		}

		// Wings
		ctx.fillStyle = wingColor;
		ctx.beginPath();
		ctx.moveTo(bx - 6, by - 4);
		ctx.lineTo(bx - 55, by - 38 + flap);
		ctx.lineTo(bx - 35, by + 18);
		ctx.closePath();
		ctx.fill();
		ctx.strokeStyle = '#14100f';
		ctx.lineWidth = 2;
		ctx.stroke();

		ctx.beginPath();
		ctx.moveTo(bx + 6, by - 4);
		ctx.lineTo(bx + 55, by - 38 - flap);
		ctx.lineTo(bx + 35, by + 18);
		ctx.closePath();
		ctx.fill();
		ctx.stroke();

		// Tail
		ctx.strokeStyle = bodyColor;
		ctx.lineWidth = 8;
		ctx.beginPath();
		ctx.moveTo(bx - d * 24, by + 8);
		ctx.lineTo(bx - d * 60, by + 18);
		ctx.lineTo(bx - d * 90, by + 7);
		ctx.stroke();

		// Body
		ctx.fillStyle = bodyColor;
		ctx.beginPath();
		ctx.ellipse(bx, by, (this.rect.width - 14) / 2, (this.rect.height - 13) / 2, 0, 0, Math.PI * 2);
		ctx.fill();
		ctx.strokeStyle = '#140f0f';
		ctx.lineWidth = 2;
		ctx.stroke();

		// Head
		const hx = bx + d * 32;
		const hy = by - 8;

		ctx.fillStyle = bodyColor;
		ctx.beginPath();
		ctx.moveTo(hx - d * 13, hy - 10);
		ctx.lineTo(hx + d * 8, hy - 13);
		ctx.lineTo(hx + d * 27, hy - 3);
		ctx.lineTo(hx + d * 17, hy + 10);
		ctx.lineTo(hx - d * 10, hy + 8);
		ctx.closePath();
		ctx.fill();
		ctx.strokeStyle = '#140f0f';
		ctx.stroke();

		// Snout
		ctx.beginPath();
		ctx.moveTo(hx + d * 12, hy - 5);
		ctx.lineTo(hx + d * 33, hy - 1);
		ctx.lineTo(hx + d * 18, hy + 8);
		ctx.closePath();
		ctx.fill();
		ctx.lineWidth = 1;
		ctx.stroke();

		// Eye
		ctx.fillStyle = (this.chargeFlash > 0 || this.canAttack) ? '#ffffff' : eyeColor;
		ctx.beginPath();
		ctx.arc(hx + d * 9, hy - 4, 3, 0, Math.PI * 2);
		ctx.fill();
		ctx.fillStyle = '#050505';
		ctx.beginPath();
		ctx.arc(hx + d * 9, hy - 4, 1, 0, Math.PI * 2);
		ctx.fill();

		// Horns
		const hornColor = this.kind === 'crystal_basilisk' ? '#d2ffff' : '#e6e1be';
		ctx.fillStyle = hornColor;
		ctx.beginPath();
		ctx.moveTo(hx - d * 4, hy - 10);
		ctx.lineTo(hx - d * 13, hy - 25);
		ctx.lineTo(hx + d * 2, hy - 14);
		ctx.closePath();
		ctx.fill();
		ctx.beginPath();
		ctx.moveTo(hx + d * 8, hy - 10);
		ctx.lineTo(hx + d * 11, hy - 24);
		ctx.lineTo(hx + d * 16, hy - 11);
		ctx.closePath();
		ctx.fill();

		// Core glow
		const pulse = 2 + Math.floor(2 * Math.sin(t * 8 + this.timer));
		ctx.fillStyle = this.frozenTimer <= 0 ? glowColor : '#e6ffff';
		ctx.beginPath();
		ctx.arc(bx, by + 4, 5 + pulse, 0, Math.PI * 2);
		ctx.fill();
		ctx.fillStyle = '#ffffff';
		ctx.beginPath();
		ctx.arc(bx, by + 4, 2, 0, Math.PI * 2);
		ctx.fill();

		// Frozen ice effect
		if (this.frozenTimer > 0) {
			ctx.strokeStyle = '#aaf0ff';
			ctx.lineWidth = 3;
			for (let i = 0; i < 6; i++) {
				const angle = i * Math.PI / 3 + t;
				const len = 15 + Math.sin(t * 3 + i) * 5;
				ctx.beginPath();
				ctx.moveTo(bx, by);
				ctx.lineTo(bx + Math.cos(angle) * len, by + Math.sin(angle) * len);
				ctx.stroke();
			}
			ctx.lineWidth = 1;
		}

		// Draw power effects
		this.drawPowerEffects(ctx, cameraX, cameraY, t, player, glowColor);
	}

	drawPowerEffects(ctx, cameraX, cameraY, t, player, glowColor) {
		if (this.frozenTimer > 0 || !this.canAttack) return;

		const [mx, my] = this.mouthWorldPos();
		const mxScreen = mx - cameraX;
		const myScreen = my - cameraY;
		const distance = Math.hypot(player.rect.centerx - this.rect.centerx, player.rect.centery - this.rect.centery);

		if (this.kind === 'ash_wyvern') {
			const phase = this.powerPhase(180);
			if (phase < 0.42 && distance < 450) {
				const flameLen = 120 + Math.sin(t * 15) * 20;
				const gradient = ctx.createLinearGradient(
					mxScreen, myScreen,
					mxScreen + this.direction * flameLen, myScreen
				);
				gradient.addColorStop(0, 'rgba(255,50,10,0.9)');
				gradient.addColorStop(0.5, 'rgba(255,150,30,0.6)');
				gradient.addColorStop(1, 'rgba(255,200,50,0)');
				ctx.fillStyle = gradient;
				ctx.beginPath();
				ctx.moveTo(mxScreen, myScreen - 30);
				ctx.lineTo(mxScreen + this.direction * flameLen, myScreen);
				ctx.lineTo(mxScreen, myScreen + 30);
				ctx.closePath();
				ctx.fill();
			}
		} else if (this.kind === 'venom_drake') {
			const phase = this.powerPhase(240);
			if (phase < 0.36 && distance < 410) {
				const px = player.rect.centerx - cameraX;
				const py = player.rect.centery - cameraY;
				ctx.strokeStyle = '#50ff6e';
				ctx.lineWidth = 4;
				ctx.beginPath();
				ctx.moveTo(mxScreen, myScreen);
				const midX = (mxScreen + px) / 2 + Math.sin(t * 10) * 20;
				const midY = (myScreen + py) / 2 + Math.cos(t * 8) * 15;
				ctx.quadraticCurveTo(midX, midY, px, py);
				ctx.stroke();
				ctx.lineWidth = 1;
			}
		} else if (this.kind === 'storm_screecher') {
			const phase = this.powerPhase(160);
			if (phase < 0.23 && distance < 460) {
				const px = player.rect.centerx - cameraX;
				const py = player.rect.centery - cameraY;
				ctx.strokeStyle = '#50beff';
				ctx.lineWidth = 3;
				ctx.beginPath();
				ctx.moveTo(mxScreen, myScreen);
				for (let i = 1; i <= 6; i++) {
					const amount = i / 7;
					const lx = mxScreen + (px - mxScreen) * amount + Math.sin(t * 24 + i * 1.7) * 22;
					const ly = myScreen + (py - myScreen) * amount + Math.cos(t * 21 + i * 1.2) * 22;
					ctx.lineTo(lx, ly);
				}
				ctx.lineTo(px, py);
				ctx.stroke();
				ctx.lineWidth = 1;
			}
		} else if (this.kind === 'ember_wraith') {
			const phase = this.powerPhase(200);
			if (phase < 0.58 && distance < 175) {
				const bx = this.rect.centerx - cameraX;
				const by = this.rect.centery - cameraY;
				ctx.strokeStyle = 'rgba(255,80,160,0.5)';
				ctx.lineWidth = 2;
				for (let r = 40; r <= 100; r += 20) {
					ctx.beginPath();
					ctx.arc(bx, by, r + Math.sin(t * 5) * 5, 0, Math.PI * 2);
					ctx.stroke();
				}
				ctx.lineWidth = 1;
			}
		}
	}
}

// -----------------------------
// Enemy Spawning
// -----------------------------
function spawnEnemyBatch(level, enemies, totalSpawned, batchSize = SPAWN_BATCH_SIZE) {
	const kinds = ['ash_wyvern', 'venom_drake', 'obsidian_gargoyle', 'ember_wraith', 'storm_screecher', 'crystal_basilisk'];
	let spawnedNow = 0;
	const enemyGoal = levelEnemyGoal(level.levelNumber);

	while (spawnedNow < batchSize && totalSpawned < enemyGoal && level.enemySpawnSpots.length > 0) {
		const [tx, ty] = level.enemySpawnSpots.shift();
		const kind = level.rng.choice(kinds);
		const enemy = new Enemy(kind, tx * TILE, ty * TILE);

		if (enemy.grounded) {
			let groundTy = ty;
			while (groundTy < LEVEL_H - 3 && !level.isSolid(tx, groundTy + 1)) {
				groundTy++;
			}
			enemy.rect.x = tx * TILE;
			enemy.rect.bottom = (groundTy + 1) * TILE;
			enemy.x = enemy.rect.x;
			enemy.y = enemy.rect.y;
			enemy.vy = 0;
			enemy.onGround = true;
		}

		enemies.push(enemy);
		spawnedNow++;
		totalSpawned++;
	}

	return totalSpawned;
}

function assignActiveAttackers(enemies, player) {
	const living = enemies.filter(e => e.alive && e.frozenTimer <= 0);
	living.sort((a, b) => dist(a.rect.center, player.rect.center) - dist(b.rect.center, player.rect.center));
	const attackers = new Set(living.slice(0, ACTIVE_ATTACKER_LIMIT));

	for (const enemy of enemies) {
		enemy.canAttack = attackers.has(enemy);
	}
}

// -----------------------------
// Main Game
// -----------------------------
export function createGame(canvas) {
	const ctx = canvas.getContext('2d');

	let currentLevel = 1;
	let gameState = 'playing';

	let level, player, enemies, totalSpawned, spawnTimer;
	let iceShards = [];
	let cameraX = 0;
	let cameraY = 0;
	let timeAlive = 0;

	const keys = {
		left: false,
		right: false,
		up: false,
		down: false,
		space: false
	};

	let spaceJustPressed = false;
	let animationId = null;

	function newGame(levelNumber = 1) {
		level = new Level(null, levelNumber);
		player = new Player(level.spawn);
		enemies = [];
		totalSpawned = 0;
		spawnTimer = 0;
		totalSpawned = spawnEnemyBatch(level, enemies, totalSpawned);
		iceShards = [];
		cameraX = 0;
		cameraY = 0;
		timeAlive = 0;
	}

	function handleKeyDown(e) {
		// Prevent page scrolling for game controls
		const gameKeys = ['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', ' ', 'w', 'W', 'a', 'A', 's', 'S', 'd', 'D'];
		if (gameKeys.includes(e.key)) {
			e.preventDefault();
		}

		if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') keys.left = true;
		if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') keys.right = true;
		if (e.key === 'ArrowUp' || e.key === 'w' || e.key === 'W') {
			keys.up = true;
			if (gameState === 'playing') player.jump();
		}
		if (e.key === 'ArrowDown' || e.key === 's' || e.key === 'S') keys.down = true;
		if (e.key === ' ') {
			if (!keys.space) {
				spaceJustPressed = true;
			}
			keys.space = true;
		}
		if (e.key === 'r' || e.key === 'R') {
			currentLevel = 1;
			gameState = 'playing';
			newGame(currentLevel);
		}
	}

	function handleKeyUp(e) {
		if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') keys.left = false;
		if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') keys.right = false;
		if (e.key === 'ArrowUp' || e.key === 'w' || e.key === 'W') keys.up = false;
		if (e.key === 'ArrowDown' || e.key === 's' || e.key === 'S') keys.down = false;
		if (e.key === ' ') {
			keys.space = false;
			player.spaceHoldFrames = 0;
		}
	}

	function drawWinScreen(t) {
		ctx.fillStyle = '#05080f';
		ctx.fillRect(0, 0, WIDTH, HEIGHT);

		// Stars
		for (let i = 0; i < 120; i++) {
			const x = (i * 97 + Math.floor(t * 20)) % WIDTH;
			const y = (i * 53 + Math.floor(Math.sin(t + i) * 20)) % HEIGHT;
			const b = 120 + noise(i, Math.floor(t * 10)) % 120;
			ctx.fillStyle = `rgb(${b},${b},${Math.min(255, b + 30)})`;
			ctx.beginPath();
			ctx.arc(x, y, 1, 0, Math.PI * 2);
			ctx.fill();
		}

		// Glow
		const gradient = ctx.createRadialGradient(WIDTH / 2, HEIGHT / 2 - 40, 0, WIDTH / 2, HEIGHT / 2 - 40, 260);
		gradient.addColorStop(0, 'rgba(80,190,255,0.3)');
		gradient.addColorStop(1, 'rgba(80,190,255,0)');
		ctx.fillStyle = gradient;
		ctx.fillRect(0, 0, WIDTH, HEIGHT);

		ctx.fillStyle = '#ebffff';
		ctx.font = 'bold 54px monospace';
		ctx.textAlign = 'center';
		ctx.fillText('YOU WIN!', WIDTH / 2, HEIGHT / 2 - 100);

		ctx.fillStyle = '#a0e6ff';
		ctx.font = '30px monospace';
		ctx.fillText('The Blue Ice Lizard escaped Storm Peak.', WIDTH / 2, HEIGHT / 2 - 40);

		ctx.fillStyle = '#e6f0ff';
		ctx.font = '21px monospace';
		ctx.fillText('You cleared all 5 glacier levels.', WIDTH / 2, HEIGHT / 2 + 10);

		ctx.fillStyle = '#bed2e6';
		ctx.font = '15px monospace';
		ctx.fillText('Press R to play again from Level 1', WIDTH / 2, HEIGHT / 2 + 70);
	}

	function drawUI() {
		ctx.fillStyle = '#000000';
		ctx.fillRect(0, 0, WIDTH, 76);
		ctx.fillStyle = '#23232d';
		ctx.fillRect(0, 72, WIDTH, 4);

		let status = 'OK';
		if (player.burnTimer > 0 && player.poisonTimer > 0) {
			status = 'BURNING + POISONED';
		} else if (player.burnTimer > 0) {
			status = 'BURNING';
		} else if (player.poisonTimer > 0) {
			status = 'POISONED - SLOWED';
		}

		const frozenCount = enemies.filter(e => e.frozenTimer > 0).length;
		const activeAttackers = enemies.filter(e => e.canAttack && e.frozenTimer <= 0).length;
		const enemyGoal = levelEnemyGoal(level.levelNumber);

		ctx.fillStyle = '#ebebf5';
		ctx.font = '21px monospace';
		ctx.textAlign = 'left';
		ctx.fillText(
			`Level ${level.levelNumber}/${MAX_LEVELS}: ${levelTitle(level.levelNumber)}   Health: ${player.health}   Status: ${status}   Enemies: ${enemies.length}`,
			14, 26
		);

		ctx.fillStyle = '#bec8d7';
		ctx.font = '15px monospace';
		ctx.fillText(
			`Active: ${activeAttackers}/${ACTIVE_ATTACKER_LIMIT}   Frozen: ${frozenCount}   Next batch: ${Math.max(0, Math.floor((SPAWN_INTERVAL_FRAMES - spawnTimer) / FPS))}s   Spawned: ${totalSpawned}/${enemyGoal}`,
			14, 46
		);

		ctx.fillStyle = '#b4b9c8';
		ctx.fillText(
			'Move: A/D/Arrows | Down: duck | Jump: W/Up | Tap Space: ice | Hold Space: auto-target | R: restart',
			14, 66
		);
	}

	function gameLoop() {
		const dt = 1 / FPS;
		timeAlive += dt;

		if (gameState === 'win') {
			drawWinScreen(timeAlive);
			animationId = requestAnimationFrame(gameLoop);
			return;
		}

		// Enemy waves
		const enemyGoal = levelEnemyGoal(level.levelNumber);
		if (totalSpawned < enemyGoal) {
			spawnTimer++;
			if (spawnTimer >= SPAWN_INTERVAL_FRAMES) {
				spawnTimer = 0;
				totalSpawned = spawnEnemyBatch(level, enemies, totalSpawned);
			}
		}

		assignActiveAttackers(enemies, player);

		// Shooting
		if (spaceJustPressed && gameState === 'playing') {
			player.spaceHoldFrames = 1;
			iceShards.push(...player.shootIce(enemies, false));
			spaceJustPressed = false;
		}

		if (keys.space) {
			player.spaceHoldFrames++;
			if (player.spaceHoldFrames >= AUTO_TARGET_HOLD_FRAMES) {
				iceShards.push(...player.shootIce(enemies, true));
			}
		}

		// Update player
		const prevPlayerBottom = player.rect.bottom;
		player.update(keys, level);

		// Frozen enemies as platforms
		if (!keys.down) {
			for (const enemy of enemies) {
				if (enemy.frozenTimer > 0 && player.vy >= 0) {
					const horizontalOverlap = player.rect.right > enemy.rect.left + 8 && player.rect.left < enemy.rect.right - 8;
					const fallingOntoTop = prevPlayerBottom <= enemy.rect.top + 8 && player.rect.bottom >= enemy.rect.top;

					if (horizontalOverlap && fallingOntoTop) {
						player.rect.bottom = enemy.rect.top;
						player.y = player.rect.y;
						player.vy = 0;
						player.onGround = true;
						player.doubleJumps = 1;
					}
				}
			}
		}

		// Update ice shards
		for (const shard of iceShards) {
			shard.update(level);
			for (const enemy of enemies) {
				if (enemy.alive && shard.alive && shard.rect.colliderect(enemy.rect)) {
					enemy.freeze();
					shard.alive = false;
					break;
				}
			}
		}
		iceShards = iceShards.filter(s => s.alive);

		// Update enemies
		for (const enemy of enemies) {
			enemy.update(level, player);
		}
		enemies = enemies.filter(e => e.alive);
		assignActiveAttackers(enemies, player);

		// Player/enemy collisions
		for (const enemy of enemies) {
			if (enemy.frozenTimer > 0 || !enemy.canAttack) continue;

			const touchingBody = player.rect.colliderect(enemy.rect);
			const touchingTail = player.rect.colliderect(enemy.tailHitbox());

			if (touchingBody || touchingTail) {
				if (touchingTail) player.poison();
				else player.hurt();
			}

			enemy.applyPowerToPlayer(player);
		}

		// Portal / level advance
		if (player.rect.colliderect(level.exitRect)) {
			if (currentLevel >= MAX_LEVELS) {
				gameState = 'win';
				iceShards = [];
			} else {
				currentLevel++;
				newGame(currentLevel);
			}
		}

		// Camera
		const targetX = player.rect.centerx - WIDTH / 2;
		const targetY = player.rect.centery - HEIGHT / 2;
		const maxCameraX = Math.max(0, LEVEL_W * TILE - WIDTH);
		const maxCameraY = Math.max(0, LEVEL_H * TILE - HEIGHT);

		cameraX += (targetX - cameraX) * 0.12;
		cameraY += (targetY - cameraY) * 0.12;
		cameraX = clamp(cameraX, 0, maxCameraX);
		cameraY = clamp(cameraY, 0, maxCameraY);

		// Draw
		level.draw(ctx, cameraX, cameraY, timeAlive);

		for (const shard of iceShards) {
			shard.draw(ctx, cameraX, cameraY, timeAlive);
		}

		for (const enemy of enemies) {
			enemy.draw(ctx, cameraX, cameraY, timeAlive, player);
		}

		player.draw(ctx, cameraX, cameraY, timeAlive);
		drawUI();

		animationId = requestAnimationFrame(gameLoop);
	}

	function start() {
		canvas.width = WIDTH;
		canvas.height = HEIGHT;
		newGame(currentLevel);

		window.addEventListener('keydown', handleKeyDown);
		window.addEventListener('keyup', handleKeyUp);

		animationId = requestAnimationFrame(gameLoop);
	}

	function stop() {
		if (animationId) {
			cancelAnimationFrame(animationId);
			animationId = null;
		}
		window.removeEventListener('keydown', handleKeyDown);
		window.removeEventListener('keyup', handleKeyUp);
	}

	return { start, stop };
}
