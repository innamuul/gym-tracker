/* Extra exercises the dataset doesn't have. Same record shape as data/exercises.js, plus:
   src:  [image urls] shown instead of the Gym visual GIF (2 urls = the photo flip animation). Without src, g picks a dataset GIF.
   m:    how sets are measured: 'kg' (weight × reps, default), 'time' (seconds held), 'reps' (reps only, no weight)
   dr:   default reps (or seconds) for a new set
   pace: [squeeze s, relax s] turns on the guided rep counter (▶ in the workout); cue: the two phase labels
   cr:   credit line for own media.
   Plank photos: github.com/yuhonas/free-exercise-db (public domain). Kegel drawings: original, made for this app.
   Moves with g reuse a dataset animation (© Gym visual, loaded from the CDN like every other GIF, never copied here). */
const KEGEL_TIP = 'Pelvic floor = the muscles you’d use to stop peeing midstream. Squeeze them up and in without clenching your glutes, thighs or stomach, and keep breathing.';
window.GYM_EXTRA = [
  {
    id: 'x-plank', n: 'Plank', eq: 'body', er: 'body weight', bp: 'waist', t: 'abs', p: ['abdominals'], s: ['shoulders', 'lower back', 'glutes'],
    m: 'time', dr: 60, src: ['data/extra/plank-0.jpg', 'data/extra/plank-1.jpg'], cr: 'Photos: free-exercise-db (public domain)',
    i: [
      'Kneel, then put your forearms on the floor with your elbows right under your shoulders.',
      'Step your feet back one at a time and rest on your toes, feet about hip-width apart.',
      'Make a straight line from head to heels: squeeze your glutes, brace your abs and don’t let your hips sag or pike up.',
      'Look at the floor just ahead of your hands so your neck stays long.',
      'Tap ▶ in your workout to start the countdown. Stop when your form breaks, not when you’re out of time.'
    ]
  },
  /* ---------- Kegel category (eq: 'kegel') */
  {
    id: 'x-kegel', n: 'Kegel (Pelvic Floor Squeeze)', eq: 'kegel', er: 'body weight', bp: 'waist', t: 'pelvic floor', p: ['pelvic floor'], s: [],
    m: 'reps', dr: 10, pace: [5, 5], src: ['data/extra/kegel.svg'], cr: 'Illustration made for Gym Tracker',
    i: [
      'Find the right muscles: they’re the ones you’d use to stop peeing midstream or hold in gas. Use that only to learn the feeling, don’t practise while peeing.',
      'Empty your bladder first. Lie on your back with knees bent, sit, or stand.',
      'Squeeze those muscles and lift them up and in. Hold for 5 seconds and keep breathing normally.',
      'Relax completely for 5 seconds. Letting go is half the exercise.',
      'Keep your stomach, thighs and glutes loose, and don’t hold your breath.',
      'Tap ▶ in your workout and the app counts the reps and tells you when to squeeze and relax. Build up to 10-second holds.'
    ]
  },
  {
    id: 'x-kegel-quick', n: 'Kegel Quick Flicks', eq: 'kegel', er: 'body weight', bp: 'waist', t: 'pelvic floor', p: ['pelvic floor'], s: [],
    m: 'reps', dr: 20, pace: [1, 1], src: ['data/extra/kegel-quick.svg'], cr: 'Illustration made for Gym Tracker',
    i: [
      'Lie, sit or stand comfortably. ' + KEGEL_TIP,
      'Squeeze hard and fast for 1 second, then let go fully for 1 second.',
      'Keep a steady rhythm. Quick flicks train the fast reaction you need when you cough, sneeze or lift.',
      'Start with 10–20 and build up. If you lose the squeeze, rest and do fewer, cleaner reps.'
    ]
  },
  {
    id: 'x-kegel-bridge', n: 'Kegel Bridge', eq: 'kegel', er: 'body weight', bp: 'upper legs', t: 'pelvic floor', p: ['pelvic floor'], s: ['glutes', 'hamstrings'],
    m: 'reps', dr: 12, pace: [3, 3], cue: ['Lift + squeeze', 'Lower + relax'], g: '3013-u0cNiij.gif',
    i: [
      'Lie on your back with knees bent, feet flat and hip-width apart, arms by your sides.',
      'Breathe out, squeeze your pelvic floor, then push through your heels and lift your hips until knees, hips and shoulders line up.',
      'Hold the top for 3 seconds, still squeezing.',
      'Lower slowly and relax the pelvic floor completely before the next rep.',
      KEGEL_TIP
    ]
  },
  {
    id: 'x-butterfly-beat', n: 'Butterfly Beat', eq: 'kegel', er: 'body weight', bp: 'upper legs', t: 'pelvic floor', p: ['pelvic floor'], s: ['adductors'],
    m: 'reps', dr: 30, pace: [1, 1], cue: ['Squeeze', 'Release'], g: '1494-bWlZvXh.gif',
    i: [
      'Sit tall (or lie on your back) with the soles of your feet together and knees falling open, like butterfly wings.',
      'Squeeze your pelvic floor and gently lift your knees a few centimetres, then release and let them fall open again.',
      'Keep a light, steady beat: 1 second squeeze, 1 second release.',
      'Don’t bounce hard. The move is small and the squeeze does the work.',
      KEGEL_TIP
    ]
  },
  {
    id: 'x-diamond-raise', n: 'Diamond Leg Raise', eq: 'kegel', er: 'body weight', bp: 'waist', t: 'pelvic floor', p: ['pelvic floor'], s: ['abdominals', 'adductors'],
    m: 'reps', dr: 12, pace: [2, 2], cue: ['Raise + squeeze', 'Lower + relax'], g: '2429-FFRP97T.gif',
    i: [
      'Lie on your back. Put your heels together and let your knees fall out so your legs make a diamond.',
      'Press your lower back into the floor. Breathe out, squeeze your pelvic floor and lift your legs, keeping the diamond shape.',
      'Pause for 2 seconds at the top.',
      'Lower slowly without letting your back arch, and relax the squeeze.',
      KEGEL_TIP
    ]
  },
  {
    id: 'x-kneel-thrust', n: 'Kneeling Hip Thrust', eq: 'kegel', er: 'body weight', bp: 'upper legs', t: 'pelvic floor', p: ['pelvic floor'], s: ['glutes'],
    m: 'reps', dr: 15, pace: [2, 2], cue: ['Thrust + squeeze', 'Sit back + relax'], g: '3236-Pjbc0Kt.gif',
    i: [
      'Kneel tall on a mat with knees hip-width apart. You can loop a band above your knees to make it harder.',
      'Sit your hips back towards your heels, keeping your chest up.',
      'Drive your hips forward to stand tall on your knees, squeezing your glutes and pelvic floor together at the top.',
      'Hold for 2 seconds, then sit back and relax.',
      KEGEL_TIP
    ]
  },
  {
    id: 'x-crab-breath', n: 'Crab Breathing', eq: 'kegel', er: 'body weight', bp: 'waist', t: 'pelvic floor', p: ['pelvic floor'], s: ['abdominals'],
    m: 'reps', dr: 10, pace: [4, 4], cue: ['Breathe out + lift', 'Breathe in + relax'], src: ['data/extra/kegel.svg'], cr: 'Illustration made for Gym Tracker',
    i: [
      'Sit on the floor with knees bent and hands on the floor behind you, fingers pointing forward (crab position). Keep your hips on the floor.',
      'Breathe in slowly through your nose for 4 seconds. Let your belly and ribs widen and let your pelvic floor relax and drop.',
      'Breathe out through pursed lips for 4 seconds while you gently lift your pelvic floor up and in.',
      'Stay relaxed in your shoulders. This connects your breathing with the squeeze, and it’s a good warm-up before the other kegel moves.'
    ]
  }
];
