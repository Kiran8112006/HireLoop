# HireLoop 🎯

**A modern college hiring and placement portal** connecting students, recruiters, and placement teams in one unified workspace.

---

## What is HireLoop?

HireLoop streamlines the entire college recruitment process. Whether you're a student looking for your next opportunity, a recruiter searching for fresh talent, or a placement coordinator managing campus drives—HireLoop brings everything together in one seamless platform.

### For Students 👨‍🎓
- **Build Your Professional Profile**: Create a polished resume using 15+ professionally-designed templates
- **Showcase Your Work**: Upload portfolios, projects, transcripts, and links to your best work
- **Track Applications**: Monitor your job applications, interview schedules, and offer status in real-time
- **Prepare for Interviews**: Practice with AI-powered mock interviews tailored to your target roles
- **Secure Payments**: Premium features are available through secure Razorpay payments

### For Recruiters 💼
- **Review Student Profiles**: Access comprehensive student information, skills, projects, and transcripts in unified profiles
- **Manage Hiring Drives**: Organize campus recruitment drives and coordinate with placement teams
- **Track Candidates**: From shortlisting to offers, manage the entire candidate pipeline
- **Schedule Interviews**: Set up interviews, capture feedback, and track outcomes automatically
- **Export & Analyze**: Easily export CSV reports for further analysis

### For Placement Coordinators 🏢
- **Unified Workflow Management**: Track applications, interview rounds, feedback, and approvals in one place
- **Automated Notifications**: Students and recruiters receive instant updates on application status
- **Audit Trail**: Maintain complete records of all placements and decisions
- **Archive Outcomes**: Keep organized records of past recruitment drives and their results

---

## Key Features

✨ **Multi-Role Support**
- Dedicated portals for students, recruiters, admins, and placement teams

📄 **Smart Resume Builder**
- 15+ professionally-designed templates
- One-click template switching
- PDF export capability

🤖 **AI-Powered Mock Interviews**
- Practice with industry-specific questions
- Real-time feedback and performance analysis

🔍 **Advanced ATS System**
- Candidate screening and shortlisting
- Keyword-based matching
- Bulk CSV import for candidates

💳 **Secure Payments**
- Razorpay integration for premium features
- Multiple payment options

🔐 **Enterprise Security**
- Firebase authentication and authorization
- Role-based access control
- Data encryption

---

## Getting Started

### Prerequisites
- Node.js 16+ and npm
- Firebase project credentials
- Razorpay API keys

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/hireloop.git
   cd hireloop
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**
   
   Create a `.env.local` file with your credentials:
   ```env
   # Firebase
   NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_firebase_auth_domain
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_firebase_project_id
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_storage_bucket
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
   NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
   
   FIREBASE_PROJECT_ID=your_firebase_project_id
   FIREBASE_CLIENT_EMAIL=your_firebase_client_email
   FIREBASE_PRIVATE_KEY=your_firebase_private_key
   
   # Razorpay
   TEST_API_KEY=your_razorpay_api_key
   TEST_KEY_SECRET=your_razorpay_key_secret
   
   # Google Generative AI (for mock interviews)
   GOOGLE_API_KEY=your_google_api_key
   ```

4. **Run the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to `http://localhost:3000`

---

## Project Structure

```
hireloop/
├── src/
│   ├── app/                    # Next.js app routes
│   │   ├── admin/             # Admin dashboard
│   │   ├── auth/              # Authentication pages
│   │   ├── recruiter/         # Recruiter portal
│   │   ├── student/           # Student dashboard
│   │   ├── payment/           # Payment processing
│   │   └── resume-builder/    # Resume building interface
│   ├── components/
│   │   ├── forms/             # Resume form components
│   │   ├── resume-templates/  # 15+ resume designs
│   │   └── ui/                # Shared UI components
│   ├── lib/                   # Firebase, auth, API utilities
│   └── styles/                # Tailwind CSS & custom styles
├── backend/
│   ├── server.js              # Express server & payment handling
│   ├── ats.js                 # ATS system logic
│   ├── mockinterview.js       # Mock interview features
│   └── uploads/               # Resume & file uploads
└── public/                    # Static assets
```

---

## Technology Stack

### Frontend
- **Next.js** - React framework for production
- **React** - UI library
- **TypeScript** - Static typing
- **Tailwind CSS** - Utility-first CSS framework
- **Lucide React** - Icon library

### Backend
- **Express.js** - Node.js web framework
- **Firebase** - Authentication, database, & storage
- **Firebase Admin SDK** - Server-side operations

### Payment & Integration
- **Razorpay** - Secure payment processing
- **Google Generative AI** - AI-powered mock interviews
- **Multer** - File upload handling

### Database & Storage
- **Firebase Realtime Database** - Data storage
- **Firebase Storage** - File storage

---

## Available Scripts

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

---

## User Guides

### For Students
1. Sign up or log in to your student account
2. Complete your profile with basic information
3. Choose a resume template and fill in your details
4. Upload your portfolio and links
5. Browse available job postings and apply
6. Track your applications and upcoming interviews
7. Practice with mock interviews before your big day

### For Recruiters
1. Log in to your recruiter account
2. Create a new hiring drive or select an ongoing one
3. View student profiles and shortlist candidates
4. Schedule interviews through the platform
5. Provide feedback and make hiring decisions
6. Export reports for your records

### For Admins
1. Access the admin dashboard
2. Manage users and permissions
3. View system analytics and reports
4. Configure recruitment drives
5. Monitor platform activity

---

## Contributing

We welcome contributions! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/your-feature`)
3. Commit your changes (`git commit -m 'Add your feature'`)
4. Push to the branch (`git push origin feature/your-feature`)
5. Open a Pull Request

---

## Support & FAQ

**Q: How do I reset my password?**
A: Click "Forgot Password" on the login page and follow the email instructions.

**Q: Is my data secure?**
A: Yes, HireLoop uses Firebase's enterprise-grade security with encryption and role-based access control.

**Q: What resume templates are available?**
A: We offer 15+ professionally-designed templates including classic, modern, creative, and ATS-friendly designs.

**Q: How do I upgrade to premium features?**
A: Navigate to the payment section in your dashboard and select a premium plan.

---

## License

This project is proprietary and confidential.

---

## Contact & Support

For issues, questions, or feedback:
- 📧 Email: support@hireloop.com
- 🐛 GitHub Issues: [Create an issue](https://github.com/yourusername/hireloop/issues)

---

**Ready to transform your campus recruiting? [Get Started Now →](http://localhost:3000)**
