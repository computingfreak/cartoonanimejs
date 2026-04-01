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
    caption: "Together we can fly farther!"
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
    caption: "Listen closely—the sea tells stories."
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
    caption: "Kindness rises like warm bread!"
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
    caption: "Even tiny lights can guide the world."
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
    caption: "Curiosity turns storms into songs."
  }
];

const stage = document.querySelector("#stage");
const select = document.querySelector("#story-select");
const storyCopy = document.querySelector("#story-copy");
const playBtn = document.querySelector("#play-btn");
const caption = document.querySelector("#caption");

const hero = document.querySelector("#hero");
const friend = document.querySelector("#friend");
const sun = document.querySelector(".sun");
const clouds = document.querySelectorAll(".cloud");
const river = document.querySelector(".river");

let masterTimeline;

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

function spawnSparks(total = 22) {
  const previous = stage.querySelectorAll(".spark");
  previous.forEach((p) => p.remove());

  for (let i = 0; i < total; i += 1) {
    const spark = document.createElement("div");
    spark.className = "spark";
    spark.style.left = `${Math.random() * 95}%`;
    spark.style.top = `${Math.random() * 85}%`;
    stage.appendChild(spark);
  }
}

function playStoryAnimation() {
  if (masterTimeline) masterTimeline.pause();

  spawnSparks();

  anime.set([hero, friend], {
    translateY: 0,
    rotate: 0,
    scale: 1
  });

  anime.set(sun, { scale: 1, rotate: 0 });
  anime.set(clouds, { translateX: 0 });
  anime.set(river, { scaleX: 1, scaleY: 1 });

  const story = storyOptions[Number(select.value) || 0];
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
        translateX: [0, 180],
        duration: 2800,
        delay: anime.stagger(160)
      },
      "-=1400"
    )
    .add(
      {
        targets: hero,
        translateX: [0, 220],
        translateY: [0, -85, 0],
        rotate: [0, 18, -8, 0],
        easing: "easeOutBack"
      },
      "-=2200"
    )
    .add(
      {
        targets: friend,
        translateX: [0, -200],
        translateY: [0, -70, 0],
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

select.addEventListener("change", (event) => {
  renderStoryOption(Number(event.target.value));
});

playBtn.addEventListener("click", playStoryAnimation);
