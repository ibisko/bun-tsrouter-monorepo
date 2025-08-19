import { Button } from '@packages/ui';
import { useNavigate } from 'react-router-dom';

const PG1 = () => {
  const navigate = useNavigate();
  return (
    <div>
      <div>PG1</div>
      <Button onClick={() => navigate('/')}>router to home</Button>
    </div>
  );
};

export default PG1;
