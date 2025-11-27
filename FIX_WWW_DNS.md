# Fix www.arrowweight.com DNS

## The Problem
The CNAME record in GoDaddy has a typo - it's missing the character "8" in the DNS target.

## How to Fix

### Step 1: Edit the www CNAME Record in GoDaddy

1. In GoDaddy, go to your DNS records (where you see the table)
2. Find the **CNAME record** with:
   - Type: CNAME
   - Name: www
   - Current Value: `elliptical-catfish-isg7wlm7rv72sot5bbpkjs1.herokudns.com.`

3. Click the **pencil icon** (edit) next to that CNAME record

4. Change the Value/Data to:
   ```
   elliptical-catfish-isg7w8lm7rv72sot5bbpkjs1.herokudns.com.
   ```
   **Important:** Notice the `8` after `isg7w` - make sure it's `isg7w8lm7rv72sot5bbpkjs1`

5. Click **Save**

### Step 2: Wait for DNS Propagation

- DNS changes take **15 minutes to 1 hour** to propagate
- You can check if it's working by running: `nslookup www.arrowweight.com`

### Step 3: Verify It's Working

After waiting 15-30 minutes:

1. Check DNS resolution:
   ```powershell
   nslookup www.arrowweight.com
   ```
   It should show: `elliptical-catfish-isg7w8lm7rv72sot5bbpkjs1.herokudns.com`

2. Visit the site:
   - Go to: https://www.arrowweight.com
   - It may show SSL errors at first - wait another 15 minutes for Heroku to provision SSL

3. Check SSL status:
   ```bash
   heroku certs:auto:refresh --app arrow-weight-calculator
   ```

## What Happens After You Fix It

1. DNS propagates (15-60 minutes)
2. Heroku detects the correct DNS
3. Heroku automatically provisions SSL certificate (takes ~5-10 minutes)
4. Site becomes accessible at https://www.arrowweight.com

## Current Status

- ✅ Domain added to Heroku
- ❌ CNAME record has typo (needs to be fixed)
- ❌ DNS not resolving correctly
- ❌ SSL certificate not provisioned yet

After fixing the CNAME, everything should work automatically!


