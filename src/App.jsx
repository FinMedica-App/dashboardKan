import React, { useState, useMemo } from "react";
import Layout from "./components/Layout";
import TurnosTable from "./components/TurnosTable";
import KanbanBoard from "./components/KanbanBoard";
import TurnoDetails from "./components/TurnoDetails";
import Filters from "./components/Filters";
import useTurnos from "./hooks/useTurnos";

const App = () => {
  const [vista, setVista] = useState("tabla");
  const [fechaSeleccionada, setFechaSeleccionada] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [especialidadFiltro, setEspecialidadFiltro] = useState("");
  const [busqueda, setBusqueda] = useState("");
  const [selectedTurno, setSelectedTurno] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [refreshToggle, setRefreshToggle] = useState(false);

  const { turnos, loading, error, especialidades } = useTurnos(
    fechaSeleccionada,
    refreshToggle
  );

  // Función para refrescar datos
  const refreshData = () => {
    setRefreshToggle((prev) => !prev);
  };

  // Función para abrir el modal de detalles
  const handleOpenDetails = (turno) => {
    setSelectedTurno(turno);
    setModalOpen(true);
  };

  const filteredTurnos = useMemo(() => {
    return turnos.filter((turno) => {
      // Filtrar por fecha: se comprueba que turno.fecha incluya la fechaSeleccionada
      const matchesFecha = fechaSeleccionada
        ? turno.fecha && turno.fecha.includes(fechaSeleccionada)
        : true;
        
      // Filtrar por especialidad
      const matchesEspecialidad = especialidadFiltro
        ? turno.especialidad &&
          turno.especialidad.toLowerCase().includes(especialidadFiltro.toLowerCase())
        : true;
  
      // Filtrar por búsqueda (paciente o médico)
      const matchesBusqueda = busqueda
        ? (turno.paciente &&
            turno.paciente.toLowerCase().includes(busqueda.toLowerCase())) ||
          (turno.medico &&
            turno.medico.toLowerCase().includes(busqueda.toLowerCase()))
        : true;
  
      return matchesFecha && matchesEspecialidad && matchesBusqueda;
    });
  }, [turnos, fechaSeleccionada, especialidadFiltro, busqueda]);  

  return (
    <Layout onMenuSelect={setVista}>
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
          {loading ? (
            <h2 style={{ textAlign: "center", marginTop: "50px" }}>
              Cargando datos...
            </h2>
          ) : (
            <TurnosTable turnos={filteredTurnos} onOpenDetails={handleOpenDetails} />
          )}
          <TurnoDetails
            turno={selectedTurno}
            open={modalOpen}
            onClose={() => setModalOpen(false)}
          />
        </>
      ) : (
        <KanbanBoard turnos={turnos} onRefresh={refreshData} loading={loading} />
      )}
    </Layout>
  );
};

export default App;
