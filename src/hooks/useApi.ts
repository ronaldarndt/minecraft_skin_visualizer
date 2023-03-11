interface Response<T> {
  success: boolean;
  data?: T;
}

export default function useApi(baseUri: string) {
  async function get<T>(route: string): Promise<Response<T>> {
    const resp = await fetch(baseUri + "/" + route);

    if (!resp.ok) return { success: false };

    return { success: true, data: (await resp.json()) as T };
  }

  return { get };
}
