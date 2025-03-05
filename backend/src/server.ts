import app from './app';
import { config } from 'dotenv';

// Load environment variables
config();

const port = process.env.PORT || 5000;

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
}); 