import api from "./axios";

export const getAdminDashboard = async() => {
    const response = await api.get(
        "/admin/dashboard"
    );

    return response.data;
};


export const getAdminUsers = async() => {
    const response = await api.get(
        "/admin/users"
    );

    return response.data;
};


export const getAdminUserDetails = async(
    userId
) => {
    const response = await api.get(
        `/admin/users/${userId}`
    );

    return response.data;
};


export const activateAdminUser = async(
    userId
) => {
    const response = await api.patch(
        `/admin/users/${userId}/activate`
    );

    return response.data;
};


export const deactivateAdminUser = async(
    userId
) => {
    const response = await api.patch(
        `/admin/users/${userId}/deactivate`
    );

    return response.data;
};


export const deleteAdminUser = async(
    userId
) => {
    const response = await api.delete(
        `/admin/users/${userId}`
    );

    return response.data;
};


export const getAdminPortfolios = async() => {
    const response = await api.get(
        "/admin/portfolios"
    );

    return response.data;
};


export const getAdminPortfolioDetails = async(
    portfolioId
) => {
    const response = await api.get(
        `/admin/portfolios/${portfolioId}`
    );

    return response.data;
};


export const getAdminStatistics = async() => {
    const response = await api.get(
        "/admin/statistics"
    );

    return response.data;
};