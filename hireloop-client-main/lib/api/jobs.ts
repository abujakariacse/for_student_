import { JobFormData } from "../types/job";

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000";

export const getJobs = async (query = ''): Promise<JobFormData[]> => {
    const response = await fetch(`${BASE_URL}/jobs?${query}`, {
        method: "GET",
        headers: {
            "content-type": "application/json",
        },
    });
    if (!response.ok) return [];
    return response.json();
};

export const getDetailsPage = async (id: string) => {
  try {
    const res = await fetch(`${BASE_URL}/jobs/${id}`, {
      cache: "no-store",
    });

    if (!res.ok) {
      console.error("Job details error:", await res.text());
      return null;
    }

    return await res.json();
  } catch (error) {
    console.error("Failed to fetch job:", error);
    return null;
  }
};