export const requestMouseLook = () => {
  if (
    document.pointerLockElement !== null ||
    typeof document.documentElement.requestPointerLock !== "function"
  ) {
    return;
  }

  const request = document.documentElement.requestPointerLock();
  // Older implementations return void instead of a Promise.
  Promise.resolve(request).catch(() => {
    // The browser can reject pointer lock when the user leaves the page or
    // blocks the permission. The next explicit Resume action can retry it.
  });
};

export const releaseMouseLook = () => {
  if (
    document.pointerLockElement === null ||
    typeof document.exitPointerLock !== "function"
  ) {
    return;
  }
  document.exitPointerLock();
};
