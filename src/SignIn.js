import React, { useState } from 'react';
import { auth } from './firebase';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, sendEmailVerification } from 'firebase/auth';

function SignIn() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isNewUser, setIsNewUser] = useState(false);
    const [error, setError] = useState('');

    const handleSignIn = async () => {
        try {
            if (isNewUser) {
                console.log("Attempting to register:", email);
                const userCredential = await createUserWithEmailAndPassword(auth, email, password);
                console.log("Registration successful", userCredential);

                // Send email verification
                sendEmailVerification(userCredential.user);
                setError('');
                alert('Registration successful. Please check your email for verification.');
                setIsNewUser(false); // Switch back to sign-in after successful registration
            } else {
                console.log("Attempting to sign in:", email);
                await signInWithEmailAndPassword(auth, email, password);
                setError('');
            }
        } catch (error) {
            console.error("Authentication error", error);
            if (isNewUser) {
                setError('Registration failed. Please check your email and password.');
            } else {
                setError('Failed to sign in. Please check your email and password.');
            }
        }
    };
    return (
        <div>
            <h2>{isNewUser ? 'Sign Up' : 'Sign In'}</h2>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            <div>
                <label htmlFor="email">Email:</label>
                <input
                    type="email"
                    id="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                />
            </div>
            <div>
                <label htmlFor="password">Password:</label>
                <input
                    type="password"
                    id="password"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                />
            </div>
            <button onClick={handleSignIn}>{isNewUser ? 'Register' : 'Sign In'}</button>
            <button onClick={() => setIsNewUser(!isNewUser)}>
                {isNewUser ? 'Already have an account? Sign In' : 'New user? Register'}
            </button>
        </div>
    );
}

export default SignIn;
