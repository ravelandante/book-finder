import { createFileRoute } from '@tanstack/react-router';
import dotenv from 'dotenv';
import { useForm } from 'react-hook-form';

dotenv.config();
const apiKey = process.env.API_KEY;

export const Route = createFileRoute('/')({
  component: App,
});

type Inputs = {
  bookName: string;
};

function App() {

  const { register, handleSubmit } = useForm<Inputs>();

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <input {...register('bookName', { required: true })} />

      <input type="submit" />
    </form>
  );
}
