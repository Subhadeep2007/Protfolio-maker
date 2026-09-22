import api from "./axios";


// ========================================
// GET MY PORTFOLIO
// ========================================

export const getMyPortfolio = async() => {

    const response =
        await api.get(
            "/portfolio/me"
        );

    return response.data;
};


// ========================================
// CREATE PORTFOLIO
// ========================================

export const createPortfolio = async(
    data
) => {

    const response =
        await api.post(
            "/portfolio",
            data
        );

    return response.data;
};


// ========================================
// UPDATE PORTFOLIO
// ========================================

export const updatePortfolio = async(
    data
) => {

    const response =
        await api.patch(
            "/portfolio",
            data
        );

    return response.data;
};


// ========================================
// PUBLISH PORTFOLIO
// ========================================

export const publishPortfolio = async() => {

    const response =
        await api.patch(
            "/portfolio/publish"
        );

    return response.data;
};


// ========================================
// UNPUBLISH PORTFOLIO
// ========================================

export const unpublishPortfolio = async() => {

    const response =
        await api.patch(
            "/portfolio/unpublish"
        );

    return response.data;
};


// ========================================
// DELETE PORTFOLIO
// ========================================

export const deletePortfolio = async() => {

    const response =
        await api.delete(
            "/portfolio"
        );

    return response.data;
};


// ========================================
// UPLOAD RESUME
// ========================================

export const uploadResume = async(
    file
) => {

    if (!file) {

        throw new Error(
            "Please select a resume"
        );

    }


    const formData =
        new FormData();


    formData.append(
        "resume",
        file
    );


    const response =
        await api.post(

            "/portfolio/resume/upload",

            formData,

            {
                headers: {
                    "Content-Type": "multipart/form-data"
                }
            }

        );


    return response.data;
};