import api from "./axios";


// ========================================
// GET MY CERTIFICATES
// ========================================

export const getMyCertificates =
    async() => {

        const response =
            await api.get(
                "/certificates"
            );

        return response.data;
    };


// ========================================
// GET SINGLE
// ========================================

export const getCertificate =
    async(
        certificateId
    ) => {

        const response =
            await api.get(
                `/certificates/${certificateId}`
            );

        return response.data;
    };


// ========================================
// CREATE
// ========================================

export const createCertificate =
    async(data) => {

        const response =
            await api.post(
                "/certificates",
                data
            );

        return response.data;
    };


// ========================================
// UPDATE
// ========================================

export const updateCertificate =
    async(
        certificateId,
        data
    ) => {

        const response =
            await api.patch(
                `/certificates/${certificateId}`,
                data
            );

        return response.data;
    };


// ========================================
// DELETE
// ========================================

export const deleteCertificate =
    async(
        certificateId
    ) => {

        const response =
            await api.delete(
                `/certificates/${certificateId}`
            );

        return response.data;
    };


// ========================================
// TOGGLE PUBLISHED
// ========================================

export const toggleCertificatePublished =
    async(
        certificateId
    ) => {

        const response =
            await api.patch(
                `/certificates/${certificateId}/published`
            );

        return response.data;
    };


// ========================================
// UPLOAD FILE
// ========================================

export const uploadCertificateFile =
    async(file) => {

        const formData =
            new FormData();

        formData.append(
            "certificate",
            file
        );

        const response =
            await api.post(
                "/certificates/upload",
                formData, {
                    headers: {
                        "Content-Type": "multipart/form-data"
                    }
                }
            );

        return response.data;
    };