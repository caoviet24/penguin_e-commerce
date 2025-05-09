import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import Cookies from 'js-cookie';

interface RefreshTokenResponse {
    access_token: string;
    refresh_token: string;
}

function fetchRefreshToken(token: string): Promise<RefreshTokenResponse> {
    return new Promise(async (resolve, reject) => {
        try {
            const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/auth/refresh-token`, {
                headers: {
                    refresh_token: token,
                },
            });
            resolve(res.data);
        } catch (error) {
            reject(error);
        }
    });
}

function createAxiosJwtInstance() {
    const axiosJWT = axios.create();
    axiosJWT.interceptors.request.use(
        async (config) => {
            const accessToken = Cookies.get('access_token');
            const refresh_token = Cookies.get('refresh_token');
            if (!accessToken) {
                if (refresh_token) {
                    const res = await fetchRefreshToken(refresh_token);
                    if (res) {
                        Cookies.set('access_token', res.access_token);
                        Cookies.set('refresh_token', res.refresh_token);
                        config.headers.Authorization = `Bearer ${res.access_token}`;
                    }

                    return config;
                }

                throw new Error('Access token is missing');
            }
            const decodedToken = jwtDecode(accessToken);
            if (decodedToken.exp && decodedToken.exp < new Date().getTime() / 1000) {
                if (!refresh_token) {
                    throw new Error('Refresh token is missing');
                }
                const res = await fetchRefreshToken(refresh_token);
                if (res) {
                    Cookies.set('access_token', res.access_token);
                    Cookies.set('refresh_token', res.refresh_token);
                    config.headers.Authorization = `Bearer ${res.access_token}`;
                }
            } else {
                config.headers.Authorization = `Bearer ${accessToken}`;
            }
            return config;
        },
        (err) => {
            return Promise.reject(err);
        },
    );

    return axiosJWT;
}

const axiosJWT = createAxiosJwtInstance();

export default axiosJWT;
