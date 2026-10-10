"use client";

import {
  type InputHTMLAttributes,
  type ReactNode,
  type CSSProperties,
} from "react";
import clsx from "clsx";

export function IconInput({
  className,
  leading,
  trailing,
  wrapperClassName,
  style,
  ...props
}: InputHTMLAttributes<HTMLInputElement> & {
  leading?: ReactNode;
  trailing?: ReactNode;
  wrapperClassName?: string;
}) {
  const padStyle: CSSProperties = {
    ...style,
    ...(leading ? { paddingLeft: "2.75rem" } : null),
    ...(trailing ? { paddingRight: "2.75rem" } : null),
  };

  return (
    <div className={clsx("relative", wrapperClassName)}>
      {leading ? (
        <span className="pointer-events-none absolute left-3.5 top-1/2 z-[1] -translate-y-1/2 text-current opacity-55">
          {leading}
        </span>
      ) : null}
      <input {...props} className={clsx(className)} style={padStyle} />
      {trailing ? (
        <span className="pointer-events-none absolute right-3.5 top-1/2 z-[1] -translate-y-1/2 text-current opacity-55">
          {trailing}
        </span>
      ) : null}
    </div>
  );
}
