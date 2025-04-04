import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Flame, Filter, Zap } from 'lucide-react';
import { cn } from '@/lib/utils';

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

  // Get color based on ETH amount
  const getEthAmountColor = (ethAmount: number) => {
    if (ethAmount >= 10) return 'text-red-600 border-red-600 bg-red-50 dark:bg-red-900/10'; 
    if (ethAmount >= 5) return 'text-orange-600 border-orange-600 bg-orange-50 dark:bg-orange-900/10';
    if (ethAmount >= 2) return 'text-yellow-600 border-yellow-600 bg-yellow-50 dark:bg-yellow-900/10';
    if (ethAmount >= 1) return 'text-green-600 border-green-600 bg-green-50 dark:bg-green-900/10';
    return 'text-primary border-primary bg-primary/5';
  };

  // Add visual heat indicator
  const getHeatLevel = (ethAmount: number) => {
    if (ethAmount >= 10) return 'translate-x-full';
    if (ethAmount >= 7.5) return 'translate-x-3/4';
    if (ethAmount >= 5) return 'translate-x-2/3';
    if (ethAmount >= 2.5) return 'translate-x-1/2';
    if (ethAmount >= 1) return 'translate-x-1/4';
    return 'translate-x-0';
  };

  return (
    <section className="mb-8 border border-border rounded-md p-4 sm:p-6 bg-gradient-to-r from-background to-muted/30">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-display font-medium mb-2 flex items-center">
            <Filter className="h-5 w-5 mr-2 text-primary" />
            Filter Earthshouts
          </h2>
          <p className="text-muted-foreground text-sm">
            Focus on messages that matter by ETH commitment level
          </p>
        </div>
        
        <div className="flex flex-col md:flex-row gap-4 md:items-center">
          {/* Quick ETH filter dropdown */}
          <div className="w-[150px]">
            <label className="text-sm font-medium flex items-center mb-1">
              <Flame className="h-3.5 w-3.5 mr-1.5 text-red-500" />
              Minimum ETH
            </label>
            <Select defaultValue="0.1" value={minEth.toString()} onValueChange={handleMinEthChange}>
              <SelectTrigger className="border-primary/20 hover:border-primary">
                <SelectValue placeholder="Select minimum ETH" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="0">All Messages</SelectItem>
                <SelectItem value="0.1" className="text-primary">0.1 ETH - Basic</SelectItem>
                <SelectItem value="1" className="text-green-600">1 ETH - Moderate</SelectItem>
                <SelectItem value="5" className="text-orange-600">5 ETH - Important</SelectItem>
                <SelectItem value="10" className="text-red-600 font-semibold">10 ETH - Urgent</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          {/* Slider for fine-tuning */}
          <div className="flex flex-col">
            <label htmlFor="min-eth" className="text-sm font-medium flex items-center mb-1">
              <Zap className="h-3.5 w-3.5 mr-1.5 text-yellow-500" />
              Fine-tune amount
            </label>
            <div className="relative w-full md:w-[200px]">
              <div className="h-1 absolute inset-x-0 top-1/2 transform -translate-y-1/2 rounded-full bg-gradient-to-r from-primary/30 via-orange-500/30 to-red-500/30 pointer-events-none"></div>
              <Slider
                id="min-eth"
                min={0}
                max={10}
                step={0.1}
                value={[minEth]}
                onValueChange={handleSliderChange}
                className="w-full"
              />
              <div className="mt-2 flex justify-between text-xs text-muted-foreground font-medium">
                <span>0 ETH</span>
                <span className="text-red-500">10+ ETH</span>
              </div>
            </div>
          </div>
          
          <div className={cn(
            "flex items-center gap-2 px-3 py-2 rounded-md shadow-sm border font-semibold transition-colors duration-300",
            getEthAmountColor(minEth)
          )}>
            <div className="relative h-3 w-3">
              <Flame className="h-3 w-3 absolute inset-0" />
              <div className="absolute inset-0 animate-ping opacity-30">
                <Flame className="h-3 w-3" />
              </div>
            </div>
            <span className="font-mono">{minEth.toFixed(1)} ETH</span>
          </div>
          
          {/* Heat level indicator */}
          <div className="hidden md:block w-[120px] bg-gradient-to-r from-primary/20 via-yellow-500/40 to-red-500/50 h-2 rounded-full relative">
            <div className={cn(
              "absolute left-0 bottom-0 h-4 w-4 rounded-full border-2 border-background shadow-md transform -translate-y-1/4 transition-transform duration-300",
              getHeatLevel(minEth),
              minEth >= 10 ? "bg-red-500" : 
              minEth >= 5 ? "bg-orange-500" : 
              minEth >= 1 ? "bg-yellow-500" : "bg-primary"
            )}></div>
          </div>
          
          <div className="flex items-center">
            <Button 
              variant="default" 
              onClick={handleApplySliderFilter}
              className="bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary shadow-md"
            >
              <Filter className="h-4 w-4 mr-2" />
              Apply Filter
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
