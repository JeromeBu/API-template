function confirmEmail(url, user) {
  return {
    from: "<contact@great-api.mailgun.org>",
    to: user.email,
    subject: "Welcome to our API - Email confirmation",
    html: `
    <!doctype html>
<html xmlns="http://www.w3.org/1999/xhtml" xmlns:v="urn:schemas-microsoft-com:vml"
xmlns:o="urn:schemas-microsoft-com:office:office">
  
  <head>
    <title></title>
    <!--[if !mso]>
      <!-- -->
      <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <!--<![endif]-->
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <style type="text/css">
      #outlook a { padding: 0; }
      .ReadMsgBody { width: 100%; }
      .ExternalClass { width: 100%; }
      .ExternalClass * { line-height:100%; }
      body { margin: 0; padding: 0; -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%; }
      table, td { border-collapse:collapse; mso-table-lspace: 0pt; mso-table-rspace: 0pt; }
      img { border: 0; height: auto; line-height: 100%; outline: none; text-decoration: none; -ms-interpolation-mode: bicubic; }
      p { display: block; margin: 13px 0; }
    </style>
    <!--[if !mso]>
      <!-->
      <style type="text/css">
        @media only screen and (max-width:480px) {
          @-ms-viewport { width:320px; }
          @viewport { width:320px; }
        }
      </style>
    <!--<![endif]-->
    <!--[if mso]>
      <xml>
        <o:OfficeDocumentSettings>
          <o:AllowPNG/>
          <o:PixelsPerInch>96</o:PixelsPerInch>
        </o:OfficeDocumentSettings>
      </xml>
    <![endif]-->
    <!--[if lte mso 11]>
      <style type="text/css">
        .outlook-group-fix {
          width:100% !important;
        }
      </style>
    <![endif]-->
    <!--[if !mso]>
      <!-->
      <link href="https://d2yjfm58htokf8.cloudfront.net/static/fonts/averta-v2.css"
      rel="stylesheet" type="text/css">
      <style type="text/css">
        @import url(https://d2yjfm58htokf8.cloudfront.net/static/fonts/averta-v2.css);
      </style>
    <!--<![endif]-->
    <style type="text/css">
      p {
        margin: 0 0 24px 0;
      }

      a {
        color: #00b9ff;
      }

      hr {
        margin: 32px 0;
        border-top: 1px #e2e6e8;
      }

      dt {
        font-size: 13px;
        margin-left: 0;
      }

	  dd {
        color: #37517e;
        margin-bottom: 24px;
        margin-left: 0;
      }

      h5 {
        font-family: TW-Averta-SemiBold, Averta, Helvetica, Arial;
        font-size: 16px;
        line-height: 24px;
        color: #2e4369;
      }
      
      pre {
        display: block;
        padding: 16px;
        padding: 12px 24px;
        margin: 0 0 48px;
        font-size: 14px;
        line-height: 24px;
        color: #4a5860;
        word-break: break-all;
        word-wrap: break-word;
        background-color: #f2f5f7;
        border-radius: 3px;
      }

      .body-wrapper {
        background: #f2f5f7 url('https://d2yjfm58htokf8.cloudfront.net/static/images/background-v1.png') no-repeat center top;
        padding: 0px;
        margin: auto;
      }

      .content-wrapper {
        max-width: 536px;
        padding: 32px;
        padding-bottom: 48px;
      }

      .footer-wrapper div {
        color: #37517e !important;
      }

      .footer-wrapper div a {
        color: #00b9ff !important;
      }

      .hero {
        font-family: TW-Averta-Bold, Averta, Helvetica, Arial;
        color: #37517e;
        font-size: 22px;
        line-height: 30px;
      }

      .page-header {
        border-bottom: 1px solid #eaebed;
        padding-bottom: 16px;
      }

      .mb-0 {
        margin-bottom: 0 !important;
      }

      .mt-0 {
        margin-top: 0 !important;
      }
      
      .btn {
        box-sizing: border-box;
        display: inline-block;
        min-height: 36px;
        padding: 12px 24px;
        margin: 0 0 24px;
        font-size: 16px;
        font-weight: 600;
        line-height: 24px;
        text-align: center;
        white-space: nowrap;
        vertical-align: middle;
        cursor: pointer;
        border: 0;
        border-radius: 3px;
        color: #fff;
        background-color: #00b9ff;
        text-decoration: none;

        -webkit-transition: all .15s ease-in-out;
        -o-transition: all .15s ease-in-out;
        transition: all .15s ease-in-out;
      }
      
      .btn:hover {
        background-color: #00a4df;
      }
      
      .btn:active {
        background-color: #008ec0;
      }

      @media screen and (min-width: 576px) and (max-width: 768px) {
        .body-wrapper {
          padding: 24px !important;
        }

        .content-wrapper {
          max-width: 504px !important;
          padding: 48px !important;
        }
      }

      @media screen and (min-width: 768px) {
        .body-wrapper {
          padding: 48px !important;
        }

        .content-wrapper {
          max-width: 456px !important;
          padding: 72px !important;
          padding-top: 48px !important;
        }
      }
    </style>
    <style type="text/css">
      @media only screen and (min-width:480px) {
        .mj-column-per-100 { width:100%!important; }
      }
    </style>
  </head>
  
  <body>
    <div class="mj-container body-wrapper">
      <!--[if mso | IE]>
        <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="600"
        align="center" style="width:600px;">
          <tr>
            <td style="line-height:0px;font-size:0px;mso-line-height-rule:exactly;">
            <![endif]-->
            <div style="margin:0px auto;max-width:600px;background:#fff;" class="content-wrapper"
            data-class="content-wrapper">
              <table role="presentation" cellpadding="0" cellspacing="0" style="font-size:0px;width:100%;background:#fff;"
              align="center" border="0">
                <tbody>
                  <tr>
                    <td style="text-align:center;vertical-align:top;direction:ltr;font-size:0px;padding:0px;">
                      <!--[if mso | IE]>
                        <table role="presentation" border="0" cellpadding="0" cellspacing="0">
                          <tr>
                            <td style="width:600px;">
                            <![endif]-->
                            <div style="margin:0px auto;max-width:600px;">
                              <table role="presentation" cellpadding="0" cellspacing="0" style="font-size:0px;width:100%;"
                              align="center" border="0">
                                <tbody>
                                  <tr>
                                    <td style="text-align:center;vertical-align:top;direction:ltr;font-size:0px;padding:0px;">
                                      <!--[if mso | IE]>
                                        <table role="presentation" border="0" cellpadding="0" cellspacing="0">
                                          <tr>
                                            <td style="vertical-align:middle;width:600px;">
                                            <![endif]-->
                                            <div class="mj-column-per-100 outlook-group-fix" style="vertical-align:middle;display:inline-block;direction:ltr;font-size:13px;text-align:left;width:100%;">
                                              <table role="presentation" cellpadding="0" cellspacing="0" style="vertical-align:middle;"
                                              width="100%" border="0">
                                                <tbody>
                                                  <tr>
                                                    <td style="word-wrap:break-word;font-size:0px;padding:0px;" align="center">
                                                      <table role="presentation" cellpadding="0" cellspacing="0" style="border-collapse:collapse;border-spacing:0px;"
                                                      align="center" border="0">
                                                        <tbody>
                                                          <tr>
                                                            <td style="width:150px;">
                                                              <img alt="Logo" title="" height="auto" src="https://d2yjfm58htokf8.cloudfront.net/static/images/tw_logo-v2.png"
                                                              style="border:none;border-radius:0px;display:block;font-size:13px;outline:none;text-decoration:none;width:100%;height:auto;"
                                                              width="150">
                                                            </td>
                                                          </tr>
                                                        </tbody>
                                                      </table>
                                                    </td>
                                                  </tr>
                                                </tbody>
                                              </table>
                                            </div>
                                            <!--[if mso | IE]>
                                            </td>
                                          </tr>
                                        </table>
                                      <![endif]-->
                                    </td>
                                  </tr>
                                </tbody>
                              </table>
                            </div>
                            <!--[if mso | IE]>
                            </td>
                          </tr>
                          <tr>
                            <td style="width:600px;">
                            <![endif]-->
                            <div style="margin:0px auto;max-width:600px;">
                              <table role="presentation" cellpadding="0" cellspacing="0" style="font-size:0px;width:100%;"
                              align="center" border="0">
                                <tbody>
                                  <tr>
                                    <td style="text-align:center;vertical-align:top;direction:ltr;font-size:0px;padding:0px;">
                                      <!--[if mso | IE]>
                                        <table role="presentation" border="0" cellpadding="0" cellspacing="0">
                                          <tr>
                                            <td style="vertical-align:top;width:600px;">
                                            <![endif]-->
                                            <div class="mj-column-per-100 outlook-group-fix" style="vertical-align:top;display:inline-block;direction:ltr;font-size:13px;text-align:left;width:100%;">
                                              <table role="presentation" cellpadding="0" cellspacing="0" width="100%" border="0">
                                                <tbody>
                                                  <tr>
                                                    <td style="word-wrap:break-word;font-size:0px;padding:0px;">
                                                      <div style="font-size:1px;line-height:48px;white-space:nowrap;"> </div>
                                                    </td>
                                                  </tr>
                                                </tbody>
                                              </table>
                                            </div>
                                            <!--[if mso | IE]>
                                            </td>
                                          </tr>
                                        </table>
                                      <![endif]-->
                                    </td>
                                  </tr>
                                </tbody>
                              </table>
                            </div>
                            <!--[if mso | IE]>
                            </td>
                          </tr>
                          <tr>
                            <td style="width:600px;">
                            <![endif]-->
                            <div style="margin:0px auto;max-width:600px;">
                              <table role="presentation" cellpadding="0" cellspacing="0" style="font-size:0px;width:100%;"
                              align="center" border="0">
                                <tbody>
                                  <tr>
                                    <td style="text-align:center;vertical-align:top;direction:ltr;font-size:0px;padding:0px;">
                                      <!--[if mso | IE]>
                                        <table role="presentation" border="0" cellpadding="0" cellspacing="0">
                                          <tr>
                                            <td style="vertical-align:top;width:600px;">
                                            <![endif]-->
                                            <div class="mj-column-per-100 outlook-group-fix" style="vertical-align:top;display:inline-block;direction:ltr;font-size:13px;text-align:left;width:100%;">
                                              <table role="presentation" cellpadding="0" cellspacing="0" width="100%" border="0">
                                                <tbody>
                                                  <tr>
                                                    <td style="word-wrap:break-word;font-size:0px;padding:0px;" align="left">
                                                      <div style="cursor:auto;color:#5d7079;font-family:TW-Averta-Regular, Averta, Helvetica, Arial;font-size:16px;line-height:24px;letter-spacing:0.4px;text-align:left;">
                                                        <p>Hello, ${user.account
                                                          .name || ""}</p>
                                                        <p class="hero">It’s time to confirm your email address.</p>
                                                        <p>Have we got the right email address to reach you on? To confirm that you can get
                                                          our emails, just click the button below.</p>
                                                        <p>
                                                          <a href="http://${url}/api/users/email_check?token=${
      user.emailCheck.token
    }&email=${
      user.email
    }" class="btn" mc:disable-tracking="">Confirm my email address</a>
                                                        </p>
                                                        <p>If you don’t know why you got this email, please tell us straight away so we can
                                                          fix this for you.</p>
                                                        <hr style="margin-top: 56px">
                                                        <p class="mb-0">Thanks,</p>
                                                        <p class="mb-0">The TransferWise Team</p>
                                                      </div>
                                                    </td>
                                                  </tr>
                                                </tbody>
                                              </table>
                                            </div>
                                            <!--[if mso | IE]>
                                            </td>
                                          </tr>
                                        </table>
                                      <![endif]-->
                                    </td>
                                  </tr>
                                </tbody>
                              </table>
                            </div>
                            <!--[if mso | IE]>
                            </td>
                          </tr>
                        </table>
                      <![endif]-->
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            <!--[if mso | IE]>
            </td>
          </tr>
        </table>
    </div>
  </body>

</html>`
  };
}

module.exports = confirmEmail;
