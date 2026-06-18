import pygame
import random
import math
import sys

pygame.init()

# -----------------------------
# Settings
# -----------------------------
WIDTH, HEIGHT = 960, 640
TILE = 32
FPS = 60

LEVEL_W = 165
LEVEL_H = 45

GRAVITY = 0.7
MAX_FALL = 18

SHARD_TARGET_RADIUS = 340
FREEZE_TIME = FPS * 7

POISON_SLOW_TIME = FPS * 10
BURN_TIME = FPS * 10

TOTAL_ENEMIES = 50
SPAWN_BATCH_SIZE = 5
SPAWN_INTERVAL_FRAMES = FPS * 15
ACTIVE_ATTACKER_LIMIT = 2

AUTO_TARGET_HOLD_FRAMES = 12
TAIL_LASH_FRAMES = FPS * 5

MAX_LEVELS = 5

# These enemy types cannot fly.
# light blue = crystal_basilisk
# green = venom_drake
# brown/orange = ash_wyvern
NON_FLYING_ENEMY_KINDS = {
    "crystal_basilisk",
    "venom_drake",
    "ash_wyvern",
}

screen = pygame.display.set_mode((WIDTH, HEIGHT))
pygame.display.set_caption("Blue Ice Lizard vs Glacier Monsters")
clock = pygame.time.Clock()

FONT = pygame.font.SysFont("consolas", 21)
SMALL_FONT = pygame.font.SysFont("consolas", 15)
BIG_FONT = pygame.font.SysFont("consolas", 54)
MID_FONT = pygame.font.SysFont("consolas", 30)


# -----------------------------
# Helper functions
# -----------------------------
def clamp(v, lo, hi):
    return max(lo, min(hi, v))


def sign(v):
    if v < 0:
        return -1
    if v > 0:
        return 1
    return 0


def dist(a, b):
    return math.hypot(a[0] - b[0], a[1] - b[1])


def noise(x, y):
    return (x * 928371 + y * 12377) & 255


def level_enemy_goal(level_number):
    return min(TOTAL_ENEMIES + (level_number - 1) * 5, 75)


def level_title(level_number):
    names = {
        1: "Frozen Pass",
        2: "Crystal Caverns",
        3: "Poison Glacier",
        4: "Ember Icefields",
        5: "Storm Peak",
    }

    return names.get(level_number, f"Level {level_number}")


