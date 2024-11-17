import ErrorIcon from "assets/icons/error.svg?react";
import { useCallback, useRef } from "react";

export const useAction = <Args extends any[]>(
  fn: (...args: Args) => Promise<unknown>,
  options?: {
    /**
     * @description Debounce time in milliseconds
     */
    debounce?: number;
  },
): ((...args: Args) => void) => {
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const { debounce: debounceTime } = options ?? {};

  const action = useCallback(
    (...args: Args) => {
      fn(...args);
    },
    [fn],
  );

  return useCallback(
    (...args: Args) => {
      if (debounceTime) {
        if (timerRef.current) {
          clearTimeout(timerRef.current);
        }
        timerRef.current = setTimeout(() => {
          action(...args);
        }, debounceTime);
      } else {
        action(...args);
      }
    },
    [action, debounceTime],
  );
};
