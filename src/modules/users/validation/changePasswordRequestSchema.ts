import * as yup from 'yup';

export default yup.object({
  oldPassword: yup.string().required(),
  newPassword: yup.string().min(8).required(),
});
