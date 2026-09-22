import Portfolio from "../../models/portfolio.model.js";
import Project from "../../models/project.model.js";
import Skill from "../../models/skill.model.js";
import Experience from "../../models/experience.model.js";
import Education from "../../models/education.model.js";
import Certificate from "../../models/certificate.model.js";
import Post from "../../models/post.model.js";


// ========================================
// HELPER: CLEAN USERNAME
// ========================================

const makeUsernameBase = (value = "") => {

    return value
        .toString()
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9_]/g, "")
        .slice(0, 24);

};


// ========================================
// HELPER: CLEAN SLUG
// ========================================

const makeSlugBase = (value = "") => {

    return value
        .toString()
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9-]+/g, "-")
        .replace(/^-+|-+$/g, "")
        .slice(0, 44);

};


// ========================================
// GENERATE UNIQUE USERNAME
// ========================================

const generateUniqueUsername = async(
    requestedUsername,
    title,
    userId
) => {

    let base =
        makeUsernameBase(requestedUsername) ||
        makeUsernameBase(title) ||
        `user_${userId.toString().slice(-8)}`;

    if (base.length < 3) {

        base =
            `user_${userId
                .toString()
                .slice(-8)}`;

    }

    let username = base;

    let counter = 1;

    while (
        await Portfolio.exists({
            username
        })
    ) {

        const suffix = `_${counter}`;

        username =
            `${base.slice(
                0,
                30 - suffix.length
            )}${suffix}`;

        counter++;

    }

    return username;

};


// ========================================
// GENERATE UNIQUE SLUG
// ========================================

const generateUniqueSlug = async(
    requestedSlug,
    username,
    title
) => {

    let base =
        makeSlugBase(requestedSlug) ||
        makeSlugBase(username) ||
        makeSlugBase(title) ||
        "portfolio";

    if (base.length < 3) {

        base = "portfolio";

    }

    let slug = base;

    let counter = 1;

    while (
        await Portfolio.exists({
            slug
        })
    ) {

        const suffix = `-${counter}`;

        slug =
            `${base.slice(
                0,
                50 - suffix.length
            )}${suffix}`;

        counter++;

    }

    return slug;

};


// ========================================
// CREATE PORTFOLIO
// ========================================

const createPortfolio = async(
    userId,
    data
) => {

    // ====================================
    // ONE PORTFOLIO PER USER
    // ====================================

    const existingPortfolio =
        await Portfolio.findOne({
            owner: userId
        });

    if (existingPortfolio) {

        const error = new Error(
            "You already have a portfolio"
        );

        error.statusCode = 409;

        throw error;

    }


    // ====================================
    // GENERATE USERNAME
    // ====================================

    const username =
        await generateUniqueUsername(
            data.username,
            data.title,
            userId
        );


    // ====================================
    // GENERATE SLUG
    // ====================================

    const slug =
        await generateUniqueSlug(
            data.slug,
            username,
            data.title
        );


    // ====================================
    // CREATE
    // ====================================

    const portfolio =
        await Portfolio.create({

            owner: userId,

            username,

            slug,

            title: data.title || "",

            headline: data.headline || "",

            bio: data.bio || "",

            profileImage: data.profileImage || "",

            location: data.location || "",

            email: data.email || "",

            phone: data.phone || "",

            github: data.github || "",

            linkedin: data.linkedin || "",

            twitter: data.twitter || "",

            instagram: data.instagram || "",

            youtube: data.youtube || "",

            website: data.website || "",

            resume: data.resume || {},

            theme: data.theme || "system",

            template: data.template || "modern",

            customization: data.customization || {},

            showAboutSection: data.showAboutSection !== undefined ?
                data.showAboutSection :
                true,

            showContactSection: data.showContactSection !== undefined ?
                data.showContactSection :
                true,

            showProjectsSection: data.showProjectsSection !== undefined ?
                data.showProjectsSection :
                true,

            showSkillsSection: data.showSkillsSection !== undefined ?
                data.showSkillsSection :
                true,

            showExperienceSection: data.showExperienceSection !== undefined ?
                data.showExperienceSection :
                true,

            showEducationSection: data.showEducationSection !== undefined ?
                data.showEducationSection :
                true,

            showCertificatesSection: data.showCertificatesSection !== undefined ?
                data.showCertificatesSection :
                true,

            showPostsSection: data.showPostsSection !== undefined ?
                data.showPostsSection :
                true,

            seo: data.seo || {},

            isPublished: false

        });


    return portfolio;

};


// ========================================
// GET MY PORTFOLIO
// ========================================

const getMyPortfolio = async(
    userId
) => {

    const portfolio =
        await Portfolio.findOne({
            owner: userId
        }).populate(
            "owner",
            "name email profileImage role"
        );


    if (!portfolio) {

        const error = new Error(
            "Portfolio not found"
        );

        error.statusCode = 404;

        throw error;

    }


    return portfolio;

};


// ========================================
// GET PUBLIC PORTFOLIO
// ========================================

