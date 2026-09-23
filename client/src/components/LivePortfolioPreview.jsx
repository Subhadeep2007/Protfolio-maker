import{
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
                            download
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
    // Four genuinely different visual layouts.
    // Data, sections and existing components stay intact.
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


    // ========================================
    // SHARED SECTION HELPERS
    // ========================================

    const hasAbout =
        form.showAboutSection &&
        Boolean(form.bio);

    const hasSkills =
        form.showSkillsSection &&
        sortedSkills.length > 0;

    const hasProjects =
        form.showProjectsSection &&
        sortedProjects.length > 0;

    const hasExperience =
        form.showExperienceSection &&
        sortedExperiences.length > 0;

    const hasEducation =
        form.showEducationSection &&
        sortedEducation.length > 0;

    const hasCertificates =
        form.showCertificatesSection &&
        sortedCertificates.length > 0;

    const hasPosts =
        form.showPostsSection &&
        sortedPosts.length > 0;

    const hasContact =
        form.showContactSection &&
        (
            form.email ||
            form.phone ||
            form.location ||
            form.website ||
            socialLinks.length > 0
        );


    const ContactGrid = ({
        compact = false,
        variant = "default"
    }) => (
        <div
            className={`${
                compact
                    ? "grid grid-cols-1 gap-3 sm:grid-cols-2"
                    : "grid grid-cols-1 gap-4 sm:grid-cols-2"
            } ${
                variant === "modern"
                    ? "text-white"
                    : ""
            }`}
        >
            {form.email ? (
                <a
                    href={`mailto:${form.email}`}
                    className="rounded-2xl border p-4 transition"
                >
                    <p className="text-[9px] font-bold uppercase tracking-[0.18em]">
                        Email
                    </p>
                    <p className="mt-2 break-all text-sm">
                        {form.email}
                    </p>
                </a>
            ) : null}

            {form.phone ? (
                <a
                    href={`tel:${form.phone}`}
                    className="rounded-2xl border p-4 transition"
                >
                    <p className="text-[9px] font-bold uppercase tracking-[0.18em]">
                        Phone
                    </p>
                    <p className="mt-2 text-sm">
                        {form.phone}
                    </p>
                </a>
            ) : null}

            {form.location ? (
                <div className="rounded-2xl border p-4">
                    <p className="text-[9px] font-bold uppercase tracking-[0.18em]">
                        Location
                    </p>
                    <p className="mt-2 text-sm">
                        {form.location}
                    </p>
                </div>
            ) : null}

            {form.website ? (
                <a
                    href={form.website}
                    target="_blank"
                    rel="noreferrer"
                    className="rounded-2xl border p-4 transition"
                >
                    <p className="text-[9px] font-bold uppercase tracking-[0.18em]">
                        Website
                    </p>
                    <p className="mt-2 break-all text-sm">
                        {form.website}
                    </p>
                </a>
            ) : null}
        </div>
    );


    const SEOBlock = ({
        variant = "default"
    }) => (
        (seo.metaTitle ||
        seo.metaDescription ||
        seoKeywords.length > 0) ? (
            <section
                id="preview-seo"
                className={`${
                    variant === "minimal"
                        ? "border-t px-6 py-14 sm:px-12"
                        : variant === "developer"
                            ? "border-t border-emerald-400/10 px-6 py-10 sm:px-10"
                            : "border-t px-6 py-12 sm:px-12"
                } ${
                    variant === "modern"
                        ? "text-white"
                        : ""
                }`}
            >
                <SectionHeading
                    number="08"
                    title="SEO Preview"
                />

                <div className={`rounded-2xl border p-5 ${
                    variant === "minimal"
                        ? "text-slate-950"
                        : "text-white"
                }`}>
                    <p className="text-[10px] font-semibold uppercase tracking-[0.18em]">
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
                        <p className="mt-2 max-w-3xl text-sm leading-6">
                            {seo.metaDescription}
                        </p>
                    ) : null}

                    {seoKeywords.length > 0 ? (
                        <div className="mt-4 flex flex-wrap gap-2">
                            {seoKeywords.map(
                                (keyword, index) => (
                                    <span
                                        key={`${keyword}-${index}`}
                                        className="rounded-full border px-2.5 py-1 text-xs"
                                    >
                                        {keyword}
                                    </span>
                                )
                            )}
                        </div>
                    ) : null}
                </div>
            </section>
        ) : null
    );


    // ========================================
    // MODERN TEMPLATE
    // ========================================

    const ModernTemplate = () => (
        <div className="template-modern overflow-hidden rounded-2xl border border-white/10 bg-[#020712]">

            <nav className="border-b border-white/10 px-5 py-4 sm:px-8">
                <div className="flex items-center justify-between gap-4">
                    <div className="text-sm font-black">
                        <span className="text-white">{first}</span>
                        {rest ? (
                            <span style={{ color: primary }}>
                                {" "}{rest}
                            </span>
                        ) : null}
                    </div>

                    <div className="hidden items-center gap-5 text-xs text-slate-500 md:flex">
                        <a href="#preview-home" className="hover:text-white">Home</a>
                        {hasAbout ? <a href="#preview-about" className="hover:text-white">About</a> : null}
                        {hasSkills ? <a href="#preview-skills" className="hover:text-white">Skills</a> : null}
                        {hasProjects ? <a href="#preview-projects" className="hover:text-white">Projects</a> : null}
                        {hasExperience ? <a href="#preview-experience" className="hover:text-white">Experience</a> : null}
                        {hasCertificates ? <a href="#preview-certificates" className="hover:text-white">Certificates</a> : null}
                        {hasContact ? <a href="#preview-contact" className="hover:text-white">Contact</a> : null}
                    </div>

                    {hasContact && (form.email || user?.email) ? (
                        <a
                            href={`mailto:${form.email || user?.email || ""}`}
                            className="rounded-lg px-3 py-2 text-[10px] font-bold text-slate-950"
                            style={{ backgroundColor: primary }}
                        >
                            Connect
                        </a>
                    ) : null}
                </div>
            </nav>


            <section
                id="preview-home"
                className="grid gap-10 px-6 py-14 sm:px-12 sm:py-20 lg:grid-cols-[1.15fr_0.85fr] lg:items-center"
            >
                <div>
                    <p className="text-sm font-medium" style={{ color: primary }}>
                        Hello, I'm
                    </p>

                    <h2 className="mt-3 text-4xl font-black tracking-tight text-white sm:text-6xl">
                        {name}
                    </h2>

                    {form.headline ? (
                        <p className="mt-4 text-xl font-semibold text-slate-300">
                            {form.headline}
                        </p>
                    ) : null}

                    {form.bio ? (
                        <p className="mt-5 max-w-xl whitespace-pre-line text-sm leading-7 text-slate-400">
                            {form.bio}
                        </p>
                    ) : null}

                    {form.location ? (
                        <p className="mt-4 text-xs text-slate-500">
                            📍 {form.location}
                        </p>
                    ) : null}

                    {socialLinks.length > 0 ? (
                        <div className="mt-6 flex flex-wrap gap-2">
                            {socialLinks.map((item) => (
                                <SocialIcon
                                    key={item.label}
                                    label={item.label}
                                    href={item.href}
                                />
                            ))}
                        </div>
                    ) : null}

                    <div className="mt-7 flex flex-wrap gap-3">
                        {hasContact && (form.email || user?.email) ? (
                            <a
                                href={`mailto:${form.email || user?.email || ""}`}
                                className="rounded-lg px-5 py-2.5 text-xs font-bold text-slate-950"
                                style={{ backgroundColor: primary }}
                            >
                                Let's Connect →
                            </a>
                        ) : null}

                        {form.resume?.url ? (
                            <a
                                href={form.resume.url}
                                target="_blank"
                                rel="noreferrer"
                                className="rounded-lg border px-5 py-2.5 text-xs font-medium"
                                style={{
                                    borderColor: `${primary}55`,
                                    color: primary
                                }}
                            >
                                Download CV
                            </a>
                        ) : null}
                    </div>
                </div>

                <div className="flex justify-center">
                    <div
                        className="relative flex h-56 w-56 items-center justify-center rounded-full border sm:h-72 sm:w-72"
                        style={{
                            borderColor: `${primary}55`,
                            boxShadow: `0 0 100px ${primary}22`
                        }}
                    >
                        <div className="absolute inset-5 rounded-full border" style={{ borderColor: `${secondary}44` }} />
                        <div className="absolute inset-2 rounded-full border border-dashed border-white/10" />

                        <div className="flex h-44 w-44 items-center justify-center overflow-hidden rounded-full bg-[#0b1222] text-5xl font-black text-cyan-300 sm:h-56 sm:w-56">
                            {form.profileImage ? (
                                <img src={form.profileImage} alt={name} className="h-full w-full object-cover" />
                            ) : (
                                name.charAt(0).toUpperCase()
                            )}
                        </div>
                    </div>
                </div>
            </section>


            <div className="grid grid-cols-2 border-y border-white/10 sm:grid-cols-4">
                <Metric value={sortedProjects.length} label="Projects" />
                <Metric value={sortedExperiences.length} label="Experience" />
                <Metric value={technologiesCount} label="Technologies" />
                <Metric value={sortedCertificates.length} label="Certificates" />
            </div>


            {hasAbout ? (
                <section id="preview-about" className="border-b border-white/10 px-6 py-12 sm:px-12">
                    <SectionHeading number="01" title="About Me" />
                    <p className="max-w-4xl whitespace-pre-line text-sm leading-8 text-slate-400">
                        {form.bio}
                    </p>
                </section>
            ) : null}

            {hasSkills ? (
                <section id="preview-skills" className="border-b border-white/10 px-6 py-12 sm:px-12">
                    <SectionHeading number="02" title="Tech Stack" />
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                        {sortedSkills.map((skill) => (
                            <SkillCard key={skill._id} skill={skill} primary={primary} />
                        ))}
                    </div>
                </section>
            ) : null}

            {hasProjects ? (
                <section id="preview-projects" className="border-b border-white/10 px-6 py-12 sm:px-12">
                    <SectionHeading number="03" title="My Projects" />
                    <div className="grid grid-cols-1 gap-5 xl:grid-cols-2">
                        {sortedProjects.map((project) => (
                            <ProjectCard key={project._id} project={project} primary={primary} />
                        ))}
                    </div>
                </section>
            ) : null}

            {hasExperience ? (
                <section id="preview-experience" className="border-b border-white/10 px-6 py-12 sm:px-12">
                    <SectionHeading number="04" title="Experience" />
                    <div className="space-y-4">
                        {sortedExperiences.map((experience) => (
                            <ExperienceCard key={experience._id} experience={experience} primary={primary} />
                        ))}
                    </div>
                </section>
            ) : null}

            {hasEducation ? (
                <section id="preview-education" className="border-b border-white/10 px-6 py-12 sm:px-12">
                    <SectionHeading number="05" title="Education" />
                    <div className="space-y-4">
                        {sortedEducation.map((item) => (
                            <EducationCard key={item._id} education={item} primary={primary} />
                        ))}
                    </div>
                </section>
            ) : null}

            {hasCertificates ? (
                <section id="preview-certificates" className="border-b border-white/10 px-6 py-12 sm:px-12">
                    <SectionHeading number="06" title="Certificates" />
                    <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                        {sortedCertificates.map((certificate) => (
                            <CertificateCard key={certificate._id} certificate={certificate} primary={primary} />
                        ))}
                    </div>
                </section>
            ) : null}

            {hasPosts ? (
                <section id="preview-posts" className="border-b border-white/10 px-6 py-12 sm:px-12">
                    <SectionHeading number="07" title="Latest Posts" />
                    <div className="grid grid-cols-1 gap-5 xl:grid-cols-2">
                        {sortedPosts.map((post) => (
                            <PostCard key={post._id} post={post} primary={primary} />
                        ))}
                    </div>
                </section>
            ) : null}

            <SEOBlock variant="modern" />

            {hasContact ? (
                <section id="preview-contact" className="border-b border-white/10 px-6 py-12 sm:px-12 text-white">
                    <SectionHeading number="09" title="Contact" />
                    <ContactGrid variant="modern" />
                </section>
            ) : null}

            <footer className="px-6 py-8 text-center text-xs text-slate-600 sm:px-12">
                {form.title || user?.name || "Portfolio"}
            </footer>
        </div>
    );


    // ========================================
    // MINIMAL TEMPLATE
    // ========================================

    const MinimalTemplate = () => (
        <div className="template-minimal overflow-hidden rounded-none border border-slate-200 bg-white text-slate-900">

            <nav className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 bg-white px-6 py-5 sm:px-10">
                <div className="text-base font-black tracking-tight">
                    {name}
                </div>

                <div className="flex flex-wrap items-center gap-4 text-[11px] font-medium text-slate-500">
                    <a href="#preview-home" className="hover:text-slate-900">Home</a>
                    {hasAbout ? <a href="#preview-about" className="hover:text-slate-900">About</a> : null}
                    {hasProjects ? <a href="#preview-projects" className="hover:text-slate-900">Work</a> : null}
                    {hasExperience ? <a href="#preview-experience" className="hover:text-slate-900">Experience</a> : null}
                    {hasCertificates ? <a href="#preview-certificates" className="hover:text-slate-900">Certificates</a> : null}
                    {hasContact ? <a href="#preview-contact" className="hover:text-slate-900">Contact</a> : null}
                </div>
            </nav>


            <section id="preview-home" className="px-6 py-16 sm:px-12 sm:py-24">
                <div className="mx-auto mb-8 flex justify-center">
                    <div className="h-28 w-28 overflow-hidden rounded-full border border-slate-200 bg-slate-100 sm:h-36 sm:w-36">
                        {form.profileImage ? (
                            <img src={form.profileImage} alt={name} className="h-full w-full object-cover" />
                        ) : (
                            <div className="flex h-full w-full items-center justify-center text-3xl font-bold text-slate-400">
                                {name.charAt(0).toUpperCase()}
                            </div>
                        )}
                    </div>
                </div>

                <div className="mx-auto max-w-5xl">
                    <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">
                        Portfolio · {form.location || "Independent Developer"}
                    </p>

                    <h2 className="mt-6 max-w-4xl text-5xl font-semibold leading-[0.98] tracking-[-0.055em] text-slate-950 sm:text-7xl">
                        {name}
                    </h2>

                    {form.headline ? (
                        <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-600 sm:text-xl">
                            {form.headline}
                        </p>
                    ) : null}

                    {form.bio ? (
                        <p className="mt-5 max-w-3xl whitespace-pre-line text-sm leading-7 text-slate-500">
                            {form.bio}
                        </p>
                    ) : null}

                    <div className="mt-8 flex flex-wrap gap-3">
                        {hasProjects ? (
                            <a href="#preview-projects" className="rounded-full bg-slate-950 px-5 py-2.5 text-xs font-semibold text-white">
                                View Work →
                            </a>
                        ) : null}

                        {hasContact && (form.email || user?.email) ? (
                            <a
                                href={`mailto:${form.email || user?.email || ""}`}
                                className="rounded-full border border-slate-300 px-5 py-2.5 text-xs font-semibold text-slate-700"
                            >
                                Get in Touch
                            </a>
                        ) : null}
                    </div>

                    {socialLinks.length > 0 ? (
                        <div className="mt-7 flex flex-wrap gap-2">
                            {socialLinks.map((item) => (
                                <a
                                    key={item.label}
                                    href={item.href}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="rounded-full border border-slate-200 px-3 py-1.5 text-[10px] font-bold text-slate-500 hover:text-slate-900"
                                >
                                    {item.label}
                                </a>
                            ))}
                        </div>
                    ) : null}
                </div>
            </section>


            <div className="grid grid-cols-2 border-y border-slate-200 sm:grid-cols-4">
                {[
                    [sortedProjects.length, "Projects"],
                    [sortedExperiences.length, "Experience"],
                    [technologiesCount, "Technologies"],
                    [sortedCertificates.length, "Certificates"]
                ].map(([value, label]) => (
                    <div key={label} className="border-r border-slate-200 px-4 py-6 text-center last:border-r-0">
                        <p className="text-xl font-bold text-slate-950">{value}</p>
                        <p className="mt-1 text-[10px] uppercase tracking-[0.12em] text-slate-400">{label}</p>
                    </div>
                ))}
            </div>


            {hasAbout ? (
                <section id="preview-about" className="border-b border-slate-200 px-6 py-14 sm:px-12">
                    <div className="grid gap-8 md:grid-cols-[0.35fr_1fr]">
                        <div>
                            <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-slate-400">01 · About</p>
                        </div>
                        <p className="max-w-3xl whitespace-pre-line text-base leading-8 text-slate-600">
                            {form.bio}
                        </p>
                    </div>
                </section>
            ) : null}


            {hasSkills ? (
                <section id="preview-skills" className="border-b border-slate-200 px-6 py-14 sm:px-12">
                    <div className="grid gap-8 md:grid-cols-[0.35fr_1fr]">
                        <div>
                            <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-slate-400">02 · Skills</p>
                        </div>
                        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                            {sortedSkills.map((skill) => (
                                <div key={skill._id} className="border border-slate-200 p-4">
                                    <div className="flex items-center justify-between gap-3">
                                        <p className="text-sm font-semibold text-slate-950">{skill.name}</p>
                                        {skill.percentage !== undefined ? (
                                            <span className="text-xs font-semibold" style={{ color: primary }}>
                                                {skill.percentage}%
                                            </span>
                                        ) : null}
                                    </div>
                                    {skill.description ? (
                                        <p className="mt-2 text-xs leading-5 text-slate-500">{skill.description}</p>
                                    ) : null}
                                </div>
                            ))}
                        </div>
                    </div>
                </section>
            ) : null}


            {hasProjects ? (
                <section id="preview-projects" className="border-b border-slate-200 px-6 py-14 sm:px-12">
                    <div className="grid gap-8 md:grid-cols-[0.35fr_1fr]">
                        <div>
                            <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-slate-400">03 · Selected Work</p>
                        </div>
                        <div className="space-y-6">
                            {sortedProjects.map((project) => (
                                <article key={project._id} className="grid overflow-hidden border border-slate-200 bg-white md:grid-cols-[0.8fr_1.2fr]">
                                    {project.image ? (
                                        <div className="h-48 overflow-hidden bg-slate-100 md:h-full">
                                            <img src={project.image} alt={project.title || "Project"} className="h-full w-full object-cover" />
                                        </div>
                                    ) : null}
                                    <div className="p-5">
                                        {project.category ? <p className="text-[10px] font-bold uppercase tracking-[0.18em]" style={{ color: primary }}>{project.category}</p> : null}
                                        <h3 className="mt-2 text-xl font-semibold text-slate-950">{project.title}</h3>
                                        {project.description ? <p className="mt-3 text-sm leading-7 text-slate-500">{project.description}</p> : null}
                                        {toArray(project.technologies).length > 0 ? (
                                            <div className="mt-4 flex flex-wrap gap-2">
                                                {toArray(project.technologies).map((technology, index) => (
                                                    <span key={`${technology}-${index}`} className="border border-slate-200 px-2.5 py-1 text-[10px] text-slate-500">
                                                        {technology}
                                                    </span>
                                                ))}
                                            </div>
                                        ) : null}
                                        <div className="mt-5 flex flex-wrap gap-2">
                                            {project.githubUrl ? <a href={project.githubUrl} target="_blank" rel="noreferrer" className="border border-slate-300 px-3 py-2 text-[10px] font-semibold text-slate-700">GitHub ↗</a> : null}
                                            {project.liveUrl ? <a href={project.liveUrl} target="_blank" rel="noreferrer" className="px-3 py-2 text-[10px] font-semibold text-white" style={{ backgroundColor: primary }}>Live Demo ↗</a> : null}
                                        </div>
                                    </div>
                                </article>
                            ))}
                        </div>
                    </div>
                </section>
            ) : null}


            {hasExperience ? (
                <section id="preview-experience" className="border-b border-slate-200 px-6 py-14 sm:px-12">
                    <div className="grid gap-8 md:grid-cols-[0.35fr_1fr]">
                        <div>
                            <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-slate-400">04 · Experience</p>
                        </div>
                        <div className="space-y-6">
                            {sortedExperiences.map((experience) => (
                                <div key={experience._id} className="border-l-2 pl-5" style={{ borderColor: `${primary}55` }}>
                                    <div className="flex flex-col justify-between gap-2 sm:flex-row">
                                        <div>
                                            <h3 className="text-lg font-semibold text-slate-950">{experience.jobTitle}</h3>
                                            {experience.company ? <p className="mt-1 text-sm font-medium" style={{ color: primary }}>{experience.company}</p> : null}
                                        </div>
                                        <p className="text-xs text-slate-400">{formatDate(experience.startDate)}{experience.startDate || experience.endDate ? " — " : ""}{experience.currentlyWorking ? "Present" : formatDate(experience.endDate)}</p>
                                    </div>
                                    {experience.description ? <p className="mt-4 whitespace-pre-line text-sm leading-7 text-slate-500">{experience.description}</p> : null}
                                </div>
                            ))}
                        </div>
                    </div>
                </section>
            ) : null}


            {hasEducation ? (
                <section id="preview-education" className="border-b border-slate-200 px-6 py-14 sm:px-12">
                    <div className="grid gap-8 md:grid-cols-[0.35fr_1fr]">
                        <div>
                            <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-slate-400">05 · Education</p>
                        </div>
                        <div className="space-y-4">
                            {sortedEducation.map((item) => (
                                <div key={item._id} className="border border-slate-200 p-5">
                                    <div className="flex flex-col justify-between gap-2 sm:flex-row">
                                        <div>
                                            <h3 className="text-lg font-semibold text-slate-950">{item.degree}</h3>
                                            {item.institution ? <p className="mt-1 text-sm font-medium" style={{ color: primary }}>{item.institution}</p> : null}
                                            {item.fieldOfStudy ? <p className="mt-1 text-xs text-slate-500">{item.fieldOfStudy}</p> : null}
                                        </div>
                                        <p className="text-xs text-slate-400">{formatDate(item.startDate)}{item.startDate || item.endDate ? " — " : ""}{item.currentlyStudying ? "Present" : formatDate(item.endDate)}</p>
                                    </div>
                                    {item.grade ? <p className="mt-3 text-xs text-slate-500">Grade: {item.grade}</p> : null}
                                    {item.description ? <p className="mt-3 text-sm leading-7 text-slate-500">{item.description}</p> : null}
                                </div>
                            ))}
                        </div>
                    </div>
                </section>
            ) : null}


            {hasCertificates ? (
                <section id="preview-certificates" className="border-b border-slate-200 px-6 py-14 sm:px-12">
                    <div className="grid gap-8 md:grid-cols-[0.35fr_1fr]">
                        <div>
                            <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-slate-400">06 · Certifications</p>
                        </div>
                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                            {sortedCertificates.map((certificate) => (
                                <article key={certificate._id} className="overflow-hidden border border-slate-200 bg-white">
                                    {certificate.certificateImage ? (
                                        <div className="h-44 overflow-hidden bg-slate-100">
                                            {getMediaType(certificate.certificateImage) === "image" ? (
                                                <img src={certificate.certificateImage} alt={certificate.title || "Certificate"} className="h-full w-full object-contain" />
                                            ) : (
                                                <div className="flex h-full items-center justify-center text-4xl">📜</div>
                                            )}
                                        </div>
                                    ) : null}
                                    <div className="p-4">
                                        <h3 className="text-base font-semibold text-slate-950">{certificate.title}</h3>
                                        {certificate.issuingOrganization ? <p className="mt-1 text-sm font-medium" style={{ color: primary }}>{certificate.issuingOrganization}</p> : null}
                                        {certificate.issueDate ? <p className="mt-2 text-xs text-slate-400">Issued {formatDate(certificate.issueDate)}</p> : null}
                                        {certificate.description ? <p className="mt-3 line-clamp-3 text-xs leading-5 text-slate-500">{certificate.description}</p> : null}
                                        {certificate.certificateImage ? <a href={certificate.certificateImage} target="_blank" rel="noreferrer" className="mt-4 inline-flex border border-slate-300 px-3 py-2 text-[10px] font-semibold text-slate-700">View Certificate ↗</a> : null}
                                    </div>
                                </article>
                            ))}
                        </div>
                    </div>
                </section>
            ) : null}


            {hasPosts ? (
                <section id="preview-posts" className="border-b border-slate-200 px-6 py-14 sm:px-12">
                    <div className="grid gap-8 md:grid-cols-[0.35fr_1fr]">
                        <div>
                            <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-slate-400">07 · Journal</p>
                        </div>
                        <div className="space-y-4">
                            {sortedPosts.map((post) => (
                                <article key={post._id} className="border-b border-slate-200 pb-5 last:border-b-0">
                                    {post.coverImage && getMediaType(post.coverImage) === "image" ? (
                                        <div className="mb-5 h-44 overflow-hidden rounded-xl border border-slate-200 bg-slate-100">
                                            <img src={post.coverImage} alt={post.title || "Post"} className="h-full w-full object-cover" />
                                        </div>
                                    ) : null}
                                    <div className="flex flex-wrap items-center gap-2 text-[10px] text-slate-400">
                                        {post.postType ? <span>{post.postType}</span> : null}
                                        {post.publishedAt ? <span>· {formatDate(post.publishedAt)}</span> : null}
                                    </div>
                                    <h3 className="mt-2 text-xl font-semibold text-slate-950">{post.title}</h3>
                                    {post.excerpt ? <p className="mt-2 text-sm leading-7 text-slate-500">{post.excerpt}</p> : null}
                                    {post.content ? <p className="mt-2 line-clamp-3 text-xs leading-6 text-slate-400">{post.content}</p> : null}
                                    {(post.githubUrl || post.demoUrl || post.externalUrl) ? (
                                        <div className="mt-4 flex flex-wrap gap-2">
                                            {post.githubUrl ? <a href={post.githubUrl} target="_blank" rel="noreferrer" className="inline-flex border border-slate-300 px-3 py-2 text-[10px] font-semibold text-slate-700">GitHub ↗</a> : null}
                                            {post.demoUrl ? <a href={post.demoUrl} target="_blank" rel="noreferrer" className="inline-flex border border-slate-300 px-3 py-2 text-[10px] font-semibold text-slate-700">Demo ↗</a> : null}
                                            {post.externalUrl ? <a href={post.externalUrl} target="_blank" rel="noreferrer" className="inline-flex border border-slate-300 px-3 py-2 text-[10px] font-semibold text-slate-700">Open ↗</a> : null}
                                        </div>
                                    ) : null}
                                </article>
                            ))}
                        </div>
                    </div>
                </section>
            ) : null}


            <SEOBlock variant="minimal" />


            {hasContact ? (
                <section id="preview-contact" className="px-6 py-14 sm:px-12">
                    <div className="grid gap-8 md:grid-cols-[0.35fr_1fr]">
                        <div>
                            <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-slate-400">09 · Contact</p>
                        </div>
                        <div>
                            <ContactGrid />
                        </div>
                    </div>
                </section>
            ) : null}

            <footer className="border-t border-slate-200 px-6 py-8 text-center text-xs text-slate-400 sm:px-12">
                {form.title || user?.name || "Portfolio"}
            </footer>
        </div>
    );


    // ========================================
    // DEVELOPER TEMPLATE
    // ========================================

    const DeveloperTemplate = () => (
        <div className="template-developer overflow-hidden rounded-xl border border-emerald-400/20 bg-[#020602] font-mono text-emerald-50">

            <div className="flex items-center gap-2 border-b border-emerald-400/10 bg-[#050a05] px-4 py-3">
                <span className="h-2.5 w-2.5 rounded-full bg-red-400/70" />
                <span className="h-2.5 w-2.5 rounded-full bg-yellow-400/70" />
                <span className="h-2.5 w-2.5 rounded-full bg-green-400/70" />
                <span className="ml-3 text-[10px] text-slate-500">portfolio-terminal</span>
                <span className="ml-auto text-[9px] text-emerald-400">● online</span>
            </div>

            <nav className="flex flex-wrap items-center justify-between gap-3 border-b border-emerald-400/10 px-4 py-3 sm:px-7">
                <p className="text-xs font-bold text-emerald-400">root@portfolio:~$</p>
                <div className="flex flex-wrap gap-4 text-[9px] text-slate-500">
                    <a href="#preview-home" className="hover:text-emerald-300">home</a>
                    {hasAbout ? <a href="#preview-about" className="hover:text-emerald-300">about</a> : null}
                    {hasSkills ? <a href="#preview-skills" className="hover:text-emerald-300">skills</a> : null}
                    {hasProjects ? <a href="#preview-projects" className="hover:text-emerald-300">projects</a> : null}
                    {hasExperience ? <a href="#preview-experience" className="hover:text-emerald-300">experience</a> : null}
                    {hasContact ? <a href="#preview-contact" className="hover:text-emerald-300">contact</a> : null}
                </div>
            </nav>


            <section id="preview-home" className="relative overflow-hidden border-b border-emerald-400/10 px-5 py-12 sm:px-9 sm:py-16">
                <div className="pointer-events-none absolute inset-0 opacity-[0.06]" style={{ backgroundImage: "linear-gradient(rgba(74,222,128,0.35) 1px, transparent 1px), linear-gradient(90deg, rgba(74,222,128,0.35) 1px, transparent 1px)", backgroundSize: "28px 28px" }} />

                <div className="relative grid gap-8 lg:grid-cols-[1.4fr_0.6fr] lg:items-end">
                    <div>
                        <p className="text-xs text-slate-500">$ whoami</p>
                        <h2 className="mt-3 break-words text-3xl font-black leading-tight text-emerald-300 sm:text-5xl">
                            {name}
                            <span className="animate-pulse text-emerald-500">_</span>
                        </h2>

                        {form.headline ? (
                            <p className="mt-4 text-sm text-cyan-300">const role = "{form.headline}";</p>
                        ) : null}

                        {form.bio ? (
                            <p className="mt-5 max-w-3xl whitespace-pre-line text-xs leading-7 text-slate-400">
                                // {form.bio}
                            </p>
                        ) : null}

                        <div className="mt-6 flex flex-wrap gap-2">
                            {socialLinks.map((item) => (
                                <a
                                    key={item.label}
                                    href={item.href}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="border border-emerald-400/15 px-3 py-2 text-[9px] text-emerald-300 hover:bg-emerald-400/5"
                                >
                                    {item.label}
                                </a>
                            ))}
                        </div>

                        <div className="mt-6 flex flex-wrap gap-2">
                            {hasProjects ? <a href="#preview-projects" className="border border-emerald-400/30 bg-emerald-400/10 px-4 py-2 text-[10px] font-bold text-emerald-300">$ cd projects</a> : null}
                            {hasContact && (form.email || user?.email) ? <a href={`mailto:${form.email || user?.email || ""}`} className="border border-cyan-400/20 px-4 py-2 text-[10px] text-cyan-300">$ mail --contact</a> : null}
                        </div>
                    </div>

                    <div className="space-y-4">
                        <div className="flex justify-center rounded-xl border border-emerald-400/15 bg-[#040804] p-4">
                            <div className="h-36 w-36 overflow-hidden rounded-full border border-emerald-400/20 bg-[#050a05]">
                                {form.profileImage ? (
                                    <img src={form.profileImage} alt={name} className="h-full w-full object-cover" />
                                ) : (
                                    <div className="flex h-full w-full items-center justify-center text-3xl font-bold text-emerald-400">
                                        {name.charAt(0).toUpperCase()}
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="rounded-xl border border-emerald-400/15 bg-[#040804] p-4 text-[10px] leading-6 text-slate-500">
                        <p className="text-emerald-400">{`{`}</p>
                        <p><span className="text-purple-400">name:</span> "{name}"</p>
                        <p><span className="text-purple-400">projects:</span> {sortedProjects.length},</p>
                        <p><span className="text-purple-400">skills:</span> {technologiesCount},</p>
                        <p><span className="text-purple-400">certificates:</span> {sortedCertificates.length},</p>
                        <p><span className="text-purple-400">status:</span> "building"</p>
                        <p className="text-emerald-400">{`}`}</p>
                        </div>
                    </div>
                </div>
            </section>


            <div className="grid grid-cols-2 border-b border-emerald-400/10 sm:grid-cols-4">
                {[
                    [sortedProjects.length, "projects"],
                    [sortedExperiences.length, "experience"],
                    [technologiesCount, "technologies"],
                    [sortedCertificates.length, "certificates"]
                ].map(([value, label]) => (
                    <div key={label} className="border-r border-emerald-400/10 px-3 py-5 text-center last:border-r-0">
                        <p className="text-lg font-bold text-emerald-300">{value}</p>
                        <p className="mt-1 text-[9px] text-slate-600">{label}</p>
                    </div>
                ))}
            </div>


            {hasAbout ? (
                <section id="preview-about" className="border-b border-emerald-400/10 px-5 py-10 sm:px-9">
                    <p className="text-[10px] text-slate-600">01 // about.js</p>
                    <p className="mt-4 max-w-4xl whitespace-pre-line text-xs leading-7 text-slate-400">
                        {form.bio}
                    </p>
                </section>
            ) : null}


            {hasSkills ? (
                <section id="preview-skills" className="border-b border-emerald-400/10 px-5 py-10 sm:px-9">
                    <p className="text-[10px] text-slate-600">02 // skills.json</p>
                    <div className="mt-5 grid grid-cols-1 gap-3 md:grid-cols-2">
                        {sortedSkills.map((skill) => (
                            <div key={skill._id} className="border border-emerald-400/10 bg-emerald-400/[0.02] p-4">
                                <div className="flex items-center justify-between gap-3">
                                    <p className="text-xs font-semibold text-emerald-300">{skill.name}</p>
                                    {skill.percentage !== undefined ? <span className="text-[10px] text-slate-500">{skill.percentage}%</span> : null}
                                </div>
                                {skill.percentage !== undefined ? (
                                    <div className="mt-3 h-1 overflow-hidden bg-white/5">
                                        <div className="h-full bg-emerald-400" style={{ width: `${Math.max(0, Math.min(100, Number(skill.percentage) || 0))}%` }} />
                                    </div>
                                ) : null}
                            </div>
                        ))}
                    </div>
                </section>
            ) : null}


            {hasProjects ? (
                <section id="preview-projects" className="border-b border-emerald-400/10 px-5 py-10 sm:px-9">
                    <p className="text-[10px] text-slate-600">03 // projects/</p>
                    <div className="mt-5 grid grid-cols-1 gap-4 xl:grid-cols-2">
                        {sortedProjects.map((project) => (
                            <article key={project._id} className="border border-emerald-400/10 bg-emerald-400/[0.02] p-4">
                                <div className="flex items-center justify-between gap-3">
                                    <h3 className="text-sm font-bold text-emerald-300">{project.title}</h3>
                                    {project.featured ? <span className="text-[9px] text-yellow-300">[featured]</span> : null}
                                </div>
                                {project.category ? <p className="mt-1 text-[9px] text-cyan-300">{project.category}</p> : null}
                                {project.image ? (
    <div className="mt-3 h-40 overflow-hidden border border-emerald-400/10 bg-black/20">
        <img
            src={project.image}
            alt={project.title || "Project"}
            className="h-full w-full object-cover"
        />
    </div>
) : null}
                                {project.description ? <p className="mt-3 text-xs leading-6 text-slate-500">{project.description}</p> : null}
                                {toArray(project.technologies).length > 0 ? (
                                    <p className="mt-3 text-[9px] leading-5 text-slate-600">{toArray(project.technologies).join(" · ")}</p>
                                ) : null}
                                <div className="mt-4 flex flex-wrap gap-2">
                                    {project.githubUrl ? <a href={project.githubUrl} target="_blank" rel="noreferrer" className="border border-emerald-400/15 px-3 py-2 text-[9px] text-slate-400">git</a> : null}
                                    {project.liveUrl ? <a href={project.liveUrl} target="_blank" rel="noreferrer" className="border border-cyan-400/20 px-3 py-2 text-[9px] text-cyan-300">deploy</a> : null}
                                </div>
                            </article>
                        ))}
                    </div>
                </section>
            ) : null}


            {hasExperience ? (
                <section id="preview-experience" className="border-b border-emerald-400/10 px-5 py-10 sm:px-9">
                    <p className="text-[10px] text-slate-600">04 // experience.log</p>
                    <div className="mt-5 space-y-4">
                        {sortedExperiences.map((experience) => (
                            <article key={experience._id} className="border border-emerald-400/10 bg-emerald-400/[0.02] p-4">
                                <h3 className="text-sm font-bold text-emerald-300">{experience.jobTitle}</h3>
                                {experience.company ? <p className="mt-1 text-xs text-cyan-300">{experience.company}</p> : null}
                                <p className="mt-1 text-[9px] text-slate-600">{formatDate(experience.startDate)}{experience.startDate || experience.endDate ? " → " : ""}{experience.currentlyWorking ? "Present" : formatDate(experience.endDate)}</p>
                                {experience.description ? <p className="mt-3 whitespace-pre-line text-xs leading-6 text-slate-500">{experience.description}</p> : null}
                            </article>
                        ))}
                    </div>
                </section>
            ) : null}


            {hasEducation ? (
                <section id="preview-education" className="border-b border-emerald-400/10 px-5 py-10 sm:px-9">
                    <p className="text-[10px] text-slate-600">05 // education.md</p>
                    <div className="mt-5 space-y-4">
                        {sortedEducation.map((item) => (
                            <article key={item._id} className="border border-emerald-400/10 bg-emerald-400/[0.02] p-4">
                                <h3 className="text-sm font-bold text-emerald-300">{item.degree}</h3>
                                {item.institution ? <p className="mt-1 text-xs text-cyan-300">{item.institution}</p> : null}
                                {item.fieldOfStudy ? <p className="mt-1 text-[9px] text-slate-600">{item.fieldOfStudy}</p> : null}
                                <p className="mt-1 text-[9px] text-slate-600">{formatDate(item.startDate)}{item.startDate || item.endDate ? " → " : ""}{item.currentlyStudying ? "Present" : formatDate(item.endDate)}</p>
                                {item.description ? <p className="mt-3 text-xs leading-6 text-slate-500">{item.description}</p> : null}
                            </article>
                        ))}
                    </div>
                </section>
            ) : null}


            {hasCertificates ? (
                <section id="preview-certificates" className="border-b border-emerald-400/10 px-5 py-10 sm:px-9">
                    <p className="text-[10px] text-slate-600">06 // certificates/</p>
                    <div className="mt-5 grid grid-cols-1 gap-4 md:grid-cols-2">
                        {sortedCertificates.map((certificate) => (
                            <article key={certificate._id} className="border border-emerald-400/10 bg-emerald-400/[0.02] p-4">
                                <div className="flex items-start justify-between gap-3">
                                    <div>
                                        <h3 className="text-sm font-bold text-emerald-300">{certificate.title}</h3>
                                        {certificate.issuingOrganization ? <p className="mt-1 text-[10px] text-cyan-300">{certificate.issuingOrganization}</p> : null}
                                    </div>
                                    <span className="text-xl">📄</span>
                                </div>
                                {certificate.description ? <p className="mt-3 text-xs leading-6 text-slate-500">{certificate.description}</p> : null}
                                {certificate.certificateImage ? <a href={certificate.certificateImage} target="_blank" rel="noreferrer" className="mt-4 inline-flex border border-emerald-400/15 px-3 py-2 text-[9px] text-emerald-300">open certificate</a> : null}
                            </article>
                        ))}
                    </div>
                </section>
            ) : null}


            {hasPosts ? (
                <section id="preview-posts" className="border-b border-emerald-400/10 px-5 py-10 sm:px-9">
                    <p className="text-[10px] text-slate-600">07 // posts/</p>
                    <div className="mt-5 space-y-4">
                        {sortedPosts.map((post) => (
                            <article key={post._id} className="border border-emerald-400/10 bg-emerald-400/[0.02] p-4">
                                {post.coverImage && getMediaType(post.coverImage) === "image" ? (
                                    <div className="mb-4 h-40 overflow-hidden border border-emerald-400/10 bg-black/20">
                                        <img src={post.coverImage} alt={post.title || "Post"} className="h-full w-full object-cover" />
                                    </div>
                                ) : null}
                                <div className="flex flex-wrap items-center gap-2 text-[9px] text-slate-600">
                                    {post.postType ? <span>{post.postType}</span> : null}
                                    {post.publishedAt ? <span>· {formatDate(post.publishedAt)}</span> : null}
                                </div>
                                <h3 className="mt-2 text-sm font-bold text-emerald-300">{post.title}</h3>
                                {post.excerpt ? <p className="mt-2 text-xs leading-6 text-slate-500">{post.excerpt}</p> : null}
                                {post.content ? <p className="mt-2 line-clamp-4 whitespace-pre-line text-[10px] leading-6 text-slate-600">{post.content}</p> : null}
                                {(post.githubUrl || post.demoUrl || post.externalUrl) ? (
                                    <div className="mt-4 flex flex-wrap gap-2">
                                        {post.githubUrl ? <a href={post.githubUrl} target="_blank" rel="noreferrer" className="inline-flex border border-emerald-400/15 px-3 py-2 text-[9px] text-emerald-300">github ↗</a> : null}
                                        {post.demoUrl ? <a href={post.demoUrl} target="_blank" rel="noreferrer" className="inline-flex border border-emerald-400/15 px-3 py-2 text-[9px] text-emerald-300">demo ↗</a> : null}
                                        {post.externalUrl ? <a href={post.externalUrl} target="_blank" rel="noreferrer" className="inline-flex border border-emerald-400/15 px-3 py-2 text-[9px] text-emerald-300">open ↗</a> : null}
                                    </div>
                                ) : null}
                            </article>
                        ))}
                    </div>
                </section>
            ) : null}


            <SEOBlock variant="developer" />


            {hasContact ? (
                <section id="preview-contact" className="border-b border-emerald-400/10 px-5 py-10 sm:px-9">
                    <p className="text-[10px] text-slate-600">09 // contact.sh</p>
                    <div className="mt-5">
                        <ContactGrid />
                    </div>
                </section>
            ) : null}

            <footer className="border-t border-emerald-400/10 px-5 py-6 text-center text-[9px] text-slate-600 sm:px-9">
                build complete · {form.title || user?.name || "portfolio"}
            </footer>
        </div>
    );


    // ========================================
    // CREATIVE TEMPLATE
    // ========================================

    const CreativeTemplate = () => (
        <div className="template-creative relative overflow-hidden rounded-[2rem] border border-fuchsia-400/20 bg-[#090d1f] text-white">

            <div className="pointer-events-none absolute -right-24 top-20 h-64 w-64 rounded-full bg-fuchsia-500/20 blur-[90px]" />
            <div className="pointer-events-none absolute -left-24 top-[40%] h-72 w-72 rounded-full bg-cyan-400/15 blur-[100px]" />
            <div className="pointer-events-none absolute bottom-0 right-[25%] h-56 w-56 rounded-full bg-violet-500/15 blur-[90px]" />


            <nav className="relative z-10 flex flex-wrap items-center justify-between gap-4 border-b border-white/10 bg-white/[0.03] px-5 py-4 backdrop-blur-xl sm:px-8">
                <div className="text-base font-black tracking-tight">
                    {first}<span className="text-fuchsia-300">.</span>{rest}
                </div>

                <div className="flex flex-wrap gap-4 text-[10px] text-slate-400">
                    <a href="#preview-home" className="hover:text-white">Home</a>
                    {hasProjects ? <a href="#preview-projects" className="hover:text-white">Projects</a> : null}
                    {hasSkills ? <a href="#preview-skills" className="hover:text-white">Skills</a> : null}
                    {hasCertificates ? <a href="#preview-certificates" className="hover:text-white">Certificates</a> : null}
                    {hasContact ? <a href="#preview-contact" className="hover:text-white">Let's Talk</a> : null}
                </div>
            </nav>


            <section id="preview-home" className="relative z-10 grid gap-10 px-6 py-14 sm:px-12 sm:py-20 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
                <div>
                    <div className="inline-flex rounded-full border border-white/15 bg-white/[0.05] px-3 py-1.5 text-[9px] font-bold uppercase tracking-[0.2em] text-fuchsia-200 backdrop-blur">
                        ✦ Turn ideas into reality
                    </div>

                    <h2 className="mt-6 max-w-4xl text-5xl font-black leading-[0.92] tracking-[-0.05em] sm:text-7xl">
                        {name}
                    </h2>

                    {form.headline ? (
                        <p className="mt-6 max-w-2xl text-lg font-semibold text-white/85 sm:text-xl">
                            {form.headline}
                        </p>
                    ) : null}

                    {form.bio ? (
                        <p className="mt-5 max-w-2xl whitespace-pre-line text-sm leading-7 text-slate-300/80">
                            {form.bio}
                        </p>
                    ) : null}

                    <div className="mt-8 flex flex-wrap gap-3">
                        {hasProjects ? (
                            <a href="#preview-projects" className="rounded-full bg-fuchsia-400 px-5 py-2.5 text-xs font-black text-slate-950 shadow-[0_15px_45px_rgba(217,70,239,0.25)]">
                                Explore Projects →
                            </a>
                        ) : null}
                        {hasContact && (form.email || user?.email) ? (
                            <a href={`mailto:${form.email || user?.email || ""}`} className="rounded-full border border-white/20 bg-white/[0.05] px-5 py-2.5 text-xs font-semibold text-white backdrop-blur">
                                Let's Talk
                            </a>
                        ) : null}
                    </div>

                    {socialLinks.length > 0 ? (
                        <div className="mt-7 flex flex-wrap gap-2">
                            {socialLinks.map((item) => (
                                <a key={item.label} href={item.href} target="_blank" rel="noreferrer" className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1.5 text-[10px] text-slate-300 backdrop-blur hover:border-fuchsia-300/30">
                                    {item.label}
                                </a>
                            ))}
                        </div>
                    ) : null}
                </div>

                <div className="relative flex justify-center lg:justify-end">
                    <div className="relative w-full max-w-sm">
                        <div className="absolute -left-5 top-8 h-20 w-20 rotate-12 rounded-[1.5rem] border border-cyan-300/30 bg-cyan-300/10 backdrop-blur-xl" />
                        <div className="absolute -bottom-6 right-2 h-24 w-24 -rotate-12 rounded-full border border-fuchsia-300/30 bg-fuchsia-300/10 backdrop-blur-xl" />

                        <div className="relative overflow-hidden rounded-[2rem] border border-white/15 bg-white/[0.07] p-3 shadow-2xl backdrop-blur-xl">
                            <div className="h-72 overflow-hidden rounded-[1.5rem] bg-gradient-to-br from-cyan-300/20 via-violet-400/20 to-fuchsia-400/20">
                                {form.profileImage ? (
                                    <img src={form.profileImage} alt={name} className="h-full w-full object-cover" />
                                ) : (
                                    <div className="flex h-full items-center justify-center text-7xl font-black text-white/80">
                                        {name.charAt(0).toUpperCase()}
                                    </div>
                                )}
                            </div>

                            <div className="flex items-center justify-between gap-4 px-2 pb-1 pt-4">
                                <div>
                                    <p className="text-[9px] uppercase tracking-[0.18em] text-fuchsia-200/70">Based in</p>
                                    <p className="mt-1 text-sm font-semibold text-white">{form.location || "Worldwide"}</p>
                                </div>
                                <div className="rounded-full bg-white/10 px-3 py-1.5 text-[9px] font-bold text-cyan-200">{sortedProjects.length} projects</div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>


            <div className="relative z-10 grid gap-3 px-6 pb-8 sm:grid-cols-4 sm:px-12">
                {[
                    [sortedProjects.length, "Projects"],
                    [sortedExperiences.length, "Experience"],
                    [technologiesCount, "Technologies"],
                    [sortedCertificates.length, "Certificates"]
                ].map(([value, label]) => (
                    <div key={label} className="rounded-2xl border border-white/10 bg-white/[0.04] p-4 text-center backdrop-blur-xl">
                        <p className="text-xl font-black">{value}</p>
                        <p className="mt-1 text-[9px] uppercase tracking-[0.16em] text-slate-500">{label}</p>
                    </div>
                ))}
            </div>


            {hasAbout ? (
                <section id="preview-about" className="relative z-10 px-6 py-12 sm:px-12">
                    <div className="rounded-[1.75rem] border border-white/10 bg-white/[0.035] p-6 backdrop-blur-xl sm:p-8">
                        <div className="flex items-center justify-between gap-4">
                            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-cyan-200">01 · About</p>
                            <span className="text-fuchsia-200">✦</span>
                        </div>
                        <p className="mt-5 max-w-4xl whitespace-pre-line text-sm leading-8 text-slate-300/85">
                            {form.bio}
                        </p>
                    </div>
                </section>
            ) : null}


            {hasSkills ? (
                <section id="preview-skills" className="relative z-10 px-6 py-6 sm:px-12">
                    <div className="mb-5 flex items-end justify-between gap-4">
                        <div>
                            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-cyan-200">02 · Skills</p>
                            <h3 className="mt-2 text-2xl font-black">Things I build with.</h3>
                        </div>
                    </div>
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
                        {sortedSkills.map((skill, index) => (
                            <div key={skill._id} className="rounded-[1.5rem] border border-white/10 bg-white/[0.035] p-5 backdrop-blur-xl transition hover:-translate-y-1 hover:border-fuchsia-300/30">
                                <div className="flex items-center justify-between gap-3">
                                    <div className="flex items-center gap-3">
                                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-300/20 to-fuchsia-300/20 text-lg">
                                            {skill.icon || "✦"}
                                        </div>
                                        <div>
                                            <p className="text-sm font-bold">{skill.name}</p>
                                            {skill.category ? <p className="mt-0.5 text-[10px] text-slate-500">{skill.category}</p> : null}
                                        </div>
                                    </div>
                                    {skill.percentage !== undefined ? <span className="text-xs font-bold text-cyan-200">{skill.percentage}%</span> : null}
                                </div>
                                {skill.percentage !== undefined ? (
                                    <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-white/5">
                                        <div className="h-full rounded-full bg-gradient-to-r from-cyan-300 to-fuchsia-400" style={{ width: `${Math.max(0, Math.min(100, Number(skill.percentage) || 0))}%` }} />
                                    </div>
                                ) : null}
                                {skill.description ? <p className="mt-3 text-xs leading-6 text-slate-500">{skill.description}</p> : null}
                            </div>
                        ))}
                    </div>
                </section>
            ) : null}


            {hasProjects ? (
                <section id="preview-projects" className="relative z-10 px-6 py-12 sm:px-12">
                    <div className="mb-6">
                        <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-fuchsia-200">03 · Projects</p>
                        <h3 className="mt-2 text-3xl font-black tracking-tight">Selected experiments & builds.</h3>
                    </div>
                    <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
                        {sortedProjects.map((project, index) => (
                            <article key={project._id} className={`overflow-hidden rounded-[1.75rem] border border-white/10 bg-white/[0.035] backdrop-blur-xl ${index % 3 === 1 ? "lg:translate-y-6" : ""}`}>
                                {project.image ? (
                                    <div className="h-56 overflow-hidden bg-gradient-to-br from-cyan-300/10 via-violet-400/10 to-fuchsia-400/10">
                                        <img src={project.image} alt={project.title || "Project"} className="h-full w-full object-cover transition duration-500 hover:scale-105" />
                                    </div>
                                ) : null}
                                <div className="p-5">
                                    {project.category ? <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-cyan-200">{project.category}</p> : null}
                                    <h3 className="mt-2 text-xl font-black">{project.title}</h3>
                                    {project.description ? <p className="mt-3 text-sm leading-7 text-slate-400">{project.description}</p> : null}
                                    {toArray(project.technologies).length > 0 ? (
                                        <div className="mt-4 flex flex-wrap gap-2">
                                            {toArray(project.technologies).map((technology, technologyIndex) => (
                                                <span key={`${technology}-${technologyIndex}`} className="rounded-full border border-white/10 bg-white/[0.03] px-2.5 py-1 text-[10px] text-slate-400">
                                                    {technology}
                                                </span>
                                            ))}
                                        </div>
                                    ) : null}
                                    <div className="mt-5 flex flex-wrap gap-2">
                                        {project.githubUrl ? <a href={project.githubUrl} target="_blank" rel="noreferrer" className="rounded-full border border-white/10 px-3 py-2 text-[10px] text-slate-300">GitHub ↗</a> : null}
                                        {project.liveUrl ? <a href={project.liveUrl} target="_blank" rel="noreferrer" className="rounded-full px-3 py-2 text-[10px] font-bold text-slate-950" style={{ backgroundColor: primary }}>Live Demo ↗</a> : null}
                                    </div>
                                </div>
                            </article>
                        ))}
                    </div>
                </section>
            ) : null}


            {hasExperience ? (
                <section id="preview-experience" className="relative z-10 px-6 py-12 sm:px-12">
                    <div className="rounded-[1.75rem] border border-white/10 bg-white/[0.03] p-6 backdrop-blur-xl sm:p-8">
                        <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-cyan-200">04 · Experience</p>
                        <div className="mt-6 grid gap-4">
                            {sortedExperiences.map((experience) => (
                                <article key={experience._id} className="rounded-2xl border border-white/10 bg-black/10 p-5">
                                    <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-start">
                                        <div>
                                            <h3 className="text-lg font-black">{experience.jobTitle}</h3>
                                            {experience.company ? <p className="mt-1 text-sm text-fuchsia-200">{experience.company}</p> : null}
                                        </div>
                                        <p className="text-[10px] text-slate-500">{formatDate(experience.startDate)}{experience.startDate || experience.endDate ? " — " : ""}{experience.currentlyWorking ? "Present" : formatDate(experience.endDate)}</p>
                                    </div>
                                    {experience.description ? <p className="mt-4 whitespace-pre-line text-sm leading-7 text-slate-400">{experience.description}</p> : null}
                                </article>
                            ))}
                        </div>
                    </div>
                </section>
            ) : null}


            {hasEducation ? (
                <section id="preview-education" className="relative z-10 px-6 py-6 sm:px-12">
                    <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-fuchsia-200">05 · Education</p>
                    <div className="mt-5 grid gap-4 md:grid-cols-2">
                        {sortedEducation.map((item) => (
                            <article key={item._id} className="rounded-[1.5rem] border border-white/10 bg-white/[0.035] p-5 backdrop-blur-xl">
                                <h3 className="text-lg font-black">{item.degree}</h3>
                                {item.institution ? <p className="mt-1 text-sm text-cyan-200">{item.institution}</p> : null}
                                {item.fieldOfStudy ? <p className="mt-1 text-xs text-slate-500">{item.fieldOfStudy}</p> : null}
                                <p className="mt-3 text-[10px] text-slate-500">{formatDate(item.startDate)}{item.startDate || item.endDate ? " — " : ""}{item.currentlyStudying ? "Present" : formatDate(item.endDate)}</p>
                                {item.grade ? <p className="mt-3 text-xs text-slate-400">Grade: {item.grade}</p> : null}
                                {item.description ? <p className="mt-3 text-sm leading-7 text-slate-400">{item.description}</p> : null}
                            </article>
                        ))}
                    </div>
                </section>
            ) : null}


            {hasCertificates ? (
                <section id="preview-certificates" className="relative z-10 px-6 py-12 sm:px-12">
                    <div className="mb-5 flex items-end justify-between gap-4">
                        <div>
                            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-cyan-200">06 · Certificates</p>
                            <h3 className="mt-2 text-3xl font-black">Proof of learning.</h3>
                        </div>
                    </div>
                    <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                        {sortedCertificates.map((certificate) => (
                            <article key={certificate._id} className="overflow-hidden rounded-[1.75rem] border border-white/10 bg-white/[0.035] backdrop-blur-xl">
                                {certificate.certificateImage ? (
                                    <div className="h-52 overflow-hidden bg-white/[0.04]">
                                        {getMediaType(certificate.certificateImage) === "image" ? (
                                            <img src={certificate.certificateImage} alt={certificate.title || "Certificate"} className="h-full w-full object-contain" />
                                        ) : (
                                            <div className="flex h-full items-center justify-center text-5xl">📜</div>
                                        )}
                                    </div>
                                ) : null}
                                <div className="p-5">
                                    <div className="flex items-start justify-between gap-3">
                                        <div>
                                            <h3 className="text-lg font-black">{certificate.title}</h3>
                                            {certificate.issuingOrganization ? <p className="mt-1 text-sm text-fuchsia-200">{certificate.issuingOrganization}</p> : null}
                                        </div>
                                        <span className="text-xl">✦</span>
                                    </div>
                                    {certificate.issueDate ? <p className="mt-2 text-[10px] text-slate-500">Issued {formatDate(certificate.issueDate)}</p> : null}
                                    {certificate.description ? <p className="mt-3 line-clamp-3 text-sm leading-6 text-slate-400">{certificate.description}</p> : null}
                                    {certificate.certificateImage ? <a href={certificate.certificateImage} target="_blank" rel="noreferrer" className="mt-4 inline-flex rounded-full border border-white/10 px-3 py-2 text-[10px] font-semibold text-slate-300">View Certificate ↗</a> : null}
                                </div>
                            </article>
                        ))}
                    </div>
                </section>
            ) : null}


            {hasPosts ? (
                <section id="preview-posts" className="relative z-10 px-6 py-12 sm:px-12">
                    <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-fuchsia-200">07 · Posts</p>
                    <div className="mt-5 grid gap-4 md:grid-cols-2">
                        {sortedPosts.map((post, index) => (
                            <article key={post._id} className={`overflow-hidden rounded-[1.5rem] border border-white/10 bg-white/[0.035] backdrop-blur-xl ${index % 2 ? "md:translate-y-5" : ""}`}>
                                {post.coverImage && getMediaType(post.coverImage) === "image" ? (
                                    <div className="h-52 overflow-hidden bg-white/[0.04]">
                                        <img src={post.coverImage} alt={post.title || "Post"} className="h-full w-full object-cover" />
                                    </div>
                                ) : null}
                                <div className="p-5">
                                    <div className="flex flex-wrap items-center gap-2 text-[10px] text-slate-500">
                                        {post.postType ? <span className="rounded-full border border-white/10 px-2 py-1">{post.postType}</span> : null}
                                        {post.publishedAt ? <span>{formatDate(post.publishedAt)}</span> : null}
                                    </div>
                                    <h3 className="mt-3 text-lg font-black">{post.title}</h3>
                                    {post.excerpt ? <p className="mt-2 text-sm leading-6 text-slate-400">{post.excerpt}</p> : null}
                                    {post.content ? <p className="mt-3 line-clamp-4 whitespace-pre-line text-xs leading-6 text-slate-500">{post.content}</p> : null}
                                    {(post.githubUrl || post.demoUrl || post.externalUrl) ? (
                                        <div className="mt-4 flex flex-wrap gap-2">
                                            {post.githubUrl ? <a href={post.githubUrl} target="_blank" rel="noreferrer" className="inline-flex rounded-full border border-white/10 px-3 py-2 text-[10px] font-semibold text-slate-300">GitHub ↗</a> : null}
                                            {post.demoUrl ? <a href={post.demoUrl} target="_blank" rel="noreferrer" className="inline-flex rounded-full border border-white/10 px-3 py-2 text-[10px] font-semibold text-slate-300">Demo ↗</a> : null}
                                            {post.externalUrl ? <a href={post.externalUrl} target="_blank" rel="noreferrer" className="inline-flex rounded-full border border-white/10 px-3 py-2 text-[10px] font-semibold text-slate-300">Open ↗</a> : null}
                                        </div>
                                    ) : null}
                                </div>
                            </article>
                        ))}
                    </div>
                </section>
            ) : null}


            <SEOBlock />


            {hasContact ? (
                <section id="preview-contact" className="relative z-10 px-6 py-12 sm:px-12">
                    <div className="rounded-[2rem] border border-white/10 bg-white/[0.04] p-6 backdrop-blur-xl sm:p-8">
                        <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
                            <div>
                                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-cyan-200">09 · Contact</p>
                                <h3 className="mt-2 text-3xl font-black">Let's make something.</h3>
                            </div>
                            {form.email || user?.email ? (
                                <a href={`mailto:${form.email || user?.email || ""}`} className="rounded-full bg-cyan-300 px-5 py-2.5 text-xs font-black text-slate-950">Start a Conversation →</a>
                            ) : null}
                        </div>
                        <div className="mt-6">
                            <ContactGrid />
                        </div>
                    </div>
                </section>
            ) : null}

            <footer className="relative z-10 px-6 py-10 text-center text-xs text-slate-600 sm:px-12">
                {form.title || user?.name || "Portfolio"} · designed with personality
            </footer>
        </div>
    );


    // ========================================
    // OUTER PREVIEW WRAPPER
    // ========================================

    return (
        <section
            data-template={selectedTemplate}
            className="min-w-0 rounded-3xl border border-white/10 bg-[#070b16] p-3 shadow-2xl sm:p-4"
        >
            <style>{`
                .template-modern article,
                .template-modern > nav,
                .template-modern > section,
                .template-modern footer {
                    transition: border-color 220ms ease, background-color 220ms ease, transform 220ms ease;
                }

                .template-modern article:hover {
                    border-color: rgba(34, 211, 238, 0.22) !important;
                }

                .template-minimal article,
                .template-minimal a,
                .template-minimal div {
                    transition: border-color 180ms ease, transform 180ms ease, background-color 180ms ease;
                }

                .template-minimal article:hover {
                    border-color: #cbd5e1;
                    transform: translateY(-2px);
                }

                .template-developer section,
                .template-developer article {
                    background-image: linear-gradient(rgba(74,222,128,0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(74,222,128,0.02) 1px, transparent 1px);
                    background-size: 24px 24px;
                }

                .template-developer a:hover,
                .template-developer article:hover {
                    border-color: rgba(74, 222, 128, 0.28) !important;
                }

                .template-creative article {
                    transition: transform 220ms ease, border-color 220ms ease, box-shadow 220ms ease;
                }

                .template-creative article:hover {
                    transform: translateY(-5px) rotate(-0.15deg);
                    border-color: rgba(217, 70, 239, 0.24) !important;
                    box-shadow: 0 20px 50px rgba(0,0,0,0.16);
                }
            `}</style>


            {/* PREVIEW LABEL */}

            <div className="mb-3 flex items-center justify-between px-2">
                <div>
                    <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-slate-500">
                        Live Preview · {selectedTemplate}
                    </p>
                    <p className="mt-1 text-xs text-slate-600">
                        Real portfolio data
                    </p>
                </div>

                <span className="inline-flex items-center gap-2 text-xs text-emerald-300">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                    Live
                </span>
            </div>


            {dataError ? (
                <div className="mb-3 rounded-xl border border-red-400/20 bg-red-400/5 px-4 py-3 text-xs text-red-300">
                    {dataError}
                </div>
            ) : null}


            {selectedTemplate === "modern" ? (
                <ModernTemplate />
            ) : selectedTemplate === "minimal" ? (
                <MinimalTemplate />
            ) : selectedTemplate === "developer" ? (
                <DeveloperTemplate />
            ) : (
                <CreativeTemplate />
            )}

        </section>
    );
};

export default LivePortfolioPreview;
