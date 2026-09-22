import {
    createContext,
    useContext,
    useEffect,
    useState
} from "react";

import {
    getMyPortfolio,
    createPortfolio,
    updatePortfolio,
    publishPortfolio,
    unpublishPortfolio,
    deletePortfolio
} from "../api/portfolio.api";

import {
    useAuth
} from "./AuthContext";


const PortfolioContext =
    createContext(null);


// ========================================
// PROVIDER
// ========================================

export const PortfolioProvider = ({
    children
}) => {

    const {
        user,
        loading: authLoading,
        isAuthenticated
    } = useAuth();


    const [portfolio, setPortfolio] =
        useState(null);


    const [loading, setLoading] =
        useState(true);


    const [saving, setSaving] =
        useState(false);


    const [error, setError] =
        useState("");


    // ========================================
    // LOAD PORTFOLIO
    // ========================================

    const loadPortfolio = async () => {

        /*
         * Do not call protected API
         * before authentication is ready.
         */

        if (
            authLoading ||
            !isAuthenticated
        ) {

            setPortfolio(null);
            setLoading(false);

            return;
        }


        try {

            setLoading(true);
            setError("");


            const response =
                await getMyPortfolio();


            const loadedPortfolio =
                response?.data ||
                response?.portfolio ||
                null;


            setPortfolio(
                loadedPortfolio
            );

        } catch (error) {

            /*
             * 404 means the user simply
             * has not created a portfolio yet.
             */

            if (
                error?.response?.status === 404
            ) {

                setPortfolio(null);

            } else {

                setError(
                    error?.response?.data?.message ||
                    "Failed to load portfolio."
                );
            }

        } finally {

            setLoading(false);
        }
    };


    // ========================================
    // CREATE
    // ========================================

    const create = async (data) => {

        try {

            setSaving(true);
            setError("");


            const response =
                await createPortfolio(
                    data
                );


            /*
             * API helpers may return either:
             *
             * response.data
             * response.portfolio
             *
             * or the portfolio object directly.
             *
             * Normalize all supported shapes
             * before updating context state.
             */

            const responseData =
                response?.data ||
                response?.portfolio ||
                response ||
                null;


            const createdPortfolio =
                responseData?.data ||
                responseData?.portfolio ||
                responseData ||
                null;


            setPortfolio(
                createdPortfolio
            );


            return createdPortfolio;

        } catch (error) {

            const message =
                error?.response?.data?.message ||
                "Failed to create portfolio.";


            setError(message);

            throw error;

        } finally {

            setSaving(false);
        }
    };


    // ========================================
    // UPDATE
    // ========================================

    const update = async (data) => {

        try {

            setSaving(true);
            setError("");


            const response =
                await updatePortfolio(
                    data
                );


            /*
             * Normalize the API response.
             *
             * This is important for SEO because
             * the complete updated portfolio,
             * including seo.metaTitle,
             * seo.metaDescription,
             * seo.keywords and seo.ogImage,
             * must remain in PortfolioContext.
             */

            const responseData =
                response?.data ||
                response?.portfolio ||
                response ||
                null;


            const updatedPortfolio =
                responseData?.data ||
                responseData?.portfolio ||
                responseData ||
                null;


            setPortfolio(
                updatedPortfolio
            );


            return updatedPortfolio;

        } catch (error) {

            const message =
                error?.response?.data?.message ||
                "Failed to update portfolio.";


            setError(message);

            throw error;

        } finally {

            setSaving(false);
        }
    };


    // ========================================
    // SAVE
    // ========================================

    const save = async (data) => {

        if (portfolio) {

            return update(data);

        }

        return create(data);
    };


    // ========================================
    // PUBLISH
    // ========================================

    const publish = async () => {

        try {

            setSaving(true);
            setError("");


            const response =
                await publishPortfolio();


            const publishedPortfolio =
                response?.data ||
                response?.portfolio ||
                null;


            setPortfolio(
                publishedPortfolio
            );


            return publishedPortfolio;

        } catch (error) {

            const message =
                error?.response?.data?.message ||
                "Failed to publish portfolio.";


            setError(message);

            throw error;

        } finally {

            setSaving(false);
        }
    };


    // ========================================
    // UNPUBLISH
    // ========================================

    const unpublish = async () => {

        try {

            setSaving(true);
            setError("");


            const response =
                await unpublishPortfolio();


            const unpublishedPortfolio =
                response?.data ||
                response?.portfolio ||
                null;


            setPortfolio(
                unpublishedPortfolio
            );


            return unpublishedPortfolio;

        } catch (error) {

            const message =
                error?.response?.data?.message ||
                "Failed to unpublish portfolio.";


            setError(message);

            throw error;

        } finally {

            setSaving(false);
        }
    };


    // ========================================
    // DELETE
    // ========================================

    const remove = async () => {

        try {

            setSaving(true);
            setError("");


            await deletePortfolio();


            setPortfolio(null);

        } catch (error) {

            const message =
                error?.response?.data?.message ||
                "Failed to delete portfolio.";


            setError(message);

            throw error;

        } finally {

            setSaving(false);
        }
    };


    // ========================================
    // INITIAL LOAD
    // ========================================

    useEffect(() => {

        /*
         * Wait for AuthContext.
         *
         * AuthContext first restores the access token.
         * Only then PortfolioContext calls /portfolio/me.
         */

        if (authLoading) {
            return;
        }


        if (!user || !isAuthenticated) {

            setPortfolio(null);
            setLoading(false);

            return;
        }


        loadPortfolio();

    }, [
        authLoading,
        user,
        isAuthenticated
    ]);


    // ========================================
    // CONTEXT
    // ========================================

    return (
        <PortfolioContext.Provider
            value={{

                portfolio,
                setPortfolio,

                loading,
                saving,
                error,

                loadPortfolio,
                create,
                update,
                save,
                publish,
                unpublish,
                remove

            }}
        >
            {children}
        </PortfolioContext.Provider>
    );
};


// ========================================
// HOOK
// ========================================

export const usePortfolio = () => {

    const context =
        useContext(
            PortfolioContext
        );


    if (!context) {

        throw new Error(
            "usePortfolio must be used inside PortfolioProvider"
        );
    }


    return context;
};
