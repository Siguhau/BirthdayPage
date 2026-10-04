export type ThemeName = "birthday" | "escape-room";

export type ThemeContextValue = {
  theme: ThemeName;
  setTheme: (theme: ThemeName) => void;
};
