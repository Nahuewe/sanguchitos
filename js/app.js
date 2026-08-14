const estado = {
    comensales: {},
    ordenComensales: [],
    comensalActivo: null,
    categoriaActiva: 'clasicos',
    sandwichSeleccionado: null,
    panSeleccionado: null,
    extrasSeleccionados: new Set(),
    envio: 0,
    tipoEnvioWhatsapp: 'pedido'
};

let contadorItem = 0;

function generarIdItem() {
    contadorItem += 1;
    return `item-${Date.now()}-${contadorItem}`;
}

function formatearPrecio(numero) {
    return '$' + numero.toLocaleString('es-AR');
}

function categoriaActual() {
    return CATEGORIAS[estado.categoriaActiva];
}

function costoPan(pan) {
    const incluido = categoriaActual().panesIncluidos.includes(pan);
    return incluido ? 0 : PANES_PRECIO[pan];
}

function calcularSubtotalUnidad() {
    if (!estado.sandwichSeleccionado || !estado.panSeleccionado) return 0;
    let total = estado.sandwichSeleccionado.precio + costoPan(estado.panSeleccionado);
    estado.extrasSeleccionados.forEach(nombreExtra => {
        total += precioDeExtra(nombreExtra);
    });
    return total;
}

function precioDeExtra(nombreExtra) {
    if (EXTRAS.especiales.opciones.includes(nombreExtra)) return EXTRAS.especiales.precio;
    if (EXTRAS.simples.opciones.includes(nombreExtra)) return EXTRAS.simples.precio;
    return 0;
}

function calcularSubtotalItem(item) {
    let total = item.precioSandwich + item.precioPan;
    item.extras.forEach(extra => { total += extra.precio; });
    return total * item.cantidad;
}

function calcularSubtotalComensal(nombre) {
    const items = estado.comensales[nombre] || [];
    return items.reduce((acumulado, item) => acumulado + calcularSubtotalItem(item), 0);
}

function calcularSubtotalSanguches() {
    return estado.ordenComensales.reduce((acumulado, nombre) => acumulado + calcularSubtotalComensal(nombre), 0);
}

function calcularTotalGeneral() {
    return calcularSubtotalSanguches() + estado.envio;
}

function renderCategorias() {
    const contenedor = document.getElementById('tabsCategorias');
    contenedor.innerHTML = '';
    Object.keys(CATEGORIAS).forEach(clave => {
        const boton = document.createElement('button');
        boton.type = 'button';
        boton.className = 'pestana-categoria' + (clave === estado.categoriaActiva ? ' pestana-categoria--activa' : '');
        boton.textContent = CATEGORIAS[clave].etiqueta;
        boton.addEventListener('click', () => seleccionarCategoria(clave));
        contenedor.appendChild(boton);
    });
}

function seleccionarCategoria(clave) {
    estado.categoriaActiva = clave;
    estado.sandwichSeleccionado = null;
    estado.panSeleccionado = null;
    estado.extrasSeleccionados.clear();
    renderCategorias();
    renderSanguches();
    renderPanes();
    renderExtras();
    actualizarResumenActual();
}

function renderSanguches() {
    const lista = document.getElementById('listaSanguches');
    lista.innerHTML = '';
    categoriaActual().sanguches.forEach(sandwich => {
        const fila = document.createElement('button');
        fila.type = 'button';
        const activo = estado.sandwichSeleccionado && estado.sandwichSeleccionado.id === sandwich.id;
        fila.className = 'fila-sandwich' + (activo ? ' fila-sandwich--activa' : '');
        fila.innerHTML = `
            <span class="fila-sandwich__estrella">★</span>
            <span class="fila-sandwich__texto">
                <span class="fila-sandwich__nombre">${sandwich.nombre}</span>
                <span class="fila-sandwich__descripcion">${sandwich.descripcion}</span>
            </span>
            <span class="fila-sandwich__precio">${formatearPrecio(sandwich.precio)}</span>
        `;
        fila.addEventListener('click', () => seleccionarSandwich(sandwich));
        lista.appendChild(fila);
    });
}

function seleccionarSandwich(sandwich) {
    estado.sandwichSeleccionado = sandwich;
    estado.panSeleccionado = null;
    renderSanguches();
    renderPanes();
    actualizarResumenActual();
}

