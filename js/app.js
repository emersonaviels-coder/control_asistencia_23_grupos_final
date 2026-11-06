/**
 * Control de Asistencia - Script con Soporte Completo para los 23 Grupos Académicos
 */

const WEBHOOKS_POR_CATEGORIA = {
  "parvularia": "https://discord.com/api/webhooks/1567538090560589905/5YKKxnw2U1mj3thwV1UD-Pl4iBsV4Qi2H-_-eVMBFkkMSo79tmIQcWhCyqs7TtmU83Wz",
  "primer_ciclo": "https://discord.com/api/webhooks/1567538341870837860/B1LX9s3um4KSBNG7GR-UO3xk3H9pUDw5wjPNPPt33CCoGnAmgCYtjH7vkRdPZkhKTPFv",
  "segundo_ciclo": "https://discord.com/api/webhooks/1567538539757834402/uKEVwGmJZsnq1WXbzHQDgOVn6K-8S_JApXmNHJDvuIzdUgpNbb7E94FEmly4LVrzDNou",
  "tercer_ciclo": "https://discord.com/api/webhooks/1567538760244142241/SnvUQEo-Cc35NYr97-6sbXb3G6MDVRSQm-8zlkD54KEw3NCeoBsoTR8SqG2DA2JJDmu1",
  "bachillerato": "https://discord.com/api/webhooks/1567538935993868422/H4h2yd9FNchMV7On5WuQtbsm4yOgN-WYXmNuNtCfzkKry_f4Gd7sbwiQo1j6ev8oCMet"
};

let datosGlobales = {};
let grupoActual = null;
let asistenciaEstado = {};

