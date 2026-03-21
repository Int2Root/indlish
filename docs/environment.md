# Environment Variables — indlish

## Required Variables

### Database
| Variable | Description | Example |
|----------|-------------|---------|
| `DATABASE_URL` | PostgreSQL connection string (Neon) | `postgresql://user:pass@ep-xxx.neon.tech/indlish?sslmode=require` |

### NextAuth
| Variable | Description | Example |
|----------|-------------|---------|
| `NEXTAUTH_URL` | App URL | `https://indlish.com` |
| `NEXTAUTH_SECRET` | JWT secret (generate with `openssl rand -base64 32`) | Random string |

### Google OAuth
| Variable | Description |
|----------|-------------|
| `GOOGLE_CLIENT_ID` | Google Cloud Console OAuth client ID |
| `GOOGLE_CLIENT_SECRET` | Google Cloud Console OAuth client secret |

Setup: Google Cloud Console → APIs & Services → Credentials → OAuth 2.0 Client ID

### Razorpay
| Variable | Description |
|----------|-------------|
| `RAZORPAY_KEY_ID` | Razorpay dashboard key ID |
| `RAZORPAY_KEY_SECRET` | Razorpay dashboard key secret |

### App
| Variable | Description | Example |
|----------|-------------|---------|
| `NEXT_PUBLIC_APP_URL` | Public-facing app URL | `https://indlish.com` |
| `NEXT_PUBLIC_APP_NAME` | App name | `indlish` |

## Generating Secrets

```bash
# NextAuth secret
openssl rand -base64 32

# Or use Node.js
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

## Development vs Production

- Development: Use `.env` file locally
- Production: Set environment variables on VPS or in PM2 ecosystem config