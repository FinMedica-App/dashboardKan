import React, { useState, useEffect } from "react";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { Box, Card, CardContent, Typography, Grid } from "@mui/material";

// 🔹 Definir los estados según la API
const estadosTurno = {
  1: "Pendiente",
  4: "No asistió",
  5: "Realizado",
  6: "Arribo",
  9: "Visto",
  10: "A reprogramar",
};

const KanbanBoard = ({ turnos }) => {
  // 🔹 Estado para organizar los turnos por su estado
  const [turnosPorEstado, setTurnosPorEstado] = useState({});

  // 🔹 Organizar los turnos en cada estado cuando cambian los datos
  useEffect(() => {
    const nuevoEstado = {
      "Pendiente": [],
      "No asistió": [],
      "Realizado": [],
      "Arribo": [],
      "Visto": [],
      "A reprogramar": [],
    };

    turnos.forEach((turno) => {
      const estado = turno.estado || "Pendiente"; // Default a "Pendiente" si no tiene estado
      if (nuevoEstado[estado]) {
        nuevoEstado[estado].push(turno);
      }
    });

    setTurnosPorEstado(nuevoEstado);
  }, [turnos]);

  const onDragEnd = (result) => {
    if (!result.destination) return;

    const { source, destination } = result;
    const turnoMovido = turnosPorEstado[source.droppableId][source.index];

    // Remover el turno de su estado actual
    const newSourceList = [...turnosPorEstado[source.droppableId]];
    newSourceList.splice(source.index, 1);

    // Agregar el turno al nuevo estado
    const newDestinationList = [...turnosPorEstado[destination.droppableId]];
    newDestinationList.splice(destination.index, 0, turnoMovido);

    // Actualizar los turnos en el estado
    setTurnosPorEstado((prev) => ({
      ...prev,
      [source.droppableId]: newSourceList,
      [destination.droppableId]: newDestinationList,
    }));
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Grid container spacing={2}>
        {Object.keys(turnosPorEstado).map((estado) => (
          <Grid item xs={4} key={estado}>
            <Typography variant="h6" align="center" gutterBottom>
              {estado}
            </Typography>
            <Droppable droppableId={estado}>
              {(provided) => (
                <Box ref={provided.innerRef} {...provided.droppableProps} sx={{ minHeight: "300px", backgroundColor: "#f4f4f4", padding: 2, borderRadius: 2 }}>
                  {turnosPorEstado[estado].map((turno, index) => (
                    <Draggable key={turno.id} draggableId={String(turno.id)} index={index}>
                      {(provided) => (
                        <Card ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps} sx={{ marginBottom: 2 }}>
                          <CardContent>
                            <Typography variant="subtitle1">{turno.paciente}</Typography>
                            <Typography variant="body2">{turno.medico}</Typography>
                            <Typography variant="body2" color="textSecondary">
                              {turno.especialidad}
                            </Typography>
                          </CardContent>
                        </Card>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </Box>
              )}
            </Droppable>
          </Grid>
        ))}
      </Grid>
    </DragDropContext>
  );
};

export default KanbanBoard;
