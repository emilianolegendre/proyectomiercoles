const listaUsuarios =
    document.getElementById("listaUsuarios");

const listaProyectos =
    document.getElementById("listaProyectos");

const mensaje =
    document.getElementById("mensaje");


/*
==================================================
INICIO
==================================================
*/

document.addEventListener(
    "DOMContentLoaded",
    () => {

        cargarUsuarios();

        cargarProyectos();

    }
);


/*
==================================================
USUARIOS
==================================================
*/

async function cargarUsuarios() {

    try {

        const respuesta = await fetch(
            "admin.php?accion=usuarios"
        );


        const datos =
            await respuesta.json();


        if (!respuesta.ok || !datos.ok) {

            throw new Error(
                datos.mensaje ||
                "No se pudieron obtener los usuarios."
            );

        }


        listaUsuarios.innerHTML = "";


        if (
            !datos.usuarios ||
            datos.usuarios.length === 0
        ) {

            listaUsuarios.innerHTML = `
                <tr>

                    <td
                        colspan="6"
                        class="loading">

                        No hay usuarios registrados.

                    </td>

                </tr>
            `;

            return;
        }


        datos.usuarios.forEach(
            usuario => {

                const fila =
                    document.createElement("tr");


                fila.innerHTML = `

                    <td>

                        <strong>
                            ${escapeHTML(
                                usuario.id_usuario
                            )}
                        </strong>

                    </td>


                    <td>

                        ${escapeHTML(
                            usuario.Nombre
                        )}

                    </td>


                    <td>

                        ${escapeHTML(
                            usuario.Apellido
                        )}

                    </td>


                    <td>

                        <span class="role">

                            ${escapeHTML(
                                usuario.Rol
                            )}

                        </span>

                    </td>


                    <td>

                        <select
                            class="role-select"
                            id="rol-${escapeHTML(
                                usuario.id_usuario
                            )}">

                            <option
                                value="estudiante"
                                ${
                                    usuario.Rol ===
                                    "estudiante"
                                        ? "selected"
                                        : ""
                                }>

                                Estudiante

                            </option>


                            <option
                                value="docente"
                                ${
                                    usuario.Rol ===
                                    "docente"
                                        ? "selected"
                                        : ""
                                }>

                                Docente

                            </option>


                            <option
                                value="invitado"
                                ${
                                    usuario.Rol ===
                                    "invitado"
                                        ? "selected"
                                        : ""
                                }>

                                Invitado

                            </option>


                            <option
                                value="administrador"
                                ${
                                    usuario.Rol ===
                                    "administrador"
                                        ? "selected"
                                        : ""
                                }>

                                Administrador

                            </option>

                        </select>

                    </td>


                    <td>

                        <button
                            class="btn-primary"
                            onclick="guardarRol(
                                '${encodeURIComponent(
                                    usuario.id_usuario
                                )}'
                            )">

                            Guardar

                        </button>

                    </td>

                `;


                listaUsuarios.appendChild(fila);

            }
        );


    } catch (error) {

        console.error(
            "Error usuarios:",
            error
        );


        listaUsuarios.innerHTML = `
            <tr>

                <td
                    colspan="6"
                    class="loading">

                    ${escapeHTML(
                        error.message
                    )}

                </td>

            </tr>
        `;

    }
}


/*
==================================================
GUARDAR ROL
==================================================
*/

async function guardarRol(
    idCodificado
) {

    const id_usuario =
        decodeURIComponent(
            idCodificado
        );


    const select =
        document.getElementById(
            `rol-${id_usuario}`
        );


    if (!select) {

        mostrarMensaje(
            "No se encontró el selector del usuario.",
            "error"
        );

        return;
    }


    const rol =
        select.value;


    const confirmar =
        confirm(
            `¿Cambiar el rol de "${id_usuario}" a "${rol}"?`
        );


    if (!confirmar) {

        return;

    }


    try {

        const respuesta =
            await fetch(
                "admin.php?accion=cambiar_rol",
                {

                    method: "POST",

                    headers: {
                        "Content-Type":
                            "application/json"
                    },

                    body: JSON.stringify({

                        id_usuario:
                            id_usuario,

                        rol:
                            rol

                    })

                }
            );


        const datos =
            await respuesta.json();


        if (!respuesta.ok || !datos.ok) {

            throw new Error(
                datos.mensaje ||
                "No se pudo actualizar el rol."
            );

        }


        mostrarMensaje(
            datos.mensaje,
            "exito"
        );


        cargarUsuarios();


    } catch (error) {

        console.error(
            "Error rol:",
            error
        );


        mostrarMensaje(
            error.message,
            "error"
        );

    }
}


/*
==================================================
PROYECTOS
==================================================
*/

