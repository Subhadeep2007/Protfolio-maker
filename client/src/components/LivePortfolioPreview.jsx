import {
    useEffect,
    useMemo,
    useState
} from "react";

import {
    getMyProjects
} from "../api/projects.api";

import {
    getMySkills
} from "../api/skills.api";

import {
    getMyExperiences
} from "../api/experience.api";

import {
    getMyEducation
} from "../api/education.api";

import {
    getMyCertificates
} from "../api/certificates.api";

import {
    getMyPosts
} from "../api/posts.api";

// ========================================
// SAFE ARRAY
// ========================================

const toArray = (value) => {
    return Array.isArray(value)
        ? value
        : [];
};

// ========================================
// DATE FORMAT
// ========================================

const formatDate = (value) => {
    if (!value) {
        return "";
    }

    try {
        return new Date(value).toLocaleDateString(
            "en-US",
            {
                month: "short",
                year: "numeric"
            }
        );
    } catch {
        return String(value);
    }
};

// ========================================
// MEDIA TYPE
// ========================================

const getMediaType = (url) => {

    if (!url) {
        return "file";
    }

    const cleanUrl = String(url)
        .split("?")[0]
        .split("#")[0]
        .toLowerCase();

    // ========================================
    // CLOUDINARY RESOURCE TYPE
    // ========================================

    if (
        cleanUrl.includes("/image/upload/")
    ) {
        return "image";
    }

    if (
        cleanUrl.includes("/video/upload/")
    ) {
        return "video";
    }

    if (
        cleanUrl.includes("/raw/upload/")
    ) {
        return "file";
    }

    // ========================================
    // IMAGE
    // ========================================

    if (
        /\.(jpg|jpeg|png|gif|webp|svg|avif|bmp|ico|tiff|tif)$/.test(
            cleanUrl
        )
    ) {
        return "image";
    }

    // ========================================
    // VIDEO
    // ========================================

    if (
        /\.(mp4|webm|ogg|mov|avi|m4v|mkv|flv|wmv)$/.test(
            cleanUrl
        )
    ) {
        return "video";
    }

    // ========================================
    // AUDIO
    // ========================================

    if (
        /\.(mp3|wav|aac|m4a|flac|aiff)$/.test(
            cleanUrl
        )
    ) {
        return "audio";
    }

    return "file";
};

// ========================================
// METRIC
// ========================================

const Metric = ({
    value,
    label
}) => {
    return (
        <div
            className="
                border-b
                border-white/10
                px-4
                py-6
                text-center
                last:border-b-0
                sm:border-b-0
                sm:border-r
                sm:last:border-r-0
            "
        >
            <p
                className="
                    text-xl
                    font-black
                    text-white
                "
            >
                {value}
            </p>

            <p
                className="
                    mt-1
                    text-[10px]
                    text-slate-600
                "
            >
                {label}
            </p>
        </div>
    );
};

// ========================================
// SECTION TITLE
// ========================================

const SectionHeading = ({
    number,
    title
}) => {
    return (
        <div
            className="
                mb-7
                flex
                items-start
                gap-4
            "
        >
            <div
                className="
                    shrink-0
                    pt-0.5
                    text-[10px]
                    font-bold
                    text-cyan-400
                "
            >
                {number}
            </div>

            <div>
                <p
                    className="
                        text-xs
                        font-bold
                        uppercase
                        tracking-[0.22em]
                        text-cyan-400
                    "
                >
                    {title}
                </p>
            </div>
        </div>
    );
};

// ========================================
// SOCIAL ICON
// ========================================

const SocialIcon = ({
    label,
    href
}) => {
    if (!href) {
        return null;
    }

    return (
        <a
            href={href}
            target="_blank"
            rel="noreferrer"
            className="
                flex
                h-9
                w-9
                items-center
                justify-center
                rounded-lg
                border
                border-white/10
                bg-white/[0.03]
                text-[10px]
                font-bold
                text-slate-400
                transition
                hover:border-cyan-400/30
                hover:bg-cyan-400/10
                hover:text-cyan-300
            "
        >
            {label}
        </a>
    );
};

// ========================================
// PROJECT CARD
// ========================================

