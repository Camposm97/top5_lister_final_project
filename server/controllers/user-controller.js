const auth = require('../auth')
const User = require('../models/user-model')
const bcrypt = require('bcryptjs')

getLoggedIn = async (req, res) => {
    auth.verify(req, res, async function () {
        try {
            const loggedInUser = await User.findOne({ _id: req.userId });
            console.log('loggedInUser=' + loggedInUser.email)
            return res.status(200).json({
                loggedIn: true,
                user: {
                    firstName: loggedInUser.firstName,
                    lastName: loggedInUser.lastName,
                    email: loggedInUser.email,
                    username: loggedInUser.username
                }
            }).send()
        } catch (err) {
        }
    })
}

loginUser = async (req, res) => {
    try {
        const enteredOwner = req.body.owner
        const enteredPassword = req.body.password

        if (!enteredOwner || !enteredPassword) {
            return res.status(400).json({ errorMessage: "Please enter all required fields." })
        }

        let existingUser = await User.findOne({ email: enteredOwner })
        if (!existingUser) {
            existingUser = await User.findOne({ username: enteredOwner })
            if (!existingUser) {
                return res.status(400).json({ errorMessage: 'Email/Username ' + enteredOwner + ' does not exist!' })
            }
        }
        
        const correctPassword = bcrypt.compare(enteredPassword, existingUser.passwordHash)
        if (correctPassword) {
            console.log("logging in user: " + existingUser.email)
            const token = auth.signToken(existingUser);

            await res.cookie("token", token, {
                httpOnly: true,
                secure: true,
                sameSite: "none"
            }).status(200).json({
                success: true,
                user: {
                    firstName: existingUser.firstName,
                    lastName: existingUser.lastName,
                    email: existingUser.email,
                    username: existingUser.username
                }
            }).send();
        } else {
            return res.status(400)
                .json({
                    errorMessage: 'Password is invalid!'
                })
        }
    } catch (err) {
        res.status(500).send();
    }
}

logoutUser = async (req, res) => {
    try {
        console.log('Logging out user!')
        return res.status(200).json({
            loggedIn: false,
            user: null
        }).send()
    } catch (err) {
        res.status(500).send()
    }
}

registerUser = async (req, res) => {
    try {
        const { firstName, lastName, email, username, password, passwordVerify } = req.body;
        if (!firstName || !lastName || !email || !username || !password || !passwordVerify) {
            return res.status(400).json({ errorMessage: "Please enter all required fields." })
        }
        if (password.length < 8) {
            return res.status(400).json({ errorMessage: "Please enter a password of at least 8 characters." })
        }
        if (password !== passwordVerify) {
            return res.status(400).json({ errorMessage: "Please enter the same password twice." })
        }
        const existingUser1 = await User.findOne({ email: email })
        if (existingUser1) {
            return res.status(400).json({
                success: false,
                errorMessage: "An account with this email address already exists."
            })
        }
        const existingUser2 = await User.findOne({ username: username })
        if (existingUser2) {
            return res.status(400).json({
                success: false,
                errorMessage: "An account with this username already exists."
            })
        }

        const saltRounds = 10;
        const salt = await bcrypt.genSalt(saltRounds);
        const passwordHash = await bcrypt.hash(password, salt);
        const newUser = new User({
            firstName, lastName, email, username, passwordHash
        });
        const savedUser = await newUser.save();

        // LOGIN THE USER
        const token = auth.signToken(savedUser);

        await res.cookie("token", token, {
            httpOnly: true,
            secure: true,
            sameSite: "none"
        }).status(200).json({
            success: true,
            user: {
                firstName: savedUser.firstName,
                lastName: savedUser.lastName,
                email: savedUser.email
            }
        }).send();
    } catch (err) {
        res.status(500).send();
    }
}

module.exports = {
    getLoggedIn,
    loginUser,
    logoutUser,
    registerUser
}