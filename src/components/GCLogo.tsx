import React from 'react';

interface GCLogoProps {
  className?: string;
  size?: number;
}

export default function GCLogo({ className = 'w-10 h-10', size }: GCLogoProps) {
  return (
    <svg
      viewBox="0 0 120 100"
      className={className}
      style={size ? { width: size, height: size } : undefined}
      fill="none"
      stroke="currentColor"
      strokeWidth="7"
      strokeLinecap="round"
      strokeLinejoin="round"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Circle/Bowl of 'g' */}
      <circle cx="45" cy="45" r="16" />
      
      {/* Stem and Descender of 'g' */}
      <path d="M 61,29 L 61,61 C 61,78 49,85 35,85 C 31,85 27,84 24,82" />
      
      {/* Interlocking 'c' */}
      <path d="M 78,32 A 16,16 0 1,0 78,58" />
    </svg>
  );
}
