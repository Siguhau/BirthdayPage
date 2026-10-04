export const escapeRoomProgressKey = "birthday-escape-room-progress";

export const clearGameProgress = () => {
  try {
    window.localStorage.removeItem(escapeRoomProgressKey);
  } catch {
    // Reset the running game even if browser storage is unavailable.
  }
};
