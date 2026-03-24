import Loader from './Loader';

function Spinner({ className = '', size = 18 }) {
  return <Loader size={size} className={className} />;
}

export default Spinner;
