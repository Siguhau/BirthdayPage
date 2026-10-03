export const escapeRoomProgressKey = "birthday-escape-room-progress";

export const clearGameProgress = () => {
  window.localStorage.removeItem(escapeRoomProgressKey);
};
