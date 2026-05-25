import { OrdersPage } from "@/features/orders/OrdersPage";

export default function Orders() {
  return (
    <div className="page-panel">
      <div>
        <h1 className="page-heading">Orders</h1>
        <p className="page-subheading">Track your purchases and connect with sellers.</p>
      </div>
      <OrdersPage />
    </div>
  );
}
