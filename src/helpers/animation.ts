export const animation = {
  animate: (callback: () => void) => {
    callback();

    requestAnimationFrame(() => animation.animate(callback));
  },
};
