import Nav from '@/app/ui/nav';

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="">
      <div className="">
        <Nav />
      </div>
      <div className="p-12">{children}</div>
    </div>
  );
}