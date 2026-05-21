import logo from '../assets/codelens-logo.png';

function CodeLensLogo({
    size = 40,
    showText = true,
    className = '',
}) {
    return (
        <div className={`flex items-center gap-3 ${className}`}>
            <img
                src={logo}
                alt="CodeLens AI Logo"
                style={{
                    width: `${size}px`,
                    height: `${size}px`,
                }}
                className="rounded-xl object-contain"
            />

            {showText && (
                <div className="leading-tight">
                    <h1 className="text-lg font-bold tracking-tight text-white">
                        CodeLens AI
                    </h1>
                    <p className="text-xs text-slate-400">
                        Repository Intelligence
                    </p>
                </div>
            )}
        </div>
    );
}

export default CodeLensLogo;