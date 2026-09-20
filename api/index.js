

import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import nodemailer from "nodemailer";

dotenv.config();

const app = express();

app.use(
  cors({
    origin: [
      "http://localhost:5173",

      // Production domains
      "https://superguardisleworth.uk",
      "https://www.superguardisleworth.uk",
      "https://superguard-westwickham-frontend.vercel.app",
    ],
    credentials: true,
  })
);

app.use(express.json());

// app.get("/", (req, res) => {
//   res.send("SuperGuard  isleworth Backend Server Running");
// });

/* ==========================================================
   BRAND CONFIG
========================================================== */

const BRAND_NAME = "SuperGuard isleworth Pest Control ";

const BRAND_PRIMARY = "#5E50B5";
const BRAND_PRIMARY_DARK = "#4C4098";
const BRAND_LIGHT = "#F7F6FF";
const BRAND_WHITE = "#FFFFFF";
const BRAND_TEXT = "#1F2937";
const BRAND_MUTED = "#64748B";

/* ==========================================================
   MAIL TRANSPORTER
========================================================== */

const createTransporter = () => {
  return nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });
};

/* ==========================================================
   CONTACT FORM
========================================================== */

app.post("/api/contact", async (req, res) => {
  try {
    const {
      name,
      email,
      phone,
      postcode,
      service,
      message,
    } = req.body;

    if (!name || !email || !phone || !postcode || !message) {
      return res.status(400).json({
        success: false,
        message:
          "Name, email, phone number, postcode and message are required",
      });
    }

    const transporter = createTransporter();

    const info = await transporter.sendMail({
      from: `"${BRAND_NAME}" <${process.env.EMAIL_USER}>`,
      to: process.env.RECEIVER_EMAIL,
      replyTo: email,

      // subject: `${BRAND_NAME} | New Website Enquiry`,

      subject: `${BRAND_NAME} | New Website Enquiry | ${name} | #${Date.now()}`,

      text: `
New Website Enquiry

Business : ${BRAND_NAME}

Name      : ${name}
Email     : ${email}
Phone     : ${phone}
Postcode  : ${postcode}
Service   : ${service || "Not Selected"}

Message

${message}
      `,

      html: `
<div style="
font-family:Arial,sans-serif;
background:${BRAND_LIGHT};
padding:40px;
">

<div style="
max-width:680px;
margin:auto;
background:${BRAND_WHITE};
border-radius:20px;
overflow:hidden;
box-shadow:0 15px 45px rgba(0,0,0,.08);
">

<!-- HEADER -->

<div
style="
background:linear-gradient(135deg,${BRAND_PRIMARY_DARK},${BRAND_PRIMARY});
padding:36px;
text-align:center;
">

<h1
style="
margin:0;
font-size:30px;
font-weight:800;
color:white;
">
New Website Enquiry
</h1>

<p
style="
margin-top:10px;
font-size:15px;
font-weight:600;
color:#EAE7FF;
">
${BRAND_NAME}
</p>

</div>

<!-- BODY -->

<div
style="
padding:35px;
color:${BRAND_TEXT};
">

<div
style="
background:${BRAND_LIGHT};
padding:18px;
border-radius:14px;
margin-bottom:14px;
">

<div
style="
font-size:12px;
font-weight:700;
color:${BRAND_MUTED};
">
Customer Name
</div>

<div
style="
font-size:18px;
font-weight:700;
margin-top:5px;
">
${name}
</div>

</div>

<div
style="
background:${BRAND_LIGHT};
padding:18px;
border-radius:14px;
margin-bottom:14px;
">

<div
style="
font-size:12px;
font-weight:700;
color:${BRAND_MUTED};
">
Email Address
</div>

<div
style="
font-size:17px;
font-weight:600;
margin-top:5px;
">
<a
href="mailto:${email}"
style="
color:${BRAND_PRIMARY};
text-decoration:none;
">
${email}
</a>
</div>

</div>

<div
style="
background:${BRAND_LIGHT};
padding:18px;
border-radius:14px;
margin-bottom:14px;
">

<div
style="
font-size:12px;
font-weight:700;
color:${BRAND_MUTED};
">
Phone Number
</div>

<div
style="
font-size:17px;
font-weight:700;
margin-top:5px;
">
<a
href="tel:${phone}"
style="
color:${BRAND_PRIMARY};
text-decoration:none;
">
${phone}
</a>
</div>

</div>

<div
style="
background:${BRAND_LIGHT};
padding:18px;
border-radius:14px;
margin-bottom:14px;
">

<div
style="
font-size:12px;
font-weight:700;
color:${BRAND_MUTED};
">
Postcode
</div>

<div
style="
font-size:17px;
font-weight:700;
margin-top:5px;
">
${postcode}
</div>

</div>

<div
style="
background:${BRAND_LIGHT};
padding:18px;
border-radius:14px;
margin-bottom:20px;
">

<div
style="
font-size:12px;
font-weight:700;
color:${BRAND_MUTED};
">
Requested Service
</div>

<div
style="
font-size:17px;
font-weight:700;
margin-top:5px;
">
${service || "Not Selected"}
</div>

</div>

<h3
style="
margin:30px 0 12px;
font-size:18px;
font-weight:700;
color:${BRAND_TEXT};
">
Customer Message
</h3>

<div
style="
background:${BRAND_LIGHT};
padding:24px;
border-radius:16px;
border-left:5px solid ${BRAND_PRIMARY};
line-height:1.8;
font-size:15px;
color:${BRAND_TEXT};
">
${message}
</div>

</div>

<!-- FOOTER -->

<div
style="
background:${BRAND_PRIMARY_DARK};
padding:24px;
text-align:center;
">

<p
style="
margin:0;
color:white;
font-size:13px;
font-weight:600;
">
This enquiry was submitted from the official
<strong>${BRAND_NAME}</strong>
website.
</p>

</div>

</div>

</div>
`,
    });

    console.log("CONTACT MAIL SENT:", info.messageId);
    console.log("CONTACT ACCEPTED:", info.accepted);
    console.log("CONTACT REJECTED:", info.rejected);

    return res.status(200).json({
      success: true,
      message: "Message sent successfully",
      messageId: info.messageId,
      accepted: info.accepted,
      rejected: info.rejected,
    });

  } catch (error) {

    console.error("Contact Email Error:", error);

    return res.status(500).json({
      success: false,
      message: "Email sending failed",
      error: error.message,
    });

  }
});

