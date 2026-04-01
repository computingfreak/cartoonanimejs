const storyOptions = [
  {
    title: "Toy Rescue at Rainbow Canyon",
    inspiration: "Toy Story–style friendship mission",
    summary:
      "A brave toy pilot and a glowing robot friend zoom through canyons to rescue a lost kite before sunset.",
    beat: [
      "Lift-off with sparkling dust trail",
      "High-speed canyon dive and cloud weaves",
      "Final teamwork jump and victory spin"
    ],
    caption: "Together we can fly farther!",
    theme: {
      sky: "linear-gradient(#8dd2ff 0%, #b2ecff 50%, #98e27c 100%)",
      ground: "linear-gradient(#92eb95, #44a559)",
      river: "linear-gradient(120deg, #6fd8ff, #2e83cf)",
      cloudDrift: 180,
      heroHop: 95,
      friendHop: 75,
      sparkCount: 26
    }
  },
  {
    title: "Ocean Song of the Little Explorer",
    inspiration: "Moana-like ocean adventure energy",
    summary:
      "A young explorer follows singing stars across a moonlit river to find a magical shell that lights the village.",
    beat: [
      "Moonrise glow over moving water",
      "Dance with starlight sprites",
      "Shell reveal with radiant wave pulses"
    ],
    caption: "Listen closely—the sea tells stories.",
    theme: {
      sky: "linear-gradient(#1f3f8e 0%, #416bc2 40%, #86c1ee 100%)",
      ground: "linear-gradient(#7ed0a2, #2b8f7e)",
      river: "linear-gradient(120deg, #9ee3ff, #3b66d8)",
      cloudDrift: 90,
      heroHop: 70,
      friendHop: 60,
      sparkCount: 32
    }
  },
  {
    title: "Sky Bakery Balloon Parade",
    inspiration: "Up-inspired whimsical sky journey",
    summary:
      "Two baker kids launch pastry balloons into the sky, delivering joy to every rooftop with surprise candy comets.",
    beat: [
      "Balloon inflation and camera lift",
      "Rooftop flyby with confetti bursts",
      "Sweet finale fireworks in heart shapes"
    ],
    caption: "Kindness rises like warm bread!",
    theme: {
      sky: "linear-gradient(#92d1ff 0%, #fde7ff 42%, #fff3a0 100%)",
      ground: "linear-gradient(#b3f07f, #70bf59)",
      river: "linear-gradient(120deg, #8ee1ff, #519ce1)",
      cloudDrift: 260,
      heroHop: 120,
      friendHop: 100,
      sparkCount: 40
    }
  },
  {
    title: "Forest Lantern and the Tiny Giant",
    inspiration: "Classic bedtime short story",
    summary:
      "A tiny child befriends a shy giant firefly and lights a dark forest path so everyone can dance safely at night.",
    beat: [
      "Lantern flicker and firefly arrival",
      "Glowing path draws through trees",
      "Dance circle and synchronized jumps"
    ],
    caption: "Even tiny lights can guide the world.",
    theme: {
      sky: "linear-gradient(#25396e 0%, #5866a8 45%, #8bc4ff 100%)",
      ground: "linear-gradient(#5fd495, #2f8b67)",
      river: "linear-gradient(120deg, #6ad2ff, #2b78bf)",
      cloudDrift: 60,
      heroHop: 65,
      friendHop: 65,
      sparkCount: 48
    }
  },
  {
    title: "Clocktower of Curious Cats",
    inspiration: "Playful Saturday morning cartoon mystery",
    summary:
      "Inventor cats race up a clocktower, solving rhythm puzzles to stop a rainstorm and paint the clouds in sunrise colors.",
    beat: [
      "Tick-tock bounce sequence",
      "Puzzle sparks in tempo",
      "Sunrise color wash across sky"
    ],
    caption: "Curiosity turns storms into songs.",
    theme: {
      sky: "linear-gradient(#5a72b4 0%, #9ca8dd 35%, #ffd09b 100%)",
      ground: "linear-gradient(#95dd84, #4ca55d)",
      river: "linear-gradient(120deg, #95e6ff, #4d81cc)",
      cloudDrift: 220,
      heroHop: 85,
      friendHop: 80,
      sparkCount: 34
    }
  }
];

const stage = document.querySelector("#stage");
const select = document.querySelector("#story-select");
const storyCopy = document.querySelector("#story-copy");
const playBtn = document.querySelector("#play-btn");
const soundBtn = document.querySelector("#sound-btn");
const caption = document.querySelector("#caption");

const hero = document.querySelector("#hero");
const friend = document.querySelector("#friend");
const sun = document.querySelector(".sun");
const clouds = document.querySelectorAll(".cloud");
const river = document.querySelector(".river");
const ground = document.querySelector(".ground");

let masterTimeline;
let audioEnabled = true;
let audioContext;

function renderStoryOption(index = 0) {
  const story = storyOptions[index];
  storyCopy.innerHTML = `
    <h3>${story.title}</h3>
    <p><strong>Concept:</strong> ${story.inspiration}</p>
    <p>${story.summary}</p>
    <ol>${story.beat.map((item) => `<li>${item}</li>`).join("")}</ol>
  `;
  caption.textContent = story.caption;
}

function populateOptions() {
  storyOptions.forEach((story, idx) => {
    const option = document.createElement("option");
    option.value = String(idx);
    option.textContent = `${idx + 1}. ${story.title}`;
    select.appendChild(option);
  });
}

