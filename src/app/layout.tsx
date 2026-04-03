const isMaintenance = process.env.NEXT_PUBLIC_MAINTENANCE_MODE === "true";

export default function RootLayout({ children }) {
  if (isMaintenance) {
    return (
      <html>
        <body className="flex h-screen items-center justify-center bg-black text-white">
          <div className="text-center">
            <h1 className="text-3xl font-semibold">Under construction</h1>
            <p className="mt-2 text-gray-400">Less noise. More structure.</p>
          </div>
        </body>
      </html>
    );
  }

  return (
    <html>
      <body>{children}</body>
    </html>
  );
}
