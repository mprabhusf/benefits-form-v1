import * as React from "react";
import { cn } from "@/lib/utils";

const RadioGroupContext = React.createContext<{
  value?: string;
  onChange?: (value: string) => void;
  name?: string;
}>({});

export interface RadioGroupProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "onChange"> {
  value?: string;
  onChange?: (value: string) => void;
  name?: string;
}

const RadioGroup = React.forwardRef<HTMLDivElement, RadioGroupProps>(
  ({ className, value, onChange, name, ...props }, ref) => {
    return (
      <RadioGroupContext.Provider value={{ value, onChange, name }}>
        <div
          ref={ref}
          className={cn("grid gap-2", className)}
          {...props}
        />
      </RadioGroupContext.Provider>
    );
  }
);
RadioGroup.displayName = "RadioGroup";

export interface RadioGroupItemProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  value: string;
}

const RadioGroupItem = React.forwardRef<HTMLInputElement, RadioGroupItemProps>(
  ({ className, value, id, children, ...props }, ref) => {
    const context = React.useContext(RadioGroupContext);
    const inputId = id || `radio-${value}`;

    return (
      <div className="flex items-center space-x-2">
        <input
          type="radio"
          id={inputId}
          ref={ref}
          name={context.name}
          value={value}
          checked={context.value === value}
          onChange={() => context.onChange?.(value)}
          className={cn(
            "h-4 w-4 border-gray-300 text-primary focus:ring-2 focus:ring-primary",
            className
          )}
          {...props}
        />
        <label
          htmlFor={inputId}
          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
        >
          {children || value}
        </label>
      </div>
    );
  }
);
RadioGroupItem.displayName = "RadioGroupItem";

export { RadioGroup, RadioGroupItem };

