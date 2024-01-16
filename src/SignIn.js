import React, { useState } from 'react';
import { auth } from './firebase';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, sendEmailVerification } from 'firebase/auth';

function SignIn() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isNewUser, setIsNewUser] = useState(false);
    const [error, setError] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    const handleSignIn = async (event) => {
        event.preventDefault(); // Prevents the default form submission behavior
        try {
            // ... existing try block
        } catch (error) {
            // ... existing catch block
        }
    };

    return (
        <div>
            <h2>{isNewUser ? 'Sign Up' : 'Sign In'}</h2>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            <form onSubmit={handleSignIn}>
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
                        type={showPassword ? 'text' : 'password'}
                        id="password"
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                    />
                    <button type="button" onClick={() => setShowPassword(!showPassword)}>
                        {showPassword ? 'Hide' : 'Show'} Password
                    </button>
                </div>
                <div style={{ marginTop: '10px' }}>
                    <button type="submit">{isNewUser ? 'Register' : 'Sign In'}</button>
                </div>
                <div style={{ marginTop: '10px' }}>
                    <button type="button" onClick={() => setIsNewUser(!isNewUser)}>
                        {isNewUser ? 'Already have an account? Sign In' : 'New user? Register'}
                    </button>
                </div>
                {isNewUser && <p style={{ marginTop: '10px' }}>A verification email will be sent upon registration.</p>}
            </form>
        </div>
    );
}

export default SignIn;