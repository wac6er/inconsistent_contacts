import React, { useState, useEffect } from 'react';
import './App.css'; // or the appropriate path to your CSS file;
import logoImage from "./inconsistentLogo.png";
import companies from "./companies (3).json";

import { auth } from './firebase';
import { onAuthStateChanged } from 'firebase/auth';
import SignIn from './SignIn'; // Import SignIn component

import ReactGA from 'react-ga';
ReactGA.initialize('G-VC136BSRFF');
ReactGA.pageview(window.location.pathname + window.location.search);




function SearchBox({ onSearchClick, searchTerm, onSearchTermChange, onExportCSV }) {
    const handleKeyDown = (event) => {
        if (event.key === 'Enter') {
            onSearchClick();
        }
    };

    return (
        <div className="search-box-container">
            <div className="search-field-container">
                <input
                    type="text"
                    value={searchTerm}
                    onChange={onSearchTermChange}
                    onKeyDown={handleKeyDown} // Bind the handleKeyDown function here
                    placeholder="Search..."
                />
                <button onClick={onSearchClick}>Search</button>
            </div>
            <div className="export-button-container">
                <button className="export-button" onClick={onExportCSV}>Export as CSV</button>
            </div>
        </div>
    );
}
function CompanyDetails({ company, onBack }) {
    if (!company) return null;

    return (
        <div>
            <h2>{company.name}</h2>
            <p>Website: <a href={company.website} target="_blank" rel="noopener noreferrer">{company.website}</a></p>
            <h3>Employees</h3>
            <table>
                <thead>
                    <tr>
                        <th>Employee Name</th>
                        <th>Employee Title</th>
                        <th>Employee Email</th>
                        <th>LinkedIn</th>
                    </tr>
                </thead>
                <tbody>
                    {company.employees.map((employee, index) => (
                        <tr key={index}>
                            <td>{employee.name}</td>
                            <td>{employee.title}</td>
                            <td>{employee.email}</td>
                            <td>
                                <a href={employee.linkedIn} target="_blank" rel="noopener noreferrer">LinkedIn</a>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <button onClick={onBack}>Back</button>
        </div>
    );
}


function CompanyList({ companies, onSelect }) {
    return (
        <table>
            <thead>
                <tr>
                    <th>Company Name</th>
                    <th>Website</th>
                    <th>Employees</th>
                </tr>
            </thead>
            <tbody>
                {companies.map((company, index) => (
                    <tr key={index}>
                        <td>{company.name}</td>
                        <td><a href={company.website} target="_blank" rel="noopener noreferrer">{company.website}</a></td>
                        <td class="center-align">

                            <employeeButton onClick={() => onSelect(company)}>Contacts</employeeButton>
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
    );
};


function App() {
    const [user, setUser] = useState(null);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                // User is signed in
                setUser(user);
            } else {
                // User is signed out
                setUser(null);
            }
        });

        return () => unsubscribe(); // Cleanup subscription on unmount
    }, []);
    const [searchTerm, setSearchTerm] = useState('');
    const [filteredCompanies, setFilteredCompanies] = useState([]);
    const [selectedCompany, setSelectedCompany] = useState(null);
    const handleExportCSV = () => {
        const csvRows = [];
        // Headers
        csvRows.push('Company Name, Industry, Website, Employee Name, Employee Title, Employee Email');

        // Data
        filteredCompanies.slice(0, 50).forEach(company => {
            company.employees.forEach(employee => {
                const row = [
                    company.name,
                    company.industry,
                    company.website,
                    employee.name,
                    employee.title,
                    employee.email // Assuming 'email' is a property of each employee
                ];
                csvRows.push(row.join(','));
            });
        });

        // Convert Array to string
        const csvString = csvRows.join('\n');

        // Download it as a file
        const blob = new Blob([csvString], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.setAttribute('hidden', '');
        a.setAttribute('href', url);
        a.setAttribute('download', 'export.csv');
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    };

    const handleSearch = () => {
        const filtered = companies.filter(company =>
            company.name.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setFilteredCompanies(filtered);
    };
    const handleSelectCompany = (company) => {
        setSelectedCompany(company);
    };

    return (
        <div className="content">
            {!user ? (
                <SignIn />
            ) : (
                <>
                    <div className="header">
                        <h1>Inconsistent Contacts</h1>
                        <img src={logoImage} alt="Logo" className="logo" />
                    </div>
                    <SearchBox
                        onSearchClick={handleSearch}
                        searchTerm={searchTerm}
                        onSearchTermChange={(e) => setSearchTerm(e.target.value)}
                        onExportCSV={handleExportCSV}
                    />
                    {!selectedCompany ? (
                        <CompanyList companies={filteredCompanies} onSelect={handleSelectCompany} />
                    ) : (
                        <CompanyDetails company={selectedCompany} onBack={() => setSelectedCompany(null)} />
                    )}
                </>
            )}
        </div>
    );

}



export default App;
