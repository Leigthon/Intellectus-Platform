import React from "react";

function cx(...classes) {
  return classes.filter(Boolean).join(" ");
}

export function Card({ className, ...props }) {
  return (
    <div
      className={cx("rounded-2xl border border-gray-200 bg-white", className)}
      {...props}
    />
  );
}

export function CardHeader({ className, ...props }) {
  return <div className={cx("flex flex-col gap-1.5 p-6 pb-0", className)} {...props} />;
}

export function CardTitle({ className, ...props }) {
  return (
    <h3
      className={cx("text-lg font-semibold leading-none tracking-tight text-gray-900", className)}
      {...props}
    />
  );
}

export function CardContent({ className, ...props }) {
  return <div className={cx("p-6", className)} {...props} />;
}

