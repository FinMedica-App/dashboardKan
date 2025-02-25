// src/components/TurnosTable.jsx
import React, { useState, useMemo, Fragment } from "react";
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  TablePagination,
  Typography,
  IconButton,
  Collapse,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';

// Celda de encabezado personalizada
const StyledTableCell = styled(TableCell)(({ theme }) => ({
  fontWeight: "bold",
  color: theme.palette.primary.contrastText,
  backgroundColor: theme.palette.primary.main,
}));

// Fila personalizada con efecto zebra y hover
const StyledTableRow = styled(TableRow)(({ theme }) => ({
  "&:nth-of-type(odd)": {
    backgroundColor: theme.palette.action.hover,
  },
  "&:hover": {
    backgroundColor: theme.palette.action.selected,
  },
}));

const TurnosTable = ({ turnos, onOpenDetails }) => {
  const [page, setPage] = useState(0);
  const rowsPerPage = 10; // Mostrar 10 grupos por página

  // Filtrar los turnos para excluir aquellos sin paciente o con "No disponible"
  const filteredTurnos = useMemo(() => {
    return turnos.filter(
      (turno) => turno.paciente && turno.paciente !== "No disponible"
    );
  }, [turnos]);

  // Agrupar turnos por paciente
  const gruposPorPaciente = useMemo(() => {
    return filteredTurnos.reduce((acc, turno) => {
      const key = turno.paciente;
      if (!acc[key]) {
        acc[key] = [];
      }
      acc[key].push(turno);
      return acc;
    }, {});
  }, [filteredTurnos]);

  // Convertir el objeto de grupos en un array
  const gruposArray = useMemo(() => {
    return Object.keys(gruposPorPaciente).map((paciente) => ({
      paciente,
      turnos: gruposPorPaciente[paciente],
    }));
  }, [gruposPorPaciente]);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  // Paginar a nivel de grupos
  const gruposPaginados = useMemo(() => {
    const start = page * rowsPerPage;
    return gruposArray.slice(start, start + rowsPerPage);
  }, [gruposArray, page, rowsPerPage]);

  // Estado para controlar la expansión de cada grupo
  const [expandedGroups, setExpandedGroups] = useState({});

  const handleToggleGroup = (paciente) => {
    setExpandedGroups((prev) => ({
      ...prev,
      [paciente]: !prev[paciente],
    }));
  };

  return (
    <Paper
      sx={{
        width: "100%",
        margin: 0,
        padding: 0,
        boxShadow: 3,
      }}
    >
      <TableContainer
        sx={{
          maxHeight: "calc(100vh - 150px)",
          width: "100%",
        }}
      >
        <Table stickyHeader sx={{ width: "100%", tableLayout: "fixed" }}>
          <TableHead>
            <TableRow>
              <StyledTableCell>Fecha</StyledTableCell>
              <StyledTableCell>Hora</StyledTableCell>
              <StyledTableCell>Paciente</StyledTableCell>
              <StyledTableCell>Médico</StyledTableCell>
              <StyledTableCell>Especialidad</StyledTableCell>
              <StyledTableCell>Estado</StyledTableCell>
              <StyledTableCell align="center">Acciones</StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {gruposPaginados.map((grupo) => {
              const { paciente, turnos } = grupo;
              if (turnos.length === 1) {
                const turno = turnos[0];
                return (
                  <StyledTableRow key={turno.id}>
                    <TableCell>{turno.fecha || "No disponible"}</TableCell>
                    <TableCell>{turno.hora || "No disponible"}</TableCell>
                    <TableCell>
                      <Typography variant="body1" fontWeight="medium">
                        {turno.paciente}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body1" fontWeight="medium">
                        {turno.medico || "No disponible"}
                      </Typography>
                    </TableCell>
                    <TableCell>{turno.especialidad || "No disponible"}</TableCell>
                    <TableCell>
    <Typography 
      variant="body2" 
      sx={{
        fontWeight: "bold", 
        color: turno.estado === "Realizado" ? "green" 
          : turno.estado === "Pendiente" ? "orange" 
          : turno.estado === "Cancelada" ? "red" 
          : turno.estado === "No asistió" ? "red" 
          : "gray"
      }}
    >
      {turno.estado || "Desconocido"}
    </Typography>
  </TableCell>
                    <TableCell align="center">
                      <Button
                        variant="contained"
                        color="primary"
                        onClick={() => onOpenDetails(turno)}
                      >
                        Ver Detalles
                      </Button>
                    </TableCell>
                  </StyledTableRow>
                );
              } else {
                return (
                  <Fragment key={paciente}>
                    {/* Fila de cabecera del grupo */}
                    <StyledTableRow>
                      <TableCell colSpan={2}>
                        {turnos[0].fecha || "No disponible"}
                      </TableCell>
                      <TableCell>
                        <Typography variant="body1" fontWeight="medium">
                          {paciente} ({turnos.length})
                        </Typography>
                      </TableCell>
                      <TableCell colSpan={2}>
                        {turnos[0].medico || "No disponible"}
                      </TableCell>
                      <TableCell align="center">
                        <IconButton onClick={() => handleToggleGroup(paciente)}>
                          {expandedGroups[paciente] ? (
                            <ExpandLessIcon />
                          ) : (
                            <ExpandMoreIcon />
                          )}
                        </IconButton>
                      </TableCell>
                    </StyledTableRow>
                    {/* Fila desplegable */}
                    <TableRow>
                      <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
                        <Collapse in={expandedGroups[paciente]} timeout="auto" unmountOnExit>
                          <Box sx={{ margin: 1 }}>
                            {turnos.map((turno) => (
                              <StyledTableRow key={turno.id}>
                                <TableCell>{turno.fecha || "No disponible"}</TableCell>
                                <TableCell>{turno.hora || "No disponible"}</TableCell>
                                <TableCell>
                                  <Typography variant="body1" fontWeight="medium">
                                    {turno.paciente}
                                  </Typography>
                                </TableCell>
                                <TableCell>
                                  <Typography variant="body1" fontWeight="medium">
                                    {turno.medico || "No disponible"}
                                  </Typography>
                                </TableCell>
                                <TableCell>{turno.especialidad || "No disponible"}</TableCell>
                                <TableCell>
    <Typography 
      variant="body2" 
      sx={{
        fontWeight: "bold", 
        color: turno.estado === "Realizado" ? "green" 
          : turno.estado === "Pendiente" ? "orange" 
          : turno.estado === "Cancelada" ? "red" 
          : turno.estado === "No asistió" ? "red" 
          : "gray"
      }}
    >
      {turno.estado || "Desconocido"}
    </Typography>
  </TableCell>
                                <TableCell align="center">
                                  <Button
                                    variant="contained"
                                    color="primary"
                                    onClick={() => onOpenDetails(turno)}
                                  >
                                    Ver Detalles
                                  </Button>
                                </TableCell>
                              </StyledTableRow>
                            ))}
                          </Box>
                        </Collapse>
                      </TableCell>
                    </TableRow>
                  </Fragment>
                );
              }
            })}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[10]}
        component="div"
        count={gruposArray.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
      />
    </Paper>
  );
};

export default TurnosTable;
