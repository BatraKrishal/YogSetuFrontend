import { Hero } from '@/components/Home/Hero';
import { Stats } from '@/components/Home/Stats';

export default function Home() {
  return (
    <div className='overflow-x-hidden'>
      <Hero />
      <Stats />
      
    </div>
  );
}
