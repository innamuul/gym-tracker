"""Rebuild data/ for Gym Tracker.

Sources (clone both next to this project):
  git clone --depth 1 https://github.com/hasaneyldrm/exercises-dataset   ../exercises-dataset
  git clone --depth 1 https://github.com/yuhonas/free-exercise-db        ../free-exercise-db
  pip install pillow
  python tools/build_data.py ../exercises-dataset ../free-exercise-db

Writes:
  data/exercises.js        main list (from exercises-dataset; data is MIT, GIFs are (c) Gym visual and are
                           NOT copied - the app loads them from that repo's CDN at runtime)
  data/photos/<group>.js   real-person photos (2 frames, base64 webp) from free-exercise-db (public domain),
                           only for exercises whose names match confidently
"""
import json, sys, os, re, io, base64, collections
from PIL import Image

HD, FE = sys.argv[1], sys.argv[2]
OUT = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', 'data')

# ---- equipment groups (key -> raw values) ----
EQ = {
    'machine': ['leverage machine', 'sled machine'], 'cable': ['cable', 'rope'], 'dumbbell': ['dumbbell'],
    'barbell': ['barbell', 'olympic barbell', 'trap bar'], 'smith': ['smith machine'], 'ez': ['ez barbell'],
    'body': ['body weight'], 'assisted': ['assisted'], 'kettlebell': ['kettlebell'], 'band': ['band', 'resistance band'],
    'weighted': ['weighted'], 'ball': ['stability ball', 'bosu ball', 'medicine ball'], 'roller': ['roller', 'wheel roller'],
    'cardio': ['upper body ergometer', 'skierg machine', 'stationary bike', 'elliptical machine', 'stepmill machine'],
    'other': ['hammer', 'tire'],
}
EQ_OF = {raw: k for k, v in EQ.items() for raw in v}

# ---- muscles -> the 17 body-map regions ----
MUS = {
    'abs': 'abdominals', 'abdominals': 'abdominals', 'obliques': 'abdominals', 'core': 'abdominals', 'serratus anterior': 'abdominals',
    'pectorals': 'chest', 'chest': 'chest', 'upper chest': 'chest',
    'delts': 'shoulders', 'deltoids': 'shoulders', 'shoulders': 'shoulders', 'rear deltoids': 'shoulders', 'rotator cuff': 'shoulders',
    'biceps': 'biceps', 'brachialis': 'biceps', 'triceps': 'triceps',
    'forearms': 'forearms', 'wrist flexors': 'forearms', 'wrist extensors': 'forearms', 'wrists': 'forearms', 'grip muscles': 'forearms', 'hands': 'forearms',
    'lats': 'lats', 'latissimus dorsi': 'lats', 'upper back': 'middle back', 'rhomboids': 'middle back',
    'traps': 'traps', 'trapezius': 'traps', 'levator scapulae': 'neck', 'sternocleidomastoid': 'neck', 'neck': 'neck',
    'spine': 'lower back', 'lower back': 'lower back', 'erector spinae': 'lower back',
    'glutes': 'glutes', 'quads': 'quadriceps', 'quadriceps': 'quadriceps', 'hip flexors': 'quadriceps',
    'hamstrings': 'hamstrings', 'adductors': 'adductors', 'inner thighs': 'adductors', 'groin': 'adductors',
    'abductors': 'abductors', 'calves': 'calves', 'soleus': 'calves', 'shins': 'calves', 'ankles': 'calves', 'ankle stabilizers': 'calves',
}

def title(n):
    n = n.replace('в°', '°')
    small = {'with', 'on', 'to', 'of', 'and', 'the', 'a', 'v.'}
    return ' '.join(w if (i and w in small) else w[:1].upper() + w[1:] for i, w in enumerate(n.split(' ')))

