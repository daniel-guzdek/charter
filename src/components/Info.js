import React from "react";
import Alert from "@mui/material/Alert";
import Stack from "@mui/material/Stack";

const Info = () => {
  return (
    <Stack
      sx={{
        width: "100%",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
      spacing={2}
    >
      <Alert severity="warning">
        To retreive data from the API, run the command in the terminal:
        <code>npm run server</code>or<code>yarn server</code>
      </Alert>
    </Stack>
  );
};

export default Info;
