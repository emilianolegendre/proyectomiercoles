<?php

session_start();

require_once "config/database.php";


if ($_SERVER["REQUEST_METHOD"] !== "POST") {

    header("Location: login.html");

    exit;
}


$id_usuario = trim($_POST["id_usuario"] ?? "");
$password = $_POST["password"] ?? "";


if ($id_usuario === "" || $password === "") {

    die("Completá usuario y contraseña.");

}


try {

    $consulta = $conexion->prepare(
        "SELECT
            id_usuario,
            Nombre,
            Apellido,
            Rol,
            Password,
            Institucion
        FROM usuarios
        WHERE id_usuario = ?"
    );

    $consulta->execute([
        $id_usuario
    ]);

    $usuario = $consulta->fetch(PDO::FETCH_ASSOC);


    if (!$usuario) {

        die("Usuario o contraseña incorrectos.");

    }


    if (!password_verify($password, $usuario["Password"])) {

        die("Usuario o contraseña incorrectos.");

    }


    /*
    ==========================================
    LOGIN CORRECTO
    ==========================================
    */

    session_regenerate_id(true);


    $_SESSION["usuario"] = $usuario["id_usuario"];

    $_SESSION["nombre"] = $usuario["Nombre"];

    $_SESSION["apellido"] = $usuario["Apellido"];

    $_SESSION["rol"] = $usuario["Rol"];

    $_SESSION["institucion"] = $usuario["Institucion"];


    /*
    ==========================================
    POR AHORA
    ==========================================

    Después vamos a convertir index.html
    en index.php para protegerlo según el rol.

    */

    header("Location: index.php");

    exit;


} catch (PDOException $e) {

    die("Error al conectar con la base de datos.");

}