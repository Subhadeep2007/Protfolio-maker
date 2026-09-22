import { body } from "express-validator";


// ========================================
// OPTIONAL STRING HELPERS
// ========================================

const optionalTrimmedString = (field) =>
    body(field)
    .optional({ values: "falsy" })
    .trim();


// ========================================
// CREATE PORTFOLIO
// ========================================

const createPortfolioSchema = [

    // Username is optional from frontend.
    // Backend will generate it if missing.
    body("username")
    .optional({ values: "falsy" })
    .trim()
    .isLength({
        min: 3,
        max: 30
    })
    .withMessage(
        "Username must be between 3 and 30 characters"
    )
    .matches(/^[a-zA-Z0-9_]+$/)
    .withMessage(
        "Username can only contain letters, numbers and underscores"
    ),

    // Slug is optional from frontend.
    // Backend will generate it if missing.
    body("slug")
    .optional({ values: "falsy" })
    .trim()
    .isLength({
        min: 3,
        max: 50
    })
    .withMessage(
        "Slug must be between 3 and 50 characters"
    )
    .matches(/^[a-zA-Z0-9-]+$/)
    .withMessage(
        "Slug can only contain letters, numbers and hyphens"
    ),

    // ====================================
    // BASIC INFORMATION
    // ====================================

    optionalTrimmedString("title")
    .isLength({
        max: 100
    })
    .withMessage(
        "Portfolio title cannot exceed 100 characters"
    ),

    optionalTrimmedString("headline")
    .isLength({
        max: 200
    })
    .withMessage(
        "Headline cannot exceed 200 characters"
    ),

    optionalTrimmedString("bio")
    .isLength({
        max: 2000
    })
    .withMessage(
        "Bio cannot exceed 2000 characters"
    ),

    optionalTrimmedString("profileImage"),


    // ====================================
    // CONTACT
    // ====================================

    optionalTrimmedString("location")
    .isLength({
        max: 150
    })
    .withMessage(
        "Location cannot exceed 150 characters"
    ),

    body("email")
    .optional({ values: "falsy" })
    .trim()
    .isEmail()
    .withMessage(
        "Please enter a valid email address"
    ),

    optionalTrimmedString("phone")
    .isLength({
        max: 30
    })
    .withMessage(
        "Phone cannot exceed 30 characters"
    ),

    optionalTrimmedString("website"),


    // ====================================
    // SOCIAL LINKS
    // ====================================

    optionalTrimmedString("github"),

    optionalTrimmedString("linkedin"),

    optionalTrimmedString("twitter"),

    optionalTrimmedString("instagram"),

    optionalTrimmedString("youtube"),


    // ====================================
    // RESUME
    // ====================================

    body("resume")
    .optional()
    .isObject()
    .withMessage(
        "Resume must be an object"
    ),


    // ====================================
    // DESIGN
    // ====================================

    body("theme")
    .optional({ values: "falsy" })
    .isIn([
        "light",
        "dark",
        "system",
        "custom"
    ])
    .withMessage(
        "Invalid theme selected"
    ),

    body("template")
    .optional({ values: "falsy" })
    .isIn([
        "modern",
        "minimal",
        "developer",
        "creative"
    ])
    .withMessage(
        "Invalid portfolio template selected"
    ),

    body("customization")
    .optional()
    .isObject()
    .withMessage(
        "Customization must be an object"
    ),


    // ====================================
    // SECTION VISIBILITY
    // ====================================

    body("showAboutSection")
    .optional()
    .isBoolean()
    .withMessage(
        "showAboutSection must be true or false"
    ),

    body("showContactSection")
    .optional()
    .isBoolean()
    .withMessage(
        "showContactSection must be true or false"
    ),

    body("showProjectsSection")
    .optional()
    .isBoolean()
    .withMessage(
        "showProjectsSection must be true or false"
    ),

    body("showSkillsSection")
    .optional()
    .isBoolean()
    .withMessage(
        "showSkillsSection must be true or false"
    ),

    body("showExperienceSection")
    .optional()
    .isBoolean()
    .withMessage(
        "showExperienceSection must be true or false"
    ),

    body("showEducationSection")
    .optional()
    .isBoolean()
    .withMessage(
        "showEducationSection must be true or false"
    ),

    body("showCertificatesSection")
    .optional()
    .isBoolean()
    .withMessage(
        "showCertificatesSection must be true or false"
    ),

    body("showPostsSection")
    .optional()
    .isBoolean()
    .withMessage(
        "showPostsSection must be true or false"
    ),


    // ====================================
    // SEO
    // ====================================

    body("seo")
    .optional()
    .isObject()
    .withMessage(
        "SEO must be an object"
    )

];


