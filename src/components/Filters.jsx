import React from "react";
import { TextField, MenuItem, Select, FormControl, InputLabel } from "@mui/material";

const Filters = ({ fechaSeleccionada, setFechaSeleccionada, especialidadFiltro, setEspecialidadFiltro, especialidades, busqueda, setBusqueda }) => {
  return (
    <div style={{ display: "flex", gap: '1rem', marginBottom: "20px" }}>
      <TextField type="date" label="Fecha" variant="outlined" value={fechaSeleccionada} onChange={(e) => setFechaSeleccionada(e.target.value)} />
      
      <FormControl variant="outlined" style={{ minWidth: 200 }}>
        <InputLabel>Especialidad</InputLabel>
        <Select value={especialidadFiltro} onChange={(e) => setEspecialidadFiltro(e.target.value)} label="Especialidad">
          <MenuItem value="">Todas</MenuItem>
          {especialidades.map((esp, index) => (
            <MenuItem key={index} value={esp}>{esp}</MenuItem>
          ))}
        </Select>
      </FormControl>

      <TextField type="text" label="Buscar Paciente o Médico" variant="outlined" value={busqueda} onChange={(e) => setBusqueda(e.target.value)} />
    </div>
  );
};

export default Filters;
