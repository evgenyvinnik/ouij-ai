/**
 * Button - Customizable button component with mystical styling
 *
 * Provides three visual variants (primary, secondary, ghost) and three sizes (sm, md, lg).
 * Styled with Carnivalee Freakshow font to match the Ouija board aesthetic.
 */

import React from 'react';

/**
 * Props for the Button component
 */
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /** Visual style variant of the button */
  variant?: 'primary' | 'secondary' | 'ghost';
  /** Size of the button */
  size?: 'sm' | 'md' | 'lg';
}

/**
 * Renders a styled button with customizable variant and size
 *
 * @param props - Component props including children and standard button attributes
 * @returns JSX element containing the styled button
 */
export function Button({
  children,
  variant = 'primary',
  size = 'md',
  className = '',
  ...props
}: ButtonProps) {
  const baseStyles =
    'rounded-lg font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed';

  const variantStyles = {
    primary:
      'bg-[#958219] text-white hover:bg-[#968a47] hover:shadow-[0_0_15px_#5c533b] hover:text-shadow-[0_0_5px_#5c533b]',
    secondary: 'bg-[#ebebeb] border-2 border-black hover:text-gray-500',
    ghost: 'text-black hover:bg-black hover:bg-opacity-10',
  };

  const sizeStyles = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg',
  };

  return (
    <button
      className={`${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
      style={{
        fontFamily: 'Carnivalee Freakshow, cursive',
        border: '1px solid black',
      }}
      {...props}
    >
      {children}
    </button>
  );
}
