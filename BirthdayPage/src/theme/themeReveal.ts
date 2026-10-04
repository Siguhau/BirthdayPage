export const themeRevealStorageKey = "birthday-theme-reveal-seen";

export const hasSeenThemeReveal = () => {
  try {
    return window.localStorage.getItem(themeRevealStorageKey) === "true";
  } catch {
    return false;
  }
};

export const rememberThemeReveal = () => {
  try {
    window.localStorage.setItem(themeRevealStorageKey, "true");
  } catch {
    // The current visit still works when browser storage is unavailable.
  }
};
