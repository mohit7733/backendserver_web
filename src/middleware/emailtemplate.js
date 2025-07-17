const emailTemplateapproved = (recipientName = "User", websiteTitle = "your website", websiteSlug = "") => ({
    html: `
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="UTF-8">
        <title>Website Approved - Web Guru Awards</title>
        <style>
            body {
                font-family: Arial, sans-serif;
                background: #f7f7f7;
                margin: 0;
                padding: 0;
            }
            .container {
                background: #fff;
                max-width: 600px;
                background-color: #f7f7f7;
                margin: 40px auto;
                border-radius: 8px;
                box-shadow: 0 2px 8px #0001;
                padding: 32px 28px 24px 28px;
            }
            .header {
                text-align: center;
                padding-bottom: 16px;
                border-bottom: 1px solid #eee;
            }
            .header img {
                max-width: 120px;
                margin-bottom: 8px;
            }
            .title {
                font-size: 22px;
                font-weight: 700;
                color: #e0621f;
                margin: 0 0 12px 0;
            }
            .content {
                margin: 24px 0 18px 0;
                font-size: 16px;
                color: #222;
                line-height: 1.7;
            }
            .cta {
                display: block;
                width: fit-content;
                margin: 18px 0 0 0;
                background: #e0621f;
                color: #fff !important;
                text-decoration: none;
                padding: 12px 28px;
                border-radius: 4px;
                font-weight: 600;
                font-size: 16px;
                box-shadow: 0 1px 4px #0001;
            }
            .footer {
                margin-top: 32px;
                font-size: 13px;
                color: #888;
                text-align: center;
            }
            .badge-link {
                display: inline-block;
                margin-top: 10px;
                color: #e0621f;
                text-decoration: underline;
                font-size: 15px;
            }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <img src="https://www.webguruawards.com/public/images/img_logo.png" alt="Web Guru Awards Logo" />
                <div class="title">Congratulations, ${recipientName}!</div>
            </div>
            <div class="content">
                <p>
                    We are excited to inform you that <b>${websiteTitle}</b> has been <b>approved</b> and added to the <a href="https://www.webguruawards.com" style="color:#e0621f;text-decoration:underline;">Web Guru Awards</a> gallery.
                </p>
                <p>
                    <b>Help your website become the ‘Guru of the Day’!</b><br>
                    Share your website's gallery link with your friends, colleagues, and followers to get more votes and visibility:
                </p>
                <a class="cta" href="https://www.webguruawards.com/sites/${websiteSlug}" target="_blank">
                    View Your Website Gallery Page
                </a>
                <p style="margin-top:24px;">
                    <b>Show off your achievement!</b><br>
                    Add the <a class="badge-link" href="https://www.webguruawards.com/badge/${websiteSlug}" target="_blank">Web Guru Awards badge</a> to your website and let the world know about your success.
                </p>
                <p>
                    If you have any questions, feel free to contact us at <a href="mailto:info@webguruawards.com">info@webguruawards.com</a>.
                </p>
            </div>
            <div class="footer">
                &copy; ${new Date().getFullYear()} Web Guru Awards<br>
                <a href="https://www.webguruawards.com" style="color:#e0621f;text-decoration:none;">www.webguruawards.com</a>
            </div>
        </div>
    </body>
    </html>
    `
});

