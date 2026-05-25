import { apiRequest } from "./client";
import type { ApiOrder, OrderStatus, Pagination } from "@/types/api";

export async function listOrders(options?: {
  page?: number;
  limit?: number;
  status?: OrderStatus;
}): Promise<{ orders: ApiOrder[]; pagination: Pagination }> {
  const params = new URLSearchParams();
  if (options?.page) params.set("page", String(options.page));
  if (options?.limit) params.set("limit", String(options.limit));
  if (options?.status) params.set("status", options.status);
  const qs = params.size > 0 ? `?${params.toString()}` : "";

  return apiRequest<{ orders: ApiOrder[]; pagination: Pagination }>(`/orders${qs}`);
}
