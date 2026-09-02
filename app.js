// =====================================================
// AULAVIVA - FRONTEND
// =====================================================

document.addEventListener("DOMContentLoaded", () => {

    cargarProyectos();

    configurarFormulario();

    verificarEstadoSensores();

});


// =====================================================
// SENSORES
// =====================================================

function verificarEstadoSensores() {

    const estado = document.getElementById("estadoApi");
    const mensaje = document.getElementById("mensajeEstado");

    if (estado) {

        estado.innerHTML = `
            <span class="pulse-dot"></span>

            <div>
                <strong>API desconectada</strong>
                <small>Esperando conexión con sensores</small>
            </div>
        `;

    }

    if (mensaje) {

        mensaje.textContent =
            "No hay conexión con los sensores";

    }

    const mq5 = document.getElementById("mq5Valor");
    const mq5Hora = document.getElementById("mq5Hora");

    const temperatura =
        document.getElementById("dht11Temperatura");

    const humedad =
        document.getElementById("dht11Humedad");

    const dhtHora =
        document.getElementById("dht11Hora");

    const ds =
        document.getElementById("ds18b20Temperatura");

    const dsHora =
        document.getElementById("ds18b20Hora");

    const ultima =
        document.getElementById("ultimaActualizacion");


    if (mq5)
        mq5.textContent = "—";

    if (mq5Hora)
        mq5Hora.textContent = "—";

    if (temperatura)
        temperatura.innerHTML = `— <span>°C</span>`;

    if (humedad)
        humedad.innerHTML = `— <span>%</span>`;

    if (dhtHora)
        dhtHora.textContent = "—";

    if (ds)
        ds.innerHTML = `— <span>°C</span>`;

    if (dsHora)
        dsHora.textContent = "—";

    if (ultima)
        ultima.textContent = "—";

}


// =====================================================
// CREAR PROYECTO
// =====================================================

function abrirCrearProyecto() {

    const modalElement =
        document.getElementById("modalProyecto");

    if (!modalElement) {
        return;
    }

    const modal =
        new bootstrap.Modal(modalElement);

    modal.show();

}


// =====================================================
// FORMULARIO
// =====================================================

function configurarFormulario() {

    const formulario =
        document.getElementById("formProyecto");

    if (!formulario) {
        return;
    }

    formulario.addEventListener(
        "submit",
        function(event) {

            event.preventDefault();

            crearProyecto();

        }
    );

}


// =====================================================
// CREAR PROYECTO EN MYSQL
// =====================================================

async function crearProyecto() {

    const nombre =
        document
            .getElementById("nombreProyecto")
            .value
            .trim();

    const materia =
        document
            .getElementById("materiaProyecto")
            .value
            .trim();

    const aula =
        document
            .getElementById("aulaProyecto")
            .value
            .trim();

    const fechaInicio =
        document
            .getElementById("fechaInicio")
            .value;

    const fechaFin =
        document
            .getElementById("fechaFin")
            .value;


    if (
        !nombre ||
        !materia ||
        !aula ||
        !fechaInicio ||
        !fechaFin
    ) {

        alert("Completá todos los campos.");

        return;

    }


    if (fechaFin < fechaInicio) {

        alert(
            "La fecha de finalización no puede ser anterior a la fecha de inicio."
        );

        return;

    }


    try {

        const respuesta =
            await fetch(
                "proyectos.php?accion=crear",
                {
                    method: "POST",

                    headers: {
                        "Content-Type":
                            "application/json"
                    },

                    body: JSON.stringify({

                        nombre: nombre,

                        materia: materia,

                        aula: aula,

                        fechaInicio:
                            fechaInicio,

                        fechaFin:
                            fechaFin

                    })
                }
            );


        const datos =
            await respuesta.json();


        if (!datos.ok) {

            alert(
                datos.mensaje ||
                "No se pudo crear el proyecto."
            );

            return;

        }


        alert(
            "Proyecto creado correctamente."
        );


        document
            .getElementById("formProyecto")
            .reset();


        const modalElement =
            document.getElementById("modalProyecto");


        const modal =
            bootstrap.Modal.getInstance(
                modalElement
            );


        if (modal) {
            modal.hide();
        }


        // MUY IMPORTANTE:
        // volvemos a consultar MySQL
        cargarProyectos();


    } catch (error) {

        console.error(error);

        alert(
            "No se pudo conectar con el servidor."
        );

    }

}


