import api from "./axios";


// ========================================
// GET MY SKILLS
// ========================================

export const getMySkills = async() => {

    const response =
        await api.get("/skills");

    return response.data;

};


// ========================================
// GET SINGLE SKILL
// ========================================

export const getSkill = async(
    skillId
) => {

    const response =
        await api.get(
            `/skills/${skillId}`
        );

    return response.data;

};


// ========================================
// CREATE SKILL
// ========================================

export const createSkill = async(
    data
) => {

    const response =
        await api.post(
            "/skills",
            data
        );

    return response.data;

};


// ========================================
// UPDATE SKILL
// ========================================

export const updateSkill = async(
    skillId,
    data
) => {

    const response =
        await api.patch(
            `/skills/${skillId}`,
            data
        );

    return response.data;

};


// ========================================
// DELETE SKILL
// ========================================

export const deleteSkill = async(
    skillId
) => {

    const response =
        await api.delete(
            `/skills/${skillId}`
        );

    return response.data;

};


// ========================================
// TOGGLE PUBLISHED
// ========================================

export const toggleSkillPublished =
    async(
        skillId
    ) => {

        const response =
            await api.patch(
                `/skills/${skillId}/published`
            );

        return response.data;

    };