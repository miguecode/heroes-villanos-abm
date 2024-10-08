function validarCadena(cadena, longitudMaxima) {
  let validacion = false;

  if (typeof cadena === "string") {
    cadena = cadena.trim();

    const regex = /^[A-Za-záéíóúüñÁÉÍÓÚÜÑ\s'.-]+$/;

    validacion =
      cadena.length > 1 &&
      cadena.length <= longitudMaxima &&
      regex.test(cadena);
  }

  return validacion;
}

function validarNumero(valor, valorMinimo, valorMaximo) {
  return (
    typeof valor === "number" && valor >= valorMinimo && valor <= valorMaximo
  );
}

export function validarEntidad(v1, v2, v3, v4, v5, v6, v7, v8, v9, tipo) {
  const errores = [];

  // v1 es Nombre
  if (!validarCadena(v1, 20)) errores.push("Nombre");

  // v2 es Apellido
  if (!validarCadena(v2, 20)) errores.push("Apellido");

  // v3 es Edad
  if (!validarNumero(v3, 18, 200)) errores.push("Edad");

  if (tipo === "Heroes") {
    // v4 es Alter Ego
    if (!validarCadena(v4, 20)) errores.push("Alter Ego");

    // v5 es Ciudad
    if (!validarCadena(v5, 15)) errores.push("Ciudad");

    // v6 es Publicado
    if (!validarNumero(v6, 1940, 3000)) errores.push("Publicado");
  } else {
    // v7 es Enemigo
    if (!validarCadena(v7, 20)) errores.push("Enemigo");

    // v8 es Robos
    if (!validarNumero(v8, 0, 99999)) errores.push("Robos");

    // v9 es Asesinatos
    if (!validarNumero(v9, 0, 99999)) errores.push("Asesinatos");
  }

  if (errores.length > 0) {
    const mensajeError = `Datos inválidos en: ${errores.join(", ")}`;
    throw new Error(mensajeError);
  }

  return true;
}
