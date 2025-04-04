import AdminProductList from "@/components/AdminProductList";

export default function AdminPage() {
  return (
    /* This is the main admin page where the admin can manage products */
    <div className="container mx-auto p-4">
      <AdminProductList />
    </div>
  );
}
