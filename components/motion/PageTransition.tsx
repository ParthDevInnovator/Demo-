"use client";

import React, { ReactNode } from "react";
import { ViewTransition } from "react";

interface PageTransitionProps {
  children: ReactNode;
}

export default function PageTransition({ children }: PageTransitionProps) {
  return (
    <ViewTransition name="nexus-page">
      <div>{children}</div>
    </ViewTransition>
  );
}
