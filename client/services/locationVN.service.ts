import axios from 'axios';

export const locationVNService = {
    async getCities() {
        const res = await axios.get('https://provinces.open-api.vn/api/p');
        return res.data;
    },

    async getDistricts() {
        const res = await axios.get(`https://provinces.open-api.vn/api/d`);
        return res.data;
    },

    async getWards() {
        const res = await axios.get(`https://provinces.open-api.vn/api/w`);
        return res.data;
    },
};
