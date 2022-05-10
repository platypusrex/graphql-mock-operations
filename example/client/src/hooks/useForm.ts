import { ChangeEvent, useState } from 'react';

export const useForm = <TFormValues extends Record<string, any>>(initialValues: TFormValues) => {
  const [values, setValues] = useState(initialValues);
  const onChange = (e: ChangeEvent<HTMLInputElement>) => {
    setValues((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };
  const reset = () => {
    setValues(initialValues);
  };
  return { values, onChange, reset };
};
