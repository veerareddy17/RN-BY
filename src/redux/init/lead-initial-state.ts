export const PaginatedResponseState = {
    total: 0,
    per_page: 5,
    current_page: 0,
    next_page_url: '',
    prev_page_url: '',
    data: [],
};

export const initialState = {
    verifiedPaginatedLeadList: PaginatedResponseState,
    verifiedLeadList: [],
    nonVerifiedPaginatedLeadList: PaginatedResponseState,
    nonVerifiedLeadList: [],
    offlineLeadList: [],
    verifiedFilteredPaginatedLeadList: PaginatedResponseState,
    nonVerifiedFilteredLeadList: [],
    status: '',
    isLoading: false,
    flag: '',
};

export const resetLeadState = {
    verifiedPaginatedLeadList: PaginatedResponseState,
    verifiedLeadList: [],
    nonVerifiedPaginatedLeadList: PaginatedResponseState,
    nonVerifiedLeadList: [],
    offlineLeadList: [],
    verifiedFilteredPaginatedLeadList: PaginatedResponseState,
    nonVerifiedFilteredLeadList: [],
    isLoading: false,
    flag: '',
};
