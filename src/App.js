import React, { useState, useEffect } from 'react';
import './App.css'; // or the appropriate path to your CSS file;
import logoImage from "./inconsistentLogo.png";
import companies from "./companies (12).json";

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
            <back-button onClick={onBack}>Back</back-button>
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
            <back-button onClick={onBack}>Back</back-button>
        </div>
    );
}


function CompanyList({ companies, onSelect }) {
    return (
        <table>
            <thead>
                <tr>
                    <th>Company Name</th>
                    <th>Industry Tags</th>
                    <th>Website</th>
                    <th>Employees</th>
                </tr>
            </thead>
            <tbody>
                {companies.map((company, index) => (
                    <tr key={index}>
                        <td>{company.name}</td>
                        <td>{company.tag}</td>
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
    const [searchTerm, setSearchTerm] = useState('');
    const [filteredCompanies, setFilteredCompanies] = useState([]);
    const [selectedCompany, setSelectedCompany] = useState(null);
    const [searchCount, setSearchCount] = useState(0); // New state variable to track search count

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

    const handleExportCSV = () => {
        const csvRows = [];

        csvRows.push('Company Name, Industry, Website, Employee Name, Employee Title, Employee Email');

        filteredCompanies.slice(0, 50).forEach(company => {
            company.employees.forEach(employee => {
                const row = [
                    company.name,
                    company.tag,
                    company.website,
                    employee.name,
                    employee.title,
                    employee.email 
                ];
                csvRows.push(row.join(','));
            });
        });


        const csvString = csvRows.join('\n');
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
        const filtered = companies
            .filter(company =>
                company.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                (company.tag && company.tag.toLowerCase().includes(searchTerm.toLowerCase()))
            )
            .slice(0, 25); // Limit the results to the first 25 companies
        setFilteredCompanies(filtered);
        setSelectedCompany(null); // Reset selected company when a new search is performed
        setSearchCount(prevCount => prevCount + 1); // Increment search count
    };


    const handleSelectCompany = (company) => {
        setSelectedCompany(company);
    };

    return (
        <div className="content">
            {searchCount < 10 || user ? (
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
                    {filteredCompanies.length === 0 && !selectedCompany && (
                        <p style={{ marginTop: '20px', fontSize: '0.9rem' }}>
                            Welcome to our <b>open-source web scraping initiative</b>! Our goal is to break down the <b>barriers surrounding B2B communications</b> by offering a <b>free, reliable source</b> for lead generation.
                            <br />
                            <br />
                            By leveraging the power of web scraping, we aim to make <b>email and LinkedIn communication</b> more accessible and efficient, especially for small businesses and entrepreneurs.
                            <br />
                            <br />
                            <b>Your involvement is vital to our mission.</b>
                            <br />
                            <br />
                            If you wish to <b>contribute</b> to the site's data management or have suggestions, please reach out to us at <b><a href="mailto:wac6er@virginia.edu">wac6er@virginia.edu</a></b>. To support our project further, consider visiting our <b>GoFundMe</b> page at <a href="https://gofund.me/5286faf4" target="_blank">gofundme/inconsistentContacts</a>. Thank you for joining us in this venture!
                        </p>                    )}
                    {!selectedCompany ? (
                        <CompanyList companies={filteredCompanies} onSelect={handleSelectCompany} />
                    ) : (
                        <CompanyDetails company={selectedCompany} onBack={() => setSelectedCompany(null)} />
                    )}
                </>
            ) : (
                <SignIn />
            )}
        </div>
    );
}

export default App;