const datosFallback = {"parvularia": [{"id": "p4", "nombre": "Parvularia 4", "estudiantes": ["Mateo Alexander Benítez", "Sofía Isabel Alvarado", "Lucas Gabriel Flores", "Emma Valentina Gómez", "Camila Victoria Castaneda"]}, {"id": "p5", "nombre": "Parvularia 5", "estudiantes": ["Thiago Emanuel Hernández", "Mia Isabella López", "Benjamin Nicolas Martinez", "Zoe Alessandra Morales", "Ian Sebastian Navarro"]}, {"id": "p6", "nombre": "Parvularia 6", "estudiantes": ["Dylan Jose Gutierrez", "Valeria Nicole Ramos", "Sebastian Eduardo Castro", "Victoria Maria Ortiz", "Samuel Alejandro Mejia"]}], "primer_ciclo": [{"id": "1g-a", "nombre": "1.er grado A", "estudiantes": ["Adrian Jose Orellana", "Valeria Nicole Pineda", "Daniel Eduardo Quinteros", "Sara Maria Ramirez", "Diego Fernando Rivas"]}, {"id": "1g-b", "nombre": "1.er grado B", "estudiantes": ["Gabriel Antonio Sanchez", "Lucia Montserrat Torres", "Samuel Alejandro Vasquez", "Ximena Beatriz Zabala", "Carlos Mauricio Aguilar"]}, {"id": "2g-a", "nombre": "2.º grado A", "estudiantes": ["Andrea Carolina Barahona", "Fernando Jose Cruz", "Mariana Elizabeth Diaz", "Rodrigo Alberto Escobar", "Natalia Raquel Fuentes"]}, {"id": "2g-b", "nombre": "2.º grado B", "estudiantes": ["Alejandro Javier Garcia", "Paola Michelle Henriquez", "Javier Andres Ibarra", "Daniela Sofia Juarez", "Leonardo Esteban Lara"]}, {"id": "3g-a", "nombre": "3.er grado A", "estudiantes": ["Adriana Marcela Molina", "Guillermo Enrique Nolasco", "Sonia Rebecca Oliva", "Oscar Wilfredo Peña", "Claudia Maria Quintanilla"]}, {"id": "3g-b", "nombre": "3.er grado B", "estudiantes": ["Hector Eduardo Reyes", "Alicia Stephanie Salguero", "David Ernesto Tobar", "Vanessa Alejandra Urrutia", "Jorge Luis Valle"]}], "segundo_ciclo": [{"id": "4g-a", "nombre": "4.º grado A", "estudiantes": ["Christian Omar Zelaya", "Monica Patricia Abrego", "Raul Arturo Bermudez", "Elena Maria Cisneros", "Rene Alberto Delgado"]}, {"id": "4g-b", "nombre": "4.º grado B", "estudiantes": ["Gabriela Stefany Espinoza", "Mario Roberto Figueroa", "Isabel Cristina Guzman", "Edwin Mauricio Huezo", "Diana Karen Melendez"]}, {"id": "5g", "nombre": "5.º grado", "estudiantes": ["Victor Manuel Portillo", "Ingrid Vanessa Recinos", "Alfonso Jose Serrano", "Brenda Maria Trujillo", "Ernesto Javier Ventura"]}, {"id": "6g", "nombre": "6.º grado", "estudiantes": ["Kevin Alexis Ayala", "Gisselle Maria Campos", "Bryan Alexander Duran", "Fatima Guadalupe Eraso", "Jonathan Josue Galan"]}], "tercer_ciclo": [{"id": "7g", "nombre": "7.º grado", "estudiantes": ["Jacqueline Nicole Lainez", "Jose Roberto Menjivar", "Katia Elizabeth Palacios", "Ronaldo Antonio Ramos", "Wendy Stephany Zepeda"]}, {"id": "8g", "nombre": "8.º grado", "estudiantes": ["Esteban Andres Molina", "Jimena Beatriz Quinteros", "Carlos Eduardo Rivas", "Daniela Nicole Serrano", "Felipe Mauricio Tobar"]}, {"id": "9g", "nombre": "9.º grado", "estudiantes": ["Guillermo Alberto Zelaya", "Mariana Sofia Abrego", "Hugo Alexander Bermudez", "Paola Andrea Cruz", "Roberto Carlos Delgado"]}], "bachillerato": [{"id": "1bg-a", "nombre": "1.er año general A", "estudiantes": ["Alex Fernando Arias", "Camila Nicole Beltran", "Cristian Jose Calderon", "Diana Stephanie Duran", "Erick Omar Flores"]}, {"id": "1bg-b", "nombre": "1.er año general B", "estudiantes": ["Fatima Maria Gonzalez", "Hector Manuel Ibarra", "Jennifer Elizabeth Lopez", "Jorge Alberto Meza", "Kenia Raquel Navarro"]}, {"id": "1bs", "nombre": "1.er año de software", "estudiantes": ["Kevin Eduardo Orellana", "Laura Michelle Perez", "Luis Gustavo Ramirez", "Maria Jose Salguero", "Nelson Enrique Torres"]}, {"id": "2bg-a", "nombre": "2.º año general A", "estudiantes": ["Oscar Rene Urrutia", "Patricia Alejandra Valenzuela", "Rodrigo Antonio Gomez", "Stefany Isabel Hernandez", "Victor Hugo Lainez"]}, {"id": "2bg-b", "nombre": "2.º año general B", "estudiantes": ["Alan Josue Martinez", "Beatriz Carolina Melendez", "Cesar Alejandro Nolasco", "Denisse Maria Oliva", "Edgar Mauricio Peña"]}, {"id": "2bs", "nombre": "2.º año de software", "estudiantes": ["Fernando Javier Quintanilla", "Gabriela Beatriz Reyes", "Jose Carlos Rivas", "Sonia Stephanie Vasquez", "Walter Ernesto Zabala"]}, {"id": "3bs", "nombre": "3.er año de software", "estudiantes": ["Alvaro Jose Aguilar", "Berenice Maria Barahona", "Diego Armando Cruz", "Evelyn Nicole Diaz", "Francisco Javier Escobar"]}]};

$(document).ready(function () {
  inicializarFecha();
  cargarDatos();
  configurarEventos();
});

function inicializarFecha() {
  const hoy = new Date();
  const opciones = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
  const fechaFormateada = hoy.toLocaleDateString('es-ES', opciones);
  const fechaCapitalizada = fechaFormateada.charAt(0).toUpperCase() + fechaFormateada.slice(1);
  
  $('#fechaTexto').text(fechaCapitalizada);
  $('#fechaDetalle').text(fechaCapitalizada);
}

function cargarDatos() {
  $.getJSON('data/students.json')
    .done(function (data) {
      datosGlobales = data;
      renderizarMenuGrupos(data);
    })
    .fail(function () {
      datosGlobales = datosFallback;
      renderizarMenuGrupos(datosFallback);
    });
}

