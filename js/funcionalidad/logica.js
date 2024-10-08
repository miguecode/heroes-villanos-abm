import { personas as personasImportadas } from "./personas.js";
import { Persona } from "../clases/persona.js"
import { Heroe } from "../clases/heroe.js"
import { Villano } from "../clases/villano.js"
import { actualizarTabla } from "./tabla.js";
import { validarEntidad } from "./validaciones.js";

const personas = personasImportadas || [];
console.log(personas);

const $divTablaContenedor = document.getElementById("tabla-contenedor");
const $selectFiltro = document.getElementById("filtro");

let heroes = personas.map(p => "alterEgo" in p ? new Heroe(p["id"], p["nombre"], p["apellido"],
    p["edad"], p["alterEgo"], p["ciudad"], p["publicado"]): null).filter(h => h !== null);

let villanos = personas.map(p => "enemigo" in p ? new Villano(p["id"], p["nombre"], p["apellido"],
    p["edad"], p["enemigo"], p["robos"], p["asesinatos"]): null).filter(v => v !== null);

/////   ESTABLECER FILTRO (SELECT)   /////////////////////////////////////////////////////////////////
$selectFiltro.addEventListener("change", () => {
    const filtro = $selectFiltro.value;

    console.log(`Seleccionaste: ${filtro}`);

    actualizarTablaFiltrada($divTablaContenedor, filtro, getColumnasOcultas());
});


/////   OCULTAR COLUMNAS (CHECKBOX)   /////////////////////////////////////////////////////////////////
const $listaDeCheckboxs = document.querySelectorAll(".chkColumna");
const $contenedorCheckbox = document.getElementById("contenedor-checkbox");

$contenedorCheckbox.addEventListener("change", () => {    
    actualizarTablaFiltrada($divTablaContenedor, $selectFiltro.value, getColumnasOcultas());
});

function getColumnasOcultas() {
    let columnasOcultas = [];
    
    Array.from($listaDeCheckboxs).forEach(checkbox => {
        if (!checkbox.checked) {
            let columna = checkbox.getAttribute("name");

            if (!columnasOcultas.includes(columna))
                columnasOcultas.push(columna);
       }
    });

    console.log(columnasOcultas);
    return columnasOcultas;
}

/////   ACTUALIZAR TABLA  ///////////////////////////////////////////////////////////////////////////
function actualizarTablaFiltrada(contenedor, filtro, columnasOcultas,) {
    if (filtro === "Todos") actualizarTabla(contenedor, personas, filtro, columnasOcultas);
    if (filtro === "Heroes") actualizarTabla(contenedor, heroes, filtro, columnasOcultas);
    if (filtro === "Villanos") actualizarTabla(contenedor, villanos, filtro, columnasOcultas);
}

if (personas.length > 0) actualizarTablaFiltrada($divTablaContenedor, $selectFiltro.value, getColumnasOcultas());


/////   CALCULAR PROMEDIO   /////////////////////////////////////////////////////////////////////////
const $botonCalcular = document.getElementById("calcular");
const $promedio = document.getElementById("promedio");

$botonCalcular.addEventListener("click", () => {
    if (personas.length > 0) {
        let promedioValor = calcularEdadPromedio();
        $promedio.value = promedioValor.toFixed(2);
    }
});

function calcularEdadPromedio() {
    let edades = [];
    let cantidad = personas.length;
    
    if ($selectFiltro.value === "Todos") edades = personas.map(p => p["edad"]);
    
    if ($selectFiltro.value === "Heroes") {
        edades = heroes.map(p => p["edad"]);
        cantidad = heroes.length;
    } 
    
    if ($selectFiltro.value === "Villanos") {
        edades = villanos.map(p => p["edad"]);
        cantidad = villanos.length;
    }

    let total = edades.reduce((acumulador, edad) => acumulador + edad, 0);
    
    return total / cantidad;
}

