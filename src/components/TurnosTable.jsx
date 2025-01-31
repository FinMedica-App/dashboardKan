import React, { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  TablePagination
} from "@mui/material";

const TurnosTable = ({ turnos }) => {
  const [page, setPage] = useState(0);
  const rowsPerPage = 10; // 🔹 Mostrar 10 turnos por página

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  return (
    <TableContainer
      component={Paper}
      style={{
        width: "100%", // 🔹 Ancho completo
        height: "calc(100vh - 100px)", // 🔹 Altura completa menos margen
        overflowY: "auto",
      }}
    >
      <Table stickyHeader style={{ minWidth: 800 }}>
        <TableHead>
          <TableRow>
            <TableCell>Fecha</TableCell>
            <TableCell>Hora</TableCell>
            <TableCell>Paciente</TableCell>
            <TableCell>Médico</TableCell>
            <TableCell>Especialidad</TableCell>
            <TableCell>Acciones</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {turnos
            .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage) // 🔹 Paginación
            .map((turno) => (
              <TableRow key={turno.id}>
                <TableCell>{turno.fecha ? turno.fecha : "No disponible"}</TableCell>
                <TableCell>{turno.hora ? turno.hora : "No disponible"}</TableCell>
                <TableCell>{turno.paciente || "No disponible"}</TableCell>
                <TableCell>{turno.medico || "No disponible"}</TableCell>
                <TableCell>{turno.especialidad || "No disponible"}</TableCell>
                <TableCell>
                  <Button variant="contained" color="primary">
                    Ver Detalles
                  </Button>
                </TableCell>
              </TableRow>
            ))}
        </TableBody>
      </Table>

      {/* 🔹 Controles de paginación */}
      <TablePagination
        rowsPerPageOptions={[10]}
        component="div"
        count={turnos.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
      />
    </TableContainer>
  );
};

export default TurnosTable;
