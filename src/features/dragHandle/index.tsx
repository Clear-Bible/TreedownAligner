export const dragHandle = () => {
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
        backgroundColor: 'black',
      }}
    ></div>
  );
};

export default dragHandle;
