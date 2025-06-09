
export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="max-w-sm mx-auto min-h-screen">
      {children}
    </div>
  );
}