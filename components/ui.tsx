
import React, { InputHTMLAttributes, ButtonHTMLAttributes, forwardRef } from 'react';

// --- Utils ---
const cn = (...classes: (string | undefined | null | false)[]) => classes.filter(Boolean).join(' ');

// --- Button ---
interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'outline' | 'ghost' | 'destructive' | 'secondary';
  size?: 'sm' | 'md' | 'lg' | 'icon';
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'default', size = 'md', ...props }, ref) => {
    const baseStyles = "inline-flex items-center justify-center rounded-lg font-medium transition-all duration-200 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-50 disabled:pointer-events-none";
    const variants = {
      default: "bg-primary text-primary-foreground hover:bg-primary/90 shadow-sm",
      destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90 shadow-sm",
      outline: "border-2 border-input bg-transparent hover:bg-slate-100 hover:text-slate-900 dark:hover:bg-slate-800 dark:hover:text-slate-100",
      secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
      ghost: "hover:bg-slate-100 hover:text-slate-900 dark:hover:bg-slate-800 dark:hover:text-slate-100",
    };
    const sizes = {
      sm: "h-9 px-3 text-xs",
      md: "h-10 px-4 py-2 text-sm",
      lg: "h-11 px-8",
      icon: "h-10 w-10",
    };
    return (
      <button
        ref={ref}
        className={cn(baseStyles, variants[variant], sizes[size], className)}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

// --- Input ---
export const Input = forwardRef<HTMLInputElement, InputHTMLAttributes<HTMLInputElement>>(
  ({ className, ...props }, ref) => {
    return (
      <input
        ref={ref}
        className={cn(
          "flex h-11 w-full rounded-lg border-2 border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-slate-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/20 disabled:cursor-not-allowed disabled:opacity-50 transition-all text-slate-900 dark:text-slate-100",
          className
        )}
        {...props}
      />
    );
  }
);
Input.displayName = "Input";

// --- Card ---
export const Card = ({ className, children }: { className?: string, children?: React.ReactNode }) => (
  <div className={cn("rounded-xl border-2 border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-950 dark:text-slate-50 shadow-sm hover:shadow-md transition-shadow duration-300", className)}>
    {children}
  </div>
);

export const CardHeader = ({ className, children }: { className?: string, children?: React.ReactNode }) => (
  <div className={cn("flex flex-col space-y-1.5 p-6", className)}>{children}</div>
);

export const CardTitle = ({ className, children }: { className?: string, children?: React.ReactNode }) => (
  <h3 className={cn("text-lg font-bold leading-none tracking-tight text-slate-950 dark:text-white", className)}>{children}</h3>
);

export const CardContent = ({ className, children }: { className?: string, children?: React.ReactNode }) => (
  <div className={cn("p-6 pt-0", className)}>{children}</div>
);

// --- Badge ---
export const Badge = ({ children, variant = 'default', className }: { children?: React.ReactNode, variant?: 'default' | 'secondary' | 'outline' | 'destructive' | 'success' | 'warning', className?: string }) => {
  const variants = {
    default: "border-transparent bg-primary text-primary-foreground",
    secondary: "border-transparent bg-secondary text-secondary-foreground",
    destructive: "border-transparent bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
    outline: "text-slate-700 dark:text-slate-300 border-2 border-slate-200 dark:border-slate-700",
    success: "border-transparent bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
    warning: "border-transparent bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400"
  };
  return (
    <div className={cn("inline-flex items-center rounded-md border px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider transition-colors", variants[variant], className)}>
      {children}
    </div>
  );
};

// --- Modal / Dialog ---
export const Modal = ({ isOpen, onClose, title, children }: { isOpen: boolean, onClose: () => void, title: string, children?: React.ReactNode }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 animate-in fade-in duration-300">
      <div className="relative w-full max-w-lg rounded-2xl border-2 border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 p-8 shadow-2xl animate-in zoom-in-95 duration-200">
        <div className="flex flex-col space-y-1.5 mb-6">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">{title}</h2>
        </div>
        {children}
        <button onClick={onClose} className="absolute right-6 top-6 p-2 rounded-full text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" x2="6" y1="6" y2="18"></line><line x1="6" x2="18" y1="6" y2="18"></line></svg>
        </button>
      </div>
    </div>
  );
};

// --- Select ---
export const Select = ({ value, onChange, options, className }: { value: string, onChange: (val: string) => void, options: {label: string, value: string}[], className?: string }) => (
    <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={cn("flex h-11 w-full items-center justify-between rounded-lg border-2 border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 px-3 py-2 text-sm focus:ring-2 focus:ring-primary/20 outline-none transition-all text-slate-900 dark:text-slate-100", className)}
    >
        {options.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
    </select>
);
