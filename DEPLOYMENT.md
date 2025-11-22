# Deployment Guide for ArrowWeight.com

This guide will help you deploy the Arrow Weight Calculator to Heroku and configure it to work with your ArrowWeight.com domain.

## Prerequisites

1. A Heroku account (free tier works)
2. Heroku CLI installed ([Download here](https://devcenter.heroku.com/articles/heroku-cli))
3. MongoDB Atlas account (free tier works) or existing MongoDB instance
4. GoDaddy account with ArrowWeight.com domain
5. Git installed

## Step 1: Set Up MongoDB Atlas

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) and create a free account
2. Create a new cluster (free tier M0 is fine)
3. Create a database user:
   - Go to "Database Access"
   - Click "Add New Database User"
   - Choose "Password" authentication
   - Create a username and password (save these!)
   - Set privileges to "Atlas admin" or "Read and write to any database"
4. Whitelist IP addresses:
   - Go to "Network Access"
   - Click "Add IP Address"
   - Click "Allow Access from Anywhere" (or add Heroku's IP ranges)
5. Get your connection string:
   - Click "Connect" on your cluster
   - Choose "Connect your application"
   - Copy the connection string (it looks like: `mongodb+srv://username:password@cluster.mongodb.net/dbname?retryWrites=true&w=majority`)
   - Replace `<password>` with your database user password
   - Replace `<dbname>` with `arrow-weight-calculator` (or your preferred database name)

## Step 2: Deploy to Heroku

### 2.1 Login to Heroku

```bash
heroku login
```

### 2.2 Create a Heroku App

```bash
heroku create arrow-weight-calculator
```

Or if you want a specific name:
```bash
heroku create your-app-name
```

### 2.3 Set Environment Variables

Set your MongoDB connection string:
```bash
heroku config:set MONGO_URI="your-mongodb-connection-string-here"
```

Set Node environment:
```bash
heroku config:set NODE_ENV=production
```

Verify your config:
```bash
heroku config
```

### 2.4 Deploy to Heroku

If you haven't already, initialize git and commit your code:
```bash
git init
git add .
git commit -m "Initial commit for Heroku deployment"
```

Add Heroku remote and push:
```bash
heroku git:remote -a arrow-weight-calculator
git push heroku main
```

(If your default branch is `master`, use `git push heroku master`)

### 2.5 Verify Deployment

Open your app:
```bash
heroku open
```

Or visit: `https://your-app-name.herokuapp.com`

## Step 3: Configure Custom Domain (ArrowWeight.com)

### 3.1 Add Domain to Heroku

```bash
heroku domains:add arrowweight.com
heroku domains:add www.arrowweight.com
```

### 3.2 Get Heroku DNS Targets

```bash
heroku domains
```

This will show you the DNS targets (CNAME records) you need to configure in GoDaddy.

### 3.3 Configure DNS in GoDaddy

1. Log in to your GoDaddy account
2. Go to "My Products" → "Domains" → Click "DNS" next to arrowweight.com
3. Add/Edit DNS records:

   **For the root domain (arrowweight.com):**
   - Type: `ALIAS` or `ANAME` (if available) or `CNAME`
   - Name: `@` or leave blank
   - Value: The Heroku DNS target (e.g., `your-app-name.herokuapp.com`)
   - TTL: 600 (or default)

   **For www subdomain (www.arrowweight.com):**
   - Type: `CNAME`
   - Name: `www`
   - Value: The Heroku DNS target (e.g., `your-app-name.herokuapp.com`)
   - TTL: 600 (or default)

   **Note:** If GoDaddy doesn't support ALIAS/ANAME for the root domain, you may need to:
   - Use an A record pointing to Heroku's IP addresses (less reliable)
   - Or use a DNS service like Cloudflare that supports ALIAS records
   - Or use www.arrowweight.com as your primary domain

4. Save the DNS records

### 3.4 Enable SSL on Heroku

Heroku automatically provisions SSL certificates for custom domains. Wait a few minutes after adding the domain, then:

```bash
heroku certs:auto:enable
```

Or manually:
```bash
heroku certs:auto:refresh
```

### 3.5 Verify SSL

After DNS propagation (can take up to 48 hours, usually much faster):
- Visit `https://arrowweight.com`
- Visit `https://www.arrowweight.com`

Both should work and show a valid SSL certificate.

## Step 4: Update Frontend API Configuration (Optional)

If you need the frontend to make API calls to a specific URL, you can set:

```bash
heroku config:set REACT_APP_API_URL=https://arrowweight.com
```

However, since the frontend is served from the same domain in production, relative URLs should work fine (the default configuration).

## Step 5: Verify Everything Works

1. Visit `https://arrowweight.com`
2. Test the calculator functionality
3. Test saving builds (should connect to MongoDB)
4. Test loading saved builds
5. Check browser console for any errors

## Troubleshooting

### App won't start
- Check logs: `heroku logs --tail`
- Verify environment variables: `heroku config`
- Ensure MongoDB connection string is correct

### DNS not working
- DNS propagation can take 24-48 hours
- Verify DNS records in GoDaddy match Heroku's requirements
- Use `nslookup arrowweight.com` to check DNS resolution

### SSL certificate issues
- Wait a few minutes after adding domain
- Run `heroku certs:auto:refresh`
- Check `heroku certs` for certificate status

### MongoDB connection errors
- Verify your MongoDB Atlas IP whitelist includes Heroku's IP ranges
- Check your connection string format
- Verify database user credentials

### Build fails
- Check `heroku logs --tail` during deployment
- Ensure all dependencies are in package.json files
- Verify Node.js version compatibility (check `package.json` engines)

## Updating the Application

To deploy updates:

```bash
git add .
git commit -m "Your update message"
git push heroku main
```

## Useful Heroku Commands

```bash
# View logs
heroku logs --tail

# Open app
heroku open

# Run commands in Heroku environment
heroku run node backend/seeds/seedBuilds.js

# Scale dynos (if needed)
heroku ps:scale web=1

# View app info
heroku info
```

## Cost Considerations

- **Heroku Free Tier:** No longer available. You'll need at least the Eco dyno ($5/month)
- **MongoDB Atlas:** Free tier (M0) is available with 512MB storage
- **Domain:** Already owned on GoDaddy
- **SSL:** Free with Heroku

## Support

If you encounter issues:
1. Check Heroku logs: `heroku logs --tail`
2. Check MongoDB Atlas logs
3. Verify all environment variables are set correctly
4. Ensure DNS has propagated (can take up to 48 hours)