// =====================================================
// CARGAR TODOS LOS PROYECTOS DESDE MYSQL
// =====================================================

async function cargarProyectos() {

    const lista =
        document.getElementById(
            "listaProyectos"
        );

    const sinProyectos =
        document.getElementById(
            "sinProyectos"
        );


    if (!lista) {
        return;
    }


    try {

        const respuesta =
            await fetch(
                "proyectos.php?accion=listar"
            );


        const datos =
            await respuesta.json();


        if (!datos.ok) {

            console.error(
                datos.mensaje
            );

            lista.innerHTML = `
                <div class="col-12">
                    <p>
                        ${escapeHTML(
                            datos.mensaje ||
                            "No se pudieron cargar los proyectos."
                        )}
                    </p>
                </div>
            `;

            return;

        }


        const proyectos =
            datos.proyectos || [];


        lista.innerHTML = "";


        // =================================================
        // NO HAY PROYECTOS
        // =================================================

        if (proyectos.length === 0) {

            if (sinProyectos) {

                sinProyectos.style.display =
                    "block";

            }

            return;

        }


        if (sinProyectos) {

            sinProyectos.style.display =
                "none";

        }


        // =================================================
        // MOSTRAR TODOS
        // =================================================

        proyectos.forEach(proyecto => {

            const tarjeta =
                document.createElement("div");


            tarjeta.className =
                "col-md-6 col-lg-4";


            tarjeta.innerHTML = `

                <article class="project-card">

                    <div class="project-card-top">

                        <span class="project-subject">

                            ${escapeHTML(
                                proyecto.materia
                            )}

                        </span>

                        <span class="project-pending">

                            ● ${escapeHTML(
                                proyecto.estado
                            )}

                        </span>

                    </div>


                    <h3>

                        ${escapeHTML(
                            proyecto.nombre
                        )}

                    </h3>


                    <p class="project-classroom">

                        Aula ${escapeHTML(
                            proyecto.aula
                        )}

                    </p>


                    <p>

                        Creado por:
                        <strong>
                            ${escapeHTML(
                                proyecto.usuario
                            )}
                        </strong>

                    </p>


                    <div class="project-dates">

                        <div>

                            <small>
                                Inicio
                            </small>

                            <strong>

                                ${formatearFecha(
                                    proyecto.fechaInicio
                                )}

                            </strong>

                        </div>


                        <div>

                            <small>
                                Finalización
                            </small>

                            <strong>

                                ${formatearFecha(
                                    proyecto.fechaFin
                                )}

                            </strong>

                        </div>

                    </div>


                    <button
                        class="btn btn-outline-custom w-100 mt-3"
                        onclick="verProyecto(${proyecto.id})">

                        Ver proyecto

                    </button>

                </article>

            `;


            lista.appendChild(tarjeta);

        });


    } catch (error) {

        console.error(error);

        lista.innerHTML = `
            <div class="col-12">
                <p>
                    No se pudieron cargar los proyectos.
                </p>
            </div>
        `;

    }

}


// =====================================================
// VER PROYECTO
// =====================================================

function verProyecto(id) {

    window.location.href =
        `proyecto.html?id=${id}`;

}


// =====================================================
// FORMATEAR FECHA
// =====================================================

function formatearFecha(fecha) {

    if (!fecha) {
        return "—";
    }


    const partes =
        fecha.split("-");


    if (partes.length !== 3) {
        return fecha;
    }


    return `${partes[2]}/${partes[1]}/${partes[0]}`;

}


// =====================================================
// ESCAPAR HTML
// =====================================================

function escapeHTML(texto) {

    const div =
        document.createElement("div");

    div.textContent =
        texto ?? "";

    return div.innerHTML;

}
