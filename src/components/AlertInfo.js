import React from "react";
import Alert from "@mui/material/Alert";
import Stack from "@mui/material/Stack";

const AlertInfo = (props) => {
  const { message, severity } = props;

  return (
    <Stack
      sx={{
        width: "100%",
      }}
      spacing={2}
    >
      <Alert severity={severity}>{message}</Alert>
    </Stack>
  );
};

export default AlertInfo;
