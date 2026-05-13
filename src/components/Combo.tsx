import type { Combo } from '../interface.d';
import { Card } from './Card';

const Combo = ({ combo }: { combo: Combo }) => {
  const { nutrients } = combo;
  return (
    <div>
      <Card
        title={combo.name}
        subTitle={`${nutrients.carb.toFixed(0)}g|${nutrients.protein.toFixed(0)}g|${nutrients.fat.toFixed(0)}g`}
        content={Math.round(combo.nutrients.calories)}
        // mark={combo.notice}
      />
    </div>
  );
};

export default Combo;
