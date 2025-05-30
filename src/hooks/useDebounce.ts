import { useEffect, useState } from "react";

type UseDebounceProps<T> = {
  value: T;
  delay: number;
};

export default function useDebounce<T>({ value, delay }: UseDebounceProps<T>) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}
