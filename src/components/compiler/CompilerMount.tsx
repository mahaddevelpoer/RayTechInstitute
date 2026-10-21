"use client";

import React from "react";
import { usePathname } from "next/navigation";
import dynamic from "next/dynamic";
const PythonCompiler = dynamic(
  () => import("./PythonCompiler").then((module) => module.PythonCompiler),
  { ssr: false },
);

export const CompilerMount: React.FC = () => {
  const pathname = usePathname();

  // Strict Exclusivity Gate: Completely unmount compiler on Blogs, Updates, and Admin
  if (
    !pathname ||
    !/^\/(classes|mcqs|notes|past-papers|practice)(\/|$)/.test(pathname)
  ) {
    return null;
  }

  return <PythonCompiler />;
};