const websiteadditionalinfo = (subject, text) => ({
    html: `
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="UTF-8">
        <title>${subject}</title>
        <style>
            body {
                font-family: Arial, sans-serif;
                background: #f7f7f7;
                margin: 0;
                padding: 0;
            }
            .container {
                background: #fff;
                max-width: 600px;
                background-color: #f7f7f7;
                margin: 40px auto;
                border-radius: 8px;
                box-shadow: 0 2px 8px #0001;
                padding: 32px 28px 24px 28px;
            }
            .header {
                text-align: center;
                padding-bottom: 16px;
                border-bottom: 1px solid #eee;
            }
            .header img {
                max-width: 120px;
                margin-bottom: 8px;
            }
            .title {
                font-size: 22px;
                font-weight: 700;
                color: #e0621f;
                margin: 0 0 12px 0;
            }
            .content {
                margin: 24px 0 18px 0;
                font-size: 16px;
                color: #222;
                line-height: 1.7;
            }
            .cta {
                display: block;
                width: fit-content;
                margin: 18px 0 0 0;
                background: #e0621f;
                color: #fff !important;
                text-decoration: none;
                padding: 12px 28px;
                border-radius: 4px;
                font-weight: 600;
                font-size: 16px;
                box-shadow: 0 1px 4px #0001;
            }
            .footer {
                margin-top: 32px;
                font-size: 13px;
                color: #888;
                text-align: center;
            }
            .badge-link {
                display: inline-block;
                margin-top: 10px;
                color: #e0621f;
                text-decoration: underline;
                font-size: 15px;
            }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <img src="https://www.webguruawards.com/public/images/img_logo.png" alt="Web Guru Awards Logo" />
            </div>
            <div class="content">
                <p>
                    ${text}
                </p>
                <br>
                <p>
                    If you have any questions, feel free to contact us at <a href="mailto:info@webguruawards.com">info@webguruawards.com</a>.
                </p>
            </div>
            <div class="footer">
                &copy; ${new Date().getFullYear()} Web Guru Awards<br>
                <a href="https://www.webguruawards.com" style="color:#e0621f;text-decoration:none;">www.webguruawards.com</a>
            </div>
        </div>
    </body>
    </html>
    `
});

const guruofday = (recipientName = "User", websiteSlug = "", badgeId = "", mailType = "") => ({
    html: ` 
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="UTF-8">
        <title>${mailType === "gotd" ? "Guru of the Day - Web Guru Awards" : mailType === "gotm" ? "Guru of the Month - Web Guru Awards" : "Guru of the Year - Web Guru Awards"}</title>
        <style>
            body {
                font-family: Arial, sans-serif;
                background: #f7f7f7;
                margin: 0;
                padding: 0;
            }
            .container {
                background: #fff;
                max-width: 600px;
                background-color: #f7f7f7;
                margin: 40px auto;
                border-radius: 8px;
                box-shadow: 0 2px 8px #0001;
                padding: 32px 28px 24px 28px;
            }
            .header {
                text-align: center;
                padding-bottom: 16px;
                border-bottom: 1px solid #eee;
            }
            .header img {
                max-width: 120px;
                margin-bottom: 8px;
            }
            .title {
                font-size: 22px;
                font-weight: 700;
                color: #e0621f;
                margin: 0 0 12px 0;
            }
            .content {
                margin: 24px 0 18px 0;
                font-size: 16px;
                color: #222;
                line-height: 1.7;
            }
            .cta {
                display: block;
                width: fit-content;
                margin: 18px 0 0 0;
                background: #e0621f;
                color: #fff !important;
                text-decoration: none;
                padding: 12px 28px;
                border-radius: 4px;
                font-weight: 600;
                font-size: 16px;
                box-shadow: 0 1px 4px #0001;
            }
            .footer {
                margin-top: 32px;
                font-size: 13px;
                color: #888;
                text-align: center;
            }
            .badge-link {
                display: inline-block;
                margin-top: 10px;
                color: #e0621f;
                text-decoration: underline;
                font-size: 15px;
            }
            p{
                color: #222;
            }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <img src="https://www.webguruawards.com/public/images/img_logo.png" alt="Web Guru Awards Logo" />
                <div class="title">Congratulations, ${recipientName}!</div>
            </div>
            <div class="content">
                <p>
                    We are thrilled to announce that your website <a href="https://www.webguruawards.com/sites/${websiteSlug}" style="color:#e0621f;text-decoration:underline;">${websiteSlug}</a> has been selected as <b>${mailType === "gotd" ? "“Guru of The Day”" : mailType === "gotm" ? "“Guru of The Month”" : "“Guru of The Year”"}</b>!<br>
                    ${mailType !== "goty" ? `You are now also eligible for the <b>${mailType === "gotd" ? "“Guru of the Month”" : mailType === "gotm" ? "“Guru of the Year”" : "“Guru of the Year”"}</b> title.` : ""}
                </p>
                <p>
                    <b>Your detail page has been updated.</b><br>
                    You can view it here:<br>
                    <a class="cta" href="https://www.webguruawards.com/sites/${websiteSlug}" target="_blank">
                        View Your Website Gallery Page
                    </a>
                </p>
                <p style="margin-top:24px;">
                    <b>Show off your achievement!</b><br>
                    Download your badge for the title <b>${mailType === "gotd" ? "“Guru of the Day”" : mailType === "gotm" ? "“Guru of the Month”" : "“Guru of the Year”"}</b>:<br>
                    <a class="badge-link" href="https://www.webguruawards.com/badge-${mailType === "gotd" ? "gotd" : mailType === "gotm" ? "gotm" : "goty"}/${badgeId}" target="_blank">
                        https://www.webguruawards.com/badge-${mailType === "gotd" ? "gotd" : mailType === "gotm" ? "gotm" : "goty"}/${badgeId}
                    </a>
                </p>
                <p>
                    <b>Spread the word!</b><br>
                    Our team will soon promote your accomplishment on social media. Help amplify your success by liking, sharing, and retweeting our posts:<br>
                    <a href="https://www.facebook.com/webguruawards" style="color:#e0621f;text-decoration:underline;" target="_blank">Facebook</a> |
                    <a href="https://twitter.com/webguruawards" style="color:#e0621f;text-decoration:underline;" target="_blank">Twitter</a> |
                    <a href="https://instagram.com/_webguruawards" style="color:#e0621f;text-decoration:underline;" target="_blank">Instagram</a>
                </p>
                <p>
                    If you have any questions, feel free to contact us at <a href="mailto:info@webguruawards.com">info@webguruawards.com</a>.
                </p>
            </div>
            <div class="footer">
                &copy; ${new Date().getFullYear()} Web Guru Awards<br>
                <a href="https://www.webguruawards.com" style="color:#e0621f;text-decoration:none;">www.webguruawards.com</a>
            </div>
        </div>
    </body>
    </html>
    `
});

