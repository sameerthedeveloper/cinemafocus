import React from 'react';
import { Link } from 'react-router-dom';
import clsx from 'clsx';
import { ArrowRight } from 'lucide-react';

const Button = ({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  to, 
  href,
  onClick, 
  className,
  icon = false,
  ...props 
}) => {
  const baseStyles = "inline-flex items-center justify-center font-medium tracking-wide transition-all duration-300 focus:outline-none disabled:opacity-50 disabled:pointer-events-none";
  
  const variants = {
    primary: "bg-primary text-primary-foreground hover:bg-primary/90",
    secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
    outline: "border border-input bg-transparent hover:bg-accent hover:text-accent-foreground",
    ghost: "hover:bg-accent hover:text-accent-foreground",
    link: "text-primary underline-offset-4 hover:underline",
  };

  const sizes = {
    sm: "h-9 px-3 text-xs uppercase",
    md: "h-11 px-8 text-sm uppercase",
    lg: "h-14 px-10 text-base uppercase",
    icon: "h-10 w-10",
  };

  const classes = clsx(
    baseStyles,
    variants[variant],
    sizes[size],
    className
  );

  const content = (
    <>
      {children}
      {icon && <ArrowRight className="ml-2 h-4 w-4" />}
    </>
  );

  if (to) {
    return (
      <Link to={to} className={classes} {...props}>
        {content}
      </Link>
    );
  }

  if (href) {
    return (
      <a href={href} className={classes} {...props}>
        {content}
      </a>
    );
  }

  return (
    <button onClick={onClick} className={classes} {...props}>
      {content}
    </button>
  );
};

export default Button;
