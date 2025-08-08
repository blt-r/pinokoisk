import { Link, Outlet, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Compass, Heart } from 'lucide-react';
import ThemeToggle from '@/components/ThemeToggle';

const RootLayout: React.FC = () => {
  const location = useLocation();

  return (
    <>
      <header className="shadow">
        <div className="max-w-[1200px] mx-auto w-full px-6 py-4 flex gap-4 flex-wrap">
          <nav className="flex gap-4 grow">
            <Button
              asChild
              size="lg"
              variant={location.pathname === '/' ? 'secondary' : 'ghost'}
            >
              <Link to="/">
                <Compass />
                Movies
              </Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant={
                location.pathname === '/favorites' ? 'secondary' : 'ghost'
              }
            >
              <Link to="/favorites">
                <Heart /> Favorites
              </Link>
            </Button>
          </nav>

          <ThemeToggle />
        </div>
      </header>

      {/* #root has display: flex  */}
      <main className="max-w-[1200px] mx-auto w-full grow-1 px-4">
        <Outlet />
      </main>
    </>
  );
};

export default RootLayout;