async function cargarProyectos() {

    try {

        const respuesta =
            await fetch(
                "admin.php?accion=proyectos"
            );


        const datos =
            await respuesta.json();


        if (!respuesta.ok || !datos.ok) {

            throw new Error(
                datos.mensaje ||
                "No se pudieron cargar los proyectos."
            );

        }


        listaProyectos.innerHTML = "";


        if (
            !datos.proyectos ||
            datos.proyectos.length === 0
        ) {

            listaProyectos.innerHTML = `
                <div class="loading">

                    No hay proyectos creados.

                </div>
            `;

            return;
        }


        datos.proyectos.forEach(
            proyecto => {

                const tarjeta =
                    document.createElement("article");


                tarjeta.className =
                    "project-card";


                tarjeta.innerHTML = `

                    <span class="card-kicker">

                        PROYECTO
                        #${proyecto.Id_proyecto}

                    </span>


                    <h3>

                        ${escapeHTML(
                            proyecto.Titulo
                        )}

                    </h3>


                    <p class="project-description">

                        ${escapeHTML(
                            proyecto.Descripcion ||
                            "Sin descripción."
                        )}

                    </p>


                    <div class="project-owner">

                        Creado por:

                        <strong>

                            ${escapeHTML(
                                proyecto.Usuario
                            )}

                        </strong>

                    </div>


                    <div class="project-actions">


                        <button
                            class="btn-primary"
                            onclick="abrirEditar(
                                ${proyecto.Id_proyecto},
                                '${encodeURIComponent(
                                    proyecto.Titulo
                                )}',
                                '${encodeURIComponent(
                                    proyecto.Descripcion || ""
                                )}',
                                '${encodeURIComponent(
                                    proyecto.Usuario
                                )}'
                            )">

                            Editar

                        </button>


                        <button
                            class="btn-danger"
                            onclick="borrarProyecto(
                                ${proyecto.Id_proyecto},
                                '${encodeURIComponent(
                                    proyecto.Titulo
                                )}'
                            )">

                            Eliminar

                        </button>


                    </div>

                `;


                listaProyectos.appendChild(
                    tarjeta
                );

            }
        );


    } catch (error) {

        console.error(
            "Error proyectos:",
            error
        );


        listaProyectos.innerHTML = `
            <div class="loading">

                ${escapeHTML(
                    error.message
                )}

            </div>
        `;

    }
}


/*
==================================================
ABRIR EDITAR
==================================================
*/

function abrirEditar(
    id,
    titulo,
    descripcion,
    usuario
) {

    document.getElementById(
        "editarId"
    ).value = id;


    document.getElementById(
        "editarTitulo"
    ).value =
        decodeURIComponent(
            titulo
        );


    document.getElementById(
        "editarDescripcion"
    ).value =
        decodeURIComponent(
            descripcion
        );


    document.getElementById(
        "editarUsuario"
    ).value =
        decodeURIComponent(
            usuario
        );


    document.getElementById(
        "modalEditar"
    ).classList.add("active");
}


/*
==================================================
CERRAR MODAL
==================================================
*/

function cerrarModal() {

    document.getElementById(
        "modalEditar"
    ).classList.remove(
        "active"
    );

}


/*
==================================================
GUARDAR PROYECTO EDITADO
==================================================
*/

async function guardarProyecto() {

    const id =
        document.getElementById(
            "editarId"
        ).value;


    const titulo =
        document.getElementById(
            "editarTitulo"
        ).value.trim();


    const descripcion =
        document.getElementById(
            "editarDescripcion"
        ).value.trim();


    const usuario =
        document.getElementById(
            "editarUsuario"
        ).value.trim();


    if (
        !titulo ||
        !usuario
    ) {

        mostrarMensaje(
            "El título y el usuario son obligatorios.",
            "error"
        );

        return;
    }


    try {

        const respuesta =
            await fetch(
                "admin.php?accion=editar_proyecto",
                {

                    method: "POST",

                    headers: {
                        "Content-Type":
                            "application/json"
                    },

                    body: JSON.stringify({

                        id_proyecto:
                            id,

                        titulo:
                            titulo,

                        descripcion:
                            descripcion,

                        usuario:
                            usuario

                    })

                }
            );


        const datos =
            await respuesta.json();


        if (!respuesta.ok || !datos.ok) {

            throw new Error(
                datos.mensaje ||
                "No se pudo editar el proyecto."
            );

        }


        cerrarModal();


        mostrarMensaje(
            datos.mensaje,
            "exito"
        );


        cargarProyectos();


    } catch (error) {

        console.error(
            "Error editar:",
            error
        );


        mostrarMensaje(
            error.message,
            "error"
        );

    }
}


/*
==================================================
BORRAR PROYECTO
==================================================
*/

async function borrarProyecto(
    id,
    tituloCodificado
) {

    const titulo =
        decodeURIComponent(
            tituloCodificado
        );


    const confirmar =
        confirm(
            `¿Seguro que querés eliminar "${titulo}"?\n\nTambién se eliminarán sus mediciones y módulos asociados.`
        );


    if (!confirmar) {

        return;

    }


    try {

        const respuesta =
            await fetch(
                "admin.php?accion=borrar_proyecto",
                {

                    method: "POST",

                    headers: {
                        "Content-Type":
                            "application/json"
                    },

                    body: JSON.stringify({

                        id_proyecto:
                            id

                    })

                }
            );


        const datos =
            await respuesta.json();


        if (!respuesta.ok || !datos.ok) {

            throw new Error(
                datos.mensaje ||
                "No se pudo eliminar el proyecto."
            );

        }


        mostrarMensaje(
            datos.mensaje,
            "exito"
        );


        cargarProyectos();


    } catch (error) {

        console.error(
            "Error borrar:",
            error
        );


        mostrarMensaje(
            error.message,
            "error"
        );

    }
}


/*
==================================================
MENSAJES
==================================================
*/

function mostrarMensaje(
    texto,
    tipo
) {

    mensaje.textContent =
        texto;


    mensaje.className =
        `mensaje ${tipo}`;


    mensaje.style.display =
        "block";


    setTimeout(
        () => {

            mensaje.style.display =
                "none";

        },
        4000
    );

}


/*
==================================================
ESCAPAR HTML
==================================================
*/

function escapeHTML(
    texto
) {

    const div =
        document.createElement(
            "div"
        );


    div.textContent =
        texto ?? "";


    return div.innerHTML;

}


/*
==================================================
CERRAR SESIÓN
==================================================
*/

function cerrarSesion() {

    window.location.href =
        "../logout.php";

}