function renderPanes() {
    const grilla = document.getElementById('panesGrid');
    grilla.innerHTML = '';
    if (!estado.sandwichSeleccionado) {
        grilla.innerHTML = '<p class="aviso-paso">Elegí primero un sánguche.</p>';
        return;
    }
    TODOS_LOS_PANES.forEach(pan => {
        const costo = costoPan(pan);
        const chip = document.createElement('button');
        chip.type = 'button';
        const activo = estado.panSeleccionado === pan;
        chip.className = 'chip-pan' + (activo ? ' chip-pan--activo' : '') + (costo > 0 ? ' chip-pan--premium' : '');
        chip.innerHTML = `<span>${pan}</span>${costo > 0 ? `<span class="chip-pan__adicional">+${formatearPrecio(costo)}</span>` : ''}`;
        chip.addEventListener('click', () => seleccionarPan(pan));
        grilla.appendChild(chip);
    });
}

function seleccionarPan(pan) {
    estado.panSeleccionado = pan;
    renderPanes();
    actualizarResumenActual();
}

function renderExtras() {
    renderGrupoExtras('extrasEspeciales', EXTRAS.especiales);
    renderGrupoExtras('extrasSimples', EXTRAS.simples);
}

function renderGrupoExtras(idContenedor, grupo) {
    const contenedor = document.getElementById(idContenedor);
    contenedor.innerHTML = '';
    grupo.opciones.forEach(opcion => {
        const activo = estado.extrasSeleccionados.has(opcion);
        const chip = document.createElement('button');
        chip.type = 'button';
        chip.className = 'chip-extra' + (activo ? ' chip-extra--activo' : '');
        chip.innerHTML = `<span>${opcion}</span><span class="chip-extra__precio">+${formatearPrecio(grupo.precio)}</span>`;
        chip.addEventListener('click', () => toggleExtra(opcion));
        contenedor.appendChild(chip);
    });
}

function toggleExtra(opcion) {
    if (estado.extrasSeleccionados.has(opcion)) {
        estado.extrasSeleccionados.delete(opcion);
    } else {
        estado.extrasSeleccionados.add(opcion);
    }
    renderExtras();
    actualizarResumenActual();
}

function actualizarResumenActual() {
    const cantidadInput = document.getElementById('inputCantidad');
    const cantidad = Math.max(1, parseInt(cantidadInput.value, 10) || 1);
    const subtotalUnidad = calcularSubtotalUnidad();
    const resumen = document.getElementById('resumenActual');
    const boton = document.getElementById('btnAgregarItem');

    if (!estado.sandwichSeleccionado || !estado.panSeleccionado) {
        resumen.textContent = 'Elegí un sánguche y un pan para ver el precio.';
        boton.disabled = true;
        return;
    }

    resumen.textContent = `${cantidad} × ${estado.sandwichSeleccionado.nombre} = ${formatearPrecio(subtotalUnidad * cantidad)}`;
    boton.disabled = !estado.comensalActivo;
}

function validarNombre(input) {
    input.value = input.value.replace(/[^A-Za-zÀ-ÿ\s]/g, '');
}

function agregarComensal() {
    const input = document.getElementById('inputComensal');
    const nombre = input.value.trim();
    if (!nombre) {
        mostrarToast('Escribí el nombre del comensal', 'error');
        return;
    }
    if (!estado.comensales[nombre]) {
        estado.comensales[nombre] = [];
        estado.ordenComensales.push(nombre);
    }
    estado.comensalActivo = nombre;
    input.value = '';
    renderComensales();
    renderComanda();
    actualizarResumenActual();
}

function seleccionarComensal(nombre) {
    estado.comensalActivo = nombre;
    renderComensales();
    actualizarResumenActual();
}

