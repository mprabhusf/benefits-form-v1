import * as React from "react";
import { Input } from "./input";
import { Label } from "./label";
import { cn } from "@/lib/utils";

export interface FileInputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "type"> {
  label?: string;
  onFileChange?: (file: File | null) => void;
}

const FileInput = React.forwardRef<HTMLInputElement, FileInputProps>(
  ({ className, label, onFileChange, ...props }, ref) => {
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0] || null;
      onFileChange?.(file);
    };

    return (
      <div className="space-y-2">
        {label && <Label>{label}</Label>}
        <Input
          ref={ref}
          type="file"
          className={cn(className)}
          onChange={handleChange}
          {...props}
        />
      </div>
    );
  }
);
FileInput.displayName = "FileInput";

export { FileInput };

