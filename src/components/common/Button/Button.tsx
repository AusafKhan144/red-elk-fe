import { ButtonHTMLAttributes } from "react";

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "filled" | "outline" | "ghost";
}

export default function Button({ variant = "filled", className = "", ...props }: Props) {
  const base = "inline-flex items-center justify-center gap-2 px-4 py-2 text-sm font-semibold rounded-xl transition-colors focus:outline-none focus:ring-2 focus:ring-elk-rose";
  const variants = {
    filled: "bg-elk-red hover:bg-red-700 text-white",
    outline: "border-2 border-elk-red text-elk-red hover:bg-red-50",
    ghost: "text-elk-red hover:bg-red-50",
  };
  return <button {...props} className={`${base} ${variants[variant]} ${className}`} />;
}
