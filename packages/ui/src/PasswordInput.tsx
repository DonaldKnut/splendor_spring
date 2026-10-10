"use client";

import {
  useState,
  type InputHTMLAttributes,
  type ReactNode,
  type CSSProperties,
} from "react";
import clsx from "clsx";
import { IconEye, IconEyeOff } from "./icons";

export function PasswordInput({
  className,
  leading,
  wrapperClassName,
  style,
  ...props
}: Omit<InputHTMLAttributes<HTMLInputElement>, "type"> & {
  leading?: ReactNode;
  wrapperClassName?: string;
}) {
  const [visible, setVisible] = useState(false);
  const padStyle: CSSProperties = {
    ...style,
    ...(leading ? { paddingLeft: "2.75rem" } : null),
    paddingRight: "2.75rem",
  };

  return (
    <div className={clsx("relative", wrapperClassName)}>
      {leading ? (
        <span className="pointer-events-none absolute left-3.5 top-1/2 z-[1] -translate-y-1/2 text-current opacity-55">
          {leading}
        </span>
      ) : null}
      <input
        {...props}
        type={visible ? "text" : "password"}
        className={clsx(className)}
        style={padStyle}
      />
      <button
        type="button"
        tabIndex={-1}
        aria-label={visible ? "Hide password" : "Show password"}
        aria-pressed={visible}
        onClick={() => setVisible((v) => !v)}
        className="absolute right-2.5 top-1/2 z-[1] flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-md text-current opacity-55 transition hover:opacity-100"
      >
        {visible ? <IconEyeOff /> : <IconEye />}
      </button>
    </div>
  );
}
