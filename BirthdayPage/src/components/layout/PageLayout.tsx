import type { PropsWithChildren } from "react";
import StarBackground from "./StarBackground";
import "./PageLayout.css";

type PageLayoutProps = PropsWithChildren<{
  locale: string;
  variant?: "default" | "immersive";
}>;

const PageLayout = ({
  children,
  locale,
  variant = "default",
}: PageLayoutProps) => (
  <div className={`page-layout page-layout--${variant}`} lang={locale}>
    <StarBackground />
    {children}
  </div>
);

export default PageLayout;
