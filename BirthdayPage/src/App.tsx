import BirthdayTransitionPreview from "./pages/BirthdayTransitionPreview";
import CountdownRevealPreview from "./pages/CountdownRevealPreview";
import EscapeRoomPreview from "./pages/EscapeRoomPreview";
import LiveBirthdayPage from "./pages/LiveBirthdayPage";

function App() {
  const preview = import.meta.env.DEV
    ? new URLSearchParams(window.location.search).get("preview")
    : null;

  if (preview === "birthday") return <BirthdayTransitionPreview />;
  if (preview === "teaser") return <CountdownRevealPreview />;
  if (preview === "escape-room") return <EscapeRoomPreview />;
  return <LiveBirthdayPage />;
}

export default App;
