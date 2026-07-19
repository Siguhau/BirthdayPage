import type { PropsWithChildren } from "react";
import StarBackground from "./StarBackground";
import "./PageLayout.css";

type PageLayoutProps = PropsWithChildren<{
  locale: string;
}>;

const PageLayout = ({ children, locale }: PageLayoutProps) => (
  <div className="page-layout" lang={locale}>
    <StarBackground />
    {children}
  </div>
);

export default PageLayout;