function renderComensales() {
    const contenedor = document.getElementById('listaComensales');
    contenedor.innerHTML = '';
    if (estado.ordenComensales.length === 0) {
        contenedor.innerHTML = '<p class="aviso-paso">Todavía no sumaste a nadie al mostrador.</p>';
        return;
    }
    estado.ordenComensales.forEach(nombre => {
        const chip = document.createElement('div');
        const activo = estado.comensalActivo === nombre;
        chip.className = 'chip-comensal' + (activo ? ' chip-comensal--activo' : '');
        const cantidadItems = (estado.comensales[nombre] || []).length;
        chip.innerHTML = `
            <button type="button" class="chip-comensal__nombre">
                <span>${nombre}</span>${cantidadItems > 0 ? `<span class="chip-comensal__contador">${cantidadItems}</span>` : ''}
            </button>
            <button type="button" class="chip-comensal__borrar" title="Eliminar comensal">×</button>
        `;
        chip.querySelector('.chip-comensal__nombre').addEventListener('click', () => seleccionarComensal(nombre));
        chip.querySelector('.chip-comensal__borrar').addEventListener('click', (e) => {
            e.stopPropagation();
            confirmarEliminarComensal(nombre);
        });
        contenedor.appendChild(chip);
    });
}

function agregarItemALaComanda() {
    if (!estado.comensalActivo) {
        mostrarToast('Elegí o sumá un comensal primero', 'error');
        return;
    }
    if (!estado.sandwichSeleccionado || !estado.panSeleccionado) {
        mostrarToast('Faltan datos del sánguche', 'error');
        return;
    }

    const cantidadInput = document.getElementById('inputCantidad');
    const cantidad = Math.max(1, parseInt(cantidadInput.value, 10) || 1);

    const item = {
        id: generarIdItem(),
        nombreSandwich: estado.sandwichSeleccionado.nombre,
        precioSandwich: estado.sandwichSeleccionado.precio,
        pan: estado.panSeleccionado,
        precioPan: costoPan(estado.panSeleccionado),
        extras: Array.from(estado.extrasSeleccionados).map(nombre => ({ nombre, precio: precioDeExtra(nombre) })),
        cantidad
    };

    estado.comensales[estado.comensalActivo].push(item);

    estado.sandwichSeleccionado = null;
    estado.panSeleccionado = null;
    estado.extrasSeleccionados.clear();
    cantidadInput.value = 1;

    renderSanguches();
    renderPanes();
    renderExtras();
    renderComensales();
    renderComanda();
    actualizarResumenActual();
    mostrarToast(`Sumado a la comanda de ${estado.comensalActivo}`, 'ok');
}

function cambiarCantidadItem(nombre, itemId, delta) {
    const item = estado.comensales[nombre].find(i => i.id === itemId);
    if (!item) return;
    item.cantidad = Math.max(1, item.cantidad + delta);
    renderComanda();
    renderComensales();
}

function eliminarItem(nombre, itemId) {
    estado.comensales[nombre] = estado.comensales[nombre].filter(i => i.id !== itemId);
    renderComanda();
    renderComensales();
}

function confirmarEliminarComensal(nombre) {
    abrirModalConfirmacion(
        `¿${nombre} se arrepintió del pedido? Se va a borrar toda su comanda.`,
        () => {
            delete estado.comensales[nombre];
            estado.ordenComensales = estado.ordenComensales.filter(n => n !== nombre);
            if (estado.comensalActivo === nombre) estado.comensalActivo = null;
            renderComensales();
            renderComanda();
            actualizarResumenActual();
        }
    );
}

