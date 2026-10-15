"use client";

import Link from "next/link";
import { Eye, EyeOff } from "lucide-react";
import { useId, useState } from "react";

type PasswordFieldProps = {
  id?: string;
  name: string;
  label: string;
  autoComplete?: string;
  minLength?: number;
  required?: boolean;
  defaultValue?: string;
  hint?: string;
  forgotHref?: string;
};

export function PasswordField({
  id: idProp,
  name,
  label,
  autoComplete = "current-password",
  minLength,
  required = true,
  defaultValue,
  hint,
  forgotHref
}: PasswordFieldProps) {
  const [visible, setVisible] = useState(false);
  const generatedId = useId();
  const id = idProp || generatedId;

  return (
    <div className="admin-password-field">
      <div className="admin-password-label-row">
        <label htmlFor={id}>{label}</label>
        {forgotHref ? (
          <Link className="admin-password-forgot" href={forgotHref}>
            Forgot password?
          </Link>
        ) : null}
      </div>
      <div className="admin-password-input-wrap">
        <input
          id={id}
          type={visible ? "text" : "password"}
          name={name}
          required={required}
          autoComplete={autoComplete}
          minLength={minLength}
          defaultValue={defaultValue}
          spellCheck={false}
        />
        <button
          type="button"
          className="admin-password-toggle"
          tabIndex={-1}
          onClick={() => setVisible((v) => !v)}
          aria-label={visible ? "Hide password" : "Show password"}
          aria-pressed={visible}
        >
          {visible ? <EyeOff size={18} strokeWidth={1.75} /> : <Eye size={18} strokeWidth={1.75} />}
        </button>
      </div>
      {hint ? <span className="field-hint">{hint}</span> : null}
    </div>
  );
}
