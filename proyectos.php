<?php

session_start();

require_once "config/database.php";

header(
    "Content-Type: application/json; charset=utf-8"
);


// =====================================================
// VERIFICAR SESIÓN
// =====================================================

if (
    !isset($_SESSION["usuario"]) ||
    !isset($_SESSION["rol"])
) {

    http_response_code(401);

    echo json_encode([
        "ok" => false,
        "mensaje" => "Tenés que iniciar sesión."
    ]);

    exit;
}


$usuario = $_SESSION["usuario"];

$rol = $_SESSION["rol"];


// =====================================================
// ACCIÓN
// =====================================================

$accion =
    $_GET["accion"] ?? "";



// =====================================================
// LISTAR PROYECTOS
// =====================================================

if ($accion === "listar") {

    try {

        $consulta =
            $conexion->query("
                SELECT
                    Id_proyecto,
                    Usuario,
                    Descripcion,
                    Titulo
                FROM proyectos
                ORDER BY Id_proyecto DESC
            ");


        $filas =
            $consulta->fetchAll(
                PDO::FETCH_ASSOC
            );


        $proyectos = [];


        foreach ($filas as $fila) {

            $proyectos[] = [

                "id" =>
                    $fila["Id_proyecto"],

                "usuario" =>
                    $fila["Usuario"],

                "nombre" =>
                    $fila["Titulo"],

                "descripcion" =>
                    $fila["Descripcion"] ?? "",

                "estado" =>
                    "Activo"

            ];

        }


        echo json_encode([

            "ok" => true,

            "proyectos" =>
                $proyectos

        ]);


        exit;


    } catch (PDOException $e) {

        http_response_code(500);

        echo json_encode([

            "ok" => false,

            "mensaje" =>
                "Error al obtener los proyectos."

        ]);

        exit;

    }

}



// =====================================================
// OBTENER UN PROYECTO
// =====================================================

if ($accion === "obtener") {

    $id =
        intval(
            $_GET["id"] ?? 0
        );


    if ($id <= 0) {

        http_response_code(400);

        echo json_encode([

            "ok" => false,

            "mensaje" =>
                "ID de proyecto inválido."

        ]);

        exit;

    }


    try {

        $consulta =
            $conexion->prepare("
                SELECT
                    Id_proyecto,
                    Usuario,
                    Descripcion,
                    Titulo
                FROM proyectos
                WHERE Id_proyecto = ?
            ");


        $consulta->execute([
            $id
        ]);


        $fila =
            $consulta->fetch(
                PDO::FETCH_ASSOC
            );


        if (!$fila) {

            http_response_code(404);

            echo json_encode([

                "ok" => false,

                "mensaje" =>
                    "Proyecto no encontrado."

            ]);

            exit;

        }


        $proyecto = [

            "id" =>
                $fila["Id_proyecto"],

            "usuario" =>
                $fila["Usuario"],

            "nombre" =>
                $fila["Titulo"],

            "descripcion" =>
                $fila["Descripcion"] ?? "",

            "estado" =>
                "Activo"

        ];


        echo json_encode([

            "ok" => true,

            "proyecto" =>
                $proyecto

        ]);


        exit;


    } catch (PDOException $e) {

        http_response_code(500);

        echo json_encode([

            "ok" => false,

            "mensaje" =>
                "Error al obtener el proyecto."

        ]);

        exit;

    }

}



// =====================================================
// OBTENER MEDICIONES
// =====================================================

if ($accion === "mediciones") {

    $idProyecto =
        intval(
            $_GET["id_proyecto"] ?? 0
        );


    if ($idProyecto <= 0) {

        http_response_code(400);

        echo json_encode([

            "ok" => false,

            "mensaje" =>
                "ID de proyecto inválido."

        ]);

        exit;

    }


    try {

        /*
         * IMPORTANTE:
         *
         * Acá estoy suponiendo que tu tabla
         * de temperaturas se llama "mediciones"
         * y que tiene estas columnas:
         *
         * Id_medicion
         * Id_proyecto
         * Fecha
         * Hora
         * MQ5
         * DHT11
         * DS18B20
         *
         * Si tus nombres son diferentes,
         * solamente hay que cambiarlos acá.
         */


        $consulta =
            $conexion->prepare("
                SELECT
                    Id_medicion,
                    Fecha,
                    Hora,
                    MQ5,
                    DHT11,
                    DS18B20
                FROM mediciones
                WHERE Id_proyecto = ?
                ORDER BY Fecha DESC, Hora DESC
            ");


        $consulta->execute([
            $idProyecto
        ]);


        $filas =
            $consulta->fetchAll(
                PDO::FETCH_ASSOC
            );


        $mediciones = [];


        foreach ($filas as $fila) {

            $mediciones[] = [

                "id" =>
                    $fila["Id_medicion"],

                "fecha" =>
                    $fila["Fecha"],

                "hora" =>
                    $fila["Hora"],

                "mq5" =>
                    $fila["MQ5"],

                "dht11" =>
                    $fila["DHT11"],

                "ds18b20" =>
                    $fila["DS18B20"]

            ];

        }


        echo json_encode([

            "ok" => true,

            "mediciones" =>
                $mediciones

        ]);


        exit;


    } catch (PDOException $e) {

        http_response_code(500);

        echo json_encode([

            "ok" => false,

            "mensaje" =>
                "Error al obtener las mediciones."

        ]);

        exit;

    }

}



// =====================================================
// CREAR PROYECTO
// =====================================================

if ($accion === "crear") {


    // -------------------------------------------------
    // PERMISOS
    // -------------------------------------------------

    if (
        $rol !== "docente" &&
        $rol !== "administrador"
    ) {

        http_response_code(403);

        echo json_encode([

            "ok" => false,

            "mensaje" =>
                "Solo un profesor o administrador puede crear proyectos."

        ]);

        exit;

    }


    // -------------------------------------------------
    // MÉTODO
    // -------------------------------------------------

    if (
        $_SERVER["REQUEST_METHOD"] !== "POST"
    ) {

        http_response_code(405);

        echo json_encode([

            "ok" => false,

            "mensaje" =>
                "Método no permitido."

        ]);

        exit;

    }


    // -------------------------------------------------
    // DATOS
    // -------------------------------------------------

    $datos =
        json_decode(
            file_get_contents(
                "php://input"
            ),
            true
        );


    if (!is_array($datos)) {

        http_response_code(400);

        echo json_encode([

            "ok" => false,

            "mensaje" =>
                "Los datos enviados no son válidos."

        ]);

        exit;

    }


    $nombre =
        trim(
            $datos["nombre"] ?? ""
        );


    $descripcion =
        trim(
            $datos["descripcion"] ?? ""
        );



    // -------------------------------------------------
    // VALIDAR
    // -------------------------------------------------

    if ($nombre === "") {

        http_response_code(400);

        echo json_encode([

            "ok" => false,

            "mensaje" =>
                "El título del proyecto es obligatorio."

        ]);

        exit;

    }



    // -------------------------------------------------
    // GUARDAR
    // -------------------------------------------------

    try {

        $consulta =
            $conexion->prepare("
                INSERT INTO proyectos
                (
                    Usuario,
                    Descripcion,
                    Titulo
                )
                VALUES
                (?, ?, ?)
            ");


        $consulta->execute([

            $usuario,

            $descripcion,

            $nombre

        ]);


        $idProyecto =
            $conexion->lastInsertId();


        echo json_encode([

            "ok" => true,

            "mensaje" =>
                "Proyecto creado correctamente.",

            "id" =>
                $idProyecto

        ]);


        exit;


    } catch (PDOException $e) {

        http_response_code(500);

        echo json_encode([

            "ok" => false,

            "mensaje" =>
                "No se pudo guardar el proyecto."

        ]);

        exit;

    }

}



// =====================================================
// ACCIÓN DESCONOCIDA
// =====================================================

http_response_code(400);

echo json_encode([

    "ok" => false,

    "mensaje" =>
        "Acción desconocida."

]);