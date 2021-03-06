import React from 'react'

class ContactList extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            contacts: [],
            msg: ""
        }
    };

    componentDidMount() {
        this.fetchAllContacts()
        this.sortStateContacts()
    }

    fetchAllContacts() {
        fetch('http://localhost:3000/contacts.json')
            .then(response => response.json())
            .then(fetchedContacts => this.sortAndLoadContactsToState(fetchedContacts))
    }

    sortAndLoadContactsToState(contacts) {
        contacts.sort(function (a, b) {
            if (a.first_name > b.first_name) {
                return 1
            }
            if (a.first_name < b.first_name) {
                return -1
            }
            return 0
        })
        this.setState({
            contacts: contacts
        })
    }

    sortStateContacts() {
        let contacts = this.state.contacts
        contacts.sort(function (a, b) {
            if (a.first_name > b.first_name) {
                return 1
            }
            if (a.first_name < b.first_name) {
                return -1
            }
            return 0
        })
        this.setState({
            contacts: contacts
        })
    }

    handleDelete(contactId) {
        const apiUrl = "http://localhost:3000/contacts/" + contactId
        const apiOpt = {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json"
            }
        }

        fetch(apiUrl, apiOpt)
            .then(this.deleteContactDOM(contactId))
    }

    deleteContactDOM(contactId) {
        let updatedContacts = this.state.contacts.filter(contact => contact.id !== contactId)
        this.setState({
            contacts: updatedContacts
        })
        this.message("contact deleted")
    }

    // will either create a new contact or edit an existing one
    handleSubmit = (event) => {
        event.preventDefault()

        // TODO toggle sumbit button
        if (!this.isFormFilledUp()) {
            this.message("all fields must be filled up")
            return
        }

        if (!this.isEmailValid(this.refs.email.value)) {
            this.message("email is not correctly formatted")
            return
        }

        let inputContact = {
            id: this.refs.id_contact.value,
            first_name: this.refs.first_name.value,
            last_name: this.refs.last_name.value,
            email: this.refs.email.value,
            phone: this.refs.phone.value,
        }

        if (inputContact.id.length == "" || inputContact.id.length == 0) {
            this.handleCreate(inputContact)
        } else {
            this.handleEdit(inputContact)
        }
    }

    isFormFilledUp() { // TODO move to helper
        if (!this.refs.first_name.value || this.refs.first_name.value.trim().length === 0) {
            this.message("all fields must be filled up")
            return false
        }
        if (!this.refs.last_name.value || this.refs.last_name.value.trim().length === 0) {
            this.message("all fields must be filled up")
            return false
        }
        if (!this.refs.email.value || this.refs.email.value.trim().length === 0) {
            this.message("all fields must be filled up")
            return false
        }
        if (!this.refs.phone.value || this.refs.phone.value.trim().length === 0) {

            return false
        }

        return true
    }

    isEmailValid(email) { // TODO move out to helper?
        let emailRegex = /^([a-zA-Z0-9_\-\.]+)@([a-zA-Z0-9_\-\.]+)\.([a-zA-Z]{2,5})$/
        if (!emailRegex.test(email)) {
            return false
        }

        return true
    }

    handleCreate(inputContact) {
        const apiUrl = "http://localhost:3000/contacts"
        const apiOpt = {
            method: "POST",
            body: JSON.stringify(inputContact),
            headers: {
                "Content-Type": "application/json"
            }
        }

        if (!this.isEmailUnique(inputContact.email)) {
            this.message("email must be unique")
            return
            // TODO also do this at DB level
        }


        fetch(apiUrl, apiOpt)
            .then(response => {
                return response.json()
            })
            .then(insertedContact => {
                this.createContactDOM(insertedContact)
            })
    }

    isEmailUnique(email) { // TODO move out to helper?
        let duplicated = this.state.contacts.filter(contact => contact.email === email)
        if (duplicated.length > 0) {
            return false
        }

        return true
    }

    message(msg) { // TODO move out to helper
        this.setState({
            msg: msg
        })

        setTimeout(function () {
            this.setState({
                msg: ""
            })
        }.bind(this), 3000)

    }

    createContactDOM(contact) {
        this.setState({
            contacts: this.state.contacts.concat(contact)
        })
        this.refs.contact_form.reset()
        this.refs.id_contact.value = ""
        this.message("contact created")
        this.sortStateContacts()
    }

    moveContactToForm(contactId) {
        let contact = this.state.contacts.filter(contact => contact.id === contactId)[0]

        this.refs.id_contact.value = contact.id
        this.refs.first_name.value = contact.first_name
        this.refs.last_name.value = contact.last_name
        this.refs.email.value = contact.email
        this.refs.phone.value = contact.phone

        this.refs.first_name.focus()
    }

    clearForm(event) {
        event.preventDefault()
        this.refs.contact_form.reset()
        this.refs.id_contact.value = ""
    }

    handleEdit(inputContact) {
        const apiUrl = "http://localhost:3000/contacts/" + inputContact.id
        const apiOpt = {
            method: "PUT",
            body: JSON.stringify(inputContact),
            headers: {
                "Content-Type": "application/json"
            }
        }

        fetch(apiUrl, apiOpt)
            .then(this.editContactDOM(inputContact))
    }

    editContactDOM(updatedContact) {
        // gets rest of contacts
        let contacts = this.state.contacts.filter(contact => contact.id != updatedContact.id)
        // pushes updated contact in
        contacts.push(updatedContact)
        // updates DOM
        this.sortAndLoadContactsToState(contacts)
        this.refs.contact_form.reset()
        this.refs.id_contact.value = ""
        this.message("contact edited")
    }

    renderForm() {
        return (
            <div>
                <form ref="contact_form">
                    <input type="hidden" id="contactId" name="id_contact" ref="id_contact"/>
                    <input type="text" placeholder="first name" name="first_name" ref="first_name"/>
                    <input type="text" placeholder="last name" name="last_name" ref="last_name"/>
                    <input type="text" placeholder="email" name="email" ref="email"/>
                    <input type="text" placeholder="phone" name="phone" ref="phone"/>
                    <button id="submit-form" onClick={(event) => this.handleSubmit(event)}>submit</button>
                    <button onClick={(event) => this.clearForm(event)}>clear</button>
                </form>
            </div>
        )
    }

    renderTableData() {
        return this.state.contacts.map((contact) => {
            return (
                <tr key={contact.id}>
                    <td>{contact.first_name}</td>
                    <td>{contact.last_name}</td>
                    <td>{contact.email}</td>
                    <td>{contact.phone}</td>
                    <button id="edit-button" onClick={() => this.moveContactToForm(contact.id)}>Edit</button>
                    <button id="delete-button" onClick={(e) => {
                        if (window.confirm('Are you sure you wish to delete this contact?')) this.handleDelete(contact.id)
                    }}>
                        Delete
                    </button>

                </tr>
            )
        });
    }

    render() {
        return (<div>
                <h1>React Contacts v0.9</h1>
                <h2>by Albert Balbastre</h2>
                {this.renderForm()}
                <div id="error_div" ref="error_div">{this.state.msg}</div>
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
