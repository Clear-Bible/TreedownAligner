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
        marginRight: '-1px',
        marginBottom: '-1px',
        position: 'absolute',
        bottom: '0',
        right: '0',
        cursor: 'grab',
        height: '0.7rem',
        width: '0.7rem',
        backgroundColor: cssVar('drag-handle-color', theme),
      }}
    ></div>
  );
};

export default DragHandle;
