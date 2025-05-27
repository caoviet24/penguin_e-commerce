import axios from 'axios';

function reverseGeocode(latitude: number, longitude: number) {
    const apiKey = process.env.NEXT_PUBLIC_OPENCAGE_API_KEY;
    const url = `https://api.opencagedata.com/geocode/v1/json?q=${latitude}+${longitude}&key=${apiKey}&language=vi`;

    return new Promise(async (resolve, reject) => {
        await axios
            .get(url)
            .then((response) => {
                const { county, state, suburb, townm, city } = response.data.results[0].components;

                console.log(response.data.results[0].components);

                resolve({
                    county: county || '',
                    state: state || '',
                    suburb: suburb || '',
                    townm: townm || '',
                    city: city || '',
                    formatted_address: response.data.results[0].formatted,
                });
            })
            .catch((error) => {
                reject({ error: error.message });
            });
    });
}

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

    getCurrentLocation() {
        return new Promise(async (resolve, reject) => {
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(
                    async (position) => {
                        const { latitude, longitude } = position.coords;
                        resolve(await reverseGeocode(latitude, longitude));
                    },
                    (error) => {
                        reject(error);
                    },
                );
            } else {
                reject({ error: 'Geolocation not supported' });
            }
        });
    },
};