const emailTemplatesubmited = (recipientName = "User", websiteTitle = "your website", websiteSlug = "") => ({
    html: `
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="UTF-8">
        <title>Website Submission Received - Web Guru Awards</title>
        <style>
            body {
                font-family: Arial, sans-serif;
                background: #f7f7f7;
                margin: 0;
                padding: 0;
            }
            .container {
                background: #f7f7f7;
                max-width: 600px;
                margin: 40px auto;
                border-radius: 8px;
                box-shadow: 0 2px 8px #0001;
                padding: 32px 28px 24px 28px;
            }
            .header {
                text-align: center;
                padding-bottom: 16px;
                border-bottom: 1px solid #eee;
            }
            .header img {
                max-width: 120px;
                margin-bottom: 8px;
            }
            .title {
                font-size: 22px;
                font-weight: 700;
                color: #e0621f;
                margin: 0 0 12px 0;
            }
            .content {
                margin: 24px 0 18px 0;
                font-size: 16px;
                color: #222;
                line-height: 1.7;
            }
            .cta {
                display: block;
                width: fit-content;
                margin: 18px 0 0 0;
                background: #e0621f;
                color: #fff !important;
                text-decoration: none;
                padding: 12px 28px;
                border-radius: 5px;
                font-weight: 600;
                font-size: 16px;
                box-shadow: 0 1px 4px #0001;
            }
            .footer {
                margin-top: 32px;
                font-size: 13px;
                color: #888;
                text-align: center;
            }
            .social-links a {
                color: #e0621f;
                text-decoration: underline;
                margin-right: 10px;
            }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <img src="https://www.webguruawards.com/public/images/img_logo.png" alt="Web Guru Awards Logo" />
                <div class="title">Welcome to Web Guru Awards, ${recipientName}!</div>
            </div>
            <div class="content">
                <p>
                    Hello,<br><br>
                    Welcome to the Web Guru Awards family. You have successfully entered your website <a href="https://www.webguruawards.com/sites/${websiteSlug}" style="color:#e0621f;text-decoration:underline;">${websiteTitle}</a> in the Web Guru Awards.
                </p>
                <p>
                    Based on design, development, creativity, and innovation, the <b>Guru of the Day</b> is selected. Your website has a good chance of winning the coveted title if it satisfies the aforementioned requirements.
                </p>
                <p>
                    However, not all websites submitted are included in our gallery. Please retry with more improvements if your entry is not listed. We would adore highlighting your contributions online.
                </p>
                <p>
                    We will get in touch with you to let you know if it's approved.
                </p>
                <p>
                    <b>See our winners:</b><br>
                    <a href="https://www.webguruawards.com/winners" class="cta" target="_blank">View Winners</a>
                </p>
                <p>
                    <b>Check out the new job feature we just launched on the portal:</b><br>
                    (Free job posting for Employers) <a href="https://www.webguruawards.com/job-submit" style="color:#e0621f;text-decoration:underline;" target="_blank">Submit a Job</a><br>
                    (For job seekers) <a href="https://www.webguruawards.com/jobs" style="color:#e0621f;text-decoration:underline;" target="_blank">Browse Jobs</a>
                </p>
                <p>
                    <b>Follow us on social media for more information:</b><br>
                    <span class="social-links">
                        <a href="https://www.facebook.com/webguruawards" target="_blank">Facebook</a>
                        <a href="https://twitter.com/webguruawards" target="_blank">Twitter</a>
                        <a href="https://www.instagram.com/_webguruawards/" target="_blank">Instagram</a>
                    </span>
                </p>
                <p>
                    Thanks,<br>
                    Web Guru Awards Team<br>
                    <a href="https://www.webguruawards.com" style="color:#e0621f;text-decoration:none;">www.webguruawards.com</a><br>
                    <a href="mailto:info@webguruawards.com" style="color:#e0621f;text-decoration:underline;">info@webguruawards.com</a>
                </p>
            </div>
            <div class="footer">
                &copy; ${new Date().getFullYear()} Web Guru Awards<br>
                <a href="https://www.webguruawards.com" style="color:#e0621f;text-decoration:none;">www.webguruawards.com</a>
            </div>
        </div>
    </body>
    </html>
    `
})


