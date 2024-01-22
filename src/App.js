import React, { useState, useEffect } from 'react';
import './App.css'; // or the appropriate path to your CSS file;
import logoImage from "./inconsistentLogo.png";
import companies from "./companies (14).json";

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

function CustomDatasetsTab() {
    return (
        <div>
            <h2>Custom Data Submissions</h2>
            <p>Welcome to our platform, driven by a group of <strong>University of Virginia</strong> students and alumni with a deep passion for <strong>web scraping</strong> and data analysis.</p>

            <p>We're excited to offer:</p>
            <ul>
                <li><strong>1) Comprehensive Lead Generation:</strong> A broad lead gen service for the public at no cost.</li>
                <br />
                <li><strong>2) Specialized Projects:</strong> Customized solutions for clients in various sectors, including energy, marketing, DTC campaigns and more.</li>
                <br />
                <li><strong>3) B2B Target Market Penetration:</strong> Generating business lists with essential contact and LinkedIn information.</li>
            </ul>

            <p>Here are some of our successes:</p>
            <ul>
                <li><strong>Case Study 1:</strong> Identified over 2,000 hot-water intensive businesses without natural gas access in Connecticut for a commercial client, providing 8,000+ employee contacts.</li>
                <br />
                <li><strong>Case Study 2:</strong> For a consumer product campaign, curated a list of 10,000+ residential contacts in affluent neighborhoods, all for a substantial yet cost-effective fee.</li>
                <br />
                <li><strong>Case Study 3:</strong> Compiled a list of 1,000 companies with active ML/AI hiring campaigns on Indeed, including 600 recruiter contacts.</li>
            </ul>

            <p>Whether you're a burgeoning startup or an established corporation, our data can offer you a competitive edge. Interested in learning more? Get in touch at <strong><a href="mailto:wac6er@virginia.edu">wac6er@virginia.edu</a></strong> for tailored data solutions that suit your specific business needs.</p>
        </div>
    );
}


function App() {
    const [user, setUser] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [filteredCompanies, setFilteredCompanies] = useState([]);
    const [selectedCompany, setSelectedCompany] = useState(null);
    const [searchCount, setSearchCount] = useState(0); // New state variable to track search count
    const [currentTab, setCurrentTab] = useState('companies'); // Initialize the currentTab state

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
        csvRows.push('Company Name, Industry Tags, Website, Name, Title, Email');

        const formatCell = (cell) => `"${cell.replace(/"/g, '""')}"`; 

        if (selectedCompany) {
            // Export only the selected company
            selectedCompany.employees.forEach(employee => {
                const row = [
                    formatCell(selectedCompany.name),
                    formatCell(selectedCompany.tag),
                    formatCell(selectedCompany.website),
                    formatCell(employee.name),
                    formatCell(employee.title),
                    formatCell(employee.email)
                ];
                csvRows.push(row.join(','));
            });
        } else {
            // Fallback: export first 50 companies or nothing
            filteredCompanies.slice(0, 50).forEach(company => {
                company.employees.forEach(employee => {
                    const row = [
                        formatCell(company.name),
                        formatCell(company.tag),
                        formatCell(company.website),
                        formatCell(employee.name),
                        formatCell(employee.title),
                        formatCell(employee.email)
                    ];
                    csvRows.push(row.join(','));
                });
            });
        }

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
            .slice(0, 40); // Limit the results to the first 25 companies
        setFilteredCompanies(filtered);
        setSelectedCompany(null); // Reset selected company when a new search is performed
        setSearchCount(prevCount => prevCount + 1); // Increment search count
    };


    const handleSelectCompany = (company) => {
        setSelectedCompany(company);
    };


    return (
        <div className="content">
            <div className="header">
                <div className="tab-buttons">
                    <button onClick={() => setCurrentTab('companies')}>Public Company Search</button>
                    <button onClick={() => setCurrentTab('customDatasets')}>Custom Dataset Submissions</button>
                </div>
                <div className="title-and-logo">
                    <h1>Inconsistent Contacts</h1>
                    <img src={logoImage} alt="Logo" className="logo" />
                </div>
            </div>

            {currentTab === 'companies' && (
                <>
                    {searchCount < 10 || user ? (
                        <>
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
                                </p>
                            )}
                            {!selectedCompany ? (
                                <CompanyList companies={filteredCompanies} onSelect={handleSelectCompany} />
                            ) : (
                                <CompanyDetails company={selectedCompany} onBack={() => setSelectedCompany(null)} />
                            )}
                        </>
                    ) : (
                        <SignIn />
                    )}
                </>
            )}

            {currentTab === 'customDatasets' && <CustomDatasetsTab />}
        </div>
    );
}

export default App;
