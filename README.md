# CampusChain – Blockchain-Based Student Attendance Management System

CampusChain is a web-based student attendance management system that uses blockchain technology to provide transparent, secure, and verifiable attendance records.

The system allows faculty members to create attendance sessions, students to mark attendance using QR codes, and administrators to monitor attendance records and verify blockchain transactions.

## Key Features

- **Role-Based Authentication:** Separate access for Students, Faculty, and Admin.
- **QR Code Attendance:** Students can mark attendance by scanning session QR codes.
- **Faculty Approval:** Faculty members can review and approve submitted attendance.
- **Blockchain Verification:** Approved attendance records are recorded on the blockchain.
- **Admin Dashboard:** Monitor attendance statistics and blockchain transactions.
- **Secure Authentication:** Password hashing and JWT-based authentication.

## Technology Stack

| Component | Technologies |
|---|---|
| Frontend | React.js, Vite, Tailwind CSS |
| Backend | Node.js, Express.js |
| Database | MongoDB Atlas |
| Blockchain | Solidity, Hardhat |
| Blockchain Interaction | Ethers.js |
| Authentication | JWT, bcryptjs |
| Development Tools | VS Code, Postman, Git |

## Project Structure

```text
Blockchain-Student-Attendance-System/
│
├── backend/
│   ├── app/
│   ├── authorizeLocalFaculty.js
│   ├── createAdmin.js
│   └── server.js
│
├── blockchain/
│   ├── contracts/
│   ├── scripts/
│   ├── test/
│   └── hardhat.config.ts
│
├── frontend/
│   ├── src/
│   └── public/
│
├── docs/
├── .gitignore
└── README.md
```

## Attendance Workflow

1. Faculty logs into the system.
2. Faculty creates an attendance session and generates a QR code.
3. Students scan the QR code and submit attendance.
4. Faculty reviews and approves attendance submissions.
5. Approved attendance is recorded on the blockchain.
6. Admin monitors and verifies blockchain transactions.

## Installation and Setup

### 1. Clone the Repository

```bash
git clone YOUR_GITHUB_REPOSITORY_URL
cd Blockchain-Student-Attendance-System
```

### 2. Backend Setup

```bash
cd backend
npm install
```

Configure the required environment variables in your local `.env` file.

Start the backend:

```bash
npm run dev
```

### 3. Frontend Setup

Open another terminal:

```bash
cd frontend
npm install
npm run dev
```

### 4. Blockchain Setup

Open another terminal:

```bash
cd blockchain
npm install
```

Configure the required blockchain environment variables locally before deploying or connecting to a network.

## Security

- Environment files and private keys must never be committed to GitHub.
- Passwords are hashed before storage.
- Authentication uses JWT.
- Blockchain transactions provide verifiable attendance records.

## Project Status

Core frontend, backend, database, and local blockchain attendance workflows have been developed and tested.

Public deployment and production blockchain configuration are planned as subsequent steps.

## Future Enhancements

- Public testnet deployment.
- Live attendance analytics and reports.
- Improved mobile responsiveness.
- Additional security and audit features.

## Author

**Yashashree Chavan**

B.E. Computer Science Engineering
Dnyanshree Institute of Engineering & Technology
Graduation Year: 2026

**Project:** CampusChain – Blockchain-Based Student Attendance Management System