const forgetpassword = (recipientName = "User", otp = "") => ({
    html: `
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="UTF-8">
        <title>Forgot Password - Web Guru Awards</title>
        <style>
            body {
                font-family: Arial, sans-serif;
                background: #f7f7f7;
                margin: 0;
                padding: 0;
            }
            .container {
                background: #fff;
                max-width: 500px;
                margin: 40px auto;
                border-radius: 8px;
                box-shadow: 0 2px 8px #0001;
                padding: 32px 28px 24px 28px;
            }
            .header {
                text-align: center;
                padding-bottom: 16px;
                border-bottom: 1px solid #eee;
            }
            .title {
                font-size: 22px;
                font-weight: 700;
                color: #e0621f;
                margin: 0 0 12px 0;
            }
            .content {
                margin: 24px 0 18px 0;
                font-size: 16px;
                color: #222;
                line-height: 1.7;
            }
            .otp-box {
                display: inline-block;
                background: #e0621f;
                color: #fff;
                font-size: 24px;
                font-weight: bold;
                letter-spacing: 4px;
                padding: 12px 32px;
                border-radius: 6px;
                margin: 18px 0;
            }
            .footer {
                text-align: center;
                color: #888;
                font-size: 13px;
                margin-top: 32px;
            }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <img src="https://www.webguruawards.com/public/images/img_logo.png" alt="Web Guru Awards" style="max-width:120px;margin-bottom:8px;">
                <div class="title">Password Reset Request</div>
            </div>
            <div class="content">
                <p>Hello${recipientName ? `, ${recipientName}` : ""},</p>
                <p>
                    We received a request to reset your password for your Web Guru Awards account.
                </p>
                <p>
                    Please use the following One-Time Password (OTP) to reset your password:
                </p>
                <div class="otp-box">${otp}</div>
                <p>
                    This OTP is valid for a limited time and can only be used once. If you did not request a password reset, please ignore this email.
                </p>
                <p>
                    If you need further assistance, feel free to contact us at 
                    <a href="mailto:info@webguruawards.com" style="color:#e0621f;text-decoration:underline;">info@webguruawards.com</a>.
                </p>
                <p>
                    Thanks,<br>
                    Web Guru Awards Team<br>
                    <a href="https://www.webguruawards.com" style="color:#e0621f;text-decoration:none;">www.webguruawards.com</a>
                </p>
            </div>
            <div class="footer">
                &copy; ${new Date().getFullYear()} Web Guru Awards
            </div>
        </div>
    </body>
    </html>
    `
})

module.exports = { emailTemplateapproved, websiteadditionalinfo, guruofday, emailTemplatesubmited, forgetpassword };
