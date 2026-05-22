export const apiConfig = {
  apiPath: "/api/v1",
  baseUrl: process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000"
};

export function getApiUrl(path: string) {
  return `${apiConfig.baseUrl}${apiConfig.apiPath}${path}`;
}
