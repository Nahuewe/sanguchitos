const PANES_BASE = ['Miga', 'Pebete', 'Francés'];

const PANES_PRECIO = {
    'Miga': 0,
    'Pebete': 0,
    'Francés': 0,
    'Ciabatta': 1000,
    'Baguette': 1000,
    'Focaccia': 2000
};

const TODOS_LOS_PANES = ['Miga', 'Pebete', 'Francés', 'Ciabatta', 'Baguette', 'Focaccia'];

const EXTRAS = {
    especiales: {
        etiqueta: 'Especiales',
        precio: 1500,
        opciones: ['Jamón crudo', 'Ternera', 'Palta', 'Palmitos', 'Roquefort']
    },
    simples: {
        etiqueta: 'Simples',
        precio: 700,
        opciones: ['Queso', 'Morrón ahumado', 'Huevo', 'Aceitunas', 'Tomates hidratados en aceite de oliva']
    }
};

const CATEGORIAS = {
    clasicos: {
        etiqueta: 'Clásicos',
        panesIncluidos: ['Miga', 'Pebete', 'Francés'],
        sanguches: [
            { id: 'el-clasico', nombre: 'El Clásico', precio: 3800, descripcion: 'Jamón cocido y queso tybo.' },
            { id: 'salamero', nombre: 'Salamero', precio: 3800, descripcion: 'Salame y queso tybo.' },
            { id: 'la-fresca', nombre: 'La Fresca', precio: 4600, descripcion: 'Ternera jugosa y tomate.' },
            { id: 'bondiola-campestre', nombre: 'Bondiola Campestre', precio: 4600, descripcion: 'Bondiola y queso tybo.' },
            { id: 'la-tradicione', nombre: 'La Tradicione', precio: 4600, descripcion: 'Mortadela y queso tybo.' },
            { id: 'longaniza', nombre: 'Longaniza', precio: 4600, descripcion: 'Salamín y queso tybo.' }
        ]
    },
    vegetarianos: {
        etiqueta: 'Vegetarianos',
        panesIncluidos: ['Miga', 'Pebete', 'Francés'],
        sanguches: [
            { id: 'tio-veggie', nombre: 'Tío Veggie', precio: 5500, descripcion: 'Rúcula, queso tybo, tomate, palta.' },
            { id: 'campestre', nombre: 'Campestre', precio: 5200, descripcion: 'Zanahoria, choclo, queso y salsa golf.' },
            { id: 'rojo-ahumado', nombre: 'Rojo Ahumado', precio: 5200, descripcion: 'Morrón ahumado, queso tybo, huevo y aceitunas.' },
            { id: 'escabechado', nombre: 'Escabechado', precio: 5700, descripcion: 'Escabeche de berenjena, queso y rúcula.' },
            { id: 'intenso-azul', nombre: 'Intenso Azul', precio: 5900, descripcion: 'Queso roquefort, morrón ahumado, rúcula y aceitunas.' }
        ]
    },
    completos: {
        etiqueta: 'Completos',
        panesIncluidos: ['Miga', 'Pebete', 'Francés', 'Ciabatta', 'Baguette'],
        sanguches: [
            { id: 'perfecto-tipico', nombre: 'Perfecto Típico', precio: 5500, descripcion: 'Ternera, lechuga, huevo y aceitunas.' },
            { id: 'ahumado', nombre: 'Ahumado', precio: 5900, descripcion: 'Ternera, queso tybo, morrón ahumado y huevo.' },
            { id: 'casero', nombre: 'Casero', precio: 5500, descripcion: 'Jamón cocido, tomate, huevo y aceituna.' },
            { id: 'especial-cocido', nombre: 'Especial Cocido', precio: 5700, descripcion: 'Jamón cocido, queso tybo, huevo, morrón ahumado y aceitunas.' },
            { id: 'la-cremosa', nombre: 'La Cremosa', precio: 5900, descripcion: 'Pollo, queso crema, huevo y aceitunas.' },
            { id: 'crema-de-verdeo', nombre: 'Crema de Verdeo', precio: 5500, descripcion: 'Jamón, queso tybo, queso crema, verdeo y huevo.' },
            { id: 'lengudo', nombre: 'Lengudo', precio: 5500, descripcion: 'Lengua a la vinagreta, lechuga y tomate.' }
        ]
    },
    premium: {
        etiqueta: 'Premium',
        panesIncluidos: ['Miga', 'Pebete', 'Francés', 'Ciabatta', 'Baguette', 'Focaccia'],
        sanguches: [
            { id: 'miga-toscano', nombre: 'Miga Toscano', precio: 7200, descripcion: 'Jamón crudo, rúcula fresca, queso tybo, pesto de albahaca, aceitunas.' },
            { id: 'el-italiano', nombre: 'El Italiano', precio: 6900, descripcion: 'Mortadela, queso tybo, pesto de albahaca, aceitunas.' },
            { id: 'mediterraneo', nombre: 'Mediterráneo', precio: 7500, descripcion: 'Jamón crudo, tomate fresco, palta y aceitunas.' },
            { id: 'bondi-ahumada', nombre: 'Bondi Ahumada', precio: 6900, descripcion: 'Bondiola, queso tybo, morrón ahumado.' },
            { id: 'tio-golf', nombre: 'Tío Golf', precio: 7500, descripcion: 'Jamón cocido, palmitos, huevo, salsa golf.' },
            { id: 'tropical-cocido', nombre: 'Tropical Cocido', precio: 7200, descripcion: 'Jamón cocido, queso tybo, ananá.' },
            { id: 'azul-fresco', nombre: 'Azul Fresco', precio: 6900, descripcion: 'Jamón cocido, rúcula, roquefort.' },
            { id: 'trapezzino', nombre: 'Trapezzino', precio: 7200, descripcion: 'Ternera, cheddar, cebolla caramelizada, salsa barbacoa.' }
        ]
    }
};

const SUCURSALES = [
    { nombre: 'Tio Migas (hermana de Lautaro)', numero: '+5493834563993' }
];
