import { ErrorResponse } from './error-response';
export class ResponseViewModel<T> {
    errors: ErrorResponse[] = [];
    data: T | null = null;
}
