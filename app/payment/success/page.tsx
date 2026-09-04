export default function PaymentSuccessPage() {
  return (
    <main className="min-h-screen bg-[#14181c] flex items-center justify-center text-white">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-[#00e054]">
          Test payment verified
        </h1>
        <p className="mt-3 text-[#9ab]">
          Razorpay signature verification was successful.
        </p>
      </div>
    </main>
  );
}