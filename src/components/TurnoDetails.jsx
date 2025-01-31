import React from "react";
import { Modal, Box, Typography, Button } from "@mui/material";

const TurnoDetails = ({ turno, open, onClose }) => {
  if (!turno) return null;

  return (
    <Modal open={open} onClose={onClose} aria-labelledby="modal-title">
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          bgcolor: "background.paper",
          boxShadow: 24,
          p: 4,
          width: 400,
          borderRadius: 2,
        }}
      >
        <Typography id="modal-title" variant="h6" gutterBottom>
          Detalles del Turno
        </Typography>
        <Typography>
          <strong>Fecha:</strong> {turno.attributes.fecha || "No disponible"}
        </Typography>
        <Typography>
          <strong>Hora:</strong> {turno.attributes.hora || "No disponible"}
        </Typography>
        <Typography>
          <strong>Paciente:</strong>{" "}
          {turno.paciente
            ? `${turno.paciente.data.attributes.nombres} ${turno.paciente.data.attributes.apellidos}`
            : "No disponible"}
        </Typography>
        <Button
          onClick={onClose}
          variant="contained"
          color="secondary"
          sx={{ mt: 2 }}
        >
          Cerrar
        </Button>
      </Box>
    </Modal>
  );
};

export default TurnoDetails;
