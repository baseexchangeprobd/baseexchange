# GitHub Pages Deployment Setup

## 📋 Prerequisites

- Repository hosted on GitHub
- Custom domain `baseexchangepro.xyz` registered

---

## 🚀 Step 1: Enable GitHub Pages

1. Go to your GitHub repo → **Settings** → **Pages**
2. Under "Build and deployment":
   - **Source**: Select `GitHub Actions`
   - This will use the `.github/workflows/static.yml` workflow
3. Click **Save**

---

## 🌐 Step 2: Configure Custom Domain in GitHub

1. In Settings → Pages, scroll to "Custom domain"
2. Enter: `baseexchangepro.xyz`
3. Click **Save**
   - GitHub will automatically verify ownership
   - GitHub will create/update the `CNAME` file in your repo
4. Wait for HTTPS certificate (usually 24 hours)

---

## 📡 Step 3: Point Your Domain to GitHub Pages

Update your domain registrar's DNS settings to point to GitHub Pages:

### Option A: CNAME Record (Recommended for subdomains)
If using `baseexchangepro.xyz` as main domain with DNS CNAME:
```
Type: CNAME
Name: @ (or the subdomain)
Value: username.github.io
TTL: 3600
```

### Option B: A Records (For apex domain)
If your registrar doesn't support CNAME for apex domains:
```
Type: A Record
Name: @
Values:
  - 185.199.108.153
  - 185.199.109.153
  - 185.199.110.153
  - 185.199.111.153
TTL: 3600
```

### Option C: Use GitHub's Nameservers
Some registrars offer:
```
Nameservers:
- ns-1234.github.io
- ns-5678.github.io
```
(GitHub will provide exact nameservers)

---

## ✅ Step 4: Verify DNS Propagation

Check if DNS is set up correctly:

```bash
# Check CNAME record
nslookup baseexchangepro.xyz

# Check A records
dig baseexchangepro.xyz

# Expected results should point to GitHub Pages
```

---

## 🔄 Automated Deployment

The `.github/workflows/static.yml` workflow is configured to:

1. **Trigger on**: Push to `main` branch or manual trigger
2. **Build**: Run `npm run build`
3. **Deploy**: Push `dist/` to GitHub Pages

**Status**: Check Actions tab in your repo for deployment logs

---

## 📁 Files Included for GitHub Pages

The `public/` folder contains:

- **`CNAME`** — Custom domain configuration (gets copied to dist/)
- **`.nojekyll`** — Tells GitHub not to process with Jekyll
- **`robots.txt`** — SEO configuration
- **`manifest.json`** — PWA manifest for app installation

All files are automatically copied to `dist/` during build.

---

## 🔐 HTTPS Configuration

GitHub Pages automatically provides free HTTPS via Let's Encrypt:

1. After adding custom domain, GitHub requests a certificate
2. Wait 24 hours for HTTPS to activate
3. Once ready, check **Enforce HTTPS** in Settings → Pages
4. This redirects all HTTP traffic to HTTPS

---

## 🧪 Test Locally

Before pushing, verify the build works:

```bash
npm run build
npm run preview
```

Then open: http://localhost:4173

---

## 📊 Monitoring

After deployment, monitor:

1. **GitHub Actions**: Repo → Actions tab
   - Check for green checkmarks on deployments
   - Review logs if builds fail

2. **Site Status**:
   - Visit https://baseexchangepro.xyz
   - Check DevTools → Network tab for 200 status codes
   - Test PWA manifest loads: https://baseexchangepro.xyz/manifest.json

3. **Performance**:
   - Run Lighthouse: DevTools → Lighthouse
   - Check performance, accessibility, SEO

---

## 🐛 Troubleshooting

### HTTPS not activating
- Wait 24-48 hours
- Ensure DNS is pointing to GitHub correctly
- Delete and re-add custom domain in Settings

### 404 Page Not Found
- Check DNS propagation with `nslookup`
- Verify repo is public (private repos need GitHub Pro for Pages)
- Check Actions tab for build failures

### Files not loading (404 on assets)
- Verify `dist/` contains all assets
- Check CNAME file is in dist/
- Clear browser cache (Ctrl+Shift+Del)

### Deployment failed in Actions
- Check workflow logs: Actions → Click failed workflow
- Most common: `npm install` or `npm run build` failures
- Verify `package.json` and `package-lock.json` are in sync

---

## 🔄 Redeployment

To redeploy after making changes:

```bash
git add .
git commit -m "Update: describe your changes"
git push origin main
```

GitHub Actions will automatically:
1. Build the project
2. Deploy to GitHub Pages
3. Update the live site at https://baseexchangepro.xyz

---

## 📖 More Resources

- [GitHub Pages Documentation](https://docs.github.com/en/pages)
- [Custom Domain Setup](https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site)
- [GitHub Pages Troubleshooting](https://docs.github.com/en/pages/getting-started-with-github-pages/troubleshooting-custom-domains-and-github-pages)