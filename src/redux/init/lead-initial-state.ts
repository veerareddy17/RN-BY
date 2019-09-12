export const PaginatedResponseState = {
    total: 0,
    per_page: 5,
    current_page: 1,
    next_page_url: '',
    prev_page_url: '',
    data: [],
};

export const initialState = {
    paginatedLeadList: PaginatedResponseState,
    leadList: [],
    offlineLeadList: [],
    status: '',
    isLoading: false,
    flag: '',
};
