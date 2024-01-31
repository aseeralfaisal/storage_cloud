import { useEffect } from "react";

const useClickOutside = (ref: React.RefObject<HTMLElement>,
  handler: (event: React.MouseEvent) => void
) => {
  useEffect(() => {
    const listener = (event: React.MouseEvent<HTMLElement>) => {
      if (!ref.current || ref.current.contains(event.target as Node)) {
        return;
      }
      handler(event);
    };

    document.addEventListener("mousedown", listener);
    document.addEventListener("touchstart", listener);

    return () => {
      document.removeEventListener("mousedown", listener);
      document.removeEventListener("touchstart", listener);
    };
  }, [ref, handler]);
};

export default useClickOutside;
