const socket = io(); // Conectar al servidor de Socket.io

       // Función para agregar un producto a la tabla
    function agregarProductoALaTabla(producto) {
        const tablaProductos = document.querySelector("table tbody");

        // Crear una nueva fila de tabla para el producto
        const nuevaFila = document.createElement("tr");
        nuevaFila.innerHTML = `
            <td>${producto.id}</td>
            <td>${producto.title}</td>
            <td>${producto.description}</td>
            <td>$ ${producto.price}</td>
            <td>${producto.stock}</td>
            <td>${producto.code}</td>
            <td>${producto.thumbnail}</td>
            <td>${producto.category}</td>
            <td>${producto.status}</td>
        `;

        // Agregar la nueva fila a la tabla
        tablaProductos.appendChild(nuevaFila);
    }

    // Función para eliminar un producto de la tabla
    function eliminarProductoDeLaTabla(productId) {
        const filaAEliminar = document.querySelector(`table tbody tr[data-product-id="${productId}"]`);
        if (filaAEliminar) {
            filaAEliminar.remove();
        }
    }

    // Manejar el evento submit del formulario de eliminar
    const formularioEliminar = document.getElementById("formulario-eliminar");
    formularioEliminar.addEventListener("submit", (e) => {
        e.preventDefault();

        // Obtener los valores ingresados por el usuario
        const productId = document.getElementById("idProduct").value

        // Enviar el nuevo producto al servidor mediante Socket.io
        socket.emit("eliminarProducto", productId);

        // Limpiar los campos del formulario después de agregar el producto
        formularioEliminar.reset();

         // // Escuchar eventos de Socket.io y actualizar la lista de productos
        socket.on("productoEliminado", (productId) => {
        eliminarProductoDeLaTabla(productId);
        });
    })

    // Manejar el evento submit del formulario de agregar
    const formularioAgregar = document.getElementById("formulario-agregar");
    formularioAgregar.addEventListener("submit", (e) => {
        e.preventDefault();

        // Obtener los valores ingresados por el usuario
        const titulo = document.getElementById("titulo").value;
        const descripcion = document.getElementById("descripcion").value;
        const precio = parseFloat(document.getElementById("precio").value);
        const stock = parseInt(document.getElementById("stock").value);
        const codigo = document.getElementById("codigo").value;
        const category = document.getElementById("category").value;
        const status = document.getElementById("status").value;

        // Validar que los campos no estén vacíos
        if (!titulo || !descripcion || isNaN(precio) || isNaN(stock) || !codigo) {
            alert("Por favor, complete todos los campos.");
            return;
        }

        // Crear un objeto que representa el nuevo producto
        const nuevoProducto = {
            title: titulo,
            description: descripcion,
            price: precio,
            stock: stock,
            code: codigo,
            category: category,
            status: status
        };

        // Enviar el nuevo producto al servidor mediante Socket.io
        socket.emit("agregarProducto", nuevoProducto);

        // Limpiar los campos del formulario después de agregar el producto
        formularioAgregar.reset();

         // // Escuchar eventos de Socket.io y actualizar la lista de productos
        socket.on("productoAgregado", (producto) => {
        agregarProductoALaTabla(producto);
        });


    });