/////   SWITCHEAR FORMULARIOS   ///////////////////////////////////////////////////////////////////////
const $seccionDatos = document.getElementById("seccion-datos");
const $seccionABM = document.getElementById("seccion-ABM");

$seccionDatos.style.setProperty("display", "flex");
$seccionABM.style.setProperty("display", "none");

const $formABM = document.getElementById("form-ABM");
const $botonABM = document.getElementById("botonABM");
const $botonCancelar = document.getElementById("botonCancelar");

const $selectTipo = document.getElementById("tipo");
$selectTipo.setAttribute("disabled", "false");

const $inputId = document.getElementById("id");
const $labelId = document.getElementById("idLabel");

const $inputBaja = document.getElementById("inputBaja");
const $inputSubmit = document.getElementById("inputSubmit");

$botonABM.addEventListener("click", () => {
    intercambiarFormularios(); //Cuando abro el form ABM, oculto el de datos

    $formABM.reset(); //Vacío todas las inputs (incluye al select)
    intercambiarInputs(); //Pongo las inputs que corresponden en base al select

    $inputSubmit.value = "Agregar"; //El input submit se llama Agregar
    $inputBaja.setAttribute("type", "hidden"); //Oculto el boton de baja

    $inputId.style.setProperty("display", "none"); //Oculto el input ID
    $labelId.style.setProperty("display", "none"); //Oculto el label ID

    $selectTipo.removeAttribute("disabled"); //Hago que el select se pueda usar
});

$botonCancelar.addEventListener("click", () => {
    intercambiarFormularios(); //Si cancelo, vuelvo al otro formulario
});

function intercambiarFormularios() {
    if ($seccionABM.style.getPropertyValue("display") === "none") {
        $seccionABM.style.setProperty("display", "flex");
        $seccionDatos.style.setProperty("display", "none");
    } else {
        $seccionABM.style.setProperty("display", "none");
        $seccionDatos.style.setProperty("display", "flex");
    }
}

/////   SWITCHEAR INPUTS EN ABM   //////////////////////////////////////////////////////////////////
const $inputsHeroe = document.getElementById("inputHeroes");
const $inputsVillano = document.getElementById("inputVillanos");

$selectTipo.addEventListener("change", () => {
    intercambiarInputs();
});

function intercambiarInputs() {
    if ($selectTipo.value === "Heroes") {
        $inputsVillano.style.setProperty("display", "none");
        $inputsHeroe.style.setProperty("display", "block");

        document.querySelectorAll("#inputHeroes input").forEach((input) => {
            input.setAttribute("required", "true");
        });
        document.querySelectorAll("#inputVillanos input").forEach((input) => {
            input.removeAttribute("required");
        });
    } else {
        $inputsHeroe.style.setProperty("display", "none");
        $inputsVillano.style.setProperty("display", "block");

        document.querySelectorAll("#inputVillanos input").forEach((input) => {
            input.setAttribute("required", "true");
        });
        document.querySelectorAll("#inputHeroes input").forEach((input) => {
            input.removeAttribute("required");
        });
    }
}


/////   ABM DOBLE CLICK (MODIFICAR)   //////////////////////////////////////////////////////////////////
const { txtId, txtNombre, txtApellido, numEdad,
     txtAlterEgo, txtCiudad, numPublicado, txtEnemigo, numRobos, numAsesinatos} = $formABM;

window.addEventListener("dblclick", (e) => {
    if (e.target.matches("td")) {
        console.log("Hiciste doble click en un td.");
        const id = e.target.parentElement.getAttribute("data-id");
        console.log(id);

        const personaSeleccionada = personas.find((p) => p.id == id);

        console.log(personaSeleccionada);
        cargarFormABM(personaSeleccionada);
        intercambiarFormularios();

        $inputBaja.setAttribute("type", "button");
        $inputSubmit.value = "Modificar";
    }
});

