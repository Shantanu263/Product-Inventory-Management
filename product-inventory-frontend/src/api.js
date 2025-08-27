import axios from 'axios';

const BASE_PRODUCT_URL = 'http://localhost:8080/api/products';
const BASE_CATEGORY_URL = 'http://localhost:8080/api/categories';
export const BASE_URL = 'http://localhost:8080/api';
const BASE_RATING_URL = `${BASE_URL}/product-rating`;

// main axios instance used across the app
const api = axios.create();

// separate axios instance for refresh token calls (no interceptors)
const refreshInstance = axios.create();

let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach(prom => {
    if (error) prom.reject(error);
    else prom.resolve(token);
  });
  failedQueue = [];
};

// Attach access token to all requests (skip login/signup/refresh)
api.interceptors.request.use(
  (config) => {
    try {
      const accessToken = localStorage.getItem('accessToken');
      if (
        accessToken &&
        !config.url.includes('/auth/login') &&
        !config.url.includes('/auth/signup') &&
        !config.url.includes('/auth/refresh-token')
      ) {
        config.headers = config.headers || {};
        config.headers.Authorization = `Bearer ${accessToken}`;
      }
    } catch (e) {
      // ignore reading errors
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor to handle 401 -> refresh token
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const originalRequest = error.config;

    if (!originalRequest || !originalRequest.url) {
      return Promise.reject(error);
    }

    // Don't try to refresh for auth endpoints themselves
    if (
      originalRequest.url.includes('/auth/login') ||
      originalRequest.url.includes('/auth/signup') ||
      originalRequest.url.includes('/auth/refresh-token')
    ) {
      return Promise.reject(error);
    }

    // Only try to refresh on 403
    if (error.response && error.response.status === 403) {
      // if already retried once, reject
      if (originalRequest._retry) {
        return Promise.reject(error);
      }

      if (isRefreshing) {
        // queue the request until refresh finishes
        return new Promise(function (resolve, reject) {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest._retry = true;
            originalRequest.headers = originalRequest.headers || {};
            originalRequest.headers.Authorization = 'Bearer ' + token;
            return api(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      const refreshToken = localStorage.getItem('refreshToken');

      return new Promise(function (resolve, reject) {
        if (!refreshToken) {
          // no refresh token -> force logout only if not already on login page
          localStorage.clear();
          if (window.location.pathname !== '/login') {
            window.location.href = '/login';
          }
          reject(error);
          isRefreshing = false;
          return;
        }

        refreshInstance.post(`${BASE_URL}/auth/refresh-token`, { refreshToken })
          .then(({ data }) => {
            const newAccessToken = data.accessToken;
            if (!newAccessToken) {
              throw new Error('No accessToken in refresh response');
            }

            // persist new token & set global default for future requests
            localStorage.setItem('accessToken', newAccessToken);
            api.defaults.headers.common['Authorization'] = 'Bearer ' + newAccessToken;

            processQueue(null, newAccessToken);

            // retry original request with new token
            originalRequest.headers = originalRequest.headers || {};
            originalRequest.headers.Authorization = 'Bearer ' + newAccessToken;
            resolve(api(originalRequest));
          })
          .catch((err) => {
            processQueue(err, null);
            localStorage.clear();
            if (window.location.pathname !== '/login') {
              window.location.href = '/login';
            }
            reject(err);
          })
          .finally(() => {
            isRefreshing = false;
          });
      });
    }

    return Promise.reject(error);
  }
);

// ----------- Product APIs -----------
export const fetchProducts = (page, size, sortBy, order) =>
  api.get(`${BASE_PRODUCT_URL}?pageNumber=${page}&pageSize=${size}&sortBy=${sortBy}&order=${order}`);

export const searchProducts = (name, page, size, sortBy, order) =>
  api.get(`${BASE_PRODUCT_URL}/search?name=${name}&pageNumber=${page}&pageSize=${size}&sortBy=${sortBy}&order=${order}`);

export const fetchProductsByName = (name) =>
  api.get(`${BASE_PRODUCT_URL}/search?name=${name}&pageNumber=0&pageSize=15&sortBy=productId&order=asc`);

export const addProduct = (productData) =>
  api.post(BASE_PRODUCT_URL, productData);

export const deleteProductById = (id) =>
  api.delete(`${BASE_PRODUCT_URL}/${id}`);

export const updateProductById = (id, productData) =>
  api.put(`${BASE_PRODUCT_URL}/${id}`, productData, {
    headers: { "Content-Type": "multipart/form-data" }
  });

export const fetchProductById = (id) =>
  api.get(`${BASE_PRODUCT_URL}/${id}`);

export const getProductById = (id) =>
  api.get(`${BASE_PRODUCT_URL}/${id}`);

// ----------- Category APIs -----------
export const fetchCategories = () =>
  api.get(BASE_CATEGORY_URL);

export const fetchCategoryById = (id) =>
  api.get(`${BASE_CATEGORY_URL}/${id}`);

export const deleteCategory = (id) =>
  api.delete(`${BASE_CATEGORY_URL}/${id}`);

export const addCategory = (categoryData) =>
  api.post(BASE_CATEGORY_URL, categoryData);

export const updateCategoryById = (id, categoryData) =>
  api.put(`${BASE_CATEGORY_URL}/${id}`, categoryData);

export const createCategory = (categoryDTO) =>
  api.post(BASE_CATEGORY_URL, categoryDTO);

// ----------- Auth APIs -----------
export const loginUser = (credentials) =>
  axios.post(`${BASE_URL}/auth/login`, credentials);

export const signup = (userDetails) =>
  axios.post(`${BASE_URL}/auth/signup`, userDetails);

export const logoutUser = () => {
  const accessToken = localStorage.getItem('accessToken');
  api.defaults.headers.common['Authorization'] = '';
  localStorage.clear();
  return axios.post(`${BASE_URL}/auth/logout`, {}, {
    headers: { Authorization: `Bearer ${accessToken}` }
  });
};

// ----------- Cart APIs -----------
export const addToCart = (productId, quantity) =>
  api.post(`${BASE_URL}/cart/add?productId=${productId}&quantity=${quantity}`);

export const getCart = () =>
  api.get(`${BASE_URL}/cart`);

export const removeFromCart = (itemId) =>
  api.delete(`${BASE_URL}/cart/${itemId}`);

export const updateCartQuantity = (itemId, quantity) =>
  api.put(`${BASE_URL}/cart/${itemId}?quantity=${quantity}`);

// ----------- Order APIs -----------
export const placeOrder = () =>
  api.post(`${BASE_URL}/orders/place`);

export const getOrders = () =>
  api.get(`${BASE_URL}/orders`);

export const getOrderById = (orderId) =>
  api.get(`${BASE_URL}/orders/${orderId}`);

// ----------- Rating APIs -----------
export const getUserProductRating = (productId) =>
  api.get(`${BASE_RATING_URL}/${productId}`);

export const rateProduct = (productId, rating) =>
  api.post(`${BASE_RATING_URL}/${productId}/rate`, null, { params: { rating } });


