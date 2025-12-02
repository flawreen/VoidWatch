import axios from 'axios';

const apiClient = axios.create({
	baseURL: 'http://localhost:8080',
	timeout: 1000,
	headers: {
		'Content-Type': 'application/json',
	},
});

export const get = async (url, params = {}) => {
	try {
		const response = await apiClient.get(url, { params });
		return response.data;
	} catch (error) {
		handleError(error);
		throw error;
	}
};

export const post = async (url, payload) => {
	try {
		const response = await apiClient.post(url, payload);
		return response.data;
	} catch (error) {
		handleError(error);
		throw error;
	}
};

const handleError = (error) => {
	if (error.response) {
		console.error('Server error:', error.response.status, error.response.data);
	} else if (error.request) {
		console.error('No response received:', error.request);
	} else {
		console.error('Error:', error.message);
	}
};
