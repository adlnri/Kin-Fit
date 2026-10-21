# Kin Fit background: gold silk folds, lacquer sheen and sparks on black. Procedural, no source imagery.
import numpy as np
from PIL import Image, ImageFilter
import sys

def render(W, H, seed, out, flip=False):
    rng = np.random.default_rng(seed)
    y, x = np.mgrid[0:H, 0:W].astype(np.float32)
    s = 1600.0 / max(W, H)
    X, Y = x * s, y * s
    if flip:  # portrait: run the silk diagonally from the bottom
        X, Y = Y * 0.62, (H * s - X) * 0.9
    # Warped coordinate along which the silk flows.
    v = Y + 90 * np.sin(X * 0.0034 + 0.6) + 46 * np.sin(X * 0.0081 + Y * 0.0021 + 1.9) + 22 * np.sin(X * 0.017 - Y * 0.004)
    def band(c, w):
        d = (v - c) / w
        return np.exp(-d * d * 1.6)
    env = 0.95 * band(560 + 0.26 * X, 230) + 0.55 * band(980 + 0.12 * X, 160) + 0.25 * band(180 + 0.4 * X, 120)
    # Cloth folds: fine ridges along the flow.
    hgt = env * (np.sin(v * 0.045) * 0.6 + np.sin(v * 0.091 + X * 0.002) * 0.3 + np.sin(v * 0.021 - 1.0) * 0.8)
    gy, gx = np.gradient(hgt * 60)
    n = np.stack([-gx, -gy, np.ones_like(gx)], -1)
    n /= np.linalg.norm(n, axis=-1, keepdims=True)
    L = np.array([-0.45, -0.6, 0.66]); L /= np.linalg.norm(L)
    Hh = (L + np.array([0, 0, 1.0])); Hh /= np.linalg.norm(Hh)
    diff = np.clip((n * L).sum(-1), 0, 1)
    spec = np.clip((n * Hh).sum(-1), 0, 1) ** 46
    I = env * (0.32 * diff + 0.18) + env * 1.35 * spec
    # Keep the upper-left quiet for text: light grows toward the right.
    fall = np.clip(0.28 + 0.9 * (x / W) ** 1.4 + 0.25 * (y / H), 0, 1.15)
    I = np.clip(I * fall, 0, 1.25)
    stops = np.array([0, .14, .32, .55, .78, 1.0, 1.25])
    cols = np.array([[5, 4, 3], [22, 15, 6], [70, 46, 10], [150, 108, 26], [212, 175, 55], [246, 227, 161], [255, 248, 228]], np.float32)
    img = np.stack([np.interp(I, stops, cols[:, k]) for k in range(3)], -1)
    # Lacquer sheen: a broad, faint diagonal reflection across the top.
    sheen = np.exp(-(((x / W) * 0.9 - (y / H) * 1.6 - 0.18) / 0.09) ** 2) * (1 - y / H) * 18
    img += sheen[..., None] * np.array([1.0, 0.9, 0.7])
    base = Image.fromarray(np.clip(img, 0, 255).astype(np.uint8))
    # Sparks: hot points with a glow, denser on the bright side.
    glow = Image.new('RGB', (W, H)); core = Image.new('RGB', (W, H))
    gp, cp = glow.load(), core.load()
    for _ in range(int(W * H / 9000)):
        px = int(W * rng.beta(2.6, 1.4)); py = int(H * rng.random())
        if not (2 < px < W - 3 and 2 < py < H - 3): continue
        b = rng.random() ** 2.2
        c = (255, int(214 + 30 * b), int(140 + 90 * b))
        for dx in (-1, 0, 1):
            for dy in (-1, 0, 1):
                gp[px + dx, py + dy] = tuple(int(k * b) for k in c)
        cp[px, py] = c if b > 0.35 else tuple(int(k * 0.6) for k in c)
    glow = glow.filter(ImageFilter.GaussianBlur(5 * W / 1600 + 2))
    arr = np.asarray(base, np.float32) + np.asarray(glow, np.float32) * 2.2 + np.asarray(core, np.float32) * 0.9
    arr += rng.normal(0, 2.2, arr.shape)  # grain keeps dark gradients from banding
    Image.fromarray(np.clip(arr, 0, 255).astype(np.uint8)).save(out, quality=84, optimize=True, progressive=True)

if __name__ == '__main__':
    o = sys.argv[1]
    render(1920, 1200, 7, o + '/kinfit-silk.jpg')
    render(900, 1600, 11, o + '/kinfit-silk-mobile.jpg', flip=True)
    print('ok')