function renderComanda() {
    const contenedor = document.getElementById('comanda');
    contenedor.innerHTML = '';

    if (estado.ordenComensales.length === 0) {
        contenedor.innerHTML = `
            <div class="comanda-vacia">
                <p class="comanda-vacia__titulo">El mostrador está vacío</p>
                <p class="comanda-vacia__texto">Sumá al primer comensal en el paso 1 para empezar a tomar el pedido.</p>
            </div>
        `;
        actualizarTotales(0);
        return;
    }

    estado.ordenComensales.forEach(nombre => {
        const items = estado.comensales[nombre] || [];
        const ticket = document.createElement('article');
        ticket.className = 'ticket';

        const encabezado = document.createElement('div');
        encabezado.className = 'ticket__encabezado';
        encabezado.innerHTML = `
            <span class="ticket__nombre">${nombre}</span>
            <button type="button" class="ticket__borrar" title="Eliminar comensal">Sacar</button>
        `;
        encabezado.querySelector('.ticket__borrar').addEventListener('click', () => confirmarEliminarComensal(nombre));
        ticket.appendChild(encabezado);

        if (items.length === 0) {
            const vacio = document.createElement('p');
            vacio.className = 'ticket__vacio';
            vacio.textContent = 'Todavía no eligió nada. Armalo arriba.';
            ticket.appendChild(vacio);
        } else {
            items.forEach(item => {
                const linea = document.createElement('div');
                linea.className = 'ticket__linea';
                const extrasTexto = item.extras.length ? item.extras.map(e => e.nombre).join(', ') : '';
                linea.innerHTML = `
                    <div class="ticket__linea-info">
                        <span class="ticket__linea-nombre">${item.nombreSandwich}</span>
                        <span class="ticket__linea-detalle">Pan ${item.pan}${item.precioPan > 0 ? ` (+${formatearPrecio(item.precioPan)})` : ''}</span>
                        ${extrasTexto ? `<span class="ticket__linea-detalle">Extras: ${extrasTexto}</span>` : ''}
                    </div>
                    <div class="ticket__linea-controles">
                        <button type="button" class="ticket__cantidad-btn" data-accion="restar">−</button>
                        <span class="ticket__cantidad-valor">${item.cantidad}</span>
                        <button type="button" class="ticket__cantidad-btn" data-accion="sumar">+</button>
                    </div>
                    <div class="ticket__linea-precio">
                        ${formatearPrecio(calcularSubtotalItem(item))}
                        <button type="button" class="ticket__linea-quitar">✕</button>
                    </div>
                `;
                linea.querySelector('[data-accion="restar"]').addEventListener('click', () => cambiarCantidadItem(nombre, item.id, -1));
                linea.querySelector('[data-accion="sumar"]').addEventListener('click', () => cambiarCantidadItem(nombre, item.id, 1));
                linea.querySelector('.ticket__linea-quitar').addEventListener('click', () => eliminarItem(nombre, item.id));
                ticket.appendChild(linea);
            });
        }

        const pie = document.createElement('div');
        pie.className = 'ticket__pie';
        pie.innerHTML = `<span>Subtotal</span><span>${formatearPrecio(calcularSubtotalComensal(nombre))}</span>`;
        ticket.appendChild(pie);

        contenedor.appendChild(ticket);
    });

    actualizarTotales(calcularTotalGeneral());
}

function actualizarTotales(total) {
    document.getElementById('totalGeneral').textContent = formatearPrecio(total);
    document.getElementById('totalGeneral2').textContent = formatearPrecio(total);
    document.getElementById('totalGeneral3').textContent = formatearPrecio(total);
}

function hayPedidosCargados() {
    return estado.ordenComensales.some(nombre => (estado.comensales[nombre] || []).length > 0);
}

function consolidarItemsPedido() {
    const resumen = new Map();

    estado.ordenComensales.forEach(nombre => {
        (estado.comensales[nombre] || []).forEach(item => {
            const extrasTexto = item.extras.length ? item.extras.map(e => e.nombre).sort().join(', ') : '';
            const clave = `${item.nombreSandwich}|${item.pan}|${extrasTexto}`;
            if (!resumen.has(clave)) {
                resumen.set(clave, { nombreSandwich: item.nombreSandwich, pan: item.pan, extras: extrasTexto, cantidad: 0 });
            }
            resumen.get(clave).cantidad += item.cantidad;
        });
    });

    return Array.from(resumen.values());
}

function construirMensajePedido() {
    const lineas = consolidarItemsPedido();
    let mensaje = 'Buen día! Quisiéramos encargar lo siguiente:\n\n';

    lineas.forEach(linea => {
        mensaje += `${linea.cantidad}x ${linea.nombreSandwich} — pan ${linea.pan}\n`;
        if (linea.extras) mensaje += `   Extras: ${linea.extras}\n`;
    });

    mensaje += '\n¿A qué hora estaría listo? Muchas gracias!';
    return mensaje;
}

function construirMensajeConsulta() {
    return 'Buen día! ¿Qué sándwiches y panes tienen disponibles hoy?';
}

