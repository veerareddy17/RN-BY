export class PaginatedResponseModel<T> {
    public total: number;
    public per_page: number;
    public current_page: number;
    public next_page_url: string | null;
    public prev_page_url: string | null;
    public data: T[];
}
