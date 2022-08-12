/*
This script should excute by k6.
k6 install : brew install k6
*/
import http from 'k6/http';
import {sleep} from 'k6'


export function setup() {
	console.log('init-setup function')
}

export default function() {
	http.get('https://test.k6.io');
	sleep(1)
}

export function teardown(data) {
	console.log('teardown-teardown function')
}