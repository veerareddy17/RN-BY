export class ApiResponse<T> {
    errors: string[] = [];
    data: T | null = null;

    constructor(errors: string[], data: T) {
        this.errors = errors;
        this.data = data;
    }
}
