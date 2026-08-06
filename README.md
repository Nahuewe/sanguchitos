# Pedido de sánguches — oficina

Herramienta interna para armar el pedido de sánguches de la oficina y mandarlo por WhatsApp al local, sin build ni dependencias: se abre `index.html` y ya funciona.

## Cómo se usa

1. **Elegí al comensal**: escribí el nombre y tocá "Sumar". Podés ir sumando a todos los que van a pedir.
2. **Elegí el sánguche**: seleccioná la categoría (Clásicos, Vegetarianos, Completos, Premium) y tocá el sánguche que quiere esa persona.
3. **Elegí el pan**: se muestran solo los panes disponibles para ese sánguche. Si un pan tiene adicional, aparece marcado con el `+$` correspondiente.
4. **Sumá extras**: especiales o simples, los que quiera.
5. **Cantidad y agregado**: definí cuántos y tocá "Agregar a la comanda". El pedido de esa persona queda cargado en el panel de la derecha.

Repetís los pasos 1 a 5 por cada persona. El panel derecho ("Comanda") muestra el detalle completo internamente, con nombre, sánguche, pan, extras y precios — eso es solo para uso interno, para saber quién pidió qué y cuánto sale.

### Antes de pedir

El botón **"Preguntar disponibilidad"**, arriba de todo, manda un mensaje directo al local preguntando qué sánguches y panes tienen disponibles ese día, sin necesidad de tener nada cargado.

### Envío

En el panel de la comanda hay un campo **"Envío (solo para nosotros)"**. Lo que se cargue ahí se suma al total que se muestra arriba y en el panel, pero **no se envía en el mensaje de WhatsApp** — es solo para que la oficina tenga el total real a mano.

### Enviar el pedido

El botón **"Enviar pedido por WhatsApp"** arma un mensaje consolidado (agrupa cantidades si dos personas pidieron lo mismo) y lo abre en WhatsApp listo para enviar. Ese mensaje:

- No incluye nombres de las personas.
- No incluye precios.
- Solo lista sánguche, pan y extras, para que en el local no haya confusión.

## Estructura del proyecto

```
index.html         estructura de la página
style/style.css     toda la identidad visual
js/data.js          menú: categorías, sánguches, panes y extras
js/app.js           lógica de la app (estado, cálculos, WhatsApp)
```

## Cómo personalizar

### Cambiar o agregar sánguches

Todo el menú vive en `js/data.js`, dentro de `CATEGORIAS`. Cada categoría tiene:

- `panesIncluidos`: qué panes son gratis para esos sánguches.
- `sanguches`: lista de sánguches con `nombre`, `precio` y `descripcion`.

Para agregar un sánguche nuevo alcanza con sumar un objeto más a la lista `sanguches` de la categoría que corresponda.

### Cambiar panes o extras

- `PANES_PRECIO`: precio de cada pan (los que están en `panesIncluidos` de una categoría salen gratis igual, aunque acá tengan un precio de referencia).
- `EXTRAS`: los grupos "especiales" y "simples", con su precio único y su lista de opciones.

### Cambiar el número o agregar sucursales

En `SUCURSALES`, al final de `js/data.js`. Si hay más de una sucursal cargada, al enviar (ya sea la consulta o el pedido) se va a mostrar un selector para elegir a cuál mandarlo.

### Cambiar los textos de los mensajes de WhatsApp

En `js/app.js`:

- `construirMensajeConsulta()`: el mensaje del botón "Preguntar disponibilidad".
- `construirMensajePedido()`: el mensaje del botón "Enviar pedido por WhatsApp".
