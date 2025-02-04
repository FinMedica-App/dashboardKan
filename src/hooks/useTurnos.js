import { useState, useEffect } from "react";
import apiClient from "../apiClient";

const estadosTurno = {
  1: "Pendiente",
  4: "No asistió",
  5: "Realizado",
  6: "Arribo",
  9: "Visto",
};

const useTurnos = (fechaSeleccionada, refreshToggle) => {
  const [turnos, setTurnos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [especialidades, setEspecialidades] = useState([]);

  useEffect(() => {
    const obtenerTurnos = async () => {
      setLoading(true);
      try {
        console.log(`🔍 Buscando turnos para ${fechaSeleccionada}...`);
        const response = await apiClient.get(
          `/admision/turnos?filter[fechaInicio]=${fechaSeleccionada}&filter[fechaFin]=${fechaSeleccionada}`
        );
        
        if (!response.data || !response.data.data)
          throw new Error("❌ La API no devolvió datos válidos.");
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

            // Consultar datos del paciente
            if (personaId) {
              try {
                console.log(`🔍 Buscando datos del paciente con ID: ${personaId}`);
                const response = await apiClient.get(`/personas/${personaId}`);
                if (response.data?.data?.attributes) {
                  const datosPaciente = response.data.data.attributes;
                  paciente = `${datosPaciente.nombres || ""} ${datosPaciente.apellidos || ""}`.trim();
                } else {
                  console.warn(`⚠ Datos del paciente ${personaId} no disponibles en la API.`);
                }
              } catch (error) {
                console.error(`❌ Error al obtener datos del paciente (${personaId}): ${error}`);
              }
            }

            // Consultar datos de la agenda
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
  }, [fechaSeleccionada, refreshToggle]); 

  return { turnos, loading, error, especialidades };
};

export default useTurnos;
