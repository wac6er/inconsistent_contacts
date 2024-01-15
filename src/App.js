import React, { useState, useEffect } from 'react';
import './App.css'; // or the appropriate path to your CSS file;
import logoImage from "./inconsistentLogo.png"


const companies = [
    { name: 'Company A', industry: 'IA', website: 'WA', employees: [{ name: 'Employee A1', title: 'Title A1', linkedIn: 'LinkedIn A1' }] },
    { name: 'Company B', industry: 'IB', website: 'WB', employees: [{ name: 'Employee B1', title: 'Title B1', linkedIn: 'LinkedIn B1' }] },
    { name: 'Company C', industry: 'IC', website: 'WC', employees: [{ name: 'Employee C1', title: 'Title C1', linkedIn: 'LinkedIn C1' }] },
];
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

                            <employeeButton onClick={() => onSelect(company)}>View Employees</employeeButton>
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
    );
};


function App() {
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
      <div className="header">
        <h1>Inconsistent Contacts</h1>
                <img src={logoImage} alt="Logo" className="logo" />
      </div>
            <SearchBox
                onSearchClick={handleSearch}
                searchTerm={searchTerm}
                onSearchTermChange={(e) => setSearchTerm(e.target.value)}
                onExportCSV={handleExportCSV} // Passing the function as a prop
            />
            {!selectedCompany ? (
                <CompanyList companies={filteredCompanies} onSelect={handleSelectCompany} />
            ) : (
                <CompanyDetails company={selectedCompany} onBack={() => setSelectedCompany(null)} />
            )}


      {/* Rest of your component */}
    </div>
    );
}



export default App;
