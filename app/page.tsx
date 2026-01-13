import { Hero } from '@/components/Home/Hero';
import { Stats } from '@/components/Home/Stats';
import { Navbar } from '@/components/nav/Navbar';

export default function Home() {
  return (
    <div className='overflow-x-hidden'>
      <div>
          <Navbar/>
        </div>
      <Hero />
      <Stats />
      
    </div>
  );
}
