import * as Yup from 'yup';

export const signupInitialValues = {
  email: '',
  password: '',
  confirmPassword: '',
  termsAccepted: false,
};

export const signupValidationSchema = Yup.object().shape({
  email: Yup.string().email('Invalid email').required('Email is required'),

  password: Yup.string().min(6, 'Password must be at least 6 characters').required('Password is required'),

  confirmPassword: Yup.string()
    .oneOf([Yup.ref('password')], 'Passwords must match')
    .required('Please confirm your password'),

  termsAccepted: Yup.boolean().oneOf([true], 'Please agree to the Terms and Conditions before continuing'),
});