function spawnSparks(total = 22, story = storyOptions[0]) {
  const previous = stage.querySelectorAll(".spark");
  previous.forEach((p) => p.remove());

  for (let i = 0; i < total; i += 1) {
    const spark = document.createElement("div");
    spark.className = "spark";
    const hue = 20 + (i * 17 + story.title.length * 11) % 260;
    spark.style.background = `radial-gradient(circle, hsl(${hue} 100% 90%), hsl(${(hue + 45) % 360} 92% 64%))`;
    spark.style.left = `${Math.random() * 95}%`;
    spark.style.top = `${Math.random() * 85}%`;
    stage.appendChild(spark);
  }
}

function ensureAudio() {
  if (!audioEnabled) return null;
  if (!audioContext) {
    audioContext = new window.AudioContext();
  }
  return audioContext;
}

function playTone({
  frequency = 440,
  duration = 0.15,
  type = "sine",
  delay = 0,
  gain = 0.04
}) {
  const context = ensureAudio();
  if (!context) return;

  const now = context.currentTime + delay;
  const osc = context.createOscillator();
  const amp = context.createGain();

  osc.type = type;
  osc.frequency.setValueAtTime(frequency, now);
  amp.gain.setValueAtTime(0.0001, now);
  amp.gain.exponentialRampToValueAtTime(gain, now + 0.02);
  amp.gain.exponentialRampToValueAtTime(0.0001, now + duration);

  osc.connect(amp);
  amp.connect(context.destination);
  osc.start(now);
  osc.stop(now + duration + 0.02);
}

function playStorySfx(story) {
  const base = 250 + story.title.length * 4;
  playTone({ frequency: base, type: "triangle", duration: 0.18, gain: 0.05 });
  playTone({ frequency: base * 1.5, type: "sine", duration: 0.25, delay: 0.12, gain: 0.03 });
  playTone({ frequency: base * 2.1, type: "square", duration: 0.1, delay: 0.38, gain: 0.02 });
}

function applyStoryTheme(story) {
  stage.style.background = story.theme.sky;
  ground.style.background = story.theme.ground;
  river.style.background = story.theme.river;
}

function playStoryAnimation() {
  if (masterTimeline) masterTimeline.pause();

  const story = storyOptions[Number(select.value) || 0];
  applyStoryTheme(story);
  spawnSparks(story.theme.sparkCount, story);
  playStorySfx(story);

  anime.set([hero, friend], {
    translateY: 0,
    rotate: 0,
    scale: 1
  });

  anime.set(sun, { scale: 1, rotate: 0 });
  anime.set(clouds, { translateX: 0 });
  anime.set(river, { scaleX: 1, scaleY: 1 });

  caption.textContent = `Scene: ${story.title}`;

  masterTimeline = anime
    .timeline({
      easing: "easeInOutSine",
      duration: 1200
    })
    .add({
      targets: sun,
      scale: [1, 1.35],
      rotate: [0, 80],
      duration: 1600,
      easing: "easeOutElastic(1, .5)"
    })
    .add(
      {
        targets: clouds,
        translateX: [0, story.theme.cloudDrift],
        duration: 2800,
        delay: anime.stagger(160)
      },
      "-=1400"
    )
    .add(
      {
        targets: hero,
        translateX: [0, 220],
        translateY: [0, -story.theme.heroHop, 0],
        rotate: [0, 18, -8, 0],
        easing: "easeOutBack"
      },
      "-=2200"
    )
    .add(
      {
        targets: friend,
        translateX: [0, -200],
        translateY: [0, -story.theme.friendHop, 0],
        rotate: [0, -15, 6, 0],
        easing: "easeOutBack"
      },
      "-=1800"
    )
    .add(
      {
        targets: ".spark",
        scale: [0, 1.8, 0.2],
        opacity: [0, 1, 0],
        translateY: () => anime.random(-80, 80),
        translateX: () => anime.random(-110, 110),
        duration: 1800,
        delay: anime.stagger(40, { from: "center" }),
        easing: "easeOutExpo"
      },
      "-=2300"
    )
    .add(
      {
        targets: river,
        scaleY: [1, 1.25, 1],
        scaleX: [1, 1.06, 1],
        duration: 1800,
        easing: "easeInOutQuart"
      },
      "-=2000"
    )
    .add({
      targets: [hero, friend],
      scale: [1, 1.12, 1],
      direction: "alternate",
      duration: 900,
      loop: 2
    })
    .add({
      targets: caption,
      opacity: [0.15, 1],
      scale: [0.9, 1.05, 1],
      duration: 1200,
      begin: () => {
        caption.textContent = story.caption;
      }
    });
}

populateOptions();
renderStoryOption(0);
applyStoryTheme(storyOptions[0]);

select.addEventListener("change", (event) => {
  renderStoryOption(Number(event.target.value));
  applyStoryTheme(storyOptions[Number(event.target.value)]);
});

playBtn.addEventListener("click", playStoryAnimation);
soundBtn.addEventListener("click", async () => {
  audioEnabled = !audioEnabled;
  soundBtn.textContent = audioEnabled ? "Sound: On 🔊" : "Sound: Off 🔇";
  soundBtn.setAttribute("aria-pressed", String(audioEnabled));
  if (audioEnabled && audioContext?.state === "suspended") {
    await audioContext.resume();
  }
});
