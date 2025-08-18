# TikStake

**Secure Crypto Time-Lock Platform**

TikStake helps you lock your cryptocurrency for specified periods (6 months to 20 years) to avoid impulsive selling and build long-term wealth. This custodial platform secures Bitcoin, Ethereum, Solana, and other cryptocurrencies using multi-signature cold storage.

## 🚀 Features

- **Ultra Secure**: Multi-signature cold storage with no lending or rehypothecation
- **Long-Term Focus**: Lock periods from 6 months up to 20 years
- **Manual Withdrawals**: Every withdrawal is manually reviewed for security
- **Next of Kin Option**: Add beneficiaries for emergency access
- **Transparent**: No yield promises, no hidden fees - just secure HODLing

## 🔧 Setup Instructions

### Prerequisites

- Modern web browser with JavaScript enabled
- Supabase account and project (for production deployment)

### Development Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/profbruuno/TikStake.git
   cd TikStake
   ```

2. **Serve the files locally**
   ```bash
   # Using Python
   python3 -m http.server 8000
   
   # Using Node.js
   npx serve .
   
   # Using PHP
   php -S localhost:8000
   ```

3. **Open in browser**
   Navigate to `http://localhost:8000`

### Production Deployment

#### GitHub Pages (Recommended)
1. Push your code to a GitHub repository
2. Go to Settings → Pages
3. Select source branch (usually `main`)
4. Your site will be available at `https://yourusername.github.io/repository-name`

#### Other Static Hosting
The project works with any static hosting service (Netlify, Vercel, AWS S3, etc.)

## 🗄️ Supabase Backend Integration

### Database Setup

1. **Create a Supabase project** at [supabase.com](https://supabase.com)

2. **Create the locks table**
   ```sql
   CREATE TABLE locks (
     id BIGSERIAL PRIMARY KEY,
     user_id TEXT NOT NULL,
     crypto TEXT NOT NULL,
     icon TEXT NOT NULL,
     amount NUMERIC NOT NULL,
     duration TEXT NOT NULL,
     start TEXT NOT NULL,
     end TEXT NOT NULL,
     gain NUMERIC DEFAULT 0,
     loss NUMERIC DEFAULT 0,
     withdrawal TEXT DEFAULT 'Locked',
     timesLocked INTEGER DEFAULT 1,
     created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
   );
   ```

3. **Configure Row Level Security (RLS)** - Optional but recommended
   ```sql
   -- Enable RLS
   ALTER TABLE locks ENABLE ROW LEVEL SECURITY;
   
   -- Allow public access for demo (disable for production with auth)
   CREATE POLICY "Public access" ON locks FOR ALL USING (true);
   ```

### Configuration

Update the credentials in `supabase.js`:

```javascript
const SUPABASE_URL = 'your_supabase_project_url';
const SUPABASE_ANON_KEY = 'your_supabase_anon_key';
```

**Current Demo Configuration:**
- URL: `https://lxslwibjxarfbshleiyd.supabase.co`
- Anon Key: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoiYW5vbiIsImlhdCI6MTY4ODIyNzA2NCwiZXhwIjo0MDA0Mzg0NjQ0fQ.EJ5lq6nKq3SIR1X8R4mV2Trt2a0zCn3fH8u3xEwF0eI`

### Environment Variables (Production)

For production, use environment variables:

1. **Create `.env` file** (never commit this):
   ```env
   SUPABASE_URL=your_supabase_project_url
   SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

2. **Update supabase.js**:
   ```javascript
   const SUPABASE_URL = process.env.SUPABASE_URL || 'fallback_url';
   const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY || 'fallback_key';
   ```

## 🧪 Testing the Integration

1. **Check Supabase connection**
   - Open browser console
   - Look for "Supabase client initialized successfully"
   - If you see "Supabase library not available", check troubleshooting below

2. **Test user dashboard**
   - Click "User Area" in navigation
   - Register/login with any email/password
   - Dashboard should show data source indicator

3. **Verify data persistence**
   - Create test locks in the dashboard
   - Refresh the page - data should persist if Supabase is connected

## 🔍 Troubleshooting

### Common Issues

#### Supabase CDN Blocked
**Problem**: Console shows "Failed to load resource" for Supabase CDN
**Solutions**:
- Disable ad blockers/privacy extensions
- Try different browser
- Use local Supabase client instead of CDN
- Check if corporate firewall is blocking CDN

#### Connection Errors
**Problem**: "Failed to initialize Supabase client"
**Solutions**:
- Verify Supabase URL and anon key are correct
- Check if Supabase project is paused/deleted
- Ensure project has public access or proper RLS policies

#### CORS Issues
**Problem**: Cross-origin errors when accessing Supabase
**Solutions**:
- Add your domain to Supabase → Settings → API → CORS origins
- For localhost: add `http://localhost:3000`, `http://localhost:8000`
- For GitHub Pages: add `https://yourusername.github.io`

#### Database Errors
**Problem**: "relation 'locks' does not exist"
**Solutions**:
- Run the CREATE TABLE SQL command in Supabase SQL editor
- Verify table name matches exactly (`locks`)
- Check if you're connected to the right database

#### RLS Policy Issues
**Problem**: Can't read/write data despite connection
**Solutions**:
- Ensure RLS policies allow your operations
- For testing, temporarily disable RLS: `ALTER TABLE locks DISABLE ROW LEVEL SECURITY;`
- For auth setup, configure proper policies based on `auth.uid()`

### Fallback Behavior

The application gracefully handles Supabase unavailability:
- **Demo Mode**: Uses localStorage for data persistence
- **Visual Indicators**: Shows whether data comes from Supabase or localStorage
- **No Errors**: Continues functioning even without backend connection

### Debug Mode

Add this to browser console for debugging:
```javascript
// Check Supabase status
console.log('Supabase ready:', isSupabaseReady());

// Test connection
fetchUserLocks('test@example.com').then(console.log);
```

## 🔒 Security Considerations

### Production Checklist

- [ ] Enable Row Level Security (RLS) on all tables
- [ ] Implement proper authentication (Supabase Auth)
- [ ] Use environment variables for sensitive configuration
- [ ] Configure CORS origins properly
- [ ] Set up rate limiting in Supabase dashboard
- [ ] Never expose service role key in client-side code
- [ ] Regular security audits of RLS policies

### Data Privacy

- User emails are used as identifiers (consider hashing for production)
- Lock data includes personal financial information
- Implement data retention policies as needed
- Consider GDPR/CCPA compliance for international users

## 📖 Additional Resources

- [Supabase Documentation](https://supabase.com/docs)
- [Row Level Security Guide](https://supabase.com/docs/guides/auth/row-level-security)
- [GitHub Pages Deployment](https://docs.github.com/en/pages)

## 🆘 Support

For technical issues or feature requests:
- Email: spsys17@gmail.com
- Create an issue in this repository

---

**Note**: This is a demonstration project. For production use, implement proper authentication, security measures, and legal compliance.
