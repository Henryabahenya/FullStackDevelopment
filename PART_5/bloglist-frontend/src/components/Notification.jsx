const Notification = ({ message }) => {
  if (!message || !message.text) {
    return null;
  }

  const baseStyle = {
    background: '#f0f0f0',
    padding: '10px',
    fontSize: '20px',
    marginBottom: '10px',
  };

  const successStyle = {
    color: 'green',
    border: '2px solid green',
  };

  const errorStyle = {
    color: 'red',
    border: '2px solid red',
  };

  const style =
    message.type === 'success'
      ? { ...baseStyle, ...successStyle }
      : { ...baseStyle, ...errorStyle };

  return <div style={style}>{message.text}</div>;
};

export default Notification;
