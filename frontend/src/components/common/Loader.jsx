import { Loader2 } from 'lucide-react';

function Loader({ className = '', size = 16 }) {
  return <Loader2 size={size} className={`animate-spin ${className}`} />;
}

export default Loader;
