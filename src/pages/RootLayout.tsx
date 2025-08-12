import { Link, Outlet, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Compass, Heart } from 'lucide-react';
import ThemeToggle from '@/components/ThemeToggle';

const RootLayout: React.FC = () => {
  const location = useLocation();

  return (
    <>
      <header className="shadow">
        <div className="mx-auto flex w-full max-w-[1200px] flex-wrap gap-4 p-4">
          <nav className="flex grow gap-4">
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

      {/* #root has display: flex */}
      <main className="mx-auto w-full max-w-[1200px] grow-1 p-4">
        <Outlet />
      </main>
    </>
  );
};

export default RootLayout;
