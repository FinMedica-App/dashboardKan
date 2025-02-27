import React, { useState, useEffect } from "react";
import { 
  Box, 
  Card, 
  CardContent, 
  Typography, 
  Grid, 
  IconButton,
  Button,
  CircularProgress
} from "@mui/material";
import FullscreenIcon from '@mui/icons-material/Fullscreen';
import FullscreenExitIcon from '@mui/icons-material/FullscreenExit';
import RefreshIcon from '@mui/icons-material/Refresh';

const KanbanBoard = ({ turnos, onRefresh, loading }) => {
  const [turnosPorEstado, setTurnosPorEstado] = useState({
    "Pendiente": [],
    "No asistió": [],
    "Realizado": [],
    "Arribo": [],
    "Visto": [],
  });

  const [fullScreen, setFullScreen] = useState(false);

  useEffect(() => {
    const intervalId = setInterval(() => {
      onRefresh();
    }, 300000); 

    return () => clearInterval(intervalId);
  }, [onRefresh]);

  useEffect(() => {
    const hoy = new Date().toISOString().split("T")[0];
  
    const estadosValidos = ["Pendiente", "No asistió", "Realizado", "Arribo", "Visto"]; 
    const nuevoEstado = {
      "Pendiente": [],
      "No asistió": [],
      "Realizado": [],
      "Arribo": [],
      "Visto": [],
    };
  
    turnos
      .filter((turno) => turno.fecha === hoy && estadosValidos.includes(turno.estado)) 
      .forEach((turno) => {
        nuevoEstado[turno.estado].push(turno);
      });
  
    setTurnosPorEstado(nuevoEstado);
  }, [turnos]);
  


  const handleFullScreenToggle = () => {
    setFullScreen(prev => !prev);
  };

  const ordenEstados = ["Pendiente", "No asistió", "Arribo", "Visto", "Realizado"];

  return (
    <Box
      sx={{
        position: fullScreen ? "fixed" : "relative",
        top: fullScreen ? 0 : "auto",
        left: fullScreen ? 0 : "auto",
        width: fullScreen ? "100vw" : "auto",
        height: fullScreen ? "100vh" : "auto",
        backgroundColor: fullScreen ? "#fff" : "transparent",
        zIndex: fullScreen ? 9999 : "auto",
        padding: 2,
        overflow: "auto",
      }}
    >
      {/* Botones de Recargar y de Pantalla Completa en extremos opuestos */}
      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
        <Button 
          variant="contained" 
          color="warning" 
          startIcon={<RefreshIcon />} 
          onClick={onRefresh}
        >
          Recargar
        </Button>
        <IconButton onClick={handleFullScreenToggle}>
          {fullScreen ? <FullscreenExitIcon /> : <FullscreenIcon />}
        </IconButton>
      </Box>

      {/* Overlay de carga */}
      {loading && (
        <Box
          sx={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(255,255,255,0.7)",
            zIndex: 1000,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <CircularProgress />
        </Box>
      )}

      {/* Renderizamos las columnas usando el orden deseado */}
      <Grid container spacing={2} wrap="nowrap">
        {ordenEstados.map((estado) => (
          <Grid item key={estado} sx={{ minWidth: 250 }}>
            {/* Header del estado */}
            <Box
              sx={{
                backgroundColor: "#1976d2",
                padding: 1,
                borderRadius: 1,
                mb: 1,
              }}
            >
              <Typography variant="h6" align="center" color="white">
                {estado}
              </Typography>
            </Box>

            {/* Contenedor de los turnos */}
            <Box
              sx={{
                minHeight: "300px",
                backgroundColor: "#f4f4f4",
                padding: 2,
                borderRadius: 2,
              }}
            >
              {turnosPorEstado[estado].map((turno) => (
                <Card key={turno.id} sx={{ marginBottom: 2, position: "relative" }}>
                  <CardContent>
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "flex-start",
                      }}
                    >
                      <Box>
                        <Typography variant="subtitle1" sx={{ fontWeight: "bold" }}>
                          Paciente: {turno.paciente}
                        </Typography>
                        <Typography variant="body1" sx={{ color: "#555", mt: 0.5 }}>
                          Médico: {turno.medico}
                        </Typography>
                      </Box>
                      <Box sx={{ textAlign: "right" }}>
                        <Typography variant="subtitle2" color="text.secondary">
                          {turno.hora}
                        </Typography>
                      </Box>
                    </Box>
                    <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
                      {turno.especialidad}
                    </Typography>
                  </CardContent>
                </Card>
              ))}
            </Box>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default KanbanBoard;
