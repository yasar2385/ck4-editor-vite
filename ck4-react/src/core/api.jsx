import axios from "axios";

const API_URL = "http://localhost:6000";

export const uploadDocuments = async (sessionId, files) => {
  const formData = new FormData();
  for (const file of files) {
    formData.append("files", file);
  }

  const response = await axios.post(
    `${API_URL}/upload?session_id=${sessionId}`,
    formData,
    { headers: { "Content-Type": "multipart/form-data" } }
  );

  return response.data;
};
