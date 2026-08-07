import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Field Sim 3D - Interactive Farming & Simulator',
  description: 'Immersive, real-time 3D low-poly farm management simulation built with React Three Fiber, Next.js, and Three.js. Drive tractors, plant crops, raise livestock, and manage your economy.',
  keywords: ['3D farm simulator', 'React Three Fiber', 'Next.js 3D game', 'Three.js farming', 'Low poly simulation'],
  authors: [{ name: 'Field Sim Team' }],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="w-screen h-screen overflow-hidden bg-slate-950 font-sans">
        {children}
      </body>
    </html>
  );
}

