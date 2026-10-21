"""Draws the Home Screen icons (lime square, black dumbbell) as icon-180/192/512.png. No extra libraries needed.
Usage: python tools/make_icons.py"""
import os, struct, zlib

LIME, INK = (0xd1, 0xf0, 0x1e), (0x0a, 0x0a, 0x0a)
# dumbbell in a 100x100 box: (x, y, w, h, corner radius), same shapes as the app's style
RECTS = [(14, 31, 13, 38, 4), (73, 31, 13, 38, 4), (6, 40, 10, 20, 3), (84, 40, 10, 20, 3), (25, 45, 50, 10, 2)]


def inside(px, py):
    for x, y, w, h, r in RECTS:
        if x <= px <= x + w and y <= py <= y + h:
            cx = min(max(px, x + r), x + w - r)
            cy = min(max(py, y + r), y + h - r)
            if (px - cx) ** 2 + (py - cy) ** 2 <= r * r:
                return True
    return False


def png(size, path, ss=4):
    rows = []
    for j in range(size):
        row = bytearray([0])
        for i in range(size):
            hit = sum(inside((i + (a + .5) / ss) * 100 / size, (j + (b + .5) / ss) * 100 / size) for a in range(ss) for b in range(ss)) / (ss * ss)
            row += bytes(round(LIME[k] * (1 - hit) + INK[k] * hit) for k in range(3))
        rows.append(bytes(row))
    chunk = lambda t, d: struct.pack('>I', len(d)) + t + d + struct.pack('>I', zlib.crc32(t + d) & 0xffffffff)
    data = b'\x89PNG\r\n\x1a\n' + chunk(b'IHDR', struct.pack('>IIBBBBB', size, size, 8, 2, 0, 0, 0)) + chunk(b'IDAT', zlib.compress(b''.join(rows), 9)) + chunk(b'IEND', b'')
    open(path, 'wb').write(data)


root = os.path.join(os.path.dirname(__file__), '..')
for s in (180, 192, 512):
    png(s, os.path.join(root, f'icon-{s}.png'))
    print('icon', s)
