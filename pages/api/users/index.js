import connectDB from '../../../lib/mongodb';
import User from '../../../models/User';
import bcrypt from 'bcryptjs';

export default async function handler(req, res) {
  if (req.method === 'GET') {
    // Haal gebruikers op (admin only)
    try {
      await connectDB();
      const users = await User.find().select('-password');
      res.status(200).json({ success: true, users });
    } catch (error) {
      console.error('Fout bij ophalen gebruikers:', error);
      res.status(500).json({ success: false, message: 'Fout bij ophalen gebruikers' });
    }
  } else if (req.method === 'POST') {
    // Registreer nieuwe gebruiker
    try {
      const { name, email, password } = req.body;

      if (!name || !email || !password) {
        return res.status(400).json({ 
          success: false, 
          message: 'Alle velden zijn verplicht' 
        });
      }

      await connectDB();

      // Controleer of gebruiker al bestaat
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ 
          success: false, 
          message: 'Gebruiker bestaat al' 
        });
      }

      // Hash wachtwoord
      const hashedPassword = await bcrypt.hash(password, 12);

      // Maak nieuwe gebruiker
      const user = new User({
        name,
        email,
        password: hashedPassword,
        role: 'customer'
      });

      await user.save();

      res.status(201).json({ 
        success: true, 
        message: 'Gebruiker succesvol aangemaakt',
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role
        }
      });

    } catch (error) {
      console.error('Fout bij registreren:', error);
      res.status(500).json({ 
        success: false, 
        message: 'Fout bij registreren',
        error: error.message 
      });
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}
