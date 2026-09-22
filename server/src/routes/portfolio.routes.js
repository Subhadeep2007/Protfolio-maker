import express from "express";

import {
    create,
    getMy,
    getPublic,
    update,
    publish,
    unpublish,
    remove,
    uploadResume
} from "../controllers/portfolio/portfolio.controller.js";

import authMiddleware from "../middleware/auth.middleware.js";

import validate from "../middleware/validate.middleware.js";

import {
    createPortfolioSchema,
    updatePortfolioSchema
} from "../validators/portfolio.validator.js";

import portfolioUpload from "../middleware/portfolioUpload.middleware.js";


const router = express.Router();


// ========================================
// CREATE PORTFOLIO
// ========================================

router.post(
    "/",
    authMiddleware,
    validate(createPortfolioSchema),
    create
);


// ========================================
// GET MY PORTFOLIO
// ========================================

router.get(
    "/me",
    authMiddleware,
    getMy
);


// ========================================
// GET PUBLIC PORTFOLIO
// ========================================

router.get(
    "/public/:slug",
    getPublic
);


// ========================================
// UPLOAD RESUME
// IMPORTANT: KEEP BEFORE PARAMETER ROUTES
// ========================================

router.post(
    "/resume/upload",
    authMiddleware,
    portfolioUpload.single("resume"),
    uploadResume
);


// ========================================
// UPDATE PORTFOLIO
// ========================================

router.patch(
    "/",
    authMiddleware,
    validate(updatePortfolioSchema),
    update
);


// ========================================
// PUBLISH PORTFOLIO
// ========================================

router.patch(
    "/publish",
    authMiddleware,
    publish
);


// ========================================
// UNPUBLISH PORTFOLIO
// ========================================

router.patch(
    "/unpublish",
    authMiddleware,
    unpublish
);


// ========================================
// DELETE PORTFOLIO
// ========================================

router.delete(
    "/",
    authMiddleware,
    remove
);


export default router;