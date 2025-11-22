# Quick Deployment Guide for ArrowWeight.com

This guide will get your Arrow Weight Calculator deployed to ArrowWeight.com via Heroku.

## Step 1: Login to Heroku

Run this command and follow the prompts:
```bash
heroku login
```

## Step 2: Create Heroku App

Run this command to create a new Heroku app:
```bash
heroku create arrow-weight-calculator
```

(You can change `arrow-weight-calculator` to any name you prefer, as long as it's available)

## Step 3: Set Up MongoDB Atlas

Since you need a database for saving builds:

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) and sign up/login
2. Create a new cluster (free tier M0 is fine)
3. Create a database user:
   - Go to "Database Access" → "Add New Database User"
   - Create username and password (save these!)
   - Set privileges to "Atlas admin"
4. Whitelist IP addresses:
   - Go to "Network Access" → "Add IP Address"
   - Click "Allow Access from Anywhere" (or add 0.0.0.0/0)
5. Get connection string:
   - Click "Connect" on your cluster → "Connect your application"
   - Copy the connection string
   - Replace `<password>` with your database user password
   - Replace `<dbname>` with `arrow-weight-calculator` (or your preferred name)

## Step 4: Configure Heroku Environment Variables

Set your MongoDB connection string (replace with your actual connection string):
```bash
heroku config:set MONGO_URI="mongodb+srv://username:password@cluster.mongodb.net/arrow-weight-calculator?retryWrites=true&w=majority"
```

Set Node environment:
```bash
heroku config:set NODE_ENV=production
```

Set API URL (empty string for relative URLs):
```bash
heroku config:set REACT_APP_API_URL=""
```

## Step 5: Deploy to Heroku

If you haven't committed your latest changes:
```bash
git add .
git commit -m "Prepare for Heroku deployment"
```

Deploy:
```bash
git push heroku main
```

(If your default branch is `master`, use `git push heroku master`)

## Step 6: Add Custom Domain

Add your domain to Heroku:
```bash
heroku domains:add arrowweight.com
heroku domains:add www.arrowweight.com
```

Get DNS targets:
```bash
heroku domains
```

This will show you the DNS target (something like: `arrow-weight-calculator.herokuapp.com`)

## Step 7: Configure DNS in GoDaddy

1. Log in to [GoDaddy](https://www.godaddy.com)
2. Go to "My Products" → Find "arrowweight.com" → Click "DNS"
3. Configure DNS records:

   **For www subdomain:**
   - Type: `CNAME`
   - Name: `www`
   - Value: Your Heroku DNS target (e.g., `arrow-weight-calculator.herokuapp.com`)
   - TTL: 600

   **For root domain (arrowweight.com):**
   - Option A (if GoDaddy supports ALIAS/ANAME):
     - Type: `ALIAS` or `ANAME`
     - Name: `@` or leave blank
     - Value: Your Heroku DNS target
   - Option B (if only CNAME/A records available):
     - Use A records pointing to Heroku IPs (not recommended, use Option C instead)
   - Option C (Best approach if no ALIAS):
     - Use www.arrowweight.com as primary domain
     - Or use a DNS service like Cloudflare that supports ALIAS

4. Save the DNS records

## Step 8: Enable SSL on Heroku

Wait a few minutes after adding the domain, then enable SSL:
```bash
heroku certs:auto:enable
```

Or manually refresh:
```bash
heroku certs:auto:refresh
```

## Step 9: Verify Deployment

1. Visit your Heroku app: `https://arrow-weight-calculator.herokuapp.com`
2. Test calculator functionality
3. Test saving builds
4. After DNS propagates (can take 24-48 hours), visit `https://arrowweight.com`

## Troubleshooting

### View logs:
```bash
heroku logs --tail
```

### Check environment variables:
```bash
heroku config
```

### Restart the app:
```bash
heroku restart
```

### Check domain status:
```bash
heroku domains
heroku certs
```

## Next Steps After Deployment

Once deployed, you'll be able to:
- Access your app at https://arrowweight.com
- Save builds to MongoDB
- Load saved builds
- All features will work in production

## Updating the App

To deploy updates in the future:
```bash
git add .
git commit -m "Your update message"
git push heroku main
```

