const interactionKey = "KeyE";

export const createInteractionKeyGate = () => {
  let held = false;

  return {
    handleKeyDown(code: string) {
      if (code !== interactionKey || held) return false;

      held = true;
      return true;
    },
    handleKeyUp(code: string) {
      if (code === interactionKey) {
        held = false;
      }
    },
    reset() {
      held = false;
    },
  };
};