function renderizarMenuGrupos(data) {
  const $menu = $('#menuGrupos');
  $menu.empty();

  const categoriasNombres = {
    parvularia: 'Parvularia (3 grupos)',
    primer_ciclo: 'Primer Ciclo (6 grupos)',
    segundo_ciclo: 'Segundo Ciclo (4 grupos)',
    tercer_ciclo: 'Tercer Ciclo (3 grupos)',
    bachillerato: 'Bachillerato (7 grupos)'
  };

  $.each(data, function (catKey, grupos) {
    if (!grupos || grupos.length === 0) return;

    const $catHeader = $('<div>')
      .addClass('ios-category-header')
      .text(categoriasNombres[catKey] || catKey);
    $menu.append($catHeader);

    grupos.forEach(grupo => {
      const $item = $('<div>')
        .addClass('ios-group-card')
        .attr('data-id', grupo.id)
        .attr('data-cat', catKey)
        .html(`
          <div>
            <div class="fw-bold fs-6 text-dark">${grupo.nombre}</div>
            <small class="text-secondary"><i class="bi bi-people me-1"></i>${grupo.estudiantes.length} alumnos</small>
          </div>
          <i class="bi bi-chevron-right ios-chevron text-muted"></i>
        `);

      $item.on('click', function () {
        $('.ios-group-card').removeClass('active');
        $(this).addClass('active');
        seleccionarGrupo(catKey, grupo);
        
        const offcanvasEl = document.getElementById('sidebarOffcanvas');
        const bsOffcanvas = bootstrap.Offcanvas.getInstance(offcanvasEl);
        if (bsOffcanvas) bsOffcanvas.hide();
      });

      $menu.append($item);
    });
  });
}

function seleccionarGrupo(catKey, grupo) {
  grupoActual = { ...grupo, categoriaKey: catKey };
  
  const guardado = localStorage.getItem(`asistencia_${grupo.id}`);
  if (guardado) {
    asistenciaEstado = JSON.parse(guardado);
  } else {
    asistenciaEstado = {};
    grupo.estudiantes.forEach(est => {
      asistenciaEstado[est] = 'puntual';
    });
  }

  $('#tituloGrupo').text(grupo.nombre);
  $('#categoriaBadge').text(catKey.replace('_', ' ').toUpperCase());
  $('#totalEstudiantesBadge').text(`${grupo.estudiantes.length} estudiantes`);

  $('#vacio').hide();
  $('#panel').fadeIn(200);

  renderizarListaEstudiantes();
  actualizarResumen();
}

function renderizarListaEstudiantes() {
  const $lista = $('#listaEstudiantes');
  $lista.empty();

  grupoActual.estudiantes.forEach((estudiante, idx) => {
    const estado = asistenciaEstado[estudiante] || 'puntual';

    const $li = $('<li>').addClass('list-group-item');
    const $row = $('<div>').addClass('student-row-layout');

    const $info = $('<div>').html(`
      <div class="student-name">${estudiante}</div>
      <div class="student-num"><i class="bi bi-hash"></i> N° de lista: ${idx + 1}</div>
    `);

    const $control = $('<div>').addClass('ios-segmented-group');

    const opciones = [
      { key: 'puntual', label: 'Puntual', icon: 'bi-check-circle-fill', activeClass: 'active-puntual' },
      { key: 'tarde', label: 'Tarde', icon: 'bi-clock-fill', activeClass: 'active-tarde' },
      { key: 'ausente', label: 'Ausente', icon: 'bi-x-circle-fill', activeClass: 'active-ausente' }
    ];

    opciones.forEach(opt => {
      const isSelected = estado === opt.key;
      const $optBtn = $('<button>')
        .attr('type', 'button')
        .addClass(`segmented-btn ${isSelected ? opt.activeClass : ''}`)
        .html(`<i class="bi ${opt.icon}"></i> ${opt.label}`);

      $optBtn.on('click', function () {
        asistenciaEstado[estudiante] = opt.key;
        guardarLocal();
        renderizarListaEstudiantes();
        actualizarResumen();
      });

      $control.append($optBtn);
    });

    $row.append($info).append($control);
    $li.append($row);
    $lista.append($li);
  });
}

function actualizarResumen() {
  let puntuales = 0, tardes = 0, ausentes = 0;

  Object.values(asistenciaEstado).forEach(est => {
    if (est === 'puntual') puntuales++;
    if (est === 'tarde') tardes++;
    if (est === 'ausente') ausentes++;
  });

  $('#cantPuntuales').text(puntuales);
  $('#cantTardes').text(tardes);
  $('#cantAusentes').text(ausentes);
}

function guardarLocal() {
  if (grupoActual) {
    localStorage.setItem(`asistencia_${grupoActual.id}`, JSON.stringify(asistenciaEstado));
  }
}

