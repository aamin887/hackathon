/**
 * Utility for triggering haptic feedback using the Vibration API.
 * Patterns are designed to be subtle and non-intrusive.
 */

export const Haptics = {
  /**
   * A very short, light tap. Good for button presses.
   */
  light: () => {
    if (typeof navigator !== "undefined" && navigator.vibrate) {
      navigator.vibrate(10);
    }
  },

  /**
   * A slightly stronger tap. Good for selection or toggles.
   */
  medium: () => {
    if (typeof navigator !== "undefined" && navigator.vibrate) {
      navigator.vibrate(20);
    }
  },

  /**
   * A double tap. Good for success or completion.
   */
  success: () => {
    if (typeof navigator !== "undefined" && navigator.vibrate) {
      navigator.vibrate([10, 30, 10]);
    }
  },

  /**
   * A distinct pattern for warnings or errors.
   */
  warning: () => {
    if (typeof navigator !== "undefined" && navigator.vibrate) {
      navigator.vibrate([30, 50, 30]);
    }
  },
};
