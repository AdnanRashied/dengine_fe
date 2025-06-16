"use client";

import React, { FormEvent, ReactNode } from "react";

export interface FormProps {
  onSubmit?: (e: FormEvent<HTMLFormElement>) => void;
  children: ReactNode;
  className?: string;
  id?: string;
  autoComplete?: "on" | "off";
  noValidate?: boolean;
  role?: string;
}

const Form: React.FC<FormProps> = ({
  onSubmit,
  children,
  className,
  id,
  autoComplete = "off",
  noValidate = true,
  role = "form",
}) => {
  return (
    <form
      id={id}
      role={role}
      onSubmit={onSubmit}
      className={className ?? "space-y-5"}
      autoComplete={autoComplete}
      noValidate={noValidate}
    >
      {children}
    </form>
  );
};

export default Form;
