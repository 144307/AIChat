import { useCallback, useRef } from "react";

export default function useThrottle(
  callback: (...args: unknown[]) => void,
  delay = 500
) {
  const isWaiting = useRef(false);

  return useCallback(
    (...args: unknown[]) => {
      if (isWaiting.current) return;

      callback(...args);
      isWaiting.current = true;

      setTimeout(() => {
        isWaiting.current = false;
      }, delay);
    },
    [callback, delay]
  );
}
