import { createFileRoute } from '@tanstack/react-router';
import { useForm } from 'react-hook-form';

const apiKey = import.meta.env.VITE_API_KEY;

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
