import { Persona } from "./persona.js";

export class Heroe extends Persona {
  constructor(id, nombre, apellido, edad, alterEgo, ciudad, publicado) {
    super(id, nombre, apellido, edad);
    this.alterEgo = alterEgo;
    this.ciudad = ciudad;
    this.publicado = publicado;
  }

  toString() {
    let cadena = "";

    if (
      this.alterEgo !== null &&
      this.ciudad !== null &&
      this.publicado !== null
    ) {
      cadena = `ID: ${this.id} - NOMBRE: ${this.nombre}
            - APELLIDO: ${this.apellido} - EDAD: ${this.edad}
            - ALTER EGO: ${this.alterEgo} - CIUDAD: ${this.ciudad} - PUBLICADO: ${this.publicado}`;
    }

    return cadena;
  }

  toJson() {
    return JSON.stringify(this);
  }
}
