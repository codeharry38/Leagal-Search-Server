const express = require('express');
//const HttpError = require('../../models/http-error');
const { check } = require('express-validator');
    // User Validation
    module.exports = UserValidator = [
        check('name').isLength({ min: 5 }).withMessage('Name must be at least 5 chars long.'),
        check('username').isLength({ min: 4 }).withMessage('Minimun Char for username is 4.'),
        check('password').isLength({ min: 5 }).withMessage('Password must be at least 5 chars long.'),
        check('email').isEmail().withMessage('Enter Valid Email Address'),
        check('phone').isMobilePhone().withMessage('Enter Valid Phone Number.')
    ];

    //Case Status Validation
    module.exports = NameValidator = [
        check('name').isLength({ min: 2 }).withMessage('Value must have at least 2 chars.'),
    ]

    //Court Status Validation
    module.exports = CourtValidator = [
        check('name').notEmpty().withMessage('Please enter Court Name'),
        check('sName').notEmpty().withMessage('Please enter Short Name'),
    ]

    //Salutation Status Validation
    module.exports = SalutationValidator = [
        check('prefix').notEmpty().withMessage('Please enter Salutation'),
    ]