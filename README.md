# Apu's Secret Adventure

Create a highly interactive, cinematic, surprise birthday website for a girl named Apu. This should NOT feel like a normal birthday webpage. It should feel like a secret video game + interactive movie + emotional memory experience where Apu must perform actions to unlock photos, videos, jokes, memories, and finally the birthday surprise.

CORE EXPERIENCE

The website should feel:

mysterious

funny

chaotic

futuristic

cute

emotional

highly polished

surprising

addictive to interact with

The visitor should constantly think:

“WHAT IS HAPPENING?”

then

“HAHAHA WHAT??”

then

“AWWWW 😭”

then finally

“OH MY GODDDDD!”

Do NOT reveal “Happy Birthday Apu” at the beginning.

DESIGN

Use a premium dark funky  cinematic interface:

black/deep charcoal background with dunky vibes

glowing white typography

subtle purple/pink/cyan neon accents

glassmorphism UI

smooth gradients

particle effects

cinematic transitions

subtle grain

elegant typography

responsive mobile-first design

smooth scrolling

micro-interactions everywhere

custom cursor on desktop

touch-friendly interactions on mobile

Avoid generic templates, cheesy birthday clipart, or basic card layouts.

Use real photos supplied later through clearly marked placeholders such as:

/photos/apu01.jpg

/photos/apu02.jpg

etc.

INTRO — “APU's FILE”

Open with a completely black screen.

A blinking terminal cursor appears.

Text types itself:

INITIALIZING...

SEARCHING MEMORY DATABASE...

SCANNING SUBJECT...

SUBJECT FOUND: APU

Then:

ACCESS DENIED

Text:

“You are not authorized to access, Apu's memories.”

Button:

[ PROVE YOU ARE APU ]

Add subtle glitch effects and sound effects.

LEVEL 1 — CATCH THE CAKE

After pressing the button, display:

LEVEL 01

CATCH THE BIRTHDAY

A small glowing birthday cake moves randomly around the screen.

Text:

“Catch it before it disappears.”

The user must click/tap the cake.

Make it genuinely interactive, with the cake moving faster after failed attempts.

When caught:

screen shake

particle explosion

celebratory sound

giant “ACCESS GRANTED”

briefly reveal one beautiful photo of Apu

Then show:

MEMORY FRAGMENT 01 / 05 UNLOCKED

Button:

CONTINUE

LEVEL 2 — FRIENDSHIP QUIZ

 questions about Apu and the friendship.

Example:

“Our most chaotic memory was ______?”

Correct answers:text box(for answer)

ANY answer she inputs is correct , so just do animation thing here and move on

satisfying animation

glowing checkmark

photo reveal

funny sound

Wrong answers:

playful vibration

After completing the questions:

MEMORY FRAGMENT 02 UNLOCKED

Reveal several photos using cinematic staggered animations.

LEVEL 3 — FIND THE MEMORY

Display many small photo thumbnails scattered across the screen.

Instruction:

FIND APU

“You have 10 seconds.”

The player must click the correct photo.

Wrong photos produce funny reactions.

Correct photo:

zoom dramatically into the image

background transforms

dozens of related photos emerge around it

smooth transition into a full-screen memory collage

Show:

MEMORY FRAGMENT 03 UNLOCKED

LEVEL 4 — HIDDEN MEMORIES

Create a dark interactive section.

Text:

“Some memories don't want to be found.”

The screen should have a flashlight/spotlight controlled by the mouse or finger.

As the user moves around, hidden photos, short messages, dates, inside jokes and tiny Easter eggs become visible.

Include at least 5 hidden discoveries.

Examples:

“Remember this day? 😂”

“One of my favorite memories.”

“This photo should legally be deleted.”

“You looked so happy here ❤️”

Every discovery creates a tiny visual reward.

After enough discoveries:

MEMORY FRAGMENT 04 UNLOCKED

LEVEL 5 — CHOOSE A DOOR

Display three mysterious doors:

🚪 CHAOS

Funny and embarrassing memories

🚪 MEMORIES

Beautiful friendship moments

🚪 SECRET

The emotional surprise

The user must choose one.

Make each door physically animate open.

Regardless of choice, eventually guide the visitor toward the final section, but make the selected path feel unique.

CHAOS PATH

Fast animations, memes, funny photos, ridiculous captions, silly sound effects, fake system errors, playful insults, GIF-like motion.

Example text:

“APU HAS CAUSED TOO MUCH CHAOS.”

MEMORIES PATH

