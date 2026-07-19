import BirthdayTransitionPreview from "./pages/BirthdayTransitionPreview";
import LiveBirthdayPage from "./pages/LiveBirthdayPage";

function App() {
  const previewEnabled =
    import.meta.env.DEV &&
    new URLSearchParams(window.location.search).get("preview") === "birthday";

  return previewEnabled ? <BirthdayTransitionPreview /> : <LiveBirthdayPage />;
}

export default App;
