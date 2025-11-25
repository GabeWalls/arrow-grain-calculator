# Fix DNS Configuration for ArrowWeight.com

## Problem Identified

Your DNS records show:
- ✅ `www.arrowweight.com` CNAME is correctly configured
- ❌ `arrowweight.com` (root domain) is pointing to old AWS IPs instead of Heroku

The root domain has A records pointing to:
- 3.33.251.168
- 15.197.225.128

These need to be removed/changed to point to Heroku.

## Solution Options

### Option 1: Remove Root Domain A Records (Recommended)

Since GoDaddy may not support ALIAS/ANAME for root domain, and you already have www working:

1. **Remove the A records for root domain:**
   - In GoDaddy DNS, find any A records with Name: `@` or blank (for arrowweight.com)
   - Delete or remove these A records
   - This will let www.arrowweight.com work as the primary entry point

2. **Add a redirect** (if you want arrowweight.com to work):
   - Some registrars allow redirecting root domain to www
   - Check GoDaddy settings for "Domain Forwarding" or "Redirects"

### Option 2: Use Cloudflare (Best Long-term Solution)

Cloudflare supports ALIAS records and provides better DNS management:

1. Sign up for free Cloudflare account
2. Add your domain to Cloudflare
3. Change nameservers in GoDaddy to Cloudflare's nameservers
4. Configure DNS in Cloudflare with ALIAS record for root domain

### Option 3: Use Heroku's ALIAS Support with GoDaddy A Records

If GoDaddy doesn't support ALIAS, try updating the A records:

1. Contact GoDaddy support to see if they support ANAME/ALIAS
2. Or try updating the A records to Heroku IPs (not recommended, IPs can change)

## Immediate Fix Steps in GoDaddy

### Step 1: Go to DNS Management
1. Log into GoDaddy
2. Go to My Products → Domains → arrowweight.com → DNS

### Step 2: Remove Old A Records
1. Find A records with Name: `@` or blank (arrowweight.com)
2. Note: There may be two A records with those AWS IP addresses
3. Click Edit or Delete on each one
4. DELETE them or change them

### Step 3: Verify www CNAME
Make sure your www CNAME record shows:
- Type: CNAME
- Name: www
- Value: elliptical-catfish-isg7wlm7rv72sot5bbpkjs1.herokudns.com

### Step 4: Save Changes

After removing the A records:
- www.arrowweight.com should work (CNAME is already correct)
- arrowweight.com won't work until you set up a redirect or use Cloudflare

## After Fixing DNS

1. Wait 15-30 minutes for DNS to propagate
2. Check DNS again:
   ```powershell
   Resolve-DnsName www.arrowweight.com -Type CNAME
   ```

3. Refresh SSL certificates:
   ```bash
   heroku certs:auto:refresh --app arrow-weight-calculator
   ```

4. Test the site:
   - Visit: https://www.arrowweight.com

## What to Do Right Now

**In GoDaddy:**
1. Delete or remove the A records for arrowweight.com (the ones pointing to AWS IPs)
2. Keep the CNAME record for www.arrowweight.com (it's correct)
3. Save changes

**Then wait 15-30 minutes and test:**
- Visit https://www.arrowweight.com

The root domain (arrowweight.com without www) won't work without ALIAS/ANAME support, but www.arrowweight.com should work perfectly after removing those old A records.

