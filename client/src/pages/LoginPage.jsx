import { useState } from "react";
import { loginUser } from "../services/api";
import { useAuth } from "../context/useAuth";

function LoginPage() {
    const { login } = useAuth();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (event) => {
        event.preventDefault();
        setError("");
        setLoading(true);
            try {
                const response = await loginUser(email, password);
                login(response.data);
            } catch(loginError) {
                setError(loginError.message);
            } finally {
                setLoading(false);
            }
            
    };
    return(
        <main>
            <section>
                <h1>ClinicFlow Login</h1>
                <p>
                    Sign in to access the ClinicFlow platform
                </p>
                <form onSubmit={handleSubmit}>
                    <div>
                        <label htmlFor="email">
                            Email
                        </label>
                        <input
                        id="email"
                        type="email"
                        value={email}
                        onChange={(event) => setEmail(event.target.value)}
                        placeholder="Enter your email"
                        required
                        />
                    </div>
                    <div>
                        <label htmlFor="password">
                            Password
                        </label>
                        <input
                        id="password"
                        type="password"
                        value={password}
                        onChange={(event) => setPassword(event.target.value)}
                        placeholder="Enter your password"
                        required
                        />
                    </div>
                    {error && (
                        <p role="alert">
                            {error}
                        </p>
                    )}
                    <button
                    type="submit"
                    disabled={loading}
                    >
                        {loading ? "Logging in..." : "Login"}
                    </button>
                </form>
            </section>
        </main>
    );
}
export default LoginPage;