import { useRef } from "react";

export const useCountRenders = () => {
  const count = useRef(0);
  console.log(`render: ${count.current++}`);
};
