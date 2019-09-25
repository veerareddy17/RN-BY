export const PaginatedResponseState = {
    total: 0,
    per_page: 5,
    current_page: 0,
    next_page_url: '',
    prev_page_url: '',
    data: [],
};

export const initialState = {
    paginatedLeadList: PaginatedResponseState,
    leadList: [],
    offlineLeadList: [],
    filteredPaginatedLeadList: PaginatedResponseState,
    filteredLeadList: [],
    status: '',
    isLoading: false,
    flag: '',
};

export const resetLeadState = {
    paginatedLeadList: PaginatedResponseState,
    leadList: [],
    offlineLeadList: [],
    filteredPaginatedLeadList: PaginatedResponseState,
    filteredLeadList: [],
    isLoading: false,
    flag: '',
};
