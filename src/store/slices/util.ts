import asAPIError from '../../components/util/asAPIError';

export const wrapAPIError = error => {
	const apiError = asAPIError(error);
	if (apiError) {
		return Promise.reject(new Error(apiError));
	}
	return Promise.reject(error);
};