function construirMensajeDesglose() {
    const comensalesConItems = estado.ordenComensales.filter(nombre => (estado.comensales[nombre] || []).length > 0);
    const cantidadPersonas = comensalesConItems.length;
    const envioPorPersona = cantidadPersonas > 0 ? Math.round(estado.envio / cantidadPersonas) : 0;

    let mensaje = 'Desglose de pagos — sánguches de la oficina\n\n';

    comensalesConItems.forEach(nombre => {
        estado.comensales[nombre].forEach(item => {
            const precioItem = calcularSubtotalItem(item);
            const nombreLinea = item.cantidad > 1 ? `${item.nombreSandwich} x${item.cantidad}` : item.nombreSandwich;
            mensaje += `${nombre} - ${nombreLinea} ${formatearPrecio(precioItem)} - envío ${formatearPrecio(envioPorPersona)}\n`;
        });
    });

    mensaje += `\nTotal a cobrar entre todos: ${formatearPrecio(calcularTotalGeneral())}`;
    return mensaje;
}

function enviarWhatsapp(numero, mensaje) {
    const url = 'https://api.whatsapp.com/send?phone=' + numero + '&text=' + encodeURIComponent(mensaje);
    window.open(url, '_blank');
}

function renderSucursales() {
    const contenedor = document.getElementById('listaSucursales');
    contenedor.innerHTML = '';
    SUCURSALES.forEach((sucursal, indice) => {
        const opcion = document.createElement('label');
        opcion.className = 'opcion-sucursal';
        opcion.innerHTML = `
            <input type="radio" name="sucursal" value="${sucursal.numero}" ${indice === 0 ? 'checked' : ''}>
            <span>${sucursal.nombre}</span>
        `;
        contenedor.appendChild(opcion);
    });
}

const modalMenu = document.getElementById('modalMenu');
const btnVerMenu = document.getElementById('btnVerMenu');
const btnCerrarModalMenu = document.getElementById('btnCerrarModalMenu');
const btnCerrarModalMenu2 = document.getElementById('btnCerrarModalMenu2');

function abrirModalMenu() {
    modalMenu.classList.add('modal--visible');
    document.body.classList.add('modal-abierto');
}

function cerrarModalMenu() {
    modalMenu.classList.remove('modal--visible');
    document.body.classList.remove('modal-abierto');
}

btnVerMenu?.addEventListener('click', abrirModalMenu);

btnCerrarModalMenu?.addEventListener('click', cerrarModalMenu);

btnCerrarModalMenu2?.addEventListener('click', cerrarModalMenu);

modalMenu?.addEventListener('click', (event) => {
    if (event.target === modalMenu) {
        cerrarModalMenu();
    }
});

document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
        cerrarModalMenu();
    }
});

function abrirImagen(index) {
    imagenActual = index;

    const modal = document.getElementById('modalImagen');
    const imagen = document.getElementById('imagenAmpliada');
    const contador = document.getElementById('contadorImagen');

    const imagenSeleccionada = imagenesMenu[imagenActual];

    imagen.src = imagenSeleccionada.src;
    imagen.alt = imagenSeleccionada.alt;

    contador.textContent = `${imagenActual + 1} / ${imagenesMenu.length}`;

    modal.classList.add('modal--visible');
    document.body.classList.add('modal-abierto');
}

function cerrarImagen() {
    document.getElementById('modalImagen').classList.remove('modal--visible');
    document.body.classList.remove('modal-abierto');
}

function cambiarImagen(direccion) {
    imagenActual += direccion;

    if (imagenActual < 0) {
        imagenActual = imagenesMenu.length - 1;
    }

    if (imagenActual >= imagenesMenu.length) {
        imagenActual = 0;
    }

    const imagen = document.getElementById('imagenAmpliada');
    const contador = document.getElementById('contadorImagen');

    const imagenSeleccionada = imagenesMenu[imagenActual];

    imagen.src = imagenSeleccionada.src;
    imagen.alt = imagenSeleccionada.alt;

    contador.textContent = `${imagenActual + 1} / ${imagenesMenu.length}`;
}

const imagenesMenu = [
    './sanguches/completos.jpeg',
    './sanguches/premium.jpeg',
    './sanguches/clasicos.jpeg',
    './sanguches/vegetarianos.jpeg',
    './sanguches/extras.jpeg',
    './sanguches/combos.jpeg'
];

function configurarGaleriaMenu() {
    const imagenes = document.querySelectorAll('.modal-menu__imagen');

    imagenes.forEach((imagen, index) => {
        imagen.style.cursor = 'pointer';

        imagen.addEventListener('click', () => {
            const ruta = imagenesMenu[index];

            window.open(ruta, '_blank', 'noopener,noreferrer');
        });
    });
}

