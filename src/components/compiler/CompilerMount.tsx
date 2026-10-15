'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import { PythonCompiler } from './PythonCompiler';

export const CompilerMount: React.FC = () => {
  const pathname = usePathname();

  // Strict Exclusivity Gate: Completely unmount compiler on Blogs, Updates, and Admin
  if (
    !pathname ||
    pathname.startsWith('/blogs') ||
    pathname.startsWith('/updates') ||
    pathname.startsWith('/admin')
  ) {
    return null;
  }

  return <PythonCompiler />;
};
