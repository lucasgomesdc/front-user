"use client";
import { QueryClient } from "@tanstack/react-query";

let _client: QueryClient | null = null;
export function getQueryClient() {
  if (!_client) _client = new QueryClient();
  return _client;
}
