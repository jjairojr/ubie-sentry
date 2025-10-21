import { apiClient } from "@/lib/axios";

const PROJECT_ID = import.meta.env.VITE_PROJECT_ID;

export async function fetchErrors(offset: number = 0) {
  const response = await apiClient.get(
    `/projects/${PROJECT_ID}/errors?limit=50&offset=${offset}`,
  );
  return response.data;
}

export async function fetchErrorGroups(offset: number = 0) {
  const response = await apiClient.get(
    `/projects/${PROJECT_ID}/error-groups?limit=50&offset=${offset}`,
  );
  return response.data;
}
