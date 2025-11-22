# DNS Configuration for ArrowWeight.com

## Domain Information

Your Heroku app domains have been set up. Here's what you need to configure in GoDaddy:

### Root Domain (arrowweight.com)
- **DNS Record Type:** ALIAS or ANAME
- **Name:** `@` (or leave blank)
- **Value:** `serene-jackfruit-uwjdqajsure3n3nho3i0ujoa.herokudns.com`
- **TTL:** 600 (or default)

### WWW Subdomain (www.arrowweight.com)
- **DNS Record Type:** CNAME
- **Name:** `www`
- **Value:** `elliptical-catfish-isg7wlm7rv72sot5bbpkjs1.herokudns.com`
- **TTL:** 600 (or default)

## Steps to Configure in GoDaddy

1. Log in to [GoDaddy](https://www.godaddy.com)
2. Go to "My Products" → Find "arrowweight.com" → Click "DNS" (or "Manage DNS")
3. Configure the records:

   **Option A: If GoDaddy supports ALIAS/ANAME records (recommended)**
   
   For the root domain:
   - Click "Add" to create a new record
   - Type: Select "ALIAS" or "ANAME" (if available)
   - Name: `@` or leave blank
   - Value: `serene-jackfruit-uwjdqajsure3n3nho3i0ujoa.herokudns.com`
   - TTL: 600
   
   For www subdomain:
   - Click "Add" to create a new record
   - Type: CNAME
   - Name: `www`
   - Value: `elliptical-catfish-isg7wlm7rv72sot5bbpkjs1.herokudns.com`
   - TTL: 600

   **Option B: If GoDaddy doesn't support ALIAS/ANAME**
   
   If your GoDaddy account doesn't support ALIAS/ANAME records for the root domain, you have a few options:
   
   1. **Use www.arrowweight.com as primary** (easiest)
      - Only set up the CNAME for www
      - Users will access via www.arrowweight.com
   
   2. **Use a DNS service like Cloudflare** (recommended for better performance)
      - Change nameservers to Cloudflare
      - Configure DNS there (supports ALIAS)
   
   3. **Use A records with Heroku IPs** (not recommended, less reliable)
      - Get Heroku IP ranges (can change)
      - Set A records pointing to those IPs

4. Save the DNS records

## After DNS Configuration

1. **Wait for DNS propagation** (can take 15 minutes to 48 hours, usually much faster)
2. **Enable SSL on Heroku:**
   ```bash
   heroku certs:auto:enable --app arrow-weight-calculator
   ```

3. **Verify DNS propagation:**
   - Check if DNS has propagated: `nslookup arrowweight.com`
   - Or visit: https://www.whatsmydns.net/

4. **Test the domains:**
   - Visit https://arrowweight.com
   - Visit https://www.arrowweight.com

## SSL Certificate

SSL certificates will be automatically provisioned by Heroku after DNS propagation completes. You can check status with:

```bash
heroku certs --app arrow-weight-calculator
```

If certificates aren't provisioned automatically, manually enable:

```bash
heroku certs:auto:enable --app arrow-weight-calculator
```

## Current Status

- ✅ Heroku app deployed and running
- ✅ Domains added to Heroku
- ⏳ DNS configuration pending (you need to do this in GoDaddy)
- ⏳ SSL certificate pending (will auto-provision after DNS)

## Need Help?

If you encounter issues:
1. Check DNS propagation status
2. Verify DNS records are correct in GoDaddy
3. Check Heroku logs: `heroku logs --tail --app arrow-weight-calculator`
4. Verify domain status: `heroku domains --app arrow-weight-calculator`