function cargarFormABM(persona) {
    console.log(persona);
    
    //Cargo todos los valores con la entidad recibida
    txtId.value = persona.id;
    txtNombre.value = persona.nombre;
    txtApellido.value = persona.apellido;
    numEdad.value = persona.edad;

    $selectTipo.setAttribute("disabled", "true"); //Que no se pueda cambiar tipo

    $labelId.style.setProperty("display", "block"); //Que se muestre el ID
    $inputId.style.setProperty("display", "block"); //Que el ID no se pueda modificar

    if ("alterEgo" in persona) {
        txtAlterEgo.value = persona.alterEgo;
        txtCiudad.value = persona.ciudad;
        numPublicado.value = persona.publicado;
        $selectTipo.value = "Heroes"; //Pongo el filtro en 'Heroes'

        $inputsVillano.style.setProperty("display", "none"); //Oculto las input 'Villano'
        $inputsHeroe.style.setProperty("display", "block"); //Muestro las input 'Heroe'
    } else {
        txtEnemigo.value = persona.enemigo;
        numRobos.value = persona.robos;
        numAsesinatos.value = persona.asesinatos;
        $selectTipo.value = "Villanos"; //Pongo el filtro en 'Villanos'

        $inputsHeroe.style.setProperty("display", "none"); //Oculto las input 'Heroe'
        $inputsVillano.style.setProperty("display", "block"); //Muestro las input 'Villano'
    }
}



/////   BOTÓN SUBMIT (ALTA O MODIFICACIÓN)   ///////////////////////////////////////////////////////////
$formABM.addEventListener("submit", (e) => {
    e.preventDefault();
    console.log("Enviando...");

/////   VALIDACIÓN (TRY-CATCH)   ///////////////////////////////////////////////////////////////////////
    try {
        validarEntidad(txtNombre.value, txtApellido.value, parseInt(numEdad.value),
            txtAlterEgo.value, txtCiudad.value, parseInt(numPublicado.value),
            txtEnemigo.value, parseInt(numRobos.value), parseInt(numAsesinatos.value), $selectTipo.value)

        if (txtId.value === "") { //Si no hay valor de ID, es una persona nueva (ALTA)
            console.log("persona nueva");
    
            if ($selectTipo.value === "Heroes") {
                const heroeNuevo = new Heroe(
                    Date.now(),
                    txtNombre.value,
                    txtApellido.value,
                    parseInt(numEdad.value),
                    txtAlterEgo.value,
                    txtCiudad.value,
                    parseInt(numPublicado.value)
                )
    
                heroes.push(heroeNuevo);
                personas.push(heroeNuevo);
            } else {
                const villanoNuevo = new Villano(
                    Date.now(),
                    txtNombre.value,
                    txtApellido.value,
                    parseInt(numEdad.value),
                    txtEnemigo.value,
                    parseInt(numRobos.value),
                    parseInt(numAsesinatos.value)
                )
    
                villanos.push(villanoNuevo);
                personas.push(villanoNuevo);
            }
    
            actualizarTablaFiltrada($divTablaContenedor, $selectFiltro.value, getColumnasOcultas());
    
        } else { //Si hay valor de ID, es una modificación
    
            console.log("Persona existente");
    
            if ($selectTipo.value === "Heroes") {
                const heroeNuevo = new Heroe(
                    txtId.value,
                    txtNombre.value,
                    txtApellido.value,
                    parseInt(numEdad.value),
                    txtAlterEgo.value,
                    txtCiudad.value,
                    parseInt(numPublicado.value)
                )
    
                let index = personas.findIndex((p) => p.id == heroeNuevo.id);
                personas.splice(index, 1, heroeNuevo);
    
                index = heroes.findIndex((p) => p.id == heroeNuevo.id);
                heroes.splice(index, 1, heroeNuevo);
            } else {
                const villanoNuevo = new Villano(
                    txtId.value,
                    txtNombre.value,
                    txtApellido.value,
                    parseInt(numEdad.value),
                    txtEnemigo.value,
                    parseInt(numRobos.value),
                    parseInt(numAsesinatos.value)
                )
    
                let index = personas.findIndex((p) => p.id == villanoNuevo.id);
                personas.splice(index, 1, villanoNuevo);
    
                index = villanos.findIndex((p) => p.id == villanoNuevo.id);
                villanos.splice(index, 1, villanoNuevo);
            }
    
            actualizarTablaFiltrada($divTablaContenedor, $selectFiltro.value, getColumnasOcultas());
        }
        intercambiarFormularios();
    } catch (error) {
        alert(error.message);
    }
});

