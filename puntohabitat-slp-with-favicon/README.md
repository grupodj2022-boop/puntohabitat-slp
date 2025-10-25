# Punto Hábitat — puntohabitat-slp.vercel.app

App inmobiliaria limpia (sin propiedades de ejemplo), lista para subir a **Vercel**.

## Ejecutar local (opcional)
```bash
npm i
npm run dev
```
Abre http://localhost:3000

## Acceso admin
- Ir a `/admin`
- Contraseña: definida en variables de entorno; en este paquete ya viene en `.env.local` como `Mosh1782$`
- Desde ahí puedes agregar/editar/eliminar y exportar PDF.

## Subir a Vercel (sin programar)
1. Crea cuenta en https://vercel.com
2. Arrastra esta carpeta como “New Project”
3. Agrega la variable `NEXT_PUBLIC_ADMIN_PASSWORD = Mosh1782$`
4. Deploy, y tendrás: `https://puntohabitat-slp.vercel.app` (o similar)
