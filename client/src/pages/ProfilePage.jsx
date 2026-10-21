
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getCurrentUser } from "../services/api";
import "./ProfilePage.css";

/**
 * User Profile Page
 *
 * Displays the currently logged-in user's account information.
 * The backend verifies the saved JWT before returning the profile.
 */
function ProfilePage() {
    // Stores the profile returned by the backend.
    const [profile, setProfile] = useState(null);

    // Tracks whether the profile request is still running.
    const [loading, setLoading] = useState(true);

    // Stores an API error message, if the request fails.
    const [error, setError] = useState("");

    useEffect(() => {
        // Prevents state updates if the component unmounts before
        // the API request finishes.
        let isMounted = true;

        async function loadProfile() {
            try {
                setLoading(true);
                setError("");

                // Fetch the authenticated user's latest profile.
                const response = await getCurrentUser();

                if (isMounted) {
                    // The backend response contains data.user.
                    setProfile(response.data.user);
                }
            } catch (err) {
                if (isMounted) {
                    setError(
                        err.message || "Unable to load your profile."
                    );
                }
            } finally {
                if (isMounted) {
                    setLoading(false);
                }
            }
        }

        loadProfile();

        // Cleanup prevents updates after leaving the page.
        return () => {
            isMounted = false;
        };
    }, []);

    // Displays account timestamps in a readable local format.
    function formatDate(dateValue) {
        if (!dateValue) {
            return "Not available";
        }

        const date = new Date(dateValue);

        if (Number.isNaN(date.getTime())) {
            return "Not available";
        }

        return date.toLocaleString();
    }

    if (loading) {
        return (
            <main className="profile-page">
                <p className="profile-status" role="status">
                    Loading your profile...
                </p>
            </main>
        );
    }

    if (error) {
        return (
            <main className="profile-page">
                <section className="profile-card">
                    <h1>My Profile</h1>
                    <p className="profile-error" role="alert">
                        {error}
                    </p>
                    <Link className="profile-back-link" to="/dashboard">
                        Back to Dashboard
                    </Link>
                </section>
            </main>
        );
    }

    if (!profile) {
        return (
            <main className="profile-page">
                <p className="profile-status">
                    Profile information is unavailable.
                </p>
                <Link className="profile-back-link" to="/dashboard">
                    Back to Dashboard
                </Link>
            </main>
        );
    }

    return (
        <main className="profile-page">
            <header className="profile-header">
                <div>
                    <p className="profile-eyebrow">ACCOUNT MANAGEMENT</p>
                    <h1>My Profile</h1>
                    <p className="profile-subtitle">
                        View your personal and account information.
                    </p>
                </div>

                <Link className="profile-back-link" to="/dashboard">
                    Back to Dashboard
                </Link>
            </header>

            <section className="profile-card" aria-labelledby="profile-name">
                <div className="profile-identity">
                    <div className="profile-avatar" aria-hidden="true">
                        {profile.name?.trim()?.charAt(0)?.toUpperCase() || "U"}
                    </div>

                    <div>
                        <h2 id="profile-name">{profile.name}</h2>
                        <p>{profile.email}</p>
                        <span className="profile-role">{profile.role}</span>
                    </div>
                </div>

                <div className="profile-divider" />

                <h3>Account Information</h3>

                <dl className="profile-details">
                    <div className="profile-detail">
                        <dt>Full Name</dt>
                        <dd>{profile.name || "Not available"}</dd>
                    </div>

                    <div className="profile-detail">
                        <dt>Email Address</dt>
                        <dd>{profile.email || "Not available"}</dd>
                    </div>

                    <div className="profile-detail">
                        <dt>Account Role</dt>
                        <dd>{profile.role || "Not available"}</dd>
                    </div>

                    <div className="profile-detail">
                        <dt>Account Created</dt>
                        <dd>{formatDate(profile.createdAt)}</dd>
                    </div>

                    <div className="profile-detail">
                        <dt>Last Updated</dt>
                        <dd>{formatDate(profile.updatedAt)}</dd>
                    </div>
                </dl>

                <p className="profile-note">
                    Your account details are displayed securely.
                    Password information is never shown on this page.
                </p>
            </section>
        </main>
    );
}

export default ProfilePage;
