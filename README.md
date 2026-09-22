Portfolio Builder

A full-stack portfolio builder where users can create, customize, publish, and manage a professional developer portfolio from a single dashboard.

✨ Overview

Portfolio Builder is a MERN-stack application designed to make creating a personal portfolio simple and flexible.

Users can:

Create and manage a personal portfolio

Add projects, skills, experience, education, certificates, and posts

Upload profile images and resumes

Customize portfolio theme/template and section visibility

Publish the portfolio with a unique public URL

Share the public portfolio without requiring the visitor to log in

Manage account authentication and security from the dashboard

The project also includes an Admin Panel for managing users and portfolios.

🧩 Main Features

👤 User Authentication

User registration

Email verification with OTP

Login / logout

JWT-based authentication

HTTP-only cookies

Refresh-token based session handling

Forgot password

Reset password using OTP

Change password

Protected routes and APIs

📝 Portfolio Builder

Users can manage:

Personal information

Headline and bio

Profile image

Contact details

Social links

Resume

SEO information



Section visibility

Supported portfolio sections:

About

Skills

Projects

Experience

Education

Certificates

Posts

Contact

💼 Projects

Each project can contain:

Project title

Description

Project image

Technologies

GitHub URL

Live/demo URL

Category

Featured status

Display order

Published status

🛠️ Skills

Users can add and manage their technical skills and control whether they are displayed on the public portfolio.

💻 Experience

Experience entries support details such as role, company, dates, and description while maintaining custom ordering and publication control.

🎓 Education

Education entries can be added and displayed as part of the public portfolio.

🏆 Certificates

Users can showcase certificates and control their visibility on the published portfolio.

✍️ Posts

The portfolio supports developer/blog-style posts with features such as:

Title

Slug

Excerpt

Full content

Cover image

Post type

Tags

Technologies

GitHub URL

Demo URL

External URL

Featured status

Published status

Publication date

View count

🌐 Public Portfolio

Once published, every portfolio gets a unique URL such as:

https://your-domain.com/portfolio/username-slug

The public portfolio can be opened without authentication and displays the published portfolio content.

🛡️ Admin Panel

The admin panel provides management functionality for:

Dashboard statistics

Users

User details

Activate/deactivate users

Delete users

Portfolios

Portfolio details

Portfolio statistics

Admin-only APIs are protected with role-based middleware.

🏗️ Tech Stack

Frontend

React

React Router

Axios

Tailwind CSS

Context API

Backend

Node.js

Express.js

MongoDB

Mongoose

JWT

Cookie Parser

Helmet

CORS

Storage / Services

Cloudinary for uploaded assets such as profile images and resumes

Email service for verification and password-reset OTPs

📁 Project Architecture

A simplified structure of the project:

Portfolio-Builder/
│
├── Client/
│   ├── public/
│   └── src/
│       ├── api/
│       ├── components/
│       ├── context/
│       ├── pages/
│       ├── routes/
│       └── ...
│
├── Server/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── services/
│   ├── utils/
│   └── ...
│
└── README.md

The application follows a modular structure so authentication, portfolio management, admin functionality, and content management remain separated.

🔄 How It Works

User Registration
       ↓
Email Verification
       ↓
Login
       ↓
Portfolio Dashboard
       ↓
Create Portfolio
       ↓
Add Portfolio Content
       ↓
Customize Portfolio
       ↓
Publish
       ↓
Generate Public URL
       ↓
Public Portfolio

🔐 Public Portfolio Flow

The public portfolio is intentionally separated from authenticated dashboard APIs.

Public URL
    ↓
/portfolio/:slug
    ↓
GET /api/portfolio/public/:slug
    ↓
Find published + active portfolio
    ↓
Fetch published portfolio content
    ↓
Render public portfolio

The public API returns portfolio data along with its published:

Projects
Skills
Experience
Education
Certificates
Posts

This allows visitors to view the complete published portfolio without logging in.

⚙️ Environment Variables

Create environment files for the frontend and backend according to your local setup.

Typical backend configuration includes values for:

PORT=8080
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
FRONTEND_URL=http://localhost:5173

CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

EMAIL_HOST=your_email_host
EMAIL_PORT=your_email_port
EMAIL_USER=your_email_user
EMAIL_PASS=your_email_password

Use your project's existing environment variable names when configuring deployment.

🚀 Installation

1. Clone the repository

git clone https://github.com/your-username/portfolio-builder.git
cd portfolio-builder

2. Install backend dependencies

cd Server
npm install

3. Configure backend environment variables

Create the required .env file and add your MongoDB, JWT, Cloudinary, email, and frontend configuration.

4. Install frontend dependencies

cd ../Client
npm install

5. Start the backend

npm run dev

6. Start the frontend

npm run dev

🧪 Development

For local development, run the frontend and backend separately and make sure the frontend API base URL points to the backend server.

The backend handles authentication, portfolio APIs, public portfolio APIs, uploads, and admin APIs.

The frontend handles the dashboard UI, portfolio builder, preview, public portfolio page, and admin interface.

📡 Important API Areas

Authentication

/api/auth/...

Portfolio

/api/portfolio/...

Public Portfolio

GET /api/portfolio/public/:slug

Admin

/api/admin/...

Admin APIs require authenticated admin access.

🎨 Portfolio Customization

The portfolio builder supports configurable presentation options including:

Theme

Template

Section visibility

Customization settings

Profile image

Resume

Social links

SEO metadata

This allows the same application to generate different personal portfolio presentations from the same underlying data.

🔒 Security

The application uses several security-focused practices:

JWT authentication

HTTP-only authentication cookies

Refresh-token session handling

Protected backend routes

Role-based admin authorization

CORS configuration

Helmet security middleware

Password reset flow with OTP

Sensitive authentication fields excluded from user queries where required

🌍 Deployment

The project can be deployed with the frontend and backend as separate services.

Example setup:

Frontend  → Vercel / Render / Netlify
Backend   → Render / Railway / VPS
Database  → MongoDB Atlas
Assets    → Cloudinary

Make sure production environment variables, CORS settings, cookie settings, and the frontend API URL are configured correctly before deployment.

📌 Future Improvements

Possible improvements for the project include:

Multiple portfolio templates

Drag-and-drop section ordering

Advanced analytics

Custom domains

Portfolio themes marketplace

Rich text editor improvements

Social sharing metadata previews

Public portfolio view analytics

More admin moderation tools

👨‍💻 Author

Subhadeep Garai

Full Stack Developer

Building • Learning • Shipping 🚀

⭐ Support

If this project helped you or you like the idea, consider giving the repository a ⭐ on GitHub.

📄 License

Add the license that you choose for this project before making the repository public.
LINK : https://myprotfolio-snowy.vercel.app
