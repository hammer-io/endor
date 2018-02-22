import config from 'config';
import nodemailer from 'nodemailer';
import * as emailInvite from './emails/invite.email';
import InviteService from '../services/invites.service';

// Get configuration details
const baseURL = (config.get('frontend.port') === '80')
  ? config.get('frontend.host')
  : `${config.get('frontend.host')}:${config.get('frontend.port')}`;
const manageInvitesURL = `${baseURL}/settings/invites`;
const notificationsURL = `${baseURL}/settings/notification`;
const from = config.get('email.from');
const transportOptions = config.get('email.transport');


export default class EmailService {
  constructor(logger) {
    this.log = logger;
    this.transporter = nodemailer.createTransport(transportOptions);
  }

  async emailInvite(user, project, invite) {
    return new Promise((resolve, reject) => {
      const expirationDate = InviteService.getInviteExpirationDateString(invite);
      const mailOptions = {
        from: from.combined,
        to: user.email,
        subject: `Invitation to contribute to project ${project.projectName}`,
        text: emailInvite.getPlaintext(
          project.projectName,
          user.firstName,
          expirationDate,
          manageInvitesURL,
          from.address,
          notificationsURL
        ),
        html: emailInvite.getHtml(
          project.projectName,
          user.firstName,
          expirationDate,
          manageInvitesURL,
          from.address,
          notificationsURL
        )
      };

      // send mail with defined transport object
      return this.transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          reject(error);
        }
        this.log.info(`Message sent: ${info.messageId}`);
        resolve(info);
      });
    });
  }
}
