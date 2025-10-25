import './globals.css';
import type { Metadata } from 'next';
import Image from 'next/image';

export const metadata: Metadata = {
  title: 'Punto Hábitat — San Luis Potosí',
  description: 'Catálogo inmobiliario de Punto Hábitat en San Luis Potosí',
  metadataBase: new URL('https://puntohabitat-slp.vercel.app')
};

export default function RootLayout({children}:{children:React.ReactNode}){
  return (
    <html lang="es">
      <body>
        <header className="border-b bg-white sticky top-0 z-40">
          <div className="container py-3 flex items-center gap-3">
            <div className="logo">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/logo.jpg" alt="Punto Hábitat" />
              <span>Punto Hábitat</span>
            </div>
            <div className="text-sm text-slate-500">San Luis Potosí • Capital</div>
            <a className="ml-auto" href="/admin">Ir al panel</a>
          </div>
        </header>
        {children}
        <footer className="border-t mt-10">
          <div className="container py-6 text-sm text-slate-500 flex items-center justify-between">
            <div>© {new Date().getFullYear()} Punto Hábitat</div>
            <div className="flex gap-4">
              <a href="https://wa.me/524445743672" target="_blank" rel="noreferrer">WhatsApp</a>
              <a href="mailto:hola@puntohabitat.mx">Correo</a>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
