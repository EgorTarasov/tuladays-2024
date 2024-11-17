import { z } from "zod";
import { buildQueryString, Search } from "./build-search";
import { authToken } from "./auth-token";
import { toast } from "sonner";

const baseUrl = "/api";

type Schema = z.ZodType<any, any, any>;
type Path = `/${string}`;

export interface Config<T extends Schema>
  extends Omit<RequestInit, "body" | "method"> {
  schema?: T;
}

const getConfig = <T extends Schema>(config?: Config<T>): Config<T> => ({
  ...config,
  headers: {
    Authorization: `Bearer ${authToken.get()}`,
    "Access-Control-Allow-Origin": "*",
    "Content-Type": "application/json",
    ...(config?.headers ?? {}),
  },
});

const handleError = (error: unknown) => {
  if (error instanceof Error) {
    toast.error("Error", {
      description:
        error.message || "There was an error processing your request",
    });
  } else if (error instanceof z.ZodError) {
    toast.error("Validation error", {
      description: error.errors.map((e) => e.message).join(", "),
    });
  } else {
    toast.error("Error", {
      description: "There was an error processing your request",
    });
  }
  console.error(error);
  throw error;
};

const handleRequest = async <T extends Schema>(
  req: (config?: Config<T>) => Promise<Response>,
  config?: Config<T>,
): Promise<z.infer<T>> => {
  try {
    const res = await req(getConfig(config));

    const contentType = res.headers.get("Content-Type") || "";
    if (!contentType.includes("application/json")) return {} as z.infer<T>;

    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }

    const data = (await res.json()) as z.infer<T>;

    return config?.schema ? config.schema.parse(data) : data;
  } catch (e) {
    handleError(e);
  }
};

const get = <T extends Schema>(
  path: Path,
  config?: Config<T> & { search?: Search },
): Promise<z.infer<T>> => {
  const queryString = buildQueryString(config?.search ?? {});

  return handleRequest(
    (c) => fetch(`${baseUrl}${path}${queryString}`, { ...c, method: "GET" }),
    config,
  );
};

const post = <T extends Schema>(
  path: Path,
  variables?: unknown,
  config?: Config<T>,
): Promise<z.infer<T>> =>
  handleRequest(
    (c) =>
      fetch(`${baseUrl}${path}`, {
        ...c,
        method: "POST",
        body: JSON.stringify(variables),
      }),
    config,
  );

const put = <T extends Schema>(
  path: Path,
  variables?: unknown,
  config?: Config<T>,
): Promise<z.infer<T>> =>
  handleRequest(
    (c) =>
      fetch(`${baseUrl}${path}`, {
        ...c,
        method: "PUT",
        body: JSON.stringify(variables),
      }),
    config,
  );

const del = <T extends Schema>(
  path: Path,
  variables?: unknown,
  config?: Config<T>,
): Promise<z.infer<T>> =>
  handleRequest(
    (c) =>
      fetch(`${baseUrl}${path}`, {
        ...c,
        method: "DELETE",
        body: JSON.stringify(variables),
      }),
    config,
  );

const patch = <T extends Schema>(
  path: Path,
  variables?: unknown,
  config?: Config<T>,
): Promise<z.infer<T>> =>
  handleRequest(
    (c) =>
      fetch(`${baseUrl}${path}`, {
        ...c,
        method: "PATCH",
        body: JSON.stringify(variables),
      }),
    config,
  );

export default {
  get,
  post,
  put,
  patch,
  delete: del,
};
