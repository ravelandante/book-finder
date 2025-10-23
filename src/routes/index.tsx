import { createFileRoute } from '@tanstack/react-router';
import dotenv from 'dotenv';

dotenv.config();
const apiKey = process.env.API_KEY;

export const Route = createFileRoute('/')({
  component: App,
})

function App() {
  return <div></div>
}
