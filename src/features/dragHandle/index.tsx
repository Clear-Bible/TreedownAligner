import { useAppSelector } from 'app/hooks';

import cssVar from 'styles/cssVar';

export const DragHandle = () => {
  const theme = useAppSelector((state) => {
    return state.app.theme;
  });

  return (
    <div
      className="drag-handle"
      style={{
        position: 'sticky',
        top: '0',
        left: '0',
        cursor: 'grab',
        height: '0.7rem',
        width: '0.7rem',
        backgroundColor: cssVar('drag-handle-color', theme),
      }}
    ></div>
  );
};

export default DragHandle;
