import React from "react";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import FormControl from "@mui/material/FormControl";
import NativeSelect from "@mui/material/NativeSelect";

const ClientSelect = (props) => {
  const { handleSelectClient, clients, areClientsLoading } = props;

  return (
    <div>
      <Box
        sx={{
          display: "flex",
          flexWrap: "wrap",
          "& > :not(style)": {
            m: 1,
            minWidth: 350,
            height: 128,
          },
          margin: 0,
        }}
      >
        <Paper>
          <Box sx={{ width: "90%", margin: "0 auto", marginTop: 4 }}>
            <Typography
              variant="h5"
              component="h1"
              style={{ marginBottom: 10, color: "rgb(25, 118, 210)" }}
            >
              Clients
            </Typography>
            <FormControl fullWidth>
              <NativeSelect
                inputProps={{
                  name: "clients",
                  id: "uncontrolled-native",
                }}
                onChange={handleSelectClient}
              >
                <option key={0} value="" style={{ color: "#ccc" }}>
                  Please select a Client
                </option>
                {clients.length && !areClientsLoading
                  ? clients.map((client) => (
                      <option key={client.id} value={`client_${client.id}`}>
                        {client.name}
                      </option>
                    ))
                  : null}
              </NativeSelect>
            </FormControl>
          </Box>
        </Paper>
      </Box>
    </div>
  );
};

export default ClientSelect;
