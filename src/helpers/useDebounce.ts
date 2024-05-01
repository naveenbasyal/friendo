import { useEffect, useState } from "react";

interface debounceProps {
  value: string;
  delay: number;
}

const useDebounce = ({ value, delay = 500 }: debounceProps) => {
  const [debouncedValue, setDebouncedValue] = useState(value);
  useEffect(() => {
    if (value === "") {
      setDebouncedValue("");
      return;
    }

    const intervalId = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(intervalId);
    };
  }, [value, delay]);

  return debouncedValue;
};

export default useDebounce;
