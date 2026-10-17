import { type ButtonHTMLAttributes, type InputHTMLAttributes, type ReactNode, type TextareaHTMLAttributes } from "react";
import clsx from "clsx";

export function cn(...parts: Array<string | false | null | undefined>) {
  return clsx(parts);
}

export function Button({
  variant = "primary",
  className,
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "ghost";
}) {
  return (
    <button
      className={cn(
        "inline-flex items-center justify-center rounded-md px-4 py-2 text-sm font-semibold transition disabled:opacity-50",
        variant === "primary" && "bg-ocean text-white hover:bg-ink",
        variant === "secondary" && "bg-sand text-ink hover:bg-line",
        variant === "ghost" && "text-ocean hover:bg-sand",
        className
      )}
      {...props}
    />
  );
}

export function Input(props: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...props}
      className={cn(
        "w-full rounded-md border border-line bg-white px-3 py-2 text-sm outline-none focus:border-teal",
        props.className
      )}
    />
  );
}

export function Textarea(props: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      {...props}
      className={cn(
        "w-full rounded-md border border-line bg-white px-3 py-2 text-sm outline-none focus:border-teal",
        props.className
      )}
    />
  );
}

export function Label({ children, htmlFor }: { children: ReactNode; htmlFor?: string }) {
  return (
    <label htmlFor={htmlFor} className="mb-1 block text-sm font-medium">
      {children}
    </label>
  );
}

export function Card({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div className={cn("rounded-xl border border-line bg-white p-5 shadow-sm", className)}>
      {children}
    </div>
  );
}

export function PageHeader({
  title,
  description,
}: {
  title: string;
  description?: string;
}) {
  return (
    <div className="mb-6">
      <h1 className="font-display text-2xl text-ink">{title}</h1>
      {description ? <p className="mt-1 text-sm text-ink/70">{description}</p> : null}
    </div>
  );
}

export function Alert({
  children,
  tone = "info",
}: {
  children: ReactNode;
  tone?: "info" | "success" | "error";
}) {
  return (
    <div
      className={cn(
        "rounded-md px-3 py-2 text-sm",
        tone === "info" && "bg-sand",
        tone === "success" && "bg-teal/10 text-teal",
        tone === "error" && "bg-red-50 text-red-700"
      )}
    >
      {children}
    </div>
  );
}

export function EmptyState({ title, description }: { title: string; description?: string }) {
  return (
    <div className="rounded-xl border border-dashed border-line bg-white px-6 py-12 text-center">
      <p className="font-display text-lg">{title}</p>
      {description ? <p className="mt-2 text-sm text-ink/65">{description}</p> : null}
    </div>
  );
}
