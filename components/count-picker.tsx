"use client";

interface CountPickerProps {
  count: number;
  onChange: (count: number) => void;
  visible: boolean;
}

const COUNT_OPTIONS = [1, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50] as const;

export function CountPicker({ count, onChange, visible }: CountPickerProps) {
  if (!visible) return <div></div>;

  // Keep UI stable even if parent count is outside predefined options.
  const currentIndex = Math.max(
    0,
    COUNT_OPTIONS.findIndex((value) => value === count),
  );

  return (
    <div className="flex flex-col items-center gap-2">
      <label className="text-sm text-muted-foreground">
        Search for{" "}
        <span className="font-semibold text-foreground">{count}</span>{" "}
        {count === 1 ? "video" : "videos"}
      </label>
      <input
        type="range"
        min={0}
        max={COUNT_OPTIONS.length - 1}
        step={1}
        value={currentIndex}
        onChange={(e) => onChange(COUNT_OPTIONS[Number(e.target.value)])}
        className="w-48 accent-primary"
      />
      <div className="flex justify-between w-48 text-xs text-muted-foreground">
        <span>{COUNT_OPTIONS[0]}</span>
        <span>{COUNT_OPTIONS[COUNT_OPTIONS.length - 1]}</span>
      </div>
    </div>
  );
}
