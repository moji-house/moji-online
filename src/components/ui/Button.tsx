import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
  type?: 'button' | 'submit' | 'reset';
  variant?: 'primary' | 'secondary' | 'outline' | 'danger';
  className?: string;
  disabled?: boolean;
}

const Button = ({
  children,
  onClick,
  type = 'button',
  variant = 'primary',
  className = '',
  disabled = false,
  ...props
}: ButtonProps) => {
  const baseStyles = "px-4 py-2 rounded-md font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2";

  const variantStyles = {
    primary: "bg-blue-600 hover:bg-blue-700 text-white focus:ring-blue-500",
    secondary: "bg-gray-200 hover:bg-gray-300 text-gray-800 focus:ring-gray-500",
    outline: "bg-transparent border border-gray-300 hover:bg-gray-50 text-gray-700 focus:ring-gray-500",
    danger: "bg-red-600 hover:bg-red-700 text-white focus:ring-red-500",
  };

  const disabledStyles = "opacity-50 cursor-not-allowed";

  const buttonStyles = `${baseStyles} ${variantStyles[variant] || variantStyles.primary} ${disabled ? disabledStyles : ''} ${className}`;

  return (
    <button
      type={type}
      onClick={onClick}
      className={buttonStyles}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
