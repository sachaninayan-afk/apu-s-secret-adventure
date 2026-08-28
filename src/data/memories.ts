/**
 * ============================================================
 *  APU // CONTENT CONFIGURATION
 *  Everything you need to personalise this experience is here.
 *  Drop your photos in  public/photos/   ->  "/photos/apu01.jpg"
 *  Drop your video in   public/media/    ->  "/media/final-video.mp4"
 *  Missing files degrade gracefully into a neon placeholder tile.
 * ============================================================
 */

export type MemoryCategory = "chaos" | "memories" | "secret" | "hidden";

export interface Memory {
  image: string;
  caption: string;
  date?: string;
  category?: MemoryCategory;
  /** portrait | landscape | square — only affects grid sizing */
  shape?: "portrait" | "landscape" | "square";
}

/** Add 20–50 of these. That's it. */
export const memories: Memory[] = [
  { image: "/photos/apu01.jpg", caption: "Our first chaos 😂", date: "2022", category: "chaos", shape: "portrait" },
  { image: "/photos/apu02.jpg", caption: "One of my favourite memories ❤️", date: "2023", category: "memories", shape: "landscape" },
  { image: "/photos/apu03.jpg", caption: "This photo should legally be deleted", date: "2023", category: "chaos", shape: "square" },
  { image: "/photos/apu04.jpg", caption: "You looked so happy here ❤️", date: "2023", category: "memories", shape: "portrait" },
  { image: "/photos/apu05.jpg", caption: "Certified menace behaviour", date: "2024", category: "chaos", shape: "landscape" },
  { image: "/photos/apu06.jpg", caption: "The day nobody stopped laughing", date: "2024", category: "memories", shape: "square" },
  { image: "/photos/apu07.jpg", caption: "Evidence. Your honour.", date: "2024", category: "chaos", shape: "portrait" },
  { image: "/photos/apu08.jpg", caption: "Golden hour, golden human", date: "2024", category: "memories", shape: "landscape" },
  { image: "/photos/apu09.jpg", caption: "Screaming. Crying. Throwing up.", date: "2025", category: "chaos", shape: "square" },
  { image: "/photos/apu10.jpg", caption: "Soft day, soft heart", date: "2025", category: "memories", shape: "portrait" },
  { image: "/photos/apu11.jpg", caption: "Peak unhinged energy", date: "2025", category: "chaos", shape: "landscape" },
  { image: "/photos/apu12.jpg", caption: "I kept this one for a reason", date: "2025", category: "memories", shape: "portrait" },
];

/** The one true photo used for the "FIND APU" level and hero reveals. */
export const heroPhoto = "/photos/apu01.jpg";

/** Optional personal video shown in the final locked file. */
export const finalVideo = "/media/final-video.mp4";

/** Hidden discoveries in LEVEL 04 (flashlight section). */
export const hiddenMemories: { image: string; text: string; x: number; y: number }[] = [
  { image: "/photos/apu03.jpg", text: "Remember this day? 😂", x: 18, y: 24 },
  { image: "/photos/apu05.jpg", text: "One of my favourite memories.", x: 74, y: 20 },
  { image: "/photos/apu07.jpg", text: "This photo should legally be deleted.", x: 30, y: 68 },
  { image: "/photos/apu09.jpg", text: "You looked so happy here ❤️", x: 80, y: 70 },
  { image: "/photos/apu11.jpg", text: "You weren't supposed to find this.", x: 50, y: 45 },
];

/** LEVEL 02 questions — every answer is accepted. */
export const quizQuestions = [
  { q: "Our most chaotic memory was ______?", hint: "there is no wrong answer, only chaos" },
  { q: "The thing I always tease you about is ______?", hint: "be honest" },
  { q: "If Apu were a natural disaster, she'd be ______?", hint: "affectionately" },
];

/** The heartfelt message. Edit these lines freely. */
export const finalMessage: string[] = [
  "Happy birthday apuuuuuuuuuuuuuuuuuuuuuuuuuu,",
  "pata nahi, fy mai idea nahi tha itna close ham kabhi hogeee,",
  "like jagde hi utne hue hai,",
  "merko abhi bhi yaad hai woh galti se hath rakhdia tha kandhe pr, if you remember,",
  "woh din se leke ab tak nahi rakhpaya hu 😂",
  "yeh choddd,",
  "but happy happy happy birthday apu,",
  "khush reh life mai, aur zyada overthink mat krrrr,",
  "aurrrr baki toh BHALU enjoy your day 🎉",
];

export const chaosCaptions = [
  "APU HAS CAUSED TOO MUCH CHAOS.",
  "ERROR 404: BRAINCELL NOT FOUND",
  "SYSTEM WARNING: TOO MUCH SASS DETECTED",
  "this is a war crime tbh",
  "she said 'one photo' and did THIS",
];
