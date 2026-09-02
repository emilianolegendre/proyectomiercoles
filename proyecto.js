// =====================================================
// AULAVIVA - PÁGINA DE PROYECTO
// =====================================================


// =====================================================
// INICIAR
// =====================================================

document.addEventListener(
    "DOMContentLoaded",
    () => {

        cargarProyecto();

    }
);



// =====================================================
// OBTENER ID DEL PROYECTO
// =====================================================

function obtenerIdProyecto() {

    const parametros =
        new URLSearchParams(
            window.location.search
        );

    return parametros.get("id");

}



// =====================================================
// CARGAR PROYECTO
// =====================================================

async function cargarProyecto() {

    const id =
        obtenerIdProyecto();


    // ---------------------------------------------
    // VERIFICAR ID
    // ---------------------------------------------

    if (!id) {

        mostrarError();

        return;

    }


    try {

        const respuesta =
            await fetch(
                `proyectos.php?accion=obtener&id=${encodeURIComponent(id)}`
            );


        const datos =
            await respuesta.json();


        // ---------------------------------------------
        // ERROR
        // ---------------------------------------------

        if (!datos.ok) {

            mostrarError();

            return;

        }


        const proyecto =
            datos.proyecto;



        // =================================================
        // TÍTULO
        // =================================================

        const nombre =
            document.getElementById(
                "nombreProyectoPagina"
            );


        if (nombre) {

            nombre.textContent =
                proyecto.nombre;

        }



        // =================================================
        // PERSONA
        // =================================================

        const persona =
            document.getElementById(
                "personaProyectoPagina"
            );


        if (persona) {

            persona.textContent =
                `Proyecto realizado por ${proyecto.usuario}.`;

        }



        // =================================================
        // DESCRIPCIÓN
        // =================================================

        const descripcion =
            document.getElementById(
                "descripcionProyectoPagina"
            );


        if (descripcion) {

            if (proyecto.descripcion) {

                descripcion.textContent =
                    proyecto.descripcion;

            } else {

                descripcion.textContent =
                    "Este proyecto corresponde a un sistema de monitoreo de temperatura mediante sensores.";

            }

        }



        // =================================================
        // USUARIO
        // =================================================

        const usuario =
            document.getElementById(
                "usuarioProyecto"
            );


        if (usuario) {

            usuario.textContent =
                proyecto.usuario;

        }



        // =================================================
        // ID
        // =================================================

        const idElemento =
            document.getElementById(
                "idProyecto"
            );


        if (idElemento) {

            idElemento.textContent =
                `Proyecto #${proyecto.id}`;

        }



        // =================================================
        // CARGAR MEDICIONES
        // =================================================

        cargarHistorial(
            proyecto.id
        );


    } catch (error) {

        console.error(
            "Error:",
            error
        );

        mostrarError();

    }

}



// =====================================================
// CARGAR HISTORIAL
// =====================================================

async function cargarHistorial(
    idProyecto
) {

    const sinMediciones =
        document.getElementById(
            "sinMediciones"
        );


    const tablaContainer =
        document.getElementById(
            "tablaHistorialContainer"
        );


    const tabla =
        document.getElementById(
            "historialTabla"
        );



    try {

        const respuesta =
            await fetch(
                `proyectos.php?accion=mediciones&id_proyecto=${encodeURIComponent(idProyecto)}`
            );


        const datos =
            await respuesta.json();



        // =================================================
        // SI NO HAY DATOS
        // =================================================

        if (
            !datos.ok ||
            !datos.mediciones ||
            datos.mediciones.length === 0
        ) {

            if (sinMediciones) {

                sinMediciones.style.display =
                    "block";

            }


            if (tablaContainer) {

                tablaContainer.style.display =
                    "none";

            }


            return;

        }



        // =================================================
        // MOSTRAR TABLA
        // =================================================

        if (sinMediciones) {

            sinMediciones.style.display =
                "none";

        }


        if (tablaContainer) {

            tablaContainer.style.display =
                "block";

        }



        // Limpiar tabla

        if (tabla) {

            tabla.innerHTML = "";

        }



        // =================================================
        // CREAR FILAS
        // =================================================

        datos.mediciones.forEach(
            (medicion, index) => {

                const fila =
                    document.createElement(
                        "tr"
                    );


                fila.innerHTML = `

                    <td>
                        ${index + 1}
                    </td>

                    <td>
                        ${formatearFecha(medicion.fecha)}
                    </td>

                    <td>
                        ${medicion.hora ?? "—"}
                    </td>

                    <td>
                        ${formatearValor(medicion.mq5)}
                    </td>

                    <td>
                        ${formatearTemperatura(medicion.dht11)}
                    </td>

                    <td>
                        ${formatearTemperatura(medicion.ds18b20)}
                    </td>

                `;


                tabla.appendChild(
                    fila
                );

            }
        );


    } catch (error) {

        console.error(
            "Error cargando mediciones:",
            error
        );


        if (sinMediciones) {

            sinMediciones.style.display =
                "block";

        }


        if (tablaContainer) {

            tablaContainer.style.display =
                "none";

        }

    }

}



// =====================================================
// FORMATEAR TEMPERATURA
// =====================================================

function formatearTemperatura(
    valor
) {

    if (
        valor === null ||
        valor === undefined ||
        valor === ""
    ) {

        return "—";

    }


    return `${valor} °C`;

}



// =====================================================
// FORMATEAR MQ5
// =====================================================

function formatearValor(
    valor
) {

    if (
        valor === null ||
        valor === undefined ||
        valor === ""
    ) {

        return "—";

    }


    return valor;

}



// =====================================================
// FORMATEAR FECHA
// =====================================================

function formatearFecha(
    fecha
) {

    if (!fecha) {

        return "—";

    }


    const partes =
        fecha.split("-");


    if (
        partes.length !== 3
    ) {

        return fecha;

    }


    return `${partes[2]}/${partes[1]}/${partes[0]}`;

}



// =====================================================
// ERROR
// =====================================================

function mostrarError() {

    const nombre =
        document.getElementById(
            "nombreProyectoPagina"
        );


    const persona =
        document.getElementById(
            "personaProyectoPagina"
        );


    const descripcion =
        document.getElementById(
            "descripcionProyectoPagina"
        );


    if (nombre) {

        nombre.textContent =
            "Proyecto no encontrado";

    }


    if (persona) {

        persona.textContent =
            "No se pudo cargar la información del proyecto.";

    }


    if (descripcion) {

        descripcion.textContent =
            "";

    }

}
