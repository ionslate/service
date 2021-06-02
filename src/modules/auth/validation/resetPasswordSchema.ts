import * as yup from 'yup';

export default yup.object({ password: yup.string().min(8).required() });
