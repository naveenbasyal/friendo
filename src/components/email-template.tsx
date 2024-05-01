import * as React from "react";

interface EmailTemplateProps {
  username: string;
  verifyCode: string;
}

// export const EmailTemplate: React.FC<Readonly<EmailTemplateProps>> = ({
//   username,

//   verifyCode,
// }) => (
//   <div>
//     <h1>Welcome, {username}!</h1>
//     <p>
//       This is your verification code: <strong>{verifyCode}</strong>,
//     </p>
//   </div>
// );
export const EmailTemplate: React.FC<Readonly<EmailTemplateProps>> = ({
  username,
  verifyCode,
}) => {
  return (
    <html lang="en">
      <head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta httpEquiv="X-UA-Compatible" content="ie=edge" />
        <title>Friendo Email Template</title>
        <link
          href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600&display=swap"
          rel="stylesheet"
        />
      </head>
      <body
        style={{
          margin: 0,
          fontFamily: "Poppins, sans-serif",
          background: "#ffffff",
          fontSize: "14px",
        }}
      >
        <div
          style={{
            maxWidth: "680px",
            margin: "0 auto",
            padding: "45px 30px 60px",
            background: "#f4f7ff",
            backgroundImage:
              "url(https://archisketch-resources.s3.ap-northeast-2.amazonaws.com/vrstyler/1661497957196_595865/email-template-background-banner)",
            backgroundRepeat: "no-repeat",
            backgroundSize: "800px 452px",
            backgroundPosition: "top center",
            fontSize: "14px",
            color: "#434343",
          }}
        >
          <main>
            <div
              style={{
                margin: 0,
                marginTop: "70px",
                padding: "92px 30px 115px",
                background: "#ffffff",
                borderRadius: "30px",
                textAlign: "center",
              }}
            >
              <div
                style={{ width: "100%", maxWidth: "489px", margin: "0 auto" }}
              >
                <h1
                  style={{
                    margin: 0,
                    fontSize: "24px",
                    fontWeight: 500,
                    color: "#1f1f1f",
                  }}
                >
                  Your OTP
                </h1>
                <p
                  style={{
                    margin: 0,
                    marginTop: "17px",
                    fontSize: "16px",
                    fontWeight: 500,
                  }}
                >
                  Hey {username},
                </p>
                <p
                  style={{
                    margin: 0,
                    marginTop: "17px",
                    fontWeight: 500,
                    letterSpacing: "0.56px",
                  }}
                >
                  Thank you for choosing Friendo Company. Use the following OTP
                  to complete the procedure to change your email address. OTP is
                  valid for{" "}
                  <span style={{ fontWeight: 600, color: "#1f1f1f" }}>
                    1 hour
                  </span>
                  . Do not share this code with others, including Archisketch
                  employees.
                </p>
                <p
                  style={{
                    margin: 0,
                    marginTop: "60px",
                    fontSize: "40px",
                    fontWeight: 600,
                    letterSpacing: "25px",
                    color: "#ba3d4f",
                  }}
                >
                  {verifyCode}
                </p>
              </div>
            </div>
            <p
              style={{
                maxWidth: "400px",
                margin: "0 auto",
                marginTop: "90px",
                textAlign: "center",
                fontWeight: 500,
                color: "#8c8c8c",
              }}
            >
              Need help? Ask at{" "}
              <a
                href="mailto:archisketch@gmail.com"
                style={{ color: "#499fb6", textDecoration: "none" }}
              >
                naveenbasyal.001@gmail.com
              </a>{" "}
              or visit our{" "}
            </p>
          </main>
          <footer
            style={{
              width: "100%",
              maxWidth: "490px",
              margin: "20px auto 0",
              textAlign: "center",
              borderTop: "1px solid #e6ebf1",
            }}
          >
            <p
              style={{
                margin: 0,
                marginTop: "40px",
                fontSize: "16px",
                fontWeight: 600,
                color: "#434343",
              }}
            >
              Freindo Company
            </p>
            <p style={{ margin: 0, marginTop: "8px", color: "#434343" }}>
              Address: Nuhon Colony,Ropar, Punjab,India.
            </p>

            <p style={{ margin: 0, marginTop: "16px", color: "#434343" }}>
              Copyright © 2024 Friendo. All rights reserved.
            </p>
          </footer>
        </div>
      </body>
    </html>
  );
};