function abrirModalSucursales(tipo) {
    if (tipo === 'pedido' && !hayPedidosCargados()) {
        mostrarToast('Todavía no hay ningún sánguche en la comanda', 'error');
        return;
    }
    estado.tipoEnvioWhatsapp = tipo;
    document.getElementById('modalSucursalesTitulo').textContent = tipo === 'consulta'
        ? 'Seleccioná dónde preguntar'
        : 'Seleccioná dónde pedir';
    document.getElementById('modalSucursales').classList.add('modal--visible');
}

function cerrarModalSucursales() {
    document.getElementById('modalSucursales').classList.remove('modal--visible');
}

let onConfirmarModal = null;

function abrirModalConfirmacion(texto, alConfirmar) {
    document.getElementById('modalConfirmacionTexto').textContent = texto;
    onConfirmarModal = alConfirmar;
    document.getElementById('modalConfirmacion').classList.add('modal--visible');
}

function cerrarModalConfirmacion() {
    document.getElementById('modalConfirmacion').classList.remove('modal--visible');
    onConfirmarModal = null;
}

let temporizadorToast = null;

function mostrarToast(texto, tipo) {
    const toast = document.getElementById('toast');
    toast.textContent = texto;
    toast.className = 'toast toast--visible' + (tipo === 'error' ? ' toast--error' : '');
    clearTimeout(temporizadorToast);
    temporizadorToast = setTimeout(() => {
        toast.classList.remove('toast--visible');
    }, 2600);
}

function configurarEventos() {
    document.getElementById('inputComensal').addEventListener('input', function () { validarNombre(this); });
    document.getElementById('inputComensal').addEventListener('keydown', e => {
        if (e.key === 'Enter') agregarComensal();
    });
    document.getElementById('btnAgregarComensal').addEventListener('click', agregarComensal);
    document.getElementById('inputCantidad').addEventListener('input', actualizarResumenActual);
    document.getElementById('btnAgregarItem').addEventListener('click', agregarItemALaComanda);

    document.getElementById('btnConsultarDisponibilidad').addEventListener('click', () => abrirModalSucursales('consulta'));
    document.getElementById('btnVerComanda').addEventListener('click', () => {
        document.getElementById('panelComanda').scrollIntoView({ behavior: 'smooth', block: 'start' });
    });    document.getElementById('btnEnviarWhatsapp').addEventListener('click', () => abrirModalSucursales('pedido'));
    document.getElementById('btnCerrarModalSucursales').addEventListener('click', cerrarModalSucursales);
    document.getElementById('btnConfirmarSucursal').addEventListener('click', () => {
        const seleccionada = document.querySelector('input[name="sucursal"]:checked');
        if (!seleccionada) {
            mostrarToast('Elegí una sucursal', 'error');
            return;
        }
        const mensaje = estado.tipoEnvioWhatsapp === 'consulta' ? construirMensajeConsulta() : construirMensajePedido();
        enviarWhatsapp(seleccionada.value, mensaje);
        cerrarModalSucursales();
    });

    document.getElementById('inputEnvio').addEventListener('input', function () {
        estado.envio = Math.max(0, parseFloat(this.value) || 0);
        actualizarTotales(calcularTotalGeneral());
    });

    document.getElementById('btnEnviarDesglose').addEventListener('click', () => {
        if (!hayPedidosCargados()) {
            mostrarToast('Todavía no hay ningún sánguche en la comanda', 'error');
            return;
        }
        const inputNumero = document.getElementById('inputNumeroDesglose');
        const numero = inputNumero.value.replace(/\D/g, '');
        if (!numero) {
            mostrarToast('Escribí el número de WhatsApp para el desglose', 'error');
            return;
        }
        enviarWhatsapp(numero, construirMensajeDesglose());
    });

    document.getElementById('btnCancelarConfirmacion').addEventListener('click', cerrarModalConfirmacion);
    document.getElementById('btnAceptarConfirmacion').addEventListener('click', () => {
        if (onConfirmarModal) onConfirmarModal();
        cerrarModalConfirmacion();
    });

    configurarGaleriaMenu();
}

document.addEventListener('DOMContentLoaded', () => {
    renderCategorias();
    seleccionarCategoria('clasicos');
    renderComensales();
    renderComanda();
    renderSucursales();
    configurarEventos();
});
