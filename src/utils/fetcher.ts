export class FetchError extends Error {
  constructor(
    message: string,
    public status: number,
  ) {
    super(message);
  }
}

export default async function fetcher<T>(
  url: string,
  options?: Parameters<typeof fetch>[1],
) {
  const response = await fetch(url, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options?.headers,
    },
  });

  if (!response.ok) {
    throw new FetchError(
      "An error occurred while fetching the data",
      response.status,
    );
  }

  const responseData: T = (await response.json()) as T;
  return responseData;
}

export type FilteredPaginatedFetcherProps<B> = {
  url: string;
  token: string;
  body: B;
  options?: Parameters<typeof fetch>[1];
};

export async function paginatedFetcher<T, B>({
  url,
  token,
  options,
  body,
}: FilteredPaginatedFetcherProps<B>) {
  const response = await fetch(url, {
    method: "POST",
    ...options,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
      ...options?.headers,
    },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    throw new Error("An error occurred while fetching the data");
  }

  const responseData: T = (await response.json()) as T;
  return responseData;
}
