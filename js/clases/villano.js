import { Persona } from "./persona.js";

export class Villano extends Persona {
  constructor(id, nombre, apellido, edad, enemigo, robos, asesinatos) {
    super(id, nombre, apellido, edad);

    this.enemigo = enemigo;
    this.robos = robos;
    this.asesinatos = asesinatos;
  }

  toString() {
    let cadena = "";

    if (
      this.enemigo !== null &&
      this.robos !== null &&
      this.asesinatos !== null
    ) {
      cadena = `ID: ${this.id} - NOMBRE: ${this.nombre}
            - APELLIDO: ${this.apellido} - EDAD: ${this.edad}
            - ENEMIGO: ${this.enemigo} - ROBOS: ${this.robos} - ASESINATOS: ${this.asesinatos}`;
    }

    return cadena;
  }

  toJson() {
    return JSON.stringify(this);
  }
}
