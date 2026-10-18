(() => {
  const KEY = 'artesanias_mx_productos_v1';
  const seed = [
    {id:'p1', nombre:'Textil floral mexicano', categoria:'Textiles', precio:750, descripcion:'Artesanía textil con colores intensos y motivos florales.', pais:'México', material:'Textil', imagen:'images/rebozo.png'},
    {id:'p2', nombre:'Vasija artesanal', categoria:'Cerámica', precio:620, descripcion:'Pieza de cerámica hecha artesanalmente.', pais:'México', material:'Barro', imagen:'images/barro.jpg'},
    {id:'p3', nombre:'Alebrije colorido', categoria:'Coleccionables', precio:890, descripcion:'Figura artesanal pintada a mano.', pais:'México', material:'Madera', imagen:'images/alebrije.jpg'},
    {id:'p4', nombre:'Canasta tejida', categoria:'Decoración', precio:380, descripcion:'Canasta tejida para decorar o guardar objetos.', pais:'México', material:'Fibra natural', imagen:'images/canasta.jpg'},
    {id:'p5', nombre:'Collar artesanal', categoria:'Joyería', precio:450, descripcion:'Accesorio artesanal con detalles únicos.', pais:'México', material:'Piedra y metal', imagen:'images/joyeria.jpg'},
    {id:'p6', nombre:'Figura de madera', categoria:'Decoración', precio:540, descripcion:'Figura tallada en madera.', pais:'México', material:'Madera', imagen:'images/madera.jpg'}
  ];
  const read = () => { try { const x=JSON.parse(localStorage.getItem(KEY)); return Array.isArray(x)?x:seed.slice(); } catch(e){ return seed.slice(); } };
  const save = x => localStorage.setItem(KEY, JSON.stringify(x));
  if (!localStorage.getItem(KEY)) save(seed);
  const esc = s => String(s ?? '').replace(/[&<>"']/g, c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const money = n => '$'+Number(n||0).toLocaleString('es-MX')+' MXN';
  const image = p => p.imagen || 'images/rebozo.png';
  const card = p => `<article class="product"><a href="detalle-producto.html?id=${encodeURIComponent(p.id)}"><div class="product-image"><img src="${esc(image(p))}" alt="${esc(p.nombre)}" onerror="this.src='images/rebozo.png'"></div></a><div class="product-info"><div class="stars">★★★★★</div><h3>${esc(p.nombre)}</h3><p>${esc(p.categoria)} · ${esc(p.pais||'México')}</p><div class="product-bottom"><span class="price">${money(p.precio)}</span><a class="btn btn-pink" href="detalle-producto.html?id=${encodeURIComponent(p.id)}">Ver producto</a></div></div></article>`;
  const currentPage = location.pathname.split('/').pop();
  if (currentPage === 'catalogo.html') {
    const old = document.querySelector('.cards');
    if (old) { old.innerHTML=''; old.id='catalogo-dinamico'; }
    const holder = old || document.querySelector('.container');
    if (holder) {
      const tools=document.createElement('div');
      tools.innerHTML=`<div class="form-row" style="margin:18px 0"><input id="buscar-productos" class="form-control" placeholder="Buscar artesanía..."><select id="filtrar-categoria" class="form-control"><option value="">Todas las categorías</option></select></div><p id="contador-productos" style="margin-bottom:15px"></p>`;
      holder.parentNode.insertBefore(tools,holder);
      const select=tools.querySelector('select');
      [...new Set(read().map(p=>p.categoria))].sort().forEach(c=>select.insertAdjacentHTML('beforeend',`<option>${esc(c)}</option>`));
      const render=()=>{const q=document.getElementById('buscar-productos').value.toLowerCase();const cat=select.value;const arr=read().filter(p=>(p.nombre+' '+p.descripcion+' '+p.categoria).toLowerCase().includes(q)&&(!cat||p.categoria===cat));document.getElementById('contador-productos').textContent=`${arr.length} producto(s) encontrado(s)`;holder.innerHTML=arr.map(card).join('')||'<p>No hay productos que coincidan con la búsqueda.</p>';};
      tools.querySelector('input').addEventListener('input',render); select.addEventListener('change',render); render();
    }
  }
  if (currentPage === 'perfil-artesano.html') {
    const cards=document.querySelector('.profile-content .cards');
    if(cards) {
      cards.innerHTML=''; cards.id='mis-productos';
      const controls=document.createElement('div');
      controls.innerHTML=`<div style="display:flex;gap:12px;flex-wrap:wrap;align-items:center;margin:18px 0"><a class="btn btn-pink" href="publicar.html">＋ Agregar producto</a><span id="crud-total"></span></div><div id="crud-lista" class="cards"></div>`;
      cards.parentNode.insertBefore(controls,cards); cards.remove();
      const render=()=>{const arr=read();document.getElementById('crud-total').textContent=`${arr.length} producto(s) en tu tienda`;document.getElementById('crud-lista').innerHTML=arr.map(p=>`<article class="product"><div class="product-image"><img src="${esc(image(p))}" alt="${esc(p.nombre)}" onerror="this.src='images/rebozo.png'"></div><div class="product-info"><h3>${esc(p.nombre)}</h3><p>${esc(p.categoria)} · ${money(p.precio)}</p><div style="display:flex;gap:8px;flex-wrap:wrap;margin-top:12px"><a class="btn btn-blue" href="publicar.html?id=${encodeURIComponent(p.id)}">Editar</a><button class="btn btn-pink" data-delete="${esc(p.id)}" type="button">Eliminar</button></div></div></article>`).join('')||'<p>Aún no tienes productos. Agrega el primero.</p>';};
      document.addEventListener('click',e=>{const b=e.target.closest('[data-delete]');if(!b)return;const p=read().find(x=>x.id===b.dataset.delete);if(p&&confirm(`¿Eliminar "${p.nombre}"? Esta acción no se puede deshacer.`)){save(read().filter(x=>x.id!==b.dataset.delete));render();}});render();
    }
  }
  if (currentPage === 'publicar.html') {
    const form=document.getElementById('form-producto');
    if(form){
      const id=new URLSearchParams(location.search).get('id'); const existing=read().find(p=>p.id===id);
      if(existing){document.getElementById('titulo-formulario').textContent='Editar artesanía';document.getElementById('btn-guardar').textContent='Guardar cambios';}
      if(existing) for(const k of ['nombre','categoria','precio','descripcion','pais','material','imagen']){const el=form.elements[k];if(el)el.value=existing[k]??'';}
      form.addEventListener('submit',e=>{e.preventDefault();const data=Object.fromEntries(new FormData(form).entries());data.nombre=data.nombre.trim();data.precio=Number(data.precio);if(!data.nombre||!Number.isFinite(data.precio)||data.precio<=0){alert('Escribe un nombre y un precio mayor que cero.');return;}const products=read();if(existing){save(products.map(p=>p.id===id?{...p,...data,id}:p));}else{data.id='p'+Date.now();save([...products,data]);}alert(existing?'Producto actualizado correctamente.':'Producto creado correctamente.');location.href='perfil-artesano.html';});
    }
  }
  if (currentPage === 'detalle-producto.html') {
    const id=new URLSearchParams(location.search).get('id');const p=read().find(x=>x.id===id);
    if(p){const h=document.querySelector('.detail-info h1');if(h){h.textContent=p.nombre;const info=document.querySelector('.detail-info');const desc=info.querySelector('p');if(desc)desc.textContent=p.descripcion;const price=info.querySelector('.detail-price');if(price)price.textContent=money(p.precio);const img=document.querySelector('.detail-main img');if(img){img.src=image(p);img.alt=p.nombre;}const features=info.querySelector('.detail-features');if(features)features.innerHTML=`<div class="feature"><strong>Origen</strong>${esc(p.pais)}</div><div class="feature"><strong>Categoría</strong>${esc(p.categoria)}</div><div class="feature"><strong>Material</strong>${esc(p.material)}</div><div class="feature"><strong>Artesano</strong>Artesanías MX</div>`;}}
  }
})();