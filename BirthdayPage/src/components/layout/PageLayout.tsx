import type { PropsWithChildren } from "react";

type PageLayoutProps = PropsWithChildren<{
  locale: string;
}>;

const PageLayout = ({ children, locale }: PageLayoutProps) => (
  <div
    lang={locale}
    style={{
      minHeight: "100vh",
      width: "100vw",
      background:
        "linear-gradient(135deg, #232526 0%, #414345 40%, #23243a 100%)",
      backgroundAttachment: "fixed",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
    }}
  >
    {children}
  </div>
);

export default PageLayout;
