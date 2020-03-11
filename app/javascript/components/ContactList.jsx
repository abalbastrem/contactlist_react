import React from 'react'
import { BrowserRouter, Link } from 'react-router-dom'

class ContactList extends React.Component {
    constructor(props) {
        super(props);

        this.state = {contacts: []}

        fetch('/contacts.json')
            .then(response => response.json())
            .then(data => this.setState({
                    contacts: data
                })
            )
    };

    renderTableData() {
        return this.state.contacts.map((contact) => {
            return (
                <BrowserRouter>
                <tr key={contact.id}>
                    <td>{contact.first_name}</td>
                    <td>{contact.last_name}</td>
                    <td>{contact.email}</td>
                    <td>{contact.phone}</td>
                    {/*<td><Link to="/contacts/show/"{contact.id}>Show</Link></td>*/}
                    {/*<td><Link to="/contacts/edit/{contact.id}">Edit</Link></td>*/}
                    <td>Delete</td>
                </tr>
                </BrowserRouter>
            )
        });
    }

    render() {
        return (<div>
                <h1>Contacts</h1>
                <table>
                    <thead>
                    <tr>
                        <th>First name</th>
                        <th>Last name</th>
                        <th>Email</th>
                        <th>Phone</th>
                        <th colSpan="3"/>
                    </tr>
                    </thead>

                    <tbody>
                    {this.renderTableData()}
                    </tbody>
                </table>
            </div>
        );
    }

}

export default ContactList
