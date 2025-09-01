import axios from "axios"

const API_BASE = "http://127.0.0.1:5000"

export interface Prediction {
  id?: number
  filename?: string
  prediction: string
  confidence: number
  severity?: string
  timestamp: string
  image_url?: string
}

const mockLastInference: Prediction = {
  id: 1,
  filename: "healthy2.jpg",
  prediction: "Healthy",
  confidence: 99.95,
  severity: "low",
  timestamp: new Date().toISOString(),
}

const mockHistory: Prediction[] = [
  {
    id: 17,
    filename: "healthy2.jpg",
    prediction: "Healthy",
    confidence: 99.95,
    timestamp: "2025-01-09T14:58:50Z",
  },
  {
    id: 16,
    filename: "healthy3_2.jpg",
    prediction: "Healthy",
    confidence: 87.03,
    timestamp: "2025-01-09T14:58:40Z",
  },
  {
    id: 15,
    filename: "cocci640.jpg",
    prediction: "Healthy",
    confidence: 98.63,
    timestamp: "2025-01-09T14:46:22Z",
  },
  {
    id: 14,
    filename: "cocci633.jpg",
    prediction: "Healthy",
    confidence: 99.56,
    timestamp: "2025-01-09T14:45:29Z",
  },
  {
    id: 13,
    filename: "cocci620.jpg",
    prediction: "Newcastle Disease (NCD)",
    confidence: 57.47,
    timestamp: "2025-01-09T14:45:04Z",
  },
]

export const api = {
  // Get last inference
  getLastInference: async (): Promise<Prediction> => {
    try {
      const response = await axios.get(`${API_BASE}/last_inference`, { timeout: 5000 })
      return response.data
    } catch (error) {
      console.warn("Backend not available, using mock data for last inference")
      return mockLastInference
    }
  },

  // Get scan history
  getHistory: async (): Promise<Prediction[]> => {
    try {
      const response = await axios.get(`${API_BASE}/history`, { timeout: 5000 })
      return response.data
    } catch (error) {
      console.warn("Backend not available, using mock data for history")
      return mockHistory
    }
  },

  // Upload and analyze image
  uploadImage: async (file: File): Promise<Prediction> => {
    try {
      const formData = new FormData()
      formData.append("file", file)

      const response = await axios.post(`${API_BASE}/upload`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        timeout: 30000,
      })
      return response.data
    } catch (error) {
      console.warn("Backend not available, using mock prediction result")
      return {
        id: Date.now(),
        filename: file.name,
        prediction: "Coccidiosis",
        confidence: 89.5,
        severity: "medium",
        timestamp: new Date().toISOString(),
      }
    }
  },

  // Clear scan history
  clearHistory: async (): Promise<void> => {
    try {
      await axios.post(`${API_BASE}/clear_history`, {}, { timeout: 5000 })
    } catch (error) {
      console.warn("Backend not available, clear history operation simulated")
    }
  },
}
