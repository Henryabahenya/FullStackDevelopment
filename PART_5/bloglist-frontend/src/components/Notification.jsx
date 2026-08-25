import Alert from "@mui/material/Alert";

const Notification = ({ message }) => {
  if (!message || !message.text) {
    return null;
  }

  const severity = message.type === "success" ? "success" : "error";

  return <Alert severity={severity}>{message.text}</Alert>;
};

export default Notification;
