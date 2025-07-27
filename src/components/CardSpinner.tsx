import { LoaderCircle } from 'lucide-react';

const CardSpinner: React.FC = () => {
  return (
    <div className="grid place-content-center h-52">
      <LoaderCircle className="size-14 animate-spin" />
    </div>
  );
};

export default CardSpinner;