/////   ABM BOTÓN ELIMINAR   ///////////////////////////////////////////////////////////////////////
$inputBaja.addEventListener("click", () => {
    if (window.confirm("¿Seguro de eliminar a esta persona?")) {
        let id = txtId.value; //Tomo el ID escrita
        let index = personas.findIndex((p) => p.id == id); //Busco el índice en el array
        personas.splice(index, 1); //Elimino el elemento por su índice
        
        console.log("ID leída:");
        console.log(id);

        console.log("Personas:");
        console.log(personas);

        if ($selectTipo.value === "Heroes") { //Si era de este tipo, también lo elimino
            index = heroes.findIndex((p) => p.id == id);
            heroes.splice(index, 1);
            console.log("Entre aca porque el selecTipo es Heroes");
        } else { //Si era de este tipo, también lo elimino
            index = villanos.findIndex((p) => p.id == id);
            villanos.splice(index, 1);
            console.log("Entre aca porque el selecTipo es Villanos");
        }

        console.log("Heroes:");
        console.log(heroes);

        console.log("Villanos:");
        console.log(villanos);

        actualizarTablaFiltrada($divTablaContenedor, $selectFiltro.value, getColumnasOcultas());
        intercambiarFormularios();
    }
});


/////   ORDENAR COLUMNAS   ///////////////////////////////////////////////////////////////////////
let contenedorTabla = document.getElementById("tabla-contenedor");

contenedorTabla.addEventListener("click", e => {
    if (e.target.matches("th")) {
        let columna = e.target.textContent;
        console.log(e.target);

        document.querySelectorAll("th.columnaOrdenada").forEach(e => e.classList.remove("columnaOrdenada"));

        ordenarDatos("id"); //Necesito ordenarlo primero por ID para evitar el bug
        ordenarDatos(columna);
        actualizarTablaFiltrada($divTablaContenedor, $selectFiltro.value, getColumnasOcultas(), e.target);
    }
});

function ordenarDatos(columna) {
    switch (columna) {
        case "id":
        case "edad":
        case "publicado":
        case "robos":
        case "asesinatos":
            personas.sort((a, b) => {
                return a[columna] - b[columna];
            });
            heroes.sort((a, b) => {
                return a[columna] - b[columna];
            });
            villanos.sort((a, b) => {
                return a[columna] - b[columna];
            });
            break;
        case "nombre":
        case "apellido":
        case "alterEgo":
        case "ciudad":
        case "enemigo":
            personas.sort((a, b) => {
                if (a[columna] && b[columna])
                    return a[columna].localeCompare(b[columna]);
            });
            break;
        default:
            break;
    }

    heroes.splice(0, heroes.length);
    villanos.splice(0, villanos.length);

    heroes = personas.map(p => "alterEgo" in p ? new Heroe(p["id"], p["nombre"], p["apellido"],
    p["edad"], p["alterEgo"], p["ciudad"], p["publicado"]): null).filter(h => h !== null);

    villanos = personas.map(p => "enemigo" in p ? new Villano(p["id"], p["nombre"], p["apellido"],
    p["edad"], p["enemigo"], p["robos"], p["asesinatos"]): null).filter(v => v !== null);
};