import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';

type FilterSectionProps = {
  onFilterChange: (minEth: number) => void;
};

export default function FilterSection({ onFilterChange }: FilterSectionProps) {
  const [minEth, setMinEth] = useState(0.1);

  const handleSliderChange = (value: number[]) => {
    setMinEth(value[0]);
  };

  const handleApplyFilter = () => {
    onFilterChange(minEth);
  };

  return (
    <section className="mb-8 bg-muted rounded-xl p-4 sm:p-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-display font-medium mb-2">Filter Earthshouts</h2>
          <p className="text-muted-foreground text-sm">Focus on messages that matter to you</p>
        </div>
        <div className="flex flex-col md:flex-row gap-4 md:items-center">
          <div className="flex flex-col">
            <label htmlFor="min-eth" className="text-sm text-muted-foreground mb-1">Minimum ETH burned</label>
            <div className="relative w-full">
              <Slider
                id="min-eth"
                min={0}
                max={10}
                step={0.1}
                defaultValue={[0.1]}
                value={[minEth]}
                onValueChange={handleSliderChange}
                className="w-full"
              />
              <div className="mt-2 flex justify-between text-xs text-muted-foreground">
                <span>0 ETH</span>
                <span>10+ ETH</span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2 bg-background px-3 py-2 rounded-lg">
            <span className="font-mono text-accent">{minEth.toFixed(1)} ETH</span>
            <span className="text-xs text-muted-foreground">minimum</span>
          </div>
          <div className="flex items-center">
            <Button className="bg-primary" onClick={handleApplyFilter}>
              Apply Filter
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