/* ==========================================================
   CALLBACK FORM
========================================================== */

app.post("/api/callback", async (req, res) => {
  try {
    const {
      name,
      postcode,
      phone,
    } = req.body;

    if (!name || !postcode || !phone) {
      return res.status(400).json({
        success: false,
        message:
          "Name, postcode and phone number are required.",
      });
    }

    const transporter = createTransporter();

    const info = await transporter.sendMail({
      from: `"${BRAND_NAME}" <${process.env.EMAIL_USER}>`,
      to: process.env.RECEIVER_EMAIL,

      // subject: `${BRAND_NAME} | Callback Request`,

      subject: `${BRAND_NAME} | Callback Request | ${name} | #${Date.now()}`,

      text: `
New Callback Request

Business : ${BRAND_NAME}

Name      : ${name}
Postcode  : ${postcode}
Phone     : ${phone}
`,

      html: `
<div
style="
font-family:Arial,sans-serif;
background:${BRAND_LIGHT};
padding:40px;
">

<div
style="
max-width:680px;
margin:auto;
background:white;
border-radius:20px;
overflow:hidden;
box-shadow:0 15px 45px rgba(0,0,0,.08);
">

<div
style="
background:linear-gradient(135deg,${BRAND_PRIMARY_DARK},${BRAND_PRIMARY});
padding:36px;
text-align:center;
">

<h1
style="
margin:0;
font-size:30px;
font-weight:800;
color:white;
">
New Callback Request
</h1>

<p
style="
margin-top:10px;
color:#ECE8FF;
font-size:15px;
font-weight:600;
">
${BRAND_NAME}
</p>

</div>

<div
style="
padding:35px;
">

<div
style="
background:${BRAND_LIGHT};
padding:18px;
border-radius:14px;
margin-bottom:14px;
">

<div
style="
font-size:12px;
font-weight:700;
color:${BRAND_MUTED};
">
Customer Name
</div>

<div
style="
font-size:18px;
font-weight:700;
margin-top:5px;
color:${BRAND_TEXT};
">
${name}
</div>

</div>

<div
style="
background:${BRAND_LIGHT};
padding:18px;
border-radius:14px;
margin-bottom:14px;
">

<div
style="
font-size:12px;
font-weight:700;
color:${BRAND_MUTED};
">
Postcode
</div>

<div
style="
font-size:18px;
font-weight:700;
margin-top:5px;
color:${BRAND_TEXT};
">
${postcode}
</div>

</div>

<div
style="
background:${BRAND_LIGHT};
padding:18px;
border-radius:14px;
margin-bottom:14px;
">

<div
style="
font-size:12px;
font-weight:700;
color:${BRAND_MUTED};
">
Phone Number
</div>

<div
style="
font-size:18px;
font-weight:700;
margin-top:5px;
">
<a
href="tel:${phone}"
style="
color:${BRAND_PRIMARY};
text-decoration:none;
">
${phone}
</a>
</div>

</div>

</div>

<div
style="
background:${BRAND_PRIMARY_DARK};
padding:24px;
text-align:center;
">

<p
style="
margin:0;
color:white;
font-size:13px;
font-weight:600;
">
Automated callback notification from
<strong>${BRAND_NAME}</strong>.
</p>

</div>

</div>

</div>
`,
    });

    return res.status(200).json({
      success: true,
      message: "Call back request sent successfully!",
      messageId: info.messageId,
      accepted: info.accepted,
      rejected: info.rejected,
    });

  } catch (error) {
    console.error("Callback Email Error:", error);

    return res.status(500).json({
      success: false,
      message: "Email sending failed",
      error: error.message,
    });
  }
});

const PORT = process.env.PORT || 5000;

// app.listen(PORT, () => {
//   console.log(`${BRAND_NAME} server running on port ${PORT}`);
// });

export default app;