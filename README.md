# 🔐 Local-Authentication (React Native + Expo)

This project is a sample mobile application that demonstrates **Local Authentication**  
(Fingerprint / FaceID) with a complete Login / Sign Up flow and a simple Book CRUD system.

---

## 🚀 Features

- ✅ **Sign In / Sign Up** with email + password
- ✅ **JWT Token** stored in AsyncStorage
- ✅ **Biometric Authentication** (Fingerprint / FaceID)
- ✅ **Book Management (CRUD)**
  - View book list
  - Add / Edit / Delete books
- ✅ **Protected Routes** → redirect to Sign In if token is missing

---

## 📸 Screenshots

| Sign In | Sign Up | Book List | Add Book | Edit Book |
|--------|---------|-----------|---------|-----------|
| ![SignIn](./assets/signin.jpeg) | ![SignUp](./assets/signup.jpeg) | ![BookList](./assets/list.jpeg) | ![NewBook](./assets/new.jpeg) | ![EditBook](./assets/edit.jpeg) |

---

## 📦 Installation

```bash
# Clone the project
git clone https://github.com/Onpreeya-Jantakote/Local-Authentication.git

cd Local-Authentication

# Install dependencies
npm install

# Start development server
npx expo start
