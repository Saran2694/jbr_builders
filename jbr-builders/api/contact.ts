import { Resend } from 'resend';
import fs from 'node:fs';
import path from 'node:path';

// Helper to ensure .env is parsed if not already populated by environment
function ensureEnvLoaded() {
  if (process.env.RESEND_API_KEY) return;
  try {
    if (typeof (process as any).loadEnvFile === 'function') {
      (process as any).loadEnvFile();
    }
  } catch {
    // continue to manual parse
  }
  if (!process.env.RESEND_API_KEY) {
    const candidatePaths = [
      path.join(process.cwd(), '.env'),
      path.join(process.cwd(), '.env.local'),
      path.join(process.cwd(), 'jbr-builders', '.env'),
      path.join(process.cwd(), '..', '.env'),
    ];
    for (const p of candidatePaths) {
      if (fs.existsSync(p)) {
        try {
          const content = fs.readFileSync(p, 'utf8');
          content.split(/\r?\n/).forEach((line) => {
            const m = line.match(/^\s*([\w.-]+)\s*=\s*(.*)?\s*$/);
            if (m) {
              const key = m[1];
              let val = (m[2] || '').trim();
              if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
                val = val.slice(1, -1);
              }
              if (!process.env[key]) {
                process.env[key] = val;
              }
            }
          });
        } catch {
          // ignore
        }
        if (process.env.RESEND_API_KEY) break;
      }
    }
  }
}

// Simple in-memory rate limiter for serverless instance lifespan
const rateLimitMap = new Map<string, { count: number; expiresAt: number }>();

function isRateLimited(ip: string, limit = 5, windowMs = 60000): boolean {
  const now = Date.now();
  const entry = rateLimitMap.get(ip);
  if (!entry || entry.expiresAt < now) {
    rateLimitMap.set(ip, { count: 1, expiresAt: now + windowMs });
    return false;
  }
  entry.count++;
  if (entry.count > limit) {
    return true;
  }
  return false;
}

function sanitizeText(str: unknown): string {
  if (typeof str !== 'string') return '';
  return str.replace(/</g, '&lt;').replace(/>/g, '&gt;').trim();
}

export default async function handler(req: any, res: any) {
  ensureEnvLoaded();
  // Setup CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.statusCode = 200;
    res.end();
    return;
  }

  if (req.method !== 'POST') {
    res.statusCode = 405;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({ success: false, error: 'Method Not Allowed' }));
    return;
  }

  // Parse body if not already parsed by Vercel
  let body = req.body;
  if (!body || typeof body === 'string') {
    try {
      if (typeof body === 'string' && body.length > 0) {
        body = JSON.parse(body);
      } else {
        const buffers: Buffer[] = [];
        for await (const chunk of req) {
          buffers.push(typeof chunk === 'string' ? Buffer.from(chunk) : chunk);
        }
        const rawString = Buffer.concat(buffers).toString('utf-8');
        body = rawString ? JSON.parse(rawString) : {};
      }
    } catch {
      res.statusCode = 400;
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify({ success: false, error: 'Invalid JSON payload' }));
      return;
    }
  }

  // Rate Limiting by IP
  const clientIp = (req.headers['x-forwarded-for'] || req.socket?.remoteAddress || 'unknown')
    .toString()
    .split(',')[0]
    .trim();

  if (isRateLimited(clientIp, 6, 60000)) {
    res.statusCode = 429;
    res.setHeader('Content-Type', 'application/json');
    res.end(
      JSON.stringify({
        success: false,
        error: 'Too many requests. Please wait a minute before submitting again.',
      })
    );
    return;
  }

  // Honeypot spam protection
  const honeypot = body.honeypot || body._gotcha || body.website;
  if (honeypot && String(honeypot).trim() !== '') {
    // Return success to bot without sending email
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    res.end(
      JSON.stringify({
        success: true,
        message: 'Inquiry received successfully',
      })
    );
    return;
  }

  // Extract and sanitize form data
  const formType = sanitizeText(body.formType) || 'contact'; // 'contact' | 'quote'
  const name = sanitizeText(body.name);
  const phone = sanitizeText(body.phone);
  const email = sanitizeText(body.email);
  const service = sanitizeText(body.service) || 'General Construction Consultation';
  const location = sanitizeText(body.location);
  const message = sanitizeText(body.message);

  // Validation
  const errors: string[] = [];

  if (!name || name.length < 2) {
    errors.push('Full name is required (minimum 2 characters).');
  } else if (name.length > 100) {
    errors.push('Full name must be under 100 characters.');
  }

  if (!phone || phone.length < 8) {
    errors.push('Phone number is required (minimum 8 digits).');
  } else if (!/^[0-9+\s-()]{8,25}$/.test(phone)) {
    errors.push('Please provide a valid phone number.');
  }

  if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    errors.push('Please provide a valid email address.');
  }

  if (!message || message.length < 2) {
    errors.push('Please provide project details or a short description.');
  } else if (message.length > 5000) {
    errors.push('Project description exceeds maximum length of 5000 characters.');
  }

  if (errors.length > 0) {
    res.statusCode = 400;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({ success: false, error: errors[0], details: errors }));
    return;
  }

  // Configure Resend
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.error('Missing RESEND_API_KEY environment variable');
    res.statusCode = 500;
    res.setHeader('Content-Type', 'application/json');
    res.end(
      JSON.stringify({
        success: false,
        error: 'Email service configuration error. Please contact via WhatsApp.',
      })
    );
    return;
  }

  const resend = new Resend(apiKey);
  const recipient = process.env.RECIPIENT_EMAIL || 'jbrbuilders15@gmail.com';
  const senderEmail = process.env.RESEND_FROM_EMAIL || 'JBR Builders <contact@datamintaarvix.com>';

  const isQuote = formType.toLowerCase() === 'quote';
  const subjectTag = isQuote ? 'Project Quote Request' : 'Website Consultation Inquiry';
  const emailSubject = `[JBR Builders] ${subjectTag}: ${name} - ${service}`;

  // Build clean HTML email template matching JBR Builders luxury aesthetic
  const htmlContent = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>${emailSubject}</title>
