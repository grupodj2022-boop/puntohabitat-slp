export const formatMXN = (n:number) => new Intl.NumberFormat('es-MX',{style:'currency',currency:'MXN',maximumFractionDigits:0}).format(n);
export type Property = {
  id: string; title: string; colonia: string; price: number; type: string;
  recamaras: number; banos: number; estacionamientos: number; m2: number; terreno?: number|null;
  entrega: string; promocion?: string; developer?: string; lat?: number; lng?: number;
  photos: string[]; features?: string[];
};
export function mensualidadHipoteca(precio:number, enganchePct=10, tasaAnualPct=11.5, plazoAnios=20){
  const enganche = (enganchePct/100)*precio;
  const monto = Math.max(precio-enganche,0);
  const n = plazoAnios*12;
  const i = tasaAnualPct/100/12;
  if(i===0) return monto/n;
  return (monto*i)/(1-Math.pow(1+i,-n));
}
