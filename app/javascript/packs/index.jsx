// <%= javascript_pack_tag 'index' %>

import React from 'react';
import ReactDOM from "react-dom";
import ContactList from "../components/ContactList";

document.addEventListener('DOMContentLoaded', () => {
    ReactDOM.render(
        <ContactList />,
        document.body.appendChild(document.createElement('div')),
    )
})