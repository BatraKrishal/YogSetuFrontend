import SignupForm from "@/components/auth/SignupForm";

export default function SignupPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[radial-gradient(ellipse_at_bottom_left,_var(--tw-gradient-stops))] from-orange-200 via-orange-50 to-white p-4">
      <div className="w-full max-w-md animate-in fade-in zoom-in duration-500">
        <SignupForm />
      </div>
    </div>
  );
}
