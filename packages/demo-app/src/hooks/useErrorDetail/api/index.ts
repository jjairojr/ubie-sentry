import { apiClient } from "@/lib/axios";

const PROJECT_ID = import.meta.env.VITE_PROJECT_ID;

export async function fetchErrorGroupDetail(fingerprint: string) {
  const response = await apiClient.get(
    `/projects/${PROJECT_ID}/error-groups/${fingerprint}`,
  );
  return response.data;
}
