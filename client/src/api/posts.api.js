import api from "./axios";


// ========================================
// GET MY POSTS
// ========================================

export const getMyPosts =
    async() => {

        const response =
            await api.get(
                "/posts"
            );

        return response.data;
    };


// ========================================
// GET SINGLE POST
// ========================================

export const getPost =
    async(postId) => {

        const response =
            await api.get(
                `/posts/${postId}`
            );

        return response.data;
    };


// ========================================
// CREATE POST
// ========================================

export const createPost =
    async(data) => {

        const response =
            await api.post(
                "/posts",
                data
            );

        return response.data;
    };


// ========================================
// UPDATE POST
// ========================================

export const updatePost =
    async(
        postId,
        data
    ) => {

        const response =
            await api.patch(
                `/posts/${postId}`,
                data
            );

        return response.data;
    };


// ========================================
// DELETE POST
// ========================================

export const deletePost =
    async(postId) => {

        const response =
            await api.delete(
                `/posts/${postId}`
            );

        return response.data;
    };


// ========================================
// TOGGLE PUBLISHED
// ========================================

export const togglePostPublished =
    async(postId) => {

        const response =
            await api.patch(
                `/posts/${postId}/published`
            );

        return response.data;
    };


// ========================================
// TOGGLE FEATURED
// ========================================

export const togglePostFeatured =
    async(postId) => {

        const response =
            await api.patch(
                `/posts/${postId}/featured`
            );

        return response.data;
    };


// ========================================
// INCREMENT VIEWS
// ========================================

export const incrementPostViews =
    async(postId) => {

        const response =
            await api.patch(
                `/posts/${postId}/views`
            );

        return response.data;
    }; // ========================================
// UPLOAD POST MEDIA
// ========================================

export const uploadPostMedia =
    async(file) => {

        if (!file) {
            throw new Error(
                "Please select a file"
            );
        }

        const formData =
            new FormData();

        formData.append(
            "media",
            file
        );

        const response =
            await api.post(
                "/posts/upload",
                formData, {
                    headers: {
                        "Content-Type": "multipart/form-data"
                    }
                }
            );

        return response.data.data;
    };