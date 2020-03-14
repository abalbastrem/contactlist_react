# Contact list

Do a functional CRUD contact list with ruby on rails + react.
Persist contacts in database and do not allow email duplicates.

Known bugs:
* when updating contact, it shows at the end of contact list
* when editing a contact, if an email is not correctly formatted, prevents further editing
* error message sometimes won't disappear

##setup
1. clone this repository to your system
2. open a terminal in the root and type `rails s`
    * you may need to update yarn. If so, do as instructed in the terminal
4. once the server is up and running, open your browser and go to `http://localhost:3000/contacts`
    * you may need to run a db migration. If the button on screen does not work, go to terminal and run `rails db:migrate`
5. If you want a few contacts in the list already, go to terminal and run `rails db:seed` 

##Development:

###0.7
* CSS added

###0.6
* Fully functional CRUD
* Known bugs: when updating contact, it shows at the end of contact list

##Intended development:

###2.0
* Pagination
* Find contact duplicates
* Integration test

###1.0
* CRUD contacts
* Reactive frontend
    * Desktop
        * full contact details
        * advanced contact search
    * Mobile
        * contact full names
        * single all purpose search bar
* No email duplicates
* Unit tests

##Achievements
* Installed the latest stable Ruby On Rails framework with React using rvm and webpack
* Learned the basics of Ruby On Rails
* Did a quick CRUD using scaffold
* Learned the basics of React

##Areas for improvement
* Practice ruby syntax and structures
* Need to make more use of React's advantages of rendering and a better grasp of its general philosophy
* Find a better way of using styles, as React has lots of options

##Observations
Although there has been a steep initial learning curve, I would be able to replicate a simple CRUD in a much shorter time.