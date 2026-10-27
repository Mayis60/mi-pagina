// Solo la llave publicable (sb_publishable_) va aquí. Nunca sb_secret_ ni service_role.
const SUPABASE_URL = 'https://rnqsxwwkyscwwsbnnltq.supabase.co';
const SUPABASE_KEY = 'sb_publishable_SgHJA1ejvDJYwq7VH-LlCQ_Lr-z5sLL';
const TABLA = SUPABASE_URL + '/rest/v1/apartados';
// Con llave sb_publishable_ no se manda Authorization.
const ENCABEZADOS = { apikey: SUPABASE_KEY, 'Content-Type': 'application/json' };

const PRENDAS = ['Vestido Casual', 'Pantalón Formal', 'Blusa Estampada'];
const TALLAS = ['CH', 'M', 'G', 'XG'];
const SUCURSALES = ['Centro', 'Norte', 'Sur'];

const form = document.getElementById('apartado');
const mensaje = document.getElementById('mensaje');
const lista = document.getElementById('lista');

function aviso(texto) {
  mensaje.textContent = texto;
}

function textoLista(texto) {
  lista.replaceChildren();
  const li = document.createElement('li');
  li.className = 'vacio';
  li.textContent = texto;
  lista.appendChild(li);
}

// Todo se pinta con textContent: lo que regrese la base nunca se interpreta como HTML.
function pintar(filas) {
  if (!filas.length) return textoLista('Todavía no hay apartados.');
  lista.replaceChildren();
  filas.forEach(function (f) {
    const li = document.createElement('li');
    const prenda = document.createElement('span');
    prenda.className = 'nombre';
    prenda.textContent = String(f.prenda);
    const detalle = document.createElement('span');
    detalle.className = 'detalle';
    detalle.textContent = 'Talla ' + f.talla + ' · ' + f.sucursal;
    li.append(prenda, detalle);
    lista.appendChild(li);
  });
}

async function cargarUltimos() {
  try {
    const r = await fetch(
      TABLA + '?select=prenda,talla,sucursal&order=created_at.desc&limit=10',
      { headers: { apikey: SUPABASE_KEY } }
    );
    if (!r.ok) throw new Error(r.status);
    pintar(await r.json());
  } catch (err) {
    textoLista('No pudimos cargar los apartados.');
  }
}

form.addEventListener('submit', async function (e) {
  e.preventDefault();
  const datos = {
    prenda: form.prenda.value,
    talla: form.talla.value,
    sucursal: form.sucursal.value
  };
  if (!PRENDAS.includes(datos.prenda) || !TALLAS.includes(datos.talla) || !SUCURSALES.includes(datos.sucursal)) {
    return aviso('Elige prenda, talla y sucursal.');
  }
  const boton = form.querySelector('button');
  boton.disabled = true;
  aviso('Guardando...');
  try {
    const r = await fetch(TABLA, {
      method: 'POST',
      headers: Object.assign({ Prefer: 'return=minimal' }, ENCABEZADOS),
      body: JSON.stringify(datos)
    });
    if (!r.ok) throw new Error(r.status);
    aviso('Apartado guardado. ¡Gracias!');
    form.reset();
    cargarUltimos();
  } catch (err) {
    aviso('No pudimos guardar tu apartado. Intenta de nuevo.');
  } finally {
    boton.disabled = false;
  }
});

cargarUltimos();