# ---- name matching to free-exercise-db photos ----
REP = {'db': 'dumbbell', 'dumbbells': 'dumbbell', 'barbells': 'barbell', 'lever': 'machine', 'leverage': 'machine', 'bicep': 'biceps',
       'tricep': 'triceps', 'raises': 'raise', 'curls': 'curl', 'rows': 'row', 'presses': 'press', 'extensions': 'extension',
       'flyes': 'fly', 'flye': 'fly', 'flys': 'fly', 'pushups': 'pushup', 'lunges': 'lunge', 'squats': 'squat', 'crunches': 'crunch',
       'kickbacks': 'kickback', 'shrugs': 'shrug', 'dips': 'dip', 'pulldowns': 'pulldown', 'situps': 'situp', 'standing': '',
       'with': '', 'the': '', 'a': '', 'on': '', 'to': '', 'of': '', 'and': '', 'medium': '', 'attachment': ''}
IMP = set('incline decline reverse smith seated lying preacher hammer close wide one single alternate alternating kneeling cable '
          'barbell dumbbell kettlebell band machine sled assisted weighted ez front rear side behind neck straight bent overhead '
          'jump wrist calf hack sumo romanian stiff split bulgarian press curl row squat raise fly extension pulldown pushdown '
          'lunge deadlift crunch shrug neutral palms pullover kickback dip pushup situp stretch clean snatch jerk thruster swing'.split())

def toks(n):
    n = n.lower()
    for a, b in [('pull-down', 'pulldown'), ('pull down', 'pulldown'), ('push-down', 'pushdown'), ('push down', 'pushdown'),
                 ('sit-up', 'situp'), ('push-up', 'pushup')]:
        n = n.replace(a, b)
    return frozenset(w for w in (REP.get(t, t) for t in re.split(r'[^a-z0-9]+', n)) if w)

hd = json.load(open(os.path.join(HD, 'data', 'exercises.json'), encoding='utf-8'))
fe = json.load(open(os.path.join(FE, 'dist', 'exercises.json'), encoding='utf-8'))
fet = [(x, toks(x['name'])) for x in fe if x['images']]

out, photos = [], collections.defaultdict(dict)
for h in hd:
    eq = EQ_OF.get(h['equipment'], 'other')
    tgt = MUS.get(h['target'])
    sec = sorted({MUS[m] for m in (h.get('secondary_muscles') or []) if m in MUS} - {tgt})
    ht, best = toks(h['name']), (0, None)
    for x, t in fet:
        if (ht & IMP) != (t & IMP):
            continue
        j = len(ht & t) / len(ht | t)
        if j > best[0]:
            best = (j, x)
    has_photo = best[0] >= 0.7
    if has_photo:
        frames = []
        for p in best[1]['images'][:2]:
            im = Image.open(os.path.join(FE, 'exercises', p)).convert('RGB'); im.thumbnail((360, 360))
            b = io.BytesIO(); im.save(b, 'WEBP', quality=58)
            frames.append('data:image/webp;base64,' + base64.b64encode(b.getvalue()).decode())
        photos[eq][h['id']] = frames
    out.append({'id': h['id'], 'n': title(h['name']), 'eq': eq, 'er': h['equipment'], 'bp': h['body_part'],
                't': h['target'], 'p': [tgt] if tgt else [], 's': sec, 'i': h['instruction_steps']['en'],
                'g': h['gif_url'].split('/')[-1], 'ph': 1 if has_photo else 0})

os.makedirs(os.path.join(OUT, 'photos'), exist_ok=True)
open(os.path.join(OUT, 'exercises.js'), 'w', encoding='utf-8').write(
    '/* Exercise data: github.com/hasaneyldrm/exercises-dataset (MIT). Animations (c) Gym visual - https://gymvisual.com/ */\n'
    'window.GYM_EXERCISES=' + json.dumps(out, separators=(',', ':'), ensure_ascii=False) + ';')
for k, v in photos.items():
    open(os.path.join(OUT, 'photos', k + '.js'), 'w', encoding='utf-8').write(
        '/* Photos: github.com/yuhonas/free-exercise-db (public domain) */\n'
        'window.GYM_PHOTOS=Object.assign(window.GYM_PHOTOS||{},' + json.dumps(v, separators=(',', ':')) + ');')
print(len(out), 'exercises,', sum(len(v) for v in photos.values()), 'with photos,', len(photos), 'photo files')
