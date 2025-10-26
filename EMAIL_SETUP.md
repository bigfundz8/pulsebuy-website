# Email Configuration Instructions

Om email notificaties te laten werken, voeg de volgende variabelen toe aan je `.env.local` bestand:

```env
# Email Configuration (SMTP)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
```

## Gmail Setup (Aanbevolen)

1. **Gmail App Password maken:**
   - Ga naar je Google Account instellingen
   - Security → 2-Step Verification (moet aan staan)
   - App passwords → Generate app password
   - Selecteer "Mail" en genereer een wachtwoord
   - Gebruik dit wachtwoord als `SMTP_PASS`

2. **Gmail SMTP instellingen:**
   - Host: smtp.gmail.com
   - Port: 587
   - Security: STARTTLS
   - Username: je volledige Gmail adres
   - Password: je app password (niet je normale wachtwoord)

## Alternatieve Email Providers

### Outlook/Hotmail
```env
SMTP_HOST=smtp-mail.outlook.com
SMTP_PORT=587
SMTP_USER=your-email@outlook.com
SMTP_PASS=your-password
```

### SendGrid
```env
SMTP_HOST=smtp.sendgrid.net
SMTP_PORT=587
SMTP_USER=apikey
SMTP_PASS=your-sendgrid-api-key
```

### Mailgun
```env
SMTP_HOST=smtp.mailgun.org
SMTP_PORT=587
SMTP_USER=your-mailgun-username
SMTP_PASS=your-mailgun-password
```

## Test Email Functionaliteit

Na het configureren van de SMTP instellingen, kun je de email functionaliteit testen door:

1. Een nieuwe gebruiker te registreren (welkomstemail)
2. Een bestelling te plaatsen (bevestigingsemail)
3. Een bestelling status te wijzigen naar "shipped" of "delivered"

## Troubleshooting

- **Authentication failed:** Controleer je SMTP credentials
- **Connection timeout:** Controleer je firewall/network instellingen
- **Gmail "Less secure app" error:** Gebruik App Passwords in plaats van je normale wachtwoord
- **Port issues:** Probeer port 465 met SSL of port 587 met STARTTLS
