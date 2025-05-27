import CutomNavBar from './CutomNavBar'

interface LayoutProps {
    children: React.ReactNode;
  }

  const AdminDashboardLayout = ({ children }: LayoutProps) => {
  return (
    <div className="flex-1 flex flex-col h-full min-h-screen w-full">
      <div className="sticky top-0 z-10">
        <CutomNavBar />
      </div>
        <div className=" overflow-auto h-[calc(100vh-73px)] bg-black p-5">
          {children}
        </div>
    </div>
  )
}

export default AdminDashboardLayout