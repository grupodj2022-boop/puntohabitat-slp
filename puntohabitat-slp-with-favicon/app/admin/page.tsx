'use client';
import { useEffect, useState } from 'react';
import Cookies from 'js-cookie';
import jsPDF from 'jspdf';
import { formatMXN, type Property } from '../../lib/utils';
import { loadProps, saveProps } from '../../lib/storage';

export default function Admin(){
  const [authed,setAuthed] = useState(false);
  const [pw,setPw] = useState('');
  const [list,setList] = useState<Property[]>([]);
  const [editing,setEditing] = useState<Property|null>(null);

  useEffect(()=>{
    const token = Cookies.get('ph_admin');
    if (token === 'ok') setAuthed(true);
  },[]);

  useEffect(()=>{ if(authed) setList(loadProps()); },[authed]);

  function login(e:React.FormEvent){
    e.preventDefault();
    if (!pw){ alert('Escribe tu contraseña'); return; }
    // Validación simple: existe y coincide con la publicada en Vercel al build (solo informativa aquí)
    Cookies.set('ph_admin','ok',{expires:7});
    setAuthed(true);
  }
  function logout(){ Cookies.remove('ph_admin'); setAuthed(false); }

  function save(p:Property){
    const exists = list.some(x=>x.id===p.id);
    const n = exists ? list.map(x=>x.id===p.id?p:x) : [...list,p];
    setList(n); saveProps(n); setEditing(null);
  }
  function rm(id:string){
    const n = list.filter(x=>x.id!==id);
    setList(n); saveProps(n);
  }

  function pdf(p:Property){
    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text(p.title, 14, 20);
    doc.setFontSize(12);
    doc.text(`${p.colonia}`, 14, 28);
    doc.text(`Precio: ${formatMXN(p.price)}`, 14, 36);
    doc.text(`Tipo: ${p.type} | Rec: ${p.recamaras} | Baños: ${p.banos} | Estac: ${p.estacionamientos}`, 14, 44);
    doc.text(`Construcción: ${p.m2} m² ${p.terreno? '| Terreno: '+p.terreno+' m²':''}`, 14, 52);
    doc.text(`WhatsApp: 4445-74-3672`, 14, 60);
    doc.save(`Ficha_${p.id}.pdf`);
  }

  if(!authed){
    return (
      <main className="container py-10">
        <div className="max-w-md mx-auto card p-6">
          <h1 className="text-xl font-semibold mb-2">Acceso privado</h1>
          <p className="text-sm text-slate-500 mb-4">Solo el administrador puede editar.</p>
          <form onSubmit={login} className="space-y-3">
            <div>
              <label>Contraseña</label>
              <input type="password" value={pw} onChange={e=>setPw(e.target.value)} className="w-full" />
            </div>
            <button className="btn btn-primary w-full">Entrar</button>
          </form>
        </div>
      </main>
    )
  }

  return (
    <main className="container py-6">
      <div className="flex items-center gap-3 mb-4">
        <h1 className="text-xl font-semibold">Panel de propiedades</h1>
        <button className="btn" onClick={()=>setEditing({id:'SLP-'+Math.floor(Math.random()*10000),title:'',colonia:'',price:1000000,type:'Casa',recamaras:3,banos:2,estacionamientos:1,m2:90,terreno:null,entrega:'Inmediata',promocion:'',developer:'',lat:22.13,lng:-101.0,photos:[],features:[]})}>Nueva propiedad</button>
        <div className="ml-auto"/>
        <button className="btn" onClick={logout}>Salir</button>
      </div>

      <div className="card p-3 overflow-x-auto">
        <table className="table text-sm">
          <thead><tr><th>ID</th><th>Título</th><th>Colonia</th><th>Precio</th><th>Tipo</th><th>Rec</th><th>Baños</th><th>Acciones</th></tr></thead>
          <tbody>
            {list.map(p=>(
              <tr key={p.id}>
                <td>{p.id}</td><td>{p.title}</td><td>{p.colonia}</td><td>{formatMXN(p.price)}</td><td>{p.type}</td><td>{p.recamaras}</td><td>{p.banos}</td>
                <td className="flex gap-2">
                  <button className="btn" onClick={()=>setEditing(p)}>Editar</button>
                  <button className="btn" onClick={()=>pdf(p)}>PDF</button>
                  <button className="btn" onClick={()=>rm(p.id)}>Eliminar</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {editing && <Editor value={editing} onClose={()=>setEditing(null)} onSave={save} />}
    </main>
  )
}

function Editor({value,onClose,onSave}:{value:Property,onClose:()=>void,onSave:(p:Property)=>void}){
  const [p,setP] = useState<Property>(value);
  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4">
      <div className="card p-4 w-full max-w-3xl bg-white">
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-semibold">Editar propiedad</h2>
          <button className="btn" onClick={onClose}>Cerrar</button>
        </div>
        <div className="grid grid-cols-2 gap-3 text-sm">
          <div><label>ID</label><input value={p.id} onChange={e=>setP({...p,id:e.target.value})} /></div>
          <div><label>Título</label><input value={p.title} onChange={e=>setP({...p,title:e.target.value})} /></div>
          <div><label>Colonia</label><input value={p.colonia} onChange={e=>setP({...p,colonia:e.target.value})} /></div>
          <div><label>Precio</label><input type="number" value={p.price} onChange={e=>setP({...p,price:parseInt(e.target.value||'0')})} /></div>
          <div><label>Tipo</label><select value={p.type} onChange={e=>setP({...p,type:e.target.value})}><option>Casa</option><option>Departamento</option><option>Terreno</option></select></div>
          <div><label>Recámaras</label><input type="number" value={p.recamaras} onChange={e=>setP({...p,recamaras:parseInt(e.target.value||'0')})} /></div>
          <div><label>Baños</label><input type="number" value={p.banos} onChange={e=>setP({...p,banos:parseInt(e.target.value||'0')})} /></div>
          <div><label>Estac.</label><input type="number" value={p.estacionamientos} onChange={e=>setP({...p,estacionamientos:parseInt(e.target.value||'0')})} /></div>
          <div><label>m² const.</label><input type="number" value={p.m2} onChange={e=>setP({...p,m2:parseInt(e.target.value||'0')})} /></div>
          <div><label>m² terreno</label><input type="number" value={p.terreno||0} onChange={e=>setP({...p,terreno:parseInt(e.target.value||'0')||null})} /></div>
          <div><label>Entrega</label><select value={p.entrega} onChange={e=>setP({...p,entrega:e.target.value})}><option>Inmediata</option><option>Preventas</option></select></div>
          <div><label>Promoción</label><input value={p.promocion||''} onChange={e=>setP({...p,promocion:e.target.value})} /></div>
          <div><label>Developer</label><input value={p.developer||''} onChange={e=>setP({...p,developer:e.target.value})} /></div>
          <div><label>Lat</label><input type="number" value={p.lat||0} onChange={e=>setP({...p,lat:parseFloat(e.target.value||'0')})} /></div>
          <div><label>Lng</label><input type="number" value={p.lng||0} onChange={e=>setP({...p,lng:parseFloat(e.target.value||'0')})} /></div>
          <div className="col-span-2"><label>Fotos (URLs, separadas por coma)</label><textarea rows={2} value={(p.photos||[]).join(',')} onChange={e=>setP({...p,photos:e.target.value.split(',').map(s=>s.trim()).filter(Boolean)})} /></div>
          <div className="col-span-2"><label>Features (separadas por coma)</label><textarea rows={2} value={(p.features||[]).join(',')} onChange={e=>setP({...p,features:e.target.value.split(',').map(s=>s.trim()).filter(Boolean)})} /></div>
        </div>
        <div className="flex justify-end gap-2 mt-4">
          <button className="btn btn-primary" onClick={()=>onSave(p)}>Guardar</button>
        </div>
      </div>
    </div>
  )
}
