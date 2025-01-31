import React, { useState, useEffect } from "react";
import { Drawer, List, ListItem, ListItemText, CssBaseline, AppBar, Toolbar, Typography, Box } from "@mui/material";
import TurnosTable from "./components/TurnosTable";
import TurnoDetails from "./components/TurnoDetails";
import KanbanBoard from "./components/KanbanBoard";
import apiClient from "./apiClient";
import Filters from "./components/Filters";

const estadosTurno = {
  1: "Pendiente",
  4: "No asistió",
  5: "Realizado",
  6: "Arribo",
  9: "Visto",
  10: "A reprogramar",
};

const App = () => {
  const [vista, setVista] = useState("tabla");
  const [turnos, setTurnos] = useState([]);
  const [selectedTurno, setSelectedTurno] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [fechaSeleccionada, setFechaSeleccionada] = useState(new Date().toISOString().split("T")[0]);
  const [especialidadFiltro, setEspecialidadFiltro] = useState("");
  const [busqueda, setBusqueda] = useState("");
  const [especialidades, setEspecialidades] = useState([]);

  useEffect(() => {
    const obtenerTurnos = async () => {
      setLoading(true);
      try {
        console.log(`🔍 Buscando turnos para ${fechaSeleccionada}...`);
        const response = await apiClient.get(`/admision/turnos?filter[fechaInicio]=${fechaSeleccionada}&filter[fechaFin]=${fechaSeleccionada}`);
        
        if (!response.data || !response.data.data) throw new Error("❌ La API no devolvió datos válidos.");
        let turnosData = response.data.data;
        console.log(`✅ Se obtuvieron ${turnosData.length} turnos.`);

        const turnosConDetalles = await Promise.all(
          turnosData.map(async (turno) => {
            if (!turno || !turno.attributes) return null;

            const personaId = turno.relationships?.persona?.data?.id || null;
            const agendaId = turno.relationships?.agenda?.data?.id || null;
            const estadoId = turno.relationships?.estadoTurno?.data?.id || null;

            let paciente = "No disponible";
            let medico = "No disponible";
            let especialidad = "No disponible";
            let fecha = turno.attributes?.fecha || "No disponible";
            let hora = turno.attributes?.hora || "No disponible";
            let estado = estadosTurno[estadoId] || "Desconocido";

            // ✅ Consultar paciente
            if (personaId) {
              try {
                const response = await apiClient.get(`/admin/personas/${personaId}`);
                const datosPaciente = response.data?.data?.attributes;
                paciente = datosPaciente
                  ? `${datosPaciente.nombres || ""} ${datosPaciente.apellidos || ""}`.trim()
                  : "No disponible";
              } catch (error) {
                console.error(`❌ Error al obtener datos del paciente (${personaId}): ${error}`);
              }
            }

            // ✅ Consultar agenda
            if (agendaId) {
              try {
                const response = await apiClient.get(`/admision/agendas/${agendaId}`);
                const agendaData = response.data;
                const medicoData = agendaData.included?.find((item) => item.type === "Admin\\Persona");
                const especialidadData = agendaData.included?.find((item) => item.type === "Admin\\Especialidad");

                medico = medicoData ? `${medicoData.attributes.nombres} ${medicoData.attributes.apellidos}` : "No disponible";
                especialidad = especialidadData ? especialidadData.attributes.nombre : "No disponible";
              } catch (error) {
                console.error(`❌ Error al obtener datos de la agenda (${agendaId}): ${error}`);
              }
            }

            return { ...turno, paciente, medico, especialidad, fecha, hora, estado };
          })
        );

        setTurnos(turnosConDetalles);
        setEspecialidades([...new Set(turnosConDetalles.map(t => t.especialidad))]);
      } catch (error) {
        console.error("❌ Error al obtener los turnos:", error);
        setError(error.response?.data?.error || error.message || "Error desconocido.");
      } finally {
        setLoading(false);
      }
    };

    obtenerTurnos();
  }, [fechaSeleccionada]);

  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      <Drawer variant="permanent" sx={{ width: 240, flexShrink: 0, "& .MuiDrawer-paper": { width: 240, boxSizing: "border-box" } }}>
        <Toolbar />
        <List>
          <ListItem button onClick={() => setVista("tabla")}>
            <ListItemText primary="📋 Tabla de Turnos" />
          </ListItem>
          <ListItem button onClick={() => setVista("kanban")}>
            <ListItemText primary="🗂 Tablero Kanban" />
          </ListItem>
        </List>
      </Drawer>
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <AppBar position="static">
          <Toolbar>
            <Typography variant="h6">{vista === "tabla" ? "Tabla de Turnos" : "Tablero Kanban"}</Typography>
          </Toolbar>
        </AppBar>

        {vista === "tabla" ? (
          <>
            <Filters
              fechaSeleccionada={fechaSeleccionada}
              setFechaSeleccionada={setFechaSeleccionada}
              especialidadFiltro={especialidadFiltro}
              setEspecialidadFiltro={setEspecialidadFiltro}
              especialidades={especialidades}
              busqueda={busqueda}
              setBusqueda={setBusqueda}
            />
            {loading ? <h2 style={{ textAlign: "center", marginTop: "50px" }}>Cargando datos...</h2> : <TurnosTable turnos={turnos} />}
            <TurnoDetails turno={selectedTurno} open={modalOpen} onClose={() => setModalOpen(false)} />
          </>
        ) : (
          <KanbanBoard turnos={turnos} />
        )}
      </Box>
    </Box>
  );
};

export default App;
