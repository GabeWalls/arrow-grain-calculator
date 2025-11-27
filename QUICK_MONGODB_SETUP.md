# Quick MongoDB Setup for Heroku

## Current Status
❌ **MONGO_URI is NOT set on Heroku** - This is why signup/login fails!

## Quick Setup Steps

### Option 1: If you already have MongoDB Atlas

1. **Get your connection string:**
   - Go to [MongoDB Atlas](https://cloud.mongodb.com)
   - Click "Database" → "Connect" on your cluster
   - Choose "Connect your application"
   - Copy the connection string

2. **Configure Network Access:**
   - Go to "Network Access" in MongoDB Atlas
   - Click "Add IP Address"
   - Click "Allow Access from Anywhere" (adds `0.0.0.0/0`)
   - This allows Heroku to connect

3. **Send me your connection string** and I'll set it up on Heroku

### Option 2: Create New MongoDB Atlas Cluster (5 minutes)

1. **Sign up for MongoDB Atlas** (free tier):
   - Go to: https://www.mongodb.com/cloud/atlas/register
   - Create free account

2. **Create a free cluster:**
   - Choose "FREE" (M0) tier
   - Select any cloud provider/region
   - Click "Create"

3. **Set up database user:**
   - Go to "Database Access"
   - Click "Add New Database User"
   - Choose "Password" authentication
   - Username: `arrowweight-user` (or any name)
   - Password: Create a strong password (save it!)
   - Set privileges to "Atlas admin" or "Read and write to any database"
   - Click "Add User"

4. **Configure Network Access:**
   - Go to "Network Access"
   - Click "Add IP Address"
   - Click "Allow Access from Anywhere" button
   - This adds `0.0.0.0/0` to allow Heroku connections
   - Click "Confirm"

5. **Get connection string:**
   - Go to "Database" → Click "Connect" on your cluster
   - Choose "Connect your application"
   - Copy the connection string (looks like):
     ```
     mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
     ```

6. **Format the connection string:**
   - Replace `<username>` with your database username
   - Replace `<password>` with your database password
   - Add database name before `?`: `...mongodb.net/arrowweight?retryWrites...`
   
   Example:
   ```
   mongodb+srv://arrowweight-user:MyPassword123@cluster0.abc123.mongodb.net/arrowweight?retryWrites=true&w=majority
   ```

7. **Send me the formatted connection string** and I'll set it on Heroku!

## What I'll Do Once You Provide the Connection String

I'll run:
```bash
heroku config:set MONGO_URI="your-connection-string-here" --app arrow-weight-calculator
heroku restart --app arrow-weight-calculator
```

Then authentication will work! 🎉

## Important Notes

- **Free tier is fine** - MongoDB Atlas M0 free tier works perfectly
- **Network access** - Must allow `0.0.0.0/0` for Heroku to connect
- **Password encoding** - If password has special characters, they may need URL encoding
- **Database name** - I'll use `arrowweight` as the database name