// ========================================
// UPDATE PORTFOLIO
// ========================================

const updatePortfolioSchema = [

    // ====================================
    // PUBLIC IDENTITY
    // ====================================

    body("username")
    .optional({ values: "falsy" })
    .trim()
    .isLength({
        min: 3,
        max: 30
    })
    .withMessage(
        "Username must be between 3 and 30 characters"
    )
    .matches(/^[a-zA-Z0-9_]+$/)
    .withMessage(
        "Username can only contain letters, numbers and underscores"
    ),

    body("slug")
    .optional({ values: "falsy" })
    .trim()
    .isLength({
        min: 3,
        max: 50
    })
    .withMessage(
        "Slug must be between 3 and 50 characters"
    )
    .matches(/^[a-zA-Z0-9-]+$/)
    .withMessage(
        "Slug can only contain letters, numbers and hyphens"
    ),


    // ====================================
    // BASIC
    // ====================================

    optionalTrimmedString("title")
    .isLength({
        max: 100
    })
    .withMessage(
        "Portfolio title cannot exceed 100 characters"
    ),

    optionalTrimmedString("headline")
    .isLength({
        max: 200
    })
    .withMessage(
        "Headline cannot exceed 200 characters"
    ),

    optionalTrimmedString("bio")
    .isLength({
        max: 2000
    })
    .withMessage(
        "Bio cannot exceed 2000 characters"
    ),

    optionalTrimmedString("profileImage"),


    // ====================================
    // CONTACT
    // ====================================

    optionalTrimmedString("location")
    .isLength({
        max: 150
    })
    .withMessage(
        "Location cannot exceed 150 characters"
    ),

    body("email")
    .optional({ values: "falsy" })
    .trim()
    .isEmail()
    .withMessage(
        "Please enter a valid email address"
    ),

    optionalTrimmedString("phone")
    .isLength({
        max: 30
    })
    .withMessage(
        "Phone cannot exceed 30 characters"
    ),

    optionalTrimmedString("website"),


    // ====================================
    // SOCIAL
    // ====================================

    optionalTrimmedString("github"),

    optionalTrimmedString("linkedin"),

    optionalTrimmedString("twitter"),

    optionalTrimmedString("instagram"),

    optionalTrimmedString("youtube"),


    // ====================================
    // RESUME
    // ====================================

    body("resume")
    .optional()
    .isObject()
    .withMessage(
        "Resume must be an object"
    ),


    // ====================================
    // DESIGN
    // ====================================

    body("theme")
    .optional({ values: "falsy" })
    .isIn([
        "light",
        "dark",
        "system",
        "custom"
    ])
    .withMessage(
        "Invalid theme selected"
    ),

    body("template")
    .optional({ values: "falsy" })
    .isIn([
        "modern",
        "minimal",
        "developer",
        "creative"
    ])
    .withMessage(
        "Invalid portfolio template selected"
    ),

    body("customization")
    .optional()
    .isObject()
    .withMessage(
        "Customization must be an object"
    ),


    // ====================================
    // SECTION VISIBILITY
    // ====================================

    body("showAboutSection")
    .optional()
    .isBoolean()
    .withMessage(
        "showAboutSection must be true or false"
    ),

    body("showContactSection")
    .optional()
    .isBoolean()
    .withMessage(
        "showContactSection must be true or false"
    ),

    body("showProjectsSection")
    .optional()
    .isBoolean()
    .withMessage(
        "showProjectsSection must be true or false"
    ),

    body("showSkillsSection")
    .optional()
    .isBoolean()
    .withMessage(
        "showSkillsSection must be true or false"
    ),

    body("showExperienceSection")
    .optional()
    .isBoolean()
    .withMessage(
        "showExperienceSection must be true or false"
    ),

    body("showEducationSection")
    .optional()
    .isBoolean()
    .withMessage(
        "showEducationSection must be true or false"
    ),

    body("showCertificatesSection")
    .optional()
    .isBoolean()
    .withMessage(
        "showCertificatesSection must be true or false"
    ),

    body("showPostsSection")
    .optional()
    .isBoolean()
    .withMessage(
        "showPostsSection must be true or false"
    ),


    // ====================================
    // SEO
    // ====================================

    body("seo")
    .optional()
    .isObject()
    .withMessage(
        "SEO must be an object"
    )

];


// ========================================
// EXPORT
// ========================================

export {
    createPortfolioSchema,
    updatePortfolioSchema
};