const ProjectCard = ({
    project,
    primary
}) => {
    const technologies =
        toArray(
            project.technologies
        );

    return (
        <article
            className="
                group
                overflow-hidden
                rounded-2xl
                border
                border-white/10
                bg-white/[0.02]
                transition
                duration-300
                hover:-translate-y-1
            "
            style={{
                borderColor:
                    `${primary}1f`
            }}
        >
            {/* IMAGE */}

            {project.image ? (
                <div
                    className="
                        h-48
                        overflow-hidden
                        bg-[#060b16]
                    "
                >
                    <img
                        src={
                            project.image
                        }
                        alt={
                            project.title ||
                            "Project"
                        }
                        className="
                            h-full
                            w-full
                            object-cover
                            transition
                            duration-500
                            group-hover:scale-105
                        "
                    />
                </div>
            ) : null}
{project.featured ? (
    <span className="
        absolute
        right-3
        top-3
        rounded-full
        border
        border-yellow-400/20
        bg-black/60
        px-3
        py-1.5
        text-xs
        font-medium
        text-yellow-300
        backdrop-blur
    ">
        ★ Featured
    </span>
) : null}
            {/* CONTENT */}

            <div className="p-5">
                {project.category ? (
                    <p
                        className="
                            text-[10px]
                            font-bold
                            uppercase
                            tracking-[0.18em]
                        "
                        style={{
                            color: primary
                        }}
                    >
                        {project.category}
                    </p>
                ) : null}

                <h3
                    className="
                        mt-2
                        text-lg
                        font-bold
                        text-white
                    "
                >
                    {project.title}
                </h3>

                {project.description ? (
                    <p
                        className="
                            mt-3
                            line-clamp-4
                            text-sm
                            leading-6
                            text-slate-400
                        "
                    >
                        {
                            project.description
                        }
                    </p>
                ) : null}

                {technologies.length > 0 ? (
                    <div
                        className="
                            mt-4
                            flex
                            flex-wrap
                            gap-2
                        "
                    >
                        {technologies.map(
                            (
                                technology,
                                index
                            ) => (
                                <span
                                    key={`${technology}-${index}`}
                                    className="
                                        rounded-lg
                                        border
                                        border-white/10
                                        bg-white/[0.03]
                                        px-2.5
                                        py-1
                                        text-[11px]
                                        text-slate-300
                                    "
                                >
                                    {
                                        technology
                                    }
                                </span>
                            )
                        )}
                    </div>
                ) : null}

                <div
                    className="
                        mt-5
                        flex
                        flex-wrap
                        gap-2
                    "
                >
                    {project.githubUrl ? (
                        <a
                            href={
                                project.githubUrl
                            }
                            target="_blank"
                            rel="noreferrer"
                            className="
                                rounded-lg
                                border
                                border-white/10
                                px-3
                                py-2
                                text-[11px]
                                text-slate-300
                                transition
                                hover:bg-white/5
                            "
                        >
                            GitHub ↗
                        </a>
                    ) : null}

                    {project.liveUrl ? (
                        <a
                            href={
                                project.liveUrl
                            }
                            target="_blank"
                            rel="noreferrer"
                            className="
                                rounded-lg
                                px-3
                                py-2
                                text-[11px]
                                font-semibold
                                text-slate-950
                            "
                            style={{
                                backgroundColor:
                                    primary
                            }}
                        >
                            Live Demo ↗
                        </a>
                    ) : null}
                </div>
            </div>
        </article>
    );
};

// ========================================
// SKILL CARD
// ========================================

const SkillCard = ({
    skill,
    primary
}) => {
    const percentage =
        Math.max(
            0,
            Math.min(
                100,
                Number(
                    skill.percentage ??
                    skill.level ??
                    0
                ) || 0
            )
        );

    return (
        <div
            className="
                rounded-2xl
                border
                border-white/10
                bg-white/[0.02]
                p-4
            "
        >
            <div
                className="
                    flex
                    items-center
                    justify-between
                    gap-3
                "
            >
                <div
                    className="
                        min-w-0
                        flex
                        items-center
                        gap-3
                    "
                >
                    <div
                        className="
                            flex
                            h-10
                            w-10
                            shrink-0
                            items-center
                            justify-center
                            rounded-xl
                            border
                            border-white/10
                            bg-white/[0.03]
                            text-lg
                        "
                    >
                        {skill.icon ||
                            "◈"}
                    </div>

                    <div className="min-w-0">
                        <p
                            className="
                                truncate
                                text-sm
                                font-semibold
                                text-white
                            "
                        >
                            {
                                skill.name
                            }
                        </p>

                        {skill.category ? (
                            <p
                                className="
                                    mt-0.5
                                    truncate
                                    text-[11px]
                                    text-slate-500
                                "
                            >
                                {
                                    skill.category
                                }
                            </p>
                        ) : null}
                    </div>
                </div>

                {skill.percentage !==
                    undefined ? (
                    <span
                        className="
                            text-xs
                            font-semibold
                        "
                        style={{
                            color: primary
                        }}
                    >
                        {
                            skill.percentage
                        }
                        %
                    </span>
                ) : null}
            </div>

            {skill.percentage !==
            undefined ? (
                <div
                    className="
                        mt-4
                        h-1.5
                        overflow-hidden
                        rounded-full
                        bg-white/5
                    "
                >
                    <div
                        className="
                            h-full
                            rounded-full
                        "
                        style={{
                            width: `${percentage}%`,
                            backgroundColor:
                                primary
                        }}
                    />
                </div>
            ) : null}

            {skill.description ? (
                <p
                    className="
                        mt-3
                        text-xs
                        leading-5
                        text-slate-500
                    "
                >
                    {
                        skill.description
                    }
                </p>
            ) : null}
        </div>
    );
};

// ========================================
// EXPERIENCE CARD
// ========================================

const ExperienceCard = ({
    experience,
    primary
}) => {
    const technologies =
        toArray(
            experience.technologies
        );

    const achievements =
        toArray(
            experience.achievements
        );

    const start =
        formatDate(
            experience.startDate
        );

    const end =
        experience.currentlyWorking
            ? "Present"
            : formatDate(
                  experience.endDate
              );

    return (
        <article
            className="
                relative
                rounded-2xl
                border
                border-white/10
                bg-white/[0.02]
                p-5
            "
        >
            <div
                className="
                    absolute
                    left-0
                    top-5
                    h-12
                    w-0.5
                    rounded-full
                "
                style={{
                    backgroundColor:
                        primary
                }}
            />

            <div className="pl-4">
                <div
                    className="
                        flex
                        flex-col
                        gap-2
                        sm:flex-row
                        sm:items-start
                        sm:justify-between
                    "
                >
                    <div>
                        <h3
                            className="
                                text-lg
                                font-bold
                                text-white
                            "
                        >
                            {
                                experience.jobTitle
                            }
                        </h3>

                        {experience.company ? (
                            experience.companyUrl ? (
                                <a
                                    href={
                                        experience.companyUrl
                                    }
                                    target="_blank"
                                    rel="noreferrer"
                                    className="
                                        mt-1
                                        inline-block
                                        text-sm
                                        font-medium
                                        hover:underline
                                    "
                                    style={{
                                        color:
                                            primary
                                    }}
                                >
                                    {
                                        experience.company
                                    }
                                </a>
                            ) : (
                                <p
                                    className="
                                        mt-1
                                        text-sm
                                        font-medium
                                    "
                                    style={{
                                        color:
                                            primary
                                    }}
                                >
                                    {
                                        experience.company
                                    }
                                </p>
                            )
                        ) : null}
                    </div>

                    <div className="text-left sm:text-right">
                        {start ||
                        end ? (
                            <p
                                className="
                                    text-xs
                                    text-slate-500
                                "
                            >
                                {start}
                                {start &&
                                end
                                    ? " — "
                                    : ""}
                                {end}
                            </p>
                        ) : null}

                        {experience.employmentType ? (
                            <p
                                className="
                                    mt-1
                                    text-[11px]
                                    capitalize
                                    text-slate-600
                                "
                            >
                                {
                                    experience.employmentType
                                }
                            </p>
                        ) : null}
                    </div>
                </div>

                {experience.location ? (
                    <p
                        className="
                            mt-2
                            text-xs
                            text-slate-500
                        "
                    >
                        📍{" "}
                        {
                            experience.location
                        }
                    </p>
                ) : null}

                {experience.description ? (
                    <p
                        className="
                            mt-4
                            whitespace-pre-line
                            text-sm
                            leading-7
                            text-slate-400
                        "
                    >
                        {
                            experience.description
                        }
                    </p>
                ) : null}

                {achievements.length > 0 ? (
                    <div className="mt-4">
                        <p
                            className="
                                text-xs
                                font-semibold
                                text-slate-300
                            "
                        >
                            Achievements
                        </p>

                        <ul
                            className="
                                mt-2
                                space-y-2
                            "
                        >
                            {achievements.map(
                                (
                                    achievement,
                                    index
                                ) => (
                                    <li
                                        key={`${achievement}-${index}`}
                                        className="
                                            flex
                                            gap-2
                                            text-xs
                                            leading-5
                                            text-slate-500
                                        "
                                    >
                                        <span
                                            style={{
                                                color:
                                                    primary
                                            }}
                                        >
                                            •
                                        </span>

                                        <span>
                                            {
                                                achievement
                                            }
                                        </span>
                                    </li>
                                )
                            )}
                        </ul>
                    </div>
                ) : null}

                {technologies.length > 0 ? (
                    <div
                        className="
                            mt-4
                            flex
                            flex-wrap
                            gap-2
                        "
                    >
                        {technologies.map(
                            (
                                technology,
                                index
                            ) => (
                                <span
                                    key={`${technology}-${index}`}
                                    className="
                                        rounded-lg
                                        border
                                        border-white/10
                                        bg-white/[0.03]
                                        px-2.5
                                        py-1
                                        text-[11px]
                                        text-slate-300
                                    "
                                >
                                    {
                                        technology
                                    }
                                </span>
                            )
                        )}
                    </div>
                ) : null}
            </div>
        </article>
    );
};

// ========================================
// EDUCATION CARD
// ========================================

const EducationCard = ({
    education,
    primary
}) => {
    const achievements =
        toArray(
            education.achievements
        );

    const start =
        formatDate(
            education.startDate
        );

    const end =
        education.currentlyStudying
            ? "Present"
            : formatDate(
                  education.endDate
              );

    return (
        <article
            className="
                rounded-2xl
                border
                border-white/10
                bg-white/[0.02]
                p-5
            "
        >
            <div
                className="
                    flex
                    flex-col
                    gap-3
                    sm:flex-row
                    sm:items-start
                    sm:justify-between
                "
            >
                <div>
                    <h3
                        className="
                            text-lg
                            font-bold
                            text-white
                        "
                    >
                        {
                            education.degree
                        }
                    </h3>

                    {education.institution ? (
                        <p
                            className="
                                mt-1
                                text-sm
                                font-medium
                            "
                            style={{
                                color: primary
                            }}
                        >
                            {
                                education.institution
                            }
                        </p>
                    ) : null}

                    {education.fieldOfStudy ? (
                        <p
                            className="
                                mt-1
                                text-xs
                                text-slate-500
                            "
                        >
                            {
                                education.fieldOfStudy
                            }
                        </p>
                    ) : null}
                </div>

                {start || end ? (
                    <p
                        className="
                            text-xs
                            text-slate-500
                        "
                    >
                        {start}
                        {start && end
                            ? " — "
                            : ""}
                        {end}
                    </p>
                ) : null}
            </div>

            {education.location ? (
                <p
                    className="
                        mt-3
                        text-xs
                        text-slate-500
                    "
                >
                    📍{" "}
                    {
                        education.location
                    }
                </p>
            ) : null}

            {education.grade ? (
                <p
                    className="
                        mt-3
                        text-xs
                        text-slate-400
                    "
                >
                    Grade:{" "}
                    <span className="text-slate-300">
                        {
                            education.grade
                        }
                    </span>
                </p>
            ) : null}

            {education.description ? (
                <p
                    className="
                        mt-4
                        text-sm
                        leading-7
                        text-slate-400
                    "
                >
                    {
                        education.description
                    }
                </p>
            ) : null}

            {achievements.length > 0 ? (
                <div
                    className="
                        mt-4
                        space-y-2
                    "
                >
                    {achievements.map(
                        (
                            achievement,
                            index
                        ) => (
                            <div
                                key={`${achievement}-${index}`}
                                className="
                                    flex
                                    gap-2
                                    text-xs
                                    text-slate-500
                                "
                            >
                                <span
                                    style={{
                                        color:
                                            primary
                                    }}
                                >
                                    •
                                </span>

                                <span>
                                    {
                                        achievement
                                    }
                                </span>
                            </div>
                        )
                    )}
                </div>
            ) : null}
        </article>
    );
};

// ========================================
// CERTIFICATE CARD
// ========================================

const CertificateCard = ({
    certificate,
    primary
}) => {

    const file =
        certificate.certificateImage;

    const mediaType =
        getMediaType(file);

    return (
        <article
            className="
                overflow-hidden
                rounded-2xl
                border
                border-white/10
                bg-white/[0.02]
                transition
                duration-300
                hover:border-cyan-400/30
                hover:-translate-y-1
            "
        >

            {/* ========================================
                CERTIFICATE MEDIA
            ======================================== */}

            {file ? (

                mediaType === "image" ? (

                    <div
                        className="
                            flex
                            h-52
                            items-center
                            justify-center
                            overflow-hidden
                            bg-[#050a14]
                        "
                    >
                        <img
                            src={file}
                            alt={
                                certificate.title ||
                                "Certificate"
                            }
                            className="
                                h-full
                                w-full
                                object-contain
                            "
                        />
                    </div>

                ) : (

                    <div
                        className="
                            flex
                            h-52
                            flex-col
                            items-center
                            justify-center
                            gap-4
                            border-b
                            border-white/10
                            bg-[#07111f]
                            px-5
                            text-center
                        "
                    >
                        <div
                            className="
                                flex
                                h-16
                                w-16
                                items-center
                                justify-center
                                rounded-2xl
                                border
                                border-cyan-400/20
                                bg-cyan-400/10
                                text-3xl
                                shadow-[0_0_30px_rgba(34,211,238,0.08)]
                            "
                        >
                            📄
                        </div>

                        <div className="min-w-0">
                            <p
                                className="
                                    text-sm
                                    font-semibold
                                    text-white
                                "
                            >
                                Certificate Document
                            </p>

                            <p
                                className="
                                    mt-1
                                    text-xs
                                    text-slate-500
                                "
                            >
                                PDF / Document / File
                            </p>
                        </div>

                        <a
                            href={file}
                            target="_blank"
                            rel="noreferrer"
                            className="
                                rounded-lg
                                px-4
                                py-2
                                text-xs
                                font-semibold
                                text-slate-950
                                transition
                                hover:opacity-90
                            "
                            style={{
                                backgroundColor:
                                    primary
                            }}
                        >
                            View Certificate ↗
                        </a>
                    </div>
                )

            ) : null}

            {/* ========================================
                CONTENT
            ======================================== */}

            <div className="p-5">
                <h3
                    className="
                        text-lg
                        font-bold
                        leading-6
                        text-white
                    "
                >
                    {certificate.title}
                </h3>

                {certificate.issuingOrganization ? (
                    <p
                        className="
                            mt-2
                            text-sm
                            font-medium
                        "
                        style={{
                            color: primary
                        }}
                    >
                        {certificate.issuingOrganization}
                    </p>
                ) : null}

                {certificate.issueDate ? (
                    <p
                        className="
                            mt-2
                            text-xs
                            text-slate-500
                        "
                    >
                        Issued {formatDate(certificate.issueDate)}
                    </p>
                ) : null}

                {certificate.expiryDate ? (
                    <p
                        className="
                            mt-1
                            text-xs
                            text-slate-500
                        "
                    >
                        Expires {formatDate(certificate.expiryDate)}
                    </p>
                ) : null}

                {certificate.credentialId ? (
                    <p
                        className="
                            mt-2
                            break-all
                            text-xs
                            text-slate-500
                        "
                    >
                        Credential ID: {certificate.credentialId}
                    </p>
                ) : null}

                {certificate.description ? (
                    <p
                        className="
                            mt-4
                            text-sm
                            leading-6
                            text-slate-400
                        "
                    >
                        {certificate.description}
                    </p>
                ) : null}

                <div
                    className="
                        mt-4
                        flex
                        flex-wrap
                        gap-2
                    "
                >
                    {certificate.credentialUrl ? (
                        <a
                            href={certificate.credentialUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="
                                inline-flex
                                rounded-lg
                                px-3
                                py-2
                                text-xs
                                font-semibold
                                text-slate-950
                                transition
                                hover:opacity-90
                            "
                            style={{
                                backgroundColor: primary
                            }}
                        >
                            View Credential ↗
                        </a>
                    ) : null}

                    {file ? (
                        <a
                            href={file}
                            target="_blank"
                            rel="noreferrer"
                            className="
                                inline-flex
                                rounded-lg
                                border
                                border-white/10
                                bg-white/[0.03]
                                px-3
                                py-2
                                text-xs
                                font-medium
                                text-slate-300
                                transition
                                hover:bg-white/[0.06]
                            "
                        >
                            Open Certificate ↗
                        </a>
                    ) : null}
                </div>
            </div>
        </article>
    );
};

// ========================================
// POST CARD
// ========================================

const PostCard = ({
    post,
    primary
}) => {

    const mediaType =
        getMediaType(
            post.coverImage
        );

    const tags =
        toArray(post.tags);

    const technologies =
        toArray(post.technologies);

    return (
        <article
            className="
                overflow-hidden
                rounded-2xl
                border
                border-white/10
                bg-white/[0.02]
                transition
                duration-300
                hover:border-cyan-400/30
                hover:-translate-y-1
            "
        >

            {/* ========================================
                POST MEDIA
            ======================================== */}

            {post.coverImage ? (
                <div className="border-b border-white/10">

                    {mediaType === "image" ? (
                        <div
                            className="
                                h-52
                                overflow-hidden
                                bg-[#050a14]
                            "
                        >
                            <img
                                src={post.coverImage}
                                alt={post.title || "Post"}
                                className="
                                    block
                                    h-full
                                    w-full
                                    object-cover
                                "
                            />
                        </div>
                    ) : null}

                    {mediaType === "video" ? (
                        <div
                            className="
                                flex
                                h-52
                                w-full
                                items-center
                                justify-center
                                bg-black
                            "
                        >
                            <video
                                src={post.coverImage}
                                controls
                                preload="metadata"
                                className="
                                    h-52
                                    w-full
                                    bg-black
                                    object-contain
                                "
                            />
                        </div>
                    ) : null}

                    {mediaType === "audio" ? (
                        <div
                            className="
                                flex
                                items-center
                                gap-4
                                bg-[#07111f]
                                px-5
                                py-6
                            "
                        >
                            <div
                                className="
                                    flex
                                    h-12
                                    w-12
                                    shrink-0
                                    items-center
                                    justify-center
                                    rounded-xl
                                    border
                                    border-cyan-400/20
                                    bg-cyan-400/10
                                    text-xl
                                "
                            >
                                🎵
                            </div>

                            <audio
                                src={post.coverImage}
                                controls
                                className="min-w-0 flex-1"
                            />

                            <a
                                href={post.coverImage}
                                target="_blank"
                                rel="noreferrer"
                                className="
                                    shrink-0
                                    rounded-lg
                                    border
                                    border-white/10
                                    px-3
                                    py-2
                                    text-xs
                                    text-slate-300
                                    hover:bg-white/5
                                "
                            >
                                Open ↗
                            </a>
                        </div>
                    ) : null}

                    {mediaType === "file" ? (
                        <div
                            className="
                                flex
                                items-center
                                justify-between
                                gap-4
                                bg-[#07111f]
                                px-5
                                py-5
                            "
                        >
                            <div
                                className="
                                    flex
                                    min-w-0
                                    items-center
                                    gap-3
                                "
                            >
                                <div
                                    className="
                                        flex
                                        h-12
                                        w-12
                                        shrink-0
                                        items-center
                                        justify-center
                                        rounded-xl
                                        border
                                        border-cyan-400/20
                                        bg-cyan-400/10
                                        text-xl
                                    "
                                >
                                    📎
                                </div>

                                <div className="min-w-0">
                                    <p
                                        className="
                                            text-sm
                                            font-semibold
                                            text-white
                                        "
                                    >
                                        Attached File
                                    </p>

                                    <p
                                        className="
                                            mt-1
                                            truncate
                                            text-xs
                                            text-slate-500
                                        "
                                    >
                                        PDF / Document / File
                                    </p>
                                </div>
                            </div>

                            <a
                                href={post.coverImage}
                                target="_blank"
                                rel="noreferrer"
                                className="
                                    shrink-0
                                    rounded-lg
                                    px-3
                                    py-2
                                    text-xs
                                    font-semibold
                                    text-slate-950
                                    transition
                                    hover:opacity-90
                                "
                                style={{
                                    backgroundColor: primary
                                }}
                            >
                                Open File ↗
                            </a>
                        </div>
                    ) : null}

                </div>
            ) : null}

            {/* ========================================
                POST CONTENT
            ======================================== */}

            <div className="p-5">
                <div
                    className="
                        flex
                        flex-wrap
                        items-center
                        gap-2
                    "
                >
                    {post.postType ? (
                        <span
                            className="
                                rounded-full
                                border
                                border-white/10
                                bg-white/[0.03]
                                px-2.5
                                py-1
                                text-[10px]
                                capitalize
                                text-slate-400
                            "
                        >
                            {post.postType}
                        </span>
                    ) : null}

                    {post.isFeatured ? (
                        <span
                            className="
                                rounded-full
                                border
                                border-amber-400/20
                                bg-amber-400/10
                                px-2.5
                                py-1
                                text-[10px]
                                text-amber-300
                            "
                        >
                            ⭐ Featured
                        </span>
                    ) : null}

                    {post.publishedAt ? (
                        <span
                            className="
                                text-[10px]
                                text-slate-600
                            "
                        >
                            {formatDate(post.publishedAt)}
                        </span>
                    ) : null}
                </div>

                <h3
                    className="
                        mt-3
                        text-lg
                        font-bold
                        leading-6
                        text-white
                    "
                >
                    {post.title}
                </h3>

                {post.slug ? (
                    <p
                        className="mt-1 text-xs text-cyan-300/80"
                    >
                        /{post.slug}
                    </p>
                ) : null}

                {post.excerpt ? (
                    <p
                        className="
                            mt-2
                            text-sm
                            leading-6
                            text-slate-400
                        "
                    >
                        {post.excerpt}
                    </p>
                ) : null}

                {post.content ? (
                    <p
                        className="
                            mt-3
                            line-clamp-4
                            whitespace-pre-line
                            text-xs
                            leading-6
                            text-slate-500
                        "
                    >
                        {post.content}
                    </p>
                ) : null}

                {tags.length > 0 ? (
                    <div
                        className="
                            mt-4
                            flex
                            flex-wrap
                            gap-2
                        "
                    >
                        {tags.map(
                            (tag, index) => (
                                <span
                                    key={`${tag}-${index}`}
                                    className="
                                        rounded-lg
                                        border
                                        border-white/10
                                        bg-white/[0.03]
                                        px-2
                                        py-1
                                        text-[10px]
                                        text-slate-400
                                    "
                                >
                                    #{tag}
                                </span>
                            )
                        )}
                    </div>
                ) : null}

                {technologies.length > 0 ? (
                    <div
                        className="
                            mt-3
                            flex
                            flex-wrap
                            gap-2
                        "
                    >
                        {technologies.map(
                            (technology, index) => (
                                <span
                                    key={`${technology}-${index}`}
                                    className="
                                        rounded-lg
                                        border
                                        border-cyan-400/10
                                        bg-cyan-400/[0.03]
                                        px-2
                                        py-1
                                        text-[10px]
                                        text-cyan-300
                                    "
                                >
                                    {technology}
                                </span>
                            )
                        )}
                    </div>
                ) : null}

                <div
                    className="
                        mt-5
                        flex
                        flex-wrap
                        gap-2
                    "
                >
                    {post.githubUrl ? (
                        <a
                            href={post.githubUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="
                                rounded-lg
                                border
                                border-white/10
                                bg-white/[0.03]
                                px-3
                                py-2
                                text-[11px]
                                text-slate-300
                                hover:bg-white/5
                            "
                        >
                            GitHub ↗
                        </a>
                    ) : null}

                    {post.demoUrl ? (
                        <a
                            href={post.demoUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="
                                rounded-lg
                                px-3
                                py-2
                                text-[11px]
                                font-semibold
                                text-slate-950
                            "
                            style={{
                                backgroundColor: primary
                            }}
                        >
                            Demo ↗
                        </a>
                    ) : null}

                    {post.externalUrl ? (
                        <a
                            href={post.externalUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="
                                rounded-lg
                                border
                                border-white/10
                                bg-white/[0.03]
                                px-3
                                py-2
                                text-[11px]
                                text-slate-300
                                hover:bg-white/5
                            "
                        >
                            Open ↗
                        </a>
                    ) : null}
                </div>
            </div>
        </article>
    );
};

// ========================================
// LIVE PORTFOLIO PREVIEW
// ========================================

const LivePortfolioPreview = ({
    form,
    user,
    publicData,
     isPublic = false
}) => {
    const [
        projects,
        setProjects
    ] = useState([]);

    const [
        skills,
        setSkills
    ] = useState([]);

    const [
        experiences,
        setExperiences
    ] = useState([]);

    const [
        education,
        setEducation
    ] = useState([]);

    const [
        certificates,
        setCertificates
    ] = useState([]);

    const [
        posts,
        setPosts
    ] = useState([]);

    const [
        loading,
        setLoading
    ] = useState(true);

    const [
        dataError,
        setDataError
    ] = useState("");

    const primary =
        form?.customization
            ?.primaryColor ||
        "#22d3ee";

    const secondary =
        form?.customization
            ?.secondaryColor ||
        "#3b82f6";

    const seo = form?.seo || {};

    const seoKeywords = toArray(
        seo.keywords
    );

    // ========================================
    // LOAD REAL PROJECT DATA
    // ========================================

    useEffect(() => {
        let mounted = true;

        if (publicData) {
            setProjects(
                toArray(
                    publicData.projects
                ).filter(
                    (item) =>
                        item &&
                        item.isPublished === true
                )
            );

            setSkills(
                toArray(
                    publicData.skills
                ).filter(
                    (item) =>
                        item &&
                        item.isPublished === true
                )
            );

            setExperiences(
                toArray(
                    publicData.experiences
                ).filter(
                    (item) =>
                        item &&
                        item.isPublished === true
                )
            );

            setEducation(
                toArray(
                    publicData.education
                ).filter(
                    (item) =>
                        item &&
                        item.isPublished === true
                )
            );

            setCertificates(
                toArray(
                    publicData.certificates
                ).filter(
                    (item) =>
                        item &&
                        item.isPublished === true
                )
            );

            setPosts(
                toArray(
                    publicData.posts
                ).filter(
                    (item) =>
                        item &&
                        item.isPublished === true
                )
            );

            setDataError("");
            setLoading(false);

            return () => {
                mounted = false;
            };
        }

        const loadData = async () => {
            try {
                setLoading(true);
                setDataError("");

                const results =
                    await Promise.allSettled([
                        getMyProjects(),
                        getMySkills(),
                        getMyExperiences(),
                        getMyEducation(),
                        getMyCertificates(),
                        getMyPosts()
                    ]);

                if (!mounted) {
                    return;
                }

                const [
                    projectsResult,
                    skillsResult,
                    experiencesResult,
                    educationResult,
                    certificatesResult,
                    postsResult
                ] = results;

                if (
                    projectsResult.status ===
                    "fulfilled"
                ) {
                    setProjects(
                        toArray(
                            projectsResult
                                .value
                                ?.data
                        ).filter(
                            (item) =>
                                item?.isPublished ===
                                true
                        )
                    );
                } else {
                    setProjects([]);
                }

                if (
                    skillsResult.status ===
                    "fulfilled"
                ) {
                    setSkills(
                        toArray(
                            skillsResult
                                .value
                                ?.data
                        ).filter(
                            (item) =>
                                item?.isPublished ===
                                true
                        )
                    );
                } else {
                    setSkills([]);
                }

                if (
                    experiencesResult.status ===
                    "fulfilled"
                ) {
                    setExperiences(
                        toArray(
                            experiencesResult
                                .value
                                ?.data
                        ).filter(
                            (item) =>
                                item?.isPublished ===
                                true
                        )
                    );
                } else {
                    setExperiences([]);
                }

                if (
                    educationResult.status ===
                    "fulfilled"
                ) {
                    setEducation(
                        toArray(
                            educationResult
                                .value
                                ?.data
                        ).filter(
                            (item) =>
                                item?.isPublished ===
                                true
                        )
                    );
                } else {
                    setEducation([]);
                }

                if (
                    certificatesResult.status ===
                    "fulfilled"
                ) {
                    setCertificates(
                        toArray(
                            certificatesResult
                                .value
                                ?.data
                        ).filter(
                            (item) =>
                                item?.isPublished ===
                                true
                        )
                    );
                } else {
                    setCertificates([]);
                }

                if (
                    postsResult.status ===
                    "fulfilled"
                ) {
                    setPosts(
                        toArray(
                            postsResult
                                .value
                                ?.data
                        ).filter(
                            (item) =>
                                item?.isPublished ===
                                true
                        )
                    );
                } else {
                    setPosts([]);
                }
            } catch (error) {
                if (mounted) {
                    setDataError(
                        error?.message ||
                            "Unable to load portfolio content."
                    );
                }
            } finally {
                if (mounted) {
                    setLoading(false);
                }
            }
        };

        loadData();

        return () => {
            mounted = false;
        };
    }, [publicData]);

    // ========================================
    // SORT
    // ========================================

    const sortedProjects =
        useMemo(() => {
            return [...projects].sort(
                (a, b) =>
                    Number(
                        a.order ?? 0
                    ) -
                        Number(
                            b.order ?? 0
                        )
            );
        }, [projects]);

    const sortedSkills =
        useMemo(() => {
            return [...skills].sort(
                (a, b) =>
                    Number(
                        a.order ?? 0
                    ) -
                        Number(
                            b.order ?? 0
                        )
            );
        }, [skills]);

    const sortedExperiences =
        useMemo(() => {
            return [...experiences].sort(
                (a, b) =>
                    Number(
                        a.order ?? 0
                    ) -
                        Number(
                            b.order ?? 0
                        )
            );
        }, [experiences]);

    const sortedEducation =
        useMemo(() => {
            return [...education].sort(
                (a, b) =>
                    Number(
                        a.order ?? 0
                    ) -
                        Number(
                            b.order ?? 0
                        )
            );
        }, [education]);

    const sortedCertificates =
        useMemo(() => {
            return [...certificates].sort(
                (a, b) =>
                    Number(
                        a.order ?? 0
                    ) -
                        Number(
                            b.order ?? 0
                        )
            );
        }, [certificates]);

    const sortedPosts =
        useMemo(() => {
            return [...posts].sort(
                (a, b) =>
                    Number(
                        a.order ?? 0
                    ) -
                        Number(
                            b.order ?? 0
                        )
            );
        }, [posts]);

    // ========================================
    // REAL COUNTS
    // ========================================

    const technologiesCount =
        useMemo(() => {
            const values =
                new Set();

            [
                ...sortedSkills,
                ...sortedProjects,
                ...sortedExperiences,
                ...sortedPosts
            ].forEach(
                (item) => {
                    toArray(
                        item?.technologies
                    ).forEach(
                        (technology) => {
                            if (
                                technology
                            ) {
                                values.add(
                                    String(
                                        technology
                                    )
                                );
                            }
                        }
                    );
                }
            );

            return values.size;
        }, [
            sortedSkills,
            sortedProjects,
            sortedExperiences,
            sortedPosts
        ]);

    // ========================================
    // NAME
    // ========================================

    const name =
        form?.title ||
        user?.name ||
        "Your Name";

    const parts =
        String(name).trim().split(/\s+/);

    const first =
        parts[0] || "Your";

    const rest =
        parts
            .slice(1)
            .join(" ");

    // ========================================
    // SOCIALS
    // ========================================

    const socialLinks = [
        {
            label: "GH",
            href: form?.github
        },
        {
            label: "IN",
            href: form?.linkedin
        },
        {
            label: "X",
            href: form?.twitter
        },
        {
            label: "IG",
            href: form?.instagram
        },
        {
            label: "YT",
            href: form?.youtube
        },
        {
            label: "WEB",
            href: form?.website
        }
    ].filter(
        (item) => item.href
    );

    // ========================================
    // SELECTED TEMPLATE
    // Existing portfolio structure stays the same.
    // Only the visual presentation changes here.
    // ========================================

    const selectedTemplate =
        [
            "modern",
            "minimal",
            "developer",
            "creative"
        ].includes(form?.template)
            ? form.template
            : "modern";

    return (
        <section
            data-template={selectedTemplate}
            className={`
                min-w-0
                rounded-3xl
                border
                border-white/10
                bg-[#070b16]
                p-3
                shadow-2xl
                sm:p-4
                portfolio-template-${selectedTemplate}
            `}
        >
            <style>{`
                /* ========================================
                   TEMPLATE VISUAL SYSTEM
                   Modern = existing UI unchanged
                   Minimal = clean editorial layout
                   Developer = terminal / code aesthetic
                   Creative = bold glass / gradient aesthetic
                ======================================== */

                .portfolio-template-modern {
                    --template-surface: #070b16;
                    --template-inner: #020712;
                }

                .portfolio-template-minimal {
                    background: #f8fafc !important;
                    border-color: #e2e8f0 !important;
                    color: #0f172a !important;
                    box-shadow: 0 20px 50px rgba(15, 23, 42, 0.08) !important;
                }

                .portfolio-template-minimal > div:last-of-type {
                    background: #ffffff !important;
                    border-color: #e2e8f0 !important;
                    border-radius: 1rem !important;
                }

                .portfolio-template-minimal nav {
                    background: #ffffff !important;
                    border-color: #e2e8f0 !important;
                }

                .portfolio-template-minimal h1,
                .portfolio-template-minimal h2,
                .portfolio-template-minimal h3,
                .portfolio-template-minimal p,
                .portfolio-template-minimal span,
                .portfolio-template-minimal li {
                    color: #0f172a;
                }

                .portfolio-template-minimal .text-slate-300,
                .portfolio-template-minimal .text-slate-400 {
                    color: #475569 !important;
                }

                .portfolio-template-minimal .text-slate-500,
                .portfolio-template-minimal .text-slate-600 {
                    color: #64748b !important;
                }

                .portfolio-template-minimal article,
                .portfolio-template-minimal nav a,
                .portfolio-template-minimal section > div > a,
                .portfolio-template-minimal section > div > div {
                    border-color: #e2e8f0 !important;
                    background: #ffffff !important;
                }

                .portfolio-template-minimal img {
                    border-radius: 0.75rem;
                }

                .portfolio-template-developer {
                    background: #050805 !important;
                    border-color: rgba(74, 222, 128, 0.2) !important;
                    box-shadow: 0 0 60px rgba(74, 222, 128, 0.05) !important;
                }

                .portfolio-template-developer > div:last-of-type {
                    background: #020602 !important;
                    border-color: rgba(74, 222, 128, 0.18) !important;
                    font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace !important;
                }

                .portfolio-template-developer nav {
                    background: #030803 !important;
                    border-color: rgba(74, 222, 128, 0.16) !important;
                }

                .portfolio-template-developer nav::before {
                    content: "root@portfolio:~$";
                    margin-right: 1rem;
                    color: #4ade80;
                    font-size: 10px;
                    font-weight: 700;
                    letter-spacing: 0.08em;
                }

                .portfolio-template-developer article {
                    border-radius: 0.5rem !important;
                    border-color: rgba(74, 222, 128, 0.14) !important;
                    background: rgba(74, 222, 128, 0.025) !important;
                }

                .portfolio-template-developer section {
                    background-image: linear-gradient(
                        rgba(74, 222, 128, 0.025) 1px,
                        transparent 1px
                    ), linear-gradient(
                        90deg,
                        rgba(74, 222, 128, 0.025) 1px,
                        transparent 1px
                    );
                    background-size: 24px 24px;
                }

                .portfolio-template-creative {
                    background: linear-gradient(135deg, #090d1f, #120c24 48%, #071525) !important;
                    border-color: rgba(168, 85, 247, 0.25) !important;
                    box-shadow: 0 30px 80px rgba(124, 58, 237, 0.12) !important;
                }

                .portfolio-template-creative > div:last-of-type {
                    background:
                        radial-gradient(circle at 10% 10%, rgba(34, 211, 238, 0.08), transparent 26%),
                        radial-gradient(circle at 90% 20%, rgba(168, 85, 247, 0.10), transparent 28%),
                        #030615 !important;
                    border-color: rgba(168, 85, 247, 0.18) !important;
                }

                .portfolio-template-creative nav {
                    background: rgba(255, 255, 255, 0.025) !important;
                    backdrop-filter: blur(16px);
                    border-color: rgba(255, 255, 255, 0.08) !important;
                }

                .portfolio-template-creative article {
                    border-radius: 1.5rem !important;
                    background: rgba(255, 255, 255, 0.035) !important;
                    box-shadow: 0 20px 45px rgba(0, 0, 0, 0.18);
                }

                .portfolio-template-creative #preview-home h2 {
                    font-size: clamp(2.75rem, 6vw, 5.5rem);
                    line-height: 0.95;
                    letter-spacing: -0.055em;
                }

                .portfolio-template-creative section > div {
                    transition: transform 220ms ease, border-color 220ms ease;
                }

                .portfolio-template-creative article:hover {
                    transform: translateY(-4px) rotate(-0.15deg);
                }
            `}</style>

            {/* PREVIEW LABEL */}

            <div
                className="
                    mb-3
                    flex
                    items-center
                    justify-between
                    px-2
                "
            >
                <div>
                    <p
                        className="
                            text-[10px]
                            font-bold
                            uppercase
                            tracking-[0.22em]
                            text-slate-500
                        "
                    >
                        Live Preview
                    </p>

                    <p
                        className="
                            mt-1
                            text-xs
                            text-slate-600
                        "
                    >
                        Real portfolio data
                    </p>
                </div>

                <span
                    className="
                        inline-flex
                        items-center
                        gap-2
                        text-xs
                        text-emerald-300
                    "
                >
                    <span
                        className="
                            h-1.5
                            w-1.5
                            rounded-full
                            bg-emerald-400
                        "
                    />

                    Live
                </span>
            </div>

            {dataError ? (
                <div
                    className="
                        mb-3
                        rounded-xl
                        border
                        border-red-400/20
                        bg-red-400/5
                        px-4
                        py-3
                        text-xs
                        text-red-300
                    "
                >
                    {dataError}
                </div>
            ) : null}

            <div
                className="
                    overflow-hidden
                    rounded-2xl
                    border
                    border-white/10
                    bg-[#020712]
                "
            >
                {/* ========================================
                    NAVBAR
                ======================================== */}

                <nav
                    className="
                        flex
                        items-center
                        justify-between
                        border-b
                        border-white/10
                        px-5
                        py-4
                        sm:px-8
                    "
                >
                    <div>
                        <span
                            className="
                                text-sm
                                font-black
                                text-white
                            "
                        >
                            {first}
                        </span>

                        {rest ? (
                            <span
                                className="
                                    text-sm
                                    font-black
                                "
                                style={{
                                    color: primary
                                }}
                            >
                                {" "}
                                {rest}
                            </span>
                        ) : null}
                    </div>

                    <div
                        className="
                            hidden
                            items-center
                            gap-6
                            text-xs
                            text-slate-500
                            md:flex
                        "
                    >
                        <a
                            href="#preview-home"
                            className="hover:text-white"
                        >
                            Home
                        </a>

                        {form.showAboutSection ? (
                            <a
                                href="#preview-about"
                                className="hover:text-white"
                            >
                                About
                            </a>
                        ) : null}

                        {form.showSkillsSection &&
                        sortedSkills.length >
                            0 ? (
                            <a
                                href="#preview-skills"
                                className="hover:text-white"
                            >
                                Skills
                            </a>
                        ) : null}

                        {form.showProjectsSection &&
                        sortedProjects.length >
                            0 ? (
                            <a
                                href="#preview-projects"
                                className="hover:text-white"
                            >
                                Projects
                            </a>
                        ) : null}

                        {form.showExperienceSection &&
                        sortedExperiences.length >
                            0 ? (
                            <a
                                href="#preview-experience"
                                className="hover:text-white"
                            >
                                Experience
                            </a>
                        ) : null}

                        {form.showEducationSection &&
                        sortedEducation.length >
                            0 ? (
                            <a
                                href="#preview-education"
                                className="hover:text-white"
                            >
                                Education
                            </a>
                        ) : null}

                        {form.showCertificatesSection &&
                        sortedCertificates.length >
                            0 ? (
                            <a
                                href="#preview-certificates"
                                className="hover:text-white"
                            >
                                Certificates
                            </a>
                        ) : null}

                        {form.showPostsSection &&
                        sortedPosts.length >
                            0 ? (
                            <a
                                href="#preview-posts"
                                className="hover:text-white"
                            >
                                Posts
                            </a>
                        ) : null}

                        {form.showContactSection ? (
                            <a
                                href="#preview-contact"
                                className="hover:text-white"
                            >
                                Contact
                            </a>
                        ) : null}
                    </div>

                    {form.showContactSection &&
                    (form.email ||
                        user?.email) ? (
                        <a
                            href={`mailto:${
                                form.email ||
                                user?.email ||
                                ""
                            }`}
                            className="
                                rounded-lg
                                px-3
                                py-2
                                text-[10px]
                                font-bold
                                text-slate-950
                            "
                            style={{
                                backgroundColor:
                                    primary
                            }}
                        >
                            Let's Connect
                        </a>
                    ) : null}
                </nav>

                {/* ========================================
                    HERO
                ======================================== */}

                <section
                    id="preview-home"
                    className="
                        grid
                        gap-10
                        px-6
                        py-14
                        sm:px-12
                        sm:py-20
                        lg:grid-cols-2
                        lg:items-center
                    "
                >
                    {/* TEXT */}

                    <div
                        className="
                            order-2
                            lg:order-1
                        "
                    >
                        <p
                            className="
                                text-sm
                                font-medium
                            "
                            style={{
                                color: primary
                            }}
                        >
                            Hello, I'm
                        </p>

                        <h2
                            className={`
        mt-3
        text-4xl
        font-black
        tracking-tight
        sm:text-5xl
        text-white
        ${isPublic ? "animate-pulse" : ""}
    `}
                        >
                            {name}
                        </h2>

                        {form.headline ? (
                            <p
                                className="
                                    mt-4
                                    text-lg
                                    font-semibold
                                    text-slate-300
                                "
                            >
                                {
                                    form.headline
                                }
                            </p>
                        ) : null}

                        {form.bio ? (
                            <p
                                className="
                                    mt-5
                                    max-w-xl
                                    whitespace-pre-line
                                    text-sm
                                    leading-7
                                    text-slate-400
                                "
                            >
                                {
                                    form.bio
                                }
                            </p>
                        ) : null}

                        {form.location ? (
                            <p
                                className="
                                    mt-4
                                    text-xs
                                    text-slate-500
                                "
                            >
                                📍{" "}
                                {
                                    form.location
                                }
                            </p>
                        ) : null}

                        {socialLinks.length >
                        0 ? (
                            <div
                                className="
                                    mt-6
                                    flex
                                    flex-wrap
                                    gap-2
                                "
                            >
                                {socialLinks.map(
                                    (
                                        item
                                    ) => (
                                        <SocialIcon
                                            key={
                                                item.label
                                            }
                                            label={
                                                item.label
                                            }
                                            href={
                                                item.href
                                            }
                                        />
                                    )
                                )}
                            </div>
                        ) : null}

                        <div
                            className="
                                mt-7
                                flex
                                flex-wrap
                                gap-3
                            "
                        >
                            {form.showContactSection &&
                            (form.email ||
                                user?.email) ? (
                                <a
                                    href={`mailto:${
                                        form.email ||
                                        user?.email ||
                                        ""
                                    }`}
                                    className="
                                        rounded-lg
                                        px-5
                                        py-2.5
                                        text-xs
                                        font-bold
                                        text-slate-950
                                    "
                                    style={{
                                        backgroundColor:
                                            primary
                                    }}
                                >
                                    Let's Connect
                                    →
                                </a>
                            ) : null}

                            {form.resume?.url ? (
                                <a
                                    href={
                                        form.resume.url
                                    }
                                    target="_blank"
                                    rel="noreferrer"
                                    className="
                                        rounded-lg
                                        border
                                        px-5
                                        py-2.5
                                        text-xs
                                        font-medium
                                        text-cyan-300
                                    "
                                    style={{
                                        borderColor:
                                            `${primary}55`
                                    }}
                                >
                                    Download CV
                                </a>
                            ) : null}
                        </div>

                        {/* PROFILE CONTACT DETAILS */}

                        {form.email ||
                        form.phone ||
                        form.website ? (
                            <div
                                className="
                                    mt-6
                                    grid
                                    grid-cols-1
                                    gap-2
                                    sm:grid-cols-2
                                "
                            >
                                {form.email ? (
                                    <a
                                        href={`mailto:${form.email}`}
                                        className="
                                            rounded-xl
                                            border
                                            border-white/10
                                            bg-white/[0.03]
                                            px-4
                                            py-3
                                            text-xs
                                            text-slate-300
                                            transition
                                            hover:bg-white/[0.06]
                                        "
                                    >
                                        <span
                                            className="
                                                block
                                                text-[10px]
                                                font-bold
                                                uppercase
                                                tracking-[0.15em]
                                                text-slate-600
                                            "
                                        >
                                            Email
                                        </span>

                                        <span
                                            className="
                                                mt-1
                                                block
                                                break-all
                                            "
                                        >
                                            {form.email}
                                        </span>
                                    </a>
                                ) : null}

                                {form.phone ? (
                                    <a
                                        href={`tel:${form.phone}`}
                                        className="
                                            rounded-xl
                                            border
                                            border-white/10
                                            bg-white/[0.03]
                                            px-4
                                            py-3
                                            text-xs
                                            text-slate-300
                                            transition
                                            hover:bg-white/[0.06]
                                        "
                                    >
                                        <span
                                            className="
                                                block
                                                text-[10px]
                                                font-bold
                                                uppercase
                                                tracking-[0.15em]
                                                text-slate-600
                                            "
                                        >
                                            Phone
                                        </span>

                                        <span
                                            className="
                                                mt-1
                                                block
                                            "
                                        >
                                            {form.phone}
                                        </span>
                                    </a>
                                ) : null}

                                {form.website ? (
                                    <a
                                        href={form.website}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="
                                            rounded-xl
                                            border
                                            border-white/10
                                            bg-white/[0.03]
                                            px-4
                                            py-3
                                            text-xs
                                            text-slate-300
                                            transition
                                            hover:bg-white/[0.06]
                                            sm:col-span-2
                                        "
                                    >
                                        <span
                                            className="
                                                block
                                                text-[10px]
                                                font-bold
                                                uppercase
                                                tracking-[0.15em]
                                                text-slate-600
                                            "
                                        >
                                            Website
                                        </span>

                                        <span
                                            className="
                                                mt-1
                                                block
                                                break-all
                                            "
                                        >
                                            {form.website}
                                        </span>
                                    </a>
                                ) : null}
                            </div>
                        ) : null}
                    </div>

                    {/* PROFILE IMAGE */}

                    <div
                        className="
                            order-1
                            flex
                            justify-center
                            lg:order-2
                        "
                    >
                        <div
                            className="
                                relative
                                flex
                                h-56
                                w-56
                                items-center
                                justify-center
                                rounded-full
                                border
                                sm:h-72
                                sm:w-72
                            "
                            style={{
                                borderColor:
                                    `${primary}55`,
                                boxShadow:
                                    `0 0 100px ${primary}22`
                            }}
                        >
                            <div
                                className="
                                    absolute
                                    inset-5
                                    rounded-full
                                    border
                                "
                                style={{
                                    borderColor:
                                        `${secondary}44`
                                }}
                            />

                            <div
                                className="
                                    absolute
                                    inset-2
                                    rounded-full
                                    border
                                    border-dashed
                                    border-white/10
                                "
                            />

                            <div
                                className="
                                    flex
                                    h-44
                                    w-44
                                    items-center
                                    justify-center
                                    overflow-hidden
                                    rounded-full
                                    bg-[#0b1222]
                                    text-5xl
                                    font-black
                                    text-cyan-300
                                    sm:h-56
                                    sm:w-56
                                "
                            >
                                {form.profileImage ? (
                                    <img
                                        src={
                                            form.profileImage
                                        }
                                        alt={
                                            name
                                        }
                                        className="
                                            h-full
                                            w-full
                                            object-cover
                                        "
                                    />
                                ) : (
                                    name
                                        .charAt(
                                            0
                                        )
                                        .toUpperCase()
                                )}
                            </div>
                        </div>
                    </div>
                </section>

                {/* ========================================
                    REAL METRICS
                ======================================== */}

                <div
                    className="
                        grid
                        grid-cols-2
                        border-y
                        border-white/10
                        sm:grid-cols-4
                    "
                >
                    <Metric
                        value={
                            sortedProjects.length
                        }
                        label="Projects"
                    />

                    <Metric
                        value={
                            sortedExperiences.length
                        }
                        label="Experience"
                    />

                    <Metric
                        value={
                            technologiesCount
                        }
                        label="Technologies"
                    />

                    <Metric
                        value={
                            sortedCertificates.length
                        }
                        label="Certificates"
                    />
                </div>

                {/* ========================================
                    ABOUT
                ======================================== */}

                {form.showAboutSection &&
                form.bio ? (
                    <section
                        id="preview-about"
                        className="
                            border-b
                            border-white/10
                            px-6
                            py-12
                            sm:px-12
                        "
                    >
                        <SectionHeading
                            number="01"
                            title="About Me"
                        />

                        <p
                            className="
                                max-w-4xl
                                whitespace-pre-line
                                text-sm
                                leading-8
                                text-slate-400
                            "
                        >
                            {form.bio}
                        </p>
                    </section>
                ) : null}

                {/* ========================================
                    SKILLS
                ======================================== */}

                {form.showSkillsSection &&
                sortedSkills.length >
                    0 ? (
                    <section
                        id="preview-skills"
                        className="
                            border-b
                            border-white/10
                            px-6
                            py-12
                            sm:px-12
                        "
                    >
                        <SectionHeading
                            number="02"
                            title="Tech Stack"
                        />

                        <div
                            className="
                                grid
                                grid-cols-1
                                gap-4
                                md:grid-cols-2
                            "
                        >
                            {sortedSkills.map(
                                (skill) => (
                                    <SkillCard
                                        key={
                                            skill._id
                                        }
                                        skill={
                                            skill
                                        }
                                        primary={
                                            primary
                                        }
                                    />
                                )
                            )}
                        </div>
                    </section>
                ) : null}

                {/* ========================================
                    PROJECTS
                ======================================== */}

                {form.showProjectsSection &&
                sortedProjects.length >
                    0 ? (
                    <section
                        id="preview-projects"
                        className="
                            border-b
                            border-white/10
                            px-6
                            py-12
                            sm:px-12
                        "
                    >
                        <SectionHeading
                            number="03"
                            title="My Projects"
                        />

                        <div
                            className="
                                grid
                                grid-cols-1
                                gap-5
                                xl:grid-cols-2
                            "
                        >
                            {sortedProjects.map(
                                (project) => (
                                    <ProjectCard
                                        key={
                                            project._id
                                        }
                                        project={
                                            project
                                        }
                                        primary={
                                            primary
                                        }
                                    />
                                )
                            )}
                        </div>
                    </section>
                ) : null}

                {/* ========================================
                    EXPERIENCE
                ======================================== */}

                {form.showExperienceSection &&
                sortedExperiences.length >
                    0 ? (
                    <section
                        id="preview-experience"
                        className="
                            border-b
                            border-white/10
                            px-6
                            py-12
                            sm:px-12
                        "
                    >
                        <SectionHeading
                            number="04"
                            title="Experience"
                        />

                        <div className="space-y-4">
                            {sortedExperiences.map(
                                (experience) => (
                                    <ExperienceCard
                                        key={
                                            experience._id
                                        }
                                        experience={
                                            experience
                                        }
                                        primary={
                                            primary
                                        }
                                    />
                                )
                            )}
                        </div>
                    </section>
                ) : null}

                {/* ========================================
                    EDUCATION
                ======================================== */}

                {form.showEducationSection &&
                sortedEducation.length >
                    0 ? (
                    <section
                        id="preview-education"
                        className="
                            border-b
                            border-white/10
                            px-6
                            py-12
                            sm:px-12
                        "
                    >
                        <SectionHeading
                            number="05"
                            title="Education"
                        />

                        <div className="space-y-4">
                            {sortedEducation.map(
                                (item) => (
                                    <EducationCard
                                        key={
                                            item._id
                                        }
                                        education={
                                            item
                                        }
                                        primary={
                                            primary
                                        }
                                    />
                                )
                            )}
                        </div>
                    </section>
                ) : null}

                {/* ========================================
                    CERTIFICATES
                ======================================== */}

                {form.showCertificatesSection &&
                sortedCertificates.length >
                    0 ? (
                    <section
                        id="preview-certificates"
                        className="
                            border-b
                            border-white/10
                            px-6
                            py-12
                            sm:px-12
                        "
                    >
                        <SectionHeading
                            number="06"
                            title="Certificates"
                        />

                        <div
                            className="
                                grid
                                grid-cols-1
                                gap-5
                                md:grid-cols-2
                            "
                        >
                            {sortedCertificates.map(
                                (
                                    certificate
                                ) => (
                                    <CertificateCard
                                        key={
                                            certificate._id
                                        }
                                        certificate={
                                            certificate
                                        }
                                        primary={
                                            primary
                                        }
                                    />
                                )
                            )}
                        </div>
                    </section>
                ) : null}

                {/* ========================================
                    POSTS
                ======================================== */}

                {form.showPostsSection &&
                sortedPosts.length >
                    0 ? (
                    <section
                        id="preview-posts"
                        className="
                            border-b
                            border-white/10
                            px-6
                            py-12
                            sm:px-12
                        "
                    >
                        <SectionHeading
                            number="07"
                            title="Latest Posts"
                        />

                        <div
                            className="
                                grid
                                grid-cols-1
                                gap-5
                                xl:grid-cols-2
                            "
                        >
                            {sortedPosts.map(
                                (post) => (
                                    <PostCard
                                        key={
                                            post._id
                                        }
                                        post={
                                            post
                                        }
                                        primary={
                                            primary
                                        }
                                    />
                                )
                            )}
                        </div>
                    </section>
                ) : null}

                {/* ========================================
                    SEO PREVIEW
                ======================================== */}

                {(seo.metaTitle ||
                seo.metaDescription ||
                seoKeywords.length > 0) ? (
                    <section
                        id="preview-seo"
                        className="border-b border-white/10 px-6 py-12 sm:px-12"
                    >
                        <SectionHeading
                            number="08"
                            title="SEO Preview"
                        />

                        <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-5">
                            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                                Search result preview
                            </p>

                            <p
                                className="mt-4 text-xl font-semibold"
                                style={{
                                    color: primary
                                }}
                            >
                                {seo.metaTitle ||
                                    form.title ||
                                    form.username ||
                                    "Portfolio"}
                            </p>

                            {seo.metaDescription ? (
                                <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-400">
                                    {seo.metaDescription}
                                </p>
                            ) : null}

                            {seoKeywords.length > 0 ? (
                                <div className="mt-4 flex flex-wrap gap-2">
                                    {seoKeywords.map(
                                        (keyword, index) => (
                                            <span
                                                key={`${keyword}-${index}`}
                                                className="rounded-full border border-cyan-400/10 bg-cyan-400/[0.03] px-2.5 py-1 text-xs text-cyan-300"
                                            >
                                                {keyword}
                                            </span>
                                        )
                                    )}
                                </div>
                            ) : null}
                        </div>
                    </section>
                ) : null}

                {/* ========================================
                    CONTACT
                ======================================== */}

                {form.showContactSection &&
                (form.email ||
                    form.phone ||
                    form.location ||
                    form.website ||
                    socialLinks.length >
                        0) ? (
                    <section
                        id="preview-contact"
                        className="
                            border-b
                            border-white/10
                            px-6
                            py-12
                            sm:px-12
                        "
                    >
                        <SectionHeading
                            number="09"
                            title="Contact"
                        />

                        <div
                            className="
                                grid
                                grid-cols-1
                                gap-4
                                sm:grid-cols-2
                            "
                        >
                            {form.email ? (
                                <a
                                    href={`mailto:${form.email}`}
                                    className="
                                        rounded-2xl
                                        border
                                        border-white/10
                                        bg-white/[0.02]
                                        p-5
                                        transition
                                        hover:bg-white/[0.05]
                                    "
                                >
                                    <p
                                        className="
                                            text-[10px]
                                            font-bold
                                            uppercase
                                            tracking-[0.18em]
                                            text-slate-600
                                        "
                                    >
                                        Email
                                    </p>

                                    <p
                                        className="
                                            mt-2
                                            break-all
                                            text-sm
                                            text-slate-300
                                        "
                                    >
                                        {
                                            form.email
                                        }
                                    </p>
                                </a>
                            ) : null}

                            {form.phone ? (
                                <a
                                    href={`tel:${form.phone}`}
                                    className="
                                        rounded-2xl
                                        border
                                        border-white/10
                                        bg-white/[0.02]
                                        p-5
                                        transition
                                        hover:bg-white/[0.05]
                                    "
                                >
                                    <p
                                        className="
                                            text-[10px]
                                            font-bold
                                            uppercase
                                            tracking-[0.18em]
                                            text-slate-600
                                        "
                                    >
                                        Phone
                                    </p>

                                    <p
                                        className="
                                            mt-2
                                            text-sm
                                            text-slate-300
                                        "
                                    >
                                        {
                                            form.phone
                                        }
                                    </p>
                                </a>
                            ) : null}

                            {form.location ? (
                                <div
                                    className="
                                        rounded-2xl
                                        border
                                        border-white/10
                                        bg-white/[0.02]
                                        p-5
                                    "
                                >
                                    <p
                                        className="
                                            text-[10px]
                                            font-bold
                                            uppercase
                                            tracking-[0.18em]
                                            text-slate-600
                                        "
                                    >
                                        Location
                                    </p>

                                    <p
                                        className="
                                            mt-2
                                            text-sm
                                            text-slate-300
                                        "
                                    >
                                        {
                                            form.location
                                        }
                                    </p>
                                </div>
                            ) : null}

                            {form.website ? (
                                <a
                                    href={
                                        form.website
                                    }
                                    target="_blank"
                                    rel="noreferrer"
                                    className="
                                        rounded-2xl
                                        border
                                        border-white/10
                                        bg-white/[0.02]
                                        p-5
                                        transition
                                        hover:bg-white/[0.05]
                                    "
                                >
                                    <p
                                        className="
                                            text-[10px]
                                            font-bold
                                            uppercase
                                            tracking-[0.18em]
                                            text-slate-600
                                        "
                                    >
                                        Website
                                    </p>

                                    <p
                                        className="
                                            mt-2
                                            break-all
                                            text-sm
                                            text-slate-300
                                        "
                                    >
                                        {
                                            form.website
                                        }
                                    </p>
                                </a>
                            ) : null}
                        </div>
                    </section>
                ) : null}

                {/* ========================================
                    FOOTER
                ======================================== */}

                <footer
                    className="
                        px-6
                        py-8
                        text-center
                        sm:px-12
                    "
                >
                    <p
                        className="
                            text-xs
                            text-slate-600
                        "
                    >
                        {form.title ||
                            user?.name ||
                            "Portfolio"}
                    </p>
                </footer>
            </div>
        </section>
    );
};

export default LivePortfolioPreview;
