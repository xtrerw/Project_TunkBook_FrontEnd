export const decodeJwtPayload = (token) => {
  try {
    const payload = token.split(".")[1];
    if (!payload) return null;

    const base64 = payload.replace(/-/g, "+").replace(/_/g, "/");
    const json = decodeURIComponent(
      atob(base64)
        .split("")
        .map((char) => `%${char.charCodeAt(0).toString(16).padStart(2, "0")}`)
        .join("")
    );

    return JSON.parse(json);
  } catch (error) {
    console.error("Error al decodificar el token:", error);
    return null;
  }
};

export const getAuthenticatedUser = (responseData) => {
  const data = responseData?.data ?? responseData;

  if (!data) return null;
  if (typeof data === "object") return data;
  if (typeof data === "string") return decodeJwtPayload(data);

  return null;
};
