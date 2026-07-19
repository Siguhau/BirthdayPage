import {
  useLayoutEffect,
  useMemo,
  useState,
  type PropsWithChildren,
} from "react";
import { ThemeContext } from "./ThemeContext";
import type { ThemeName } from "./types";

type ThemeProviderProps = PropsWithChildren<{
  initialTheme?: ThemeName;
}>;

const ThemeProvider = ({
  children,
  initialTheme = "birthday",
}: ThemeProviderProps) => {
  const [theme, setTheme] = useState<ThemeName>(initialTheme);

  useLayoutEffect(() => {
    const rootElement = document.documentElement;
    const previousTheme = rootElement.getAttribute("data-theme");
    rootElement.setAttribute("data-theme", theme);

    return () => {
      if (previousTheme === null) {
        rootElement.removeAttribute("data-theme");
      } else {
        rootElement.setAttribute("data-theme", previousTheme);
      }
    };
  }, [theme]);

  const contextValue = useMemo(() => ({ theme, setTheme }), [theme]);

  return (
    <ThemeContext.Provider value={contextValue}>
      {children}
    </ThemeContext.Provider>
  );
};

export default ThemeProvider;
