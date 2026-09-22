import mongoose from "mongoose";

import User from "../../models/user.model.js";
import Portfolio from "../../models/portfolio.model.js";
import Project from "../../models/project.model.js";
import Skill from "../../models/skill.model.js";
import Experience from "../../models/experience.model.js";
import Education from "../../models/education.model.js";
import Certificate from "../../models/certificate.model.js";
import Post from "../../models/post.model.js";


// ========================================
// DASHBOARD OVERVIEW
// ========================================

const getDashboardStats = async() => {

    const [
        totalUsers,
        activeUsers,
        inactiveUsers,
        totalPortfolios,
        publishedPortfolios,
        totalProjects,
        totalSkills,
        totalExperiences,
        totalEducation,
        totalCertificates,
        totalPosts
    ] = await Promise.all([

        User.countDocuments({
            role: "user"
        }),

        User.countDocuments({
            role: "user",
            isActive: true
        }),

        User.countDocuments({
            role: "user",
            isActive: false
        }),

        Portfolio.countDocuments(),

        Portfolio.countDocuments({
            isPublished: true
        }),

        Project.countDocuments(),

        Skill.countDocuments(),

        Experience.countDocuments(),

        Education.countDocuments(),

        Certificate.countDocuments(),

        Post.countDocuments()

    ]);


    return {

        users: {
            total: totalUsers,
            active: activeUsers,
            inactive: inactiveUsers
        },

        portfolios: {
            total: totalPortfolios,
            published: publishedPortfolios,
            unpublished: totalPortfolios -
                publishedPortfolios
        },

        projects: {
            total: totalProjects
        },

        skills: {
            total: totalSkills
        },

        experiences: {
            total: totalExperiences
        },

        education: {
            total: totalEducation
        },

        certificates: {
            total: totalCertificates
        },

        posts: {
            total: totalPosts
        }

    };

};


// ========================================
// USER SELECT
// ========================================

const getSafeUserQuery = (query) => {

    return query.select(
        "-password " +
        "-refreshToken " +
        "-emailVerificationOTP " +
        "-emailVerificationOTPExpire " +
        "-resetPasswordOTP " +
        "-resetPasswordOTPExpire"
    );

};


// ========================================
// GET ALL USERS
// ========================================

const getAllUsers = async() => {

    const users =
        await User.find({
            role: "user"
        })
        .select(
            "-password " +
            "-refreshToken " +
            "-emailVerificationOTP " +
            "-emailVerificationOTPExpire " +
            "-resetPasswordOTP " +
            "-resetPasswordOTPExpire"
        )
        .sort({
            createdAt: -1
        })
        .lean();


    const userIds =
        users.map(
            (user) => user._id
        );


    const portfolios =
        await Portfolio.find({
            owner: {
                $in: userIds
            }
        })
        .select(
            "owner title headline username slug " +
            "profileImage isPublished isActive views " +
            "theme template createdAt updatedAt"
        )
        .sort({
            createdAt: -1
        })
        .lean();


    const portfolioMap =
        new Map();


    portfolios.forEach(
        (portfolio) => {

            portfolioMap.set(
                String(portfolio.owner),
                portfolio
            );

        }
    );


    return users.map(
        (user) => {

            return {
                ...user,

                portfolio: portfolioMap.get(
                    String(user._id)
                ) || null
            };

        }
    );

};


// ========================================
// GET USER BY ID
// COMPLETE PROFILE + PORTFOLIO
// ========================================