const getPublicPortfolio = async(
    slug
) => {

    // ====================================
    // GET PUBLISHED PORTFOLIO
    // ====================================

    const portfolio =
        await Portfolio.findOne({

            slug: slug.toLowerCase(),

            isPublished: true,

            isActive: true

        }).populate(
            "owner",
            "name profileImage"
        );


    if (!portfolio) {

        const error = new Error(
            "Portfolio not found"
        );

        error.statusCode = 404;

        throw error;

    }


    // ====================================
    // GET ALL PUBLIC CONTENT
    // ====================================

    const [
        projects,
        skills,
        experiences,
        education,
        certificates,
        posts
    ] = await Promise.all([

        Project.find({
            portfolio: portfolio._id,
            isPublished: true
        }).sort({
            order: 1,
            createdAt: -1
        }),

        Skill.find({
            portfolio: portfolio._id,
            isPublished: true
        }).sort({
            order: 1,
            createdAt: -1
        }),

        Experience.find({
            portfolio: portfolio._id,
            isPublished: true
        }).sort({
            order: 1,
            startDate: -1,
            createdAt: -1
        }),

        Education.find({
            portfolio: portfolio._id,
            isPublished: true
        }).sort({
            order: 1,
            startDate: -1,
            createdAt: -1
        }),

        Certificate.find({
            portfolio: portfolio._id,
            isPublished: true
        }).sort({
            order: 1,
            createdAt: -1
        }),

        Post.find({
            portfolio: portfolio._id,
            isPublished: true
        }).sort({
            order: 1,
            publishedAt: -1,
            createdAt: -1
        })

    ]);


    // ====================================
    // RETURN COMPLETE PUBLIC PORTFOLIO
    // ====================================

    return {

        portfolio,

        projects,

        skills,

        experiences,

        education,

        certificates,

        posts

    };

};


// ========================================
// UPDATE PORTFOLIO
// ========================================

const updatePortfolio = async(
    userId,
    data
) => {

    const portfolio =
        await Portfolio.findOne({
            owner: userId
        });


    if (!portfolio) {

        const error = new Error(
            "Portfolio not found"
        );

        error.statusCode = 404;

        throw error;

    }


    // ====================================
    // USERNAME CHANGE
    // ====================================

    if (
        data.username &&
        data.username.toLowerCase() !==
        portfolio.username
    ) {

        const existingUsername =
            await Portfolio.findOne({

                username: data.username.toLowerCase(),

                _id: {
                    $ne: portfolio._id
                }

            });


        if (existingUsername) {

            const error = new Error(
                "Username is already taken"
            );

            error.statusCode = 409;

            throw error;

        }


        portfolio.username =
            data.username.toLowerCase();

    }


    // ====================================
    // SLUG CHANGE
    // ====================================

    if (
        data.slug &&
        data.slug.toLowerCase() !==
        portfolio.slug
    ) {

        const existingSlug =
            await Portfolio.findOne({

                slug: data.slug.toLowerCase(),

                _id: {
                    $ne: portfolio._id
                }

            });


        if (existingSlug) {

            const error = new Error(
                "Portfolio slug is already taken"
            );

            error.statusCode = 409;

            throw error;

        }


        portfolio.slug =
            data.slug.toLowerCase();

    }


    // ====================================
    // ALLOWED FIELDS
    // ====================================

    const allowedFields = [

        "title",

        "headline",

        "bio",

        "profileImage",

        "location",

        "email",

        "phone",

        "github",

        "linkedin",

        "twitter",

        "instagram",

        "youtube",

        "website",

        "resume",

        "theme",

        "template",

        "customization",

        "showAboutSection",

        "showContactSection",

        "showProjectsSection",

        "showSkillsSection",

        "showExperienceSection",

        "showEducationSection",

        "showCertificatesSection",

        "showPostsSection",

        "seo"

    ];


    // ====================================
    // UPDATE FIELDS
    // ====================================

    for (
        const field of allowedFields
    ) {

        if (
            data[field] !== undefined
        ) {

            portfolio[field] =
                data[field];

        }

    }


    await portfolio.save();


    return portfolio;

};


// ========================================
// PUBLISH PORTFOLIO
// ========================================

const publishPortfolio = async(
    userId
) => {

    const portfolio =
        await Portfolio.findOne({
            owner: userId
        });


    if (!portfolio) {

        const error = new Error(
            "Portfolio not found"
        );

        error.statusCode = 404;

        throw error;

    }


    portfolio.isPublished = true;

    await portfolio.save();


    return portfolio;

};


// ========================================
// UNPUBLISH PORTFOLIO
// ========================================

const unpublishPortfolio = async(
    userId
) => {

    const portfolio =
        await Portfolio.findOne({
            owner: userId
        });


    if (!portfolio) {

        const error = new Error(
            "Portfolio not found"
        );

        error.statusCode = 404;

        throw error;

    }


    portfolio.isPublished = false;

    await portfolio.save();


    return portfolio;

};


// ========================================
// DELETE PORTFOLIO
// ========================================

const deletePortfolio = async(
    userId
) => {

    const portfolio =
        await Portfolio.findOne({
            owner: userId
        });


    if (!portfolio) {

        const error = new Error(
            "Portfolio not found"
        );

        error.statusCode = 404;

        throw error;

    }


    await Portfolio.findByIdAndDelete(
        portfolio._id
    );


    return {
        message: "Portfolio deleted successfully"
    };

};


// ========================================
// EXPORT
// ========================================

export {

    createPortfolio,

    getMyPortfolio,

    getPublicPortfolio,

    updatePortfolio,

    publishPortfolio,

    unpublishPortfolio,

    deletePortfolio

};