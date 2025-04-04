import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

type FilterSectionProps = {
  onFilterChange: (minEth: number) => void;
};

export default function FilterSection({ onFilterChange }: FilterSectionProps) {
  const [minEth, setMinEth] = useState(0.1);

  const handleMinEthChange = (value: string) => {
    setMinEth(parseFloat(value));
    onFilterChange(parseFloat(value)); // Auto-apply when selection changes
  };

  // Keep the slider for those who want fine-grained control
  const handleSliderChange = (value: number[]) => {
    setMinEth(value[0]);
  };

  const handleApplySliderFilter = () => {
    onFilterChange(minEth);
  };

  return (
    <section className="mb-8 border border-border rounded-md p-4 sm:p-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-display font-medium mb-2">Filter Earthshouts</h2>
          <p className="text-muted-foreground text-sm">Focus on messages that matter to you</p>
        </div>
        
        <div className="flex flex-col md:flex-row gap-4 md:items-center">
          {/* Quick ETH filter dropdown */}
          <div className="w-[150px]">
            <label className="text-sm text-muted-foreground mb-1 block">Minimum ETH</label>
            <Select defaultValue="0.1" value={minEth.toString()} onValueChange={handleMinEthChange}>
              <SelectTrigger>
                <SelectValue placeholder="Select minimum ETH" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="0">All</SelectItem>
                <SelectItem value="0.1">0.1 ETH</SelectItem>
                <SelectItem value="1">1 ETH</SelectItem>
                <SelectItem value="5">5 ETH</SelectItem>
                <SelectItem value="10">10 ETH</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          {/* Slider for fine-tuning */}
          <div className="flex flex-col">
            <label htmlFor="min-eth" className="text-sm text-muted-foreground mb-1">Fine-tune amount</label>
            <div className="relative w-full md:w-[200px]">
              <Slider
                id="min-eth"
                min={0}
                max={10}
                step={0.1}
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
          
          <div className="flex items-center gap-2 bg-secondary px-3 py-2 rounded-md">
            <span className="font-mono text-primary">{minEth.toFixed(1)} ETH</span>
            <span className="text-xs text-muted-foreground">minimum</span>
          </div>
          
          <div className="flex items-center">
            <Button variant="default" onClick={handleApplySliderFilter}>
              Apply Filter
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
