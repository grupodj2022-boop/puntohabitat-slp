import type { Property } from './utils';
const KEY='ph_props_v1';
export function loadProps(): Property[] {
  if (typeof window === 'undefined') return [];
  const raw = localStorage.getItem(KEY);
  if (!raw) return [];
  try { return JSON.parse(raw) as Property[] } catch { return [] }
}
export function saveProps(list: Property[]){
  if (typeof window === 'undefined') return;
  localStorage.setItem(KEY, JSON.stringify(list));
}
