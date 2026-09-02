<?php

require_once "config/database.php";


if ($_SERVER["REQUEST_METHOD"] !== "POST") {

    header("Location: registro.html");

    exit;
}


$id_usuario = trim($_POST["id_usuario"] ?? "");
$nombre = trim($_POST["nombre"] ?? "");
$apellido = trim($_POST["apellido"] ?? "");
$password = $_POST["password"] ?? "";
$institucion = trim($_POST["institucion"] ?? "");


if (
    $id_usuario === "" ||
    $nombre === "" ||
    $apellido === "" ||
    $password === ""
) {

    die("Completá todos los campos obligatorios.");

}


try {

    /*
    ==========================================
    COMPROBAR SI EL USUARIO YA EXISTE
    ==========================================
    */

    $consulta = $conexion->prepare(
        "SELECT id_usuario
        FROM usuarios
        WHERE id_usuario = ?"
    );

    $consulta->execute([
        $id_usuario
    ]);


    if ($consulta->fetch()) {

        die("Ese usuario ya existe.");

    }


    /*
    ==========================================
    ENCRIPTAR CONTRASEÑA
    ==========================================
    */

    $passwordHash = password_hash(
        $password,
        PASSWORD_DEFAULT
    );


    /*
    ==========================================
    CREAR USUARIO
    ==========================================

    MUY IMPORTANTE:

    Siempre se crea como estudiante.

    El usuario no puede registrarse
    directamente como administrador.
    */

    $insertar = $conexion->prepare(
        "INSERT INTO usuarios
        (
            id_usuario,
            Nombre,
            Apellido,
            Rol,
            Password,
            Institucion
        )
        VALUES
        (?, ?, ?, 'estudiante', ?, ?)"
    );


    $insertar->execute([
        $id_usuario,
        $nombre,
        $apellido,
        $passwordHash,
        $institucion
    ]);


    /*
    ==========================================
    REGISTRO CORRECTO
    ==========================================
    */

    header("Location: login.html");

    exit;


} catch (PDOException $e) {

    die("Error al crear la cuenta.");

}