import type { PropsWithChildren } from "react";
import "./BirthdayPreviewControls.css";

const PreviewControlsPanel = ({ children }: PropsWithChildren) => (
  <details className="birthday-preview-controls">
    <summary className="birthday-preview-controls__button">
      Preview controls
    </summary>
    <div className="birthday-preview-controls__panel">{children}</div>
  </details>
);

export default PreviewControlsPanel;
