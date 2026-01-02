import React from "react";

/**
 * Standard input field
 */
export default function TextInput(
  props: React.InputHTMLAttributes<HTMLInputElement>
) {
  return (
    <input
      {...props}
      className={`w-full rounded border px-3 py-2 outline-none focus:ring-2 focus:ring-[#f46150] ${
        props.className ?? ""
      }`}
    />
  );
}
