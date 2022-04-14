import http from 'k6/http';
import { check, sleep, group } from 'k6';
import { Counter, Rate } from 'k6/metrics';

const ErrorCount = new Counter('errors');
const ErrorRate = new Rate('error_rate');

export const options = {
insecureSkipTLSVerify: true,
noConnectionReuse: false,
  stages: [
    { duration: '1m', target: 100 }, // below normal load
    { duration: '1m', target: 450 }, // normal load
    { duration: '1m', target: 0 }, // scale down. Recovery stage
  ],
    thresholds: {
      error_rate: ['rate<0.1']
    }
};

// export const options = {
//   vus: 10,
//   duration: '6s'
// };

export default function() {
    const url = 'http://reqres.in/api/users?page=2';
    const params = { 
        headers: {
            // 'Authorization': 'hide for secure',
            'Content-Type': 'application/json',
        },
    };

    group('List User', (_) => {
    const user_response = http.get(
        url,
        params
    );

    const success =  check(user_response, {
        'status is 200': (r) => r.status == 200,
        'status is not 200': (r) => r.status != 200,
        'transaction time OK': (r) => r.timings.duration < 1000
    });
    if (!success) {
        ErrorCount.add(1);
        ErrorRate.add(true);
      } else {
        ErrorRate.add(false);
      }
    sleep(1);
    });
}