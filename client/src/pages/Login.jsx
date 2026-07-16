import AuthForm from "../components/AuthForm.jsx";
import { useAuth } from "../context/AuthContext.jsx";

export default function Login() {
  const { signIn } = useAuth();
  return <AuthForm mode="login" onSubmit={({ email }) => signIn(email)} />;
}
