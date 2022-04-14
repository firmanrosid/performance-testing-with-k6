import http from 'k6/http';
import { check, sleep, group } from 'k6';
import { Counter, Rate } from 'k6/metrics';

const ErrorCount = new Counter('errors');
const ErrorRate = new Rate('error_rate');

// export const options = {
// insecureSkipTLSVerify: true,
// noConnectionReuse: false,
//   stages: [
//     { duration: '1m', target: 100 }, // below normal load
//     { duration: '1m', target: 350 }, // normal load
//     { duration: '1m', target: 0 }, // scale down. Recovery stage
//   ],
//     thresholds: {
//       error_rate: ['rate<0.1']
//     }
// };

export const options = {
  vus: 500,
  duration: '10s',
  thresholds: {
    error_rate: ['rate<0.1']
  }
};

export default function () {
  const url = 'http://reqres.in/api/register';
  const payload = JSON.stringify({
    email: 'eve.holt@reqres.in',
    password: 'pistol'
  });

  const params = {
    headers: {
      'Content-Type': 'application/json',
    },
  };

  group('Register', (_) => {
    const reg_response = http.post(
      url,
      payload,
      params,
    );

    const success = check(reg_response, {
      'status is 200': (r) => r.status == 200,
      'status is not 200': (r) => r.status != 200,
      'transaction time OK': (r) => r.timings.duration < 1000, // waktu request yang kurang dari 500ms
    });
    if (!success) {
      ErrorCount.add(1);
      ErrorRate.add(true);
    } else {
      ErrorRate.add(false);
    }
    sleep(0.5);
    
  });
  // group('Register', (_) => {
  //   const response = http.post(url, payload, params);  
  // }),
  
  // const status = Math.random() < 0.9 ? '200' : '500';
  // console.log(payload);
  // console.log(status);

}