import api from "./axios";


// ========================================
// GET MY EXPERIENCES
// ========================================

export const getMyExperiences = async() => {

    const response =
        await api.get("/experiences");

    return response.data;

};


// ========================================
// GET SINGLE EXPERIENCE
// ========================================

export const getExperience = async(
    experienceId
) => {

    const response =
        await api.get(
            `/experiences/${experienceId}`
        );

    return response.data;

};


// ========================================
// CREATE EXPERIENCE
// ========================================

export const createExperience = async(
    data
) => {

    const response =
        await api.post(
            "/experiences",
            data
        );

    return response.data;

};


// ========================================
// UPDATE EXPERIENCE
// ========================================

export const updateExperience = async(
    experienceId,
    data
) => {

    const response =
        await api.patch(
            `/experiences/${experienceId}`,
            data
        );

    return response.data;

};


// ========================================
// DELETE EXPERIENCE
// ========================================

export const deleteExperience = async(
    experienceId
) => {

    const response =
        await api.delete(
            `/experiences/${experienceId}`
        );

    return response.data;

};


// ========================================
// TOGGLE PUBLISHED
// ========================================

export const toggleExperiencePublished =
    async(
        experienceId
    ) => {

        const response =
            await api.patch(
                `/experiences/${experienceId}/published`
            );

        return response.data;

    };