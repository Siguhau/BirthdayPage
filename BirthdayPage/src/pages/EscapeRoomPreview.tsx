import { useState } from "react";
import BirthdayPageView from "./BirthdayPageView";

const EscapeRoomPreview = () => {
  const [completed, setCompleted] = useState(false);
  return (
    <BirthdayPageView
      page={completed ? "birthday" : "escape-room"}
      onEscapeRoomComplete={() => {
        setCompleted(true);
      }}
      targetDate={0}
    />
  );
};

export default EscapeRoomPreview;
