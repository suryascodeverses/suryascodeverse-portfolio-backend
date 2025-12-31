const nodemailer = require('nodemailer');

// Create reusable transporter
const createTransporter = () => {
  // For Gmail
  if (process.env.EMAIL_SERVICE === 'gmail') {
    return nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD, // Use App Password, not regular password
      },
    });
  }

  // For custom SMTP (recommended for production)
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT || 587,
    secure: process.env.SMTP_PORT === '465', // true for 465, false for other ports
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASSWORD,
    },
  });
};

// Send email to admin (notification)
exports.sendAdminNotification = async (contactData) => {
  try {
    const transporter = createTransporter();

    const mailOptions = {
      from: process.env.EMAIL_FROM || process.env.EMAIL_USER,
      to: process.env.ADMIN_EMAIL || process.env.EMAIL_USER,
      subject: `New Contact Form Submission: ${contactData.subject}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center;">
            <h1 style="color: white; margin: 0;">New Contact Message</h1>
          </div>
          
          <div style="padding: 30px; background: #f9fafb;">
            <h2 style="color: #333; margin-top: 0;">Contact Details</h2>
            
            <div style="background: white; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
              <p style="margin: 10px 0;"><strong>Name:</strong> ${contactData.name}</p>
              <p style="margin: 10px 0;"><strong>Email:</strong> <a href="mailto:${contactData.email}">${contactData.email}</a></p>
              <p style="margin: 10px 0;"><strong>Subject:</strong> ${contactData.subject}</p>
            </div>
            
            <div style="background: white; padding: 20px; border-radius: 8px;">
              <h3 style="color: #333; margin-top: 0;">Message:</h3>
              <p style="color: #555; line-height: 1.6; white-space: pre-wrap;">${contactData.message}</p>
            </div>
            
            <div style="margin-top: 20px; padding: 15px; background: #e0e7ff; border-radius: 8px;">
              <p style="margin: 0; color: #4338ca;">
                <strong>Reply to this message:</strong> 
                <a href="mailto:${contactData.email}?subject=Re: ${encodeURIComponent(contactData.subject)}" 
                   style="color: #4338ca;">Click here to reply</a>
              </p>
            </div>
          </div>
          
          <div style="padding: 20px; text-align: center; background: #374151; color: white;">
            <p style="margin: 0; font-size: 14px;">This is an automated notification from your portfolio website.</p>
          </div>
        </div>
      `,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('✅ Admin notification sent:', info.messageId);
    return info;
  } catch (error) {
    console.error('❌ Error sending admin notification:', error);
    throw error;
  }
};

// Send confirmation email to user
exports.sendUserConfirmation = async (contactData) => {
  try {
    const transporter = createTransporter();

    const mailOptions = {
      from: process.env.EMAIL_FROM || process.env.EMAIL_USER,
      to: contactData.email,
      subject: `Thank you for contacting me, ${contactData.name}!`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center;">
            <h1 style="color: white; margin: 0;">Message Received!</h1>
          </div>
          
          <div style="padding: 30px; background: #f9fafb;">
            <h2 style="color: #333; margin-top: 0;">Hi ${contactData.name},</h2>
            
            <p style="color: #555; line-height: 1.6;">
              Thank you for reaching out! I've received your message and will get back to you as soon as possible.
            </p>
            
            <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <h3 style="color: #333; margin-top: 0;">Your Message Summary:</h3>
              <p style="margin: 10px 0;"><strong>Subject:</strong> ${contactData.subject}</p>
              <p style="margin: 10px 0; color: #555; white-space: pre-wrap;">${contactData.message}</p>
            </div>
            
            <p style="color: #555; line-height: 1.6;">
              I typically respond within 24-48 hours. If you need immediate assistance, 
              feel free to connect with me on LinkedIn or check out my other projects in the meantime.
            </p>
            
            <div style="text-align: center; margin-top: 30px;">
              <a href="${process.env.FRONTEND_URL}" 
                 style="display: inline-block; padding: 12px 30px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); 
                        color: white; text-decoration: none; border-radius: 6px; font-weight: bold;">
                Visit My Portfolio
              </a>
            </div>
          </div>
          
          <div style="padding: 20px; text-align: center; background: #374151; color: white;">
            <p style="margin: 0; font-size: 14px;">
              Best regards,<br>
              <strong>Your Name</strong><br>
              Full Stack Developer
            </p>
          </div>
        </div>
      `,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('✅ User confirmation sent:', info.messageId);
    return info;
  } catch (error) {
    console.error('❌ Error sending user confirmation:', error);
    throw error;
  }
};

// Test email configuration
exports.testEmailConfig = async () => {
  try {
    const transporter = createTransporter();
    await transporter.verify();
    console.log('✅ Email configuration is valid');
    return true;
  } catch (error) {
    console.error('❌ Email configuration error:', error);
    return false;
  }
};