export default function LoginPage() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-xl border border-gray-100">
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold mb-2">Welcome Back</h1>
                    <p className="text-gray-500">Enter your mobile number to get started</p>
                </div>

                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium mb-1 text-gray-700">Mobile Number</label>
                        <input
                            type="tel"
                            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
                            placeholder="+91 98765 43210"
                        />
                    </div>

                    <button className="w-full bg-primary text-white py-3 rounded-lg font-semibold hover:bg-black/90 transition-colors">
                        Continue requesting OTP
                    </button>
                </div>
            </div>
        </div>
    );
}
