import api from "./axios";


// ========================================
// GET MY EDUCATION
// ========================================

export const getMyEducation = async() => {
    const response = await api.get("/education");

    return response.data;
};


// ========================================
// GET SINGLE EDUCATION
// ========================================

export const getEducation = async(educationId) => {
    const response = await api.get(
        `/education/${educationId}`
    );

    return response.data;
};


// ========================================
// CREATE EDUCATION
// ========================================

export const createEducation = async(data) => {
    const response = await api.post(
        "/education",
        data
    );

    return response.data;
};


// ========================================
// UPDATE EDUCATION
// ========================================

export const updateEducation = async(
    educationId,
    data
) => {
    const response = await api.patch(
        `/education/${educationId}`,
        data
    );

    return response.data;
};


// ========================================
// DELETE EDUCATION
// ========================================

export const deleteEducation = async(
    educationId
) => {
    const response = await api.delete(
        `/education/${educationId}`
    );

    return response.data;
};


// ========================================
// TOGGLE PUBLISHED
// ========================================

export const toggleEducationPublished = async(
    educationId
) => {
    const response = await api.patch(
        `/education/${educationId}/published`
    );

    return response.data;
};