export default function asAPIError(error: any): string|undefined {
	if (error?.response?.data?.error) {
		return error.response.data.error as string;
	}
}
