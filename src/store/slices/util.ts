import { AnyAction, ThunkDispatch } from '@reduxjs/toolkit';
import asAPIError from '../../components/util/asAPIError';
import { setJWT } from './AuthSlice';

export const wrapAPIError = (error: any, dispatch: ThunkDispatch<unknown, unknown, AnyAction>) => {
	const apiError = asAPIError(error);
	if (apiError && (
		(error?.response?.status === 401 && error?.response?.data?.error === 'Authorization token is invalid') ||
		(error?.response?.data?.error === 'User given by token not found')
	)) {
		dispatch(setJWT(null));
	}
	if (apiError) {
		return Promise.reject(new Error(apiError));
	}
	return Promise.reject(error);
};
