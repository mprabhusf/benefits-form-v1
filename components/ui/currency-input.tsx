import * as React from "react";
import { Input } from "./input";
import { cn } from "@/lib/utils";

export interface CurrencyInputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "type" | "onChange" | "value"> {
  value?: number;
  onChange?: (value: number) => void;
}

const CurrencyInput = React.forwardRef<HTMLInputElement, CurrencyInputProps>(
  ({ className, value = 0, onChange, ...props }, ref) => {
    const formatDisplay = (val: number): string => {
      if (val === 0 || val === undefined || val === null) return "";
      return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
        minimumFractionDigits: 2,
      }).format(val);
    };

    const parseValue = (val: string): number => {
      const cleaned = val.replace(/[^0-9.]/g, "");
      if (cleaned === "") return 0;
      const num = parseFloat(cleaned);
      return isNaN(num) ? 0 : num;
    };

    const [displayValue, setDisplayValue] = React.useState(() =>
      formatDisplay(value)
    );

    React.useEffect(() => {
      const formatted = formatDisplay(value);
      setDisplayValue(formatted);
    }, [value]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const inputValue = e.target.value;
      const numValue = parseValue(inputValue);
      const formatted = formatDisplay(numValue);
      setDisplayValue(formatted);
      onChange?.(numValue);
    };

    const handleBlur = () => {
      setDisplayValue(formatDisplay(value));
    };

    return (
      <Input
        ref={ref}
        type="text"
        value={displayValue}
        onChange={handleChange}
        onBlur={handleBlur}
        placeholder="$0.00"
        className={cn(className)}
        {...props}
      />
    );
  }
);
CurrencyInput.displayName = "CurrencyInput";

export { CurrencyInput };

