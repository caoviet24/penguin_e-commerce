import axios, { AxiosResponse } from 'axios';

interface Video {
  link: string;
  title: string;
  duration: number;
  description: string;
}

const accessToken: string = 'c333f6dcf0822c86f599649cd26ed777'; 

export default function getRandomVideo(): Promise<Video> {
  return new Promise((resolve, reject) => {
    axios.get('https://api.vimeo.com/videos', {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      params: {
        query: 'random',
        per_page: 1, 
      },
    })
    .then((response: AxiosResponse) => {
      if (response.data.data && response.data.data.length > 0) {
        const video: Video = response.data.data[0];
        resolve(video);
      } else {
        reject('Không có video nào được tìm thấy');
      }
    })
    .catch(error => {
      reject('Lỗi khi gọi API Vimeo: ' + error.message);
    });
  });
};

