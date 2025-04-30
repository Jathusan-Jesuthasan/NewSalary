const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const employeeRoutes = require('./routes/employeeRoutes');
const app = express();


app.use(cors());
app.use(express.json()); 
mongoose.connect('mongodb+srv://jesuthasanjathusan:1234@cluster0.tol3l.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})

  .then(() => console.log('MongoDB connected'))
  .catch((error) => console.log('Error connecting to MongoDB:', error));

app.use('/api', employeeRoutes);

const port = 5000;
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
