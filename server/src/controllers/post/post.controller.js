import {
    createPost,
    getMyPosts,
    getPostById,
    updatePost,
    deletePost,
    togglePostPublished,
    togglePostFeatured,
    incrementPostViews
} from "../../services/post/post.service.js";
import uploadPostMedia
from "../../services/post/postUpload.service.js";

// ========================================
// CREATE POST
// ========================================

const create = async(
    req,
    res,
    next
) => {

    try {

        const post =
            await createPost(
                req.user.userId,
                req.body
            );

        return res.status(201).json({

            success: true,

            message: "Post created successfully",

            data: post

        });

    } catch (error) {

        next(error);

    }
};

// ========================================
// UPLOAD POST MEDIA
// ========================================

// ========================================
// UPLOAD POST MEDIA
// ========================================

const uploadMedia = async(
    req,
    res,
    next
) => {

    try {

        console.log(
            "UPLOAD REQUEST RECEIVED"
        );

        console.log(
            "REQ FILE:",
            req.file
        );

        console.log(
            "REQ BODY:",
            req.body
        );


        if (!req.file) {

            const error =
                new Error(
                    "Post file was not received by server"
                );

            error.statusCode = 400;

            throw error;
        }


        const result =
            await uploadPostMedia(
                req.file
            );


        return res.status(200).json({

            success: true,

            message: "Post media uploaded successfully",

            data: {

                url: result.url,

                publicId: result.publicId,

                resourceType: result.resourceType,

                format: result.format,

                originalName: result.originalName,

                mimeType: result.mimeType,

                size: result.size,

                width: result.width,

                height: result.height,

                duration: result.duration

            }

        });

    } catch (error) {

        console.error(
            "POST MEDIA UPLOAD ERROR:",
            error
        );

        next(error);

    }
};
// ========================================
// GET MY POSTS
// ========================================

const getMy = async(
    req,
    res,
    next
) => {

    try {

        const posts =
            await getMyPosts(
                req.user.userId
            );

        return res.status(200).json({

            success: true,

            message: "Posts fetched successfully",

            data: posts

        });

    } catch (error) {

        next(error);

    }
};


// ========================================
// GET SINGLE POST
// ========================================

const getOne = async(
    req,
    res,
    next
) => {

    try {

        const post =
            await getPostById(
                req.user.userId,
                req.params.postId
            );

        return res.status(200).json({

            success: true,

            message: "Post fetched successfully",

            data: post

        });

    } catch (error) {

        next(error);

    }
};


// ========================================
// UPDATE POST
// ========================================

const update = async(
    req,
    res,
    next
) => {

    try {

        const post =
            await updatePost(

                req.user.userId,

                req.params.postId,

                req.body

            );

        return res.status(200).json({

            success: true,

            message: "Post updated successfully",

            data: post

        });

    } catch (error) {

        next(error);

    }
};


// ========================================
// DELETE POST
// ========================================

const remove = async(
    req,
    res,
    next
) => {

    try {

        const result =
            await deletePost(

                req.user.userId,

                req.params.postId

            );

        return res.status(200).json({

            success: true,

            message: result.message

        });

    } catch (error) {

        next(error);

    }
};


// ========================================
// PUBLISH / UNPUBLISH
// ========================================

const togglePublished = async(
    req,
    res,
    next
) => {

    try {

        const post =
            await togglePostPublished(

                req.user.userId,

                req.params.postId

            );

        return res.status(200).json({

            success: true,

            message: post.isPublished ?
                "Post published successfully" : "Post unpublished successfully",

            data: post

        });

    } catch (error) {

        next(error);

    }
};


// ========================================
// FEATURE / UNFEATURE
// ========================================

const toggleFeatured = async(
    req,
    res,
    next
) => {

    try {

        const post =
            await togglePostFeatured(

                req.user.userId,

                req.params.postId

            );

        return res.status(200).json({

            success: true,

            message: post.isFeatured ?
                "Post featured successfully" : "Post unfeatured successfully",

            data: post

        });

    } catch (error) {

        next(error);

    }
};


// ========================================
// INCREMENT VIEWS
// ========================================

const incrementViews = async(
    req,
    res,
    next
) => {

    try {

        const post =
            await incrementPostViews(
                req.params.postId
            );

        return res.status(200).json({

            success: true,

            message: "Post view recorded",

            data: {

                views: post.views

            }

        });

    } catch (error) {

        next(error);

    }
};


export {

    create,
    getMy,
    getOne,
    update,
    remove,
    togglePublished,
    toggleFeatured,
    incrementViews,
    uploadMedia

};