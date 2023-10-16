import { memo, useLayoutEffect, useRef } from "react";
import usePrevious from "@/hooks/usePrevious";

const SingleInputbutton = ({
  focus,
  autoFocus,
  className,
  placeholder,
  ...props
}) => {
  const inputRef = useRef(null);
  const prevFocus = usePrevious({ value: !!focus });

  useLayoutEffect(() => {
    if (inputRef.current) {
      if (focus && autoFocus) {
        inputRef.current.focus();
      }
      if (focus && autoFocus && autoFocus !== prevFocus) {
        inputRef.current.focus();
        inputRef.current.select();
      }
    }
  }, [autoFocus, focus, prevFocus]);
  return (
    <input
      ref={inputRef}
      {...props}
      className={className}
      placeholder={placeholder}
    />
  );
};

const SingleInput = memo(SingleInputbutton);

export default SingleInput;
