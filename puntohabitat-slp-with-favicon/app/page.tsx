'use client';
import {useEffect, useMemo, useState} from 'react';
import {formatMXN, mensualidadHipoteca, type Property} from '../lib/utils';
import { loadProps } from '../lib/storage';

export default function Home(){
  const [list,setList] = useState<Property[]>([]);
  const [q, setQ] = useState('');
  const [type, setType] = useState('');
  const [entrega, setEntrega] = useState('');
  const [maxPrice, setMaxPrice] = useState(6000000);
  const [sort, setSort] = useState('relevancia');

  useEffect(()=>{ setList(loadProps()); },[]);

  const data = useMemo(()=>{
    let d = list.filter(p => p.price <= maxPrice);
    if (type) d = d.filter(p => p.type === type);
    if (entrega) d = d.filter(p => p.entrega === entrega);
    if (q) {
      const s = q.toLowerCase();
      d = d.filter(p => (p.title + ' ' + p.colonia + ' ' + (p.developer||'') + ' ' + (p.promocion||'')).toLowerCase().includes(s));
    }
    switch (sort){
      case 'precio_asc': d=[...d].sort((a,b)=>a.price-b.price); break;
      case 'precio_desc': d=[...d].sort((a,b)=>b.price-a.price); break;
      case 'm2_desc': d=[...d].sort((a,b)=>(b.m2||0)-(a.m2||0)); break;
      default:
        const score=(p:Property)=>(p.entrega==='Inmediata'?2:0)+(p.promocion?1:0);
        d=[...d].sort((a,b)=>score(b)-score(a));
    }
    return d;
  },[list,q,type,entrega,maxPrice,sort]);

  return (
    <main className="container py-6">
      <div className="card p-4 mb-3 flex flex-wrap gap-3 items-center">
        <input placeholder="Buscar colonia, desarrollo o palabra clave…" value={q} onChange={e=>setQ(e.target.value)} className="w-[300px]" />
        <select value={type} onChange={e=>setType(e.target.value)}><option value="">Todos</option><option>Casa</option><option>Departamento</option><option>Terreno</option></select>
        <select value={entrega} onChange={e=>setEntrega(e.target.value)}><option value="">Cualquiera</option><option>Inmediata</option><option>Preventas</option></select>
        <div className="ml-auto flex items-center gap-3">
          <label>Precio máx.</label>
          <input type="range" min={500000} max={6000000} step={50000} value={maxPrice} onChange={e=>setMaxPrice(parseInt(e.target.value))} />
          <div className="text-sm">{formatMXN(maxPrice)}</div>
          <select value={sort} onChange={e=>setSort(e.target.value)}>
            <option value="relevancia">Relevancia</option>
            <option value="precio_asc">Precio ↑</option>
            <option value="precio_desc">Precio ↓</option>
            <option value="m2_desc">m² ↓</option>
          </select>
        </div>
        <div className="w-full text-sm text-slate-500">{data.length} resultados en San Luis Potosí, capital</div>
      </div>

      {data.length===0 ? (
        <div className="empty">
          <div className="text-lg font-semibold mb-1">Aún no hay propiedades</div>
          <div className="mb-3">Entra al <a href="/admin">panel</a> para agregar la primera.</div>
        </div>
      ) : (
        <div className="grid-cards">
          {data.map((p)=> (
            <div key={p.id} className="card p-3">
              <div className="font-semibold">{p.title}</div>
              <div className="text-sm text-slate-500">{p.colonia}</div>
              <div className="text-lg font-bold">{formatMXN(p.price)}</div>
            </div>
          ))}
        </div>
      )}
    </main>
  )
}
