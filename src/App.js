import React from "react";
import { useForm } from "react-hook-form";

export default function App() {
  const { register, handleSubmit, errors, formState } = useForm();
  const onSubmit = data => console.log(data);
  console.log(formState.isSubmitting);
  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <label htmlFor="name">Name</label>
      <input type="text" name="billy" id="name" ref={register({ required: true, maxLength: 30 })} />
      {errors.name && errors.name.type === "required" && <span>This is required</span>}
      {errors.name && errors.name.type === "maxLength" && <span>Max length exceeded</span> }
      <input disabled={formState.isSubmitting} type="submit" value={formState.isSubmitting ? 'Loading' : 'Submit'} />
    </form>
  );
}
