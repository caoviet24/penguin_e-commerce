
import axios from "axios";

export function getLocation() {
  return new Promise(async (resolve, reject) => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          resolve(await reverseGeocode(latitude, longitude));
        },
        (error) => {
          reject(error);
        }
      );
    } else {
      reject({ error: 'Geolocation not supported' });
    }
  })
};

function reverseGeocode(latitude: any, longitude: any) {
  const apiKey = process.env.NEXT_PUBLIC_OPENCAGE_API_KEY;
  const url = `https://api.opencagedata.com/geocode/v1/json?q=${latitude}+${longitude}&key=${apiKey}&language=vi`;

  return new Promise(async (resolve, reject) => {
    await axios.get(url)
      .then((response) => {
        const { county, state, suburb, townm, city } = response.data.results[0].components;

        console.log(response.data.results[0].components);
        
        resolve({ district: county || suburb || townm , province: state || city });
      })
      .catch((error) => {
        reject({ error: error.message });
      });
  })
};