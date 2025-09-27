import * as Yup from 'yup';

export const profileInitialValues = {
  fullName: '',
  dateOfBirth: '',
  gender: '',
  bio: '',
};

export const profileValidationSchema = Yup.object().shape({
  fullName: Yup.string().min(2, 'Full name must be at least 2 characters').required('Full name is required'),

  dateOfBirth: Yup.string().required('Date of birth is required'),

  gender: Yup.string()
    .oneOf(['Male', 'Female', 'Other'], 'Please select a valid gender')
    .required('Gender is required'),

  bio: Yup.string().required('Bio is required'),
});
