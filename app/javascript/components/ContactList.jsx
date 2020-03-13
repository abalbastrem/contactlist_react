import React from 'react'

class ContactList extends React.Component {
    constructor(props) {
        super(props);
        this.state = {contacts: []}

        this.fetchAllContacts()
    };

    fetchAllContacts() {
        fetch('http://localhost:3000/contacts.json')
            .then(response => response.json())
            .then(data => this.setState({
                    contacts: data
                })
            )
    }

    handleDelete(contactId) {
        // TODO alert
        console.log("DELETE " + contactId)

        const apiUrl = "http://localhost:3000/contacts/" + contactId
        const apiOpt = {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json"
            }
        }

        fetch(apiUrl, apiOpt)
            // .then(response => {
            //     console.log('Contact ${contactId} was deleted!');
            //     this.deleteContact(contactId);
            // });
            .then(this.deleteContactDOM(contactId))
    }

    deleteContactDOM(contactId) {
        console.log("DELETE DOM")
        let updatedContacts = this.state.contacts.filter(contact => contact.id !== contactId)
        this.setState({
            contacts: updatedContacts
        })
    }

    // will either create a new contact or edit an existing one
    handleSubmit = (event) => {
        event.preventDefault()

        // TODO check all fields are filled in

        if (!this.isEmailValid(this.refs.email.value)) {
            // TODO exit function and show error
        }

        let inputContact = {
            id: this.refs.id_contact.value,
            first_name: this.refs.first_name.value,
            last_name: this.refs.last_name.value,
            email: this.refs.email.value,
            phone: this.refs.phone.value,
        }

        console.log("SUBMIT")
        console.log(inputContact)

        if (inputContact.id == -1) {
            this.handleCreate(inputContact)
        } else {
            this.handleEdit(inputContact)
        }
    }

    isEmailValid(email) { // TODO move out to helper?

    }

    handleCreate(inputContact) {
        console.log("CREATE")
        const apiUrl = "http://localhost:3000/contacts"
        const apiOpt = {
            method: "POST",
            body: JSON.stringify(inputContact),
            headers: {
                "Content-Type": "application/json"
            }
        }

        if (!this.isEmailUnique(inputContact.email)) {
            // TODO check duplicate email. If so, error and stop
            // TODO also do this at DB level
        }


        fetch(apiUrl, apiOpt)
            .then(response => {
                return response.json()
            })
            .then(insertedContact => {
                console.log("INSERTED CONTACT")
                console.log(insertedContact)
                this.createContactDOM(insertedContact)
            })
    }

    createContactDOM(contact) {
        this.setState({
            contacts: this.state.contacts.concat(contact)
        })
        this.refs.contact_form.reset()
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

    // TODO BUG puts edited contact at the very end of contactlist
    editContactDOM(updatedContact) {
        // gets rest of contacts
        let contacts = this.state.contacts.filter(contact => contact.id != updatedContact.id)
        // pushes updated contact in
        contacts.push(updatedContact)
        console.log("NEW CONTACTS")
        console.log(contacts)
        // updates DOM
        this.setState({
            contacts: contacts
        })
        this.refs.contact_form.reset()
    }

    renderTableData() {
        return this.state.contacts.map((contact) => {
            return (
                <tr key={contact.id}>
                    <td>{contact.first_name}</td>
                    <td>{contact.last_name}</td>
                    <td>{contact.email}</td>
                    <td>{contact.phone}</td>
                    <button onClick={() => this.handleDelete(contact.id)}>Delete</button>
                    <button onClick={() => this.moveContactToForm(contact.id)}>Edit</button>
                </tr>
            )
        });
    }

    render() {
        return (<div>
                <h1>React Contacts</h1>
                <div id="contact_form_div">
                    <form ref="contact_form">
                        <input type="hidden" id="contactId" value="-1" name="id_contact" ref="id_contact"/>
                        <input type="text" placeholder="first name" name="first_name" ref="first_name"/>
                        <input type="text" placeholder="last name" name="last_name" ref="last_name"/>
                        <input type="text" placeholder="email" name="email" ref="email"/>
                        <input type="text" placeholder="phone" name="phone" ref="phone"/>
                        <button onClick={(event) => this.handleSubmit(event)}>submit</button>
                    </form>
                </div>
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