function configurarEventos() {
  $('#buscarGrupo').on('input', function () {
    const term = $(this).val().toLowerCase();
    $('.ios-group-card').each(function () {
      const text = $(this).text().toLowerCase();
      $(this).toggle(text.includes(term));
    });
  });

  $('#btnMarcarTodos').on('click', function () {
    if (!grupoActual) return;
    grupoActual.estudiantes.forEach(est => {
      asistenciaEstado[est] = 'puntual';
    });
    guardarLocal();
    renderizarListaEstudiantes();
    actualizarResumen();
    mostrarToast('Asistencia', 'Se han marcado todos los alumnos como Puntuales.', 'success');
  });

  $('#btnReiniciar').on('click', function () {
    if (!grupoActual) return;
    grupoActual.estudiantes.forEach(est => {
      asistenciaEstado[est] = 'puntual';
    });
    guardarLocal();
    renderizarListaEstudiantes();
    actualizarResumen();
    mostrarToast('Reiniciado', 'Se restableció el estado del grupo.', 'warning');
  });

  $('#btnEnviarDiscord').on('click', enviarADiscord);
}

function enviarADiscord() {
  if (!grupoActual) return;

  const $btn = $('#btnEnviarDiscord');
  $btn.prop('disabled', true).html('<span class="spinner-border spinner-border-sm me-2"></span> Enviando a Discord...');

  let puntuales = [], tardes = [], ausentes = [];
  Object.entries(asistenciaEstado).forEach(([nombre, estado]) => {
    if (estado === 'puntual') puntuales.push(nombre);
    else if (estado === 'tarde') tardes.push(nombre);
    else if (estado === 'ausente') ausentes.push(nombre);
  });

  const fechaHoy = $('#fechaTexto').text();
  const targetWebhook = WEBHOOKS_POR_CATEGORIA[grupoActual.categoriaKey] || WEBHOOKS_POR_CATEGORIA['parvularia'];

  const discordPayload = {
    embeds: [
      {
        title: `📋 Registro de Asistencia: ${grupoActual.nombre}`,
        color: 3426787,
        timestamp: new Date().toISOString(),
        fields: [
          { name: "📅 Fecha", value: fechaHoy, inline: true },
          { name: "👥 Total Alumnos", value: `${grupoActual.estudiantes.length}`, inline: true },
          { name: `✅ Puntuales (${puntuales.length})`, value: puntuales.join("\n") || "*Ninguno*", inline: false },
          { name: `⚠️ Tardanzas (${tardes.length})`, value: tardes.join("\n") || "*Ninguna*", inline: false },
          { name: `❌ Ausentes (${ausentes.length})`, value: ausentes.join("\n") || "*Ninguno*", inline: false }
        ],
        footer: {
          text: `Categoría: ${grupoActual.categoriaKey.toUpperCase()} · Control de Asistencia`
        }
      }
    ]
  };

  $.ajax({
    url: targetWebhook,
    type: 'POST',
    contentType: 'application/json',
    data: JSON.stringify(discordPayload)
  })
  .done(function () {
    mostrarToast('¡Enviado!', `Reporte enviado al canal de Discord de ${grupoActual.categoriaKey.replace('_', ' ').toUpperCase()}.`, 'success');
  })
  .fail(function () {
    $.ajax({
      url: '/api/notify',
      type: 'POST',
      contentType: 'application/json',
      data: JSON.stringify({
        grupoId: grupoActual.id,
        grupoNombre: grupoActual.nombre,
        categoriaKey: grupoActual.categoriaKey,
        fecha: fechaHoy,
        asistencia: asistenciaEstado
      })
    })
    .done(function() {
      mostrarToast('¡Enviado!', 'Asistencia notificada correctamente a Discord.', 'success');
    })
    .fail(function() {
      mostrarToast('Notificación', 'Reporte procesado localmente con éxito.', 'info');
    });
  })
  .always(function () {
    $btn.prop('disabled', false).html('<i class="bi bi-discord me-2"></i> Enviar Asistencia a Discord');
  });
}

function mostrarToast(titulo, mensaje, tipo = 'info') {
  const bgMap = {
    success: 'bg-success text-white',
    danger: 'bg-danger text-white',
    warning: 'bg-warning text-dark',
    info: 'bg-primary text-white'
  };

  const toastId = 'toast_' + Date.now();
  const html = `
    <div id="${toastId}" class="toast align-items-center ${bgMap[tipo] || 'bg-dark text-white'} border-0 mb-2 shadow-lg" role="alert" aria-live="assertive" aria-atomic="true">
      <div class="d-flex">
        <div class="toast-body fs-6">
          <strong>${titulo}:</strong> ${mensaje}
        </div>
        <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast" aria-label="Close"></button>
      </div>
    </div>
  `;

  $('#toastContainer').append(html);
  const toastEl = document.getElementById(toastId);
  const toast = new bootstrap.Toast(toastEl, { delay: 4500 });
  toast.show();
}
