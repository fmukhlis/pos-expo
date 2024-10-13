export const useCustomFetch = () => {
    const baseURL = process.env.EXPO_PUBLIC_BASE_URL
    const baseHeaders = {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
    }

    const request = async (relativeURL: string, init: RequestInit = {}) => {
        const { method = 'GET', headers, ...rest } = init
        const mergedUrl = baseURL + relativeURL
        const mergedHeaders = {
            ...baseHeaders,
            ...headers,
        }

        const response = await fetch(mergedUrl, {
            method,
            headers: mergedHeaders,
            ...rest,
        })

        return response
    }

    return {
        /**
         * Perform an HTTP GET request to the specified URL (The base url is http://192.168.107.52:8000/api/v1)
         * 
         * @param relativeURL - The relative url.
         * @param init - Configuration for the request, excluding the `method` prop.
         * @returns A promise that resolves to HTTP response
         */
        get: (relativeURL: string, init: Omit<RequestInit, 'method'> = {}) => request(relativeURL, { method: 'GET', ...init }),
        /**
         * Perform an HTTP POST request to the specified URL (The base url is http://192.168.107.52:8000/api/v1)
         * 
         * @param relativeURL - The relative url.
         * @param init - Configuration for the request, excluding the `method` prop.
         * @returns A promise that resolves to HTTP response
         */
        post: (relativeURL: string, init: Omit<RequestInit, 'method'> = {}) => request(relativeURL, { method: 'POST', ...init }),
        /**
         * Perform an HTTP PATCH request to the specified URL (The base url is http://192.168.107.52:8000/api/v1)
         * 
         * @param relativeURL - The relative url.
         * @param init - Configuration for the request, excluding the `method` prop.
         * @returns A promise that resolves to HTTP response
         */
        patch: (relativeURL: string, init: Omit<RequestInit, 'method'> = {}) => request(relativeURL, { method: 'PATCH', ...init }),
        /**
         * Perform an HTTP PUT request to the specified URL (The base url is http://192.168.107.52:8000/api/v1)
         * 
         * @param relativeURL - The relative url.
         * @param init - Configuration for the request, excluding the `method` prop.
         * @returns A promise that resolves to HTTP response
         */
        put: (relativeURL: string, init: Omit<RequestInit, 'method'> = {}) => request(relativeURL, { method: 'PUT', ...init }),
        /**
         * Perform an HTTP DELETE request to the specified URL (The base url is http://192.168.107.52:8000/api/v1)
         * 
         * @param relativeURL - The relative url.
         * @param init - Configuration for the request, excluding the `method` prop.
         * @returns A promise that resolves to HTTP response
         */
        delete: (relativeURL: string, init: Omit<RequestInit, 'method'> = {}) => request(relativeURL, { method: 'DELETE', ...init }),
    }
}