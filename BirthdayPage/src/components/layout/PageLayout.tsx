import type { PropsWithChildren } from "react";
import "./PageLayout.css";

type PageLayoutProps = PropsWithChildren<{
  locale: string;
}>;

const PageLayout = ({ children, locale }: PageLayoutProps) => (
  <div className="page-layout" lang={locale}>
    {children}
  </div>
);

export default PageLayout;
