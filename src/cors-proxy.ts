const proxy = 'https://cors-proxy-sha-6d19c78.onrender.com/api/proxy?url=';
// const proxy = 'https://proxy.corsfix.com/?'; // fine on localhost

export const proxified = (url: string) => proxy + url;
