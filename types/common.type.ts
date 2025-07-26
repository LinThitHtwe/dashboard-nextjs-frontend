export interface ApiResponse<T> {
	success: boolean;
	message: string;
	data: T | null;
	errorCode: string | null;
	meta?: Record<string, any>;
}