def draw_text_center(surf, font, text, y, color):
    img = font.render(text, True, color)
    rect = img.get_rect(center=(WIDTH // 2, y))
    surf.blit(img, rect)


# -----------------------------
# Level
# -----------------------------
class Level:
    def __init__(self, seed=None, level_number=1):
        self.level_number = level_number

        self.seed = seed if seed is not None else random.randint(1, 9999999)
        self.rng = random.Random(self.seed)

        self.grid = [["." for _ in range(LEVEL_W)] for _ in range(LEVEL_H)]
        self.route_clear = set()
        self.safe_hazards = set()

        self.spawn = (4 * TILE, 34 * TILE)
        self.exit_rect = pygame.Rect(0, 0, TILE, TILE)
        self.enemy_spawn_spots = []

        self.generate()
        self.enemy_spawn_spots = self.find_enemy_spawn_spots()

    def inside(self, tx, ty):
        return 0 <= tx < LEVEL_W and 0 <= ty < LEVEL_H

    def is_solid(self, tx, ty):
        if not self.inside(tx, ty):
            return True

        return self.grid[ty][tx] == "#"

    def place_solid(self, tx, ty, force=False):
        if not self.inside(tx, ty):
            return

        if not force and (tx, ty) in self.route_clear:
            return

        if self.grid[ty][tx] != "X":
            self.grid[ty][tx] = "#"

    def make_platform(self, x, y, length, safe=False):
        for xx in range(x, x + length):
            if 1 <= xx < LEVEL_W - 1 and 2 <= y < LEVEL_H - 2:
                self.place_solid(xx, y, force=safe)
                self.place_solid(xx, y + 1, force=safe)

        if safe:
            for xx in range(x - 2, x + length + 3):
                for yy in range(y - 6, y):
                    if self.inside(xx, yy):
                        self.route_clear.add((xx, yy))

            for xx in range(x, x + length):
                self.safe_hazards.add((xx, y - 1))

    def generate(self):
        # Borders
        for y in range(LEVEL_H):
            self.grid[y][0] = "#"
            self.grid[y][LEVEL_W - 1] = "#"

        # Bottom floor
        for x in range(LEVEL_W):
            self.grid[LEVEL_H - 1][x] = "#"
            self.grid[LEVEL_H - 2][x] = "#"

        route = []

        start_y = 37
        self.make_platform(2, start_y, 14, safe=True)
        self.spawn = (4 * TILE, start_y * TILE - 54)
        route.append((2, start_y, 14))

        x = 10
        y = start_y
        vertical_dir = -1
        turn_streak = 0

        # Main route
        while x < LEVEL_W - 25:
            if y <= 10:
                vertical_dir = 1
                turn_streak = 0
            elif y >= 36:
                vertical_dir = -1
                turn_streak = 0
            elif turn_streak >= self.rng.randint(2, 4) or self.rng.random() < 0.28:
                vertical_dir *= -1
                turn_streak = 0

            style = self.rng.random()

            if style < 0.42:
                nx = x + self.rng.randint(3, 5)
                ny = clamp(y + vertical_dir * self.rng.choice([3, 4, 5]), 8, 37)
                length = self.rng.randint(4, 7)

            elif style < 0.68:
                nx = x + self.rng.randint(4, 6)
                ny = clamp(y + self.rng.choice([-2, -1, 0, 1, 2]), 8, 37)
                length = self.rng.randint(3, 6)

            else:
                nx = x + self.rng.randint(5, 8)
                ny = clamp(y + vertical_dir * self.rng.choice([1, 2, 3]), 8, 37)
                length = self.rng.randint(7, 11)

            self.make_platform(nx, ny, length, safe=True)
            route.append((nx, ny, length))

            x = nx + self.rng.randint(1, 3)
            y = ny
            turn_streak += 1

            if self.rng.random() < 0.20 and x < LEVEL_W - 28:
                vertical_dir *= -1

                nx = x + self.rng.randint(3, 5)
                ny = clamp(y + vertical_dir * self.rng.choice([3, 4]), 8, 37)
                length = self.rng.randint(4, 7)

                self.make_platform(nx, ny, length, safe=True)
                route.append((nx, ny, length))

                x = nx + self.rng.randint(1, 3)
                y = ny
                turn_streak = 1

        # Exit portal
        ex, ey, elen = route[-1]
        exit_tx = ex + elen // 2
        exit_ty = ey - 1

        self.grid[exit_ty][exit_tx] = "X"
        self.exit_rect = pygame.Rect(exit_tx * TILE, exit_ty * TILE, TILE, TILE)

        # Fake branches scale with level
        fake_branch_count = min(55 + self.level_number * 8, 100)

        for _ in range(fake_branch_count):
            if len(route) < 8:
                break

            bx, by, blen = self.rng.choice(route[3:-3])
            fx = bx + self.rng.randint(-2, blen + 3)
            fy = clamp(by + self.rng.choice([-7, -6, -5, 5, 6, 7]), 8, 37)

            branch_dir = self.rng.choice([-1, 1])

            for _ in range(self.rng.randint(2, 5)):
                fx += self.rng.randint(3, 7)
                fy = clamp(fy + branch_dir * self.rng.choice([-3, -2, 0, 2, 3]), 8, 37)

                if fx < 18 and fy > 30:
                    continue

                self.make_platform(fx, fy, self.rng.randint(3, 8), safe=False)

                if self.rng.random() < 0.35:
                    branch_dir *= -1

        # Extra platforms
        extra_platform_count = min(120 + self.level_number * 10, 190)

        for _ in range(extra_platform_count):
            px = self.rng.randint(4, LEVEL_W - 14)
            py = self.rng.randint(7, LEVEL_H - 6)
            length = self.rng.randint(3, 13)

            for xx in range(px, px + length):
                self.place_solid(xx, py)

                if self.rng.random() < 0.45:
                    self.place_solid(xx, py + 1)

        # Maze walls
        wall_count = min(55 + self.level_number * 7, 100)

        for _ in range(wall_count):
            wx = self.rng.randint(8, LEVEL_W - 8)
            wy = self.rng.randint(7, LEVEL_H - 12)
            height = self.rng.randint(3, 10)

            if wx < 18 and wy > 28:
                continue

            for yy in range(wy, wy + height):
                self.place_solid(wx, yy)

        # Ceiling chunks
        ceiling_count = min(45 + self.level_number * 6, 90)

        for _ in range(ceiling_count):
            cx = self.rng.randint(5, LEVEL_W - 8)
            cy = self.rng.randint(4, LEVEL_H - 15)
            length = self.rng.randint(2, 8)

            for xx in range(cx, cx + length):
                self.place_solid(xx, cy)

        # Restore exit portal
        self.grid[exit_ty][exit_tx] = "X"

        # Hazards
        ground_spots = []

        for ty in range(2, LEVEL_H - 2):
            for tx in range(2, LEVEL_W - 2):
                if self.grid[ty][tx] == "." and self.grid[ty + 1][tx] == "#":
                    if (tx, ty) not in self.safe_hazards and not (tx < 18 and ty > 30):
                        ground_spots.append((tx, ty))

        self.rng.shuffle(ground_spots)

        spike_count = min(70 + self.level_number * 10, 130)

        for tx, ty in ground_spots[:spike_count]:
            if self.grid[ty][tx] == ".":
                self.grid[ty][tx] = "S"

        lava_count = min(25 + self.level_number * 6, 60)

        for _ in range(lava_count):
            if not ground_spots:
                break

            tx, ty = self.rng.choice(ground_spots)
            pool_len = self.rng.randint(2, 5)

            for xx in range(tx, tx + pool_len):
                if 1 <= xx < LEVEL_W - 1:
                    if self.grid[ty][xx] == "." and self.grid[ty + 1][xx] == "#":
                        if (xx, ty) not in self.safe_hazards:
                            self.grid[ty][xx] = "L"

    def find_enemy_spawn_spots(self):
        spots = []

        for ty in range(5, LEVEL_H - 5):
            for tx in range(5, LEVEL_W - 5):
                if self.grid[ty][tx] != ".":
                    continue

                world_x = tx * TILE
                world_y = ty * TILE

                if abs(world_x - self.spawn[0]) < 650 and abs(world_y - self.spawn[1]) < 350:
                    continue

                clear = True

                for yy in range(ty - 2, ty + 3):
                    for xx in range(tx - 2, tx + 3):
                        if not self.inside(xx, yy):
                            clear = False
                        elif self.grid[yy][xx] == "#":
                            clear = False

                if clear:
                    spots.append((tx, ty))

        self.rng.shuffle(spots)
        return spots

    def solid_rects(self, rect):
        rects = []

        tx1 = max(0, rect.left // TILE - 1)
        tx2 = min(LEVEL_W - 1, rect.right // TILE + 1)
        ty1 = max(0, rect.top // TILE - 1)
        ty2 = min(LEVEL_H - 1, rect.bottom // TILE + 1)

        for ty in range(ty1, ty2 + 1):
            for tx in range(tx1, tx2 + 1):
                if self.grid[ty][tx] == "#":
                    rects.append(pygame.Rect(tx * TILE, ty * TILE, TILE, TILE))

        return rects

    def hazard_rects(self, rect):
        rects = []

        tx1 = max(0, rect.left // TILE - 1)
        tx2 = min(LEVEL_W - 1, rect.right // TILE + 1)
        ty1 = max(0, rect.top // TILE - 1)
        ty2 = min(LEVEL_H - 1, rect.bottom // TILE + 1)

        for ty in range(ty1, ty2 + 1):
            for tx in range(tx1, tx2 + 1):
                cell = self.grid[ty][tx]

                if cell == "S":
                    rects.append(pygame.Rect(tx * TILE + 5, ty * TILE + 8, TILE - 10, TILE - 8))

                elif cell == "L":
                    rects.append(pygame.Rect(tx * TILE, ty * TILE + 8, TILE, TILE - 8))

        return rects

    def draw_background(self, surf, camera_x, camera_y, t):
        surf.fill((9, 13, 28))

        pygame.draw.rect(surf, (12, 20, 42), (0, 0, WIDTH, HEIGHT))
        pygame.draw.rect(surf, (8, 12, 26), (0, HEIGHT // 2, WIDTH, HEIGHT // 2))

        offset = int(camera_x * 0.12) % WIDTH

        for base_x in range(-WIDTH, WIDTH * 2, 220):
            x = base_x - offset

            peak = [
                (x, HEIGHT - 120),
                (x + 110, HEIGHT - 350),
                (x + 240, HEIGHT - 120),
            ]

            snow = [
                (x + 110, HEIGHT - 350),
                (x + 76, HEIGHT - 280),
                (x + 130, HEIGHT - 300),
            ]

            pygame.draw.polygon(surf, (22, 38, 66), peak)
            pygame.draw.polygon(surf, (35, 62, 92), snow)

        for i in range(90):
            x = (i * 137 + int(t * 14)) % WIDTH
            y = (i * 73 + int(camera_y * 0.05)) % HEIGHT
            b = 130 + noise(i, int(t * 10)) % 90
            pygame.draw.circle(surf, (b, b, min(255, b + 25)), (x, y), 1)

    def draw_tile_ice(self, surf, sx, sy, tx, ty):
        shade = 58 + noise(tx, ty) % 38
        main = (shade, shade + 18, shade + 38)

        pygame.draw.rect(surf, main, (sx, sy, TILE, TILE))
        pygame.draw.rect(surf, (24, 42, 65), (sx, sy, TILE, TILE), 1)
        pygame.draw.line(surf, (190, 245, 255), (sx + 3, sy + 4), (sx + TILE - 4, sy + 4), 1)

        if noise(tx + 9, ty + 4) % 4 == 0:
            pygame.draw.line(surf, (120, 200, 235), (sx + 8, sy + 11), (sx + 18, sy + 19), 1)
            pygame.draw.line(surf, (120, 200, 235), (sx + 18, sy + 19), (sx + 14, sy + 27), 1)

    def draw_spike(self, surf, sx, sy):
        spike = [
            (sx + TILE // 2, sy + 4),
            (sx + 5, sy + TILE - 3),
            (sx + TILE - 5, sy + TILE - 3),
        ]

        pygame.draw.polygon(surf, (210, 235, 245), spike)
        pygame.draw.polygon(surf, (70, 95, 115), spike, 2)
        pygame.draw.line(
            surf,
            (250, 255, 255),
            (sx + TILE // 2, sy + 7),
            (sx + TILE // 2 - 5, sy + TILE - 7),
            1,
        )

    def draw_lava(self, surf, sx, sy, tx, ty, t):
        glow = pygame.Surface((TILE + 36, TILE + 36), pygame.SRCALPHA)
        pulse = 70 + int(35 * math.sin(t * 5 + tx * 0.4))

        pygame.draw.ellipse(glow, (255, 75, 15, pulse), (0, 0, TILE + 36, TILE + 36))
        pygame.draw.ellipse(glow, (255, 180, 50, int(pulse * 0.45)), (8, 8, TILE + 20, TILE + 20))
        surf.blit(glow, (sx - 18, sy - 18))

        pygame.draw.rect(surf, (70, 14, 8), (sx, sy, TILE, TILE))
        pygame.draw.rect(surf, (130, 24, 8), (sx, sy + 4, TILE, TILE - 4))

        for i in range(4):
            wave_y = sy + 8 + i * 6 + math.sin(t * 4.5 + tx * 0.7 + i) * 2

            color = [
                (255, 66, 12),
                (255, 115, 20),
                (255, 185, 50),
                (255, 235, 130),
            ][i]

            points = []

            for k in range(6):
                px = sx - 2 + k * 7
                py = wave_y + math.sin(t * 8 + k + i * 2 + tx) * 2
                points.append((int(px), int(py)))

            pygame.draw.lines(surf, color, False, points, 2)

        for i in range(4):
            bx = sx + 5 + ((tx * 7 + i * 9) % 24)
            by = sy + 22 + math.sin(t * 6 + i + tx) * 5
            pygame.draw.circle(surf, (255, 230, 90), (int(bx), int(by)), 2 + (i % 2))

            if (int(t * 12) + tx + i) % 18 < 4:
                ember_y = by - ((int(t * 30) + i * 7) % 22)
                pygame.draw.circle(surf, (255, 180, 60), (int(bx), int(ember_y)), 1)

    def draw_portal(self, surf, sx, sy, t):
        pygame.draw.rect(surf, (22, 18, 55), (sx, sy, TILE, TILE))

        cx = sx + TILE // 2
        cy = sy + TILE // 2
        pulse = 4 + int(math.sin(t * 6) * 3)

        pygame.draw.circle(surf, (80, 190, 255), (cx, cy), 15 + pulse, 2)
        pygame.draw.circle(surf, (180, 245, 255), (cx, cy), 9, 2)
        pygame.draw.circle(surf, (245, 255, 255), (cx, cy), 4)

        for i in range(5):
            angle = t * 3 + i * math.pi * 2 / 5
            px = cx + math.cos(angle) * 14
            py = cy + math.sin(angle) * 14
            pygame.draw.circle(surf, (130, 220, 255), (int(px), int(py)), 2)

    def draw(self, surf, camera_x, camera_y, t):
        self.draw_background(surf, camera_x, camera_y, t)

        start_tx = max(0, int(camera_x) // TILE - 2)
        end_tx = min(LEVEL_W, int(camera_x + WIDTH) // TILE + 3)

        start_ty = max(0, int(camera_y) // TILE - 2)
        end_ty = min(LEVEL_H, int(camera_y + HEIGHT) // TILE + 3)

        for ty in range(start_ty, end_ty):
            for tx in range(start_tx, end_tx):
                cell = self.grid[ty][tx]

                sx = int(tx * TILE - camera_x)
                sy = int(ty * TILE - camera_y)

                if cell == "#":
                    self.draw_tile_ice(surf, sx, sy, tx, ty)

                elif cell == "S":
                    self.draw_spike(surf, sx, sy)

                elif cell == "L":
                    self.draw_lava(surf, sx, sy, tx, ty, t)

                elif cell == "X":
                    self.draw_portal(surf, sx, sy, t)# -----------------------------
                    # Player
                    # -----------------------------
                    class Player:
                        def __init__(self, spawn):
                            self.spawn = spawn
                    
                            self.stand_w = 30
                            self.stand_h = 46
                            self.duck_w = 38
                            self.duck_h = 28
                    
                            self.rect = pygame.Rect(spawn[0], spawn[1], self.stand_w, self.stand_h)
                            self.x = float(self.rect.x)
                            self.y = float(self.rect.y)
                    
                            self.vx = 0
                            self.vy = 0
                    
                            self.on_ground = False
                            self.double_jumps = 1
                    
                            self.health = 3
                            self.invuln = 0
                    
                            self.facing = 1
                            self.shoot_cooldown = 0
                            self.space_hold_frames = 0
                    
                            self.ducking = False
                    
                            self.poison_timer = 0
                            self.poison_tick = 0
                    
                            self.burn_timer = 0
                            self.burn_tick = 0
                    
                        def mouth_pos(self):
                            if self.ducking:
                                return self.rect.centerx + self.facing * 30, self.rect.top + 10
                    
                            return self.rect.centerx + self.facing * 26, self.rect.top + 15
                    
                        def respawn(self):
                            self.rect.x, self.rect.y = self.spawn
                            self.rect.width = self.stand_w
                            self.rect.height = self.stand_h
                            self.ducking = False
                    
                            self.x = float(self.rect.x)
                            self.y = float(self.rect.y)
                    
                            self.vx = 0
                            self.vy = 0
                            self.on_ground = False
                            self.double_jumps = 1
                    
                        def lose_health(self):
                            self.health -= 1
                    
                            if self.health <= 0:
                                self.health = 3
                                self.poison_timer = 0
                                self.burn_timer = 0
                    
                            self.invuln = 90
                            self.respawn()
                    
                        def hurt(self):
                            if self.invuln <= 0:
                                self.lose_health()
                    
                        def poison(self):
                            self.poison_timer = max(self.poison_timer, POISON_SLOW_TIME)
                    
                            if self.invuln <= 0:
                                self.lose_health()
                    
                        def burn(self):
                            self.burn_timer = max(self.burn_timer, BURN_TIME)
                    
                            if self.invuln <= 0:
                                self.lose_health()
                    
                        def jump(self):
                            if self.ducking:
                                return
                    
                            if self.on_ground:
                                self.vy = -15
                                self.on_ground = False
                                self.double_jumps = 1
                    
                            elif self.double_jumps > 0:
                                self.vy = -14
                                self.double_jumps -= 1
                    
                        def set_ducking(self, wants_duck, level):
                            old_bottom = self.rect.bottom
                            old_centerx = self.rect.centerx
                    
                            if wants_duck:
                                if not self.ducking:
                                    self.ducking = True
                                    self.rect.width = self.duck_w
                                    self.rect.height = self.duck_h
                                    self.rect.centerx = old_centerx
                                    self.rect.bottom = old_bottom
                                    self.x = float(self.rect.x)
                                    self.y = float(self.rect.y)
                    
                            else:
                                if self.ducking:
                                    test_rect = pygame.Rect(0, 0, self.stand_w, self.stand_h)
                                    test_rect.centerx = old_centerx
                                    test_rect.bottom = old_bottom
                    
                                    blocked = False
                    
                                    for tile in level.solid_rects(test_rect):
                                        if test_rect.colliderect(tile):
                                            blocked = True
                                            break
                    
                                    if not blocked:
                                        self.ducking = False
                                        self.rect = test_rect
                                        self.x = float(self.rect.x)
                                        self.y = float(self.rect.y)
                    
                        def shoot_ice(self, enemies, homing=False):
                            if self.shoot_cooldown > 0:
                                return []
                    
                            self.shoot_cooldown = 10
                            mouth = self.mouth_pos()
                            shards = []
                    
                            if homing:
                                candidates = []
                    
                                for enemy in enemies:
                                    if enemy.alive and enemy.frozen_timer <= 0:
                                        d = dist(mouth, enemy.rect.center)
                    
                                        if d <= SHARD_TARGET_RADIUS:
                                            candidates.append((d, enemy))
                    
                                candidates.sort(key=lambda item: item[0])
                                targets = [item[1] for item in candidates[:2]]
                    
                                if targets:
                                    for target in targets:
                                        shards.append(IceShard(mouth[0], mouth[1], self.facing, target))
                    
                                    return shards
                    
                            shards.append(IceShard(mouth[0], mouth[1], self.facing))
                            return shards
                    
                        def update_status_effects(self):
                            if self.invuln > 0:
                                self.invuln -= 1
                    
                            if self.shoot_cooldown > 0:
                                self.shoot_cooldown -= 1
                    
                            if self.poison_timer > 0:
                                self.poison_timer -= 1
                                self.poison_tick += 1
                    
                                if self.poison_tick >= 120:
                                    self.poison_tick = 0
                    
                                    if self.invuln <= 0:
                                        self.lose_health()
                    
                            if self.burn_timer > 0:
                                self.burn_timer -= 1
                                self.burn_tick += 1
                    
                                if self.burn_tick >= 90:
                                    self.burn_tick = 0
                    
                                    if self.invuln <= 0:
                                        self.lose_health()
                    
                        def update(self, keys, level):
                            self.update_status_effects()
                            self.set_ducking(keys[pygame.K_DOWN], level)
                    
                            move = 0
                    
                            if keys[pygame.K_a] or keys[pygame.K_LEFT]:
                                move -= 1
                    
                            if keys[pygame.K_d] or keys[pygame.K_RIGHT]:
                                move += 1
                    
                            if move != 0:
                                self.facing = move
                    
                            max_speed = 3.1 if self.ducking else 5.5
                            accel = 0.55 if self.ducking else 0.82
                    
                            if self.poison_timer > 0:
                                max_speed *= 0.55
                                accel *= 0.55
                    
                            self.vx += move * accel
                            self.vx = clamp(self.vx, -max_speed, max_speed)
                    
                            if move == 0:
                                self.vx *= 0.82
                    
                                if abs(self.vx) < 0.08:
                                    self.vx = 0
                    
                            self.vy += GRAVITY
                            self.vy = min(self.vy, MAX_FALL)
                    
                            # Horizontal
                            self.x += self.vx
                            self.rect.x = round(self.x)
                    
                            for tile in level.solid_rects(self.rect):
                                if self.rect.colliderect(tile):
                                    if self.vx > 0:
                                        self.rect.right = tile.left
                    
                                    elif self.vx < 0:
                                        self.rect.left = tile.right
                    
                                    self.x = float(self.rect.x)
                                    self.vx = 0
                    
                            # Vertical
                            self.y += self.vy
                            self.rect.y = round(self.y)
                            self.on_ground = False
                    
                            for tile in level.solid_rects(self.rect):
                                if self.rect.colliderect(tile):
                                    if self.vy > 0:
                                        self.rect.bottom = tile.top
                                        self.on_ground = True
                                        self.double_jumps = 1
                    
                                    elif self.vy < 0:
                                        self.rect.top = tile.bottom
                    
                                    self.y = float(self.rect.y)
                                    self.vy = 0
                    
                            for hazard in level.hazard_rects(self.rect):
                                if self.rect.colliderect(hazard):
                                    self.hurt()
                    
                            if self.rect.top > LEVEL_H * TILE:
                                self.hurt()
                    
                        def draw(self, surf, camera_x, camera_y):
                            if self.invuln > 0 and self.invuln % 8 < 4:
                                return
                    
                            sx = self.rect.x - camera_x
                            sy = self.rect.y - camera_y
                            d = self.facing
                    
                            dark = (18, 70, 95)
                            mid = (45, 145, 185)
                            light = (105, 215, 240)
                            belly = (170, 235, 245)
                            scale_dark = (12, 55, 80)
                            scale_light = (145, 235, 250)
                            claw = (235, 245, 235)
                            eye = (230, 210, 70)
                            pupil = (5, 20, 20)
                    
                            if self.ducking:
                                body_h = 22
                                body_w = 47
                                body_y = sy + 8
                                head_y = sy + 8
                                tail_y = sy + 22
                    
                            else:
                                body_h = 27
                                body_w = 42
                                body_y = sy + 17
                                head_y = sy + 13
                                tail_y = sy + 34
                    
                            # Shadow
                            pygame.draw.ellipse(
                                surf,
                                (0, 0, 0),
                                (sx - 18, sy + self.rect.height - 8, 70, 12),
                            )
                    
                            # Tail
                            tail_base = (sx + 13 - d * 5, tail_y)
                            tail_mid = (sx + 4 - d * 32, tail_y + 4)
                            tail_tip = (sx - d * 65, tail_y + 11)
                    
                            pygame.draw.line(surf, scale_dark, tail_base, tail_mid, 13)
                            pygame.draw.line(surf, dark, tail_mid, tail_tip, 8)
                            pygame.draw.circle(surf, mid, (int(tail_tip[0]), int(tail_tip[1])), 4)
                    
                            for i in range(5):
                                amount = i / 4
                    
                                if amount < 0.5:
                                    local = amount / 0.5
                                    px = tail_base[0] + (tail_mid[0] - tail_base[0]) * local
                                    py = tail_base[1] + (tail_mid[1] - tail_base[1]) * local
                    
                                else:
                                    local = (amount - 0.5) / 0.5
                                    px = tail_mid[0] + (tail_tip[0] - tail_mid[0]) * local
                                    py = tail_mid[1] + (tail_tip[1] - tail_mid[1]) * local
                    
                                pygame.draw.circle(surf, scale_light, (int(px), int(py)), max(2, 5 - i), 1)
                    
                            # Body
                            pygame.draw.ellipse(surf, dark, (sx - 2, body_y, body_w, body_h))
                            pygame.draw.ellipse(surf, mid, (sx + 2, body_y + 1, body_w - 7, body_h - 3))
                            pygame.draw.ellipse(surf, belly, (sx + 9, body_y + body_h // 2, body_w - 22, body_h // 2))
                    
                            scale_positions = [
                                (sx + 6, body_y + 5),
                                (sx + 13, body_y + 3),
                                (sx + 20, body_y + 5),
                                (sx + 27, body_y + 7),
                                (sx + 9, body_y + 12),
                                (sx + 17, body_y + 11),
                                (sx + 25, body_y + 13),
                                (sx + 32, body_y + 14),
                            ]
                    
                            for i, pos in enumerate(scale_positions):
                                col = scale_light if i % 3 == 0 else scale_dark
                                pygame.draw.ellipse(surf, col, (pos[0], pos[1], 6, 4))
                                pygame.draw.arc(surf, (5, 35, 55), (pos[0], pos[1], 6, 4), 0, math.pi, 1)
                    
                            # Ice crest
                            crest_count = 4 if not self.ducking else 3
                    
                            for i in range(crest_count):
                                px = sx + 5 + i * 9
                                spike_h = 13 - i
                    
                                spike = [
                                    (px, body_y + 4),
                                    (px + 5, body_y - spike_h),
                                    (px + 10, body_y + 4),
                                ]
                    
                                pygame.draw.polygon(surf, (215, 250, 255), spike)
                                pygame.draw.polygon(surf, dark, spike, 1)
                    
                            # Legs and claws
                            if self.ducking:
                                leg_y = sy + 25
                                pygame.draw.line(surf, dark, (sx + 8, sy + 23), (sx - 20, leg_y + 2), 5)
                                pygame.draw.line(surf, dark, (sx + 30, sy + 22), (sx + 58, leg_y + 2), 5)
                                feet = [(sx - 20, leg_y + 2), (sx + 58, leg_y + 2)]
                    
                            else:
                                leg_y = sy + 42
                                pygame.draw.line(surf, dark, (sx + 8, sy + 34), (sx - 14, leg_y + 2), 5)
                                pygame.draw.line(surf, dark, (sx + 29, sy + 33), (sx + 54, leg_y + 1), 5)
                                feet = [(sx - 14, leg_y + 2), (sx + 54, leg_y + 1)]
                    
                            for foot in feet:
                                for i in range(3):
                                    pygame.draw.line(
                                        surf,
                                        claw,
                                        foot,
                                        (foot[0] + d * (5 + i * 4), foot[1] + 3 + i),
                                        1,
                                    )
                    
                            # Neck/head/snout
                            neck = pygame.Rect(int(sx + 25 - d * 4), int(head_y + 8), 16, 13)
                            pygame.draw.ellipse(surf, mid, neck)
                    
                            head_x = sx + 28 + d * 17
                            pygame.draw.ellipse(surf, light, (head_x - 13, head_y - 7, 27, 21))
                    
                            snout = [
                                (head_x + d * 4, head_y - 4),
                                (head_x + d * 31, head_y),
                                (head_x + d * 7, head_y + 10),
                            ]
                    
                            pygame.draw.polygon(surf, light, snout)
                            pygame.draw.polygon(surf, dark, snout, 1)
                    
                            jaw = [
                                (head_x + d * 7, head_y + 8),
                                (head_x + d * 27, head_y + 3),
                                (head_x + d * 8, head_y + 13),
                            ]
                    
                            pygame.draw.polygon(surf, mid, jaw)
                    
                            eye_x = int(head_x + d * 6)
                            eye_y = int(head_y - 2)
                    
                            pygame.draw.ellipse(surf, eye, (eye_x - 4, eye_y - 4, 8, 7))
                            pygame.draw.line(surf, pupil, (eye_x, eye_y - 4), (eye_x, eye_y + 3), 2)
                            pygame.draw.circle(surf, (245, 255, 255), (eye_x + d, eye_y - 2), 1)
                    
                            pygame.draw.circle(surf, (3, 20, 25), (int(head_x + d * 23), int(head_y + 1)), 2)
                    
                            # Mouth frost
                            if self.shoot_cooldown <= 3:
                                mx, my = self.mouth_pos()
                                mx -= camera_x
                                my -= camera_y
                    
                                pygame.draw.circle(surf, (170, 240, 255), (int(mx), int(my)), 4)
                                pygame.draw.circle(surf, (235, 255, 255), (int(mx), int(my)), 2)
                    
                            # Status indicators
                            if self.poison_timer > 0:
                                pygame.draw.circle(surf, (90, 255, 100), (int(sx + 16), int(sy - 7)), 5)
                                pygame.draw.circle(surf, (30, 120, 40), (int(sx + 16), int(sy - 7)), 5, 1)
                    
                            if self.burn_timer > 0:
                                flame_x = int(sx + 25)
                                flame_y = int(sy - 8)
                                flicker = int(math.sin(pygame.time.get_ticks() * 0.02) * 3)
                    
                                outer = [
                                    (flame_x, flame_y - 8 - flicker),
                                    (flame_x - 6, flame_y + 5),
                                    (flame_x + 6, flame_y + 5),
                                ]
                    
                                inner = [
                                    (flame_x, flame_y - 4 - flicker),
                                    (flame_x - 3, flame_y + 4),
                                    (flame_x + 3, flame_y + 4),
                                ]
                    
                                pygame.draw.polygon(surf, (255, 80, 20), outer)
                                pygame.draw.polygon(surf, (255, 210, 80), inner)
                    
                    
                    # -----------------------------
                    # Ice shard
                    # -----------------------------
                    class IceShard:
                        def __init__(self, x, y, direction, target=None):
                            self.direction = direction
                            self.target = target
                    
                            self.rect = pygame.Rect(x, y, 34, 14)
                            self.x = float(self.rect.x)
                            self.y = float(self.rect.y)
                    
                            speed = 13.2
                    
                            if target and target.alive:
                                dx = target.rect.centerx - x
                                dy = target.rect.centery - y
                                length = max(1, math.hypot(dx, dy))
                    
                                self.vx = dx / length * speed
                                self.vy = dy / length * speed
                    
                            else:
                                self.vx = direction * speed
                                self.vy = random.uniform(-0.35, 0.35)
                    
                            self.alive = True
                            self.life = 85
                            self.trail = []
                    
                        def update(self, level):
                            self.life -= 1
                    
                            if self.life <= 0:
                                self.alive = False
                                return
                    
                            if self.target and self.target.alive and self.target.frozen_timer <= 0:
                                dx = self.target.rect.centerx - self.rect.centerx
                                dy = self.target.rect.centery - self.rect.centery
                                length = max(1, math.hypot(dx, dy))
                    
                                desired_vx = dx / length * 13.2
                                desired_vy = dy / length * 13.2
                    
                                self.vx += (desired_vx - self.vx) * 0.16
                                self.vy += (desired_vy - self.vy) * 0.16
                    
                            self.trail.append((self.rect.centerx, self.rect.centery))
                    
                            if len(self.trail) > 10:
                                self.trail.pop(0)
                    
                            self.x += self.vx
                            self.y += self.vy
                    
                            self.rect.x = round(self.x)
                            self.rect.y = round(self.y)
                    
                            for tile in level.solid_rects(self.rect):
                                if self.rect.colliderect(tile):
                                    self.alive = False
                                    return
                    
                        def draw(self, surf, camera_x, camera_y, t):
                            for i, point in enumerate(self.trail):
                                amount = i / max(1, len(self.trail) - 1)
                    
                                tx = point[0] - camera_x
                                ty = point[1] - camera_y
                    
                                pygame.draw.circle(
                                    surf,
                                    (int(120 * amount), int(210 * amount), int(255 * amount)),
                                    (int(tx), int(ty)),
                                    int(2 + amount * 5),
                                )
                    
                            cx = self.rect.centerx - camera_x
                            cy = self.rect.centery - camera_y
                    
                            angle = math.atan2(self.vy, self.vx)
                    
                            def rp(lx, ly):
                                ca = math.cos(angle)
                                sa = math.sin(angle)
                    
                                return (
                                    cx + lx * ca - ly * sa,
                                    cy + lx * sa + ly * ca,
                                )
                    
                            points = [
                                rp(24, 0),
                                rp(10, -7),
                                rp(-17, -5),
                                rp(-25, 0),
                                rp(-17, 5),
                                rp(10, 7),
                            ]
                    
                            pygame.draw.polygon(surf, (210, 245, 255), [(int(x), int(y)) for x, y in points])
                            pygame.draw.polygon(surf, (75, 170, 220), [(int(x), int(y)) for x, y in points], 2)
                    
                            tip = rp(22, 0)
                    
                            pygame.draw.line(
                                surf,
                                (255, 255, 255),
                                (int(cx), int(cy)),
                                (int(tip[0]), int(tip[1])),
                                2,
                            )
                    
                            pygame.draw.circle(
                                surf,
                                (120, 220, 255),
                                (int(cx), int(cy)),
                                18,
                                1,
                            )# -----------------------------
# Enemy
# -----------------------------
class Enemy:
    def __init__(self, kind, x, y):
        self.kind = kind

        sizes = {
            "ash_wyvern": (58, 38),
            "venom_drake": (60, 38),
            "obsidian_gargoyle": (66, 46),
            "ember_wraith": (52, 44),
            "storm_screecher": (54, 34),
            "crystal_basilisk": (62, 40),
        }

        w, h = sizes.get(kind, (58, 38))

        self.rect = pygame.Rect(x, y, w, h)
        self.x = float(self.rect.x)
        self.y = float(self.rect.y)

        self.vx = random.choice([-2.0, 2.0])
        self.vy = random.uniform(-1.0, 1.0)

        self.direction = random.choice([-1, 1])
        self.timer = random.randint(0, 120)

        self.alive = True
        self.frozen_timer = 0

        self.wing_phase = random.uniform(0, math.pi * 2)
        self.tail_phase = random.uniform(0, math.pi * 2)
        self.charge_flash = 0

        self.can_attack = False

        # Grounded enemies cannot fly.
        self.grounded = self.kind in NON_FLYING_ENEMY_KINDS
        self.on_ground = False

    def freeze(self):
        self.frozen_timer = FREEZE_TIME
        self.vx = 0
        self.vy = 0

    def palette(self):
        palettes = {
            "ash_wyvern": {
                "body": (185, 62, 20),
                "wing": (95, 36, 25),
                "glow": (255, 130, 35),
                "eye": (255, 230, 70),
            },
            "venom_drake": {
                "body": (85, 145, 55),
                "wing": (45, 80, 45),
                "glow": (80, 255, 110),
                "eye": (160, 255, 100),
            },
            "obsidian_gargoyle": {
                "body": (75, 70, 72),
                "wing": (45, 44, 50),
                "glow": (255, 80, 35),
                "eye": (255, 85, 45),
            },
            "ember_wraith": {
                "body": (180, 55, 95),
                "wing": (90, 25, 65),
                "glow": (255, 80, 160),
                "eye": (255, 210, 245),
            },
            "crystal_basilisk": {
                "body": (85, 170, 210),
                "wing": (45, 95, 130),
                "glow": (170, 245, 255),
                "eye": (220, 255, 255),
            },
            "storm_screecher": {
                "body": (80, 85, 190),
                "wing": (45, 45, 130),
                "glow": (150, 190, 255),
                "eye": (230, 245, 255),
            },
        }

        return palettes.get(self.kind, palettes["ash_wyvern"])

    def mouth_world_pos(self):
        return self.rect.centerx + self.direction * 50, self.rect.centery - 6

    def power_phase(self, period):
        return (self.timer % period) / period

    def tail_geometry(self):
        d = self.direction
        cx = self.rect.centerx
        cy = self.rect.centery

        phase = (self.timer % TAIL_LASH_FRAMES) / TAIL_LASH_FRAMES

        idle_wave = math.sin(self.timer * 0.08 + self.tail_phase) * 8
        idle_curl = math.sin(self.timer * 0.05 + self.tail_phase) * 6

        if self.frozen_timer > 0 or not self.can_attack:
            lash = idle_wave * 0.25
            curl = idle_curl * 0.25
            snap = 0

        elif phase < 0.23:
            lash_amount = math.sin((phase / 0.23) * math.pi)
            lash = idle_wave + lash_amount * 46
            curl = idle_curl + lash_amount * 24
            snap = lash_amount

        else:
            lash = idle_wave
            curl = idle_curl
            snap = 0

        if self.kind == "venom_drake":
            lash *= 1.25
            curl *= 1.25

        if self.kind == "obsidian_gargoyle":
            lash *= 0.75
            curl *= 0.75

        base = (cx - d * 24, cy + 8)
        mid = (cx - d * (50 + curl * 0.15), cy + 18 + lash * 0.35)
        tip = (cx - d * (80 + curl * 0.4), cy + 7 - lash * 0.45)

        hook_outer = (tip[0] - d * (34 + snap * 12), tip[1] - 22 - curl * 0.25)
        hook_curve = (tip[0] - d * (25 + snap * 8), tip[1] + 4)
        hook_inner = (tip[0] - d * 9, tip[1] + 25 + curl * 0.2)
        barb = (tip[0] + d * 8, tip[1] + 5)

        return base, mid, tip, hook_outer, hook_curve, hook_inner, barb

    def tail_hitbox(self):
        if self.frozen_timer > 0 or not self.can_attack:
            return pygame.Rect(0, 0, 0, 0)

        base, mid, tip, hook_outer, hook_curve, hook_inner, barb = self.tail_geometry()
        points = [tip, hook_outer, hook_curve, hook_inner, barb]

        min_x = min(p[0] for p in points) - 10
        max_x = max(p[0] for p in points) + 10
        min_y = min(p[1] for p in points) - 10
        max_y = max(p[1] for p in points) + 10

        return pygame.Rect(int(min_x), int(min_y), int(max_x - min_x), int(max_y - min_y))

    def power_hitboxes(self, player):
        if self.frozen_timer > 0 or not self.can_attack:
            return []

        hitboxes = []

        px = player.rect.centerx
        py = player.rect.centery
        mx, my = self.mouth_world_pos()

        dx = px - self.rect.centerx
        dy = py - self.rect.centery
        distance = max(1, math.hypot(dx, dy))
        facing_player = sign(dx) == self.direction or abs(dx) < 20

        if self.kind == "ash_wyvern":
            phase = self.power_phase(180)

            if phase < 0.42 and distance < 450 and facing_player:
                flame_w = 190
                flame_h = 96

                if self.direction > 0:
                    rect = pygame.Rect(mx, my - flame_h // 2, flame_w, flame_h)
                else:
                    rect = pygame.Rect(mx - flame_w, my - flame_h // 2, flame_w, flame_h)

                hitboxes.append(("fire", rect))

        elif self.kind == "venom_drake":
            phase = self.power_phase(240)

            if phase < 0.36 and distance < 410 and facing_player:
                length = min(260, distance)
                ux = dx / distance
                uy = dy / distance

                tip_x = mx + ux * length
                tip_y = my + uy * length

                rect = pygame.Rect(
                    int(min(mx, tip_x) - 15),
                    int(min(my, tip_y) - 15),
                    int(abs(tip_x - mx) + 30),
                    int(abs(tip_y - my) + 30),
                )

                hitboxes.append(("tongue", rect))

        elif self.kind == "obsidian_gargoyle":
            phase = self.power_phase(210)

            if phase < 0.25 and distance < 350:
                rect = pygame.Rect(self.rect.centerx - 165, self.rect.bottom - 12, 330, 42)
                hitboxes.append(("shockwave", rect))

        elif self.kind == "ember_wraith":
            phase = self.power_phase(200)

            if phase < 0.58 and distance < 175:
                rect = pygame.Rect(self.rect.centerx - 110, self.rect.centery - 110, 220, 220)
                hitboxes.append(("curse", rect))

        elif self.kind == "crystal_basilisk":
            phase = self.power_phase(190)

            if phase < 0.32 and distance < 370 and facing_player:
                if self.direction > 0:
                    rect = pygame.Rect(self.rect.right, self.rect.centery - 45, 140, 90)
                else:
                    rect = pygame.Rect(self.rect.left - 140, self.rect.centery - 45, 140, 90)

                hitboxes.append(("crystal", rect))

        elif self.kind == "storm_screecher":
            phase = self.power_phase(160)

            if phase < 0.23 and distance < 460 and facing_player:
                rect = pygame.Rect(
                    int(min(mx, px) - 22),
                    int(min(my, py) - 22),
                    int(abs(px - mx) + 44),
                    int(abs(py - my) + 44),
                )

                hitboxes.append(("lightning", rect))

        return hitboxes

    def apply_power_to_player(self, player):
        if not self.can_attack:
            return

        for power_name, hitbox in self.power_hitboxes(player):
            if player.rect.colliderect(hitbox):
                if power_name == "tongue":
                    pull = sign(self.rect.centerx - player.rect.centerx)
                    player.vx += pull * 6.5
                    player.vy -= 3.0
                    player.poison()

                elif power_name == "curse":
                    player.poison()

                elif power_name == "fire":
                    player.burn()

                else:
                    player.hurt()

    def move_and_collide(self, level):
        # Horizontal movement
        self.x += self.vx
        self.rect.x = round(self.x)

        for tile in level.solid_rects(self.rect):
            if self.rect.colliderect(tile):
                if self.vx > 0:
                    self.rect.right = tile.left
                    self.direction = -1

                elif self.vx < 0:
                    self.rect.left = tile.right
                    self.direction = 1

                self.x = float(self.rect.x)

                if self.grounded:
                    self.vx = 0
                else:
                    self.vx *= -0.45

        # Vertical movement
        self.y += self.vy
        self.rect.y = round(self.y)

        if self.grounded:
            self.on_ground = False

        for tile in level.solid_rects(self.rect):
            if self.rect.colliderect(tile):
                if self.vy > 0:
                    self.rect.bottom = tile.top

                    if self.grounded:
                        self.on_ground = True

                elif self.vy < 0:
                    self.rect.top = tile.bottom

                self.y = float(self.rect.y)

                if self.grounded:
                    self.vy = 0
                else:
                    self.vy *= -0.45

    def update(self, level, player):
        self.timer += 1

        if self.charge_flash > 0:
            self.charge_flash -= 1

        if self.frozen_timer > 0:
            self.frozen_timer -= 1
            self.vx = 0
            self.vy = 0
            return

        dx = player.rect.centerx - self.rect.centerx
        dy = player.rect.centery - self.rect.centery
        d = max(1, math.hypot(dx, dy))

        if abs(dx) > 8:
            self.direction = sign(dx)

        # -----------------------------
        # Grounded enemies: no flying
        # -----------------------------
        if self.grounded:
            if self.can_attack:
                if self.kind == "venom_drake":
                    chase_range = 430
                    accel_x = 0.24
                    max_vx = 4.4

                elif self.kind == "crystal_basilisk":
                    chase_range = 420
                    accel_x = 0.20
                    max_vx = 3.8

                elif self.kind == "ash_wyvern":
                    chase_range = 460
                    accel_x = 0.22
                    max_vx = 4.1

                else:
                    chase_range = 420
                    accel_x = 0.20
                    max_vx = 3.8

                if d < chase_range:
                    self.vx += sign(dx) * accel_x

                    if self.timer % 130 == 0:
                        self.vx += self.direction * 3.2
                        self.charge_flash = 18

                    # Ground enemies may jump only if the player is above them.
                    if self.on_ground and dy < -80 and abs(dx) < 220:
                        self.vy = -11.5

                else:
                    self.vx += math.sin(self.timer * 0.035 + self.tail_phase) * 0.08

            else:
                max_vx = 1.6
                self.vx += math.sin(self.timer * 0.025 + self.tail_phase) * 0.05

                if d > 700:
                    self.vx += sign(dx) * 0.06

            if self.on_ground:
                self.vx *= 0.96

            self.vx = clamp(self.vx, -max_vx, max_vx)

            # Gravity makes these enemies fall and stay grounded.
            self.vy += GRAVITY
            self.vy = min(self.vy, MAX_FALL)

            self.move_and_collide(level)

            if self.rect.top > LEVEL_H * TILE:
                self.alive = False

            return

        # -----------------------------
        # Flying enemies
        # -----------------------------
        if self.can_attack:
            if self.kind == "storm_screecher":
                chase_range = 520
                accel_x = 0.31
                accel_y = 0.23
                max_vx = 5.2
                max_vy = 4.2

            elif self.kind == "ember_wraith":
                chase_range = 500
                accel_x = 0.22
                accel_y = 0.20
                max_vx = 4.2
                max_vy = 4.0

            elif self.kind == "obsidian_gargoyle":
                chase_range = 390
                accel_x = 0.16
                accel_y = 0.08
                max_vx = 3.8
                max_vy = 2.8

            else:
                chase_range = 460
                accel_x = 0.26
                accel_y = 0.18
                max_vx = 4.6
                max_vy = 3.7

            if d < chase_range:
                self.vx += (dx / d) * accel_x
                self.vy += (dy / d) * accel_y

                self.vx += math.sin(self.timer * 0.05) * 0.08
                self.vy += math.cos(self.timer * 0.04) * 0.08

                if self.timer % 130 == 0:
                    self.vx += self.direction * 3.5
                    self.charge_flash = 18

            else:
                self.vx += math.sin(self.timer * 0.035) * 0.07
                self.vy += math.cos(self.timer * 0.045) * 0.07

        else:
            max_vx = 1.8
            max_vy = 1.5

            self.vx += math.sin(self.timer * 0.025 + self.tail_phase) * 0.035
            self.vy += math.cos(self.timer * 0.031 + self.wing_phase) * 0.035

            if d > 700:
                self.vx += (dx / d) * 0.04
                self.vy += (dy / d) * 0.03

        self.vx = clamp(self.vx, -max_vx, max_vx)
        self.vy = clamp(self.vy, -max_vy, max_vy)

        self.move_and_collide(level)

        if self.rect.top > LEVEL_H * TILE:
            self.alive = False

    def draw_tail(self, surf, camera_x, camera_y, body_color, glow_color):
        if self.frozen_timer > 0:
            return

        base, mid, tip, hook_outer, hook_curve, hook_inner, barb = self.tail_geometry()

        def cam(p):
            return (p[0] - camera_x, p[1] - camera_y)

        b = cam(base)
        m = cam(mid)
        tp = cam(tip)
        ho = cam(hook_outer)
        hc = cam(hook_curve)
        hi = cam(hook_inner)
        ba = cam(barb)

        pygame.draw.line(surf, (7, 5, 5), b, m, 11)
        pygame.draw.line(surf, (7, 5, 5), m, tp, 9)

        pygame.draw.line(surf, (18, 12, 12), b, m, 8)
        pygame.draw.line(surf, (18, 12, 12), m, tp, 6)

        pygame.draw.line(surf, body_color, b, m, 5)
        pygame.draw.line(surf, body_color, m, tp, 4)

        plate_color = (
            max(0, body_color[0] - 35),
            max(0, body_color[1] - 35),
            max(0, body_color[2] - 35),
        )

        for i in range(8):
            amount = i / 7

            if amount < 0.5:
                local = amount / 0.5
                px = b[0] + (m[0] - b[0]) * local
                py = b[1] + (m[1] - b[1]) * local

            else:
                local = (amount - 0.5) / 0.5
                px = m[0] + (tp[0] - m[0]) * local
                py = m[1] + (tp[1] - m[1]) * local

            size = max(3, int(7 - i * 0.45))

            pygame.draw.circle(surf, plate_color, (int(px), int(py)), size)
            pygame.draw.circle(surf, (20, 15, 15), (int(px), int(py)), size, 1)

        hook_shape = [tp, ho, hc, hi, ba]

        pygame.draw.polygon(surf, glow_color, hook_shape)
        pygame.draw.polygon(surf, (5, 35, 15), hook_shape, 3)

        fang = [
            tp,
            (tp[0] - self.direction * 13, tp[1] + 8),
            (tp[0] - self.direction * 3, tp[1] + 21),
        ]

        pygame.draw.polygon(surf, (230, 255, 230), fang)
        pygame.draw.polygon(surf, (20, 80, 35), fang, 1)

        if self.can_attack:
            drip_x = hi[0]
            drip_y = hi[1] + 7 + math.sin(self.timer * 0.15) * 3

            pygame.draw.circle(surf, glow_color, (int(drip_x), int(drip_y)), 4)
            pygame.draw.circle(surf, (230, 255, 230), (int(drip_x - 1), int(drip_y - 1)), 1)

    def draw_frozen_ice(self, surf, sx, sy):
        fade = clamp(self.frozen_timer / 35, 0.0, 1.0)

        margin_x = 34
        margin_y = 38

        gw = int(self.rect.width + margin_x * 2)
        gh = int(self.rect.height + margin_y * 2 + 18)

        gx = int(sx - margin_x)
        gy = int(sy - margin_y - 8)

        ice_layer = pygame.Surface((gw, gh), pygame.SRCALPHA)

        def lp(world_x, world_y):
            return int(world_x - gx), int(world_y - gy)

        glacier = [
            lp(sx - 24, sy + self.rect.height + 14),
            lp(sx - 18, sy + 14),
            lp(sx - 7, sy - 19),
            lp(sx + 10, sy - 34),
            lp(sx + self.rect.width // 2 - 5, sy - 43),
            lp(sx + self.rect.width // 2 + 16, sy - 38),
            lp(sx + self.rect.width + 7, sy - 23),
            lp(sx + self.rect.width + 23, sy + 4),
            lp(sx + self.rect.width + 28, sy + self.rect.height + 15),
            lp(sx + self.rect.width // 2 + 12, sy + self.rect.height + 34),
            lp(sx + self.rect.width // 2 - 14, sy + self.rect.height + 30),
        ]

        pygame.draw.ellipse(
            ice_layer,
            (120, 220, 255, int(55 * fade)),
            (4, 8, gw - 8, gh - 12),
        )

        pygame.draw.polygon(ice_layer, (145, 225, 255, int(95 * fade)), glacier)
        pygame.draw.polygon(ice_layer, (235, 255, 255, int(210 * fade)), glacier, 2)
        pygame.draw.polygon(ice_layer, (65, 160, 220, int(120 * fade)), glacier, 1)

        for i in range(9):
            px = sx - 23 + i * (self.rect.width + 46) / 8
            base_y = sy + self.rect.height + 16
            height = 10 + (i % 4) * 4

            chunk = [
                lp(px - 8, base_y + 5),
                lp(px, base_y - height),
                lp(px + 9, base_y + 5),
            ]

            pygame.draw.polygon(ice_layer, (175, 235, 255, int(125 * fade)), chunk)
            pygame.draw.polygon(ice_layer, (240, 255, 255, int(185 * fade)), chunk, 1)

        cracks = [
            [(sx + 5, sy - 6), (sx + 19, sy + 15), (sx + 13, sy + 34)],
            [
                (sx + self.rect.width - 6, sy - 2),
                (sx + self.rect.width - 24, sy + 21),
                (sx + self.rect.width - 15, sy + 42),
            ],
            [
                (sx + self.rect.width // 2, sy - 33),
                (sx + self.rect.width // 2 - 7, sy + 1),
                (sx + self.rect.width // 2 + 10, sy + 24),
            ],
        ]

        for crack in cracks:
            a, b, c = crack
            pygame.draw.line(ice_layer, (245, 255, 255, int(190 * fade)), lp(*a), lp(*b), 2)
            pygame.draw.line(ice_layer, (125, 210, 255, int(150 * fade)), lp(*b), lp(*c), 1)

        for i in range(12):
            bx = int(gw * ((i * 37) % 100) / 100)
            by = int(gh * ((i * 23) % 100) / 100)
            pygame.draw.circle(ice_layer, (245, 255, 255, int(150 * fade)), (bx, by), 1 + (i % 2), 1)

        surf.blit(ice_layer, (gx, gy))    def draw_realistic_details(self, surf, camera_x, camera_y, t, body_color, wing_color, glow_color):
        sx = self.rect.x - camera_x
        sy = self.rect.y - camera_y

        bx = sx + self.rect.width // 2
        by = sy + self.rect.height // 2
        d = self.direction

        frozen = self.frozen_timer > 0

        scale_dark = (
            max(0, body_color[0] - 55),
            max(0, body_color[1] - 55),
            max(0, body_color[2] - 55),
        )

        scale_light = (
            min(255, body_color[0] + 45),
            min(255, body_color[1] + 45),
            min(255, body_color[2] + 45),
        )

        for i in range(14):
            px = sx + 9 + (i * 13) % max(20, self.rect.width - 12)
            py = sy + 12 + (i * 9) % max(16, self.rect.height - 14)

            pygame.draw.ellipse(surf, scale_light if i % 3 == 0 else scale_dark, (px, py, 6, 4))
            pygame.draw.arc(surf, (12, 10, 10), (px, py, 6, 4), 0, math.pi, 1)

        vein_color = (
            max(0, wing_color[0] - 38),
            max(0, wing_color[1] - 38),
            max(0, wing_color[2] - 38),
        )

        left_root = (bx - 6, by - 4)
        right_root = (bx + 6, by - 4)

        for p in [(bx - 50, by - 34), (bx - 42, by - 12), (bx - 33, by + 16)]:
            pygame.draw.line(surf, vein_color, left_root, p, 1)

        for p in [(bx + 50, by - 34), (bx + 42, by - 12), (bx + 33, by + 16)]:
            pygame.draw.line(surf, vein_color, right_root, p, 1)

        mouth_x = bx + d * 50
        mouth_y = by - 6

        for i in range(4):
            tx = mouth_x - d * i * 5

            tooth = [
                (tx, mouth_y),
                (tx + d * 3, mouth_y + 8),
                (tx + d * 6, mouth_y),
            ]

            pygame.draw.polygon(surf, (235, 235, 210), tooth)
            pygame.draw.polygon(surf, (40, 35, 30), tooth, 1)

        if not frozen and self.can_attack:
            for i in range(3):
                px = mouth_x + d * (8 + i * 8)
                py = mouth_y + math.sin(t * 5 + i) * 4
                pygame.draw.circle(surf, glow_color, (int(px), int(py)), 2 + i, 1)

        feet = [
            (sx + 15, sy + self.rect.height + 1),
            (sx + self.rect.width - 10, sy + self.rect.height + 1),
        ]

        for foot in feet:
            for i in range(3):
                pygame.draw.line(
                    surf,
                    (230, 225, 195),
                    foot,
                    (foot[0] + d * (5 + i * 4), foot[1] + 5 + i),
                    1,
                )

        if not frozen and self.can_attack:
            for i in range(3):
                px = sx + 18 + i * 12
                py = sy + 22 + math.sin(t * 5 + i) * 2
                size = 4

                rune = [
                    (px, py - size),
                    (px + size, py),
                    (px, py + size),
                    (px - size, py),
                ]

                pygame.draw.polygon(surf, glow_color, rune)
                pygame.draw.polygon(surf, (255, 255, 255), rune, 1)

    def draw_power_effects(self, surf, camera_x, camera_y, t, player, glow_color):
        if self.frozen_timer > 0 or player is None or not self.can_attack:
            return

        mx, my = self.mouth_world_pos()
        mx_screen = mx - camera_x
        my_screen = my - camera_y

        bx = self.rect.centerx - camera_x
        by = self.rect.centery - camera_y
        d = self.direction

        px = player.rect.centerx
        py = player.rect.centery

        dx = px - self.rect.centerx
        dy = py - self.rect.centery
        distance = max(1, math.hypot(dx, dy))

        # Fire breath
        if self.kind == "ash_wyvern":
            phase = self.power_phase(180)

            if phase < 0.42 and distance < 450:
                flame_len = 190
                flame_height = 88

                flame_surface = pygame.Surface((flame_len + 60, flame_height + 80), pygame.SRCALPHA)
                ox = 30 if d > 0 else flame_len + 30
                oy = flame_height // 2 + 40

                for i in range(8):
                    amount = i / 7
                    fx = ox + d * (40 + amount * flame_len)
                    fy = oy - 30 + math.sin(t * 4 + i) * 10 - amount * 20
                    radius = int(12 + amount * 18)
                    alpha = int(55 * (1 - amount))
                    pygame.draw.circle(flame_surface, (60, 45, 38, alpha), (int(fx), int(fy)), radius)

                for i in range(13):
                    amount = i / 12
                    fx = ox + d * (20 + amount * flame_len)
                    fy = oy + math.sin(t * 10 + i) * 18
                    rx = int(24 + amount * 38)
                    ry = int((flame_height * (1 - amount * 0.55)) / 2)

                    color = [
                        (255, 45, 8, 210),
                        (255, 85, 12, 220),
                        (255, 130, 25, 230),
                        (255, 185, 55, 220),
                    ][(self.timer + i) % 4]

                    pygame.draw.ellipse(
                        flame_surface,
                        color,
                        (int(fx - rx // 2), int(fy - ry // 2), rx, max(5, ry)),
                    )

                for i in range(7):
                    amount = i / 6
                    fx = ox + d * (20 + amount * (flame_len * 0.75))
                    fy = oy + math.sin(t * 15 + i) * 8
                    pygame.draw.ellipse(flame_surface, (255, 245, 160, 210), (int(fx - 10), int(fy - 7), 20, 14))

                surf.blit(flame_surface, (mx_screen - ox, my_screen - oy))

        # Poison tongue
        elif self.kind == "venom_drake":
            phase = self.power_phase(240)

            if phase < 0.36 and distance < 410:
                ux = dx / distance
                uy = dy / distance
                stretch = math.sin((phase / 0.36) * math.pi)
                tongue_len = min(260, distance) * stretch

                tip = (
                    mx_screen + ux * tongue_len,
                    my_screen + uy * tongue_len,
                )

                mid = (
                    mx_screen + (tip[0] - mx_screen) * 0.5,
                    my_screen + (tip[1] - my_screen) * 0.5 + math.sin(t * 14) * 13,
                )

                pygame.draw.line(surf, (20, 55, 25), (mx_screen, my_screen), mid, 12)
                pygame.draw.line(surf, (30, 125, 42), mid, tip, 10)
                pygame.draw.line(surf, (75, 255, 105), (mx_screen, my_screen), mid, 7)
                pygame.draw.line(surf, (130, 255, 150), mid, tip, 5)

                pygame.draw.line(surf, (65, 230, 90), tip, (tip[0] + d * 22, tip[1] - 13), 5)
                pygame.draw.line(surf, (65, 230, 90), tip, (tip[0] + d * 22, tip[1] + 13), 5)
                pygame.draw.circle(surf, (130, 255, 140), (int(tip[0]), int(tip[1])), 8)

        # Shockwave
        elif self.kind == "obsidian_gargoyle":
            phase = self.power_phase(210)

            if phase < 0.25:
                wave_strength = math.sin((phase / 0.25) * math.pi)
                width = 330
                wave_x = bx - width // 2
                wave_y = by + 25

                pygame.draw.arc(surf, (170, 170, 180), (wave_x, wave_y - 24, width, 52), 0, math.pi, 5)
                pygame.draw.arc(surf, (235, 235, 240), (wave_x + 20, wave_y - 16, width - 40, 36), 0, math.pi, 2)

                for i in range(10):
                    crack_x = wave_x + 18 + i * 33
                    wobble = math.sin(t * 8 + i) * 9
                    pygame.draw.line(surf, (210, 210, 220), (crack_x, wave_y + 5), (crack_x + wobble, wave_y + 20), 2)

                    if i % 2 == 0:
                        rock_y = wave_y - wave_strength * (8 + i % 3 * 5)
                        rock = [
                            (crack_x - 4, rock_y),
                            (crack_x + 3, rock_y - 5),
                            (crack_x + 8, rock_y + 1),
                            (crack_x + 1, rock_y + 6),
                        ]

                        pygame.draw.polygon(surf, (70, 70, 76), rock)
                        pygame.draw.polygon(surf, (160, 160, 170), rock, 1)

        # Curse aura
        elif self.kind == "ember_wraith":
            phase = self.power_phase(200)

            if phase < 0.58:
                aura = pygame.Surface((250, 250), pygame.SRCALPHA)
                center = (125, 125)

                for i in range(4):
                    radius = 46 + i * 24 + int(math.sin(t * 6 + i) * 6)
                    pygame.draw.circle(aura, (255, 60, 170, 45), center, radius, 3)
                    pygame.draw.circle(aura, (120, 30, 115, 30), center, radius + 10, 1)

                for i in range(7):
                    angle = t * 2.5 + i * math.pi * 2 / 7
                    rx = center[0] + math.cos(angle) * 84
                    ry = center[1] + math.sin(angle) * 84
                    size = 5

                    rune = [
                        (rx, ry - size),
                        (rx + size, ry),
                        (rx, ry + size),
                        (rx - size, ry),
                    ]

                    pygame.draw.polygon(aura, (255, 100, 210, 150), rune)
                    pygame.draw.polygon(aura, (255, 230, 255, 160), rune, 1)

                surf.blit(aura, (bx - 125, by - 125))

        # Crystal spikes
        elif self.kind == "crystal_basilisk":
            phase = self.power_phase(190)

            if phase < 0.32:
                grow = math.sin((phase / 0.32) * math.pi)

                for i in range(6):
                    spike_x = bx + d * (28 + i * 23)
                    spike_y = by + 28
                    height = (42 + i * 5) * grow

                    spike = [
                        (spike_x - d * 10, spike_y + 15),
                        (spike_x, spike_y - height),
                        (spike_x + d * 12, spike_y + 15),
                    ]

                    pygame.draw.polygon(surf, (185, 255, 255), spike)
                    pygame.draw.polygon(surf, (55, 145, 205), spike, 2)

        # Lightning
        elif self.kind == "storm_screecher":
            phase = self.power_phase(160)

            if phase < 0.23 and distance < 460:
                end = (
                    player.rect.centerx - camera_x,
                    player.rect.centery - camera_y,
                )

                points = [(mx_screen, my_screen)]

                for i in range(1, 7):
                    amount = i / 7
                    px2 = mx_screen + (end[0] - mx_screen) * amount
                    py2 = my_screen + (end[1] - my_screen) * amount

                    px2 += math.sin(t * 24 + i * 1.7) * 22
                    py2 += math.cos(t * 21 + i * 1.2) * 22

                    points.append((px2, py2))

                points.append(end)

                pygame.draw.lines(surf, (30, 80, 190), False, points, 9)
                pygame.draw.lines(surf, (80, 190, 255), False, points, 5)
                pygame.draw.lines(surf, (235, 255, 255), False, points, 2)

                for i in range(1, len(points) - 1):
                    if i % 2 == 0:
                        px2, py2 = points[i]

                        for side in [-1, 1]:
                            branch = [
                                (px2, py2),
                                (px2 + side * (18 + i * 3), py2 - 12 + math.sin(t * 15 + i) * 8),
                                (px2 + side * (30 + i * 2), py2 - 24 + math.cos(t * 12 + i) * 8),
                            ]

                            pygame.draw.lines(surf, (120, 220, 255), False, branch, 2)
                            pygame.draw.lines(surf, (245, 255, 255), False, branch, 1)

    def draw(self, surf, camera_x, camera_y, t, player=None):
        sx = self.rect.x - camera_x
        sy = self.rect.y - camera_y

        p = self.palette()
        body_color = p["body"]
        wing_color = p["wing"]
        glow_color = p["glow"]
        eye_color = p["eye"]

        if self.frozen_timer > 0:
            body_color = (150, 225, 255)
            wing_color = (120, 200, 240)
            eye_color = (235, 255, 255)

        bx = sx + self.rect.width // 2
        by = sy + self.rect.height // 2
        d = self.direction

        flap = 0

        if self.frozen_timer <= 0:
            if self.grounded:
                flap = 0
            else:
                flap = math.sin(t * 12 + self.wing_phase) * 12

        if self.can_attack and self.frozen_timer <= 0:
            pygame.draw.ellipse(surf, glow_color, (bx - 58, by - 48, 116, 96), 2)

        elif self.frozen_timer <= 0:
            pygame.draw.ellipse(
                surf,
                (glow_color[0] // 4, glow_color[1] // 4, glow_color[2] // 4),
                (bx - 52, by - 42, 104, 84),
                1,
            )

        else:
            pygame.draw.ellipse(surf, (120, 210, 255), (bx - 52, by - 42, 104, 84), 2)

        # Wings
        left_wing = [
            (bx - 6, by - 4),
            (bx - 55, by - 38 + flap),
            (bx - 35, by + 18),
        ]

        right_wing = [
            (bx + 6, by - 4),
            (bx + 55, by - 38 - flap),
            (bx + 35, by + 18),
        ]

        pygame.draw.polygon(surf, wing_color, left_wing)
        pygame.draw.polygon(surf, wing_color, right_wing)
        pygame.draw.polygon(surf, (20, 15, 20), left_wing, 2)
        pygame.draw.polygon(surf, (20, 15, 20), right_wing, 2)

        self.draw_tail(surf, camera_x, camera_y, body_color, glow_color)

        # Body
        pygame.draw.ellipse(surf, body_color, (sx + 7, sy + 10, self.rect.width - 14, self.rect.height - 13))
        pygame.draw.ellipse(surf, (20, 15, 15), (sx + 7, sy + 10, self.rect.width - 14, self.rect.height - 13), 2)

        hx = bx + d * 32
        hy = by - 8

        head = [
            (hx - d * 13, hy - 10),
            (hx + d * 8, hy - 13),
            (hx + d * 27, hy - 3),
            (hx + d * 17, hy + 10),
            (hx - d * 10, hy + 8),
        ]

        pygame.draw.polygon(surf, body_color, head)
        pygame.draw.polygon(surf, (20, 15, 15), head, 2)

        snout = [
            (hx + d * 12, hy - 5),
            (hx + d * 33, hy - 1),
            (hx + d * 18, hy + 8),
        ]

        pygame.draw.polygon(surf, body_color, snout)
        pygame.draw.polygon(surf, (20, 15, 15), snout, 1)

        eye_pos = (int(hx + d * 9), int(hy - 4))

        if self.charge_flash > 0 or self.can_attack:
            eye_color = (255, 255, 255)

        pygame.draw.circle(surf, eye_color, eye_pos, 3)
        pygame.draw.circle(surf, (5, 5, 5), eye_pos, 1)

        horn_color = (210, 255, 255) if self.kind == "crystal_basilisk" else (230, 225, 190)

        horn1 = [
            (hx - d * 4, hy - 10),
            (hx - d * 13, hy - 25),
            (hx + d * 2, hy - 14),
        ]

        horn2 = [
            (hx + d * 8, hy - 10),
            (hx + d * 11, hy - 24),
            (hx + d * 16, hy - 11),
        ]

        pygame.draw.polygon(surf, horn_color, horn1)
        pygame.draw.polygon(surf, horn_color, horn2)

        pulse = 2 + int(2 * math.sin(t * 8 + self.timer))

        pygame.draw.circle(
            surf,
            glow_color if self.frozen_timer <= 0 else (230, 255, 255),
            (int(bx), int(by + 4)),
            5 + pulse,
        )

        pygame.draw.circle(surf, (255, 255, 255), (int(bx), int(by + 4)), 2)

        # Type decorations
        if self.kind == "crystal_basilisk":
            for i in range(4):
                px = sx + 12 + i * 10

                crystal = [
                    (px, sy + 14),
                    (px + 5, sy - 5 - (i % 2) * 4),
                    (px + 10, sy + 14),
                ]

                pygame.draw.polygon(surf, (210, 255, 255), crystal)
                pygame.draw.polygon(surf, (65, 155, 210), crystal, 1)

        elif self.kind == "storm_screecher" and self.frozen_timer <= 0:
            for i in range(3):
                x1 = bx - 25 + i * 20
                y1 = by - 26 + math.sin(t * 10 + i) * 4
                pygame.draw.line(surf, (170, 225, 255), (x1, y1), (x1 + 9, y1 - 11), 2)

        elif self.kind == "venom_drake" and self.frozen_timer <= 0:
            for i in range(3):
                px = bx - d * (28 + i * 8)
                py = by + 17 + math.sin(t * 5 + i) * 4
                pygame.draw.circle(surf, (80, 255, 110), (int(px), int(py)), 3)

        elif self.kind == "ember_wraith" and self.frozen_timer <= 0:
            for i in range(2):
                radius = 24 + i * 14 + int(math.sin(t * 5 + i) * 4)
                pygame.draw.circle(surf, glow_color, (int(bx), int(by)), radius, 1)

        self.draw_power_effects(surf, camera_x, camera_y, t, player, glow_color)
        self.draw_realistic_details(surf, camera_x, camera_y, t, body_color, wing_color, glow_color)

        if self.frozen_timer > 0:
            self.draw_frozen_ice(surf, sx, sy)


# -----------------------------
# Enemy spawning helpers
# -----------------------------
def spawn_enemy_batch(level, enemies, total_spawned, batch_size=SPAWN_BATCH_SIZE):
    kinds = [
        "ash_wyvern",
        "venom_drake",
        "obsidian_gargoyle",
        "ember_wraith",
        "storm_screecher",
        "crystal_basilisk",
    ]

    spawned_now = 0
    enemy_goal = level_enemy_goal(level.level_number)

    while spawned_now < batch_size and total_spawned < enemy_goal and level.enemy_spawn_spots:
        tx, ty = level.enemy_spawn_spots.pop(0)
        kind = level.rng.choice(kinds)

        enemy = Enemy(kind, tx * TILE, ty * TILE)

        # Non-flying enemies spawn on the nearest ground/platform below them.
        if enemy.grounded:
            ground_ty = ty

            while ground_ty < LEVEL_H - 3 and not level.is_solid(tx, ground_ty + 1):
                ground_ty += 1

            enemy.rect.x = tx * TILE
            enemy.rect.bottom = (ground_ty + 1) * TILE

            enemy.x = float(enemy.rect.x)
            enemy.y = float(enemy.rect.y)

            enemy.vy = 0
            enemy.on_ground = True

        enemies.append(enemy)

        spawned_now += 1
        total_spawned += 1

    return total_spawned


def assign_active_attackers(enemies, player):
    living = [
        e for e in enemies
        if e.alive and e.frozen_timer <= 0
    ]

    living.sort(key=lambda e: dist(e.rect.center, player.rect.center))

    attackers = set(living[:ACTIVE_ATTACKER_LIMIT])

    for enemy in enemies:
        enemy.can_attack = enemy in attackers


# -----------------------------
# Game setup
# -----------------------------
def new_game(level_number=1):
    level = Level(level_number=level_number)
    player = Player(level.spawn)

    enemies = []
    total_spawned = 0
    spawn_timer = 0

    total_spawned = spawn_enemy_batch(level, enemies, total_spawned)

    return level, player, enemies, total_spawned, spawn_timer


def draw_win_screen(surf, t):
    surf.fill((5, 8, 20))

    for i in range(120):
        x = (i * 97 + int(t * 20)) % WIDTH
        y = (i * 53 + int(math.sin(t + i) * 20)) % HEIGHT
        b = 120 + noise(i, int(t * 10)) % 120
        pygame.draw.circle(surf, (b, b, min(255, b + 30)), (x, y), 1)

    glow = pygame.Surface((WIDTH, HEIGHT), pygame.SRCALPHA)

    for r in range(260, 40, -35):
        alpha = max(8, 55 - r // 6)
        pygame.draw.circle(glow, (80, 190, 255, alpha), (WIDTH // 2, HEIGHT // 2 - 40), r)

    surf.blit(glow, (0, 0))

    draw_text_center(surf, BIG_FONT, "YOU WIN!", HEIGHT // 2 - 120, (235, 255, 255))
    draw_text_center(surf, MID_FONT, "The Blue Ice Lizard escaped Storm Peak.", HEIGHT // 2 - 55, (160, 230, 255))
    draw_text_center(surf, FONT, "You cleared all 5 glacier levels.", HEIGHT // 2 - 10, (230, 240, 255))
    draw_text_center(surf, SMALL_FONT, "Press R to play again from Level 1", HEIGHT // 2 + 55, (190, 210, 230))
    draw_text_center(surf, SMALL_FONT, "Press Esc or close the window to quit", HEIGHT // 2 + 85, (150, 165, 185))


def main():
    current_level = 1
    game_state = "playing"

    level, player, enemies, total_spawned, spawn_timer = new_game(current_level)
    ice_shards = []

    camera_x = 0
    camera_y = 0
    time_alive = 0

    running = True

    while running:
        dt = clock.tick(FPS) / 1000
        time_alive += dt

        # -----------------------------
        # Events
        # -----------------------------
        for event in pygame.event.get():
            if event.type == pygame.QUIT:
                running = False

            if event.type == pygame.KEYDOWN:
                if event.key == pygame.K_ESCAPE:
                    running = False

                if event.key == pygame.K_r:
                    current_level = 1
                    game_state = "playing"

                    level, player, enemies, total_spawned, spawn_timer = new_game(current_level)
                    ice_shards = []
                    camera_x = 0
                    camera_y = 0
                    time_alive = 0

                if game_state == "playing":
                    if event.key in [pygame.K_w, pygame.K_UP]:
                        player.jump()

                    if event.key == pygame.K_SPACE:
                        player.space_hold_frames = 1
                        ice_shards.extend(player.shoot_ice(enemies, homing=False))

            if event.type == pygame.KEYUP:
                if event.key == pygame.K_SPACE and game_state == "playing":
                    player.space_hold_frames = 0

        if game_state == "win":
            draw_win_screen(screen, time_alive)
            pygame.display.flip()
            continue

        keys = pygame.key.get_pressed()

        # -----------------------------
        # Enemy waves
        # -----------------------------
        enemy_goal = level_enemy_goal(level.level_number)

        if total_spawned < enemy_goal:
            spawn_timer += 1

            if spawn_timer >= SPAWN_INTERVAL_FRAMES:
                spawn_timer = 0
                total_spawned = spawn_enemy_batch(level, enemies, total_spawned)

        assign_active_attackers(enemies, player)

        # -----------------------------
        # Hold Space: auto-target
        # -----------------------------
        if keys[pygame.K_SPACE]:
            player.space_hold_frames += 1

            if player.space_hold_frames >= AUTO_TARGET_HOLD_FRAMES:
                ice_shards.extend(player.shoot_ice(enemies, homing=True))

        # -----------------------------
        # Update player
        # -----------------------------
        prev_player_bottom = player.rect.bottom
        player.update(keys, level)

        # Frozen enemies act as one-way platforms
        if not keys[pygame.K_DOWN]:
            for enemy in enemies:
                if enemy.frozen_timer > 0 and player.vy >= 0:
                    horizontal_overlap = (
                        player.rect.right > enemy.rect.left + 8 and
                        player.rect.left < enemy.rect.right - 8
                    )

                    falling_onto_top = (
                        prev_player_bottom <= enemy.rect.top + 8 and
                        player.rect.bottom >= enemy.rect.top
                    )

                    if horizontal_overlap and falling_onto_top:
                        player.rect.bottom = enemy.rect.top
                        player.y = float(player.rect.y)
                        player.vy = 0
                        player.on_ground = True
                        player.double_jumps = 1

        # -----------------------------
        # Update ice shards
        # -----------------------------
        for shard in ice_shards:
            shard.update(level)

            for enemy in enemies:
                if enemy.alive and shard.alive and shard.rect.colliderect(enemy.rect):
                    enemy.freeze()
                    shard.alive = False
                    break

        ice_shards = [s for s in ice_shards if s.alive]

        # -----------------------------
        # Update enemies
        # -----------------------------
        for enemy in enemies:
            enemy.update(level, player)

        enemies = [e for e in enemies if e.alive]

        assign_active_attackers(enemies, player)

        # -----------------------------
        # Player/enemy collisions and powers
        # -----------------------------
        for enemy in enemies:
            if enemy.frozen_timer > 0:
                continue

            if not enemy.can_attack:
                continue

            touching_body = player.rect.colliderect(enemy.rect)
            touching_tail = player.rect.colliderect(enemy.tail_hitbox())

            if touching_body or touching_tail:
                if touching_tail:
                    player.poison()
                else:
                    player.hurt()

            enemy.apply_power_to_player(player)

        # -----------------------------
        # Portal / level advance / win
        # -----------------------------
        if player.rect.colliderect(level.exit_rect):
            if current_level >= MAX_LEVELS:
                game_state = "win"
                ice_shards = []

            else:
                current_level += 1

                level, player, enemies, total_spawned, spawn_timer = new_game(current_level)
                ice_shards = []
                camera_x = 0
                camera_y = 0
                time_alive = 0

        # -----------------------------
        # Camera
        # -----------------------------
        target_x = player.rect.centerx - WIDTH // 2
        target_y = player.rect.centery - HEIGHT // 2

        max_camera_x = max(0, LEVEL_W * TILE - WIDTH)
        max_camera_y = max(0, LEVEL_H * TILE - HEIGHT)

        camera_x += (target_x - camera_x) * 0.12
        camera_y += (target_y - camera_y) * 0.12

        camera_x = clamp(camera_x, 0, max_camera_x)
        camera_y = clamp(camera_y, 0, max_camera_y)

        # -----------------------------
        # Draw world
        # -----------------------------
        level.draw(screen, camera_x, camera_y, time_alive)

        for shard in ice_shards:
            shard.draw(screen, camera_x, camera_y, time_alive)

        for enemy in enemies:
            enemy.draw(screen, camera_x, camera_y, time_alive, player)

        player.draw(screen, camera_x, camera_y)

        # -----------------------------
        # UI
        # -----------------------------
        pygame.draw.rect(screen, (0, 0, 0), (0, 0, WIDTH, 76))
        pygame.draw.rect(screen, (35, 35, 45), (0, 72, WIDTH, 4))

        if player.burn_timer > 0 and player.poison_timer > 0:
            status = "BURNING + POISONED"
        elif player.burn_timer > 0:
            status = "BURNING"
        elif player.poison_timer > 0:
            status = "POISONED - SLOWED"
        else:
            status = "OK"

        frozen_count = sum(1 for e in enemies if e.frozen_timer > 0)
        active_attackers = sum(
            1 for e in enemies
            if e.can_attack and e.frozen_timer <= 0
        )

        enemy_goal = level_enemy_goal(level.level_number)

        ui = FONT.render(
            f"Level {level.level_number}/{MAX_LEVELS}: {level_title(level.level_number)}   Health: {player.health}   Status: {status}   Enemies: {len(enemies)}   Spawned: {total_spawned}/{enemy_goal}",
            True,
            (235, 235, 245),
        )

        screen.blit(ui, (14, 10))

        ui2 = SMALL_FONT.render(
            f"Active attackers: {active_attackers}/{ACTIVE_ATTACKER_LIMIT}   Frozen: {frozen_count}   Next batch in: {max(0, (SPAWN_INTERVAL_FRAMES - spawn_timer) // FPS)}s   Seed: {level.seed}",
            True,
            (190, 200, 215),
        )

        screen.blit(ui2, (14, 36))

        help_text = SMALL_FONT.render(
            "Move: A/D or Arrows | Down: duck | Jump: W/Up | Tap Space: straight ice | Hold Space: auto-target ice | R: restart",
            True,
            (180, 185, 200),
        )

        screen.blit(help_text, (14, 56))

        pygame.display.flip()

    pygame.quit()
    sys.exit()


if __name__ == "__main__":
    main()