import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'outline';
  fullWidth?: boolean;
  children: React.ReactNode;
}

const Button: React.FC<ButtonProps> = ({ 
  variant = 'primary', 
  fullWidth = false, 
  children, 
  className = '',
  ...props 
}) => {
  const baseStyles = "rounded-xl font-bold text-base py-3.5 px-6 transition-all duration-200 active:scale-95 flex items-center justify-center gap-2";
  
  const variants = {
    primary: "bg-primary text-background hover:bg-primary/90",
    secondary: "bg-primary/10 text-primary hover:bg-primary/20",
    ghost: "bg-transparent text-primary hover:bg-white/5",
    outline: "border border-white/10 bg-transparent text-white hover:bg-white/5"
  };

  const width = fullWidth ? "w-full" : "w-auto";

  return (
    <button 
      className={`${baseStyles} ${variants[variant]} ${width} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
