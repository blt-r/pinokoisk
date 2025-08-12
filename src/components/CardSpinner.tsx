import { LoaderCircle } from 'lucide-react';

const CardSpinner: React.FC = () => {
  return (
    <div className="grid h-52 place-content-center">
      <LoaderCircle className="size-14 animate-spin" />
    </div>
  );
};

export default CardSpinner;
