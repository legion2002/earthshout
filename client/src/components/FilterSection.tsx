import { useState, ChangeEvent, FormEvent } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

type FilterSectionProps = {
  onFilterChange: (minEth: number) => void;
};

export default function FilterSection({ onFilterChange }: FilterSectionProps) {
  const [minEth, setMinEth] = useState("0.1");

  const handleMinEthChange = (e: ChangeEvent<HTMLInputElement>) => {
    setMinEth(e.target.value);
  };

  const handleApplyFilter = (e: FormEvent) => {
    e.preventDefault();
    const value = parseFloat(minEth);
    // Validate the input is a number
    if (!isNaN(value)) {
      onFilterChange(value);
    }
  };

  return (
    <section className="mb-8 border border-border rounded-md p-4 sm:p-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-display font-medium mb-2">Filter Earthshouts</h2>
          <p className="text-muted-foreground text-sm">Focus on messages that matter to you</p>
        </div>
        
        <form onSubmit={handleApplyFilter} className="flex flex-col md:flex-row gap-4 md:items-end">
          <div>
            <label className="text-sm text-muted-foreground mb-1 block">
              Minimum ETH burned
            </label>
            <div className="flex items-center">
              <Input 
                type="text"
                inputMode="decimal"
                value={minEth}
                onChange={handleMinEthChange}
                placeholder="0.1"
                className="w-[100px]"
              />
              <span className="ml-2 text-sm text-muted-foreground">ETH</span>
            </div>
          </div>
          
          <Button type="submit" variant="default" className="whitespace-nowrap">
            Apply Filter
          </Button>
        </form>
      </div>
    </section>
  );
}
