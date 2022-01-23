const jwt = require('jsonwebtoken');
const User = require('./../models/userModel');
const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');
const {promisify} = require('util');

const signToken = id => {
  return jwt.sign({id: id}, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN
  });
}

exports.signup = async (req, res, next) => {
  // const newUser = await User.create(req.body);
  const newUser = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    passwordConfirm: req.body.passwordConfirm
  });

  const token = signToken(newUser._id);

  res.status(201).json({
    status: 'success',
    token,
    data: {
      user: newUser
    }
  });
};

exports.login = catchAsync(async(req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;

  //Check if email and password exist
  if(!email || !password) {
    return next(new AppError('Please provide email and password!', 400));
  }
  //Check if user exists and password is correct
  const user = await User.findOne({email}).select('+password');

  //this was done this way bcz the 'User' has data other than password (remember we did select: false for password). So to select it back, we use this syntax, '+password'.

  // const correct = await user.correctPassword(password, user.password);

  // if(!user || !correct) {
  //   return next(new AppError('Incorrect email or password', 401));
  // } problem with the above way of writing the code is that if there exists no password, the code will not be able to assign value to correct and it will stop there. so we need that part to go in the if statement.

  if(!user || !(await user.correctPassword(password, user.password))) {
    return next(new AppError('Incorrect email or password', 401));
  }



  //If everything ok, send token to client
  const token = signToken(user._id);
  res.status(200).json({
    status: 'success',
    token
  })
});

exports.protect = catchAsync(async (req, res, next) => {
  //1. Getting token and check if it's there
  let token;
  if(req.authorization && req.headers.authorization.startsWith('Bearer'))
  {
    token = req.headers.authorization.split(' ')[1];
  }
  // console.log(token);

  if(!token) {
    return next(
      new AppError('You are not logged in! Please log in to get access.', 401)
    );
  }
  //2. Verification of token
  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

  //3.Check if user still exists

  //4. Check if user changed password after the token was issued.
})