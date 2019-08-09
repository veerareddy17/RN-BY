export class ResponseViewModel<T> {
    errors: string[] = [];
    data: T | null = null;
}
