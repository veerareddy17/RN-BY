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
    nonVerifiedFilteredLeadList: [],
    verifiedFilteredLeadList: [],
    verifiedFilteredPaginatedLeadList: PaginatedResponseState,
    nonVerifiedFilteredPaginatedLeadList: PaginatedResponseState,
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
    nonVerifiedFilteredLeadList: [],
    verifiedFilteredLeadList: [],
    verifiedFilteredPaginatedLeadList: PaginatedResponseState,
    nonVerifiedFilteredPaginatedLeadList: PaginatedResponseState,
    isLoading: false,
    flag: '',
};
