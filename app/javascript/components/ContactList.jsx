import React from 'react'

class ContactList extends React.Component {
    constructor(props) {
        super(props);
        this.state = {contacts: []}

        this.getAllContacts()
    };

    getAllContacts() {
        fetch('http://localhost:3000/contacts.json')
            .then(response => response.json())
            .then(data => this.setState({
                    contacts: data
                })
            )
    }

    handleDelete(contactId) { // Move to Model?
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

    // can either create a new contact or edit an existing one
    handleSubmit = (event) => {
        event.preventDefault()

        // TODO check email validity

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

        // TODO check duplicate email

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
        console.log("CREATE DOM")
        this.setState({
            contacts: this.state.contacts.concat(contact)
        })
        this.refs.contact_form.reset()
    }

    moveContactToForm(contactId) {
        let contact = this.state.contacts.filter(contact => contact.id === contactId)[0]

        console.log(contact)

        this.refs.id_contact.value = contact.id
        this.refs.first_name.value = contact.first_name
        this.refs.last_name.value = contact.last_name
        this.refs.email.value = contact.email
        this.refs.phone.value = contact.phone
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

    // TODO
    editContactDOM(contact) {
        this.deleteContactDOM(contact.id)
        // this.createContactDOM(contact)
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
                    {/*<tr>*/}
                    {/*    <td><input type="text"/></td>*/}
                    {/*    <td>input name</td>*/}
                    {/*    <td>input Email</td>*/}
                    {/*    <td>input Phone</td>*/}
                    {/*</tr>*/}
                    {this.renderTableData()}
                    {/*<button onClick={() => this.handleCreate()}>New</button>*/}
                    </tbody>
                </table>
            </div>
        );
    }

}

export default ContactList
