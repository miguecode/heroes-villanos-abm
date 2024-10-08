export class Persona {
  constructor(id, nombre, apellido, edad) {
    this.id = id;
    this.nombre = nombre;
    this.apellido = apellido;
    this.edad = edad;
  }

  toString() {
    let cadena = "";

    if (
      this.id !== null &&
      this.nombre !== null &&
      this.apellido !== null &&
      this.edad !== null
    ) {
      cadena = `ID: ${this.id} - NOMBRE: ${this.nombre}
            - APELLIDO: ${this.apellido} - EDAD: ${this.edad}`;
    }

    return cadena;
  }

  toJson() {
    return JSON.stringify(this);
  }
}
