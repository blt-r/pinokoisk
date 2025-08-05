import { useEffect } from 'react';

const NotFoundPage: React.FC = () => {
  useEffect(() => {
    document.title = 'Pinokoisk | 404';
  }, []);

  return (
    <div className="flex flex-col gap-2 pt-3">
      <h1 className="text-4xl">404 Page not found</h1>
      <p className="text-2xl">
        I don't know what you are looking for, but it is not here.
      </p>
    </div>
  );
};

export default NotFoundPage;
