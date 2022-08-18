/*
This script should excute by k6.
k6 install : brew install k6
*/
import http from 'k6/http';
import { sleep, check } from 'k6'

export const options = {
	vus : 10, // virtual user
	duration : '10s', // running time

	// stages: [
	// 	{ duration: '30s', target: 20 },
	// 	{ duration: '1m30s', target: 10 },
	// 	{ duration: '20s', target: 0 },
	// ],
}

export function setup() {
	console.log('init-setup function')
}

export default function() {
	const res = http.get('http://localhost:8080/health-check');
	check(res, {'status 200 : ': (r) => {
			const body = JSON.parse(r.body)
			return body.status === true
		}
	})
}

export function teardown(data) {
	console.log('teardown-teardown function')
}