let usuario = JSON.parse(localStorage.getItem("usuario")) || null;
let solicitudes = JSON.parse(localStorage.getItem("solicitudes")) || [];

function guardarDatos() {
  localStorage.setItem("solicitudes", JSON.stringify(solicitudes));
}

function mostrarPanel() {
  document.getElementById("login-section").classList.add("hidden");
  document.getElementById("panel-section").classList.remove("hidden");
  document.getElementById("panel-title").innerText = `Panel de ${usuario.rol}`;
  const panel = document.getElementById("panel-content");
  panel.innerHTML = "";

  if (usuario.rol === "Trabajador") {
    panel.innerHTML = `
      <h3>Enviar Solicitud</h3>
      <select id="tipoSolicitud">
        <option value="Cambio de turno">Cambio de turno</option>
        <option value="Mantenimiento">Mantenimiento</option>
      </select>
      <div id="formularioExtra"></div>
      <button onclick="enviarSolicitud()">Enviar Solicitud</button>
    `;
    document.getElementById("tipoSolicitud").addEventListener("change", mostrarFormularioExtra);
    mostrarFormularioExtra();
  }

  if (usuario.rol === "Gerente") {
    panel.innerHTML = `<h3>Solicitudes de cambio de turno</h3>`;
    mostrarTabla("Cambio de turno");
  }

  if (usuario.rol === "Mantenimiento") {
    panel.innerHTML = `<h3>Reportes de mantenimiento</h3>`;
    mostrarTabla("Mantenimiento");
  }
}

function mostrarFormularioExtra() {
  const tipo = document.getElementById("tipoSolicitud").value;
  const div = document.getElementById("formularioExtra");
  if (tipo === "Cambio de turno") {
    div.innerHTML = `
      <input type="date" id="diaCambio">
      <input type="text" id="horario" placeholder="Horario solicitado (ej. 9am - 5pm)">
    `;
  } else {
    div.innerHTML = `
      <input type="text" id="area" placeholder="Área de mantenimiento">
      <input type="text" id="maquina" placeholder="Máquina">
      <input type="time" id="horaReporte">
    `;
  }
}

function enviarSolicitud() {
  const tipo = document.getElementById("tipoSolicitud").value;
  let nueva = {
    id: Date.now(),
    tipo,
    nombre: usuario.nombre,
    estado: "Pendiente",
  };

  if (tipo === "Cambio de turno") {
    nueva.dia = document.getElementById("diaCambio").value;
    nueva.horario = document.getElementById("horario").value;
  } else {
    nueva.area = document.getElementById("area").value;
    nueva.maquina = document.getElementById("maquina").value;
    nueva.hora = document.getElementById("horaReporte").value;
  }

  solicitudes.push(nueva);
  guardarDatos();
  alert("✅ Solicitud enviada correctamente");
}

function mostrarTabla(tipo) {
  const panel = document.getElementById("panel-content");
  const lista = solicitudes.filter(s => s.tipo === tipo);
  if (lista.length === 0) {
    panel.innerHTML += "<p>No hay solicitudes aún.</p>";
    return;
  }
  let tabla = `<table><tr><th>Nombre</th><th>Detalles</th><th>Estado</th><th>Acción</th></tr>`;
  lista.forEach(s => {
    let detalles = "";
    if (s.tipo === "Cambio de turno")
      detalles = `Día: ${s.dia}<br>Horario: ${s.horario}`;
    else
      detalles = `Área: ${s.area}<br>Máquina: ${s.maquina}<br>Hora: ${s.hora}`;

    let acciones = "";
    if (usuario.rol === "Gerente") {
      acciones = `
        <button onclick="responder(${s.id}, 'Autorizado')">Autorizar</button>
        <button onclick="responder(${s.id}, 'Rechazado')">Rechazar</button>
      `;
    } else if (usuario.rol === "Mantenimiento") {
      acciones = `
        <button onclick="responder(${s.id}, 'En reparación')">En reparación</button>
        <button onclick="responder(${s.id}, 'Atendido')">Atendido</button>
      `;
    }

    tabla += `<tr>
      <td>${s.nombre}</td>
      <td>${detalles}</td>
      <td>${s.estado}</td>
      <td>${acciones}</td>
    </tr>`;
  });
  tabla += `</table>`;
  panel.innerHTML += tabla;
}

function responder(id, estado) {
  solicitudes = solicitudes.map(s => s.id === id ? {...s, estado} : s);
  guardarDatos();
  mostrarPanel();
}

function setRole(rol) {
  const nombre = document.getElementById("nombre").value.trim();
  if (!nombre) return alert("Por favor, ingresa tu nombre");
  usuario = { nombre, rol };
  localStorage.setItem("usuario", JSON.stringify(usuario));
  mostrarPanel();
}

function cerrarSesion() {
  localStorage.removeItem("usuario");
  location.reload();
}

if (usuario) mostrarPanel();
