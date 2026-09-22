import api from "./axios";


// ========================================
// GET MY PROJECTS
// ========================================

export const getMyProjects = async() => {

    const response =
        await api.get("/projects");

    return response.data;

};


// ========================================
// GET SINGLE PROJECT
// ========================================

export const getProject = async(
    projectId
) => {

    const response =
        await api.get(
            `/projects/${projectId}`
        );

    return response.data;

};


// ========================================
// CREATE PROJECT
// ========================================

export const createProject = async(
    data
) => {

    const response =
        await api.post(
            "/projects",
            data
        );

    return response.data;

};


// ========================================
// UPDATE PROJECT
// ========================================

export const updateProject = async(
    projectId,
    data
) => {

    const response =
        await api.patch(
            `/projects/${projectId}`,
            data
        );

    return response.data;

};


// ========================================
// DELETE PROJECT
// ========================================

export const deleteProject = async(
    projectId
) => {

    const response =
        await api.delete(
            `/projects/${projectId}`
        );

    return response.data;

};


// ========================================
// TOGGLE FEATURED
// ========================================

export const toggleProjectFeatured =
    async(
        projectId
    ) => {

        const response =
            await api.patch(
                `/projects/${projectId}/featured`
            );

        return response.data;

    };


// ========================================
// TOGGLE PUBLISHED
// ========================================

export const toggleProjectPublished =
    async(
        projectId
    ) => {

        const response =
            await api.patch(
                `/projects/${projectId}/published`
            );

        return response.data;

    };