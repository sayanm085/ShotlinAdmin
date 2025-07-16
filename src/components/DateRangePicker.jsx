"use client";

import * as React from "react";
import { format, isValid } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Label } from "@/components/ui/label";

export function DateRangePicker({
  className,
  date,
  onChange,
}) {
  const [startDate, setStartDate] = React.useState(date?.from);
  const [endDate, setEndDate] = React.useState(date?.to);

  // Update parent component when dates change
  React.useEffect(() => {
    if (startDate || endDate) {
      onChange({ 
        from: startDate, 
        to: endDate 
      });
    }
  }, [startDate, endDate, onChange]);

  // Update local state when props change
  React.useEffect(() => {
    setStartDate(date?.from);
    setEndDate(date?.to);
  }, [date?.from, date?.to]);

  function getDateRangeText() {
    if (startDate && endDate) {
      return `${format(startDate, "LLL dd, y")} - ${format(endDate, "LLL dd, y")}`;
    } else if (startDate) {
      return `${format(startDate, "LLL dd, y")} - Select end date`;
    } else if (endDate) {
      return `Select start date - ${format(endDate, "LLL dd, y")}`;
    }
    return "Select date range";
  }

  return (
    <div className={cn("grid gap-2", className)}>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            id="date"
            variant={"outline"}
            className={cn(
              "w-[260px] justify-start text-left font-normal",
              !startDate && !endDate && "text-muted-foreground"
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {getDateRangeText()}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-4" align="start">
          <div className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="start-date">Start Date</Label>
              <Calendar
                id="start-date"
                mode="single"
                selected={startDate}
                onSelect={setStartDate}
                initialFocus
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="end-date">End Date</Label>
              <Calendar
                id="end-date"
                mode="single"
                selected={endDate}
                onSelect={setEndDate}
                disabled={(date) => startDate ? date < startDate : false}
              />
            </div>
            
            <div className="flex justify-end gap-2">
              <Button 
                variant="outline" 
                onClick={() => {
                  setStartDate(undefined);
                  setEndDate(undefined);
                  onChange({ from: undefined, to: undefined });
                }}
              >
                Clear
              </Button>
              <Button 
                onClick={() => document.querySelector('[data-state="open"][data-side="bottom"]')?.closest('div[data-radix-popper-content-wrapper]')?.click()}
              >
                Apply
              </Button>
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}