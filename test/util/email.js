import nodemailer from 'nodemailer';

/**
 * Generate test SMTP service account from ethereal.email
 * @returns {Promise.Object} the account information for the new ethereal account
 */
async function getEmailAccount() {
  return new Promise((resolve, reject) => {
    nodemailer.createTestAccount((err, account) => {
      if (err) {
        console.error('Failed to create a testing account. ' + err.message);
        reject(err);
      }
      resolve(account);
    });
  });
}

/**
 * Create reusable transporter object using the default SMTP transport
 */
export async function getTestTransportOptions() {
  const account = await getEmailAccount();
  return {
    host: 'smtp.ethereal.email',
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
      user: account.user, // generated ethereal user
      pass: account.pass  // generated ethereal password
    }
  };
}
