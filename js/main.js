let productos = []; // Lo iniciamos vacio

// lee archivo productos.json
function pedirProductos() {
  return new Promise((resolve, reject) => {
    setTimeout(async () => {
      try {
        const respuesta = await fetch("./productos.json");
        const data = await respuesta.json();
        resolve(data); // Resuelve los datos leídos del JSON
      } catch (error) {
        reject(error);
      }
    }, 3000);
  });
}

// Mensaje promocional con setTimeout()
function mostrarMensajePromo() {
  setTimeout(() => {
    const contenedorPromo = document.getElementById("mensaje-promo");
    if (contenedorPromo) {
      contenedorPromo.textContent = "Felicitaciones! Tenes un 10% de descuento con el cupón BIENVENIDA!";
      contenedorPromo.style.display = "block";
    }
  }, 6000);
}


async function iniciarProductos() {
  const spinner = document.getElementById("loader");

  try {
    if (spinner) spinner.style.display = "block";

    //Esperamos a que la promesa resuelva los productos del JSON tras los 3s
    productos = await pedirProductos();

    //Renderizamos los productos obtenidos
    imprimirProductosEnHTML(productos);

  } catch (error) {
    console.error("Error al cargar los productos:", error);
    const contenedorProductos = document.getElementById("productos");
    if (contenedorProductos) {
      contenedorProductos.innerHTML = "<p>Hubo un problema al cargar los productos.</p>";
    }
  } finally {
    //Se oculta el spinner pase lo que pase
    if (spinner) spinner.style.display = "none";
  }

  //Imprimimos el carrito (que ya tiene los datos de localStorage)
  imprimirCarrito(carrito);
}

//Inicializamos carrito con localStorage. En lugar de arrancar con un array vacio chequea si hay algo guardado.
const carrito = JSON.parse(localStorage.getItem("carrito")) ?? []; //JSON.parse() convierte el texto de vuelta a objeto/array para poder usarlo en el codigo

function imprimirProductosEnHTML(listaProductos) {
  const contenedorProductos = document.getElementById("productos");
  contenedorProductos.innerHTML = ""; //vacia container antes para que no se dupliquen productos

  for (const producto of listaProductos) {
    const { id, nombre, descripcion, precio, imagen } = producto;

    const card = document.createElement("article");
    card.className = "card";
    card.innerHTML = `
      <img src="${imagen}" alt="${nombre}" class="card-img-top">
      <h3>${nombre}</h3>
      <p>${descripcion}</p>
      <p class="precio">$${precio}</p>
      <button class="card-boton" id="boton-agregar-${id}">Agregar al carrito</button>
    `;

    contenedorProductos.append(card);

    // Buscamos el botón usando el mismo ID que definimos arriba
    const cardButton = document.getElementById(`boton-agregar-${id}`); //agregamos el evento para el boton de la tarjeta
    cardButton.addEventListener("click", () => {
      carrito.push(producto);
      localStorage.setItem("carrito", JSON.stringify(carrito)); //JSON.stringify() convierte objeto/array a texto para poder guardarlo en storage
      imprimirCarrito(carrito);
    });
  }
}

//Imprimimos carrito

function imprimirCarrito(array) {
  const contenedorCarrito = document.getElementById("carrito")
  contenedorCarrito.innerHTML = "";

  array.length === 0 ? (contenedorCarrito.innerHTML = "<p>No hay nada en el carrito.</p>")

  : array.forEach(({ nombre, precio }) => {
        const div = document.createElement("div");
        div.innerHTML = `
          <p>${nombre}</p>
          <p>$${precio}</p>
        `;
        contenedorCarrito.append(div);
      });

}

//agregamos evento submit

const formularioAgregarProducto = document.getElementById("form-agregar-producto");
formularioAgregarProducto.addEventListener("submit", (event) => { //siempre recibe por parametro un elemento aunque este vacio () pero hay que nombrarlo para trabajar con el
  event.preventDefault(); // previene refresque de la pantalla que es un comportamiento por defecto

  const nombre = document.getElementById("input-nombre").value; //agregamos .value para obtener lo ingresado en los input
  const precio = parseFloat(document.getElementById("input-precio").value);
  const imagen = document.getElementById("input-imagen").value;
  const descripcion = document.getElementById("input-descripcion").value;

  //agregamos el nuevo producto

  const productoNuevo = {
    id: productos.length + 1,
    nombre: nombre,
    descripcion: descripcion,
    precio: precio,
    imagen: imagen || "./img/default.jpg", //utilizo operador OR, si el administrador no sube una imagen del producto, entonces carga default.jpg que es la imagen por defecto
  };

  productos.push(productoNuevo);

  //volvemos a mostrar tarjetas con tarjeta agregada en el DOM

  imprimirProductosEnHTML(productos);

  formularioAgregarProducto.reset();

});

const inputBusqueda = document.getElementById("input-busqueda");
inputBusqueda.addEventListener("input", (event) => {

  const busqueda = event.target.value.toLowerCase() //lo que ingreso el usuario en el input de busqueda

  const productosFiltrados = productos.filter((producto) => producto.nombre.toLowerCase().includes(busqueda)
);

  imprimirProductosEnHTML(productosFiltrados)
});



iniciarProductos();
mostrarMensajePromo();



