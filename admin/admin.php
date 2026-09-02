<?php

session_start();

require_once "../config/database.php";

header("Content-Type: application/json; charset=UTF-8");


/*
==================================================
SEGURIDAD
==================================================
*/

if (
    !isset($_SESSION["usuario"]) ||
    !isset($_SESSION["rol"]) ||
    $_SESSION["rol"] !== "administrador"
) {

    http_response_code(403);

    echo json_encode([
        "ok" => false,
        "mensaje" => "No tenés permisos de administrador."
    ]);

    exit;
}


/*
==================================================
ACCIÓN
==================================================
*/

$accion = $_GET["accion"] ?? "";


/*
==================================================
OBTENER USUARIOS
==================================================
*/

if ($accion === "usuarios") {

    try {

        $consulta = $conexion->query(
            "SELECT
                id_usuario,
                Nombre,
                Apellido,
                Rol,
                Institucion
             FROM usuarios
             ORDER BY Nombre ASC"
        );


        $usuarios = $consulta->fetchAll(
            PDO::FETCH_ASSOC
        );


        echo json_encode([
            "ok" => true,
            "usuarios" => $usuarios
        ]);

        exit;

    } catch (PDOException $e) {

        http_response_code(500);

        echo json_encode([
            "ok" => false,
            "mensaje" => "Error al obtener usuarios."
        ]);

        exit;
    }
}


/*
==================================================
CAMBIAR ROL
==================================================
*/

if ($accion === "cambiar_rol") {

    if ($_SERVER["REQUEST_METHOD"] !== "POST") {

        http_response_code(405);

        echo json_encode([
            "ok" => false,
            "mensaje" => "Método no permitido."
        ]);

        exit;
    }


    $datos = json_decode(
        file_get_contents("php://input"),
        true
    );


    $id_usuario = trim(
        $datos["id_usuario"] ?? ""
    );

    $rol = $datos["rol"] ?? "";


    $rolesPermitidos = [
        "estudiante",
        "docente",
        "invitado",
        "administrador"
    ];


    if (
        $id_usuario === "" ||
        !in_array($rol, $rolesPermitidos, true)
    ) {

        http_response_code(400);

        echo json_encode([
            "ok" => false,
            "mensaje" => "Rol inválido."
        ]);

        exit;
    }


    try {

        $consulta = $conexion->prepare(
            "UPDATE usuarios
             SET Rol = ?
             WHERE id_usuario = ?"
        );


        $consulta->execute([
            $rol,
            $id_usuario
        ]);


        echo json_encode([
            "ok" => true,
            "mensaje" => "Rol actualizado correctamente."
        ]);

        exit;

    } catch (PDOException $e) {

        http_response_code(500);

        echo json_encode([
            "ok" => false,
            "mensaje" => "No se pudo cambiar el rol."
        ]);

        exit;
    }
}


/*
==================================================
OBTENER PROYECTOS
==================================================
*/

if ($accion === "proyectos") {

    try {

        $consulta = $conexion->query(
            "SELECT
                Id_proyecto,
                Usuario,
                Titulo,
                Descripcion
             FROM proyectos
             ORDER BY Id_proyecto DESC"
        );


        $proyectos = $consulta->fetchAll(
            PDO::FETCH_ASSOC
        );


        echo json_encode([
            "ok" => true,
            "proyectos" => $proyectos
        ]);

        exit;

    } catch (PDOException $e) {

        http_response_code(500);

        echo json_encode([
            "ok" => false,
            "mensaje" => "Error al obtener proyectos."
        ]);

        exit;
    }
}


/*
==================================================
EDITAR PROYECTO
==================================================
*/

if ($accion === "editar_proyecto") {

    if ($_SERVER["REQUEST_METHOD"] !== "POST") {

        http_response_code(405);

        echo json_encode([
            "ok" => false,
            "mensaje" => "Método no permitido."
        ]);

        exit;
    }


    $datos = json_decode(
        file_get_contents("php://input"),
        true
    );


    $id = intval(
        $datos["id_proyecto"] ?? 0
    );

    $titulo = trim(
        $datos["titulo"] ?? ""
    );

    $descripcion = trim(
        $datos["descripcion"] ?? ""
    );

    $usuario = trim(
        $datos["usuario"] ?? ""
    );


    if (
        $id <= 0 ||
        $titulo === "" ||
        $usuario === ""
    ) {

        http_response_code(400);

        echo json_encode([
            "ok" => false,
            "mensaje" => "Completá los datos del proyecto."
        ]);

        exit;
    }


    try {

        $consulta = $conexion->prepare(
            "UPDATE proyectos
             SET
                Titulo = ?,
                Descripcion = ?,
                Usuario = ?
             WHERE Id_proyecto = ?"
        );


        $consulta->execute([
            $titulo,
            $descripcion,
            $usuario,
            $id
        ]);


        echo json_encode([
            "ok" => true,
            "mensaje" => "Proyecto actualizado correctamente."
        ]);

        exit;

    } catch (PDOException $e) {

        http_response_code(500);

        echo json_encode([
            "ok" => false,
            "mensaje" => "No se pudo editar el proyecto."
        ]);

        exit;
    }
}


/*
==================================================
BORRAR PROYECTO
==================================================
*/

if ($accion === "borrar_proyecto") {

    if ($_SERVER["REQUEST_METHOD"] !== "POST") {

        http_response_code(405);

        echo json_encode([
            "ok" => false,
            "mensaje" => "Método no permitido."
        ]);

        exit;
    }


    $datos = json_decode(
        file_get_contents("php://input"),
        true
    );


    $id = intval(
        $datos["id_proyecto"] ?? 0
    );


    if ($id <= 0) {

        http_response_code(400);

        echo json_encode([
            "ok" => false,
            "mensaje" => "Proyecto inválido."
        ]);

        exit;
    }


    try {

        $consulta = $conexion->prepare(
            "DELETE FROM proyectos
             WHERE Id_proyecto = ?"
        );


        $consulta->execute([
            $id
        ]);


        echo json_encode([
            "ok" => true,
            "mensaje" => "Proyecto eliminado correctamente."
        ]);

        exit;

    } catch (PDOException $e) {

        http_response_code(500);

        echo json_encode([
            "ok" => false,
            "mensaje" => "No se pudo eliminar el proyecto."
        ]);

        exit;
    }
}


/*
==================================================
ACCIÓN DESCONOCIDA
==================================================
*/

http_response_code(400);

echo json_encode([
    "ok" => false,
    "mensaje" => "Acción desconocida."
]);
