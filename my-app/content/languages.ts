/**
 * Site translation is switched off pending a better approach; see the
 * "Translation without Google's proxy" issue (#1). Flip this to re-enable the
 * dropdown in the header and mobile menu. Everything else stays wired.
 */
export const TRANSLATE_ENABLED = false;

/** Google Translate language codes. First four pinned, the rest alphabetical. */
export const pinned = [
  ["en", "English"],
  ["fr", "Français"],
  ["de", "Deutsch"],
  ["zh-CN", "中文"],
] as const;

export const others = [
  ["ar", "Arabic"],
  ["bn", "Bengali"],
  ["bg", "Bulgarian"],
  ["ca", "Catalan"],
  ["zh-TW", "Chinese (Traditional)"],
  ["hr", "Croatian"],
  ["cs", "Czech"],
  ["da", "Danish"],
  ["nl", "Dutch"],
  ["et", "Estonian"],
  ["fi", "Finnish"],
  ["el", "Greek"],
  ["iw", "Hebrew"],
  ["hi", "Hindi"],
  ["hu", "Hungarian"],
  ["id", "Indonesian"],
  ["it", "Italian"],
  ["ja", "Japanese"],
  ["ko", "Korean"],
  ["lv", "Latvian"],
  ["lt", "Lithuanian"],
  ["lb", "Luxembourgish"],
  ["ms", "Malay"],
  ["no", "Norwegian"],
  ["fa", "Persian"],
  ["pl", "Polish"],
  ["pt", "Portuguese"],
  ["ro", "Romanian"],
  ["ru", "Russian"],
  ["sr", "Serbian"],
  ["sk", "Slovak"],
  ["sl", "Slovenian"],
  ["es", "Spanish"],
  ["sw", "Swahili"],
  ["sv", "Swedish"],
  ["tl", "Tagalog"],
  ["ta", "Tamil"],
  ["th", "Thai"],
  ["tr", "Turkish"],
  ["uk", "Ukrainian"],
  ["ur", "Urdu"],
  ["vi", "Vietnamese"],
] as const;
