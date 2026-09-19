import React from "react";

interface NexusLogoProps {
  className?: string;
  size?: number;
}

export default function NexusLogo({ className = "h-8 w-auto", size }: NexusLogoProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 120 120"
      width={size}
      height={size}
      className={className}
      fill="none"
    >
      <rect width="120" height="120" rx="20" fill="#0F1216" />
      <rect
        x="1"
        y="1"
        width="118"
        height="118"
        rx="19"
        stroke="#252B33"
        strokeWidth="1"
      />
      {/* Crisp geometric N-topology structure */}
      <path
        d="M34 86V34L60 62L86 34V86"
        stroke="#F2F4F7"
        strokeWidth="5.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Subtle restrained blue accent on the central routing nexus */}
      <circle cx="34" cy="34" r="4.5" fill="#A0A7B0" />
      <circle cx="86" cy="34" r="4.5" fill="#A0A7B0" />
      <circle cx="60" cy="62" r="5" fill="#5B8DEF" stroke="#F2F4F7" strokeWidth="1.5" />
      <circle cx="34" cy="86" r="4.5" fill="#A0A7B0" />
      <circle cx="86" cy="86" r="4.5" fill="#A0A7B0" />
    </svg>
  );
}
