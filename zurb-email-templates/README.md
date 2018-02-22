# Using the Zurb email templates

## Viewing/editing a template

In the terminal, move to the `zurb-email-templates` directory and serve
the files in that folder. (If you have php installed, this is as easy
as `php -S localhost:8888`) You can now view the files at `localhost:8888`.

When making a new email template, copy one of the originals into a new
file before making changes. Then, to help keep track of which ones are
custom and which ones are generic, add the file to the list of Yggdrasil
templates in the `index.html` file.

## Preparing it for email use

Before using the html in an email, you need to run it through Zurb's
[Email Inliner](https://foundation.zurb.com/emails/inliner-v2.html), which
will convert html and styles files into one html file with inline styles
that can be put into an email. (Don't compress the html in the inliner.)
Finally, copy/paste the results back into our application into its
appropriate place. Depending on your IDE, when it's copy/pasted back in,
it may incorrectly handle the ampersands, trying to html-escape them.
(You'll notice when you see non-breaking spaces shown as "&nbsp;" in the
rendered html.) If this is the case, make sure to search and replace those
with the correct `&nbsp;` values. Verify that everything looks correct by
running the Email Service Test and viewing the email preview in the browser.