const getUserById = async(
    userId
) => {

    if (!mongoose.Types.ObjectId.isValid(
            userId
        )) {

        const error =
            new Error(
                "Invalid user ID"
            );

        error.statusCode = 400;

        throw error;

    }


    const user =
        await User.findOne({
            _id: userId,
            role: "user"
        })
        .select(
            "-password " +
            "-refreshToken " +
            "-emailVerificationOTP " +
            "-emailVerificationOTPExpire " +
            "-resetPasswordOTP " +
            "-resetPasswordOTPExpire"
        )
        .lean();


    if (!user) {

        const error =
            new Error(
                "User not found"
            );

        error.statusCode = 404;

        throw error;

    }


    const portfolio =
        await Portfolio.findOne({
            owner: user._id
        })
        .lean();


    if (!portfolio) {

        return {

            user,

            portfolio: null,

            projects: [],
            skills: [],
            experiences: [],
            education: [],
            certificates: [],
            posts: []

        };

    }


    const [

        projects,
        skills,
        experiences,
        education,
        certificates,
        posts

    ] = await Promise.all([

        Project.find({
            portfolio: portfolio._id
        })
        .sort({
            order: 1,
            createdAt: -1
        })
        .lean(),

        Skill.find({
            portfolio: portfolio._id
        })
        .sort({
            order: 1,
            createdAt: -1
        })
        .lean(),

        Experience.find({
            portfolio: portfolio._id
        })
        .sort({
            order: 1,
            createdAt: -1
        })
        .lean(),

        Education.find({
            portfolio: portfolio._id
        })
        .sort({
            order: 1,
            createdAt: -1
        })
        .lean(),

        Certificate.find({
            portfolio: portfolio._id
        })
        .sort({
            order: 1,
            createdAt: -1
        })
        .lean(),

        Post.find({
            portfolio: portfolio._id
        })
        .sort({
            order: 1,
            createdAt: -1
        })
        .lean()

    ]);


    return {

        user,

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
// ACTIVATE USER
// ========================================

const activateUser = async(
    userId
) => {

    if (!mongoose.Types.ObjectId.isValid(
            userId
        )) {

        const error =
            new Error(
                "Invalid user ID"
            );

        error.statusCode = 400;

        throw error;

    }


    const user =
        await User.findOne({
            _id: userId,
            role: "user"
        });


    if (!user) {

        const error =
            new Error(
                "User not found"
            );

        error.statusCode = 404;

        throw error;

    }


    user.isActive = true;

    await user.save();

    return user;

};


// ========================================
// DEACTIVATE USER
// ========================================

const deactivateUser = async(
    userId
) => {

    if (!mongoose.Types.ObjectId.isValid(
            userId
        )) {

        const error =
            new Error(
                "Invalid user ID"
            );

        error.statusCode = 400;

        throw error;

    }


    const user =
        await User.findOne({
            _id: userId,
            role: "user"
        });


    if (!user) {

        const error =
            new Error(
                "User not found"
            );

        error.statusCode = 404;

        throw error;

    }


    user.isActive = false;

    await user.save();

    return user;

};


// ========================================
// DELETE USER + CASCADE DELETE
// ========================================

const deleteUser = async(
    userId
) => {

    if (!mongoose.Types.ObjectId.isValid(
            userId
        )) {

        const error =
            new Error(
                "Invalid user ID"
            );

        error.statusCode = 400;

        throw error;

    }


    const user =
        await User.findOne({
            _id: userId,
            role: "user"
        });


    if (!user) {

        const error =
            new Error(
                "User not found"
            );

        error.statusCode = 404;

        throw error;

    }


    const session =
        await mongoose.startSession();


    try {

        let deletedData = {

            projects: 0,
            skills: 0,
            experiences: 0,
            education: 0,
            certificates: 0,
            posts: 0,
            portfolios: 0,
            users: 0

        };


        await session.withTransaction(
            async() => {

                const portfolio =
                    await Portfolio.findOne({
                        owner: user._id
                    }).session(
                        session
                    );


                if (portfolio) {

                    const portfolioId =
                        portfolio._id;


                    const projectResult =
                        await Project.deleteMany({
                            portfolio: portfolioId
                        }, {
                            session
                        });

                    deletedData.projects =
                        projectResult.deletedCount || 0;


                    const skillResult =
                        await Skill.deleteMany({
                            portfolio: portfolioId
                        }, {
                            session
                        });

                    deletedData.skills =
                        skillResult.deletedCount || 0;


                    const experienceResult =
                        await Experience.deleteMany({
                            portfolio: portfolioId
                        }, {
                            session
                        });

                    deletedData.experiences =
                        experienceResult.deletedCount || 0;


                    const educationResult =
                        await Education.deleteMany({
                            portfolio: portfolioId
                        }, {
                            session
                        });

                    deletedData.education =
                        educationResult.deletedCount || 0;


                    const certificateResult =
                        await Certificate.deleteMany({
                            portfolio: portfolioId
                        }, {
                            session
                        });

                    deletedData.certificates =
                        certificateResult.deletedCount || 0;


                    const postsResult =
                        await Post.deleteMany({
                            portfolio: portfolioId
                        }, {
                            session
                        });

                    deletedData.posts =
                        postsResult.deletedCount || 0;


                    const portfolioResult =
                        await Portfolio.deleteOne({
                            _id: portfolioId
                        }, {
                            session
                        });

                    deletedData.portfolios =
                        portfolioResult.deletedCount || 0;

                }


                const userResult =
                    await User.deleteOne({
                        _id: user._id,
                        role: "user"
                    }, {
                        session
                    });


                deletedData.users =
                    userResult.deletedCount || 0;

            }
        );


        return {

            message: "User and all associated portfolio data deleted successfully",

            deleted: deletedData

        };

    } finally {

        await session.endSession();

    }

};


// ========================================
// GET ALL PORTFOLIOS
// OWNER + BASIC DETAILS
// ========================================

const getAllPortfolios = async() => {

    const portfolios =
        await Portfolio.find()
        .populate(
            "owner",
            "name email profileImage isActive isEmailVerified"
        )
        .sort({
            createdAt: -1
        })
        .lean();


    return portfolios;

};


// ========================================
// GET PORTFOLIO BY ID
// COMPLETE PORTFOLIO
// ========================================

const getPortfolioById = async(
    portfolioId
) => {

    if (!mongoose.Types.ObjectId.isValid(
            portfolioId
        )) {

        const error =
            new Error(
                "Invalid portfolio ID"
            );

        error.statusCode = 400;

        throw error;

    }


    const portfolio =
        await Portfolio.findById(
            portfolioId
        )
        .populate(
            "owner",
            "name email profileImage isActive isEmailVerified createdAt"
        )
        .lean();


    if (!portfolio) {

        const error =
            new Error(
                "Portfolio not found"
            );

        error.statusCode = 404;

        throw error;

    }


    const [

        projects,
        skills,
        experiences,
        education,
        certificates,
        posts

    ] = await Promise.all([

        Project.find({
            portfolio: portfolio._id
        })
        .sort({
            order: 1,
            createdAt: -1
        })
        .lean(),

        Skill.find({
            portfolio: portfolio._id
        })
        .sort({
            order: 1,
            createdAt: -1
        })
        .lean(),

        Experience.find({
            portfolio: portfolio._id
        })
        .sort({
            order: 1,
            createdAt: -1
        })
        .lean(),

        Education.find({
            portfolio: portfolio._id
        })
        .sort({
            order: 1,
            createdAt: -1
        })
        .lean(),

        Certificate.find({
            portfolio: portfolio._id
        })
        .sort({
            order: 1,
            createdAt: -1
        })
        .lean(),

        Post.find({
            portfolio: portfolio._id
        })
        .sort({
            order: 1,
            createdAt: -1
        })
        .lean()

    ]);


    return {

        portfolio,

        owner: portfolio.owner || null,

        projects,

        skills,

        experiences,

        education,

        certificates,

        posts

    };

};


// ========================================
// PLATFORM STATISTICS
// ========================================

const getPlatformStatistics = async() => {

    const [
        totalUsers,
        activeUsers,
        inactiveUsers,
        verifiedUsers,
        totalPortfolios,
        publishedPortfolios,
        totalProjects,
        totalSkills,
        totalExperiences,
        totalEducation,
        totalCertificates,
        totalPosts,
        publishedPosts
    ] = await Promise.all([

        User.countDocuments({
            role: "user"
        }),

        User.countDocuments({
            role: "user",
            isActive: true
        }),

        User.countDocuments({
            role: "user",
            isActive: false
        }),

        User.countDocuments({
            role: "user",
            isEmailVerified: true
        }),

        Portfolio.countDocuments(),

        Portfolio.countDocuments({
            isPublished: true
        }),

        Project.countDocuments(),

        Skill.countDocuments(),

        Experience.countDocuments(),

        Education.countDocuments(),

        Certificate.countDocuments(),

        Post.countDocuments(),

        Post.countDocuments({
            isPublished: true
        })

    ]);


    return {

        users: {
            total: totalUsers,
            active: activeUsers,
            inactive: inactiveUsers,
            verified: verifiedUsers
        },

        portfolios: {
            total: totalPortfolios,
            published: publishedPortfolios,
            unpublished: totalPortfolios -
                publishedPortfolios
        },

        content: {
            projects: totalProjects,
            skills: totalSkills,
            experiences: totalExperiences,
            education: totalEducation,
            certificates: totalCertificates,
            posts: totalPosts,
            publishedPosts
        }

    };

};


export {
    getDashboardStats,
    getAllUsers,
    getUserById,
    activateUser,
    deactivateUser,
    deleteUser,
    getAllPortfolios,
    getPortfolioById,
    getPlatformStatistics
};