import { Button } from '@packages/ui';
import { useNavigate } from 'react-router-dom';

const WhiteList1 = () => {
  const navigate = useNavigate();
  return (
    <div>
      <div>whiteList1</div>
      <Button onClick={() => navigate('/')}>router to home</Button>
    </div>
  );
};

export default WhiteList1;
