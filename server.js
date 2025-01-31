import express from "express";
import cors from "cors";
import axios from "axios";

const app = express();
const PORT = 4000;

app.use(cors());
app.use(express.json());

// 🔹 Proxy para obtener los turnos entre `fechaInicio` y `fechaFin`
app.get("/proxy/admision/turnos", async (req, res) => {
  const fechaInicio = req.query["filter[fechaInicio]"] || new Date().toISOString().split("T")[0];

  // 📌 Ajustamos `fechaFin` para obtener turnos del día siguiente también
  const fechaObj = new Date(fechaInicio);
  fechaObj.setDate(fechaObj.getDate() + 1);
  const fechaFin = fechaObj.toISOString().split("T")[0];

  const apiUrl = `https://finmedica.alephoo.com/api/v3/admision/turnos?filter[fechaInicio]=${fechaInicio}&filter[fechaFin]=${fechaFin}`;

  console.log(`🔍 Proxy: Buscando turnos desde ${fechaInicio} hasta ${fechaFin}`);

  try {
    const response = await axios.get(apiUrl, {
      headers: {
        Authorization: "Basic bW9iaWxlYXBwOnRsY181MDE5X1Jldm9sdWNpb25fLg==",
      },
    });

    console.log("✅ Proxy: Turnos obtenidos correctamente");
    res.json(response.data);
  } catch (error) {
    console.error(`❌ Proxy: Error al obtener los turnos`);
    res.status(error.response?.status || 500).json({ error: "Error en la API de turnos" });
  }
});

// 🔹 Proxy para obtener datos del paciente
app.get("/proxy/persona/:id", async (req, res) => {
  const personaId = req.params.id;
  const apiUrl = `https://finmedica.alephoo.com/api/v3/admin/personas/${personaId}`;

  console.log(`🔍 Proxy: Buscando paciente con ID: ${personaId}`);

  try {
    const response = await axios.get(apiUrl, {
      headers: {
        Authorization: "Basic bW9iaWxlYXBwOnRsY181MDE5X1Jldm9sdWNpb25fLg==",
      },
    });

    console.log("✅ Proxy: Paciente encontrado");
    res.json(response.data);
  } catch (error) {
    console.error(`❌ Proxy: Error al obtener datos del paciente (${personaId})`);
    res.status(error.response?.status || 500).json({ error: "Error en la API de pacientes" });
  }
});

// 🔹 Proxy para obtener datos de la agenda
app.get("/proxy/admision/agendas/:id", async (req, res) => {
  const agendaId = req.params.id;
  const apiUrl = `https://finmedica.alephoo.com/api/v3/admision/agendas/${agendaId}`;

  console.log(`🔍 Proxy: Buscando agenda con ID: ${agendaId}`);

  try {
    const response = await axios.get(apiUrl, {
      headers: {
        Authorization: "Basic bW9iaWxlYXBwOnRsY181MDE5X1Jldm9sdWNpb25fLg==",
      },
    });

    console.log("✅ Proxy: Agenda encontrada");
    res.json(response.data);
  } catch (error) {
    console.error(`❌ Proxy: Error al obtener datos de la agenda (${agendaId})`);
    res.status(error.response?.status || 500).json({ error: "Error en la API de agendas" });
  }
});

// Iniciar el servidor
app.listen(PORT, () => {
  console.log(`✅ Proxy corriendo en http://localhost:${PORT}`);
});
