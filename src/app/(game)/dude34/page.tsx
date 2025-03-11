import SidebarMenu from "../../../components/sidebar1";

export default function Home() {
  return (
    <div className="flex">
      <SidebarMenu />
      <div className="p-6">
        <h1 className="text-2xl font-bold">Home Page</h1>
        <p>Welcome to the home page!</p>
      </div>
    </div>
  );
}