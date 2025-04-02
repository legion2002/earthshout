import { useState } from 'react';
import HeroSection from '@/components/HeroSection';
import FilterSection from '@/components/FilterSection';
import MessageFeed from '@/components/MessageFeed';

export default function Home() {
  const [minEthFilter, setMinEthFilter] = useState(0.1);
  
  const handleFilterChange = (minEth: number) => {
    setMinEthFilter(minEth);
  };

  return (
    <>
      <HeroSection />
      <FilterSection onFilterChange={handleFilterChange} />
      <MessageFeed minEth={minEthFilter} />
    </>
  );
}
