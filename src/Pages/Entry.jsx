const Entry = () => {
    return (
        <div className="min-h-[80vh] flex flex-col items-center justify-center px-4 sm:px-6 py-16">
            <div className="max-w-2xl mx-auto text-center">

                {/* Logo mark */}
                <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-[#3931aa] flex items-center justify-center mx-auto mb-6">
                    <span className="text-white text-2xl sm:text-3xl font-bold">S</span>
                </div>

                <h1 className="text-3xl sm:text-5xl text-[#3931aa] uppercase font-bold tracking-wide mb-4">
                    S Bank
                </h1>

                <p className="text-gray-500 text-base sm:text-lg leading-relaxed mb-8 max-w-xl mx-auto">
                    Welcome to S Bank, your trusted financial partner. We offer a wide range of banking
                    services to meet your needs. Whether you're looking to open a new account, apply for
                    a loan, or manage your finances — we're here to help.
                </p>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                    <a href="/signup"
                        className="w-full sm:w-auto px-8 py-3 rounded-xl bg-[#3931aa] text-white font-semibold text-sm sm:text-base hover:bg-[#2e2890] active:scale-95 transition-all duration-200 text-center">
                        Get started
                    </a>
                    <a href="/login"
                        className="w-full sm:w-auto px-8 py-3 rounded-xl border border-[#3931aa] text-[#3931aa] font-semibold text-sm sm:text-base hover:bg-[#3931aa]/5 active:scale-95 transition-all duration-200 text-center">
                        Sign in
                    </a>
                </div>
            </div>
        </div>
    )
}

export default Entry