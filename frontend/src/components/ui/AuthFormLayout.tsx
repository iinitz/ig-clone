'use client';

import React from 'react';

interface AuthFormLayoutProps {
  title: string;
  children: React.ReactNode;
}

export default function AuthFormLayout({ title, children }: AuthFormLayoutProps) {
  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-80px)]">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <h1 className="text-3xl font-bold text-center mb-6">{title}</h1>
        {children}
      </div>
    </div>
  );
}