Slow cinematic transitions, warm atmosphere, beautiful photography, dates, short emotional captions, elegant typography.

SECRET PATH

Dark screen.

Minimal piano/ambient music.

Text appears one line at a time:

“Okay... enough jokes.”

Pause.

“There is something I actually wanted to tell you.”

Then reveal a heartfelt personal message area.

Use placeholders for a customizable message:

[Happy birthday apuuuuuuuuuuuuuuuuuuuuuuuuuu, pata nahi , fy mai idea nahi tha itna close ham kabhi hogeee, like jagde hi utne hue hai , merko abhi bhi yaad hai woh galti se hath rakhdia tha kandhe pr , if you remember ,woh din se leke ab tak nahi rakhpaya hu 😂, yeh choddd, but happy happy happy birthday apu , khush reh life mai , aur zyada overthink mat krrrr , aurrrr baki toh BHALU enjoy your day🎉]

OPTIONAL INTERACTION — VOICE / HOLD TO REVEAL

Create a button:

HOLD TO UNLOCK

When pressed:

circular progress animation

glowing microphone-style UI

fake “voice verification” animation

scan particles

text:

VOICE MATCHING...

APU DETECTED

Then unlock the next memory.

If browser microphone permissions are unavailable, gracefully fall back to a normal hold interaction. The experience must never break.

FINAL LOCKED FILE

After completing the levels:

Everything fades to black.

Text:

ALL MEMORY FRAGMENTS RECOVERED.

Then:

ONE FINAL FILE REMAINS LOCKED.

Display:

FINAL_MESSAGE.mp4

Button:

[ OPEN MY HEART ❤️ ]

When clicked:

start cinematic music

smooth camera-like zoom

reveal best photos one by one

optionally play a personal video if provided

display the personal message line-by-line

Use placeholder:

/media/final-video.mp4

FINAL BIRTHDAY REVEAL

After the emotional message, suddenly cut to black.

Countdown:

3

2

1

Huge cinematic explosion.

Fireworks, confetti, glowing particles, floating hearts and photos.

Then reveal:

🎂 HAPPY BIRTHDAY, APU ❤️

Subheading:

“Another year of being chaotic, lovable, impossible, hilarious, and completely irreplaceable.”

Then show a beautiful photo of Apu.

Add a final button:

[ ENTER THE NEXT YEAR ]

Clicking it triggers a final photo explosion and a message:

“More memories loading... ❤️”

EASTER EGGS

Include several hidden interactions:

clicking a tiny star reveals a secret message

double-clicking a photo makes it react

keyboard shortcut reveals an easter egg

moving the mouse creates subtle particle trails

clicking a suspicious button gives a funny response

one hidden photo says:

“You weren't supposed to find this.”

AUDIO

Support:

background music

interaction sounds

glitch sounds

soft emotional transition music

final birthday celebration sound

Include a visible mute/unmute button.

Do NOT autoplay loud audio before user interaction. Start audio only after the first meaningful interaction.

PHOTO SYSTEM

Build the site so I can easily replace placeholder images later.

Create a simple configuration/data structure like:

const memories = [

  {

    image: "/photos/apu01.jpg",

    caption: "Our first chaos 😂",

    date: "2022"

  },

  {

    image: "/photos/apu02.jpg",

    caption: "One of my favorite memories ❤️",

    date: "2023"

  }

];

Make it extremely easy to add 20–50 photos.

Support:

portrait photos

landscape photos

square photos

videos

captions

dates

categories

TECHNICAL QUALITY

Create a polished production-quality implementation.

Requirements:

responsive on desktop, tablet and mobile

smooth 60fps animations where possible

optimize image loading

lazy-load photos

preload only critical assets

graceful fallbacks

accessible buttons

no broken interactions

no horizontal scrolling

preserve state while moving through levels

animated progress indicator

clean reusable components

easy-to-edit content configuration

Prefer:

React

modern CSS

Framer Motion or GSAP for animation

Lucide icons or similarly clean icons

Do NOT make it look like a generic React template.

MOST IMPORTANT

The entire website should tell a story:

MYSTERY → GAME → CHAOS → MEMORIES → EMOTION → SHOCK → BIRTHDAY EXPLOSION, animation

The user should have to DO things to reveal the experience.

Every major interaction should unlock something visually meaningful.

Make the final result feel like someone spent weeks secretly building a personalized digital birthday experience specifically for Apu.

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/dd689a07-b15b-4258-8928-22716af2de05).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