</head>
<body style="margin: 0; padding: 0; background-color: #F8FAFC; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #1E293B;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color: #F8FAFC; padding: 40px 15px;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" style="max-width: 620px; background-color: #FFFFFF; border-radius: 20px; overflow: hidden; border: 1px solid #E2E8F0; box-shadow: 0 10px 30px rgba(18, 59, 104, 0.08);">
          
          <!-- Header Banner -->
          <tr>
            <td style="background: linear-gradient(135deg, #123B68 0%, #2468A6 100%); padding: 32px 35px; text-align: left;">
              <p style="margin: 0 0 6px 0; font-size: 11px; font-weight: 800; letter-spacing: 2px; text-transform: uppercase; color: #7DD3FC;">
                JBR BUILDERS • OFFICIAL NOTIFICATION
              </p>
              <h1 style="margin: 0; font-size: 24px; font-weight: 800; color: #FFFFFF; letter-spacing: -0.5px;">
                ${subjectTag}
              </h1>
              <p style="margin: 8px 0 0 0; font-size: 13px; color: #E2E8F0;">
                Submitted via JBR Builders Website (${formType.toUpperCase()} FORM)
              </p>
            </td>
          </tr>

          <!-- Core Details Section -->
          <tr>
            <td style="padding: 35px 35px 20px 35px;">
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
                
                <!-- Client Name -->
                <tr>
                  <td style="padding-bottom: 18px; width: 35%; font-size: 12px; font-weight: 700; color: #64748B; text-transform: uppercase; letter-spacing: 0.5px;">Client Name</td>
                  <td style="padding-bottom: 18px; font-size: 16px; font-weight: 800; color: #123B68;">${name}</td>
                </tr>

                <!-- Phone -->
                <tr>
                  <td style="padding-bottom: 18px; font-size: 12px; font-weight: 700; color: #64748B; text-transform: uppercase; letter-spacing: 0.5px;">Phone Number</td>
                  <td style="padding-bottom: 18px; font-size: 15px; font-weight: 700;">
                    <a href="tel:${phone}" style="color: #2468A6; text-decoration: none; font-weight: 800;">${phone}</a>
                    <span style="font-size: 11px; color: #64748B; margin-left: 8px;">(Click to Call)</span>
                  </td>
                </tr>

                <!-- Email -->
                <tr>
                  <td style="padding-bottom: 18px; font-size: 12px; font-weight: 700; color: #64748B; text-transform: uppercase; letter-spacing: 0.5px;">Email Address</td>
                  <td style="padding-bottom: 18px; font-size: 14px; font-weight: 600; color: #1E293B;">
                    ${
                      email
                        ? `<a href="mailto:${email}" style="color: #2468A6; text-decoration: none;">${email}</a>`
                        : '<span style="color: #94A3B8; font-style: italic;">Not provided</span>'
                    }
                  </td>
                </tr>

                <!-- Service Category -->
                <tr>
                  <td style="padding-bottom: 18px; font-size: 12px; font-weight: 700; color: #64748B; text-transform: uppercase; letter-spacing: 0.5px;">Service Required</td>
                  <td style="padding-bottom: 18px; font-size: 14px; font-weight: 800; color: #123B68;">
                    <span style="background-color: #EBF4FC; color: #123B68; padding: 4px 10px; border-radius: 8px; border: 1px solid #BFDBFE;">${service}</span>
                  </td>
                </tr>

                <!-- Project Location (if present) -->
                ${
                  location
                    ? `<tr>
                        <td style="padding-bottom: 18px; font-size: 12px; font-weight: 700; color: #64748B; text-transform: uppercase; letter-spacing: 0.5px;">Project Location</td>
                        <td style="padding-bottom: 18px; font-size: 14px; font-weight: 700; color: #1E293B;">${location}</td>
                      </tr>`
                    : ''
                }

              </table>
            </td>
          </tr>

          <!-- Project Message / Requirements Box -->
          <tr>
            <td style="padding: 0 35px 30px 35px;">
              <div style="background-color: #F8FAFC; border: 1px solid #E2E8F0; border-radius: 14px; padding: 20px;">
                <p style="margin: 0 0 10px 0; font-size: 12px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.5px; color: #123B68;">
                  Project Requirements & Notes:
                </p>
                <div style="font-size: 14px; line-height: 1.6; color: #334155; white-space: pre-wrap;">${message}</div>
              </div>
            </td>
          </tr>

          <!-- Quick Action Bar -->
          <tr>
            <td style="padding: 0 35px 35px 35px;">
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
                <tr>
                  <td align="center">
                    <a href="https://wa.me/91${phone.replace(/[^0-9]/g, '')}" target="_blank" style="display: inline-block; background-color: #25D366; color: #FFFFFF; font-size: 13px; font-weight: 700; text-decoration: none; padding: 12px 24px; border-radius: 12px; margin-right: 10px;">
                      Chat with Client on WhatsApp
                    </a>
                    ${
                      email
                        ? `<a href="mailto:${email}?subject=Re:%20JBR%20Builders%20Consultation%20-%20${encodeURIComponent(name)}" style="display: inline-block; background-color: #123B68; color: #FFFFFF; font-size: 13px; font-weight: 700; text-decoration: none; padding: 12px 24px; border-radius: 12px;">
                            Reply via Email
                          </a>`
                        : ''
                    }
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Footer Metadata -->
          <tr>
            <td style="background-color: #F1F5F9; border-top: 1px solid #E2E8F0; padding: 20px 35px; text-align: center;">
              <p style="margin: 0; font-size: 11px; color: #64748B;">
                Received on: ${new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })} IST • Client IP: ${clientIp}
              </p>
              <p style="margin: 4px 0 0 0; font-size: 11px; color: #94A3B8;">
                JBR Builders • Tuticorin & Tirunelveli, Tamil Nadu • Listen Better • Plan Better • Build Better
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
`;

  // Plain text version fallback
  const textContent = `
