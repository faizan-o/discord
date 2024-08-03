import Sidebar from "@/components/navigation/sidebar";

const MainRoutesLayout = ({
  children,
}: Readonly<{ children: React.ReactNode }>) => {
  return (
    <main className="flex h-full">
      <aside className="w-[400px] h-full hidden md:block">
        <Sidebar />
      </aside>
      <div className="w-full max-h-full overflow-y-auto">{children}</div>
    </main>
  );
};

export default MainRoutesLayout;
