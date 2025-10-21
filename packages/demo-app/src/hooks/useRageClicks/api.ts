import axios from "axios";

const API_BASE_URL = "http://localhost:3000";
const PROJECT_ID = "demo-project";
const API_KEY = "demo-key-12345";

export async function fetchRageClicks() {
  const response = await axios.get(
    `${API_BASE_URL}/api/projects/${PROJECT_ID}/rage-clicks`,
    {
      headers: {
        "X-API-Key": API_KEY,
      },
    }
  );
  return response.data;
}