[JBR BUILDERS] ${subjectTag.toUpperCase()}
==================================================

Client Name: ${name}
Phone Number: ${phone}
Email: ${email || 'Not provided'}
Service Required: ${service}
${location ? `Project Location: ${location}\n` : ''}
Project Requirements:
${message}

--------------------------------------------------
Submitted on: ${new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })} IST
Client IP: ${clientIp}
`;

  try {
    const sendPayload: any = {
      from: senderEmail,
      to: [recipient],
      subject: emailSubject,
      html: htmlContent,
      text: textContent,
    };

    if (email) {
      sendPayload.replyTo = email;
    }

    const result = await resend.emails.send(sendPayload);

    if (result.error) {
      console.error('Resend API error:', result.error);
      res.statusCode = 500;
      res.setHeader('Content-Type', 'application/json');
      res.end(
        JSON.stringify({
          success: false,
          error: result.error.message || 'Failed to dispatch email notification.',
        })
      );
      return;
    }

    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    res.end(
      JSON.stringify({
        success: true,
        id: result.data?.id,
        message: 'Your inquiry has been delivered directly to our engineering desk.',
      })
    );
  } catch (err: any) {
    console.error('Unexpected error while sending email via Resend:', err);
    res.statusCode = 500;
    res.setHeader('Content-Type', 'application/json');
    res.end(
      JSON.stringify({
        success: false,
        error: err.message || 'An unexpected error occurred while sending the email.',
      })
    );
  }
}
