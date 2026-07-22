import AuthForm from "../components/AuthForm.jsx";
import { useAuth } from "../context/AuthContext.jsx";

export default function Signup() {
  const { signUp } = useAuth();
  return (
    <AuthForm
      mode="signup"
      onSubmit={({ name, email, password }) => signUp(name, email, password)}
    />
  );
}
