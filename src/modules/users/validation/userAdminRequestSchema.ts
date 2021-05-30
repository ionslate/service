import * as yup from 'yup';

export default yup.object({
  username: yup
    .string()
    .required()
    .min(4)
    .max(32)
    .matches(/^([a-zA-Z0-9]+(?:_[a-zA-Z0-9]+)*)+$/),
  email: yup.string().email().required(),
  password: yup.string().min(8).nullable(),
  roles: yup
    .array(
      yup
        .mixed()
        .oneOf(['USER', 'USER_ADMIN', 'CONTENT_MANAGER', 'CONTENT_PUBLISHER']),
    )
    .min(1),
});
